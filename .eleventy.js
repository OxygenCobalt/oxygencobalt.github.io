module.exports = function (eleventyConfig) {
    // Copy assets directly to output
    eleventyConfig.addPassthroughCopy({ "core/res": "res" });
    eleventyConfig.addPassthroughCopy({ "core/src/styles": "styles" });
    eleventyConfig.addPassthroughCopy({ "core/src/scripts": "scripts" });
    eleventyConfig.addPassthroughCopy({ "content/res": "res" });
    eleventyConfig.addPassthroughCopy({ "content/src/styles": "styles" });
    eleventyConfig.addPassthroughCopy({ "content/src/scripts": "scripts" });

    // Watch CSS files for changes during serve
    eleventyConfig.setUseGitIgnore(false);
    eleventyConfig.setWatchJavaScriptDependencies(false);
    eleventyConfig.addWatchTarget("core/**/*");
    eleventyConfig.addWatchTarget("content/**/*");
    eleventyConfig.addWatchTarget("!*/**/partial.*");

    // Add blog collection
    eleventyConfig.addCollection("blog", function (collectionApi) {
        return collectionApi.getFilteredByTag("blog")
            .filter(post => !post.data.isPartial)
            .sort((a, b) => a.date - b.date);
    });

    // Add date filter for formatting dates
    eleventyConfig.addFilter("date", function (date, format) {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        return new Date(date).toLocaleDateString('en-US', options);
    });

    // Add filter to get post title by slug
    eleventyConfig.addFilter("getPostTitleBySlug", function (slug, collections) {
        const post = collections.blog.find(post => {
            const postSlug = post.fileSlug;
            return postSlug === slug;
        });
        return post ? post.data.title : "Post";
    });

    // Add shortcode for checking active state
    eleventyConfig.addShortcode("isActive", function (currentPage, itemUrl) {
        return currentPage === itemUrl ? "active" : "";
    });

    // Generate partial layouts and partials from content files
    const fs = require('fs');
    const path = require('path');
    const matter = require('gray-matter');

    // Function to generate partial layout files
    function generatePartialLayouts() {
        const layoutsDir = path.join(__dirname, 'core/src/layouts');
        
        // Read all layout files
        const layoutFiles = fs.readdirSync(layoutsDir).filter(file => {
            // Exclude partial layouts and scaffold
            return file.endsWith('.njk') && 
                   !file.includes('partial') && 
                   file !== 'scaffold.njk';
        });
        
        // Process each layout file
        for (const layoutFile of layoutFiles) {
            const layoutPath = path.join(layoutsDir, layoutFile);
            const layoutContent = fs.readFileSync(layoutPath, 'utf8');
            
            // Parse frontmatter
            const { data, content } = matter(layoutContent);
            
            // Remove 'layout' from frontmatter
            delete data.layout;
            
            // Create the partial layout name
            const partialLayoutName = `partial.${layoutFile}`;
            const partialLayoutPath = path.join(layoutsDir, partialLayoutName);
            
            // Create the partial layout content without scaffold inheritance
            const partialLayoutContent = matter.stringify(content, data);
            
            // Write the partial layout file
            fs.writeFileSync(partialLayoutPath, partialLayoutContent);
        }
    }

    // Function to generate partials from content files
    function generateContentPartials() {
        const contentDir = path.join(__dirname, 'content/src');

        // Read all files in content directory recursively
        function readDirRecursively(dir) {
            let results = [];
            const list = fs.readdirSync(dir, { withFileTypes: true });

            for (const file of list) {
                const fullPath = path.join(dir, file.name);

                if (file.isDirectory()) {
                    results = results.concat(readDirRecursively(fullPath));
                } else if (file.name.endsWith('.md') && !file.name.startsWith('partial.')) {
                    results.push(fullPath);
                }
            }

            return results;
        }

        const contentFiles = readDirRecursively(contentDir);

        // Process each content file
        for (const filePath of contentFiles) {
            const fileContent = fs.readFileSync(filePath, 'utf8');

            // Parse frontmatter
            const { data, content } = matter(fileContent);
            
            // Get the directory and filename
            const fileDir = path.dirname(filePath);
            const fileName = path.basename(filePath);
            
            // Create the partial filename with partial. prefix
            const partialFileName = `partial.${fileName}`;
            const partialPath = path.join(fileDir, partialFileName);
            
            // Determine the partial URL
            let partialUrl;
            if (data.permalink) {
                // Use the same URL structure but with /partials prefix
                let permalinkPath = data.permalink;

                // Remove trailing slash if present
                if (permalinkPath.endsWith('/')) {
                    permalinkPath = permalinkPath.slice(0, -1);
                }

                partialUrl = `/partials${permalinkPath}/`;
            } else {
                // Get the relative path from content directory for URL construction
                const relativePath = path.relative(contentDir, filePath);
                const relativeDir = path.dirname(relativePath);
                const baseName = path.basename(filePath, '.md');
                
                const dirPart = relativeDir !== '.' ? `/${relativeDir}` : '';
                partialUrl = `/partials${dirPart}/${baseName}/`;
            }

            // Create new frontmatter with all original properties
            const partialFrontmatter = { ...data };
            
            // If layout is defined, update to use the partial layout
            if (partialFrontmatter.layout) {
                // Replace layout with partial version
                partialFrontmatter.layout = `partial.${partialFrontmatter.layout}`;
            }
            
            partialFrontmatter.isPartial = true;
            partialFrontmatter.permalink = partialUrl; // Set new permalink

            // Convert frontmatter to YAML string
            const yamlFrontmatter = matter.stringify('', partialFrontmatter).trim();

            // Create the partial content with frontmatter and original content
            const partialContent = `${yamlFrontmatter}
${content}`;

            // Write the partial file
            fs.writeFileSync(partialPath, partialContent);
        }
    }

    // Function to run all generation steps
    function generatePartials() {
        // First generate partial layouts
        generatePartialLayouts();
        // Then generate content partials
        generateContentPartials();
    }

    // Run before the build starts
    eleventyConfig.on('beforeBuild', generatePartials);

    // Also run on --serve for live updates
    eleventyConfig.on('beforeWatch', generatePartials);

    return {
        dir: {
            input: "content",
            output: "site",
            data: "data",
            layouts: "../core/src/layouts",
            includes: "../core/src/includes"
        }
    };
};
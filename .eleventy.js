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
    eleventyConfig.addWatchTarget("content/**/*");
    eleventyConfig.addWatchTarget("core/**/*");
    eleventyConfig.addWatchTarget("!content/build/**/*");

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

    // Generate partials from content files
    const fs = require('fs');
    const path = require('path');
    const matter = require('gray-matter');

    // Function to generate partials from content files
    function generatePartials() {
        const contentDir = path.join(__dirname, 'content/src');
        const partialsDir = path.join(__dirname, 'content/build/partials');

        // Create partials directory if it doesn't exist
        if (!fs.existsSync(partialsDir)) {
            fs.mkdirSync(partialsDir, { recursive: true });
        }

        // Read all files in content directory recursively
        function readDirRecursively(dir) {
            let results = [];
            const list = fs.readdirSync(dir, { withFileTypes: true });

            for (const file of list) {
                const fullPath = path.join(dir, file.name);

                if (file.isDirectory()) {
                    // Skip the partials directory (no longer needed as partials are outside content)aa
                    results = results.concat(readDirRecursively(fullPath));
                } else if (file.name.endsWith('.md')) {
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

            // Get the relative path from content directory
            const relativePath = path.relative(contentDir, filePath);
            const relativeDir = path.dirname(relativePath);

            // Get the base name without extension
            const baseName = path.basename(filePath, '.md');

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
                const dirPart = relativeDir !== '.' ? `/${relativeDir}` : '';
                partialUrl = `/partials${dirPart}/${baseName}/`;
            }

            // Create corresponding partial directory if it doesn't exist
            const partialDir = path.join(partialsDir, relativeDir);
            if (!fs.existsSync(partialDir)) {
                fs.mkdirSync(partialDir, { recursive: true });
            }

            // Create corresponding partial
            const partialPath = path.join(partialDir, path.basename(filePath));

            // Create new frontmatter with all original properties except 'layout'
            const partialFrontmatter = { ...data };
            if (partialFrontmatter.layout === "blog-post.njk") {
                partialFrontmatter.layout = "blog-partial.njk"
            } else {
                delete partialFrontmatter.layout;
            }
            partialFrontmatter.isPartial = true
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
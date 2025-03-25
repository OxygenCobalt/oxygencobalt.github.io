module.exports = function(eleventyConfig) {
    // Copy assets directly to output
    eleventyConfig.addPassthroughCopy("src/assets");
    
    
    // Watch CSS files for changes during serve
    eleventyConfig.setUseGitIgnore(false);
    eleventyConfig.setWatchJavaScriptDependencies(false);
    eleventyConfig.addWatchTarget("src/content/**/*.md");
    eleventyConfig.addWatchTarget("!src/content/partials/**");
    eleventyConfig.addWatchTarget("src/assets/styles/");
    eleventyConfig.addWatchTarget("src/assets/scripts/");
    
    // Add shortcode for checking active state
    eleventyConfig.addShortcode("isActive", function(currentPage, itemUrl) {
        return currentPage === itemUrl ? "active" : "";
    });

    // Generate partials from content files
    const fs = require('fs');
    const path = require('path');
    const matter = require('gray-matter');

    // Function to generate partials from content files
    function generatePartials() {
        const contentDir = path.join(__dirname, 'src/content');
        const partialsDir = path.join(__dirname, 'src/content/partials');
        
        // Create partials directory if it doesn't exist
        if (!fs.existsSync(partialsDir)) {
            fs.mkdirSync(partialsDir, { recursive: true });
        }
        
        // Read all files in content directory
        const contentFiles = fs.readdirSync(contentDir, { withFileTypes: true })
            .filter(dirent => !dirent.isDirectory() && dirent.name.endsWith('.md'));
        
        // Process each content file
        for (const file of contentFiles) {
            const filePath = path.join(contentDir, file.name);
            
            // Skip if the file is in the partials directory
            if (filePath.includes('partials')) continue;
            
            const fileContent = fs.readFileSync(filePath, 'utf8');
            
            // Parse frontmatter
            const { data, content } = matter(fileContent);
            
            // Get the base name without extension
            const baseName = path.basename(file.name, '.md');
            
            // Determine the partial URL
            let partialUrl;
            if (data.permalink) {
                // Extract the path from the permalink
                let permalinkPath = data.permalink;
                // Remove trailing slash if present
                if (permalinkPath.endsWith('/')) {
                    permalinkPath = permalinkPath.slice(0, -1);
                }
                partialUrl = `/partials${permalinkPath}/`;
            } else {
                partialUrl = `/partials/${baseName}/`;
            }
            
            // Create corresponding partial
            const partialPath = path.join(partialsDir, file.name);
            
            // Create new frontmatter for partial
            const partialContent = `---
permalink: ${partialUrl}
---
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
            input: "src",
            output: "_site",
            includes: "_includes",
            data: "_data",
            layouts: "_includes"
        }
    };
};
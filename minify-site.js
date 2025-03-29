const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const cssnano = require('cssnano');
const { minify } = require('terser');
const { glob } = require('glob');

// Configuration
const siteDir = path.join(__dirname, 'site');
const cssGlob = path.join(siteDir, '**/*.css');
const jsGlob = path.join(siteDir, '**/*.js');

async function minifyCSS(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const result = await postcss([cssnano({
            preset: ['default', {
                discardComments: { removeAll: true },
                normalizeWhitespace: true
            }]
        })]).process(content, { from: undefined });
        fs.writeFileSync(filePath, result.css);
        return true;
    } catch (error) {
        console.error(`Error minifying CSS at ${filePath}:`, error);
        return false;
    }
}

async function minifyJS(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const result = await minify(content, {
            compress: true,
            mangle: true
        });
        fs.writeFileSync(filePath, result.code);
        return true;
    } catch (error) {
        console.error(`Error minifying JS at ${filePath}:`, error);
        return false;
    }
}

async function processFiles() {
    // Track counts for reporting
    let stats = {
        css: { processed: 0, success: 0 },
        js: { processed: 0, success: 0 }
    };

    // Process CSS files
    console.log('Minifying CSS files...');
    const cssFiles = await glob(cssGlob);
    for (const file of cssFiles) {
        stats.css.processed++;
        const success = await minifyCSS(file);
        if (success) stats.css.success++;
    }

    // Process JS files
    console.log('Minifying JS files...');
    const jsFiles = await glob(jsGlob);
    for (const file of jsFiles) {
        // Skip files that may be from node_modules or third-party libs
        if (file.includes('node_modules')) continue;
        
        stats.js.processed++;
        const success = await minifyJS(file);
        if (success) stats.js.success++;
    }

    // Report results
    console.log('\nMinification completed:');
    console.log(`CSS: ${stats.css.success}/${stats.css.processed} files minified`);
    console.log(`JS: ${stats.js.success}/${stats.js.processed} files minified`);
}

// Run the minification process
processFiles().catch(err => {
    console.error('Minification failed:', err);
    process.exit(1);
}); 
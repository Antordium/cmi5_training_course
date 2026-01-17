/**
 * Build script for PCTE Training RPG
 *
 * This script:
 * 1. Copies all static files to dist/
 * 2. Obfuscates course-content.js to protect the test bank
 * 3. Creates a separate obfuscated quiz-data.js for remote loading
 */

const fs = require('fs');
const path = require('path');
const JavaScriptObfuscator = require('javascript-obfuscator');

const SRC_DIR = __dirname;
const DIST_DIR = path.join(__dirname, 'dist');

// Files to copy directly (not obfuscated)
const STATIC_FILES = [
    'index.html',
    'styles.css',
    'cmi5.js',
    'cmi5.xml'
];

// Directories to copy
const STATIC_DIRS = [
    'images',
    'videos',
    'audio'
];

// Obfuscation options for test bank (high protection)
const OBFUSCATION_OPTIONS = {
    compact: true,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 0.75,
    deadCodeInjection: true,
    deadCodeInjectionThreshold: 0.4,
    debugProtection: false,
    disableConsoleOutput: false,
    identifierNamesGenerator: 'hexadecimal',
    log: false,
    numbersToExpressions: true,
    renameGlobals: false,
    selfDefending: true,
    simplify: true,
    splitStrings: true,
    splitStringsChunkLength: 10,
    stringArray: true,
    stringArrayCallsTransform: true,
    stringArrayCallsTransformThreshold: 0.75,
    stringArrayEncoding: ['base64'],
    stringArrayIndexShift: true,
    stringArrayRotate: true,
    stringArrayShuffle: true,
    stringArrayWrappersCount: 2,
    stringArrayWrappersChainedCalls: true,
    stringArrayWrappersParametersMaxCount: 4,
    stringArrayWrappersType: 'function',
    stringArrayThreshold: 0.75,
    transformObjectKeys: true,
    unicodeEscapeSequence: false
};

// Light obfuscation for game.js (needs to be readable for debugging)
const LIGHT_OBFUSCATION_OPTIONS = {
    compact: true,
    controlFlowFlattening: false,
    deadCodeInjection: false,
    debugProtection: false,
    disableConsoleOutput: false,
    identifierNamesGenerator: 'hexadecimal',
    log: false,
    numbersToExpressions: false,
    renameGlobals: false,
    selfDefending: false,
    simplify: true,
    splitStrings: false,
    stringArray: true,
    stringArrayEncoding: ['base64'],
    stringArrayThreshold: 0.5,
    transformObjectKeys: false,
    unicodeEscapeSequence: false
};

function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

function copyFile(src, dest) {
    fs.copyFileSync(src, dest);
    console.log(`Copied: ${path.basename(src)}`);
}

function copyDir(src, dest) {
    ensureDir(dest);
    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            copyFile(srcPath, destPath);
        }
    }
}

function obfuscateFile(srcPath, destPath, options) {
    const code = fs.readFileSync(srcPath, 'utf8');
    const obfuscated = JavaScriptObfuscator.obfuscate(code, options);
    fs.writeFileSync(destPath, obfuscated.getObfuscatedCode());
    console.log(`Obfuscated: ${path.basename(srcPath)}`);
}

function extractAndObfuscateTestBank() {
    // Read course-content.js
    const contentPath = path.join(SRC_DIR, 'course-content.js');
    const content = fs.readFileSync(contentPath, 'utf8');

    // Create obfuscated version of the full course content
    const obfuscated = JavaScriptObfuscator.obfuscate(content, OBFUSCATION_OPTIONS);
    fs.writeFileSync(
        path.join(DIST_DIR, 'course-content.js'),
        obfuscated.getObfuscatedCode()
    );
    console.log('Obfuscated: course-content.js (test bank protected)');
}

function build() {
    console.log('Building PCTE Training RPG...\n');

    // Clean and create dist directory
    if (fs.existsSync(DIST_DIR)) {
        fs.rmSync(DIST_DIR, { recursive: true });
    }
    ensureDir(DIST_DIR);

    // Copy static files
    console.log('Copying static files...');
    for (const file of STATIC_FILES) {
        const srcPath = path.join(SRC_DIR, file);
        if (fs.existsSync(srcPath)) {
            copyFile(srcPath, path.join(DIST_DIR, file));
        }
    }

    // Copy static directories
    console.log('\nCopying asset directories...');
    for (const dir of STATIC_DIRS) {
        const srcPath = path.join(SRC_DIR, dir);
        if (fs.existsSync(srcPath)) {
            copyDir(srcPath, path.join(DIST_DIR, dir));
            console.log(`Copied directory: ${dir}/`);
        }
    }

    // Obfuscate JavaScript files
    console.log('\nObfuscating JavaScript...');

    // Obfuscate game.js with light obfuscation
    obfuscateFile(
        path.join(SRC_DIR, 'game.js'),
        path.join(DIST_DIR, 'game.js'),
        LIGHT_OBFUSCATION_OPTIONS
    );

    // Obfuscate course-content.js with heavy obfuscation (test bank)
    extractAndObfuscateTestBank();

    console.log('\nBuild complete! Output in ./dist/');
    console.log('\nTo deploy:');
    console.log('1. Push to GitHub main branch');
    console.log('2. GitHub Actions will automatically build and deploy');
    console.log('3. Update cmi5.xml URLs to point to GitHub Pages');
}

build();
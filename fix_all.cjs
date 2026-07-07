const fs = require('fs');
const path = require('path');

function replaceColors(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace indigo with primary or neutral
    content = content.replace(/indigo-900/g, 'primary-900');
    content = content.replace(/indigo-800/g, 'primary-800');
    content = content.replace(/indigo-700/g, 'primary-700');
    content = content.replace(/indigo-600/g, 'primary-600');
    content = content.replace(/indigo-500/g, 'primary-500');
    content = content.replace(/indigo-400/g, 'primary-400');
    content = content.replace(/indigo-300/g, 'primary-300');
    content = content.replace(/indigo-200/g, 'primary-200');
    content = content.replace(/indigo-100/g, 'primary-100');
    content = content.replace(/indigo-50 /g, 'primary-50 ');
    content = content.replace(/indigo-50\//g, 'primary-50/');
    content = content.replace(/indigo-50"/g, 'primary-50"');

    // Replace emerald with neutral-900 (success state to dark) or primary
    content = content.replace(/emerald-700/g, 'neutral-900');
    content = content.replace(/emerald-600/g, 'neutral-900');
    content = content.replace(/emerald-500/g, 'neutral-900');
    content = content.replace(/emerald-400/g, 'neutral-400');
    content = content.replace(/emerald-300/g, 'neutral-300');
    content = content.replace(/emerald-200/g, 'neutral-200');
    content = content.replace(/emerald-100/g, 'neutral-200');
    content = content.replace(/emerald-50 /g, 'neutral-100 ');
    content = content.replace(/emerald-50\//g, 'neutral-100/');
    content = content.replace(/emerald-50"/g, 'neutral-100"');

    // Replace amber with primary (warning/highlight state)
    content = content.replace(/amber-700/g, 'primary-700');
    content = content.replace(/amber-600/g, 'primary-600');
    content = content.replace(/amber-500/g, 'primary-500');
    content = content.replace(/amber-400/g, 'primary-400');
    content = content.replace(/amber-300/g, 'primary-300');
    content = content.replace(/amber-200/g, 'primary-200');
    content = content.replace(/amber-100/g, 'primary-100');
    content = content.replace(/amber-50 /g, 'primary-50 ');
    content = content.replace(/amber-50\//g, 'primary-50/');
    content = content.replace(/amber-50"/g, 'primary-50"');

    fs.writeFileSync(filePath, content);
}

function walk(targetPath) {
    const stat = fs.statSync(targetPath);
    if (stat.isDirectory()) {
        const list = fs.readdirSync(targetPath);
        list.forEach(file => {
            walk(path.join(targetPath, file));
        });
    } else if (targetPath.endsWith('.tsx') || targetPath.endsWith('.ts')) {
        replaceColors(targetPath);
    }
}

walk('src/components');

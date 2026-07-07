const fs = require('fs');
const path = require('path');

function replaceColors(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace indigo with primary
    content = content.replace(/indigo-/g, 'primary-');
    
    // Replace emerald with neutral
    content = content.replace(/emerald-700/g, 'neutral-900');
    content = content.replace(/emerald-600/g, 'neutral-900');
    content = content.replace(/emerald-500/g, 'neutral-900');
    content = content.replace(/emerald-400/g, 'neutral-400');
    content = content.replace(/emerald-300/g, 'neutral-300');
    content = content.replace(/emerald-200/g, 'neutral-200');
    content = content.replace(/emerald-100/g, 'neutral-200');
    content = content.replace(/emerald-50/g, 'neutral-100');
    content = content.replace(/emerald-800/g, 'neutral-900');
    content = content.replace(/emerald-900/g, 'neutral-900');
    
    // Replace amber with primary
    content = content.replace(/amber-/g, 'primary-');
    
    // Replace blue with primary
    content = content.replace(/blue-/g, 'primary-');

    // Replace rose with primary
    content = content.replace(/rose-/g, 'primary-');
    
    // Replace orange with primary
    content = content.replace(/orange-/g, 'primary-');
    
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

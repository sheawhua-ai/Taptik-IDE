const fs = require('fs');
const path = require('path');

function replaceColors(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace slate and zinc with neutral
    content = content.replace(/slate-/g, 'neutral-');
    content = content.replace(/zinc-/g, 'neutral-');
    
    // Replace red, violet, purple with primary
    content = content.replace(/red-/g, 'primary-');
    content = content.replace(/violet-/g, 'primary-');
    content = content.replace(/purple-/g, 'primary-');
    
    // Replace green with neutral (or primary? neutral is safer for 'success' stuff converted to dark)
    content = content.replace(/green-700/g, 'neutral-900');
    content = content.replace(/green-600/g, 'neutral-900');
    content = content.replace(/green-500/g, 'neutral-900');
    content = content.replace(/green-400/g, 'neutral-400');
    content = content.replace(/green-100/g, 'neutral-200');
    content = content.replace(/green-50/g, 'neutral-100');
    content = content.replace(/green-/g, 'neutral-');

    // Replace semantic colors just in case
    content = content.replace(/success-500/g, 'neutral-900');
    content = content.replace(/success-600/g, 'neutral-900');
    content = content.replace(/success-50/g, 'neutral-100');
    
    content = content.replace(/danger-500/g, 'primary-500');
    content = content.replace(/danger-600/g, 'primary-600');
    content = content.replace(/danger-50/g, 'primary-50');
    
    content = content.replace(/warning-500/g, 'neutral-400');
    content = content.replace(/warning-50/g, 'neutral-100');

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

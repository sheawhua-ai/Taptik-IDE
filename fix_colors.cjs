const fs = require('fs');
const path = require('path');

function replaceColors(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // In MaterialStation.tsx
    if (filePath.includes('MaterialStation.tsx')) {
        content = content.replace(/emerald-500/g, 'neutral-900');
        content = content.replace(/emerald-50 /g, 'neutral-50 ');
        content = content.replace(/emerald-200/g, 'neutral-200');
        content = content.replace(/emerald-700/g, 'neutral-900');
        content = content.replace(/emerald-600/g, 'neutral-900');
        content = content.replace(/emerald-100/g, 'neutral-200');
        
        content = content.replace(/orange-500/g, 'neutral-600');
        content = content.replace(/orange-50 /g, 'neutral-100 ');
        content = content.replace(/orange-700/g, 'neutral-700');
        content = content.replace(/orange-100/g, 'neutral-200');
        
        content = content.replace(/rose-/g, 'primary-');
    }
    
    // In merchant
    if (filePath.includes('merchant/')) {
        content = content.replace(/success-500/g, 'neutral-900');
        content = content.replace(/success-50 /g, 'neutral-100 ');
        content = content.replace(/success-600/g, 'neutral-900');
        content = content.replace(/success-400/g, 'neutral-400');
        
        content = content.replace(/warning-500/g, 'neutral-400');
        content = content.replace(/warning-50 /g, 'neutral-100 ');
        
        content = content.replace(/danger-500/g, 'primary-500');
        content = content.replace(/danger-50 /g, 'primary-50 ');
        
        content = content.replace(/emerald-600/g, 'neutral-900');
        content = content.replace(/emerald-500/g, 'neutral-900');
        content = content.replace(/emerald-50 /g, 'neutral-100 ');
        
        content = content.replace(/rose-/g, 'primary-');
    }
    
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

walk('src/components/MaterialStation.tsx');
walk('src/components/merchant');

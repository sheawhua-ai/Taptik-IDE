const fs = require('fs');
let content = fs.readFileSync('src/components/merchant/CreateProjectWorkstation.tsx', 'utf8');

// The icons we added are: ArrowRight, ArrowLeft, ArrowUp, Database, History, TrendingUp, ChevronUp, ChevronDown, ClipboardList, Camera

const requiredIcons = [
  'ArrowRight', 'ArrowLeft', 'ArrowUp', 'Database', 'History', 'TrendingUp', 
  'ChevronUp', 'ChevronDown', 'ClipboardList', 'Camera', 'Plus'
];

let importMatch = content.match(/import \{([^}]+)\} from "lucide-react";/);
if (importMatch) {
  let existingIcons = importMatch[1].split(',').map(s => s.trim());
  let toAdd = requiredIcons.filter(icon => !existingIcons.includes(icon));
  if (toAdd.length > 0) {
    let newImportStr = importMatch[1] + ', ' + toAdd.join(', ');
    content = content.replace(importMatch[1], newImportStr);
    fs.writeFileSync('src/components/merchant/CreateProjectWorkstation.tsx', content);
    console.log("Added imports: " + toAdd.join(', '));
  } else {
    console.log("All required icons are already imported.");
  }
}

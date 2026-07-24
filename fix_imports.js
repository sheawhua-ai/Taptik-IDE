import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// The line is: import { Compass, Users, Hash } from "lucide-react";
// Let's just remove that line. We can add Hash to the other lucide-react import if it's not there.
content = content.replace('import { Compass, Users, Hash } from "lucide-react";\n', '');

if (!content.includes('Hash,')) {
    content = content.replace('import { \n', 'import { \n  Hash,\n');
}

fs.writeFileSync('src/App.tsx', content);

import fs from 'fs';
let content = fs.readFileSync('src/components/merchant/ProjectCenter.tsx', 'utf-8');

content = content.replace(
  'const renderDrawerContent = () => {\\n    switch (drawerType) {',
  'const renderDrawerContent = () => {\\n    switch (drawerType) {'
);
// Above won't work if it literally contains '\n'.
// Let's replace the literal string.
content = content.replace(/const renderDrawerContent = \(\) => \{\\n\s*switch \(drawerType\) \{/, `const renderDrawerContent = () => {
    switch (drawerType) {`);

fs.writeFileSync('src/components/merchant/ProjectCenter.tsx', content);

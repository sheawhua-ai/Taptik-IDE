import fs from 'fs';
let content = fs.readFileSync('src/components/merchant/ProjectCenter.tsx', 'utf-8');

// Replace renderCreateProjectDrawer and case "create_project": with empty or just remove it from renderDrawerContent
const renderCreateProjectDrawerStart = content.indexOf('  const renderCreateProjectDrawer = () => {');
const renderDrawerContentStart = content.indexOf('  const renderDrawerContent = () => {');

if (renderCreateProjectDrawerStart !== -1 && renderDrawerContentStart !== -1) {
  const replacement = `  const renderDrawerContent = () => {\n    switch (drawerType) {`;
  // We want to replace the whole renderCreateProjectDrawer function
  // We'll use simple replacement for the drawerType switch case.
}

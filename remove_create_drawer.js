import fs from 'fs';
let content = fs.readFileSync('src/components/merchant/ProjectCenter.tsx', 'utf-8');

const startStr = '  const renderCreateProjectDrawer = () => {';
const startIdx = content.indexOf(startStr);

if (startIdx !== -1) {
  // find the end of this function (it ends right before `const renderChecklistDrawer = () => {`)
  const endStr = '  const renderChecklistDrawer = () => {';
  const endIdx = content.indexOf(endStr);
  
  if (endIdx !== -1) {
    content = content.substring(0, startIdx) + content.substring(endIdx);
  }
}

// Also remove `case "create_project": return renderCreateProjectDrawer();` from `renderDrawerContent`
content = content.replace('      case "create_project":\n        return renderCreateProjectDrawer();\n', '');
content = content.replace('      case "create_project": return renderCreateProjectDrawer();\n', ''); // fallback

// We also need to add the full page overlay for create_project
const renderStr = '  return (\n    <div className="h-full flex flex-col bg-neutral-50">';
const overlayStr = `  return (
    <div className="h-full flex flex-col bg-neutral-50">
      {drawerType === "create_project" && (
        <div className="absolute inset-0 z-50 bg-[#fcfcfc]">
          <CreateProjectWorkstation 
            onClose={() => setDrawerType(null)} 
            onCreate={(proj) => {
              setProjects([proj, ...projects]);
              setSelectedProjectId(proj.id);
              setDrawerType(null);
            }} 
          />
        </div>
      )}`;

content = content.replace(renderStr, overlayStr);

fs.writeFileSync('src/components/merchant/ProjectCenter.tsx', content);
console.log("Successfully removed old create drawer and injected new workstation.");

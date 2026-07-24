import fs from 'fs';
let content = fs.readFileSync('src/components/merchant/ProjectCenter.tsx', 'utf-8');

const targetStr = `  return (
    <div className="h-full flex overflow-hidden bg-[#fcfcfc] text-neutral-900 font-sans relative">`;

const replacementStr = `  return (
    <div className="h-full flex overflow-hidden bg-[#fcfcfc] text-neutral-900 font-sans relative">
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

content = content.replace(targetStr, replacementStr);
fs.writeFileSync('src/components/merchant/ProjectCenter.tsx', content);
console.log("Injected Workstation overlay");

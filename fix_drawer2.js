import fs from 'fs';
let content = fs.readFileSync('src/components/merchant/ProjectCenter.tsx', 'utf-8');

// Revert the bad insertion
const badInsertion = `const renderDrawerContent = () => {
      case "create_project":
        return (
          <div className="h-full flex flex-col">
            <div className="p-5 border-b border-neutral-100 flex justify-between items-center bg-white shrink-0">
              <h3 className="font-bold text-[16px] text-neutral-900">新建项目</h3>
              <button onClick={() => setDrawerType(null)} className="text-neutral-400 hover:text-neutral-700 transition-colors"><X size={18} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 bg-neutral-50/50 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-[13px] font-bold text-neutral-700 mb-1.5">项目名称</label>
                  <input type="text" id="new-project-name" defaultValue="新营销项目" className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-[14px] outline-none focus:border-primary-500 shadow-sm" />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-neutral-700 mb-1.5">项目目标</label>
                  <textarea id="new-project-target" rows={3} placeholder="输入您希望达成的目标..." className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-[14px] outline-none focus:border-primary-500 shadow-sm resize-none"></textarea>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-neutral-100 shrink-0 flex gap-3 bg-white">
              <button onClick={() => setDrawerType(null)} className="flex-1 py-2.5 bg-white border border-neutral-200 text-neutral-700 text-[13px] font-bold rounded-xl hover:bg-neutral-50">取消</button>
              <button onClick={() => { 
                const name = (document.getElementById("new-project-name") as HTMLInputElement)?.value || "新营销项目";
                const target = (document.getElementById("new-project-target") as HTMLTextAreaElement)?.value || "设定目标...";
                const newId = \`new-\${Date.now()}\`;
                setProjects([{
                  id: newId,
                  name: name,
                  status: "立项草案",
                  target: target,
                  aiActionCard: {
                    title: "AI 已为您草拟新一轮策略",
                    desc: "根据您输入的目标，建议采取新一轮卡位。",
                    actionText: "查看并确认策略",
                    drawerTarget: "confirm_strategy"
                  },
                  recommendedAction: "confirm_strategy"
                } as any, ...projects]);
                setSelectedProjectId(newId);
                setDrawerType(null);
              }} className="flex-1 py-2.5 bg-neutral-900 text-white text-[13px] font-bold rounded-xl hover:bg-neutral-800">创建并立项</button>
            </div>
          </div>
        );`;

// First put it back to normal
if (content.includes(badInsertion)) {
  content = content.replace(badInsertion, 'const renderDrawerContent = () => {');
} else {
    // maybe it got modified by my previous fix attempt
    const fixedBadInsertion = badInsertion.replace('const renderDrawerContent = () => {\\n      case "create_project":', 'const renderDrawerContent = () => {\\n    switch(drawerType) {\\n      case "create_project":');
    if (content.includes(fixedBadInsertion)) {
         content = content.replace(fixedBadInsertion, 'const renderDrawerContent = () => {');
    }
}

// Then insert it in the correct place
const correctInsertionTarget = 'const renderDrawerContent = () => {\\n    switch (drawerType) {';
const correctInsertion = correctInsertionTarget + `
      case "create_project":
        return (
          <div className="h-full flex flex-col">
            <div className="p-5 border-b border-neutral-100 flex justify-between items-center bg-white shrink-0">
              <h3 className="font-bold text-[16px] text-neutral-900">新建项目</h3>
              <button onClick={() => setDrawerType(null)} className="text-neutral-400 hover:text-neutral-700 transition-colors"><X size={18} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 bg-neutral-50/50 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-[13px] font-bold text-neutral-700 mb-1.5">项目名称</label>
                  <input type="text" id="new-project-name" defaultValue="新营销项目" className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-[14px] outline-none focus:border-primary-500 shadow-sm" />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-neutral-700 mb-1.5">项目目标</label>
                  <textarea id="new-project-target" rows={3} placeholder="输入您希望达成的目标..." className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-[14px] outline-none focus:border-primary-500 shadow-sm resize-none"></textarea>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-neutral-100 shrink-0 flex gap-3 bg-white">
              <button onClick={() => setDrawerType(null)} className="flex-1 py-2.5 bg-white border border-neutral-200 text-neutral-700 text-[13px] font-bold rounded-xl hover:bg-neutral-50">取消</button>
              <button onClick={() => { 
                const name = (document.getElementById("new-project-name") as HTMLInputElement)?.value || "新营销项目";
                const target = (document.getElementById("new-project-target") as HTMLTextAreaElement)?.value || "设定目标...";
                const newId = \`new-\${Date.now()}\`;
                setProjects([{
                  id: newId,
                  name: name,
                  status: "立项草案",
                  target: target,
                  aiActionCard: {
                    title: "AI 已为您草拟新一轮策略",
                    desc: "根据您输入的目标，建议采取新一轮卡位。",
                    actionText: "查看并确认策略",
                    drawerTarget: "confirm_strategy"
                  },
                  recommendedAction: "confirm_strategy"
                } as any, ...projects]);
                setSelectedProjectId(newId);
                setDrawerType(null);
              }} className="flex-1 py-2.5 bg-neutral-900 text-white text-[13px] font-bold rounded-xl hover:bg-neutral-800">创建并立项</button>
            </div>
          </div>
        );`;

// Wait, the file uses \n, so a regex is safer
content = content.replace(/const renderDrawerContent = \(\) => \{\s*switch\s*\(drawerType\)\s*\{/, correctInsertion);

fs.writeFileSync('src/components/merchant/ProjectCenter.tsx', content);

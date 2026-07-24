import fs from 'fs';
let content = fs.readFileSync('src/components/merchant/ProjectCenter.tsx', 'utf-8');

// 1. Update the Plus button onClick
const plusBtnTarget = `<button onClick={() => {
              const newId = \`new-\${Date.now()}\`;
              setProjects([{
                id: newId,
                name: "未命名新项目",
                status: "立项草案",
                target: "设定目标...",
                aiActionCard: {
                  title: "AI 已为您草拟新一轮策略",
                  desc: "根据近期市场情况，建议采取新一轮卡位。",
                  actionText: "查看并确认策略",
                  drawerTarget: "confirm_strategy"
                },
                recommendedAction: "confirm_strategy"
              } as any, ...projects]);
              setSelectedProjectId(newId);
            }} className="p-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg shadow-sm transition-all" title="开启新项目">
              <Plus size={16} />
            </button>`;

const plusBtnReplacement = `<button onClick={() => setDrawerType("create_project")} className="p-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg shadow-sm transition-all" title="新建项目">
              <Plus size={16} />
            </button>`;

content = content.replace(plusBtnTarget, plusBtnReplacement);

// 2. Add 'create_project' case to renderDrawerContent
const renderDrawerStart = 'const renderDrawerContent = () => {';
const createProjectCase = `
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

content = content.replace(renderDrawerStart, renderDrawerStart + createProjectCase);

// 3. Add delete button to projects
// I'll use a regex or string replacement to add the delete button on the project list item hover
// Currently:
// <div key={p.id} onClick={() => setSelectedProjectId(p.id)} className={\`p-4 rounded-xl cursor-pointer transition-all border \${selectedProjectId === p.id ? "border-primary-200 bg-primary-50/50 shadow-sm" : "border-transparent hover:bg-neutral-50"}\`}>
//  ...
// </div>

const projectItemTarget = `className={\`p-4 rounded-xl cursor-pointer transition-all border \${selectedProjectId === p.id ? "border-primary-200 bg-primary-50/50 shadow-sm" : "border-transparent hover:bg-neutral-50"}\`}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-[14px] text-neutral-900 line-clamp-1">{p.name}</h3>`;

const projectItemReplacement = `className={\`group relative p-4 rounded-xl cursor-pointer transition-all border \${selectedProjectId === p.id ? "border-primary-200 bg-primary-50/50 shadow-sm" : "border-transparent hover:bg-neutral-50"}\`}>
                  {p.id.startsWith('new-') && (
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        const newProjects = projects.filter(proj => proj.id !== p.id);
                        setProjects(newProjects);
                        if (selectedProjectId === p.id && newProjects.length > 0) {
                          setSelectedProjectId(newProjects[0].id);
                        }
                      }} 
                      className="absolute right-2 top-2 p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                      title="删除空项目"
                    >
                      <X size={14} />
                    </button>
                  )}
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-[14px] text-neutral-900 line-clamp-1 pr-6">{p.name}</h3>`;

content = content.replace(projectItemTarget, projectItemReplacement);

fs.writeFileSync('src/components/merchant/ProjectCenter.tsx', content);

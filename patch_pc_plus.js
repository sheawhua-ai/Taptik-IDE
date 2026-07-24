import fs from 'fs';
let content = fs.readFileSync('src/components/merchant/ProjectCenter.tsx', 'utf-8');

const targetStr = `<button className="p-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg shadow-sm transition-all" title="开启新一轮">
              <Plus size={16} />
            </button>`;

const replacementStr = `<button onClick={() => {
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

content = content.replace(targetStr, replacementStr);
fs.writeFileSync('src/components/merchant/ProjectCenter.tsx', content);

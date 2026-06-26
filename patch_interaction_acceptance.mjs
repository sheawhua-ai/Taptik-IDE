import fs from 'fs';

let content = fs.readFileSync('src/components/rings/Interaction.tsx', 'utf-8');

// Update TaskTab type
content = content.replace(
  /type TaskTab = "todo" \| "risk" \| "opportunity";/,
  `type TaskTab = "todo" | "risk" | "opportunity" | "acceptance";`
);

// Add to tabs array
const tabsHtml = `
        {[
          {
            id: "todo",
            name: "待我处理",
            count: 3,
            icon: Clock,
            color: "text-blue-600",
          },
          {
            id: "acceptance",
            name: "素材验收池",
            count: 2,
            icon: ImageIcon,
            color: "text-emerald-600",
          },
          {
            id: "risk",
            name: "异常风险",
            count: 1,
            icon: ShieldAlert,
            color: "text-red-600",
          },
          {
            id: "opportunity",
            name: "高价值机会",
            count: 1,
            icon: Flame,
            color: "text-amber-600",
          },
        ].map((tab) => (
`;

content = content.replace(/\{\[\s*\{\s*id: "todo",[\s\S]*?\]\.map\(\(tab\) => \(/, tabsHtml.trim() + " ");

// Add Material Acceptance view
const acceptanceHtml = `
      {activeTab === "acceptance" ? (
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-5xl mx-auto space-y-6 pb-20">
             <div className="flex justify-between items-end mb-6">
               <div>
                 <h3 className="text-[18px] font-bold text-neutral-900">外部与协同素材验收</h3>
                 <p className="text-[13px] text-neutral-500 mt-1">处理内部派发与外部体验任务回传的素材</p>
               </div>
             </div>
             
             <div className="grid grid-cols-2 gap-6">
                <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
                   <div className="p-3 border-b border-neutral-100 flex items-center justify-between bg-neutral-50">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded">内部协同</span>
                        <span className="text-[13px] font-bold text-neutral-900">幼犬实拍补充</span>
                      </div>
                      <span className="text-[11px] text-neutral-500">李店长提交于 10 分钟前</span>
                   </div>
                   <div className="p-4">
                      <div className="flex gap-2 mb-3">
                         <div className="w-24 h-24 bg-neutral-100 rounded flex items-center justify-center text-[10px] text-neutral-400">视频 1</div>
                         <div className="w-24 h-24 bg-neutral-100 rounded flex items-center justify-center text-[10px] text-neutral-400">视频 2</div>
                         <div className="w-24 h-24 bg-neutral-100 rounded flex items-center justify-center text-[10px] text-neutral-400">视频 3</div>
                      </div>
                      <div className="bg-emerald-50 text-emerald-700 p-2 rounded text-[11px] mb-3 border border-emerald-100">
                         <strong>AI 预检：</strong>光线充足，满足「狗狗吃粮」动作要求，未发现违规元素。
                      </div>
                      <div className="flex gap-2">
                         <button className="flex-1 bg-neutral-900 text-white text-[12px] font-medium py-2 rounded hover:bg-neutral-800">入库并装填</button>
                         <button className="flex-1 bg-white border border-neutral-200 text-neutral-700 text-[12px] font-medium py-2 rounded hover:bg-neutral-50">退回重拍</button>
                         <button className="flex-1 bg-white border border-neutral-200 text-neutral-700 text-[12px] font-medium py-2 rounded hover:bg-neutral-50">AI 增强处理</button>
                      </div>
                      <div className="text-center mt-3">
                        <span className="text-[10px] text-neutral-400">入库后将沉淀到「幼犬场景库」并在待发布池自动装填</span>
                      </div>
                   </div>
                </div>

                <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
                   <div className="p-3 border-b border-neutral-100 flex items-center justify-between bg-neutral-50">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">真实体验领取</span>
                        <span className="text-[13px] font-bold text-neutral-900">软便换粮打卡</span>
                      </div>
                      <span className="text-[11px] text-neutral-500">体验用户A 提交于 1 小时前</span>
                   </div>
                   <div className="p-4">
                      <div className="flex gap-2 mb-3">
                         <div className="w-24 h-24 bg-neutral-100 rounded flex items-center justify-center text-[10px] text-neutral-400">照片 1</div>
                         <div className="w-24 h-24 bg-neutral-100 rounded flex items-center justify-center text-[10px] text-neutral-400">照片 2</div>
                      </div>
                      <div className="bg-red-50 text-red-700 p-2 rounded text-[11px] mb-3 border border-red-100">
                         <strong>AI 预检：</strong>光线过暗，且照片中出现了竞品包装。
                      </div>
                      <div className="flex gap-2">
                         <button className="flex-1 bg-white border border-red-200 text-red-600 text-[12px] font-medium py-2 rounded hover:bg-red-50">一键驳回要求重传</button>
                         <button className="flex-1 bg-white border border-neutral-200 text-neutral-700 text-[12px] font-medium py-2 rounded hover:bg-neutral-50">AI 消除竞品并提亮</button>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      ) : (
`;

content = content.replace(/\{\/\* 任务列表区 \*\/\}\n\s*<div className="flex-1 overflow-y-auto p-8 custom-scrollbar">\n\s*<div className="space-y-4 max-w-5xl mx-auto pb-20">/, '      {/* 任务列表区 */}\n' + acceptanceHtml + '\n        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">\n          <div className="space-y-4 max-w-5xl mx-auto pb-20">');

content = content.replace(/\{task\.details\}\n\s*<\/div>\n\s*\)\}\n\s*<\/div>\n\s*\)\)}/, '{task.details}\n                          </div>\n                        )}\n                      </div>\n                    ))}\n                  </div>\n                </div>\n              )}');

fs.writeFileSync('src/components/rings/Interaction.tsx', content);

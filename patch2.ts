import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const replacement = `
        <div className="border-t border-[#e9eaec] mt-6 pt-4 mb-2 w-full px-3">
          {!isSidebarCollapsed && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <span className="text-[11px] text-slate-400 font-medium">当前上下文</span>
                <div className="bg-white/60 rounded-xl p-3 border border-slate-100 flex flex-col gap-2 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-500"></div>
                    <span className="text-[13px] font-semibold text-slate-800">商家 A：宠物食品组</span>
                  </div>
                  <div className="flex flex-col gap-1.5 mt-1 text-[11px] text-slate-500">
                    <div className="flex items-start gap-1.5">
                      <span className="shrink-0 text-slate-400">目标：</span>
                      <span>搜索卡位 + 内容起量</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <span className="shrink-0 text-slate-400">资源：</span>
                      <span>知识库已连 / 飞书群已连</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">宠粮新客运营</span>
                  <button onClick={() => setIsCreateProjectModalOpen(true)} className="hover:text-slate-700" title="新建任务流"><Plus size={12} strokeWidth={3} /></button>
                </div>
                <div className="flex flex-col border-l-2 border-slate-200 ml-1.5 pl-3 py-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary-500 shadow-[0_0_0_2px_rgba(var(--primary-100),1)] animate-pulse -ml-[17px]"></div>
                    <span className="text-[12px] text-slate-700 truncate">小红书批量生成中</span>
                  </div>
                  <div className="flex items-center gap-2 group cursor-pointer hover:text-slate-800 text-slate-500">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300 -ml-[16px] group-hover:bg-slate-400 transition-colors"></div>
                    <span className="text-[12px] truncate transition-colors">昨日拉新复盘</span>
                  </div>
                  <div className="flex items-center gap-2 group cursor-pointer hover:text-slate-800 text-slate-500">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300 -ml-[16px] group-hover:bg-slate-400 transition-colors"></div>
                    <span className="text-[12px] truncate transition-colors">诊断现有账号掉量</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
`;

// Replace lines 959 to 1007
const lines = code.split('\n');
const startLine = lines.findIndex(l => l.includes('<div className="border-t border-[#e9eaec] mt-6 pt-4 mb-2 w-full">'));
const endLine = lines.findIndex(l => l.includes('title={isSidebarCollapsed ? "美妆季卡提报 (项目)" : undefined}')) + 12;

if (startLine !== -1 && endLine > startLine) {
  const newLines = [
    ...lines.slice(0, startLine),
    replacement,
    ...lines.slice(endLine)
  ];
  fs.writeFileSync('src/App.tsx', newLines.join('\n'));
  console.log('App.tsx patched.');
} else {
  console.log('Could not find lines in App.tsx');
}

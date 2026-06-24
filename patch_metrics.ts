import fs from 'fs';
let content = fs.readFileSync('src/components/rings/Metrics.tsx', 'utf8');

content = content.replace(
`  return (
  <div className="flex h-full w-full bg-white overflow-hidden">
  {/* 侧边导航与列表 */}
  <div className="w-[280px] border-r border-neutral-100 flex flex-col h-full bg-[#fafafa] shrink-0">
  <div className="p-8 border-b border-neutral-100 bg-white">
  <div className="flex items-center justify-between mb-4">
  <div>
  <h2 className="text-xl font-semibold text-neutral-900 tracking-tight">深度数据看板</h2>
  <p className="text-[11px] text-neutral-400 mt-1 uppercase tracking-widest">
  Data Intelligence
  </p>
  </div>
  </div>
  </div>

  <div className="px-4 py-4 space-y-1">`,
`  return (
  <div className="flex flex-col h-full w-full bg-white overflow-hidden">
    <div className="h-20 border-b border-neutral-100 flex items-center justify-between px-8 bg-white shrink-0 z-10 w-full mb-0">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-neutral-900 text-white rounded-[20px] flex items-center justify-center shadow-md">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
        </div>
        <div>
          <h2 className="text-[16px] font-semibold text-neutral-900 tracking-tight">深度数据看板</h2>
          <p className="text-[11px] text-neutral-400 mt-0.5">跨平台数据汇总与 ROI 分析报告</p>
        </div>
      </div>
    </div>
    <div className="flex-1 flex overflow-hidden">
  {/* 侧边导航与列表 */}
  <div className="w-[280px] border-r border-neutral-100 flex flex-col h-full bg-[#fafafa] shrink-0">
  <div className="px-4 py-4 space-y-1">`
);

let parts = content.split('<DataCenter dataSubNav={dataSubNav} setDataSubNav={setDataSubNav} setActiveNav={() => {}} />');
if (parts.length === 2) {
  content = parts[0] + '<DataCenter dataSubNav={dataSubNav} setDataSubNav={setDataSubNav} setActiveNav={() => {}} />\n  </div>\n  </div>\n  </div>\n  );\n}\n';
}

fs.writeFileSync('src/components/rings/Metrics.tsx', content);

import fs from 'fs';

let content = fs.readFileSync('src/components/Workbench.tsx', 'utf-8');

// 1. Add isEscortOpen state
if (!content.includes('const [isEscortOpen, setIsEscortOpen] = useState(true);')) {
  content = content.replace(
    /const \[proactiveSuggestions\] = useState\(\[/,
    "const [isEscortOpen, setIsEscortOpen] = useState(true);\n  const [proactiveSuggestions] = useState(["
  );
}

// 2. Modify the right panel rendering
const panelRegex = /\{\/\* RIGHT PANEL: AI Escort Engine or Brand Profile \*\/\}\s*\{isNewMerchant \? \([\s\S]*?\) : \([\s\S]*?<div className="w-\[300px\] 2xl:w-\[340px\] border-l border-neutral-200 bg-\[#fbfbfb\] flex flex-col shrink-0 relative z-20 shadow-\[-4px_0_24px_rgba\(0,0,0,0\.02\)\]">[\s\S]*?\}\)\}\s*<\/div>\s*<\/div>/;

const newPanel = `{/* RIGHT PANEL: AI Escort Engine or Brand Profile */}
  {isNewMerchant ? (
  <div className="w-[300px] 2xl:w-[340px] border-l border-neutral-200 bg-[#fbfbfb] flex flex-col shrink-0 relative z-20 shadow-[-4px_0_24px_rgba(0,0,0,0.02)]">
  <div className="p-4 border-b border-neutral-100 flex items-center gap-2 bg-white shrink-0">
  <Sparkles size={18} className="text-primary-500" />
  <span className="text-[14px] text-neutral-900">品牌心智扫描</span>
  </div>
  <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
  <ProfileSlot label="品牌调性" value={onboardingData.brand} icon={Compass} active={onboardingStep >= 0} flashed={onboardingStep === 0} />
  <ProfileSlot label="主打产品" value={onboardingData.product} icon={Target} active={onboardingStep >= 0} flashed={onboardingStep === 0} />
  <ProfileSlot label="目标受众" value={onboardingData.audience} icon={Users} active={onboardingStep >= 1} flashed={onboardingStep === 1} />
  <ProfileSlot label="防坑雷区" value={onboardingData.traps} icon={ShieldAlert} active={onboardingStep >= 3} flashed={onboardingStep === 3} />
  <ProfileSlot label="品牌声调" value={onboardingData.tone} icon={MessageSquare} active={onboardingStep >= 3} flashed={onboardingStep === 3} />
  </div>
  </div>
  ) : (
  isEscortOpen ? (
  <div className="w-[300px] 2xl:w-[340px] border-l border-neutral-200 bg-[#fbfbfb] flex flex-col shrink-0 relative z-20 shadow-[-4px_0_24px_rgba(0,0,0,0.02)]">
  <div className="p-4 border-b border-neutral-100 bg-white shrink-0">
  <div className="flex items-center justify-between mb-1">
  <div className="flex items-center gap-2">
  <ShieldCheck size={18} className="text-primary-500" />
  <span className="text-[15px] font-semibold text-neutral-900">主动护航</span>
  </div>
  <div className="flex items-center gap-2">
  <span className="px-2 py-0.5 bg-neutral-100 text-neutral-500 text-[10px] rounded-md">{proactiveSuggestions.length} 项</span>
  <button onClick={() => setIsEscortOpen(false)} className="text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 p-1 rounded-md transition-colors">
    <X size={14} />
  </button>
  </div>
  </div>
  <p className="text-[11px] text-neutral-500 leading-tight">基于当前商家、项目和数据自动发现机会与风险</p>
  </div>
  <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
  {proactiveSuggestions.map(s => {
  const typeConfig = {
  'troubleshoot': { label: '排查', color: 'text-rose-600', dot: 'bg-rose-500', bg: 'bg-rose-50/50 border border-rose-100' },
  'opportunity': { label: '机会', color: 'text-emerald-600', dot: 'bg-emerald-500', bg: 'bg-emerald-50/50 border border-emerald-100' },
  'optimize': { label: '优化', color: 'text-blue-600', dot: 'bg-blue-500', bg: 'bg-blue-50/50 border border-blue-100' },
  'collaboration': { label: '协同', color: 'text-indigo-600', dot: 'bg-indigo-500', bg: 'bg-indigo-50/50 border border-indigo-100' }
  }[s.type as string] || { label: '提示', color: 'text-neutral-600', dot: 'bg-neutral-400', bg: 'bg-neutral-50 border border-neutral-200' };

  return (
  <div key={s.id} className="bg-white border border-neutral-100 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-neutral-200 transition-all group relative flex flex-col">
  <div className="flex items-center gap-2.5 mb-3">
  <div className={\`w-1.5 h-1.5 rounded-full \${typeConfig.dot}\`} />
  <h4 className="text-[14px] font-medium text-neutral-900 tracking-tight truncate flex-1">{s.title}</h4>
  <span className={\`text-[10px] px-2 py-0.5 rounded-md flex-shrink-0 \${typeConfig.bg} \${typeConfig.color}\`}>
  {typeConfig.label}
  </span>
  </div>
  <div className="mb-3">
  <p className="text-[12px] text-neutral-500 leading-relaxed mb-2"><span className="font-medium text-neutral-700">为什么重要：</span><br/>{s.desc}</p>
  <p className="text-[12px] text-neutral-500 leading-relaxed"><span className="font-medium text-neutral-700">建议动作：</span><br/>{(s as any).suggestion}</p>
  </div>
  
  <div className="flex justify-end mt-auto pt-2 border-t border-neutral-50">
  <button 
  onClick={() => handleExecuteSuggestion(s)}
  className="px-4 py-1.5 bg-neutral-50 text-neutral-700 hover:bg-neutral-900 hover:text-white rounded-[10px] text-[12px] font-medium transition-colors"
  >
  {s.action}
  </button>
  </div>
  </div>
  );
  })}
  </div>
  </div>
  ) : null
  )}
  
  {/* Collapsed Escort Toggle */}
  {!isNewMerchant && !isEscortOpen && (
    <div className="absolute right-0 top-[20%] z-30">
      <button onClick={() => setIsEscortOpen(true)} className="bg-white border border-neutral-200 border-r-0 shadow-sm p-2 rounded-l-xl flex items-center gap-2 group hover:pr-4 transition-all">
        <ShieldCheck size={18} className="text-primary-500" />
        <span className="text-[12px] font-medium text-neutral-600 hidden group-hover:block whitespace-nowrap">主动护航</span>
      </button>
    </div>
  )}

  </div>
  </div>`;

content = content.replace(panelRegex, newPanel);
fs.writeFileSync('src/components/Workbench.tsx', content);

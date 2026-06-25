import fs from 'fs';

let content = fs.readFileSync('src/components/Workbench.tsx', 'utf-8');

const regex = /{msg\.card && msg\.card\.type === 'confirmation' && \([\s\S]*?<\/div>\s*\)}/m;

const newCardRenderer = `{msg.card && msg.card.type === 'confirmation' && (
  <div className="mt-3 bg-white border border-neutral-200/60 rounded-2xl p-5 shadow-sm text-left relative overflow-hidden text-neutral-900 w-full min-w-[400px]">
    <div className="absolute top-0 left-0 w-1 h-full bg-primary-500" />
    <div className="mb-4">
      <h4 className="text-[13px] font-medium text-neutral-500 mb-1">我理解你的目标是：</h4>
      <p className="text-[14px] font-medium text-neutral-900">{msg.card.goal}</p>
    </div>
    
    <div className="grid grid-cols-2 gap-4 mb-4">
      <div>
        <h4 className="text-[12px] font-medium text-neutral-500 mb-1">我将调用：</h4>
        <ul className="text-[13px] text-neutral-700 space-y-1">
          {msg.card.tools?.map((t, idx) => (
            <li key={idx} className="flex items-center gap-1.5"><div className="w-1 h-1 rounded-full bg-neutral-300" />{t}</li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="text-[12px] font-medium text-neutral-500 mb-1">结果将落到：</h4>
        <ul className="text-[13px] text-neutral-700 space-y-1">
          {msg.card.destinations?.map((d, idx) => (
            <li key={idx} className="flex items-center gap-1.5"><div className="w-1 h-1 rounded-full bg-neutral-300" />{d}</li>
          ))}
        </ul>
      </div>
    </div>
    
    <div className="mb-5">
      <h4 className="text-[12px] font-medium text-neutral-500 mb-1">不会执行：</h4>
      <ul className="text-[13px] text-neutral-700 space-y-1">
        {msg.card.wontDo?.map((w, idx) => (
          <li key={idx} className="flex items-center gap-1.5"><div className="w-1 h-1 rounded-full bg-neutral-300" />{w}</li>
        ))}
      </ul>
    </div>
    
    <div className="bg-primary-50 rounded-xl p-3 mb-5 border border-primary-100 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Folder size={16} className="text-primary-500" />
        <span className="text-[13px] font-medium text-primary-800">落点推荐</span>
      </div>
      <div className="text-[13px] text-primary-600 bg-white px-2 py-1 rounded-md border border-primary-100">
        {msg.card.recommendedDestination}
      </div>
    </div>
    
    <div className="flex items-center gap-3 pt-4 border-t border-neutral-100">
      <button 
        onClick={() => handleConfirmExecute(msg.id, msg.card!.cmd)}
        className="px-6 py-2 bg-neutral-900 text-white hover:bg-primary-600 rounded-xl text-[13px] font-medium transition-colors flex-1"
      >
        确认执行
      </button>
      <button className="px-6 py-2 bg-neutral-50 text-neutral-700 hover:bg-neutral-100 rounded-xl text-[13px] font-medium transition-colors border border-neutral-200 flex-1">
        调整一下
      </button>
    </div>
  </div>
)}

{msg.card && msg.card.type === 'progress' && (
  <div className="mt-3 bg-white border border-neutral-200/60 rounded-2xl shadow-sm text-left relative overflow-hidden text-neutral-900 w-full min-w-[400px]">
    <div className="absolute top-0 left-0 w-1 h-full bg-primary-500" />
    <div 
      className="p-4 flex items-center justify-between cursor-pointer hover:bg-neutral-50"
      onClick={() => handleToggleProgress(msg.id)}
    >
      <div className="flex items-center gap-3">
        <Loader2 size={16} className="animate-spin text-primary-500" />
        <span className="text-[14px] font-medium">Agent 正在执行: {msg.card.currentStep}</span>
      </div>
      <ChevronDown size={16} className={\`text-neutral-400 transition-transform \${msg.card.isExpanded ? 'rotate-180' : ''}\`} />
    </div>
    
    <AnimatePresence>
      {msg.card.isExpanded && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden"
        >
          <div className="p-4 pt-0 border-t border-neutral-100">
            <div className="space-y-3 mt-4">
              {msg.card.steps?.map((step, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className={\`w-5 h-5 rounded-full flex items-center justify-center shrink-0 \${step.status === 'completed' ? 'bg-primary-100 text-primary-600' : step.status === 'active' ? 'bg-primary-500 text-white' : 'bg-neutral-100 text-neutral-400'}\`}>
                    {step.status === 'completed' ? <Check size={12} /> : step.status === 'active' ? <Loader2 size={12} className="animate-spin" /> : <div className="w-1.5 h-1.5 rounded-full bg-neutral-300" />}
                  </div>
                  <span className={\`text-[13px] \${step.status === 'completed' ? 'text-neutral-800' : step.status === 'active' ? 'text-primary-600 font-medium' : 'text-neutral-400'}\`}>
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
)}

{msg.card && msg.card.type === 'result' && (
  <div className="mt-3 bg-white border border-neutral-200/60 rounded-2xl p-5 shadow-sm text-left relative overflow-hidden text-neutral-900 w-full min-w-[400px]">
    <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
    <h3 className="text-[16px] font-semibold mb-4 text-emerald-600 flex items-center gap-2">
      <CheckCircle2 size={18} />
      {msg.card.title}
    </h3>
    
    <div className="space-y-3 mb-5">
      {msg.card.items?.map((item, idx) => (
        <div key={idx} className="bg-neutral-50 rounded-xl p-3 border border-neutral-100">
          <h4 className="text-[13px] font-semibold text-neutral-900 mb-1">{idx + 1}. {item.title}</h4>
          <p className="text-[12px] text-neutral-500">{item.desc}</p>
        </div>
      ))}
    </div>
    
    <div className="bg-emerald-50 text-emerald-800 text-[13px] p-3 rounded-xl mb-5 font-medium border border-emerald-100">
      {msg.card.recommendation}
    </div>
    
    <div className="flex flex-wrap gap-2 pt-4 border-t border-neutral-100">
      {msg.card.actions?.map((action, idx) => (
        <button 
          key={idx}
          className={\`px-4 py-1.5 rounded-xl text-[12px] font-medium transition-colors \${idx === 0 ? 'bg-neutral-900 text-white hover:bg-emerald-600' : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100 border border-neutral-200'}\`}
        >
          {action}
        </button>
      ))}
    </div>
  </div>
)}`;

content = content.replace(regex, newCardRenderer);
fs.writeFileSync('src/components/Workbench.tsx', content);

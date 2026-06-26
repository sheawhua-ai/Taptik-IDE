import fs from 'fs';

let content = fs.readFileSync('src/components/SubagentChat.tsx', 'utf-8');

// remove alternatives rendering in renderMessageContent
content = content.replace(/if \(msg\.type === "alternatives" && msg\.alternativesData\) \{[\s\S]*?return \(\s*<p className="text-\[13px\] leading-relaxed/m, 'return (\n      <p className="text-[13px] leading-relaxed');

// Add rendering for alternativesModeData
const renderAlternativesMode = `  if (alternativesModeData) {
    return (
      <div className="flex flex-col h-full bg-white relative">
        <div className="h-14 border-b border-neutral-100 flex items-center justify-between px-4 bg-white/80 backdrop-blur-sm z-10 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600">
              <Sparkles size={16} />
            </div>
            <div>
              <div className="text-[14px] font-bold text-neutral-900">{alternativesModeData.title || "调整主方向"}</div>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-neutral-100 rounded-full transition-colors"
            >
              <X size={16} className="text-neutral-500" />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 bg-neutral-50/50 custom-scrollbar">
          <p className="text-[13px] text-neutral-500 mb-4">{alternativesModeData.subtitle || "已基于当前商家画像、内容目标和账号池生成替代方案"}</p>
          
          <div className="space-y-4">
            {alternativesModeData.alternatives?.map((alt: any, idx: number) => (
              <div key={idx} className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm hover:border-indigo-200 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center text-[12px] font-bold">{alt.id || ['A','B','C'][idx] || (idx + 1)}</div>
                  <h4 className="font-bold text-[14px] text-neutral-900">{alt.name}</h4>
                </div>
                <div className="bg-neutral-50 p-2.5 rounded text-[12px] text-neutral-600 mb-3 leading-relaxed">
                  <strong>说明：</strong>{alt.desc}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => {
                    setAlternativesModeData(null);
                    sendDirectMessage(\`采用方案 \${alt.id || ['A','B','C'][idx] || (idx + 1)}：\${alt.name}\`);
                  }} className="flex-1 py-1.5 bg-neutral-900 text-white text-[12px] font-medium rounded hover:bg-neutral-800">采用</button>
                  <button className="flex-1 py-1.5 bg-white border border-neutral-200 text-neutral-700 text-[12px] font-medium rounded hover:bg-neutral-50">查看更多理由</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-neutral-100 bg-white shrink-0">
          <input 
            type="text" 
            placeholder="不满意再补充要求，例如：只用 A01 和 A02..."
            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-neutral-400"
            onFocus={() => {
              setContextPill({ type: "调整方案", text: alternativesModeData.title });
              setAlternativesModeData(null);
            }}
          />
        </div>
      </div>
    );
  }`;

content = content.replace(/return \(\s*<div className="flex flex-col h-full bg-white relative">/, renderAlternativesMode + '\n\n  return (\n    <div className="flex flex-col h-full bg-white relative">');

fs.writeFileSync('src/components/SubagentChat.tsx', content);

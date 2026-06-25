import fs from 'fs';

let content = fs.readFileSync('src/components/SubagentChat.tsx', 'utf-8');

// Update Message interface
content = content.replace(
  /type\?: 'text' \| 'plan' \| 'report';/,
  `type?: 'text' | 'plan' | 'report' | 'alternatives';
  alternativesData?: {
    title: string;
    current: string;
    reason: string;
    alternatives: { name: string; desc: string }[];
  };`
);

// Update handleOpenExpert
content = content.replace(
  /const handleOpenExpert = \(e: any\) => \{[\s\S]*?\};\s*window\.addEventListener\('open-expert', handleOpenExpert\);/,
  `const handleOpenExpert = (e: any) => {
    const { expert, context, alternativesData } = e.detail || {};
    if (expert) {
      setCurrentExpert(expert);
    }
    if (alternativesData) {
      const altMsg: Message = {
        id: Math.random().toString(36).substring(2),
        role: 'agent',
        content: \`正在协同调整：\${alternativesData.title}\`,
        timestamp: new Date(),
        type: 'alternatives',
        alternativesData
      };
      setMessages(prev => [...prev, altMsg]);
    } else if (context) {
      setContextPill({ type: expert || '参考内容', text: context });
      setInputValue((prev) => prev || \`请分析这个\`);
    }
  };
  window.addEventListener('open-expert', handleOpenExpert);`
);

// Update renderMessageContent
const renderContentEndRegex = /return <p className="text-\[13px\] leading-relaxed">\{msg\.content\}<\/p>;\s*\};\s*return \(/;

content = content.replace(
  renderContentEndRegex,
  `if (msg.type === 'alternatives' && msg.alternativesData) {
      const altData = msg.alternativesData;
      return (
        <div className="space-y-4 w-full">
          <div className="text-[14px] font-bold text-neutral-900 flex items-center gap-2 mb-2">
            <Sparkles size={16} className="text-indigo-500" />
            正在协同调整：{altData.title}
          </div>
          <div className="bg-white border border-neutral-100 rounded-xl p-4 shadow-sm">
            <div className="text-[12px] font-semibold text-neutral-400 mb-1">当前方案：</div>
            <div className="text-[14px] font-bold text-neutral-900 mb-2">{altData.current}</div>
            <div className="text-[13px] text-neutral-600 bg-neutral-50 p-2.5 rounded-lg leading-relaxed">
              <strong className="text-neutral-800">理由：</strong> {altData.reason}
            </div>
          </div>

          <div>
            <div className="text-[12px] font-semibold text-neutral-400 mb-2">可替代方案：</div>
            <div className="space-y-2">
              {altData.alternatives.map((alt, idx) => (
                <div key={idx} className="p-3 border border-neutral-200 bg-white rounded-xl hover:border-indigo-300 hover:bg-indigo-50/30 transition-colors cursor-pointer group">
                  <div className="text-[13px] font-bold text-neutral-900 mb-1 group-hover:text-indigo-700">{idx + 1}. {alt.name}</div>
                  <div className="text-[12px] text-neutral-500 leading-relaxed"><strong className="text-neutral-600">适合：</strong> {alt.desc}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="pt-2">
            <div className="text-[12px] text-neutral-500 mb-2">请选择一种，或告诉我你的偏好。</div>
            <div className="space-y-2">
              <button onClick={() => { setInputValue(\`我想采用方案 1：\${altData.alternatives[0]?.name}\`); }} className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-[13px] font-medium transition-colors">采用方案 1</button>
              <button onClick={() => { setInputValue(\`让我再给一个更激进版本\`); handleSend(); }} className="w-full py-2 bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 rounded-xl text-[13px] font-medium transition-colors">让我再给一个更激进版本</button>
              <button onClick={() => { setInputValue(\`请按我的偏好重算：\`); }} className="w-full py-2 bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 rounded-xl text-[13px] font-medium transition-colors">按我的偏好重算...</button>
            </div>
          </div>
        </div>
      );
    }
    return <p className="text-[13px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>;
  };

  return (`
);

fs.writeFileSync('src/components/SubagentChat.tsx', content);

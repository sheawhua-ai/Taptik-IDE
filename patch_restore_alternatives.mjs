import fs from 'fs';

// 1. Fix ExecutionPreview.tsx
let epContent = fs.readFileSync('src/components/rings/ExecutionPreview.tsx', 'utf-8');
epContent = epContent.replace(/const \[activeAlternatives, setActiveAlternatives\] = useState<any>\(null\);\n/, '');
epContent = epContent.replace(/setActiveAlternatives\(\{ \.\.\.content, adjustType \}\);/, `window.dispatchEvent(
      new CustomEvent("open-expert", {
        detail: {
          expert: "操盘副手",
          alternativesData: { ...content, adjustType },
        },
      }),
    );`);
// Remove modal
epContent = epContent.replace(/<AnimatePresence>[\s\S]*?<\/AnimatePresence>/, '');
fs.writeFileSync('src/components/rings/ExecutionPreview.tsx', epContent);

// 2. Fix App.tsx
let appContent = fs.readFileSync('src/App.tsx', 'utf-8');
if (!appContent.includes('pendingAlternatives')) {
  appContent = appContent.replace(
    /const \[pendingContext, setPendingContext\] = useState<string \| undefined>\(\);/,
    `const [pendingContext, setPendingContext] = useState<string | undefined>();
  const [pendingAlternatives, setPendingAlternatives] = useState<any>();`
  );
  appContent = appContent.replace(
    /const \{ expert, context \} = e\.detail \|\| \{\};\n\s*if \(expert\) setPendingExpert\(expert\);\n\s*if \(context\) setPendingContext\(context\);\n\s*setShowSubagentChat\(true\);\n\s*setIsSidebarCollapsed\(true\);/,
    `const { expert, context, alternativesData } = e.detail || {};
    if (expert) setPendingExpert(expert);
    if (context) setPendingContext(context);
    if (alternativesData) setPendingAlternatives(alternativesData);
    setShowSubagentChat(true);
    setIsSidebarCollapsed(true);`
  );
  appContent = appContent.replace(
    /initialExpert=\{pendingExpert\}\n\s*initialContext=\{pendingContext\}\n\s*onClose=\{\(\) => \{\n\s*setShowSubagentChat\(false\);\n\s*setPendingExpert\(undefined\);\n\s*setPendingContext\(undefined\);\n\s*\}\}/,
    `initialExpert={pendingExpert}
                        initialContext={pendingContext}
                        initialAlternatives={pendingAlternatives}
                        onClose={() => {
                          setShowSubagentChat(false);
                          setPendingExpert(undefined);
                          setPendingContext(undefined);
                          setPendingAlternatives(undefined);
                        }}`
  );
  fs.writeFileSync('src/App.tsx', appContent);
}

// 3. Fix SubagentChat.tsx
let chatContent = fs.readFileSync('src/components/SubagentChat.tsx', 'utf-8');
if (!chatContent.includes('initialAlternatives')) {
  chatContent = chatContent.replace(
    /initialContext\?: string;/,
    `initialContext?: string;
  initialAlternatives?: any;`
  );

  chatContent = chatContent.replace(
    /initialContext,/,
    `initialContext,
  initialAlternatives,`
  );

  chatContent = chatContent.replace(
    /const \[customGreeting, setCustomGreeting\] = useState<string \| null>\(null\);/,
    `const [customGreeting, setCustomGreeting] = useState<string | null>(null);
  const [alternativesModeData, setAlternativesModeData] = useState<any>(null);`
  );

  chatContent = chatContent.replace(
    /useEffect\(\(\) => \{\n\s*if \(initialExpert\) setCurrentExpert\(initialExpert\);\n\s*if \(initialContext\) \{\n\s*setContextPill\(\{\n\s*type: initialExpert \|\| "参考内容",\n\s*text: initialContext,\n\s*\}\);\n\s*setInputValue\(\(prev\) => prev \|\| \`请分析这个\`\);\n\s*\}\n\s*\}, \[initialExpert, initialContext\]\);/,
    `useEffect(() => {
    if (initialExpert) setCurrentExpert(initialExpert);
    if (initialAlternatives) {
      setAlternativesModeData(initialAlternatives);
    } else if (initialContext) {
      setContextPill({
        type: initialExpert || "参考内容",
        text: initialContext,
      });
      setInputValue((prev) => prev || \`请分析这个\`);
    }
  }, [initialExpert, initialContext, initialAlternatives]);`
  );

  // handleOpenExpert modification
  chatContent = chatContent.replace(
    /const \{ expert, context \} = e\.detail \|\| \{\};\n\s*if \(expert\) \{\n\s*setCurrentExpert\(expert\);\n\s*\}/,
    `const { expert, context, alternativesData } = e.detail || {};
      if (expert) {
        setCurrentExpert(expert);
      }
      if (alternativesData) {
        setAlternativesModeData(alternativesData);
        return;
      }`
  );

  const alternativesJsx = `  if (alternativesModeData) {
    return (
      <div className="flex flex-col h-full bg-white relative w-full overflow-hidden">
        <div className="h-14 border-b border-neutral-100 flex items-center justify-between px-4 bg-white/80 backdrop-blur-sm z-10 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
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
                    window.dispatchEvent(
                        new CustomEvent("adopt-alternative", {
                          detail: {
                            adjustType: alternativesModeData.adjustType,
                            name: alt.name,
                          },
                        }),
                      );
                  }} className="flex-1 py-1.5 bg-neutral-900 text-white text-[12px] font-medium rounded hover:bg-neutral-800">采用</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-neutral-100 bg-white shrink-0">
          <button
            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 text-neutral-500 rounded-xl text-[13px] hover:bg-neutral-100 transition-all text-left flex items-center gap-2"
            onClick={() => {
              setContextPill({ type: "调整方案", text: alternativesModeData.title });
              setAlternativesModeData(null);
            }}
          >
            <PenTool size={14} className="text-neutral-400" />
            都不满意？呼叫副手手动输入新要求...
          </button>
        </div>
      </div>
    );
  }

  return (`;

  chatContent = chatContent.replace(/return \(\s*<div className="flex flex-col h-full bg-white w-full overflow-hidden relative">/, alternativesJsx + '\n    <div className="flex flex-col h-full bg-white w-full overflow-hidden relative">');

  fs.writeFileSync('src/components/SubagentChat.tsx', chatContent);
}

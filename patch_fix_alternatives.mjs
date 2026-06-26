import fs from 'fs';

let appContent = fs.readFileSync('src/App.tsx', 'utf-8');

appContent = appContent.replace(
  /const \[pendingContext, setPendingContext\] = useState<string \| undefined>\(\);/,
  `const [pendingContext, setPendingContext] = useState<string | undefined>();
  const [pendingAlternatives, setPendingAlternatives] = useState<any>();`
);

appContent = appContent.replace(
  /const handleOpenExpertApp = \(e: any\) => \{\n\s*const \{ expert, context \} = e\.detail \|\| \{\};\n\s*if \(expert\) setPendingExpert\(expert\);\n\s*if \(context\) setPendingContext\(context\);\n\s*setShowSubagentChat\(true\);\n\s*setIsSidebarCollapsed\(true\);\n\s*\};/,
  `const handleOpenExpertApp = (e: any) => {
    const { expert, context, alternativesData } = e.detail || {};
    if (expert) setPendingExpert(expert);
    if (context) setPendingContext(context);
    if (alternativesData) setPendingAlternatives(alternativesData);
    setShowSubagentChat(true);
    setIsSidebarCollapsed(true);
  };`
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

let chatContent = fs.readFileSync('src/components/SubagentChat.tsx', 'utf-8');

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

fs.writeFileSync('src/components/SubagentChat.tsx', chatContent);

import fs from 'fs';

let content = fs.readFileSync('src/components/SubagentChat.tsx', 'utf-8');

content = content.replace(
/const handleOpenExpert = \(e: any\) => \{\n\s*const \{ expert, context, alternativesData \} = e\.detail \|\| \{\};\n\s*if \(expert\) \{\n\s*setCurrentExpert\(expert\);\n\s*\}\n\s*if \(alternativesData\) \{\n\s*setAlternativesModeData\(alternativesData\);\n\s*return;\n\s*\} else if \(context\) \{\n\s*setContextPill\(\{ type: expert \|\| "参考内容", text: context \}\);\n\s*setInputValue\(\(prev\) => prev \|\| \`请分析这个\`\);\n\s*\}\n\s*\};/,
`const handleOpenExpert = (e: any) => {
      const { expert, context, alternativesData } = e.detail || {};
      if (expert) {
        setCurrentExpert(expert);
      }
      if (alternativesData) {
        setAlternativesModeData(alternativesData);
        return;
      } else {
        setAlternativesModeData(null);
        if (context) {
          setContextPill({ type: expert || "参考内容", text: context });
          setInputValue((prev) => prev || \\\`请分析这个\\\`);
        }
      }
    };`
);

content = content.replace(
/if \(initialAlternatives\) \{\n\s*setAlternativesModeData\(initialAlternatives\);\n\s*\} else if \(initialContext\) \{\n\s*setContextPill\(\{\n\s*type: initialExpert \|\| "参考内容",\n\s*text: initialContext,\n\s*\}\);\n\s*setInputValue\(\(prev\) => prev \|\| \`请分析这个\`\);\n\s*\}/,
`if (initialAlternatives) {
      setAlternativesModeData(initialAlternatives);
    } else {
      setAlternativesModeData(null);
      if (initialContext) {
        setContextPill({
          type: initialExpert || "参考内容",
          text: initialContext,
        });
        setInputValue((prev) => prev || \\\`请分析这个\\\`);
      }
    }`
);

fs.writeFileSync('src/components/SubagentChat.tsx', content);

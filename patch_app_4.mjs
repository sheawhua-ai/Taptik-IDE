import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');

content = content.replace(
/const handleOpenExpertApp = \(e: any\) => \{\n\s*const \{ expert, context, alternativesData \} = e\.detail \|\| \{\};\n\s*if \(expert\) setPendingExpert\(expert\);\n\s*if \(context\) setPendingContext\(context\);\n\s*if \(alternativesData\) setPendingAlternatives\(alternativesData\);\n\s*setShowSubagentChat\(true\);\n\s*setIsSidebarCollapsed\(true\);\n\s*\};/,
`const handleOpenExpertApp = (e: any) => {
      const { expert, context, alternativesData } = e.detail || {};
      if (expert) setPendingExpert(expert);
      if (context) setPendingContext(context);
      if (alternativesData) {
        setPendingAlternatives(alternativesData);
      } else {
        setPendingAlternatives(undefined);
      }
      setShowSubagentChat(true);
      setIsSidebarCollapsed(true);
    };`
);

fs.writeFileSync('src/App.tsx', content);

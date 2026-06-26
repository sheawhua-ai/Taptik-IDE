import fs from 'fs';

let appContent = fs.readFileSync('src/App.tsx', 'utf-8');
appContent = appContent.replace(/const \[pendingAlternatives, setPendingAlternatives\] = useState<any>\(\);\n\s*/, '');
appContent = appContent.replace(/if \(alternativesData\) setPendingAlternatives\(alternativesData\);\n\s*/, '');
appContent = appContent.replace(/initialAlternatives=\{pendingAlternatives\}\n\s*/, '');
appContent = appContent.replace(/setPendingAlternatives\(undefined\);\n\s*/, '');
fs.writeFileSync('src/App.tsx', appContent);

let chatContent = fs.readFileSync('src/components/SubagentChat.tsx', 'utf-8');
chatContent = chatContent.replace(/initialAlternatives\?: any;\n\s*/, '');
chatContent = chatContent.replace(/initialAlternatives,\n\s*/, '');
chatContent = chatContent.replace(/const \[alternativesModeData, setAlternativesModeData\] = useState<any>\(null\);\n\s*/, '');

chatContent = chatContent.replace(/if \(alternativesModeData\) \{[\s\S]*?return \(\s*<div className="flex flex-col h-full bg-white relative w-full overflow-hidden">/, '  return (\n    <div className="flex flex-col h-full bg-white w-full overflow-hidden relative">');
chatContent = chatContent.replace(/if \(alternativesModeData\) \{[\s\S]*?return \(\s*<div className="flex flex-col h-full bg-white w-full overflow-hidden relative">/, '  return (\n    <div className="flex flex-col h-full bg-white w-full overflow-hidden relative">');

chatContent = chatContent.replace(/if \(initialAlternatives\) \{\n\s*setAlternativesModeData\(initialAlternatives\);\n\s*\} else /, '');
chatContent = chatContent.replace(/, initialAlternatives/g, '');

fs.writeFileSync('src/components/SubagentChat.tsx', chatContent);

import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');

const oldTabsRegex = /const PROJECT_TABS = \[\s*\{\s*id: "strategy"[\s\S]*?\];/;
const newTabs = `const PROJECT_TABS = [
  { id: "strategy", name: "操盘建议", icon: Compass },
  { id: "matrix", name: "项目与内容", icon: LayoutGrid },
  { id: "content", name: "账号与发布", icon: Sparkles },
  { id: "interaction", name: "风险与待办", icon: MessageSquare },
  { id: "metrics", name: "数据与机会", icon: BarChart2 },
];`;
content = content.replace(oldTabsRegex, newTabs);

if (!content.includes('import { MerchantMemoryHeader }')) {
  content = content.replace(
    /import \{ Layout \} from "\.\/components\/Layout";/,
    `import { Layout } from "./components/Layout";\nimport { MerchantMemoryHeader } from "./components/MerchantMemoryHeader";`
  );
}

const workflowStartRegex = /\{\/\* 顶部导航与专注模式 \*\/\}/;
if (!content.includes('<MerchantMemoryHeader')) {
  content = content.replace(
    workflowStartRegex,
    `{/* 商家记忆固定区域 */}\n            <MerchantMemoryHeader hasData={hasData} onboardingData={onboardingData} activeProjectId={activeProjectId} projectName={activeProject?.name || "未知项目"} setWorkflowTab={setWorkflowTab} />\n\n            {/* 顶部导航与专注模式 */}`
  );
}

fs.writeFileSync('src/App.tsx', content);

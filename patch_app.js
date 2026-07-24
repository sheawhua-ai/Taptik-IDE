import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');

// 1. Add imports
const imports = `import { AccountAssets } from "./components/merchant/AccountAssets";
import { BlueOcean } from "./components/merchant/BlueOcean";
import { TopicStrategy } from "./components/merchant/TopicStrategy";
import { Compass, Users, Hash } from "lucide-react";\n`;

content = content.replace('import { ProjectCenter } from "./components/merchant/ProjectCenter";', 'import { ProjectCenter } from "./components/merchant/ProjectCenter";\n' + imports);

// 2. Update PROJECT_TABS
const newTabs = `const PROJECT_TABS = [
  { id: "projects", name: "项目中心", icon: FolderKanban },
  { id: "execution", name: "执行中心", icon: LayoutGrid },
  { id: "accounts", name: "账号资产", icon: Users },
  { id: "blueocean", name: "蓝海词发掘", icon: Compass },
  { id: "topics", name: "话题与策略", icon: Hash },
  { id: "review", name: "AI复盘", icon: Sparkles },
];`;

content = content.replace(/const PROJECT_TABS = \[\s*\{\s*id:\s*"projects"[\s\S]*?\];/, newTabs);

// 3. Add components to the switch statement / render area
const renderAreaRegex = /\{\s*workflowTab === "projects" \? \([\s\S]*?\}\s*<\/div>\s*<\/div>/;

const renderAreaReplacement = `{workflowTab === "projects" && (
                      <ProjectCenter
                        hasData={hasData}
                        activeProjectId={activeProjectId}
                        setWorkflowTab={setWorkflowTab as any}
                      />
                    )}
                    {workflowTab === "execution" && (
                      <div className="flex-1 flex flex-col bg-white overflow-hidden p-8">
                         <h2 className="text-xl font-bold">执行中心 (占位)</h2>
                      </div>
                    )}
                    {workflowTab === "review" && (
                      <div className="flex-1 flex flex-col bg-white overflow-hidden p-8">
                         <h2 className="text-xl font-bold">AI复盘 (占位)</h2>
                      </div>
                    )}
                    {workflowTab === "accounts" && <AccountAssets />}
                    {workflowTab === "blueocean" && <BlueOcean />}
                    {workflowTab === "topics" && <TopicStrategy />}
                  </div>
                </div>`;

// Wait, I should probably check how it is currently rendered.

import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const target = `const PROJECT_TABS = [
  { id: "projects", name: "项目中心", icon: FolderKanban },
  { id: "execution", name: "执行中心", icon: LayoutGrid },
  { id: "accounts", name: "账号资产", icon: Users },
  { id: "blueocean", name: "蓝海词发掘", icon: Compass },
  { id: "topics", name: "话题与策略", icon: Hash },
  { id: "review", name: "AI复盘", icon: Sparkles },
];`;

const replacement = `const PROJECT_TABS = [
  { id: "projects", name: "项目中心", icon: FolderKanban },
  { id: "execution", name: "执行中心", icon: LayoutGrid },
  { id: "accounts", name: "账号资产", icon: Users },
  { id: "review", name: "AI复盘", icon: Sparkles },
];`;

content = content.replace(target, replacement);

fs.writeFileSync('src/App.tsx', content);

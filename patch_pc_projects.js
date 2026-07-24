import fs from 'fs';
let content = fs.readFileSync('src/components/merchant/ProjectCenter.tsx', 'utf-8');

// Change const projects = MOCK_PROJECTS; to state
content = content.replace(
  'const projects = MOCK_PROJECTS;',
  'const [projects, setProjects] = useState(MOCK_PROJECTS);'
);

// Update onClick
const targetBtn = '<button onClick={() => { alert("向后端请求创建项目..."); setDrawerType(null); }} className="flex-1 py-2.5 bg-neutral-900 text-white text-[13px] font-bold rounded-xl hover:bg-neutral-800">确认并创建项目</button>';
const replacementBtn = '<button onClick={() => { setProjects(projects.map(p => p.id === currentProject.id ? { ...p, status: "进行中", recommendedAction: "none" } : p)); setDrawerType(null); }} className="flex-1 py-2.5 bg-neutral-900 text-white text-[13px] font-bold rounded-xl hover:bg-neutral-800">确认并创建项目</button>';

content = content.replace(targetBtn, replacementBtn);

fs.writeFileSync('src/components/merchant/ProjectCenter.tsx', content);

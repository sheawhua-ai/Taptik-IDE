import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Find the CreateProjectModal usage
const target = `<CreateProjectModal
        isOpen={isCreateProjectModalOpen}
        onClose={() => setIsCreateProjectModalOpen(false)}
      />`;

const replacement = `<CreateProjectModal
        isOpen={isCreateProjectModalOpen}
        onClose={() => setIsCreateProjectModalOpen(false)}
        onCreate={(type) => {
          const newId = \`project-\${Date.now()}\`;
          MOCK_PROJECTS[newId] = {
            id: newId,
            name: "未命名新项目",
            isNew: true,
            lastModified: "刚刚",
            agentStatus: "idle",
            role: "brand",
          };
          setActiveProjectId(newId);
          setIsCreateProjectModalOpen(false);
          // Optional: also switch tab to 'projects' or trigger some notification
        }}
      />`;

content = content.replace(target, replacement);
fs.writeFileSync('src/App.tsx', content);

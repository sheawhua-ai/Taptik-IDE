import fs from 'fs';
let content = fs.readFileSync('src/components/merchant/ProjectCenter.tsx', 'utf-8');

const oldDraftMap = `                {drafts.map(proj => (
                  <div
                    key={proj.id}
                    onClick={() => setSelectedProjectId(proj.id)}
                    className={\`p-3 rounded-xl border cursor-pointer transition-all \${
                      selectedProjectId === proj.id
                        ? "bg-white border-primary-300 shadow-sm ring-1 ring-primary-100"
                        : "bg-white border-neutral-200 hover:border-neutral-300 hover:shadow-sm"
                    }\`}
                  >
                    <div className="text-[13px] font-bold text-neutral-900 mb-1 leading-snug">{proj.name}</div>`;

const newDraftMap = `                {drafts.map(proj => (
                  <div
                    key={proj.id}
                    onClick={() => setSelectedProjectId(proj.id)}
                    className={\`group relative p-3 rounded-xl border cursor-pointer transition-all \${
                      selectedProjectId === proj.id
                        ? "bg-white border-primary-300 shadow-sm ring-1 ring-primary-100"
                        : "bg-white border-neutral-200 hover:border-neutral-300 hover:shadow-sm"
                    }\`}
                  >
                    {proj.id.startsWith('new-') && (
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          const newProjects = projects.filter(p => p.id !== proj.id);
                          setProjects(newProjects);
                          if (selectedProjectId === proj.id && newProjects.length > 0) {
                            setSelectedProjectId(newProjects[0].id);
                          }
                        }} 
                        className="absolute right-2 top-2 p-1 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                        title="删除项目"
                      >
                        <X size={14} />
                      </button>
                    )}
                    <div className="text-[13px] font-bold text-neutral-900 mb-1 leading-snug pr-6">{proj.name}</div>`;

content = content.replace(oldDraftMap, newDraftMap);

const oldFormalsMap = `                formals.map(proj => (
                  <div
                    key={proj.id}
                    onClick={() => setSelectedProjectId(proj.id)}
                    className={\`p-3 rounded-xl border cursor-pointer transition-all \${
                      selectedProjectId === proj.id
                        ? "bg-white border-neutral-400 shadow-sm ring-1 ring-neutral-200"
                        : "bg-white border-neutral-200 hover:border-neutral-300 hover:shadow-sm"
                    }\`}
                  >
                    <div className="text-[13px] font-bold text-neutral-900 mb-1 leading-snug">{proj.name}</div>`;

const newFormalsMap = `                formals.map(proj => (
                  <div
                    key={proj.id}
                    onClick={() => setSelectedProjectId(proj.id)}
                    className={\`group relative p-3 rounded-xl border cursor-pointer transition-all \${
                      selectedProjectId === proj.id
                        ? "bg-white border-neutral-400 shadow-sm ring-1 ring-neutral-200"
                        : "bg-white border-neutral-200 hover:border-neutral-300 hover:shadow-sm"
                    }\`}
                  >
                    {proj.id.startsWith('new-') && (
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          const newProjects = projects.filter(p => p.id !== proj.id);
                          setProjects(newProjects);
                          if (selectedProjectId === proj.id && newProjects.length > 0) {
                            setSelectedProjectId(newProjects[0].id);
                          }
                        }} 
                        className="absolute right-2 top-2 p-1 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                        title="删除项目"
                      >
                        <X size={14} />
                      </button>
                    )}
                    <div className="text-[13px] font-bold text-neutral-900 mb-1 leading-snug pr-6">{proj.name}</div>`;

content = content.replace(oldFormalsMap, newFormalsMap);
fs.writeFileSync('src/components/merchant/ProjectCenter.tsx', content);

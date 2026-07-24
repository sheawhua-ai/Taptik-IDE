import fs from 'fs';
let content = fs.readFileSync('src/components/merchant/ProjectCenter.tsx', 'utf-8');

const target = `                      setProjects([{
                        id: newId,
                        name: name,
                        status: "执行",
                        target: target,
                        blocker: "AI策略已确认，正在生成第一批内容草稿",
                        aiActionCard: null,
                        recommendedAction: "none",
                        pendingCount: 0
                      } as any, ...projects]);
                      setSelectedProjectId(newId);
                      setDrawerType(null);
                      setCreateProjectStep(1);
                      setCreateKbStatus("idle");`;

const replacement = `                      setProjects(prev => [{
                        id: newId,
                        name: name,
                        status: "执行",
                        target: target,
                        stage: "第一批内容草稿生成中",
                        keyProgress: "策略已拆解，正在生成内容...",
                        blocker: "无",
                        aiActionCard: null,
                        recommendedAction: "none",
                        pendingCount: 0
                      } as any, ...prev]);
                      setSelectedProjectId(newId);
                      setDrawerType(null);
                      setCreateProjectStep(1);
                      setCreateKbStatus("idle");
                      
                      // Simulate an anomaly after 3 seconds
                      setTimeout(() => {
                         setProjects(prev => prev.map(p => p.id === newId ? {
                            ...p,
                            stage: "第一批内容审核",
                            keyProgress: "已生成 15 篇笔记",
                            blocker: "存在2篇内容包含违禁词风险",
                            pendingCount: 2,
                            primaryActionText: "处理风险提示",
                            recommendedAction: "handle_anomaly"
                         } : p));
                      }, 3000);`;

content = content.replace(target, replacement);
fs.writeFileSync('src/components/merchant/ProjectCenter.tsx', content);

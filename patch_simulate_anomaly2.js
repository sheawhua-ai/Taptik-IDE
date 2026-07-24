import fs from 'fs';
let content = fs.readFileSync('src/components/merchant/ProjectCenter.tsx', 'utf-8');

const target = `                            primaryActionText: "处理风险提示",
                            recommendedAction: "handle_anomaly"`;
const replacement = `                            primaryActionText: "处理风险提示",
                            recommendedAction: "handle_anomaly",
                            aiActionCard: {
                              title: "2篇笔记含违禁词风险",
                              reason: "发现“全网最低”、“最强”等平台疑似违禁词汇",
                              impact: "不处理将导致发布受阻或账号受限"
                            }`;
content = content.replace(target, replacement);

fs.writeFileSync('src/components/merchant/ProjectCenter.tsx', content);

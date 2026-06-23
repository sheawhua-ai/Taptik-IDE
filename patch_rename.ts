import fs from 'fs';

let code = fs.readFileSync('src/pages/MerchantMatrix.tsx', 'utf8');

// 1. the KPIs
// Data definition
code = code.replace(/kpis: \{ views: '124k', engagement: '8\.2k', leads: '¥3\.20' \}/, "kpis: { generated: '45/100', dispatched: '12', pending: '33' }");
code = code.replace(/kpis: \{ views: '890k', engagement: '45k', leads: '¥1\.27' \}/, "kpis: { generated: '120/120', dispatched: '120', pending: '0' }");

// Render mapping in UI
const kpiRegex = /<div className="flex flex-col gap-2 px-4 border-l-2 border-neutral-50 shrink-0">\s*<div className="flex items-center justify-between gap-6">\s*<span className="text-\[10px\] font-black text-neutral-400 tracking-widest">曝光<\/span>\s*<span className="text-\[13px\] font-black text-neutral-900">\{project\.kpis\.views\}<\/span>\s*<\/div>\s*<div className="flex items-center justify-between gap-6">\s*<span className="text-\[10px\] font-black text-neutral-400 tracking-widest">互动<\/span>\s*<span className="text-\[13px\] font-black text-neutral-900">\{project\.kpis\.engagement\}<\/span>\s*<\/div>\s*<div className="flex items-center justify-between gap-6">\s*<span className="text-\[10px\] font-black text-neutral-400 tracking-widest">CPE<\/span>\s*<span className="text-\[13px\] font-black text-primary-500">\{project\.kpis\.leads\}<\/span>\s*<\/div>\s*<\/div>/;

const kpiReplace = `<div className="flex flex-col gap-2 px-4 border-l-2 border-neutral-50 shrink-0">
                   <div className="flex items-center justify-between gap-6">
                     <span className="text-[10px] font-black text-neutral-400 tracking-widest">生成进度</span>
                     <span className="text-[13px] font-black text-neutral-900">{project.kpis.generated}</span>
                   </div>
                   <div className="flex items-center justify-between gap-6">
                     <span className="text-[10px] font-black text-neutral-400 tracking-widest">已下发素材</span>
                     <span className="text-[13px] font-black text-neutral-900">{project.kpis.dispatched}</span>
                   </div>
                   <div className="flex items-center justify-between gap-6">
                     <span className="text-[10px] font-black text-neutral-400 tracking-widest">待分配账号</span>
                     <span className="text-[13px] font-black text-primary-500">{project.kpis.pending}</span>
                   </div>
                </div>`;

code = code.replace(kpiRegex, kpiReplace);


// 2. Text changes
code = code.replace(/项目内容生产车间/g, '内容审核与下发中心');
code = code.replace(/批量成稿批次/g, '内容排队与发布分发');
code = code.replace(/批量构建笔记初稿/g, '获取云端分配队列...');
code = code.replace(/正在调用知识库防查重与敏感词过滤引擎/g, '正在同步生成中心数据，获取待审核分发物料');
code = code.replace(/已完成撰写，请确认配图并分配到待分发素材库。/g, '已通过敏感词校验且就绪，请审核分发。通过扫码绑定员工/达人设备即可一键发布，防风控安全分发。');
code = code.replace(/<PenTool size=\{14\} \/>\s*成稿车间/g, '<PenTool size={14} />\n                     内容审核与分发\n');


// 3. Remove "手动增加排期"
const addPeriodRegex = /<button onClick=\{handleAddPeriod\} className="w-full py-5 border-2 border-dashed border-neutral-200 rounded-\[24px\] text-\[13px\] font-black text-neutral-400 hover:border-neutral-300 hover:bg-neutral-50 transition-colors">\s*\+ 手动增加周期排期\s*<\/button>/;
code = code.replace(addPeriodRegex, '');

fs.writeFileSync('src/pages/MerchantMatrix.tsx', code);

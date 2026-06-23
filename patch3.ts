import fs from 'fs';

let code = fs.readFileSync('src/pages/MerchantMatrix.tsx', 'utf8');

const replacement = `{activeTab === 'tasks' && (
  <div className="space-y-4 max-w-5xl mx-auto">
    <div className="flex items-center justify-between mb-4">
      <div>
        <div className="text-[16px] font-medium text-neutral-900 flex items-center gap-2">
          {project.targetGroup === 'internal' ? '内部素材发包任务 (合并同类项)' : '外部KOC素人派单平台 (按单篇领取)'}
          <span className="px-2 py-0.5 bg-primary-50 text-primary-600 text-[11px] rounded-full">由笔记自动分类提炼</span>
        </div>
        <div className="text-[12px] text-neutral-500 mt-1">
          {project.targetGroup === 'internal' 
            ? '自动分析本周笔记规划，合并同类素材需求，直接通过企微指派给内部员工。'
            : '单篇笔记生成专属任务。素人扫码认领并回传素材，AI自动审核并即刻同步至小红书发布，全程无人化流转。'}
        </div>
      </div>
      {project.targetGroup === 'external' ? (
        <button onClick={() => setShowQrModal(project.id)} className="px-5 py-2.5 bg-primary-500 text-white rounded-[14px] text-[13px] font-medium flex items-center gap-2 shadow-lg hover:bg-primary-600 active:scale-95 transition-all tooltip" title="向所有素人库群发">
          <QrCode size={16} /> 生成专属任务池认领码
        </button>
      ) : null}
    </div>
    
    {(project.targetGroup === 'internal' ? INTERNAL_TASKS : EXTERNAL_TASKS).map(task => (
      <div key={task.id} className="bg-white rounded-2xl border border-neutral-200 p-6 flex flex-col lg:flex-row lg:items-start gap-6 shadow-sm hover:shadow-md transition-shadow">
        <div className={\`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner \${task.status === 'AI审核通过待发布' ? 'bg-gradient-to-b from-emerald-50 to-emerald-100/50 text-emerald-500' : task.status === '待领取' ? 'bg-gradient-to-b from-neutral-50 to-neutral-100/50 text-neutral-500' : task.status === '执行中' ? 'bg-gradient-to-b from-blue-50 to-blue-100/50 text-blue-500' : 'bg-gradient-to-b from-amber-50 to-amber-100/50 text-amber-500'}\`}>
          {task.status === 'AI审核通过待发布' ? <CheckSquare size={24}/> : task.status === '执行中' ? <Camera size={24} /> : <Target size={24} />}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h4 className="text-[16px] font-semibold text-neutral-900">{task.name}</h4>
            {project.targetGroup === 'internal' ? (
              <button className="bg-neutral-100 transition-colors text-neutral-600 text-[11px] px-2 py-0.5 rounded-full flex items-center gap-1 font-medium group tooltip" title="由多篇笔记的视觉需求合并而来">
                <Layers size={12} /> 来源于 {(task as any).mergedFrom} 篇笔记
              </button>
            ) : (
                <div className="text-[12px] bg-primary-50 border border-primary-100 text-primary-600 px-2 py-0.5 rounded-full font-medium flex items-center gap-1"><PenTool size={12}/> 绑定：{(task as any).noteTarget}</div>
            )}
            <span className={\`text-[11px] px-2 py-0.5 rounded-full uppercase tracking-widest border \${task.status === 'AI审核通过待发布' ? 'border-emerald-200 bg-emerald-50 text-emerald-600' : task.status === '待领取' ? 'border-neutral-200 bg-neutral-50 text-neutral-600' : task.status === '执行中' ? 'border-blue-200 bg-blue-50 text-blue-600' : 'border-amber-200 bg-amber-50 text-amber-600'}\`}>
              {task.status}
            </span>
          </div>
          <div className="bg-neutral-50/80 rounded-xl p-3 mb-4 border border-neutral-100">
            <div className="flex items-start gap-2">
              <Bot size={14} className="text-primary-500 shrink-0 mt-0.5" />
              <p className="text-[13px] text-neutral-600 leading-relaxed font-medium">{task.require}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-[13px]">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 rounded-lg text-neutral-600 border border-neutral-200">
              <ImageIcon size={14} /> 需回传 {task.count} 张素材
            </div>
            {task.status === 'AI审核通过待发布' ? (
              <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-lg tooltip" title="已列入发布排期序列">
                <CheckCircle2 size={14} /> AI判定合格，内容已直发
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-neutral-500 bg-neutral-50 px-3 py-1.5 rounded-lg">
                <CalendarClock size={14} /> 截止时间: 本周五 18:00
              </div>
            )}
          </div>
        </div>
        <div className="lg:border-l lg:border-neutral-100 lg:pl-8 flex flex-col items-end gap-5 shrink-0 w-full lg:w-[220px]">
          <div className="text-right w-full relative group cursor-pointer" onMouseEnter={() => setShowProgressHover(task.id)} onMouseLeave={() => setShowProgressHover(null)}>
            <div className="flex justify-between items-center lg:block bg-neutral-50 lg:bg-transparent p-3 lg:p-0 rounded-xl">
              <div className="text-[11px] text-neutral-400 font-medium mb-1 flex items-center gap-1 lg:justify-end">
                素材回传进度 <AlertCircle size={12} className="text-neutral-300 group-hover:text-primary-400 transition-colors"/>
              </div>
              <div className={\`text-[28px] font-mono font-medium transition-colors leading-none \${task.current >= task.count ? 'text-emerald-500' : 'text-neutral-900'}\`}>{task.current} <span className="text-neutral-400 text-[18px]">/ {task.count}</span></div>
            </div>
          </div>
          <div className="flex flex-col gap-2.5 w-full">
            {task.status === 'AI审核通过待发布' ? (
              <button onClick={() => setShowAuditModal(task.id)} className="w-full py-2.5 bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 rounded-xl text-[12px] font-medium transition-colors whitespace-nowrap flex items-center justify-center gap-1.5">
                <CheckSquare size={14} /> 查看AI校验报告
              </button>
            ) : task.status === '执行中' ? (
              <button onClick={() => {
                 setToastMessage(\`已向 \${task.assignee.split(' ')[0]} 发送催办提醒。\`);
                 setTimeout(() => setToastMessage(""), 2000);
              }} className="w-full py-2.5 bg-neutral-900 text-white hover:bg-black rounded-xl text-[12px] font-medium transition-all shadow hover:shadow-md whitespace-nowrap flex items-center justify-center gap-1.5">
                <MessageSquare size={14} /> 催办执行进度
              </button>
            ) : project.targetGroup === 'internal' ? (
              <>
                <button onClick={() => setShowAssignModal(task.id)} className="w-full py-2.5 bg-neutral-900 text-white hover:bg-black rounded-xl text-[12px] font-medium transition-all shadow hover:shadow-md whitespace-nowrap flex items-center justify-center gap-1.5">
                  <Users size={14} /> 匹配内部分配
                </button>
              </>
            ) : (
                <button onClick={() => {
                   setToastMessage("系统已再次将该笔记任务推送至素人达人库");
                   setTimeout(() => setToastMessage(""), 2000);
                }} className="w-full py-2.5 border border-primary-200 bg-primary-50 text-primary-600 hover:bg-primary-100 rounded-xl text-[12px] font-medium transition-colors whitespace-nowrap flex items-center justify-center gap-1.5 tooltip" title="向素人大厅重新曝光">
                  <RefreshCw size={14}/> 推送至任务大厅
                </button>
            )}
          </div>
        </div>
      </div>
    ))}
  </div>
)}
</div>
 </div>
 </div>
 </div>
 
 </>;`;

const startIdx = code.indexOf("{activeTab === 'tasks' && (");
const endStr = "</> );";
const endIdx = code.indexOf(endStr, startIdx);

if (startIdx !== -1 && endIdx !== -1) {
  code = code.substring(0, startIdx) + replacement + code.substring(endIdx + endStr.length);
  fs.writeFileSync('src/pages/MerchantMatrix.tsx', code);
  console.log('Patched');
} else {
  console.log('Indexes not found', startIdx, endIdx);
}

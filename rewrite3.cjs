const fs = require('fs');
let content = fs.readFileSync('src/components/merchant/CreateProjectWorkstation.tsx', 'utf8');

// Update InitialView
content = content.replace(
`function InitialView({ intent, setIntent, onGenerate, onOpenAvailableScope, generating }: any) {
  return (
    <div className="max-w-3xl mx-auto py-20 px-6">
      <div className="mb-6">
        <h1 className="text-[28px] font-extrabold text-neutral-900 mb-2 tracking-tight">这轮最想解决什么问题？</h1>
        <p className="text-[14px] text-neutral-500">
          告诉我问题、希望看到的变化，以及时间或预算限制。我先整理一版可修改的项目草案。
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden mb-6 focus-within:border-primary-400 focus-within:ring-4 focus-within:ring-primary-50 transition-all relative flex flex-col">
        <textarea
          value={intent}
          onChange={e => setIntent(e.target.value)}
          placeholder="例如：换粮内容有收藏，但咨询很少。准备做一轮店长号和消费者共创，两周内完成，预算5000元。希望验证真实换粮过程和专业解释能不能提升有效咨询。"
          className="w-full h-[240px] resize-none outline-none p-6 text-[15px] leading-relaxed text-neutral-900 placeholder:text-neutral-300"
        />
        
        {intent && (
          <div className="px-6 pb-4 flex flex-wrap gap-2">
            <span className="px-2.5 py-1 bg-primary-50 text-primary-700 text-[12px] font-bold rounded-lg border border-primary-100 flex items-center gap-1"><Target size={12}/> 提升有效咨询</span>
            <span className="px-2.5 py-1 bg-primary-50 text-primary-700 text-[12px] font-bold rounded-lg border border-primary-100 flex items-center gap-1"><Calendar size={12}/> 14天</span>
            <span className="px-2.5 py-1 bg-primary-50 text-primary-700 text-[12px] font-bold rounded-lg border border-primary-100 flex items-center gap-1">¥ 5000元</span>
            <span className="px-2.5 py-1 bg-primary-50 text-primary-700 text-[12px] font-bold rounded-lg border border-primary-100 flex items-center gap-1"><Users size={12}/> KOC / 店长号</span>
          </div>
        )}
        
        <div className="px-6 py-4 border-t border-neutral-100 flex items-center justify-between bg-neutral-50/50">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1.5 text-[13px] font-bold text-neutral-500 hover:text-neutral-900 transition-colors">
              <Plus size={16} /> 添加资料
            </button>
            <button className="flex items-center gap-1.5 text-[13px] font-bold text-neutral-500 hover:text-neutral-900 transition-colors">
              <History size={16} /> 引用历史项目
            </button>
            <button className="flex items-center gap-1.5 text-[13px] font-bold text-neutral-500 hover:text-neutral-900 transition-colors">
              <FileText size={16} /> 引用复盘结论
            </button>
            <button className="flex items-center gap-1.5 text-[13px] font-bold text-neutral-500 hover:text-neutral-900 transition-colors">
              <div className="w-5 h-5 rounded-full bg-neutral-100 flex items-center justify-center">🎤</div> 语音输入
            </button>
          </div>
          <button 
            onClick={onGenerate}
            disabled={!intent.trim()}
            className="px-6 py-2.5 bg-neutral-900 text-white rounded-xl text-[14px] font-bold hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 shadow-sm"
          >
            生成项目草案 <Sparkles size={16} />
          </button>
        </div>
      </div>`,
`function InitialView({ intent, setIntent, onGenerate, onOpenAvailableScope, generating, onOpenMaterial }: any) {
  return (
    <div className="max-w-3xl mx-auto py-20 px-6">
      <div className="mb-6">
        <h1 className="text-[28px] font-extrabold text-neutral-900 mb-2 tracking-tight">这轮最想解决什么问题？</h1>
        <p className="text-[14px] text-neutral-500">
          告诉我问题、希望看到的变化，以及时间或预算限制。我先整理一版可修改的项目草案。
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden mb-6 focus-within:border-primary-400 focus-within:ring-4 focus-within:ring-primary-50 transition-all relative flex flex-col">
        <textarea
          value={intent}
          onChange={e => setIntent(e.target.value)}
          placeholder="例如：换粮内容有收藏，但咨询很少。准备做一轮店长号和消费者共创，两周内完成，预算5000元。希望验证真实换粮过程和专业解释能不能提升有效咨询。"
          className="w-full h-[240px] resize-none outline-none p-6 text-[15px] leading-relaxed text-neutral-900 placeholder:text-neutral-300"
        />
        
        <div className="px-6 py-4 border-t border-neutral-100 flex items-center justify-between bg-neutral-50/50">
          <div className="flex items-center gap-4">
            <button onClick={onOpenMaterial} className="flex items-center gap-1.5 text-[13px] font-bold text-neutral-500 hover:text-neutral-900 transition-colors">
              <Plus size={16} /> 补充本次资料
            </button>
            <button onClick={onOpenAvailableScope} className="flex items-center gap-1.5 text-[13px] font-bold text-neutral-500 hover:text-neutral-900 transition-colors">
              <Search size={16} /> 查看参考范围
            </button>
          </div>
          <button 
            onClick={onGenerate}
            disabled={!intent.trim()}
            className="px-6 py-2.5 bg-neutral-900 text-white rounded-xl text-[14px] font-bold hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 shadow-sm"
          >
            生成项目草案 <Sparkles size={16} />
          </button>
        </div>
      </div>`
);

// Remove the View Available Scope button outside
content = content.replace(
`      {!generating && (
        <div className="text-center mt-6">
          <button onClick={onOpenAvailableScope} className="text-[13px] text-neutral-500 hover:text-neutral-900 underline transition-colors">
            查看本次可用范围
          </button>
        </div>
      )}`,
``
);

// Update DraftWorkspace banner
content = content.replace(
`          <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500"/> 排期与分配：待确认</div>
          <div className="flex items-center gap-2"><AlertTriangle size={14} className="text-amber-500"/> 开工条件：2项阻断，2项待确认</div>`,
`          <div className="flex items-center gap-2"><AlertTriangle size={14} className="text-amber-500"/> 排期与分配：待确认</div>
          <div className="flex items-center gap-2"><AlertTriangle size={14} className="text-amber-500"/> 开工条件：1项阻断，2项待确认</div>`
);

content = content.replace(
`               <button className="px-4 py-2 text-[13px] font-bold text-neutral-600 hover:text-neutral-900 bg-white border border-neutral-200 rounded-xl hover:bg-neutral-50 shadow-sm">
                 保存草案
               </button>
               <button onClick={onCreate} className="px-5 py-2 text-[13px] font-bold text-white bg-neutral-900 rounded-xl hover:bg-neutral-800 shadow-sm">
                 创建为筹备项目
               </button>`,
`               <button onClick={onCreate} className="px-4 py-2 text-[13px] font-bold text-neutral-600 hover:text-neutral-900 bg-white border border-neutral-200 rounded-xl hover:bg-neutral-50 shadow-sm">
                 保存并退出
               </button>
               <button onClick={onCreate} className="px-5 py-2 text-[13px] font-bold text-white bg-neutral-900 rounded-xl hover:bg-neutral-800 shadow-sm">
                 创建项目
               </button>`
);

content = content.replace(
`          <div className="flex items-center gap-4 text-[13px] text-neutral-600 mb-4 bg-neutral-50 rounded-xl px-4 py-2 border border-neutral-100 w-fit">
             <div className="flex items-center gap-2 font-bold"><Calendar size={14}/> {draft.cycle}</div>
             <div className="w-px h-3 bg-neutral-300" />
             <div className="flex items-center gap-1 font-bold">¥ {draft.budget}</div>
             <div className="w-px h-3 bg-neutral-300" />
             <div className="flex items-center gap-2"><span className="text-neutral-500">预计发布:</span> <strong className="text-neutral-900">{draft.totalNotes}篇</strong></div>
             <div className="w-px h-3 bg-neutral-300" />
             <div className="flex items-center gap-2"><span className="text-neutral-500">分配公式:</span> <strong className="text-neutral-900">KOC 20篇 + 店长号2篇 + 品牌主号1篇</strong></div>
          </div>`,
`          <div className="flex items-start gap-8 text-[13px] mb-4 bg-neutral-50/50 rounded-xl px-6 py-4 border border-neutral-100 w-fit">
             <div>
               <div className="flex items-center gap-2 font-bold text-neutral-900 mb-1">建议周期：{draft.cycle}</div>
               <div className="text-neutral-500 text-[12px]">依据：近2个同类项目平均12–16天</div>
             </div>
             <div className="w-px h-8 bg-neutral-200" />
             <div>
               <div className="flex items-center gap-1 font-bold text-neutral-900 mb-1">建议预算：¥ {draft.budget}</div>
               <div className="text-neutral-500 text-[12px]">依据：20位KOC激励+素材准备+预留10%</div>
             </div>
             <div className="w-px h-8 bg-neutral-200" />
             <div>
               <div className="flex items-center gap-2 font-bold text-neutral-900 mb-1">预计 {draft.totalNotes} 篇</div>
               <div className="text-neutral-500 text-[12px]">KOC 20篇 + 店长号2篇 + 品牌主号1篇</div>
             </div>
          </div>`
);


// Replace ScheduleTab
content = content.replace(
/function ScheduleTab\(\[\s\S\]\*?\)\ \{\n  return \(\n    <div className=\"space-y-6\">([\s\S]*?)<\/div>\n  \)\n\}\n\nfunction CheckTab/,
`function ScheduleTab({ draft, setDraft, setDrawer }: any) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-5 flex items-center justify-between text-[13px]">
        <div className="flex items-center gap-8">
           <div><div className="text-neutral-500 mb-1">筹备开始日</div><div className="font-bold text-[14px]">{draft.schedule.prepStart}</div></div>
           <div className="w-8 h-px bg-neutral-200" />
           <div><div className="text-neutral-500 mb-1">首批发布日期</div><div className="font-bold text-primary-600 text-[14px]">{draft.schedule.firstPublish}</div></div>
           <div className="w-8 h-px bg-neutral-200" />
           <div><div className="text-neutral-500 mb-1">执行结束日</div><div className="font-bold text-[14px]">{draft.schedule.execEnd}</div></div>
        </div>
        <div className="text-right">
           <div className="text-neutral-500 mb-1">观察窗口</div>
           <div className="font-bold text-[14px]">{draft.schedule.obsWindow}</div>
        </div>
      </div>

      <div className="space-y-4">
        {/* KOC */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm">
          <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50 rounded-t-2xl">
            <div className="flex items-center gap-2 font-bold text-[15px]"><Users size={16} className="text-neutral-500"/> KOC消费者共创 (计划20人)</div>
            <button className="text-[12px] font-bold text-primary-600 hover:underline">编辑安排</button>
          </div>
          <div className="p-5">
            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 mb-4 text-[13px]">
              <div className="font-bold text-blue-900 mb-2">执行验证结构</div>
              <div className="space-y-1 text-blue-800">
                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"/> 首批验证：5位KOC，发布后观察3天</div>
                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"/> 检查点：达成指标后由操盘手确认继续</div>
                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"/> 继续铺量：剩余15位，按每天5位招募</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 text-[13px]">
              <div className="px-3 py-1.5 bg-neutral-50 border border-neutral-100 rounded-lg">内容包：{draft.koc.contentPack}</div>
              <div className="px-3 py-1.5 bg-neutral-50 border border-neutral-100 rounded-lg">信息采集：{draft.koc.form}</div>
              <div className="px-3 py-1.5 bg-neutral-50 border border-neutral-100 rounded-lg">素材任务：{draft.koc.assetTask}</div>
            </div>
          </div>
        </div>

        {/* 店长号 */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm flex items-center justify-between p-5">
          <div>
            <div className="flex items-center gap-2 font-bold text-[15px] mb-2"><CheckCircle2 size={16} className="text-neutral-500"/> 店长号 / KOS (计划2篇)</div>
            <div className="text-[13px] text-neutral-600 flex items-center gap-4">
              <span>账号：店长号A</span>
              <span>设备：iPhone 13 (工作机)</span>
              <span>方向：科学换粮指南</span>
              <span>发布方式：人工下发</span>
            </div>
          </div>
          <button className="text-[12px] font-bold text-primary-600 hover:underline">编辑安排</button>
        </div>

        {/* 品牌号 */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm flex items-center justify-between p-5">
          <div>
            <div className="flex items-center gap-2 font-bold text-[15px] mb-2"><CheckCircle2 size={16} className="text-neutral-500"/> 品牌主号 (计划1篇)</div>
            <div className="text-[13px] text-neutral-600 flex items-center gap-4">
              <span>账号：官方主号</span>
              <span>设备：云端授权</span>
              <span>方向：活动宣发</span>
              <span>数据：自动追踪</span>
            </div>
          </div>
          <button className="text-[12px] font-bold text-primary-600 hover:underline">编辑安排</button>
        </div>
      </div>
    </div>
  )
}

function CheckTab`
);

// CheckTab
content = content.replace(
/function CheckTab\(\{ draft, setDrawer \}: any\) \{([\s\S]*?)<\/tbody>\n      <\/table>\n    <\/div>\n  \)\n\}\n\nfunction AvailableScopeDrawer/,
`function CheckTab({ draft, setDrawer }: any) {
  return (
    <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
      <table className="w-full text-left text-[13px]">
        <thead>
          <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-500">
            <th className="font-bold py-3 px-6 w-[100px]">状态</th>
            <th className="font-bold py-3 px-6">检查事项</th>
            <th className="font-bold py-3 px-6">影响</th>
            <th className="font-bold py-3 px-6 text-right">操作</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          <tr className="hover:bg-neutral-50 transition-colors">
            <td className="py-4 px-6"><span className="px-2 py-1 bg-red-100 text-red-700 font-bold rounded flex items-center w-fit gap-1"><AlertTriangle size={12}/> 阻断</span></td>
            <td className="py-4 px-6 font-bold text-neutral-900">店长号缺少执行设备</td>
            <td className="py-4 px-6 text-neutral-500">无法下发发布任务</td>
            <td className="py-4 px-6 text-right"><button className="px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-neutral-700 font-bold hover:bg-neutral-50 shadow-sm">完善账号配置</button></td>
          </tr>
          <tr className="hover:bg-neutral-50 transition-colors">
            <td className="py-4 px-6"><span className="px-2 py-1 bg-amber-100 text-amber-700 font-bold rounded flex items-center w-fit gap-1"><AlertTriangle size={12}/> 风险</span></td>
            <td className="py-4 px-6 font-bold text-neutral-900">产品实拍资料不足</td>
            <td className="py-4 px-6 text-neutral-500">可能影响后续铺量内容生成质量</td>
            <td className="py-4 px-6 text-right"><button className="px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-neutral-700 font-bold hover:bg-neutral-50 shadow-sm">创建素材任务</button></td>
          </tr>
          <tr className="hover:bg-neutral-50 transition-colors">
            <td className="py-4 px-6"><span className="px-2 py-1 bg-amber-100 text-amber-700 font-bold rounded flex items-center w-fit gap-1"><Clock size={12}/> 待确认</span></td>
            <td className="py-4 px-6 font-bold text-neutral-900">首批发布日期</td>
            <td className="py-4 px-6 text-neutral-500">无法生成排期日历</td>
            <td className="py-4 px-6 text-right"><button className="px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-neutral-700 font-bold hover:bg-neutral-50 shadow-sm">确认日期</button></td>
          </tr>
          <tr className="hover:bg-neutral-50 transition-colors">
            <td className="py-4 px-6"><span className="px-2 py-1 bg-amber-100 text-amber-700 font-bold rounded flex items-center w-fit gap-1"><Clock size={12}/> 待确认</span></td>
            <td className="py-4 px-6 font-bold text-neutral-900">内容审核负责人</td>
            <td className="py-4 px-6 text-neutral-500">影响审核流转</td>
            <td className="py-4 px-6 text-right"><button className="px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-neutral-700 font-bold hover:bg-neutral-50 shadow-sm">选择负责人</button></td>
          </tr>
          <tr className="hover:bg-neutral-50 opacity-60 transition-colors">
            <td className="py-4 px-6"><span className="px-2 py-1 bg-emerald-100 text-emerald-700 font-bold rounded flex items-center w-fit gap-1"><Check size={12}/> 已准备</span></td>
            <td className="py-4 px-6 font-bold text-neutral-900">商家知识可用</td>
            <td className="py-4 px-6 text-neutral-500">-</td>
            <td className="py-4 px-6 text-right"><button className="px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-neutral-700 font-bold hover:bg-neutral-50 shadow-sm">查看依据</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

function AvailableScopeDrawer`
);

// Confirm Modal
content = content.replace(
/function CreateConfirmModal\(\{ draft, onClose, onConfirm \}: any\) \{([\s\S]*?)function EmployeeDrawer/,
`function CreateConfirmModal({ draft, onClose, onConfirm }: any) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="w-[500px] bg-white rounded-2xl shadow-2xl relative z-10 flex flex-col max-h-[90vh]"
      >
        <div className="p-6 border-b border-neutral-100 flex justify-between items-start">
          <div>
            <h2 className="text-[20px] font-extrabold text-neutral-900 mb-1">确认创建项目</h2>
            <div className="text-[13px] text-neutral-500">{draft.name}</div>
          </div>
          <button onClick={onClose} className="p-2 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 -mt-2 -mr-2">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-2 gap-y-4 text-[13px]">
            <div><span className="text-neutral-500 block mb-1">项目周期</span><span className="font-bold">{draft.cycle}</span></div>
            <div><span className="text-neutral-500 block mb-1">总预算</span><span className="font-bold">¥{draft.budget}</span></div>
            <div><span className="text-neutral-500 block mb-1">总笔记计划</span><span className="font-bold">{draft.koc.notes + draft.kos[0].notes + draft.brand[0].notes} 篇</span></div>
            <div><span className="text-neutral-500 block mb-1">参与主体</span><span className="font-bold">{draft.koc.planCount}位KOC, 2个自有号</span></div>
          </div>

          <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
            <div className="flex items-center gap-2 text-amber-700 font-bold text-[14px] mb-2">
              <AlertTriangle size={16} /> 存在阻断项，进入筹备阶段
            </div>
            <div className="mt-2 text-[12px] font-medium text-amber-700 leading-relaxed">
              项目将进入筹备状态。当前有1项开工条件未完成，系统会先生成补齐任务，完成后再生成首批执行任务。
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-neutral-100 bg-neutral-50/50 rounded-b-2xl">
          <button 
            onClick={onConfirm}
            className="w-full py-3 rounded-xl text-[15px] font-bold transition-colors bg-neutral-900 hover:bg-neutral-800 text-white shadow-sm"
          >
            创建项目
          </button>
        </div>
      </motion.div>
    </div>
  )
}

function EmployeeDrawer`
);

// Add state for MaterialDrawer
content = content.replace(
`  const [drawer, setDrawer] = useState<"ai_adjust" | "basis" | "koc_pack" | "koc_form" | "koc_task" | "employee" | "available_scope" | "other_plans" | "preview_page" | "qrcode" | null>(null);`,
`  const [drawer, setDrawer] = useState<"ai_adjust" | "basis" | "koc_pack" | "koc_form" | "koc_task" | "employee" | "available_scope" | "other_plans" | "preview_page" | "qrcode" | "material" | null>(null);`
);

content = content.replace(
`        {drawer === "other_plans" && <OtherPlansDrawer onClose={() => setDrawer(null)} />}`,
`        {drawer === "other_plans" && <OtherPlansDrawer onClose={() => setDrawer(null)} />}
        {drawer === "material" && <MaterialDrawer onClose={() => setDrawer(null)} />}`
);

// Add MaterialDrawer component
content += `
function MaterialDrawer({ onClose }: any) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-neutral-900/20 backdrop-blur-sm" onClick={onClose} />
      <motion.div 
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        className="w-[500px] bg-[#fcfcfc] h-full shadow-2xl flex flex-col relative z-10"
      >
        <div className="p-6 border-b border-neutral-200 flex justify-between items-center bg-white">
          <h2 className="text-[18px] font-bold text-neutral-900">补充本次资料</h2>
          <button onClick={onClose} className="p-2 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <button className="flex flex-col items-center justify-center p-6 bg-white border border-neutral-200 border-dashed rounded-xl hover:border-primary-400 hover:bg-primary-50 transition-colors">
               <Plus size={24} className="text-primary-500 mb-2"/>
               <span className="text-[13px] font-bold text-neutral-700">上传文件</span>
            </button>
            <button className="flex flex-col items-center justify-center p-6 bg-white border border-neutral-200 border-dashed rounded-xl hover:border-primary-400 hover:bg-primary-50 transition-colors">
               <FileText size={24} className="text-primary-500 mb-2"/>
               <span className="text-[13px] font-bold text-neutral-700">粘贴文字</span>
            </button>
            <button className="flex flex-col items-center justify-center p-6 bg-white border border-neutral-200 border-dashed rounded-xl hover:border-primary-400 hover:bg-primary-50 transition-colors">
               <ExternalLink size={24} className="text-primary-500 mb-2"/>
               <span className="text-[13px] font-bold text-neutral-700">添加链接</span>
            </button>
            <button className="flex flex-col items-center justify-center p-6 bg-white border border-neutral-200 border-dashed rounded-xl hover:border-primary-400 hover:bg-primary-50 transition-colors">
               <Search size={24} className="text-primary-500 mb-2"/>
               <span className="text-[13px] font-bold text-neutral-700">从本地资料中搜索</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
`;

// Modify AvailableScopeDrawer
content = content.replace(
/function AvailableScopeDrawer\(\{ onClose \}: any\) \{([\s\S]*?)function CreateConfirmModal/,
`function AvailableScopeDrawer({ onClose }: any) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-neutral-900/20 backdrop-blur-sm" onClick={onClose} />
      <motion.div 
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        className="w-[500px] bg-[#fcfcfc] h-full shadow-2xl flex flex-col relative z-10"
      >
        <div className="p-6 border-b border-neutral-200 flex justify-between items-center bg-white">
          <h2 className="text-[18px] font-bold text-neutral-900">查看参考范围</h2>
          <button onClick={onClose} className="p-2 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
           <div className="bg-primary-50 text-primary-700 px-4 py-3 rounded-xl text-[13px] font-bold border border-primary-100">
             本次参考了12条商家事实、2个相似项目、3条复盘结论和4项账号资源。
           </div>
          <div className="space-y-3">
            <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm flex items-start gap-3">
              <Database size={16} className="text-neutral-500 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-neutral-900 mb-1">商家已确认知识 (12)</div>
                <div className="text-[12px] text-neutral-500">产品配方、核心卖点、禁忌词汇等。</div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm flex items-start gap-3">
              <History size={16} className="text-neutral-500 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-neutral-900 mb-1">相似历史项目 (2)</div>
                <div className="text-[12px] text-neutral-500">参考了近期的KOC铺量项目。</div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm flex items-start gap-3">
              <BookOpen size={16} className="text-neutral-500 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-neutral-900 mb-1">已验证复盘结论 (3)</div>
                <div className="text-[12px] text-neutral-500">高点击首图规律等。</div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm flex items-start gap-3">
              <Users size={16} className="text-neutral-500 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-neutral-900 mb-1">可用账号与设备 (4)</div>
                <div className="text-[12px] text-neutral-500">评估店长号与品牌号的权限。</div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm flex items-start gap-3">
              <ImageIcon size={16} className="text-neutral-500 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-neutral-900 mb-1">已有素材</div>
                <div className="text-[12px] text-neutral-500">评估当前实拍图和视频库。</div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm flex items-start gap-3">
              <PenTool size={16} className="text-neutral-500 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-neutral-900 mb-1">操盘手经验</div>
                <div className="text-[12px] text-neutral-500">读取你平时常用的策略偏好。</div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm flex items-start gap-3">
              <Cpu size={16} className="text-neutral-500 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-neutral-900 mb-1">已启用能力</div>
                <div className="text-[12px] text-neutral-500">合规检查等能力。</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function CreateConfirmModal`
);

content = content.replace(
  `             onOpenAvailableScope={() => setDrawer("available_scope")}
             generating={step === "generating"}`,
  `             onOpenAvailableScope={() => setDrawer("available_scope")}
             onOpenMaterial={() => setDrawer("material")}
             generating={step === "generating"}`
);

fs.writeFileSync('src/components/merchant/CreateProjectWorkstation.tsx', content);

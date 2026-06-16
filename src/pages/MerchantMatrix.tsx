import React, { useState } from 'react';
import { 
  PlusCircle, LayoutGrid, Users, CreditCard, Settings, 
  ArrowUpRight, Building, User, CheckCircle2, MoreVertical,
  Activity, BarChart3, MessageSquare, Sparkles, Send, Target,
  X, Calendar, Crosshair, Package, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function MerchantMatrix() {
  const [viewMode, setViewMode] = useState<'projects' | 'staff'>('projects');
  const [isCreatingProject, setIsCreatingProject] = useState(false);

  const MOCK_PROJECTS = [
    { 
      id: 'p1', 
      name: '奈雪的茶 - 夏季运营', 
      status: '进行中',
      progress: 65,
      stages: [
        { name: '策略企划', status: 'completed', value: '12 组核心词已锁定' },
        { name: '内容生产', status: 'active', value: '45/100 篇笔记已就绪' },
        { name: '矩阵分发', status: 'pending', value: '预计明日开启' },
        { name: '互动转化', status: 'pending', value: '-' },
        { name: '数据归因', status: 'pending', value: '-' },
      ],
      kpis: { views: '124k', engagement: '8.2k', leads: '412' }
    },
    { 
      id: 'p2', 
      name: '霸王茶姬 - 春季拉新', 
      status: '已完成',
      progress: 100,
      stages: [
        { name: '策略企划', status: 'completed', value: '完成' },
        { name: '内容生产', status: 'completed', value: '完成' },
        { name: '矩阵分发', status: 'completed', value: '120 账号覆盖' },
        { name: '互动转化', status: 'completed', value: '89% 响应率' },
        { name: '数据归因', status: 'completed', value: 'ROI: 3.4' },
      ],
      kpis: { views: '890k', engagement: '45k', leads: '1.2k' }
    }
  ];

  const MOCK_STAFF = [
    { id: '1', name: '李经理', role: '内容操盘手', status: '在线', activity: '正在编辑：夏日防晒方案' },
    { id: '2', name: '张小帅', role: '分发专员', status: '离线', activity: '最后在线：2 小时前' },
    { id: '3', name: '王美丽', role: '互动客服', status: '正在忙碌', activity: '处理意向线索中...' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-10 p-8 lg:p-12">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-neutral-900 tracking-tight">
            {viewMode === 'projects' ? '商家项目看板' : '团队协作席位'}
          </h2>
          <p className="text-[13px] text-neutral-400 font-bold">
            {viewMode === 'projects' ? '跟踪商家项目的全链路进展与核心业务产出' : '管理您团队中的操盘手、客服与分发专员'}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-neutral-100 p-1.5 rounded-2xl">
           <button 
             onClick={() => setViewMode('projects')}
             className={`px-5 py-2.5 rounded-xl text-[12px] font-black transition-all ${viewMode === 'projects' ? 'bg-white shadow-xl text-neutral-900 border border-neutral-200/50' : 'text-neutral-400'}`}
           >项目进度</button>
           <button 
             onClick={() => setViewMode('staff')}
             className={`px-5 py-2.5 rounded-xl text-[12px] font-black transition-all ${viewMode === 'staff' ? 'bg-white shadow-xl text-neutral-900 border border-neutral-200/50' : 'text-neutral-400'}`}
           >团队管理</button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {viewMode === 'projects' ? (
          MOCK_PROJECTS.map(project => (
            <motion.div 
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 bg-white border border-neutral-100 rounded-[40px] hover:shadow-2xl transition-all group overflow-hidden relative"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-8 pb-8 border-b border-neutral-50">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-neutral-900 rounded-2xl flex items-center justify-center text-white shadow-xl">
                    <Target size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-neutral-900 mb-1">{project.name}</h3>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${project.status === '进行中' ? 'bg-primary-50 text-primary-500' : 'bg-success-50 text-success-600'}`}>
                        {project.status}
                      </span>
                      <span className="text-[11px] text-neutral-400 font-bold">当前进度: {project.progress}%</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-8 px-8 border-x border-neutral-50">
                  <div>
                    <div className="text-[10px] font-black text-neutral-300 uppercase tracking-widest mb-1">浏览量</div>
                    <div className="text-xl font-black text-neutral-900">{project.kpis.views}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-neutral-300 uppercase tracking-widest mb-1">互动</div>
                    <div className="text-xl font-black text-neutral-900">{project.kpis.engagement}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-neutral-300 uppercase tracking-widest mb-1">线索</div>
                    <div className="text-xl font-black text-primary-500">{project.kpis.leads}</div>
                  </div>
                </div>

                <button className="px-6 py-3 bg-neutral-50 hover:bg-neutral-900 hover:text-white rounded-2xl text-[12px] font-black transition-all flex items-center gap-2">
                  进入详情 <ArrowUpRight size={16} />
                </button>
              </div>

              <div className="flex items-stretch -mx-2">
                {project.stages.map((stage, idx) => (
                  <React.Fragment key={idx}>
                     <div className={`p-4 xl:p-5 flex-1 rounded-[24px] border transition-all ${stage.status === 'completed' ? 'bg-success-50/30 border-success-100' : stage.status === 'active' ? 'bg-white border-primary-500 shadow-lg' : 'bg-neutral-50/50 border-neutral-100 opacity-60'}`}>
                        <div className="flex items-center justify-between mb-3">
                           <div className={`text-[10px] font-black uppercase tracking-widest ${stage.status === 'completed' ? 'text-success-600' : stage.status === 'active' ? 'text-primary-500' : 'text-neutral-400'}`}>
                           STG {idx + 1}
                           </div>
                           {stage.status === 'completed' && <CheckCircle2 size={14} className="text-success-500" />}
                           {stage.status === 'active' && <Activity size={14} className="text-primary-500 animate-pulse" />}
                        </div>
                        <div className="text-[13px] xl:text-[14px] font-black text-neutral-900 mb-1">{stage.name}</div>
                        <div className="text-[10px] font-bold text-neutral-400 truncate">{stage.value}</div>
                     </div>
                     {idx < project.stages.length - 1 && (
                        <div className="flex items-center justify-center -mx-4 z-10 w-8 shrink-0">
                           <button 
                             title="触发指令串联"
                             className={`w-6 h-6 rounded-full bg-white border shadow-sm flex items-center justify-center transition-all group ${stage.status === 'completed' ? 'border-primary-200 text-primary-500 hover:scale-110 hover:bg-primary-50' : 'border-neutral-200 text-neutral-300 hover:text-neutral-600'}`}
                           >
                              <Send size={10} className="group-hover:translate-x-0.5 transition-transform" />
                           </button>
                        </div>
                     )}
                  </React.Fragment>
                ))}
              </div>
            </motion.div>
          ))
        ) : (
          MOCK_STAFF.map(staff => (
            <div key={staff.id} className="p-8 bg-white border border-neutral-100 rounded-[40px] flex items-center justify-between hover:border-primary-500/20 hover:shadow-2xl transition-all group">
               <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-neutral-50 rounded-2xl flex items-center justify-center text-neutral-300 font-black group-hover:bg-primary-50 group-hover:text-primary-500 transition-all text-xl">
                     {staff.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-[17px] font-black text-neutral-900">{staff.name}</h4>
                    <p className="text-[11px] text-neutral-400 font-black uppercase tracking-widest">{staff.role}</p>
                  </div>
               </div>
               
               <div className="flex items-center gap-12">
                  <div className="hidden md:block text-right">
                     <p className="text-[10px] text-neutral-400 font-black uppercase tracking-widest mb-1.5">最近作业</p>
                     <p className="text-[14px] font-bold text-neutral-600">{staff.activity}</p>
                  </div>
                  <div className="min-w-[100px] text-right">
                    <span className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest ${staff.status === '在线' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-neutral-50 text-neutral-400 border border-neutral-100'}`}>
                      {staff.status}
                    </span>
                  </div>
               </div>
            </div>
          ))
        )}
      </div>

      <button 
         onClick={() => viewMode === 'projects' && setIsCreatingProject(true)}
         className="w-full py-8 bg-white border border-dashed border-neutral-200 rounded-[40px] text-[15px] font-black text-neutral-400 hover:border-primary-500 hover:text-primary-500 transition-all flex items-center justify-center gap-3"
      >
         <PlusCircle size={24} /> {viewMode === 'projects' ? '启动新履约项目' : '录入新员工信息'}
      </button>

      {/* Create Project Overlay Modal */}
      <AnimatePresence>
        {isCreatingProject && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-neutral-900/40 backdrop-blur-sm flex justify-end p-4"
          >
            <motion.div 
               initial={{ x: '100%', opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               exit={{ x: '100%', opacity: 0 }}
               transition={{ type: 'spring', damping: 30, stiffness: 300 }}
               className="w-full max-w-2xl bg-white h-full rounded-[40px] shadow-2xl flex flex-col overflow-hidden"
            >
               <div className="h-20 border-b border-neutral-100 flex items-center justify-between px-8 bg-white shrink-0">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-primary-50 text-primary-500 rounded-2xl flex items-center justify-center">
                        <Package size={20} />
                     </div>
                     <h2 className="text-xl font-black text-neutral-900 tracking-tight">建立履约项目与周期目标</h2>
                  </div>
                  <button onClick={() => setIsCreatingProject(false)} className="p-2 hover:bg-neutral-100 rounded-xl text-neutral-400 transition-colors">
                     <X size={20} />
                  </button>
               </div>
               
               <div className="flex-1 overflow-y-auto p-8 bg-neutral-50/30 custom-scrollbar space-y-8">
                  {/* Base Info */}
                  <div className="space-y-4">
                     <h3 className="text-[13px] font-black text-neutral-900 uppercase tracking-widest flex items-center gap-2">
                        <Target size={16} className="text-neutral-400" /> 1. 项目基础定义
                     </h3>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <label className="text-[11px] font-bold text-neutral-400 uppercase">选择挂载商户账号</label>
                           <select className="w-full h-12 bg-white border border-neutral-200 rounded-2xl px-4 text-[14px] font-black outline-none focus:border-primary-500">
                             <option>奈雪的茶 (NX-001)</option>
                             <option>霸王茶姬 (BW-022)</option>
                           </select>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[11px] font-bold text-neutral-400 uppercase">履约项目名称</label>
                           <input type="text" placeholder="例如：2026秋季大促矩阵" className="w-full h-12 bg-white border border-neutral-200 rounded-2xl px-4 text-[14px] font-black outline-none focus:border-primary-500" />
                        </div>
                     </div>
                  </div>

                  {/* Period Targets */}
                  <div className="space-y-4">
                     <h3 className="text-[13px] font-black text-neutral-900 uppercase tracking-widest flex items-center gap-2">
                        <Calendar size={16} className="text-neutral-400" /> 2. 阶段性周期排期与 KPI
                     </h3>
                     <p className="text-[11px] font-bold text-neutral-400 -mt-2">设置明确的履约周期与产量预估，系统将按此自动驱动排期任务并生成周/月报。</p>
                     
                     <div className="space-y-3">
                        {[
                           { period: '一月 (启动期)', notes: '16条', rule: '每周4条原创精编', target: '跑通账号标签，提升基础收录' },
                           { period: '二月 (上升期)', notes: '12条', rule: '每周3条原创精编', target: '测试垂直流量池，沉淀转化素材' },
                           { period: '三月 (平稳爆发)', notes: '12条', rule: '每周3条原创精编', target: '建立品类词占位，获取稳定搜索流量' }
                        ].map((m, i) => (
                           <div key={i} className="bg-white p-5 rounded-3xl border border-neutral-200/50 shadow-sm flex items-start gap-5">
                              <div className="w-12 h-12 bg-neutral-900 rounded-2xl flex items-center justify-center text-white font-black text-lg shrink-0">
                                 {i + 1}
                              </div>
                              <div className="flex-1 min-w-0 grid grid-cols-2 gap-4">
                                 <div>
                                   <label className="text-[10px] font-bold text-neutral-400 uppercase mb-1 block">阶段名称</label>
                                   <input defaultValue={m.period} className="w-full bg-neutral-50 border border-neutral-200/50 rounded-xl px-3 py-2 text-[13px] font-black" />
                                 </div>
                                 <div>
                                   <label className="text-[10px] font-bold text-neutral-400 uppercase mb-1 block">笔记产出总量</label>
                                   <input defaultValue={m.notes} className="w-full bg-neutral-50 border border-neutral-200/50 rounded-xl px-3 py-2 text-[13px] font-black" />
                                 </div>
                                 <div className="col-span-2">
                                   <label className="text-[10px] font-bold text-neutral-400 uppercase mb-1 block">本期运营目标 / KPI</label>
                                   <input defaultValue={m.target} className="w-full bg-neutral-50 border border-neutral-200/50 rounded-xl px-3 py-2 text-[13px] font-black" />
                                 </div>
                              </div>
                           </div>
                        ))}
                        <button className="w-full py-4 border-2 border-dashed border-neutral-200 rounded-3xl text-[12px] font-black text-neutral-400 hover:border-neutral-300 hover:bg-neutral-50 transition-colors">
                           + 增加考核周期
                        </button>
                     </div>
                  </div>

                  {/* Asset Integration */}
                  <div className="space-y-4">
                     <h3 className="text-[13px] font-black text-neutral-900 uppercase tracking-widest flex items-center gap-2">
                        <Crosshair size={16} className="text-neutral-400" /> 3. 关联商家知识资产库
                     </h3>
                     <div className="p-5 bg-blue-50/50 border border-blue-100 rounded-3xl relative overflow-hidden group">
                        <Sparkles size={100} className="absolute -right-6 -bottom-6 text-blue-500/10 group-hover:scale-110 transition-transform duration-500" />
                        <p className="text-[12px] font-black text-blue-800 mb-3 relative z-10">已自动从所选商户加载以下品宣资产，流水线将严格以此约束 AI 输出：</p>
                        <div className="flex flex-wrap gap-2 relative z-10">
                           {['账号 IP 定位方案的规范', '视觉及配图合规约束', '行业高风险违禁词拦截库'].map((tag, i) => (
                             <span key={i} className="px-3 py-1.5 bg-white border border-blue-200 text-blue-600 rounded-lg text-[11px] font-bold flex items-center gap-1.5">
                                <CheckCircle2 size={12} className="text-blue-500" /> {tag}
                             </span>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>

               <div className="p-6 border-t border-neutral-100 shrink-0 bg-white">
                  <button onClick={() => setIsCreatingProject(false)} className="w-full h-14 bg-neutral-900 text-white rounded-2xl font-black text-[14px] flex items-center justify-center gap-2 hover:bg-primary-500 transition-colors active:scale-95 shadow-xl shadow-neutral-200">
                     确认创建并自动展开任务排期 <ArrowRight size={16} />
                  </button>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

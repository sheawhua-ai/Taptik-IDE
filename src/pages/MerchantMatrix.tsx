import React, { useState } from 'react';
import { 
  PlusCircle, LayoutGrid, Users, CreditCard, Settings, 
  ArrowUpRight, Building, User, CheckCircle2, MoreVertical,
  Activity, BarChart3, MessageSquare, Sparkles, Send, Target
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function MerchantMatrix() {
  const [viewMode, setViewMode] = useState<'projects' | 'staff'>('projects');

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

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {project.stages.map((stage, idx) => (
                  <div key={idx} className={`p-5 rounded-3xl border transition-all ${stage.status === 'completed' ? 'bg-success-50/30 border-success-100' : stage.status === 'active' ? 'bg-white border-primary-500 shadow-lg' : 'bg-neutral-50 border-neutral-100 opacity-50'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className={`text-[10px] font-black uppercase tracking-widest ${stage.status === 'completed' ? 'text-success-600' : stage.status === 'active' ? 'text-primary-500' : 'text-neutral-400'}`}>
                        STG {idx + 1}
                      </div>
                      {stage.status === 'completed' && <CheckCircle2 size={14} className="text-success-500" />}
                      {stage.status === 'active' && <Activity size={14} className="text-primary-500 animate-pulse" />}
                    </div>
                    <div className="text-[14px] font-black text-neutral-900 mb-1">{stage.name}</div>
                    <div className="text-[10px] font-bold text-neutral-400 truncate">{stage.value}</div>
                  </div>
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

      <button className="w-full py-8 bg-white border border-dashed border-neutral-200 rounded-[40px] text-[15px] font-black text-neutral-400 hover:border-primary-500 hover:text-primary-500 transition-all flex items-center justify-center gap-3">
         <PlusCircle size={24} /> {viewMode === 'projects' ? '启动新运营项目' : '录入新员工信息'}
      </button>
    </div>
  );
}

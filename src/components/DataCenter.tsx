import React from 'react';
import { 
  Activity, ArrowUp, ArrowUpFromLine, MessageSquare, Target, 
  LineChart, Check, ArrowRight, Sparkles, Plus, Clock, RefreshCw, Component, Settings
} from 'lucide-react';

interface DataCenterProps {
  dataSubNav: 'roi' | 'blueocean' | 'auto_views' | 'scheduled';
  setDataSubNav: (val: 'roi' | 'blueocean' | 'auto_views' | 'scheduled') => void;
  setActiveNav: (nav: string) => void;
}

export const DataCenter: React.FC<DataCenterProps> = ({ dataSubNav, setDataSubNav, setActiveNav }) => {
  return (
    <div className="flex-1 flex flex-col h-full bg-neutral-0 overflow-y-auto custom-scrollbar">
       <div className="p-6 xl:p-8 border-b border-neutral-100 shrink-0">
          <h1 className="text-2xl font-black text-neutral-900">数据中心</h1>
          <p className="text-[13px] text-neutral-500 font-medium mt-1">项目多维数据监控、笔记曝光转化与受众反馈深度解析</p>
       </div>
       
        <div className="p-6 xl:p-8 flex-1 space-y-8 bg-neutral-50/50">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
             <div className="bg-neutral-0 p-5 rounded-2xl border border-neutral-200 shadow-sm">
                <div className="text-[12px] font-bold text-neutral-500 mb-2 flex items-center justify-between">小红书总曝光 <Activity size={14} className="text-secondary-500" /></div>
                <div className="text-2xl font-black text-neutral-900">12.5 W</div>
                <div className="text-[11px] font-bold text-success-500 mt-2 flex items-center gap-1"><ArrowUp size={12}/> 12.4% 较上周</div>
             </div>
             <div className="bg-neutral-0 p-5 rounded-2xl border border-neutral-200 shadow-sm">
                <div className="text-[12px] font-bold text-neutral-500 mb-2 flex items-center justify-between">小红书总互动 <Component size={14} className="text-primary-500" /></div>
                <div className="text-2xl font-black text-neutral-900">3,492</div>
                <div className="text-[11px] font-bold text-success-500 mt-2 flex items-center gap-1"><ArrowUp size={12}/> 8.1% 较上周</div>
             </div>
             <div className="bg-neutral-0 p-5 rounded-2xl border border-neutral-200 shadow-sm">
                <div className="text-[12px] font-bold text-neutral-500 mb-2 flex items-center justify-between">小红书净涨粉 <Target size={14} className="text-success-500" /></div>
                <div className="text-2xl font-black text-neutral-900">845 人</div>
                <div className="text-[11px] font-bold text-danger-500 mt-2 flex items-center gap-1"><ArrowUpFromLine size={12} className="rotate-180"/> 2.3% 较上周</div>
             </div>
             <div className="bg-neutral-0 p-5 rounded-2xl border border-neutral-200 shadow-sm">
                <div className="text-[12px] font-bold text-neutral-500 mb-2 flex items-center justify-between">新增私信/评论圈客 <MessageSquare size={14} className="text-primary-500" /></div>
                <div className="text-2xl font-black text-neutral-900">412 条</div>
                <div className="text-[11px] font-bold text-success-500 mt-2 flex items-center gap-1"><ArrowUp size={12}/> 21.5% 较上周</div>
             </div>
          </div>

          {/* Sub Nav */}
          <div className="flex items-center justify-between border-b border-neutral-200">
             <div className="flex items-center gap-6">
                <button 
                   onClick={() => setDataSubNav('roi')}
                   className={`pb-3 text-[14px] font-bold ${dataSubNav === 'roi' ? 'text-primary-500 border-b-2 border-primary-500' : 'text-neutral-500 hover:text-neutral-800'}`}>全链路 ROI 归因</button>
                <button 
                   onClick={() => setDataSubNav('auto_views')}
                   className={`pb-3 text-[14px] font-bold ${dataSubNav === 'auto_views' ? 'text-primary-500 border-b-2 border-primary-500' : 'text-neutral-500 hover:text-neutral-800'}`}>AI 对话生成视图</button>
                <button 
                   onClick={() => setDataSubNav('scheduled')}
                   className={`pb-3 text-[14px] font-bold ${dataSubNav === 'scheduled' ? 'text-primary-500 border-b-2 border-primary-500' : 'text-neutral-500 hover:text-neutral-800'}`}>自动化报表引擎</button>
                <button 
                   onClick={() => setDataSubNav('blueocean')}
                   className={`pb-3 text-[14px] font-bold ${dataSubNav === 'blueocean' ? 'text-primary-500 border-b-2 border-primary-500' : 'text-neutral-500 hover:text-neutral-800'}`}>蓝海词监测</button>
             </div>
             <div className="pb-3 flex items-center gap-2">
                 <span className="text-[12px] font-bold text-neutral-400">经营数据连通:</span>
                 <span className="text-[11px] font-bold text-success-600 bg-success-50 px-2 py-1 rounded border border-success-100 flex items-center gap-1"><Check size={12}/> 内置交易组件与溯源中心已启用</span>
             </div>
          </div>

          {dataSubNav === 'roi' && (
            <div className="space-y-6">
              {/* Full Funnel lifecycle */}
              <div className="bg-neutral-0 border border-neutral-200 rounded-3xl p-8 shadow-sm">
                 <div className="flex items-center justify-between mb-10">
                    <div>
                       <h3 className="text-lg font-black text-neutral-900">全生命周期价值归因 (LOD - Lead on Demand)</h3>
                       <p className="text-[12px] text-neutral-500 font-medium">跳过繁杂对接：通过内置 SaaS 组件追踪“内容 &rarr; 咨询 &rarr; 留存”的每一环价值</p>
                    </div>
                    <div className="flex gap-2">
                       <div className="px-3 py-1 bg-primary-50 text-primary-500 text-[11px] font-bold rounded-full border border-primary-100 flex items-center gap-1">核心价值：获客确定性</div>
                    </div>
                 </div>

                 <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    {[
                       { label: '内容总触达', val: '1.25 M', color: 'bg-neutral-100', text: 'text-neutral-600', sub: '全局矩阵曝光' },
                       { label: '高意向商机', val: '1,240', color: 'bg-primary-50', text: 'text-primary-500', sub: '触发特定暗号', conv: '4.8%' },
                       { label: '私域加粉', val: '845', color: 'bg-primary-100', text: 'text-primary-700', sub: '扫码导流企微', conv: '68.1%' },
                       { label: '商机转化成单', val: '312', color: 'bg-success-50', text: 'text-success-600', sub: '内置组件成交', conv: '36.9%' },
                       { label: '生命周期资产', val: '¥ 12.5 W', color: 'bg-success-100', text: 'text-success-700', sub: 'CLV 预估收益', conv: '∞' },
                    ].map((step, i) => {
                       const StepIcon = ArrowRight;
                       return (
                       <React.Fragment key={i}>
                          <div className={`flex-1 min-w-[160px] p-5 rounded-2xl ${step.color} border border-transparent hover:border-primary-500/20 transition-all flex flex-col items-center text-center relative`}>
                             <span className="text-[10px] font-black uppercase tracking-tighter opacity-60 mb-2">{step.label}</span>
                             <span className={`text-[22px] font-black ${step.text}`}>{step.val}</span>
                             <span className="text-[10px] font-bold text-neutral-400 mt-1">{step.sub}</span>
                             {step.conv && (
                                <div className="absolute -left-6 top-1/2 -translate-y-1/2 flex flex-col items-center">
                                   <div className="bg-neutral-0 px-1.5 py-0.5 rounded text-[9px] font-black text-primary-500 border border-primary-200 shadow-sm">{step.conv}</div>
                                   <StepIcon size={14} className="text-neutral-300" />
                                </div>
                             )}
                          </div>
                       </React.Fragment>
                       )
                    })}
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {/* ROI Analysis Side */}
                 <div className="md:col-span-1 bg-neutral-0 border border-neutral-200 rounded-3xl p-6 shadow-sm">
                    <h3 className="text-[14px] font-black text-neutral-900 mb-6 flex items-center justify-between">流量效率分析 <LineChart size={16} className="text-neutral-400"/></h3>
                    <div className="space-y-5">
                       <div className="flex justify-between items-center text-[13px]">
                          <span className="text-neutral-500 font-medium">获客成本 (CPA)</span>
                          <span className="font-bold text-neutral-900">¥ 12.45 <span className="text-[10px] text-success-500">-2.1%</span></span>
                       </div>
                       <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-primary-500 h-full w-[45%]" />
                       </div>
                       <div className="flex justify-between items-center text-[13px]">
                          <span className="text-neutral-500 font-medium">投放回报率 (ROI)</span>
                          <span className="font-bold text-primary-500">1 : 8.4</span>
                       </div>
                       <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-success-500 h-full w-[84%]" />
                       </div>
                    </div>
                 </div>

                 <div className="md:col-span-2 bg-neutral-0 rounded-3xl border border-neutral-200 p-6 overflow-hidden shadow-sm flex flex-col relative">
                    <div className="absolute right-6 top-6 flex items-center gap-2">
                       <span className="text-[10px] font-bold text-neutral-400">数据源：内置轻量 SaaS 订单引擎</span>
                       <div className="w-2 h-2 rounded-full bg-success-500 animate-pulse"></div>
                    </div>
                    <h3 className="text-[14px] font-black text-neutral-900 mb-6">高转化笔记与其带货闭环分析</h3>
                    <div className="flex-1 overflow-x-auto">
                       <table className="w-full text-left">
                         <thead className="text-[11px] font-black text-neutral-400 uppercase tracking-widest border-b border-neutral-50">
                            <tr>
                               <th className="py-3 px-2">笔记内容</th>
                               <th className="py-3 px-2 text-right">导购引流</th>
                               <th className="py-3 px-2 text-right">映射订单</th>
                               <th className="py-3 px-2 text-right">ROI 预估</th>
                            </tr>
                         </thead>
                         <tbody className="text-[13px] font-medium text-neutral-700">
                            {[
                               { title: '猫粮测评：夏天...', leads: '245', orders: '112', roi: '12.5x' },
                               { title: '多猫家庭铲屎官必看...', leads: '112', orders: '45', roi: '8.2x' },
                               { title: '宠物零食避雷针...', leads: '88', orders: '23', roi: '5.1x' },
                            ].map((row, idx) => (
                               <tr key={idx} className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors">
                                  <td className="py-3 px-2 font-bold max-w-[150px] truncate">{row.title}</td>
                                  <td className="py-3 px-2 text-right font-mono text-neutral-500">{row.leads}</td>
                                  <td className="py-3 px-2 text-right font-mono text-success-600">{row.orders}</td>
                                  <td className="py-3 px-2 text-right font-black text-primary-500">{row.roi}</td>
                               </tr>
                            ))}
                         </tbody>
                       </table>
                    </div>
                 </div>
              </div>
            </div>
          )}

          {dataSubNav === 'auto_views' && (
            <div className="flex flex-col h-full bg-neutral-50/50 rounded-3xl border border-neutral-200 border-dashed p-10 items-center justify-center text-center">
              <div className="w-20 h-20 rounded-full bg-primary-50 flex items-center justify-center text-primary-500 mb-6 shadow-inner">
                  <Sparkles size={40} />
              </div>
              <h3 className="text-xl font-black text-neutral-900 mb-3">AI 动态数据可视化空间</h3>
              <p className="text-[14px] text-neutral-500 font-medium max-w-lg mb-8 leading-relaxed">
                 在这里，AI 将根据你在对话中提出的数据分析需求（如：“帮我对比最近三个月宠粉日不同地域的转化率”），自动编写 Tailwind + React 代码并渲染为实时数据看板。
              </p>
              <div className="bg-neutral-0 border border-neutral-100 p-6 rounded-2xl shadow-xl max-w-3xl w-full text-left flex flex-col gap-4 scale-95 opacity-80 pointer-events-none grayscale">
                  {/* Skeleton for an AI-generated view */}
                  <div className="h-6 w-1/3 bg-neutral-100 rounded mb-4"></div>
                  <div className="grid grid-cols-3 gap-4">
                     <div className="h-24 bg-neutral-50 rounded-xl"></div>
                     <div className="h-24 bg-neutral-50 rounded-xl"></div>
                     <div className="h-24 bg-neutral-50 rounded-xl"></div>
                  </div>
                  <div className="h-40 bg-neutral-50 rounded-xl w-full"></div>
              </div>
              <button onClick={() => setActiveNav('ai')} className="mt-8 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2">
                 <MessageSquare size={18} /> 前往 AI 工作台指令生成
              </button>
            </div>
          )}

          {dataSubNav === 'scheduled' && (
             <div className="space-y-6">
                <div className="flex items-center justify-between">
                   <h3 className="text-lg font-black text-neutral-900">定时任务报表管理</h3>
                   <button className="bg-neutral-900 text-neutral-0 px-4 py-2 rounded-xl text-[12px] font-bold flex items-center gap-2 hover:bg-neutral-800 transition-colors">
                      <Plus size={16}/> 新建自动化报表任务
                   </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {[
                      { name: '每周小红书矩阵复盘', period: '每周一 09:00', dest: '企业微信群 3310', status: '运行中', type: '综合汇总' },
                      { name: 'ROI 波报异常报警', period: '每 2 小时巡检', dest: '系统通知 + 微信', status: '监听中', type: '异常监控' },
                      { name: '竞品蓝海词发现月报', period: '每月 1 号', dest: 'PDF 归档到 Files', status: '待触发', type: '市场洞察' },
                   ].map((job, idx) => (
                      <div key={idx} className="bg-neutral-0 border border-neutral-200 rounded-3xl p-6 shadow-sm hover:border-primary-500/30 transition-all group">
                         <div className="flex items-start justify-between mb-4">
                            <div className="w-10 h-10 rounded-xl bg-neutral-50 text-neutral-500 flex items-center justify-center group-hover:bg-primary-50 group-hover:text-primary-500 transition-colors"><Clock size={20}/></div>
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded ${job.status === '运行中' ? 'bg-success-50 text-success-600' : 'bg-neutral-100 text-neutral-500'}`}>{job.status}</span>
                         </div>
                         <h4 className="text-[15px] font-black text-neutral-900 mb-1">{job.name}</h4>
                         <p className="text-[12px] text-neutral-500 font-medium mb-4">{job.type} · {job.period}</p>
                         <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-[11px] font-bold text-neutral-400">
                            <span>推送到：{job.dest}</span>
                            <button className="hover:text-primary-500 transition-colors"><Settings size={14}/></button>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          )}

          {dataSubNav === 'blueocean' && (
             <div className="bg-neutral-0 rounded-2xl border border-neutral-200 overflow-hidden shadow-sm flex flex-col">
                <div className="p-4 border-b border-neutral-100 bg-neutral-50/50 flex items-center justify-between">
                   <span className="text-[13px] font-bold text-neutral-800">蓝海词矩阵探测趋势排榜 (RPA 抓取)</span>
                   <button className="text-[11px] font-bold flex items-center gap-1 text-primary-500 bg-primary-50 px-2 py-1 rounded hover:bg-primary-100 transition-colors"><RefreshCw size={12}/> 强制刷新</button>
                </div>
                <div className="p-6">
                   <div className="flex gap-4 mb-6">
                       <div className="flex-1 bg-success-50 border border-success-100 rounded-xl p-4">
                          <div className="text-[12px] font-bold text-success-600 mb-1">近期高潜力增长词</div>
                          <div className="text-[18px] font-black text-neutral-900">#无谷烘焙冻干猫粮</div>
                          <div className="text-[11px] text-success-500 mt-2 font-medium flex items-center gap-1"><ArrowUp size={12}/> 搜索热度日环比 +42%</div>
                       </div>
                       <div className="flex-1 bg-danger-50 border border-danger-100 rounded-xl p-4">
                          <div className="text-[12px] font-bold text-danger-600 mb-1">竞争红海词 (建议避让)</div>
                          <div className="text-[18px] font-black text-neutral-900">#猫粮推荐</div>
                          <div className="text-[11px] text-danger-500 mt-2 font-medium">前排均点赞量 &gt; 5w+，流量挤压</div>
                       </div>
                   </div>
                   <table className="w-full text-left border-collapse min-w-[500px]">
                     <thead className="bg-neutral-50 border-b border-neutral-100 text-[11px] text-neutral-500">
                        <tr>
                           <th className="py-3 px-4 font-bold">探测关键词 (Keyword)</th>
                           <th className="py-3 px-4 font-bold text-right">热度指数 (24h)</th>
                           <th className="py-3 px-4 font-bold text-right">长尾竞争规模</th>
                           <th className="py-3 px-4 font-bold text-right">建议操作</th>
                        </tr>
                     </thead>
                     <tbody className="text-[12px] text-neutral-800 font-medium">
                        <tr className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors">
                           <td className="py-3 px-4 flex items-center gap-2">
                               <span className="font-bold text-neutral-900 truncate">#新手养幼猫必囤</span>
                           </td>
                           <td className="py-3 px-4 text-right font-mono text-[13px] text-success-600 flex justify-end items-center gap-1"><ArrowUp size={12}/> 8,420</td>
                           <td className="py-3 px-4 text-right font-mono text-[13px]">520 篇</td>
                           <td className="py-3 px-4 text-right">
                              <button className="text-[11px] font-bold text-neutral-0 bg-primary-500 hover:bg-primary-600 px-3 py-1.5 rounded transition-colors shadow-sm shadow-primary-500/20">生成选题组</button>
                           </td>
                        </tr>
                        <tr className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors">
                           <td className="py-3 px-4 flex items-center gap-2">
                               <span className="font-bold text-neutral-900 truncate">#多猫家庭护毛猫粮</span>
                           </td>
                           <td className="py-3 px-4 text-right font-mono text-[13px] text-success-600 flex justify-end items-center gap-1"><ArrowUp size={12}/> 4,115</td>
                           <td className="py-3 px-4 text-right font-mono text-[13px]">128 篇</td>
                           <td className="py-3 px-4 text-right">
                              <button className="text-[11px] font-bold text-neutral-0 bg-primary-500 hover:bg-primary-600 px-3 py-1.5 rounded transition-colors shadow-sm shadow-primary-500/20">生成选题组</button>
                           </td>
                        </tr>
                     </tbody>
                   </table>
                </div>
             </div>
          )}
        </div>
    </div>
  );
};

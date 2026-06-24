import React, { useState } from 'react';
import { 
  Users, Share2, AlertCircle, ScanLine, Smartphone, Calendar, User, History, CheckCircle2, QrCode, Bot
} from 'lucide-react';

export const ContentProduction: React.FC<{ hasData?: boolean }> = ({ hasData = true }) => {
  const [viewMode, setViewMode] = useState<'dashboard' | 'queue'>('dashboard');
  const [showQrCode, setShowQrCode] = useState<string | null>(null);
  const [showAccountBreakdown, setShowAccountBreakdown] = useState(false);

  const MOCK_OWNED_ACCOUNTS = [
    { id: 'o1', name: '奈雪-区域福利官', initial: '奈', color: 'bg-indigo-50 text-indigo-500', type: '企业专业号', loginMode: '静默登录在线', status: '正常运行', followers: '12.4w', quota: '5篇/天', usedQuota: 2, todayTasks: 2, health: 'good', recentAds: '聚光消耗 ¥1,240' },
    { id: 'o2', name: '周末喝点啥', initial: '周', color: 'bg-rose-50 text-rose-500', type: '员工 KOS', loginMode: '静默登录在线', status: '正常运行', followers: '3,200', quota: '3篇/天', usedQuota: 1, todayTasks: 1, health: 'good', recentAds: '未投放' },
    { id: 'o3', name: '广州吃喝小分队', initial: '广', color: 'bg-emerald-50 text-emerald-500', type: '员工 KOS', loginMode: '授权已过期', status: '登录失效', followers: '1.2w', quota: '暂停发文', usedQuota: 0, todayTasks: 0, health: 'error', recentAds: '-' },
  ];

  const MOCK_EXTERNAL_ACCOUNTS = [
    { id: 'e1', name: '周末探店指南', initial: '周', color: 'bg-sky-50 text-sky-500', type: '邀约达人', monitoring: '数据抓取中', status: '正常活跃', engagementScore: '89分', recentInteractionRate: '4.2%', frequency: '2篇/周', health: 'good' },
    { id: 'e2', name: '阿喵测评', initial: '阿', color: 'bg-amber-50 text-amber-500', type: '兼职素人', monitoring: '数据抓取中', status: '疑似限流', engagementScore: '12分', recentInteractionRate: '0.2%', frequency: '1篇/月', health: 'warning' },
  ];

  const MOCK_QUEUE = [
    { id: 'q1', title: '夏季通勤防晒实测第1篇', project: '防晒夏季种草', assignTo: '奈雪-区域福利官', status: '等待发文', expectedTime: '今天 18:00 前', type: '图文', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=100&q=80' },
    { id: 'q2', title: '带妆一整天，持妆防晒组合', project: '防晒夏季种草', assignTo: '周末喝点啥', status: '等待发文', expectedTime: '今天 20:00 前', type: '图文', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=100&q=80' },
    { id: 'q3', title: '秋冬宠物换粮注意这几点', project: '宠粮新客运营', assignTo: '阿喵测评', status: '已完成发文', expectedTime: '昨天 12:00', type: '图文', image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=100&q=80' },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden w-full relative">
      {/* Header */}
      <div className="h-20 border-b border-neutral-100 px-8 flex items-center justify-between shrink-0 bg-white z-10 sticky top-0 w-full">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-neutral-900 text-white rounded-2xl flex items-center justify-center shadow-lg">
            <Share2 size={24} />
          </div>
          <div>
            <h2 className="text-[17px] font-semibold text-neutral-900 tracking-tight">账号与分发</h2>
            <p className="text-[11px] text-neutral-400 mt-0.5">监控全域发文账号健康度大盘，跟进运营人员待发排期与通告流水</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-neutral-100 p-1.5 rounded-2xl">
          <button 
            onClick={() => setViewMode('dashboard')}
            className={`px-5 py-2.5 rounded-xl text-[12px] font-medium transition-all ${viewMode === 'dashboard' ? 'bg-white shadow-xl text-neutral-900 border border-neutral-200/50' : 'text-neutral-500 hover:text-neutral-900'}`}
          >
            账号概览
          </button>
          <button 
            onClick={() => setViewMode('queue')}
            className={`px-5 py-2.5 rounded-xl text-[12px] font-medium transition-all ${viewMode === 'queue' ? 'bg-white shadow-xl text-neutral-900 border border-neutral-200/50' : 'text-neutral-500 hover:text-neutral-900'}`}
          >
            分发排期
          </button>
        </div>
      </div>

      <div className="flex-1 w-full overflow-y-auto bg-neutral-50/50 custom-scrollbar pb-24">
        <div className="max-w-6xl mx-auto space-y-6 pt-8 p-6 lg:p-8">
          
          {viewMode === 'dashboard' ? (
            <div className="space-y-8">
              {/* Data overview */}
              <div className="grid grid-cols-4 gap-4">
                <div 
                  className="bg-white p-5 rounded-[20px] border border-neutral-100 shadow-sm flex flex-col justify-between cursor-pointer hover:border-primary-200 transition-colors"
                  onClick={() => setShowAccountBreakdown(!showAccountBreakdown)}
                >
                  <div className="flex flex-col gap-2">
                    <div className="text-[12px] text-neutral-500 flex items-center justify-between">
                      <span className="flex items-center gap-1.5"><Users size={14}/> 账号总数</span>
                      <span className="text-[10px] bg-neutral-50 px-1.5 py-0.5 rounded text-neutral-400">{showAccountBreakdown ? '点击收起' : '点击展开'}</span>
                    </div>
                    <div className="flex items-end gap-2">
                      <span className="text-3xl font-semibold text-neutral-900">42</span>
                      <span className="text-[11px] text-success-500 bg-success-50 px-1.5 py-0.5 rounded pb-1">个</span>
                    </div>
                  </div>
                  
                  {showAccountBreakdown && (
                    <div className="mt-4 pt-4 border-t border-neutral-100 flex flex-col gap-2">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-neutral-500">品牌专业号</span>
                        <span className="font-medium text-neutral-900">8 个</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-neutral-500">KOS员工号</span>
                        <span className="font-medium text-neutral-900">12 个</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-neutral-500">邀约达人号</span>
                        <span className="font-medium text-neutral-900">5 个</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-neutral-500">社群素人号</span>
                        <span className="font-medium text-neutral-900">10 个</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-neutral-500">客户素人号</span>
                        <span className="font-medium text-neutral-900">7 个</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="bg-white p-5 rounded-[20px] border border-neutral-100 shadow-sm flex flex-col justify-between">
                  <div className="text-[12px] text-neutral-500 mb-2 flex items-center gap-1.5"><History size={14}/> 30天活跃发文数</div>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-semibold text-neutral-900">215</span>
                    <span className="text-[11px] text-neutral-400 bg-neutral-50 px-1.5 py-0.5 rounded pb-1">篇</span>
                  </div>
                </div>
                <div className="bg-white p-5 rounded-[20px] border border-neutral-100 shadow-sm flex flex-col justify-between">
                  <div className="text-[12px] text-neutral-500 mb-2 flex items-center gap-1.5"><Calendar size={14}/> 今日待发布排期</div>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-semibold text-primary-500">12</span>
                    <span className="text-[11px] text-primary-500 bg-primary-50 px-1.5 py-0.5 rounded pb-1">条</span>
                  </div>
                </div>
                <div className="bg-white p-5 rounded-[20px] border border-rose-100 bg-rose-50/30 flex flex-col justify-between">
                  <div className="text-[12px] text-rose-500 mb-2 flex items-center gap-1.5"><AlertCircle size={14}/> 异常/限流账号</div>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-semibold text-rose-600">1</span>
                    <span className="text-[11px] text-rose-600 bg-rose-100 px-1.5 py-0.5 rounded pb-1">个</span>
                  </div>
                </div>
              </div>

              {/* Owned Accounts */}
              <div className="bg-white border border-neutral-100 rounded-[20px] overflow-hidden shadow-sm">
                <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
                  <h3 className="text-[14px] font-semibold text-neutral-900">自有 / 授权账号 <span className="text-[12px] font-normal text-neutral-500 ml-2">具备登录态，可获取聚光及笔记明细数据</span></h3>
                </div>
                <div>
                  {MOCK_OWNED_ACCOUNTS.map((acc, i) => (
                    <div key={acc.id} className={`p-5 flex items-center justify-between ${i !== MOCK_OWNED_ACCOUNTS.length - 1 ? 'border-b border-neutral-100' : ''}`}>
                      <div className="flex items-center gap-4 min-w-[200px]">
                        <div className={`w-10 h-10 rounded-full border border-neutral-100 flex items-center justify-center font-medium ${acc.color}`}>
                          {acc.initial}
                        </div>
                        <div>
                          <div className="text-[14px] font-semibold text-neutral-900 mb-0.5 flex items-center gap-2">
                            {acc.name}
                            <span className="text-[9px] text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">{acc.loginMode}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-neutral-400 bg-neutral-50 px-1.5 py-0.5 rounded">{acc.type}</span>
                            <span className="text-[10px] text-neutral-400 bg-neutral-50 px-1.5 py-0.5 rounded">粉丝 {acc.followers}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between flex-1 pl-12 gap-6">
                        <div className="flex flex-col gap-1 w-[80px]">
                          <span className="text-[11px] text-neutral-400">日发文配额</span>
                          <span className="text-[13px] font-medium text-neutral-700">{acc.quota}</span>
                        </div>
                        <div className="flex flex-col gap-1 w-[80px]">
                          <span className="text-[11px] text-neutral-400">今日待发排期</span>
                          <span className="text-[13px] font-medium text-neutral-700">{acc.todayTasks} 篇</span>
                        </div>
                        <div className="flex flex-col gap-1 w-[120px]">
                          <span className="text-[11px] text-neutral-400">聚光消耗(近30天)</span>
                          <span className="text-[13px] font-medium text-neutral-700">{acc.recentAds}</span>
                        </div>
                        <div className="flex flex-col gap-1 w-[80px]">
                          <span className="text-[11px] text-neutral-400">状态监控</span>
                          <span className={`text-[13px] font-medium ${acc.health === 'good' ? 'text-success-600' : acc.health === 'warning' ? 'text-amber-500' : 'text-rose-500'}`}>{acc.status}</span>
                        </div>
                      </div>

                      <div className="w-[100px] text-right shrink-0">
                        <button className="text-[12px] text-primary-500 font-medium hover:text-primary-600">查看笔记数据</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* External / Monitoring Accounts */}
              <div className="bg-white border border-neutral-100 rounded-[20px] overflow-hidden shadow-sm mt-6">
                <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
                  <h3 className="text-[14px] font-semibold text-neutral-900">素人 / 达人号 <span className="text-[12px] font-normal text-neutral-500 ml-2">无登录态，采用监控手段采集公开互动数据及账号状态</span></h3>
                </div>
                <div>
                  {MOCK_EXTERNAL_ACCOUNTS.map((acc, i) => (
                    <div key={acc.id} className={`p-5 flex items-center justify-between ${i !== MOCK_EXTERNAL_ACCOUNTS.length - 1 ? 'border-b border-neutral-100' : ''}`}>
                      <div className="flex items-center gap-4 min-w-[200px]">
                        <div className={`w-10 h-10 rounded-full border border-neutral-100 flex items-center justify-center font-medium ${acc.color}`}>
                          {acc.initial}
                        </div>
                        <div>
                          <div className="text-[14px] font-semibold text-neutral-900 mb-0.5 flex items-center gap-2">
                            {acc.name}
                            <span className="text-[9px] text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">{acc.monitoring}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-neutral-400 bg-neutral-50 px-1.5 py-0.5 rounded">{acc.type}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between flex-1 pl-12 gap-6">
                        <div className="flex flex-col gap-1 w-[80px]">
                          <span className="text-[11px] text-neutral-400">发文频率</span>
                          <span className="text-[13px] font-medium text-neutral-700">{acc.frequency}</span>
                        </div>
                        <div className="flex flex-col gap-1 w-[80px]">
                          <span className="text-[11px] text-neutral-400">互动总分</span>
                          <span className="text-[13px] font-medium text-neutral-700">{acc.engagementScore}</span>
                        </div>
                        <div className="flex flex-col gap-1 w-[120px]">
                          <span className="text-[11px] text-neutral-400">近3篇互动率</span>
                          <span className={`text-[13px] font-medium ${acc.health === 'warning' ? 'text-amber-500' : 'text-neutral-700'}`}>{acc.recentInteractionRate}</span>
                        </div>
                        <div className="flex flex-col gap-1 w-[80px]">
                          <span className="text-[11px] text-neutral-400">状态监控</span>
                          <span className={`text-[13px] font-medium ${acc.health === 'good' ? 'text-success-600' : acc.health === 'warning' ? 'text-amber-500' : 'text-rose-500'}`}>{acc.status}</span>
                        </div>
                      </div>

                      <div className="w-[100px] text-right shrink-0">
                        <button className="text-[12px] text-primary-500 font-medium hover:text-primary-600 flex items-center gap-1.5 justify-end w-full"><Bot size={14} /> Agent 深度诊断</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : viewMode === 'queue' ? (
            <div className="space-y-6">
{MOCK_QUEUE.length === 0 ? <div className="text-center py-20 text-neutral-400">请先在项目与内容中完成笔记生成</div> : MOCK_QUEUE.map(task => (
                <div key={task.id} className="bg-white border border-neutral-100 rounded-[20px] p-5 shadow-sm flex items-center justify-between hover:shadow-md hover:border-primary-200 transition-all">
                  <div className="flex items-center gap-5 flex-1 w-0">
                    <img src={task.image} alt={task.title} className="w-16 h-16 rounded-xl object-cover" />
                    <div className="flex flex-col gap-1.5 overflow-hidden w-full">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${task.status === '已完成发文' ? 'bg-success-50 text-success-600' : 'bg-primary-50 text-primary-600'}`}>{task.status}</span>
                        <h4 className="text-[15px] font-semibold text-neutral-900 truncate">{task.title}</h4>
                      </div>
                      <div className="flex gap-4 text-[12px] text-neutral-400">
                        <span className="flex items-center gap-1"><User size={12}/> 分发给: {task.assignTo}</span>
                        <span className="flex items-center gap-1"><Calendar size={12}/> 取单排期: {task.expectedTime}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 ml-8">
                    {task.status === '等待发文' ? (
                      <>
                        <button onClick={() => setShowQrCode(task.id)} className="px-4 py-2 bg-indigo-50 text-indigo-600 border border-indigo-100 hover:bg-indigo-100 rounded-xl text-[12px] font-medium flex items-center gap-1.5 transition-colors">
                          <Smartphone size={14} /> 扫码取原件发文
                        </button>
                        <button className="px-4 py-2 border border-neutral-200 text-neutral-600 hover:bg-neutral-50 rounded-xl text-[12px] font-medium flex items-center gap-1.5 transition-colors">
                          <CheckCircle2 size={14} /> 标记为已发布
                        </button>
                      </>
                    ) : (
                      <span className="px-4 py-2 text-success-500 font-medium text-[13px] flex items-center gap-1.5">
                        <CheckCircle2 size={16} /> 已归档复盘
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
) : viewMode === 'calendar' ? (<div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100"><h3 className="text-[15px] font-semibold text-neutral-900 mb-4">本周排期日历</h3><div className="grid grid-cols-7 gap-4"><div className="col-span-1 text-center"><div className="text-[12px] text-neutral-400 mb-2 border-b pb-2">周一</div><div className="space-y-2 mt-2"><div className="bg-primary-50 p-2 rounded-xl flex flex-col gap-1 cursor-pointer hover:bg-primary-100 border border-primary-100 text-left"><span className="text-[10px] text-primary-600 font-medium truncate">防晒实测第1篇</span><span className="text-[9px] text-primary-400">@奈雪</span></div></div></div><div className="col-span-1 text-center"><div className="text-[12px] text-neutral-400 mb-2 border-b pb-2">周二</div><div className="space-y-2 mt-2"><div className="bg-amber-50 p-2 rounded-xl flex flex-col gap-1 cursor-pointer hover:bg-amber-100 border border-amber-100 text-left"><span className="text-[10px] text-amber-600 font-medium truncate">带妆防晒组合</span><span className="text-[9px] text-amber-400">@周末喝点啥</span></div></div></div><div className="col-span-1 text-center"><div className="text-[12px] text-neutral-400 mb-2 border-b pb-2">周三</div><div className="space-y-2 mt-2"></div></div><div className="col-span-1 text-center"><div className="text-[12px] text-neutral-400 mb-2 border-b pb-2">周四</div><div className="space-y-2 mt-2"></div></div><div className="col-span-1 text-center"><div className="text-[12px] text-neutral-400 mb-2 border-b pb-2">周五</div><div className="space-y-2 mt-2"></div></div><div className="col-span-1 text-center"><div className="text-[12px] text-neutral-400 mb-2 border-b pb-2">周六</div><div className="space-y-2 mt-2"></div></div><div className="col-span-1 text-center"><div className="text-[12px] text-neutral-400 mb-2 border-b pb-2">周日</div><div className="space-y-2 mt-2"></div></div></div></div>) : null}
        </div>
      </div>

      {showQrCode && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowQrCode(null)}>
          <div className="w-[320px] bg-white rounded-[24px] shadow-2xl p-6 flex flex-col items-center" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-4">
              <QrCode size={24} />
            </div>
            <h3 className="text-[16px] font-semibold text-neutral-900 mb-1">手机扫码提取物料</h3>
            <p className="text-[12px] text-neutral-500 text-center leading-relaxed mb-6">
              打开微信/相机扫描下方二维码<br/>一键提取图文组合至手机相册和剪贴板
            </p>
            <div className="w-[200px] h-[200px] bg-white border border-neutral-100 rounded-[16px] flex items-center justify-center shadow-inner mb-6">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://xhs.com/distribution/queue" alt="qr" className="w-[180px] h-[180px] opacity-80" />
            </div>
            <button onClick={() => setShowQrCode(null)} className="w-full py-3 bg-neutral-900 text-white rounded-[14px] text-[13px] font-medium hover:bg-neutral-800 transition-colors">
              完成扫码
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

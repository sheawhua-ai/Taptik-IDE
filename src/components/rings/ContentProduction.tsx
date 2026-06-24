import React, { useState } from 'react';
import { 
  Users, Share2, AlertCircle, ScanLine, Smartphone, Calendar, User, History, CheckCircle2, QrCode
} from 'lucide-react';

export const ContentProduction: React.FC<{ hasData?: boolean }> = ({ hasData = true }) => {
  const [viewMode, setViewMode] = useState<'dashboard' | 'queue'>('dashboard');
  const [showQrCode, setShowQrCode] = useState<string | null>(null);
  const [showAccountBreakdown, setShowAccountBreakdown] = useState(false);

  const MOCK_ACCOUNTS = [
    { 
      id: 'a1', 
      name: '奈雪-区域福利官', 
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&q=80',
      type: '企业专业号', 
      source: '自有资产', 
      loginStatus: 'managed',
      status: '正常运行', 
      followers: '12.4w', 
      quota: '5篇/天', 
      usedQuota: 2, 
      todayTasks: 2, 
      health: 'good',
      juguangData: { cost: '¥4,500', roi: '1:3.2', impressions: '145.2w' },
      noteStats: { likes: '1.2w', saves: '4.5k', comments: '820' },
    },
    { 
      id: 'a2', 
      name: '周末喝点啥', 
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
      type: '员工 KOS', 
      source: '自有资产', 
      loginStatus: 'managed',
      status: '正常运行', 
      followers: '3,200', 
      quota: '3篇/天', 
      usedQuota: 1, 
      todayTasks: 1, 
      health: 'good',
      juguangData: { cost: '¥1,200', roi: '1:2.1', impressions: '35.4w' },
      noteStats: { likes: '8.4k', saves: '1.2k', comments: '340' },
    },
    { 
      id: 'a3', 
      name: '阿喵测评', 
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80',
      type: '兼职素人', 
      source: '商单派发', 
      loginStatus: 'unmanaged',
      status: '未活跃(超3天)', 
      followers: '840', 
      quota: '无限制', 
      usedQuota: 0, 
      todayTasks: 0, 
      health: 'warning',
      monitoringData: { growthRate: '+12%', engagementRate: '4.5%', brandMentions: 12 },
    },
    { 
      id: 'a4', 
      name: '广州吃喝小分队', 
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&q=80',
      type: '员工 KOS', 
      source: '自有资产', 
      loginStatus: 'unmanaged',
      status: '异常限流', 
      followers: '1.2w', 
      quota: '暂停发文', 
      usedQuota: 0, 
      todayTasks: 0, 
      health: 'error',
      monitoringData: { growthRate: '-2%', engagementRate: '1.1%', brandMentions: 3 },
    },
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

              {/* Account List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-[15px] font-semibold text-neutral-900">入网账号流水</h3>
                  <div className="text-[12px] text-neutral-500 flex gap-4">
                    <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-success-500"></div> 正常运行</span>
                    <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-warning-500 text-amber-500"></div> 异常或限流</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {MOCK_ACCOUNTS.map((acc) => (
                    <div key={acc.id} className="bg-white border border-neutral-200 rounded-[24px] p-5 shadow-sm hover:shadow-md hover:border-primary-200 transition-all">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-5">
                        <div className="flex items-center gap-3">
                          <img src={acc.avatar} alt={acc.name} referrerPolicy="no-referrer" className="w-12 h-12 rounded-full object-cover border-2 border-neutral-50 shadow-sm" />
                          <div>
                            <div className="flex items-center gap-2 mb-0.5">
                              <h4 className="text-[15px] font-semibold text-neutral-900">{acc.name}</h4>
                              <div className={`w-2 h-2 rounded-full ${acc.health === 'good' ? 'bg-success-500' : acc.health === 'warning' ? 'bg-amber-500' : 'bg-rose-500'}`} />
                            </div>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className="text-[10px] text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded">{acc.type}</span>
                              <span className={`text-[10px] px-1.5 py-0.5 rounded ${acc.loginStatus === 'managed' ? 'text-primary-600 bg-primary-50' : 'text-indigo-600 bg-indigo-50'}`}>
                                {acc.loginStatus === 'managed' ? 'PC/App静默挂载' : '云端监控'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[14px] font-semibold text-neutral-900">{acc.followers}</div>
                          <div className="text-[11px] text-neutral-400">粉丝量</div>
                        </div>
                      </div>

                      {/* Content based on loginStatus */}
                      {acc.loginStatus === 'managed' ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-3 gap-2 p-3 bg-neutral-50 rounded-xl">
                            <div>
                              <div className="text-[10px] text-neutral-400 mb-1">聚光消耗</div>
                              <div className="text-[13px] font-medium text-neutral-800">{acc.juguangData?.cost || '-'}</div>
                            </div>
                            <div>
                              <div className="text-[10px] text-neutral-400 mb-1">聚光ROI</div>
                              <div className="text-[13px] font-medium text-success-600">{acc.juguangData?.roi || '-'}</div>
                            </div>
                            <div>
                              <div className="text-[10px] text-neutral-400 mb-1">笔记赞藏</div>
                              <div className="text-[13px] font-medium text-neutral-800">{acc.noteStats?.likes || '-'}</div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-[11px] text-neutral-500 font-medium px-1 flex items-center justify-between">
                              <span>近期高频笔记</span>
                              <span className="text-primary-500 cursor-pointer hover:underline">查看后台数据</span>
                            </div>
                            <div className="space-y-1.5">
                              <div className="text-[12px] text-neutral-700 bg-white border border-neutral-100 rounded-lg p-2 truncate">· 夏日通勤防晒实测第1篇 <span className="text-neutral-400 ml-1">12w阅读</span></div>
                              <div className="text-[12px] text-neutral-700 bg-white border border-neutral-100 rounded-lg p-2 truncate">· 带妆一整天持妆防晒组合 <span className="text-neutral-400 ml-1">8.4w阅读</span></div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="grid grid-cols-3 gap-2 p-3 bg-indigo-50/50 rounded-xl border border-indigo-100/50">
                            <div>
                              <div className="text-[10px] text-indigo-400 mb-1">预计粉丝增速</div>
                              <div className={`text-[13px] font-medium ${acc.monitoringData?.growthRate?.includes('+') ? 'text-success-600' : 'text-rose-500'}`}>{acc.monitoringData?.growthRate || '-'}</div>
                            </div>
                            <div>
                              <div className="text-[10px] text-indigo-400 mb-1">赞藏互动率</div>
                              <div className="text-[13px] font-medium text-indigo-700">{acc.monitoringData?.engagementRate || '-'}</div>
                            </div>
                            <div>
                              <div className="text-[10px] text-indigo-400 mb-1">品牌词提及</div>
                              <div className="text-[13px] font-medium text-indigo-700">{acc.monitoringData?.brandMentions || 0}次</div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-[11px] text-neutral-500 font-medium px-1">监控笔记动态</div>
                            <div className="space-y-1.5">
                              <div className="text-[12px] text-neutral-600 bg-white border border-neutral-100 rounded-lg p-2 truncate flex items-center justify-between">
                                <span className="truncate">· 测评了10款宠物零食，推荐...</span>
                                <span className="text-indigo-500 text-[10px] bg-indigo-50 px-1.5 py-0.5 rounded shrink-0">云端监控中</span>
                              </div>
                              <div className="text-[12px] text-neutral-600 bg-white border border-neutral-100 rounded-lg p-2 truncate flex items-center justify-between">
                                <span className="truncate">· 铲屎官必看的换粮指南</span>
                                <span className="text-indigo-500 text-[10px] bg-indigo-50 px-1.5 py-0.5 rounded shrink-0">云端监控中</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Footer actions */}
                      <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center justify-between">
                        <div className="flex items-center gap-4 text-[11px] text-neutral-500">
                          <span className="flex items-center gap-1"><History size={12}/> 状态: <span className="text-neutral-700">{acc.status}</span></span>
                          <span className="flex items-center gap-1"><Calendar size={12}/> 今日待发: <span className="text-neutral-700">{acc.todayTasks}</span></span>
                        </div>
                        <button className="text-[12px] px-3 py-1.5 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors">
                          账号详情
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {MOCK_QUEUE.map(task => (
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
          )}
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

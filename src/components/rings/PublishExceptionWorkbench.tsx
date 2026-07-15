import React, { useState } from 'react';
import { 
  Camera, Users, FileImage, AlertOctagon, X, Search, Filter,
  ChevronRight, CheckCircle2, Clock, AlertTriangle, PlayCircle,
  User, Image as ImageIcon, Copy, Download, RefreshCw, Send, 
  Check, AlertCircle, Plus, Info, Settings, Trash2, ArrowRight, 
  FolderOpen, Server, ChevronDown, MapPin, Tag, Smartphone, Eye, EyeOff,
  WifiOff, Ban, ShieldAlert, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onClose: () => void;
  initialSelectedId?: string;
}

export function PublishExceptionWorkbench({ onClose, initialSelectedId }: Props) {
  // We'll mock the exception queue
  // Types: network, sensitive, account, material, mobile
  const [activeExceptionId, setActiveExceptionId] = useState(initialSelectedId || 'e1');
  const [activeRightPanel, setActiveRightPanel] = useState<'default' | 'adjust'>('default');
  const [showSecondaryConfirm, setShowSecondaryConfirm] = useState(false);

  const exceptions = [
    {
      id: 'e1', project: '幼犬换粮搜索卡位', account: '小红书-A02', title: '幼犬换粮一定要慢！附换粮周期表', 
      plannedTime: '今天 10:00', failCount: 1, type: 'sensitive', typeName: '敏感表达',
      content: '今天给大家分享一下幼犬换粮的经验。很多新手家长刚接狗狗回家，就迫不及待地喂新粮，结果狗狗拉稀软便。其实换粮要遵循七日换粮法！第一天新粮比例10%，旧粮90%... 另外，如果肠胃敏感，建议搭配益生菌。绝对是狗粮界的天花板！',
      sensitiveWord: '天花板',
      replaceCandidates: ['顶配选择', '极佳选择'],
      platformPrompt: '笔记中包含绝对化用语，建议修改后重新发布。'
    },
    {
      id: 'e2', project: '双11大促', account: '抖音-官方旗舰店', title: '双11年度最强囤货指南', 
      plannedTime: '今天 11:30', failCount: 3, type: 'account', typeName: '账号限制',
      content: '年度最强优惠来了！...',
      lastSuccess: '昨天 18:00',
      healthInfo: '账号处于高风险状态，可能被平台限流或禁言。',
      affectedNotes: 4,
      platformPrompt: '您的账号当前状态异常，暂不支持发布操作。'
    },
    {
      id: 'e3', project: '日常种草', account: '小红书-C05', title: '沉浸式拆箱新猫砂', 
      plannedTime: '今天 12:00', failCount: 2, type: 'network', typeName: '网络中断',
      content: '刚收到新买的猫砂，马上给大家拆箱看看...',
      platformPrompt: '网络请求超时，请检查您的网络连接。'
    },
    {
      id: 'e4', project: '线下门店引流', account: '小红书-员工李四', title: '太阳宫店周末打卡记录', 
      plannedTime: '今天 14:00', failCount: 1, type: 'mobile', typeName: '等待手机发布',
      content: '这个周末来太阳宫店逛逛，现场活动很丰富哦！...',
      platformPrompt: '该账号需在移动端完成最终发布确认。'
    }
  ];

  // Group by project, then by account
  // Wait, for simplicity in UI, let's just group by project
  const groupedExceptions = exceptions.reduce((acc, curr) => {
    if (!acc[curr.project]) acc[curr.project] = [];
    acc[curr.project].push(curr);
    return acc;
  }, {} as Record<string, typeof exceptions>);

  const activeException = exceptions.find(e => e.id === activeExceptionId) || exceptions[0];

  const getIconForType = (type: string) => {
    switch (type) {
      case 'network': return <WifiOff size={14} className="text-amber-500" />;
      case 'sensitive': return <ShieldAlert size={14} className="text-rose-500" />;
      case 'account': return <Ban size={14} className="text-rose-500" />;
      case 'mobile': return <Smartphone size={14} className="text-blue-500" />;
      default: return <AlertCircle size={14} className="text-neutral-500" />;
    }
  };

  const renderContentWithHighlight = (text: string, word?: string) => {
    if (!word) return text;
    const parts = text.split(word);
    return (
      <>
        {parts.map((part, i) => (
          <React.Fragment key={i}>
            {part}
            {i < parts.length - 1 && (
              <span className="bg-rose-100 text-rose-700 px-1 border-b-2 border-rose-400 font-bold">{word}</span>
            )}
          </React.Fragment>
        ))}
      </>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] bg-neutral-100 flex flex-col h-screen overflow-hidden">
      <div className="w-full bg-white h-full flex flex-col shadow-2xl animate-in fade-in duration-300">
        
        {/* ================= Header ================= */}
        <div className="px-6 py-4 border-b border-neutral-200 flex justify-between items-center bg-white shrink-0">
          <div className="flex items-center gap-6">
            <h2 className="text-[18px] font-bold text-neutral-900 flex items-center gap-2">
              <AlertOctagon className="text-rose-600" size={20} />
              发布与账号异常
            </h2>
            <div className="text-[13px] text-neutral-500">
              共 4 项异常待处理
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-full text-neutral-500">
            <X size={20} />
          </button>
        </div>

        {/* ================= Body ================= */}
        <div className="flex-1 overflow-hidden flex bg-neutral-50">
          
          {/* Left Column: 异常队列 */}
          <div className="w-[320px] bg-white border-r border-neutral-200 flex flex-col shrink-0">
            <div className="p-4 border-b border-neutral-100 font-bold text-[14px] text-neutral-800 flex items-center justify-between">
              <span>异常队列</span>
              <Filter size={14} className="text-neutral-400" />
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-4">
              {Object.entries(groupedExceptions).map(([project, items]) => (
                <div key={project} className="space-y-2">
                  <div className="text-[11px] text-neutral-500 font-bold px-1">{project}</div>
                  {items.map(item => (
                    <div 
                      key={item.id}
                      className={`p-3 rounded-xl border cursor-pointer transition-colors ${activeExceptionId === item.id ? 'bg-primary-50/30 border-primary-300 shadow-sm' : 'bg-white border-neutral-200 hover:border-neutral-300'}`}
                      onClick={() => setActiveExceptionId(item.id)}
                    >
                      <div className="text-[13px] font-bold text-neutral-800 mb-1 line-clamp-1 flex items-center gap-1.5">
                        {item.type === 'account' ? (
                           <div className="flex items-center gap-1"><Ban size={14} className="text-rose-500"/> {item.account} (账号级异常)</div>
                        ) : (
                          item.title
                        )}
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-neutral-500 mb-2">
                        <span className="flex items-center gap-1"><User size={12}/> {item.type !== 'account' ? item.account : "包含 " + item.affectedNotes + " 篇笔记"}</span>
                        <span>{item.plannedTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-bold bg-neutral-100 text-neutral-600">
                          失败 {item.failCount} 次
                        </span>
                        <span className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-bold ${item.type === 'sensitive' || item.type === 'account' ? 'bg-rose-50 text-rose-700' : item.type === 'network' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'}`}>
                          {getIconForType(item.type)} {item.typeName}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Middle Column: 发布现场 */}
          <div className="flex-1 flex flex-col min-w-0 bg-[#f8f9fa] relative">
            <div className="p-5 border-b border-neutral-200 bg-white shrink-0 shadow-sm z-10">
              <h3 className="text-[18px] font-bold text-neutral-900 mb-2">发布现场</h3>
              <div className="flex items-center gap-4 text-[13px] text-neutral-500">
                <span className="flex items-center gap-1"><User size={14}/> {activeException.account}</span>
                <span className="flex items-center gap-1"><Clock size={14}/> 计划: {activeException.plannedTime}</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              <div className="max-w-2xl mx-auto space-y-6">
                
                {/* 平台原始提示 */}
                <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 flex items-start gap-3">
                  <AlertOctagon size={18} className="text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[13px] font-bold text-rose-900 mb-1">平台原始提示</div>
                    <div className="text-[13px] text-rose-700">{activeException.platformPrompt}</div>
                  </div>
                </div>

                {/* 账号限制特有信息 */}
                {activeException.type === 'account' && (
                  <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm">
                    <h4 className="font-bold text-[14px] text-neutral-800 mb-3 flex items-center gap-2">
                      <ShieldAlert size={16} className="text-neutral-500"/> 账号健康信息
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-[13px]">
                      <div>
                        <span className="text-neutral-500 block mb-1">最近成功发布</span>
                        <span className="font-bold text-neutral-800">{activeException.lastSuccess}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block mb-1">账号状态</span>
                        <span className="font-bold text-rose-600">{activeException.healthInfo}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 发布包详情 */}
                <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-neutral-100 font-bold text-[14px] text-neutral-800 bg-neutral-50 flex items-center gap-2">
                    <FileImage size={16} className="text-neutral-500" />
                    完整发布包
                  </div>
                  <div className="p-5 space-y-4">
                    <div>
                      <div className="text-[12px] text-neutral-500 font-bold mb-1">笔记标题</div>
                      <div className="text-[15px] font-bold text-neutral-900">{activeException.title}</div>
                    </div>
                    <div>
                      <div className="text-[12px] text-neutral-500 font-bold mb-1">正文内容</div>
                      <div className="text-[13px] text-neutral-700 leading-relaxed bg-neutral-50 p-3 rounded-lg">
                        {renderContentWithHighlight(activeException.content, activeException.sensitiveWord)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[12px] text-neutral-500 font-bold mb-2">图片与顺序</div>
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {[1,2,3].map(i => (
                          <div key={i} className="w-20 h-20 shrink-0 bg-neutral-100 rounded-lg border border-neutral-200 flex items-center justify-center text-[10px] text-neutral-400 font-bold relative">
                            图 {i}
                            <div className="absolute top-1 left-1 w-4 h-4 bg-black/50 text-white rounded flex items-center justify-center text-[10px]">{i}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Right Column: 诊断与可执行方案 */}
          <div className="w-[340px] bg-white border-l border-neutral-200 flex flex-col shrink-0">
            <div className="p-4 border-b border-neutral-100 bg-neutral-50">
              <h3 className="font-bold text-[15px] text-neutral-900 flex items-center gap-2">
                <Tag size={16} className="text-primary-600"/>
                诊断与可执行方案
              </h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* AI 诊断 */}
              <div>
                <h4 className="text-[13px] font-bold text-neutral-800 mb-2 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-primary-600"/> AI 诊断分析
                </h4>
                <div className="text-[13px] text-neutral-600 leading-relaxed">
                  {activeException.type === 'network' && '检测到发布节点网络波动。属于临时性网络中断，图文内容及账号状态均无异常。'}
                  {activeException.type === 'sensitive' && `内容中包含绝对化用语 "${activeException.sensitiveWord}"，违反广告法及平台规范，属于内容合规问题。`}
                  {activeException.type === 'account' && `账号 "${activeException.account}" 连续触发异常，判定为平台限流或封禁风险。继续发布将扩大影响范围。`}
                  {activeException.type === 'mobile' && `当前账号设置为“员工协助发布”模式，系统仅能推送草稿，最终点击发布需由员工在手机客户端完成。`}
                </div>
              </div>

              {/* 动作面板 */}
              <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm">
                <h4 className="text-[13px] font-bold text-neutral-800 mb-3">可执行方案</h4>
                
                {activeException.type === 'sensitive' && (
                  <div className="space-y-4">
                    <div className="text-[12px] text-neutral-600">建议将敏感词替换为合规表达：</div>
                    <div className="flex flex-wrap gap-2">
                      {activeException.replaceCandidates?.map((cand, i) => (
                        <button key={i} className="px-3 py-1.5 bg-primary-50 text-primary-700 border border-primary-200 rounded-lg text-[12px] font-bold hover:bg-primary-100 transition-colors">
                          使用 "{cand}"
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {activeException.type === 'account' && (
                  <div className="space-y-4">
                    <div className="text-[12px] text-neutral-600">受影响的笔记排期：</div>
                    <div className="bg-rose-50 text-rose-700 p-2 rounded text-[12px]">
                      共 {activeException.affectedNotes} 篇笔记排队中，建议立即暂停该账号的所有后续发布任务，避免账号被永久封禁。
                    </div>
                    {showSecondaryConfirm && (
                      <div className="bg-neutral-900 text-white p-3 rounded-lg text-[12px] mt-2">
                        <div className="font-bold mb-1">确定暂停此账号？</div>
                        <div className="text-neutral-400 mb-3">所有未发布的笔记将被移回草稿箱，排期取消。</div>
                        <div className="flex gap-2">
                          <button className="flex-1 py-1.5 bg-rose-600 rounded text-white font-bold text-[12px]">确认暂停</button>
                          <button onClick={() => setShowSecondaryConfirm(false)} className="flex-1 py-1.5 bg-neutral-700 rounded text-white font-bold text-[12px]">取消</button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeException.type === 'network' && (
                  <div className="text-[12px] text-neutral-600">
                    当前网络线路已自动切换。建议进行网络恢复测试，测试通过后可一键重试。
                  </div>
                )}

                {activeException.type === 'mobile' && (
                  <div className="text-[12px] text-neutral-600">
                    请将发布包推送至执行人微信，或直接复制文案素材。
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* ================= Bottom Fixed Action Bar ================= */}
        <div className="h-16 bg-white border-t border-neutral-200 flex items-center justify-between px-6 shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-20">
          <div className="text-[13px] text-neutral-500">当前异常处理进度: <span className="font-bold text-neutral-800">1 / 4</span></div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-xl text-[13px] font-bold hover:bg-neutral-50 transition-colors">忽略此异常</button>
            
            {activeException.type === 'network' && (
              <button className="px-6 py-2 bg-neutral-900 text-white rounded-xl text-[13px] font-bold hover:bg-neutral-800 transition-colors">网络恢复后重试</button>
            )}
            
            {activeException.type === 'sensitive' && (
              <button className="px-6 py-2 bg-neutral-900 text-white rounded-xl text-[13px] font-bold hover:bg-neutral-800 transition-colors">采用修改并重新进入审核</button>
            )}
            
            {activeException.type === 'account' && !showSecondaryConfirm && (
              <button onClick={() => setShowSecondaryConfirm(true)} className="px-6 py-2 bg-rose-600 text-white rounded-xl text-[13px] font-bold hover:bg-rose-700 transition-colors">暂停该账号排期</button>
            )}

            {activeException.type === 'mobile' && (
              <>
                <button className="px-4 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-xl text-[13px] font-bold hover:bg-neutral-50 transition-colors">复制发布包</button>
                <button className="px-6 py-2 bg-neutral-900 text-white rounded-xl text-[13px] font-bold hover:bg-neutral-800 transition-colors">推送到员工 H5</button>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

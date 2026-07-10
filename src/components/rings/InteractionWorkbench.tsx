import React, { useState } from 'react';
import {
  MessageCircle,
  MessageSquare,
  ShieldAlert,
  Search,
  CheckCircle2,
  AlertOctagon,
  ChevronRight,
  User,
  Sparkles,
  Link2,
  Image as ImageIcon,
  Clock,
  Check,
  X,
  FileText,
  AlertTriangle,
  Info,
  Send,
  Eye,
  CornerDownRight,
  MoreHorizontal,
  ListChecks
} from 'lucide-react';

export function InteractionWorkbench({ task, onClose }: { task?: any, onClose?: () => void }) {
  const [activeTab, setActiveTab] = useState<'private_msg' | 'comment' | 'intercept' | 'competitor' | 'risk'>('private_msg');

  const tabs = [
    { id: 'private_msg', label: '私信承接', icon: MessageCircle, count: 5 },
    { id: 'comment', label: '评论待处理', icon: MessageSquare, count: 12 },
    { id: 'intercept', label: '截流机会', icon: Search, count: 3 },
    { id: 'competitor', label: '竞品观察', icon: Eye },
    { id: 'risk', label: '风险互动', icon: ShieldAlert, count: 1, alert: true }
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-neutral-100 flex flex-col h-screen overflow-hidden">
      {/* Top Navigation */}
      <div className="bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-6">
          <button onClick={onClose} className="text-neutral-500 hover:text-neutral-900 mr-2 flex items-center gap-2">
            <X size={20} />
            <h2 className="text-[16px] font-bold text-neutral-900">互动承接</h2>
          </button>
          <div className="h-4 w-px bg-neutral-200 mx-2"></div>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`relative flex items-center gap-2 pb-4 -mb-4 text-[14px] font-bold transition-colors ${
                activeTab === tab.id
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
              {tab.count && (
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  tab.alert ? 'bg-rose-100 text-rose-600' : 'bg-neutral-100 text-neutral-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 border border-neutral-200 text-neutral-700 bg-white rounded-lg text-[13px] font-bold hover:bg-neutral-50 transition-colors shadow-sm">
            承接规则配置
          </button>
        </div>
      </div>

      {/* Main Content Areas */}
      <div className="flex-1 overflow-hidden relative">
        {activeTab === 'private_msg' && <PrivateMsgTab />}
        {activeTab === 'comment' && <CommentTab />}
        {activeTab === 'intercept' && <InterceptTab />}
        {activeTab === 'competitor' && <CompetitorTab />}
        {activeTab === 'risk' && <RiskTab />}
      </div>
    </div>
  );
}

// Sub-components will be defined below

function PrivateMsgTab() {
  const [activeSessionId, setActiveSessionId] = useState('s1');
  const [replyText, setReplyText] = useState('您好，目前的试吃活动我需要帮您确认一下。幼犬主粮的商品入口可以先发给您，确认好试吃规则后再回复您。');
  const [hasUnconfirmed, setHasUnconfirmed] = useState(true);
  
  const sessions = [
    { id: 's1', user: '旺财妈妈', time: '昨天 10:30', status: '待24小时跟进', history: [{ role: 'user', text: '你好，之前送的试吃装还有吗？' }, { role: 'brand', text: '您好，这边帮您核实一下哦~' }], intent: 'A类 · 高意向', waitCheck: true },
    { id: 's2', user: '豆豆的小金毛', time: '今天 09:15', status: '待首次回复', history: [{ role: 'user', text: '我家狗3个月能吃这款吗？' }], intent: 'B类 · 中意向', waitCheck: false }
  ];
  
  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];

  return (
    <div className="h-full flex flex-col">
      {/* Top Banner */}
      <div className="bg-white border-b border-neutral-200 px-6 py-3 flex items-center justify-between shrink-0">
        <div>
          <div className="text-[14px] font-bold text-neutral-900 mb-1">接待账号：品牌主账号</div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-medium">私信通已开通</span>
            <div className="h-3 w-px bg-neutral-200"></div>
            <span className="text-[11px] text-neutral-500 flex items-center gap-1"><Check size={10}/>可发图文</span>
            <span className="text-[11px] text-neutral-500 flex items-center gap-1"><Check size={10}/>可发商品卡</span>
            <span className="text-[11px] text-neutral-500 flex items-center gap-1"><Check size={10}/>可发链接</span>
            <span className="text-[11px] text-neutral-500 flex items-center gap-1"><Check size={10}/>可发企微卡</span>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="text-center px-4 py-1.5 bg-neutral-50 rounded-lg">
            <div className="text-[11px] text-neutral-500">2小时响应率</div>
            <div className="text-[14px] font-bold text-neutral-900">92%</div>
          </div>
          <div className="text-center px-4 py-1.5 bg-neutral-50 rounded-lg">
            <div className="text-[11px] text-neutral-500">24小时跟进率</div>
            <div className="text-[14px] font-bold text-neutral-900">85%</div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Sessions */}
        <div className="w-[280px] bg-white border-r border-neutral-200 flex flex-col shrink-0 overflow-y-auto p-4 space-y-4">
          <div>
            <div className="text-[11px] font-bold text-neutral-500 mb-2">待处理会话 ({sessions.length})</div>
            <div className="space-y-2">
              {sessions.map(s => (
                <div 
                  key={s.id} 
                  onClick={() => setActiveSessionId(s.id)}
                  className={`p-3 rounded-xl border cursor-pointer ${activeSessionId === s.id ? 'bg-primary-50 border-primary-200 shadow-sm' : 'bg-neutral-50 border-neutral-100 hover:border-neutral-200'}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[13px] font-bold text-neutral-900">{s.user}</span>
                    <span className="text-[10px] text-neutral-400">{s.time}</span>
                  </div>
                  <div className="text-[12px] text-neutral-600 line-clamp-1 mb-2">{s.history[0]?.text}</div>
                  <div className="flex justify-between items-center">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${s.intent.includes('A类') ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'}`}>{s.intent}</span>
                    {s.waitCheck && <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded flex items-center gap-1"><AlertOctagon size={10}/>有待核实项</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Middle Column: Chat */}
        <div className="flex-1 bg-neutral-50 flex flex-col min-w-0">
          <div className="p-4 border-b border-neutral-200 bg-white flex justify-between items-center shrink-0">
            <span className="text-[14px] font-bold text-neutral-900">{activeSession.user}</span>
            <button className="text-[12px] text-primary-600 font-bold hover:text-primary-700">查看用户画像库</button>
          </div>
          
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            {activeSession.history.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === 'brand' ? 'flex-row-reverse' : ''}`}>
                <div className="w-8 h-8 rounded-full bg-neutral-200 shrink-0 overflow-hidden"></div>
                <div className={`max-w-[80%] ${msg.role === 'brand' ? 'items-end' : 'items-start'}`}>
                  <div className={`text-[13px] p-3 rounded-2xl shadow-sm ${msg.role === 'brand' ? 'bg-primary-600 text-white rounded-tr-sm' : 'bg-white text-neutral-800 rounded-tl-sm border border-neutral-200'}`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Actions */}
        <div className="w-[320px] bg-white border-l border-neutral-200 flex flex-col shrink-0">
          <div className="flex-1 p-5 overflow-y-auto space-y-6">
            {/* 互动判断 */}
            <div>
              <h4 className="text-[13px] font-bold text-neutral-900 mb-3">互动判断</h4>
              <div className="bg-neutral-50 rounded-xl p-3 border border-neutral-100 space-y-2 text-[12px]">
                <div className="flex"><span className="text-neutral-500 w-[65px]">意向等级:</span><span className="text-neutral-900 font-medium">{activeSession.intent}</span></div>
                <div className="flex"><span className="text-neutral-500 w-[65px]">响应时效:</span>
                  <span className="text-amber-600 font-medium flex items-center gap-1">
                  <Clock size={12}/> 首次响应：剩余 1小时35分钟
                  </span>
                </div>
              </div>
            </div>

            {/* 事实校验 */}
            <div>
              <h4 className="text-[13px] font-bold text-neutral-900 mb-3">事实确认与话术约束</h4>
              <div className="space-y-2">
                <div className="p-3 border border-neutral-200 rounded-xl text-[12px]">
                  <div className="flex items-start gap-2 mb-2">
                    <AlertOctagon size={12} className="text-amber-500 mt-0.5 shrink-0" />
                    <span className="text-neutral-700">用户询问"试吃装"，但目前针对幼犬的试吃活动库存不足。</span>
                  </div>
                  <div className="flex justify-end gap-2 mt-2">
                    <button className="text-[11px] bg-neutral-100 px-2 py-1 rounded text-neutral-600 hover:bg-neutral-200">去库存系统确认</button>
                    <button className="text-[11px] bg-primary-50 px-2 py-1 rounded text-primary-600 font-medium" onClick={() => setHasUnconfirmed(false)}>我已人工确认</button>
                  </div>
                </div>
              </div>
            </div>

            {/* 回复草稿 */}
            <div>
              <h4 className="text-[13px] font-bold text-neutral-900 mb-2">回复草稿 (私信通)</h4>
              {hasUnconfirmed && (
                <div className="flex items-center gap-1.5 text-[11px] text-amber-600 bg-amber-50 px-2 py-1 rounded mb-2 border border-amber-100">
                  <Info size={12}/> 资料不足，已生成安全回复版本。
                </div>
              )}
              <textarea 
                className="w-full h-24 p-3 text-[13px] text-neutral-800 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-primary-400 resize-none mb-3"
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
              />
              <button 
                className={`w-full py-2.5 rounded-xl text-[13px] font-bold transition-colors shadow-sm ${hasUnconfirmed ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed' : 'bg-neutral-900 text-white hover:bg-neutral-800'}`}
                disabled={hasUnconfirmed} 
              >
                发送私信
              </button>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <button 
                  className={`py-2 bg-white border border-neutral-200 rounded-xl text-[12px] font-bold transition-colors ${hasUnconfirmed ? 'text-neutral-400' : 'text-neutral-700 hover:bg-neutral-50'}`}
                  disabled={hasUnconfirmed}
                >
                  推送商品卡
                </button>
                <button 
                  className={`py-2 bg-white border border-neutral-200 rounded-xl text-[12px] font-bold transition-colors ${hasUnconfirmed ? 'text-neutral-400' : 'text-neutral-700 hover:bg-neutral-50'}`}
                  disabled={hasUnconfirmed}
                >
                  推送图文
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CommentTab() {
  const [activeCommentId, setActiveCommentId] = useState('c1');
  const comments = [
    { id: 'c1', source: '品牌主账号', user: '用户_123', type: 'C类', content: '看起来不错，我家狗也这样', reply: '是的呢，幼犬肠胃比较脆弱，科学喂养很重要哦！', note: '幼犬换粮周期表' },
    { id: 'c2', source: 'KOS门店号', user: '李女士', type: 'B类', content: '这个颗粒大吗？小狗能咬动吗？', reply: '亲亲，这款是专为幼犬定制的小颗粒设计哦，泡水后很容易咀嚼的。', note: '门店真实试吃记录' },
    { id: 'c3', source: 'KOC达人', user: '爱吃肉的小宝', type: 'B类', content: '和之前那款比哪个好？', reply: '宝宝可以看看我们的详细对比评测哦，主要是针对玻璃胃定制的。', note: '双十一种草清单' }
  ];
  
  const activeComment = comments.find(c => c.id === activeCommentId) || comments[0];

  return (
    <div className="h-full flex overflow-hidden">
      {/* Left Column: Grouped by Account and Note */}
      <div className="w-[300px] bg-white border-r border-neutral-200 flex flex-col shrink-0 overflow-y-auto">
        <div className="p-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50">
          <span className="text-[13px] font-bold text-neutral-900">按来源分组</span>
        </div>
        
        <div className="p-3 space-y-4">
          {['品牌主账号', 'KOS门店号', 'KOC达人'].map(source => (
            <div key={source}>
              <div className="text-[11px] font-bold text-neutral-500 mb-2 px-2">{source}</div>
              <div className="bg-neutral-50 rounded-xl border border-neutral-100 p-2 space-y-1">
                {comments.filter(c => c.source === source).map(c => (
                  <div 
                    key={c.id} 
                    onClick={() => setActiveCommentId(c.id)}
                    className={`p-2 rounded-lg border cursor-pointer ${activeCommentId === c.id ? 'bg-white border-primary-300 ring-1 ring-primary-100 shadow-sm' : 'bg-white border-neutral-100 hover:border-neutral-300'}`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[12px] font-bold text-neutral-900">{c.user}</span>
                      <span className={`text-[10px] px-1 rounded ${c.type === 'C类' ? 'bg-neutral-100 text-neutral-500' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>{c.type}</span>
                    </div>
                    <div className="text-[12px] text-neutral-600 truncate">{c.content}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Middle Column: Thread */}
      <div className="flex-1 bg-neutral-50 flex flex-col min-w-0">
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm">
            <div className="text-[11px] text-neutral-500 mb-2 flex items-center gap-1"><FileText size={12}/> 原笔记摘要</div>
            <div className="text-[14px] font-bold text-neutral-900 mb-1">{activeComment.note}</div>
            <div className="text-[12px] text-neutral-600 line-clamp-2">今天给大家分享一下幼犬换粮的经验。很多新手家长刚接狗狗回家，就迫不及待地喂新粮，结果狗狗拉稀软便。其实换粮要遵循七日换粮法...</div>
          </div>
          
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-neutral-200 shrink-0 flex items-center justify-center text-neutral-500">
                <User size={16} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[13px] font-bold text-neutral-900">{activeComment.user}</span>
                  <span className="text-[11px] text-neutral-400">刚刚</span>
                </div>
                <div className="text-[13px] text-neutral-800 bg-white p-3 rounded-2xl rounded-tl-sm border border-neutral-200 inline-block shadow-sm">
                  {activeComment.content}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Actions */}
      <div className="w-[360px] bg-white border-l border-neutral-200 flex flex-col shrink-0">
        <div className="flex-1 p-5 overflow-y-auto space-y-6">
          <div>
            <h4 className="text-[13px] font-bold text-neutral-900 mb-3">意图判断</h4>
            <div className="bg-neutral-50 rounded-xl p-3 border border-neutral-100 space-y-2 text-[12px]">
              <div className="flex"><span className="text-neutral-500 w-[65px]">互动类型:</span><span className="text-neutral-900">一般性讨论</span></div>
              <div className="flex"><span className="text-neutral-500 w-[65px]">意向等级:</span><span className="text-neutral-600 bg-neutral-200 px-1 rounded">{activeComment.type}</span></div>
              <div className="flex"><span className="text-neutral-500 w-[65px]">适合回复:</span><span className="text-neutral-900">{activeComment.source} (当前)</span></div>
            </div>
          </div>
          
          <div>
            <h4 className="text-[13px] font-bold text-neutral-900 mb-3">回复草稿</h4>
            <textarea 
              key={activeComment.id}
              className="w-full h-24 p-3 text-[13px] text-neutral-800 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-primary-400 resize-none mb-3"
              defaultValue={activeComment.reply}
            />
            <div className="grid grid-cols-2 gap-2">
              <button className="py-2.5 bg-neutral-900 text-white rounded-lg text-[13px] font-bold hover:bg-neutral-800 transition-colors">
                复制回复
              </button>
              <button className="py-2.5 bg-white border border-neutral-200 text-neutral-700 rounded-lg text-[13px] font-bold hover:bg-neutral-50 transition-colors">
                打开原笔记
              </button>
            </div>
          </div>
          
          <div className="border-t border-neutral-100 pt-4 flex flex-wrap gap-2">
            <button className="px-3 py-1.5 text-[12px] font-bold bg-neutral-100 text-neutral-600 rounded hover:bg-neutral-200">通知账号主</button>
            <button className="px-3 py-1.5 text-[12px] font-bold bg-neutral-100 text-neutral-600 rounded hover:bg-neutral-200">标记已回复</button>
            <button className="px-3 py-1.5 text-[12px] font-bold bg-neutral-100 text-neutral-600 rounded hover:bg-neutral-200">暂不处理</button>
            
            {/* 只在非品牌账号下显示 转为截流机会 */}
            {activeComment.source !== '品牌主账号' && (
              <button className="px-3 py-1.5 text-[12px] font-bold bg-blue-50 text-blue-600 border border-blue-200 rounded hover:bg-blue-100">转为截流机会</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
function InterceptTab() {
  return (
    <div className="h-full flex overflow-hidden">
      <div className="flex-1 bg-neutral-50 p-6 overflow-y-auto">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm">
            <div className="text-[12px] text-neutral-500 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1"><FileText size={14}/> 竞品高热笔记</span>
              <span className="text-primary-600 bg-primary-50 px-2 py-0.5 rounded font-medium">截流机会识别</span>
            </div>
            <div className="text-[15px] font-bold text-neutral-900 mb-2">有没有懂的姐妹，三个月金毛吃XX粮总是软便怎么回事啊？</div>
            <div className="text-[13px] text-neutral-600 line-clamp-2">如题，接回家半个月了，一直喂的XX牌子，每天拉的都是软的，精神还可以...</div>
          </div>
          
          <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm relative">
             <div className="absolute -left-2 top-6 w-1 h-8 bg-primary-400 rounded-full"></div>
             <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-neutral-200 shrink-0 flex items-center justify-center text-neutral-500">
                <User size={16} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[14px] font-bold text-neutral-900">求助用户</span>
                  <span className="text-[11px] text-neutral-400">1小时前</span>
                </div>
                <div className="text-[14px] text-neutral-800 mb-3">
                  大家都说换粮，那换什么牌子比较好呢？肠胃脆弱的。
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="w-[400px] bg-white border-l border-neutral-200 flex flex-col shrink-0 overflow-y-auto p-6">
        <h3 className="text-[16px] font-bold text-neutral-900 mb-6">截流动作配置</h3>
        
        <div className="space-y-6">
          <div>
            <h4 className="text-[13px] font-bold text-neutral-900 mb-3">截流判断</h4>
            <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-100 space-y-3 text-[13px]">
              <div className="flex justify-between items-start gap-4">
                <span className="text-neutral-500 shrink-0">用户需求:</span>
                <span className="text-neutral-900 font-medium text-right">明确寻求肠胃脆弱幼犬主粮推荐</span>
              </div>
              <div className="flex justify-between items-start gap-4">
                <span className="text-neutral-500 shrink-0">自然介入:</span>
                <span className="text-emerald-600 font-medium text-right flex items-center gap-1 justify-end"><Check size={14}/> 适合经验分享式介入</span>
              </div>
              <div className="flex justify-between items-start gap-4">
                <span className="text-neutral-500 shrink-0">产品匹配:</span>
                <span className="text-emerald-600 font-medium text-right flex items-center gap-1 justify-end"><Check size={14}/> 商家主推低敏幼犬粮极度匹配</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-[13px] font-bold text-neutral-900 mb-3">选择承接账号</h4>
            <select className="w-full p-2.5 bg-white border border-neutral-200 rounded-lg text-[13px] text-neutral-800 focus:outline-none focus:border-primary-400">
              <option>KOS门店号：小王探店</option>
              <option>KOS专家号：宠物营养师张张</option>
              <option>官方小助手 (不推荐)</option>
            </select>
            <div className="mt-2 text-[11px] text-neutral-500 flex items-start gap-1">
              <Info size={12} className="shrink-0 mt-0.5"/> 建议使用KOS个人号以普通用户或达人身份介入，避免官方号引发反感。
            </div>
          </div>
          
          <div>
            <h4 className="text-[13px] font-bold text-neutral-900 mb-3">生成回复</h4>
            <textarea 
              className="w-full h-32 p-3 text-[13px] text-neutral-800 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-primary-400 resize-none mb-3"
              defaultValue="换粮时如果速度太快确实容易软便，可以先把过渡期拉长。不同幼犬耐受不一样，我家金毛之前也是肠胃敏感，后来换了单一肉源加益生菌的粮好多了。如果需要可以把月龄和现在吃的粮私信发我，我帮你看看。"
            />
            <div className="text-[11px] text-amber-600 bg-amber-50 p-2 rounded border border-amber-100 flex items-start gap-1.5 mb-4">
              <AlertTriangle size={14} className="shrink-0 mt-0.5"/>
              <div>
                <strong>风险提示：</strong>频繁跨账号评论可能触发平台风控，请控制频率并避免复制粘贴重复话术。
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <button className="py-2.5 bg-neutral-900 text-white rounded-xl text-[13px] font-bold hover:bg-neutral-800 transition-colors">
                复制并打开原笔记
              </button>
              <div className="flex gap-2">
                <button className="flex-1 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-xl text-[12px] font-bold hover:bg-neutral-50 transition-colors">
                  标记已执行
                </button>
                <button className="flex-1 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-xl text-[12px] font-bold hover:bg-neutral-50 transition-colors text-neutral-500">
                  不适合截流
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CompetitorTab() {
  return (
    <div className="h-full flex overflow-hidden">
      {/* Left Column: Groups */}
      <div className="w-[280px] bg-white border-r border-neutral-200 flex flex-col shrink-0 overflow-y-auto p-4 space-y-2">
        <div className="text-[13px] font-bold text-neutral-900 mb-2 px-2">观察组</div>
        <div className="p-3 bg-primary-50 rounded-xl border border-primary-200 cursor-pointer shadow-sm flex justify-between items-center">
          <span className="text-[13px] font-bold text-neutral-900">幼犬换粮软便</span>
          <span className="text-[11px] text-primary-600 bg-white px-1.5 py-0.5 rounded shadow-sm">热搜</span>
        </div>
        <div className="p-3 bg-white rounded-xl border border-neutral-100 cursor-pointer hover:bg-neutral-50">
          <span className="text-[13px] font-bold text-neutral-700">狗粮适口性对比</span>
        </div>
        <div className="p-3 bg-white rounded-xl border border-neutral-100 cursor-pointer hover:bg-neutral-50">
          <span className="text-[13px] font-bold text-neutral-700">低敏粮痛点</span>
        </div>
      </div>

      <div className="flex-1 bg-neutral-50 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-[18px] font-bold text-neutral-900">“幼犬换粮软便” 洞察报告</h2>
            <span className="text-[12px] text-neutral-500">基于近30天 1,245 条竞品评论分析</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm">
              <h3 className="text-[14px] font-bold text-neutral-900 mb-4 flex items-center gap-1.5"><AlertOctagon size={16} className="text-amber-500"/> 高频痛点 & 阻力</h3>
              <ul className="space-y-3">
                <li className="flex justify-between items-start border-b border-neutral-100 pb-2">
                  <span className="text-[13px] text-neutral-800">“按七日法换了还是拉稀”</span>
                  <span className="text-[11px] text-neutral-500">32% 提及</span>
                </li>
                <li className="flex justify-between items-start border-b border-neutral-100 pb-2">
                  <span className="text-[13px] text-neutral-800">“新粮颗粒太大幼犬不嚼”</span>
                  <span className="text-[11px] text-neutral-500">18% 提及</span>
                </li>
                <li className="flex justify-between items-start">
                  <span className="text-[13px] text-neutral-800">“到底要不要额外加益生菌”</span>
                  <span className="text-[11px] text-neutral-500">15% 提及</span>
                </li>
              </ul>
              <div className="mt-4 pt-4 border-t border-neutral-100 flex gap-2">
                <button className="px-3 py-1.5 text-[11px] font-bold bg-neutral-900 text-white rounded hover:bg-neutral-800">保存为客户痛点</button>
                <button className="px-3 py-1.5 text-[11px] font-bold bg-neutral-100 text-neutral-700 rounded hover:bg-neutral-200">生成内容方向</button>
              </div>
            </div>
            
            <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm">
              <h3 className="text-[14px] font-bold text-neutral-900 mb-4 flex items-center gap-1.5"><Sparkles size={16} className="text-primary-500"/> 机会与建议</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-[12px] font-bold text-neutral-700 mb-1">商品说明建议</div>
                  <div className="text-[12px] text-neutral-600 bg-neutral-50 p-2 rounded">商品详情页需增加“小颗粒设计，适合幼犬咀嚼”的视觉呈现，这是目前大量竞品评论中的抱怨点。</div>
                </div>
                <div>
                  <div className="text-[12px] font-bold text-neutral-700 mb-1">客服话术补充</div>
                  <div className="text-[12px] text-neutral-600 bg-neutral-50 p-2 rounded">建议增加“换粮拉稀的紧急处理三步法”，安抚新手家长焦虑情绪。</div>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button className="px-3 py-1.5 text-[11px] font-bold bg-neutral-100 text-neutral-700 rounded hover:bg-neutral-200">加入商品说明</button>
                <button className="px-3 py-1.5 text-[11px] font-bold bg-neutral-100 text-neutral-700 rounded hover:bg-neutral-200">加入话术库</button>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm">
            <h3 className="text-[14px] font-bold text-neutral-900 mb-4">典型用户原话抓取</h3>
            <div className="space-y-4">
              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[12px] font-bold text-neutral-900">旺财要乖乖</span>
                  <span className="text-[10px] text-neutral-400">评论于笔记: 《渴望幼犬粮实测，到底值不值得买？》 (竞品品牌: 渴望)</span>
                </div>
                <div className="text-[13px] text-neutral-700">“我家狗子三个月，吃之前的粮好好的，听客服说这款好就买了，结果换了三天拉了三天，都不敢喂了！”</div>
              </div>
              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[12px] font-bold text-neutral-900">爱拆家的二哈</span>
                  <span className="text-[10px] text-neutral-400">评论于笔记: 《爱肯拿双十一囤货指南》 (竞品品牌: 爱肯拿)</span>
                </div>
                <div className="text-[13px] text-neutral-700">“为什么没有人说这款粮有一股奇怪的腥味？狗狗闻了就跑。”</div>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button className="px-4 py-2 text-[12px] font-bold text-primary-600 hover:text-primary-700">转为截流机会审查</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RiskTab() {
  return (
    <div className="h-full flex overflow-hidden">
      <div className="w-[320px] bg-white border-r border-neutral-200 flex flex-col shrink-0 overflow-y-auto p-4 space-y-4">
        <div className="text-[13px] font-bold text-neutral-900 px-2">待处理风险事项</div>
        
        <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 cursor-pointer shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl">高危</div>
          <div className="flex justify-between items-start mb-1 pr-6">
            <span className="text-[13px] font-bold text-neutral-900">产品疑似导致过敏</span>
          </div>
          <div className="text-[12px] text-neutral-600 line-clamp-2 mb-2">吃了你们家新批次的粮，狗狗疯狂抓挠，身上起红疹了，必须给我个说法！！</div>
          <div className="text-[10px] text-neutral-500">小红书官方号评论 · 15分钟前</div>
        </div>
      </div>

      <div className="flex-1 bg-neutral-50 flex flex-col min-w-0">
        <div className="p-8 flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto space-y-8">
            {/* Steps Workflow */}
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 top-1/2 w-full h-0.5 bg-neutral-200 -z-10 -translate-y-1/2"></div>
              
              <div className="flex flex-col items-center gap-2 bg-neutral-50 px-2">
                <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-[14px]">1</div>
                <span className="text-[11px] font-bold text-neutral-900">公开安抚</span>
              </div>
              <div className="flex flex-col items-center gap-2 bg-neutral-50 px-2">
                <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-[14px]">2</div>
                <span className="text-[11px] font-bold text-neutral-500">引导私信</span>
              </div>
              <div className="flex flex-col items-center gap-2 bg-neutral-50 px-2">
                <div className="w-8 h-8 rounded-full bg-neutral-200 text-neutral-400 flex items-center justify-center font-bold text-[14px]">3</div>
                <span className="text-[11px] font-bold text-neutral-500">商家跟进</span>
              </div>
              <div className="flex flex-col items-center gap-2 bg-neutral-50 px-2">
                <div className="w-8 h-8 rounded-full bg-neutral-200 text-neutral-400 flex items-center justify-center font-bold text-[14px]">4</div>
                <span className="text-[11px] font-bold text-neutral-500">事项关闭</span>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
              <h3 className="text-[15px] font-bold text-neutral-900 mb-4 border-b border-neutral-100 pb-3">步骤 1 & 2：公开安抚并引导私信</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="text-[12px] font-bold text-neutral-500 mb-2">生成公开回复草稿 (评论区使用)</div>
                  <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200 text-[13px] text-neutral-800">
                    您好，看到您的反馈了，我们对狗狗的状况非常关心！麻烦您留意一下私信，我们会安排专人立刻帮您核实处理。
                  </div>
                  <button className="mt-2 text-[12px] font-bold text-primary-600 hover:text-primary-700 px-1">通知账号主复制回复</button>
                </div>
                
                <div>
                  <div className="text-[12px] font-bold text-neutral-500 mb-2">生成私信草稿 (私信通自动发送)</div>
                  <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200 text-[13px] text-neutral-800">
                    家长您好！我是售后负责人。为了尽快核实情况并帮助狗狗，方便留下您的联系电话、订单信息和狗狗目前发疹部位的照片吗？我们会安排宠物医生专员主动联系您。
                  </div>
                  <button className="mt-2 text-[12px] font-bold text-primary-600 hover:text-primary-700 px-1">修改话术</button>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-neutral-100 flex gap-3">
                <button className="px-5 py-2.5 bg-neutral-900 text-white rounded-xl text-[13px] font-bold hover:bg-neutral-800 transition-colors shadow-sm">
                  发送私信并请求联系方式
                </button>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm opacity-50 pointer-events-none">
              <h3 className="text-[15px] font-bold text-neutral-900 mb-4 border-b border-neutral-100 pb-3">步骤 3 & 4：商家介入与关闭</h3>
              <p className="text-[12px] text-neutral-500 mb-4">等待用户在私信提供联系方式后激活...</p>
              
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-neutral-100 text-neutral-600 rounded-lg text-[12px] font-bold">转商家负责人</button>
                <button className="px-4 py-2 bg-neutral-100 text-neutral-600 rounded-lg text-[12px] font-bold">设置紧急提醒</button>
                <button className="px-4 py-2 bg-neutral-100 text-neutral-600 rounded-lg text-[12px] font-bold">关闭风险事项</button>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}

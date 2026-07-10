const fs = require('fs');
let code = fs.readFileSync('src/components/rings/InteractionWorkbench.tsx', 'utf8');

// Update PrivateMsgTab
const privateMsgTabOld = /function PrivateMsgTab\(\) \{[\s\S]*?(?=function CommentTab\(\) \{)/;

const privateMsgTabNew = `function PrivateMsgTab() {
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
                  className={\`p-3 rounded-xl border cursor-pointer \${activeSessionId === s.id ? 'bg-primary-50 border-primary-200 shadow-sm' : 'bg-neutral-50 border-neutral-100 hover:border-neutral-200'}\`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[13px] font-bold text-neutral-900">{s.user}</span>
                    <span className="text-[10px] text-neutral-400">{s.time}</span>
                  </div>
                  <div className="text-[12px] text-neutral-600 line-clamp-1 mb-2">{s.history[0]?.text}</div>
                  <div className="flex justify-between items-center">
                    <span className={\`text-[10px] px-1.5 py-0.5 rounded \${s.intent.includes('A类') ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'}\`}>{s.intent}</span>
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
              <div key={i} className={\`flex gap-3 \${msg.role === 'brand' ? 'flex-row-reverse' : ''}\`}>
                <div className="w-8 h-8 rounded-full bg-neutral-200 shrink-0 overflow-hidden"></div>
                <div className={\`max-w-[80%] \${msg.role === 'brand' ? 'items-end' : 'items-start'}\`}>
                  <div className={\`text-[13px] p-3 rounded-2xl shadow-sm \${msg.role === 'brand' ? 'bg-primary-600 text-white rounded-tr-sm' : 'bg-white text-neutral-800 rounded-tl-sm border border-neutral-200'}\`}>
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
                className={\`w-full py-2.5 rounded-xl text-[13px] font-bold transition-colors shadow-sm \${hasUnconfirmed ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed' : 'bg-neutral-900 text-white hover:bg-neutral-800'}\`}
                disabled={hasUnconfirmed} 
              >
                发送私信
              </button>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <button 
                  className={\`py-2 bg-white border border-neutral-200 rounded-xl text-[12px] font-bold transition-colors \${hasUnconfirmed ? 'text-neutral-400' : 'text-neutral-700 hover:bg-neutral-50'}\`}
                  disabled={hasUnconfirmed}
                >
                  推送商品卡
                </button>
                <button 
                  className={\`py-2 bg-white border border-neutral-200 rounded-xl text-[12px] font-bold transition-colors \${hasUnconfirmed ? 'text-neutral-400' : 'text-neutral-700 hover:bg-neutral-50'}\`}
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

`;

code = code.replace(privateMsgTabOld, privateMsgTabNew);
fs.writeFileSync('src/components/rings/InteractionWorkbench.tsx', code);

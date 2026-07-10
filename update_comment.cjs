const fs = require('fs');
let code = fs.readFileSync('src/components/rings/InteractionWorkbench.tsx', 'utf8');

const commentTabOld = /function CommentTab\(\) \{[\s\S]*?(?=function InterceptTab\(\) \{)/;

const commentTabNew = `function CommentTab() {
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
                    className={\`p-2 rounded-lg border cursor-pointer \${activeCommentId === c.id ? 'bg-white border-primary-300 ring-1 ring-primary-100 shadow-sm' : 'bg-white border-neutral-100 hover:border-neutral-300'}\`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[12px] font-bold text-neutral-900">{c.user}</span>
                      <span className={\`text-[10px] px-1 rounded \${c.type === 'C类' ? 'bg-neutral-100 text-neutral-500' : 'bg-blue-50 text-blue-600 border border-blue-100'}\`}>{c.type}</span>
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
`;

code = code.replace(commentTabOld, commentTabNew);
fs.writeFileSync('src/components/rings/InteractionWorkbench.tsx', code);

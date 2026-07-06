const fs = require('fs');
const file = 'src/pages/MerchantMatrix.tsx';
let content = fs.readFileSync(file, 'utf8');

// Update nodes and MOCK_PROJECTS
const oldMockProjectsStr = `const MOCK_PROJECTS = [
  {
    id: 'p1',
    name: '美妆搜索种草战役',
    goal: '搜索卡位 + 私域承接',
    currentDirection: '抗老 / 紧致 / 敏感肌 / 成分科普',
    nodes: [
      { id: 'strategy', name: '策略', status: '已确认', type: 'success', tab: 'strategy', actionDesc: '进入操盘建议模块' },
      { id: 'content', name: '内容', status: '已规划12', type: 'success', tab: 'content', actionDesc: '内容包详情 / 内容确认 / 修改内容 / 确认进入素材补齐' },
      { id: 'material', name: '素材', status: '缺4', type: 'warning', tab: 'matrix', actionDesc: '素材缺口 / 素材匹配 / 补齐素材 / 确认进入排期' }, 
      { id: 'publish', name: '发布', status: '待内容确认', type: 'pending', tab: 'content', actionDesc: '发布包详情 / 账号分配 / 排期确认 / 进入发布' },
      { id: 'interaction', name: '互动', status: '待发布后产生', type: 'pending', tab: 'interaction', actionDesc: '待发布后产生' },
      { id: 'sales', name: '私域', status: '待线索进入', type: 'pending', tab: 'interaction', actionDesc: '待线索进入' },
      { id: 'metrics', name: '复盘', status: '待数据回收', type: 'pending', tab: 'metrics', actionDesc: '待数据回收' },
    ],
    issue: '缺 4 个关键素材，4 篇内容暂时无法生成',
    recommendation: '补齐素材 -> 检查生成内容 -> 排期发布',
    owner: '运营小王',
    deadline: '今日 18:00'
  },
  {
    id: 'p2',
    name: '幼犬换粮避坑搜索卡位',
    goal: '自然流起量 + 转化',
    currentDirection: '避坑 / 挑食 / 软便 / 专业科普',
    nodes: [
      { id: 'strategy', name: '策略', status: '已确认', type: 'success', tab: 'strategy', actionDesc: '进入操盘建议模块' },
      { id: 'content', name: '内容', status: '156篇', type: 'success', tab: 'content', actionDesc: '内容包详情 / 内容确认 / 修改内容 / 确认进入素材补齐' },
      { id: 'material', name: '素材', status: '全齐', type: 'success', tab: 'matrix', actionDesc: '素材缺口 / 素材匹配 / 补齐素材 / 确认进入排期' }, 
      { id: 'publish', name: '发布', status: '已发42', type: 'success', tab: 'content', actionDesc: '发布包详情 / 账号分配 / 排期确认 / 进入发布' },
      { id: 'interaction', name: '互动', status: '高意向41', type: 'warning', tab: 'interaction', actionDesc: '快速处理高意向线索' },
      { id: 'sales', name: '私域', status: '待跟进12', type: 'warning', tab: 'interaction', actionDesc: '处理私域承接动作' },
      { id: 'metrics', name: '复盘', status: '数据佳', type: 'success', tab: 'metrics', actionDesc: '查看复盘数据' },
    ],
    issue: '发现 41 条高意向待跟进线索',
    recommendation: '去私信承接 -> AI 快捷回复',
    owner: '客服小李',
    deadline: '明日 12:00'
  }
];`;

const newMockProjectsStr = `const MOCK_PROJECTS = [
  {
    id: 'p1',
    name: '美妆搜索种草战役',
    goal: '搜索卡位 + 私域承接',
    currentDirection: '抗老 / 紧致 / 敏感肌 / 成分科普',
    channels: '官方 3 / KOS 4 / 第三方 KOC 8 / 客户 KOC 5',
    nodes: [
      { id: 'strategy', name: '策略', status: '已确认', type: 'success', tab: 'strategy', actionDesc: '进入操盘建议模块' },
      { id: 'channels', name: '账号组合', status: '已拆分', type: 'success', tab: 'channels', actionDesc: '查看通道拆分' },
      { id: 'material', name: '素材/体验', status: '缺8', type: 'warning', tab: 'matrix', actionDesc: '素材与体验进度' }, 
      { id: 'content', name: '内容确认', status: '待确认', type: 'pending', tab: 'content', actionDesc: '按通道查看与确认' },
      { id: 'publish', name: '发布执行', status: '待排期', type: 'pending', tab: 'content', actionDesc: '发布包详情与分发' },
      { id: 'interaction', name: '互动线索', status: '待产生', type: 'pending', tab: 'interaction', actionDesc: '待发布后产生' },
      { id: 'sales', name: '私域转化', status: '待线索', type: 'pending', tab: 'interaction', actionDesc: '待线索进入' },
      { id: 'metrics', name: '复盘', status: '待回收', type: 'pending', tab: 'metrics', actionDesc: '待数据回收' },
    ],
    issue: '第三方 KOC 8 个试用未领取，客户 KOC 5 个反馈未回传，KOS 2 个账号人设未确认',
    recommendation: '先发 KOC 领取任务 -> 确认 KOS 人设 -> 审官方号内容',
    owner: '运营小王',
    deadline: '今日 18:00'
  },
  {
    id: 'p2',
    name: '幼犬换粮避坑搜索卡位',
    goal: '自然流起量 + 转化',
    currentDirection: '避坑 / 挑食 / 软便 / 专业科普',
    channels: '官方 5 / KOS 10 / 第三方 KOC 30',
    nodes: [
      { id: 'strategy', name: '策略', status: '已确认', type: 'success', tab: 'strategy', actionDesc: '进入操盘建议模块' },
      { id: 'channels', name: '账号组合', status: '已确认', type: 'success', tab: 'channels', actionDesc: '查看通道拆分' },
      { id: 'material', name: '素材/体验', status: '全齐', type: 'success', tab: 'matrix', actionDesc: '素材齐备' }, 
      { id: 'content', name: '内容确认', status: '已确认', type: 'success', tab: 'content', actionDesc: '按通道查看与确认' },
      { id: 'publish', name: '发布执行', status: '已发42', type: 'success', tab: 'content', actionDesc: '发布包详情与分发' },
      { id: 'interaction', name: '互动线索', status: '高意向41', type: 'warning', tab: 'interaction', actionDesc: '快速处理高意向线索' },
      { id: 'sales', name: '私域转化', status: '待跟进12', type: 'warning', tab: 'interaction', actionDesc: '处理私域承接动作' },
      { id: 'metrics', name: '复盘', status: '数据佳', type: 'success', tab: 'metrics', actionDesc: '查看复盘数据' },
    ],
    issue: '发现 41 条高意向待跟进线索',
    recommendation: '去私信承接 -> AI 快捷回复',
    owner: '客服小李',
    deadline: '明日 12:00'
  }
];`;

content = content.replace(oldMockProjectsStr, newMockProjectsStr);

const currentDirectionSearch = `<span className="text-[12px] font-bold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded">{proj.currentDirection}</span>`;
const newDirectionHTML = `<span className="text-[12px] font-bold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded">{proj.currentDirection}</span>
                  {proj.channels && (
                    <>
                      <span className="text-neutral-300">|</span>
                      <span className="text-[12px] text-neutral-600 font-medium flex items-center gap-1">
                        <Users size={12} className="text-neutral-400" />
                        账号组合：{proj.channels}
                      </span>
                    </>
                  )}`;
content = content.replace(currentDirectionSearch, newDirectionHTML);

// Replace current issue display
const oldIssueHTML = `<div className="flex items-start gap-3 bg-amber-50/50 p-4 rounded-xl border border-amber-100">
                   <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                     <AlertTriangle size={16} />
                   </div>
                   <div className="flex-1 min-w-0">
                     <div className="text-[14px] font-bold text-amber-900 mb-1">{proj.issue}</div>
                     <span className="text-[12px] font-medium text-indigo-700">推荐处理顺序：{proj.recommendation}</span>
                   </div>
                 </div>`;

const newIssueHTML = `<div className="flex items-start gap-3 bg-amber-50/50 p-4 rounded-xl border border-amber-100">
                   <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0 mt-0.5">
                     <AlertTriangle size={16} />
                   </div>
                   <div className="flex-1 min-w-0">
                     <div className="text-[13px] text-neutral-500 mb-0.5">当前最影响进度：</div>
                     <div className="text-[14px] font-bold text-amber-900 mb-1.5 whitespace-pre-wrap">{proj.issue.split('，').join('\\n')}</div>
                     <span className="text-[12px] font-bold text-indigo-700 bg-indigo-50 px-2 py-1 rounded">推荐处理顺序：{proj.recommendation}</span>
                   </div>
                 </div>`;
                 
content = content.replace(oldIssueHTML, newIssueHTML);


// Update materials drawer content
const oldMaterialsDrawerStart = `               <div className="flex-1 overflow-y-auto p-4 space-y-6">
                 <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex items-start gap-3">
                   <Wand2 size={18} className="text-indigo-600 mt-0.5 shrink-0" />
                   <div>
                     <h4 className="text-[14px] font-bold text-indigo-900 mb-1">AI 总结：结构化素材需求</h4>`;

const oldMaterialsDrawerEnd = `                 </div>

               </div>`;

const newMaterialsDrawerContent = `               <div className="flex-1 overflow-y-auto p-4 space-y-6">
                 
                 <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex items-start gap-3">
                   <Wand2 size={18} className="text-indigo-600 mt-0.5 shrink-0" />
                   <div>
                     <h4 className="text-[14px] font-bold text-indigo-900 mb-1">素材与体验进度</h4>
                     <p className="text-[12px] text-indigo-700 leading-relaxed">系统已将素材任务与体验引导分发至各个通道。建议按照推荐顺序处理阻碍节点。</p>
                   </div>
                 </div>

                 <div className="space-y-3">
                   <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm">
                     <div className="flex items-center justify-between mb-2">
                       <h4 className="font-bold text-[14px] text-neutral-900 flex items-center gap-2">
                         <span className="w-2 h-2 rounded-full bg-blue-500"></span> 内部补拍任务
                       </h4>
                       <span className="text-[12px] font-bold text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded">2 个任务，1 个待回传</span>
                     </div>
                     <p className="text-[12px] text-neutral-500">要求：门店导购拍摄喂食互动场景，或产品特写图。</p>
                   </div>

                   <div className="bg-white border border-amber-200 rounded-xl p-4 shadow-sm relative overflow-hidden">
                     <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
                     <div className="flex items-center justify-between mb-2 pl-1">
                       <h4 className="font-bold text-[14px] text-neutral-900 flex items-center gap-2">
                         <span className="w-2 h-2 rounded-full bg-amber-500"></span> 第三方 KOC
                       </h4>
                       <span className="text-[12px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">8 个待领取，0 个已回传</span>
                     </div>
                     <p className="text-[12px] text-neutral-500 pl-1 mb-3">要求：领取试用装，体验 3 天后回传开箱图与便便状态。</p>
                     <div className="pl-1">
                       <button className="text-[12px] font-bold text-white bg-amber-500 hover:bg-amber-600 transition-colors px-4 py-2 rounded-lg flex items-center gap-1.5">
                         <Send size={14} /> 一键发送领取链接
                       </button>
                     </div>
                   </div>

                   <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm">
                     <div className="flex items-center justify-between mb-2">
                       <h4 className="font-bold text-[14px] text-neutral-900 flex items-center gap-2">
                         <span className="w-2 h-2 rounded-full bg-emerald-500"></span> 客户 KOC
                       </h4>
                       <span className="text-[12px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">5 个待邀请，2 个已回传</span>
                     </div>
                     <p className="text-[12px] text-neutral-500 mb-3">要求：回传真实反馈、好评与狗狗照片。</p>
                     <div>
                       <button className="text-[12px] font-bold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition-colors px-4 py-2 rounded-lg flex items-center gap-1.5">
                         <Send size={14} /> 再次发送邀请提醒
                       </button>
                     </div>
                   </div>
                 </div>

                 <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex items-start gap-3">
                   <AlertTriangle size={18} className="text-amber-600 mt-0.5 shrink-0" />
                   <div>
                     <h4 className="text-[14px] font-bold text-amber-900 mb-1">建议下一步</h4>
                     <p className="text-[12px] text-amber-700 leading-relaxed">由于第三方 KOC 需要 3 天体验期，建议优先发送 <strong>第三方 KOC 领取链接</strong> 以防项目延期。</p>
                   </div>
                 </div>

               </div>`;

const startIdx = content.indexOf(`               <div className="flex-1 overflow-y-auto p-4 space-y-6">`);
const endIdx = content.indexOf(`               </div>\n             </motion.div>`, startIdx);

if (startIdx !== -1 && endIdx !== -1) {
    content = content.substring(0, startIdx) + newMaterialsDrawerContent + content.substring(endIdx);
}

fs.writeFileSync(file, content);

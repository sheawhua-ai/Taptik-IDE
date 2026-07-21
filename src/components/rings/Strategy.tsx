import React, { useState, useEffect } from 'react';
import { ChevronLeft, Check, TrendingUp, Search, Users, FileText, Clock, Database, Sparkles, X, ChevronRight, CheckCircle2, Circle, AlertCircle, FolderOpen, ArrowRight, Save, MessageSquare, Settings2, Info, ChevronDown, CheckCircle, AlertTriangle } from 'lucide-react';

interface StrategyProps {
  hasData?: boolean;
  strategyData?: { word: string; rate: string }[];
  merchantId?: string;
}

const DIAGNOSIS_ITEMS = [
  { 
    id: 'brand', label: '品牌与基础介绍', cat: '商家与产品', desc: '用于理解品牌调性', status: 'confirmed',
    fact: { key: '品牌定位', value: '中端科学喂养品牌', source: '商家确认', time: '2026-07-19' }
  },
  { 
    id: 'product', label: '主推产品核心资料', cat: '商家与产品', desc: '用于提炼核心卖点', status: 'confirmed',
    fact: { key: '主推产品', value: '幼犬主粮', source: '《2026Q2幼犬主粮商品手册.pdf》', time: '2026-07-19' }
  },
  { 
    id: 'price', label: '价格策略与利润空间', cat: '商家与产品', desc: '用于规划投放ROI底线', status: 'confirmed',
    fact: { key: '成交价格', value: '169–189元', source: '《幼犬主粮产品与价格表.xlsx》', time: '2026-07-19', note: '商家确认可支持当前方案毛利' }
  },
  { 
    id: 'audience', label: '目标受众画像', cat: '目标用户', desc: '用于精准定位内容受众', status: 'confirmed',
    fact: { key: '核心画像', value: '一二线城市，新手养宠，关注配方安全', source: '历史受众分析', time: '2026-07-18' }
  },
  { 
    id: 'painpoints', label: '用户痛点与转化顾虑', cat: '目标用户', desc: '用于设计内容反转与钩子', status: 'conflict',
    fact: { key: '核心痛点', value: '肠胃敏感易软便', source: '多处提及，需统一标准表达', time: '2026-07-19' }
  },
  { id: 'accounts', label: '当前账号矩阵现状', cat: '账号与内容', desc: '用于分配分发策略', status: 'confirmed', fact: { key: '账号资产', value: '3个成熟KOS号', source: '平台授权读取', time: '2026-07-19' } },
  { id: 'history', label: '历史投放与爆款数据', cat: '账号与内容', desc: '用于复用验证过的内容模型', status: 'confirmed', fact: { key: '历史私信获客', value: '24元/人', source: '投放系统回传', time: '2026-07-19' } },
  { id: 'budget', label: '本轮预算与执行周期', cat: '目标与承接', desc: '用于匹配对应的打法量级', status: 'confirmed', fact: { key: '预算', value: '10000元以内', source: '商家确认', time: '2026-07-19' } },
  { id: 'conversion', label: '私域/店铺承接路径', cat: '目标与承接', desc: '用于设计闭环引流路线', status: 'confirmed', fact: { key: '承接链路', value: '私信转企微', source: '业务架构配置', time: '2026-07-19' } },
];

const STRATEGIES = [
  {
    id: 's1',
    title: '搜索卡位 + 私域长效承接',
    rationaleDetails: [
      { text: '客单价较高且利润丰厚', fact: '成交价169-189元，毛利条件可支持当前投放。来源: 价格表' },
      { text: '私信获客成本远低于行业', fact: '近期私信获客成本约为24元，远低于行业平均60元。' }
    ],
    solution: '大词竞价成本高，获客难的问题',
    focus: '铺设高信服度评测，强力控制单次拍摄成本',
    allocation: '80%预算用于KOS/KOC铺量，20%用于信息流追投',
    metrics: { content: 42, days: 14, budget: 8000 },
    altSummary: '利用长尾搜索词的流量红利，通过KOS矩阵发布真实评测内容，截流精准意向用户，引导至私域完成高客单转化。'
  },
  {
    id: 's2',
    title: 'KOC 达人铺量蓄水',
    condition: '品牌声量极弱，急需扩大圈层曝光',
    whyNot: '当期私域转化的直接贡献率较弱，无法满足当前GMV目标要求。',
    switchCondition: '如果当前目标从【高ROI转化】变更为【大促前大面积蓄水种草】，建议切换此策略。',
    altSummary: '适合快速扩大品牌声量，为大促节点做蓄水准备，但对当期私域转化的直接贡献率较弱。'
  },
  {
    id: 's3',
    title: '信息流强转化模型',
    condition: '预算充足，且已跑出高转化素材模型',
    whyNot: '缺乏已被验证的高转化跑量模型，直接进行高频次的信息流竞价测试成本及风险过高。',
    switchCondition: '如果单篇评测笔记自然流量爆发并跑通转化模型，且预算追加到2万元以上，可切换此策略放大。',
    altSummary: '依赖优质的视频跑量素材，转化效率高但获客成本偏高，适合在验证跑量模型后采用。'
  }
];

const DiagnosisDetailDrawer = ({ onClose, items }: { onClose: () => void, items: typeof DIAGNOSIS_ITEMS }) => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['目标用户']); // 默认展开有问题的

  const toggleCategory = (cat: string) => {
    setExpandedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const grouped = items.reduce((acc, item) => {
    if (!acc[item.cat]) acc[item.cat] = [];
    acc[item.cat].push(item);
    return acc;
  }, {} as Record<string, typeof DIAGNOSIS_ITEMS>);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/20 backdrop-blur-sm">
      <div className="w-[500px] bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="p-5 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50">
          <div>
            <h3 className="text-[16px] font-bold text-neutral-900">核心诊断详情</h3>
            <p className="text-[12px] text-neutral-500 mt-1">基于以下事实维度生成操盘策略，可作为审计依据</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-neutral-200 rounded-xl text-neutral-500 transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {Object.entries(grouped).map(([cat, catItems]) => {
            const confirmedCount = catItems.filter(i => i.status === 'confirmed').length;
            const hasIssue = catItems.some(i => i.status !== 'confirmed');
            const isExpanded = expandedCategories.includes(cat);

            return (
              <div key={cat} className="border border-neutral-200 rounded-xl overflow-hidden bg-white">
                <div 
                  className={`flex items-center justify-between p-3 cursor-pointer select-none transition-colors ${hasIssue ? 'bg-orange-50/30' : 'hover:bg-neutral-50'}`}
                  onClick={() => toggleCategory(cat)}
                >
                  <div className="flex items-center gap-2">
                    <ChevronRight size={16} className={`text-neutral-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                    <span className="text-[14px] font-bold text-neutral-900">{cat}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-[12px] ${hasIssue ? 'text-orange-600 font-bold' : 'text-neutral-500'}`}>
                      {confirmedCount}/{catItems.length} 已确认
                    </span>
                    {hasIssue && <AlertCircle size={14} className="text-orange-500" />}
                  </div>
                </div>
                
                {isExpanded && (
                  <div className="p-3 pt-0 border-t border-neutral-100 bg-neutral-50/50">
                    <div className="space-y-3 mt-3">
                      {catItems.map(item => (
                        <div key={item.id} className="text-[13px]">
                          <div className="flex items-start gap-2 mb-1.5">
                            {item.status === 'confirmed' ? (
                              <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                            ) : item.status === 'conflict' ? (
                              <AlertTriangle size={14} className="text-rose-500 mt-0.5 shrink-0" />
                            ) : (
                              <AlertCircle size={14} className="text-orange-500 mt-0.5 shrink-0" />
                            )}
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <span className="font-bold text-neutral-800">{item.fact?.key}:</span>
                                <span className="text-neutral-700 max-w-[200px] text-right">{item.fact?.value}</span>
                              </div>
                              <div className="flex justify-between items-center mt-1 text-[11px] text-neutral-400">
                                <span>来源: {item.fact?.source}</span>
                                <span>{item.fact?.time}</span>
                              </div>
                              {item.fact?.note && (
                                <div className={`mt-1.5 p-1.5 rounded text-[11px] ${item.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700' : 'bg-orange-50 text-orange-700'}`}>
                                  {item.fact.note}
                                </div>
                              )}
                              {item.status !== 'confirmed' && (
                                <div className="mt-2 flex gap-2">
                                  <button onClick={() => {
                                    const mappedId = item.id === 'painpoints' || item.id === 'audience' ? 'customer' :
                                                     item.id === 'product' || item.id === 'price' ? 'brand' :
                                                     item.id === 'history' || item.id === 'budget' ? 'review' :
                                                     item.id === 'conversion' ? 'reply' :
                                                     item.id === 'accounts' ? 'account' : item.id;
                                    window.dispatchEvent(new CustomEvent("switch-to-knowledge", { detail: { targetModule: mappedId, action: 'ai_interview' } }));
                                  }} className="px-2.5 py-1.5 bg-neutral-900 text-white text-[11px] font-bold rounded-lg hover:bg-neutral-800 transition-colors shadow-sm flex items-center gap-1">
                                    <Sparkles size={12} /> 开启 AI 访谈
                                  </button>
                                  <button onClick={() => {
                                    const mappedId = item.id === 'painpoints' || item.id === 'audience' ? 'customer' :
                                                     item.id === 'product' || item.id === 'price' ? 'brand' :
                                                     item.id === 'history' || item.id === 'budget' ? 'review' :
                                                     item.id === 'conversion' ? 'reply' :
                                                     item.id === 'accounts' ? 'account' : item.id;
                                    window.dispatchEvent(new CustomEvent("switch-to-knowledge", { detail: { targetModule: mappedId, action: 'file_mapping' } }));
                                  }} className="px-2.5 py-1.5 bg-white border border-neutral-200 text-neutral-700 text-[11px] font-bold rounded-lg hover:bg-neutral-50 transition-colors shadow-sm flex items-center gap-1">
                                    <FolderOpen size={12} /> 配置本地文件映射
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const ExecutionCheckModal = ({ onClose, onProceed }: { onClose: () => void, onProceed: () => void }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-[500px] bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-5 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50">
          <h3 className="text-[18px] font-bold text-neutral-900">执行条件前置检查</h3>
          <button onClick={onClose} className="p-2 hover:bg-neutral-200 rounded-xl text-neutral-500 transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-[13px] text-neutral-600 mb-2">应用策略前，系统正核对执行该策略所需的硬性条件是否满足：</p>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl">
               <div className="flex items-center gap-2 text-[14px] text-emerald-900"><CheckCircle size={16} className="text-emerald-500" /> 账号产能与档期</div>
               <span className="text-[12px] font-bold text-emerald-700">已满足 (KOS可用6个)</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl">
               <div className="flex items-center gap-2 text-[14px] text-emerald-900"><CheckCircle size={16} className="text-emerald-500" /> 内容生产能力</div>
               <span className="text-[12px] font-bold text-emerald-700">已满足 (周期14天)</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-neutral-50 border border-neutral-200 rounded-xl">
               <div className="flex items-center gap-2 text-[14px] text-neutral-700"><Circle size={16} className="text-neutral-400" /> 私域承接人员配置</div>
               <span className="text-[12px] font-bold text-neutral-500">待确认</span>
            </div>
          </div>
        </div>
        <div className="p-5 bg-neutral-50 border-t border-neutral-100 flex justify-between items-center">
          <button className="text-[13px] font-bold text-primary-600 hover:underline">一键生成补足任务</button>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-[14px] font-bold text-neutral-700 hover:bg-neutral-200 transition-colors">
              取消
            </button>
            <button onClick={onProceed} className="px-5 py-2.5 rounded-xl text-[14px] font-bold bg-neutral-900 text-white hover:bg-neutral-800 transition-colors shadow-sm">
              强制忽略并创建
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


const ParameterAdjustmentView = ({ strategy, onBack, onCreate }: { strategy: any, onBack: () => void, onCreate: () => void }) => {
  const defaultBrand = Math.floor(strategy.metrics.content * 0.1);
  const defaultKos = Math.floor(strategy.metrics.content * 0.7);
  const defaultKoc = strategy.metrics.content - defaultBrand - defaultKos;
  
  const [brandCount, setBrandCount] = useState(defaultBrand);
  const [kosCount, setKosCount] = useState(defaultKos);
  const [kocCount, setKocCount] = useState(defaultKoc);
  
  const [budget, setBudget] = useState(strategy.metrics.budget);
  const [isBudgetManual, setIsBudgetManual] = useState(false);
  
  // 联动逻辑：随着内容数量变化，自动重新计算预估消耗
  const calculatedBudget = brandCount * 0 + kosCount * 150 + kocCount * 50 + 2000; // 假设 info flow budget = 2000固定
  
  const handleCalculate = () => {
    setBudget(calculatedBudget);
    setIsBudgetManual(false);
  };

  const getImpacts = () => {
    const impacts = [];
    const diff = budget - strategy.metrics.budget;
    
    if (brandCount + kosCount + kocCount >= strategy.metrics.content) {
      impacts.push({ type: 'ok', text: '内容体量仍能覆盖核心长尾词' });
    } else {
      impacts.push({ type: 'warn', text: '搜索卡位密度下降，长尾词覆盖率可能不足80%' });
    }

    if (kosCount < defaultKos) {
      impacts.push({ type: 'warn', text: '主力KOS评测减少，可能导致私信意向客资不足' });
    }
    
    if (diff < 0) {
       impacts.push({ type: 'warn', text: `预算下调，信息流追投空间被压缩 (- ${Math.abs(diff)}元)` });
    }
    
    if (budget < calculatedBudget && isBudgetManual) {
       impacts.push({ type: 'error', text: '当前填写的预算低于内容制作与投放底线测算' });
    } else if (impacts.length === 0) {
       impacts.push({ type: 'ok', text: '当前调整未偏离策略核心逻辑' });
    }
    return impacts;
  };

  const impacts = getImpacts();
  const diffBudget = budget - strategy.metrics.budget;

  return (
    <div className="max-w-[1000px] mx-auto py-8 animate-in fade-in zoom-in-95 duration-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-neutral-200 rounded-xl text-neutral-500 transition-colors">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h2 className="text-[24px] font-bold text-neutral-900">调整策略执行参数</h2>
            <p className="text-[14px] text-neutral-600 mt-1">您可以覆盖系统推算的数值，系统将实时评估调整对策略的影响</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8 space-y-6">
          <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6">
              <label className="text-[15px] font-bold text-neutral-900 block mb-4">账号矩阵与资源分配</label>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-200">
                      <th className="pb-3 text-[12px] font-bold text-neutral-500 w-[120px]">渠道</th>
                      <th className="pb-3 text-[12px] font-bold text-neutral-500 w-[100px]">内容量</th>
                      <th className="pb-3 text-[12px] font-bold text-neutral-500 w-[100px]">可用账号</th>
                      <th className="pb-3 text-[12px] font-bold text-neutral-500 w-[120px]">单篇预估成本</th>
                      <th className="pb-3 text-[12px] font-bold text-neutral-500">策略用途</th>
                    </tr>
                  </thead>
                  <tbody className="text-[13px]">
                    <tr className="border-b border-neutral-100">
                      <td className="py-4 font-bold text-neutral-800">品牌官号</td>
                      <td className="py-4">
                        <input type="number" value={brandCount} onChange={e => setBrandCount(Number(e.target.value))} className="w-16 px-2 py-1 bg-neutral-50 border border-neutral-200 rounded font-medium focus:border-primary-500 focus:outline-none" />
                      </td>
                      <td className="py-4 text-neutral-600">1个</td>
                      <td className="py-4 text-neutral-600">0元 (内部制作)</td>
                      <td className="py-4 text-neutral-500 text-[12px]">官方背书定调</td>
                    </tr>
                    <tr className="border-b border-neutral-100 bg-primary-50/30">
                      <td className="py-4 font-bold text-primary-900 flex items-center gap-1">KOS/员工号 <Sparkles size={12} className="text-primary-500"/></td>
                      <td className="py-4">
                        <input type="number" value={kosCount} onChange={e => setKosCount(Number(e.target.value))} className="w-16 px-2 py-1 bg-white border border-primary-200 text-primary-700 rounded font-bold focus:border-primary-500 focus:outline-none" />
                      </td>
                      <td className="py-4 text-neutral-600">6个</td>
                      <td className="py-4 text-neutral-600">约 150元</td>
                      <td className="py-4 text-primary-700/80 text-[12px] font-medium">搜索长尾截流与私信承接</td>
                    </tr>
                    <tr className="border-b border-neutral-100">
                      <td className="py-4 font-bold text-neutral-800">KOC/素人</td>
                      <td className="py-4">
                        <input type="number" value={kocCount} onChange={e => setKocCount(Number(e.target.value))} className="w-16 px-2 py-1 bg-neutral-50 border border-neutral-200 rounded font-medium focus:border-primary-500 focus:outline-none" />
                      </td>
                      <td className="py-4 text-neutral-600">招募池充足</td>
                      <td className="py-4 text-neutral-600">约 50元 (置换)</td>
                      <td className="py-4 text-neutral-500 text-[12px]">外围真实口碑铺设</td>
                    </tr>
                    <tr>
                      <td className="py-4 font-bold text-neutral-800">信息流追投</td>
                      <td className="py-4 text-neutral-400">—</td>
                      <td className="py-4 text-neutral-400">—</td>
                      <td className="py-4 font-bold text-neutral-900">
                        动态分配
                      </td>
                      <td className="py-4 text-neutral-500 text-[12px]">放大自然流优质笔记</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden p-6">
            <label className="text-[15px] font-bold text-neutral-900 block mb-4">预算规划</label>
            <div className="flex items-start gap-8">
               <div className="flex-1">
                 <div className="text-[13px] text-neutral-500 mb-1">当前项目总预算 (元)</div>
                 <div className="flex items-center gap-3">
                   <input type="number" value={budget} onChange={e => {setBudget(Number(e.target.value)); setIsBudgetManual(true);}} className="w-32 px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-[16px] font-bold text-neutral-900 focus:border-primary-500 focus:outline-none" />
                   {isBudgetManual && <button onClick={handleCalculate} className="text-[12px] font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded">依内容量重算</button>}
                 </div>
               </div>
               <div className="w-px h-12 bg-neutral-200"></div>
               <div className="flex-1">
                 <div className="text-[13px] text-neutral-500 mb-1">原策略建议预算</div>
                 <div className="text-[16px] font-bold text-neutral-800">{strategy.metrics.budget} <span className="text-[12px] font-normal text-neutral-400 ml-1">元</span></div>
               </div>
               <div className="w-px h-12 bg-neutral-200"></div>
               <div className="flex-1">
                 <div className="text-[13px] text-neutral-500 mb-1">差值</div>
                 <div className={`text-[16px] font-bold ${diffBudget < 0 ? 'text-orange-600' : diffBudget > 0 ? 'text-emerald-600' : 'text-neutral-500'}`}>
                   {diffBudget > 0 ? '+' : ''}{diffBudget} <span className="text-[12px] font-normal ml-1">元</span>
                 </div>
               </div>
            </div>
          </div>
        </div>

        <div className="col-span-4">
          <div className="bg-neutral-900 rounded-2xl p-6 text-white h-full flex flex-col">
            <h3 className="text-[16px] font-bold mb-6 flex items-center gap-2"><Settings2 size={18} /> 当前调整影响</h3>
            
            <div className="space-y-4 flex-1">
              {impacts.map((impact, i) => (
                <div key={i} className="flex items-start gap-3">
                  {impact.type === 'ok' ? (
                     <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                  ) : impact.type === 'warn' ? (
                     <AlertTriangle size={16} className="text-orange-400 shrink-0 mt-0.5" />
                  ) : (
                     <AlertCircle size={16} className="text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <span className={`text-[13px] leading-relaxed ${impact.type === 'ok' ? 'text-neutral-300' : impact.type === 'warn' ? 'text-orange-100 font-medium' : 'text-rose-100 font-bold'}`}>
                    {impact.text}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-6 mt-6 border-t border-neutral-700">
               <div className="flex flex-col gap-3">
                 <button onClick={() => { setBrandCount(defaultBrand); setKosCount(defaultKos); setKocCount(defaultKoc); setBudget(strategy.metrics.budget); setIsBudgetManual(false); }} className="w-full py-2.5 text-[13px] font-bold text-neutral-400 hover:text-white transition-colors">
                   恢复策略原始建议
                 </button>
                 <button onClick={onCreate} disabled={impacts.some(i => i.type === 'error')} className="w-full py-3 bg-primary-600 text-white rounded-xl text-[14px] font-bold hover:bg-primary-500 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                   保存调整并继续
                 </button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StrategyView = ({ hasData }: { hasData?: boolean }) => {
  const [showDiagnosisDetail, setShowDiagnosisDetail] = useState(false);
  const [showExecutionCheck, setShowExecutionCheck] = useState(false);
  const [adjustingParams, setAdjustingParams] = useState(false);
  const [showAltStrategies, setShowAltStrategies] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const primaryStrategy = STRATEGIES[0];
  const alternateStrategies = STRATEGIES.slice(1);

  const handleCreateProject = () => {
    alert('项目创建成功！即将进入[执行空间]开启内容分发工作流...');
    setShowExecutionCheck(false);
    window.dispatchEvent(new CustomEvent("nav-to-execution"));
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setIsGenerated(true);
    }, 2500);
  };

  if (!isGenerated) {
    return (
      <div className="max-w-[1000px] mx-auto py-12 animate-in fade-in duration-300">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Sparkles size={32} className="text-primary-600" />
          </div>
          <h2 className="text-[28px] font-bold text-neutral-900 mb-3">AI 操盘策略推演</h2>
          <p className="text-[15px] text-neutral-500 max-w-[600px] mx-auto mb-8">
            系统将基于知识与记忆中的商家事实数据，自动推演最适合当期的营销打法、资源分配比例以及预估成果。
          </p>
          
          <div className="bg-primary-50 border border-primary-100 rounded-2xl p-5 mb-8 text-left flex items-start gap-3 max-w-[600px] mx-auto">
            <Sparkles size={18} className="text-primary-600 mt-0.5 shrink-0" />
            <div>
              <h4 className="text-[14px] font-bold text-primary-900 mb-1">发现最新事实更新</h4>
              <p className="text-[13px] text-primary-800/80 leading-relaxed">
                自上次策略存档以来，AI 在知识库中发现了 <strong>3</strong> 项新的已确认事实（包含：最新客单价波动、近期跑量素材特征等）。建议结合最新事实生成当期策略。
              </p>
            </div>
          </div>
          
          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className={`px-8 py-3.5 bg-neutral-900 text-white rounded-xl text-[15px] font-bold hover:bg-neutral-800 transition-all shadow-lg flex items-center gap-2 mx-auto ${isGenerating ? 'opacity-80' : ''}`}
          >
            {isGenerating ? (
              <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> 正在诊断推演中...</>
            ) : (
              <><Sparkles size={18} /> 生成操盘策略</>
            )}
          </button>
        </div>

        <div className="mt-16">
          <div className="flex items-center justify-between mb-6 border-b border-neutral-100 pb-4">
            <h3 className="text-[16px] font-bold text-neutral-900 flex items-center gap-2">
              <FolderOpen size={18} className="text-neutral-400" /> 历史策略存档
            </h3>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white border border-neutral-200 p-6 rounded-2xl shadow-sm hover:border-primary-300 hover:shadow-md transition-all cursor-pointer group" onClick={() => setIsGenerated(true)}>
              <div className="flex justify-between items-start mb-4">
                <span className="px-2.5 py-1 bg-neutral-100 text-neutral-600 text-[12px] font-bold rounded">2026-06-15</span>
                <span className="text-[12px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">已结案</span>
              </div>
              <h4 className="text-[16px] font-bold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors">618 大促蓄水与转化</h4>
              <p className="text-[13px] text-neutral-500 mb-4 line-clamp-2">针对 618 节点，采用 KOC 达人铺量蓄水结合信息流强转化模型，达成 3.2 的总体 ROI。</p>
              <div className="flex items-center gap-4 text-[12px] text-neutral-400">
                <span className="flex items-center gap-1"><FileText size={14}/> 86篇内容</span>
                <span className="flex items-center gap-1"><Database size={14}/> 20,000元</span>
              </div>
            </div>

            <div className="bg-white border border-neutral-200 p-6 rounded-2xl shadow-sm hover:border-primary-300 hover:shadow-md transition-all cursor-pointer group" onClick={() => setIsGenerated(true)}>
              <div className="flex justify-between items-start mb-4">
                <span className="px-2.5 py-1 bg-neutral-100 text-neutral-600 text-[12px] font-bold rounded">2026-05-01</span>
                <span className="text-[12px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">已结案</span>
              </div>
              <h4 className="text-[16px] font-bold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors">新品上市长尾截流</h4>
              <p className="text-[13px] text-neutral-500 mb-4 line-clamp-2">针对幼犬主粮新品，以长尾词搜索卡位为主，强力控制单次拍摄成本，引导私域转化。</p>
              <div className="flex items-center gap-4 text-[12px] text-neutral-400">
                <span className="flex items-center gap-1"><FileText size={14}/> 42篇内容</span>
                <span className="flex items-center gap-1"><Database size={14}/> 8,000元</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (adjustingParams) {
    return (
      <ParameterAdjustmentView 
        strategy={primaryStrategy} 
        onBack={() => setAdjustingParams(false)} 
        onCreate={() => setAdjustingParams(false)} 
      />
    );
  }

  if (showExecutionCheck) {
    return (
      <div className="max-w-[1200px] mx-auto py-6 relative">
        <div className="opacity-40 pointer-events-none blur-sm"><StrategyContent /></div>
        <ExecutionCheckModal onClose={() => setShowExecutionCheck(false)} onProceed={handleCreateProject} />
      </div>
    );
  }

  function StrategyContent() {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-[24px] font-bold text-neutral-900 mb-2 flex items-center gap-2">
               <Sparkles className="text-primary-600" /> 操盘策略已生成
            </h2>
            <p className="text-[14px] text-neutral-500">基于完整的商家事实诊断，为您推荐以下运营打法。</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setIsGenerated(false)}
              className="px-4 py-2.5 bg-neutral-100 text-neutral-700 rounded-xl text-[14px] font-bold hover:bg-neutral-200 transition-colors flex items-center gap-2"
            >
              <Sparkles size={16} /> 生成操盘策略
            </button>
            <button 
              onClick={() => setShowDiagnosisDetail(true)}
              className="px-4 py-2.5 bg-white border border-neutral-200 text-neutral-700 rounded-xl text-[14px] font-bold hover:bg-neutral-50 transition-colors shadow-sm"
            >
              查看诊断详情
            </button>
          </div>
        </div>

        <div className="bg-white border-2 border-primary-500 p-8 rounded-3xl shadow-lg relative overflow-hidden transition-all duration-500">
          <div className="absolute top-0 right-0 bg-primary-500 text-white text-[13px] font-bold px-4 py-1.5 rounded-bl-2xl">最匹配首选</div>
          <h4 className="text-[28px] font-bold text-neutral-900 mb-8">{primaryStrategy.title}</h4>
          
          <div className="grid grid-cols-12 gap-8 mb-8">
             <div className="col-span-5 flex flex-col justify-between">
                <div>
                  <div className="text-[14px] font-bold text-neutral-900 mb-4">策略依据与事实：</div>
                  <div className="space-y-3">
                    {primaryStrategy.rationaleDetails.map((item, i) => (
                      <div key={i} className="flex items-start gap-2 group">
                        <CheckCircle2 size={16} className="text-primary-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[14px] text-neutral-700 leading-relaxed border-b border-dashed border-neutral-300 group-hover:border-primary-400 cursor-help transition-colors" title={item.fact}>{item.text}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-8 bg-neutral-50 p-5 rounded-2xl">
                  <div className="text-[13px] text-neutral-500 mb-2">资源分配概览</div>
                  <div className="text-[14px] font-bold text-neutral-900 leading-relaxed">{primaryStrategy.allocation}</div>
                </div>
             </div>
             
             <div className="col-span-7 grid grid-cols-2 gap-4">
                <div className="bg-neutral-50 p-5 rounded-2xl">
                  <div className="text-[13px] text-neutral-500 mb-2">预期解决的核心痛点</div>
                  <div className="text-[14px] font-bold text-neutral-900 leading-relaxed">{primaryStrategy.solution}</div>
                </div>
                <div className="bg-neutral-50 p-5 rounded-2xl">
                  <div className="text-[13px] text-neutral-500 mb-2">执行重点要求</div>
                  <div className="text-[14px] font-bold text-neutral-900 leading-relaxed">{primaryStrategy.focus}</div>
                </div>
                <div className="bg-primary-50/50 border border-primary-100 p-5 rounded-2xl col-span-2 flex items-center justify-between">
                  <div>
                    <div className="text-[13px] font-bold text-primary-900 mb-2">建议执行规模：</div>
                    <div className="flex items-center gap-6 text-[14px]">
                      <span className="flex items-center gap-1.5 text-primary-800 font-bold"><FileText size={16} className="text-primary-400"/> {primaryStrategy.metrics.content}篇内容</span>
                      <span className="flex items-center gap-1.5 text-primary-800 font-bold"><Clock size={16} className="text-primary-400"/> {primaryStrategy.metrics.days}天周期</span>
                      <span className="flex items-center gap-1.5 text-primary-800 font-bold"><Database size={16} className="text-primary-400"/> {primaryStrategy.metrics.budget}元预算</span>
                    </div>
                  </div>
                </div>
             </div>
          </div>

          <div className="flex justify-between items-center pt-6 border-t border-neutral-100">
            <button 
                onClick={() => setAdjustingParams(true)}
                className="px-5 py-3 bg-white border border-neutral-200 text-neutral-700 rounded-xl text-[14px] font-bold hover:bg-neutral-50 transition-colors shadow-sm flex items-center gap-2"
              >
                <Settings2 size={16} /> 调整策略执行参数
            </button>
            <button 
              onClick={() => setShowExecutionCheck(true)}
              className="px-8 py-3 bg-neutral-900 text-white rounded-xl text-[14px] font-bold hover:bg-neutral-800 transition-colors shadow-sm flex items-center gap-2"
            >
              检查执行条件并应用 <ArrowRight size={16} />
            </button>
          </div>
        </div>

        <div>
          <button 
            onClick={() => setShowAltStrategies(!showAltStrategies)}
            className="flex items-center gap-2 text-[14px] font-bold text-neutral-600 hover:text-neutral-900 transition-colors py-2"
          >
            <ChevronDown size={16} className={`transition-transform ${showAltStrategies ? 'rotate-180' : ''}`} />
            其他可行策略 ({alternateStrategies.length})
          </button>
          
          {showAltStrategies && (
            <div className="grid grid-cols-2 gap-6 mt-4 animate-in fade-in slide-in-from-top-4 duration-300">
              {alternateStrategies.map(strategy => (
                <div key={strategy.id} className="bg-white border border-neutral-200 p-6 rounded-3xl shadow-sm hover:border-neutral-300 transition-all">
                  <h4 className="text-[18px] font-bold text-neutral-900 mb-4">{strategy.title}</h4>
                  <div className="space-y-4">
                    <div>
                      <span className="text-[12px] font-bold text-neutral-500 block mb-1">适用条件：</span>
                      <p className="text-[13px] text-neutral-800">{strategy.condition}</p>
                    </div>
                    <div>
                      <span className="text-[12px] font-bold text-neutral-500 block mb-1">为什么不是首选：</span>
                      <p className="text-[13px] text-neutral-600">{strategy.whyNot}</p>
                    </div>
                    <div className="p-3 bg-neutral-50 rounded-xl">
                      <span className="text-[12px] font-bold text-neutral-700 block mb-1 flex items-center gap-1"><Info size={14}/> 切换建议：</span>
                      <p className="text-[12px] text-neutral-600">{strategy.switchCondition}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto py-6 animate-in fade-in duration-300">
      <StrategyContent />
      {showDiagnosisDetail && (
        <DiagnosisDetailDrawer onClose={() => setShowDiagnosisDetail(false)} items={DIAGNOSIS_ITEMS} />
      )}
    </div>
  );
};

export const Strategy: React.FC<{
  hasData?: boolean;
  strategyData?: { word: string; rate: string }[];
  merchantId?: string;
}> = ({ hasData, merchantId }) => {
  // Demo routing logic unchanged, assume project-a hits the happy path StrategyView
  return (
    <div className="h-full overflow-y-auto bg-neutral-50/40 px-6">
      <StrategyView hasData={hasData} />
    </div>
  );
};

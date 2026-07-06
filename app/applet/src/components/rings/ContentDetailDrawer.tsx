import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  X, CheckCircle2, ChevronRight, Wand2, FileText, 
  Image as ImageIcon, Compass, AlertTriangle, Play,
  Smartphone, Users, QrCode, SkipBack, SkipForward, ArrowRight
} from 'lucide-react';

const MOCK_ITEMS = [
  // 官方号
  { 
    id: 'c1', channel: 'official', channelName: '官方号', title: '幼犬软便怎么办？这3个换粮误区你中招了吗？', 
    status: '可进入排期', strategy: '专业科普', basis: '商家画像、账号定位、无谷配方、不拉踩禁区', 
    materialStatus: '已组装', 
    content: '作为一名从医5年的宠物医生，接诊过太多因为换粮不当导致肠胃炎的幼犬。今天就来科普一下正确的换粮姿势。\n\n误区一：一次性全部换新粮。幼犬肠胃脆弱，需要7天过渡期（俗称7日换粮法）。\n\n误区二：只看包装不看成分。一定要学会看配料表，首选鲜肉配方，避开肉粉和诱食剂。\n\n选粮建议：推荐肠胃敏感的幼犬选择含有益生菌、无谷低敏配方的狗粮。',
    aiAdvice: '可进入排期', aiReason: '符合专业科普口吻，未触发禁区，素材满足发布要求', aiWarning: '标题略偏硬，可改得更口语'
  },
  { 
    id: 'c2', channel: 'official', channelName: '官方号', title: '全网首发！这波新品真的顶不住了', 
    status: '待补素材', strategy: '新品首发', basis: '新品特性、成分拆解', 
    materialStatus: '缺素材', 
    content: '家人们！终于等到了这波新品首发！\n\n这次的新品升级了配方，添加了更多的营养元素，让狗狗吃得更健康。',
    aiAdvice: '待补素材', aiReason: '正文符合规范，但缺少产品首发场景图', aiWarning: '',
    missingMaterial: { desc: '缺 2 张门店问答场景图', target: '店长小王', reqs: ['拍一张店员接待客户咨询的场景', '拍一张产品陈列和推荐过程', '不要出现竞品包装'] }
  },
  { 
    id: 'c3', channel: 'official', channelName: '官方号', title: '你真的会挑狗粮吗？避坑指南', 
    status: '需重写', strategy: '避坑指南', basis: '成分配比、选粮误区', 
    materialStatus: '已组装', 
    content: '今天教大家怎么看狗粮，有些牌子比如XX品牌真的不要买，肉粉太多了。一定要认准我们家这款。',
    aiAdvice: '需重写', aiReason: '过于生硬，且直接提及了竞品', aiWarning: '违反了“不拉踩竞品”的禁区'
  },
  
  // KOS
  { id: 'c4', channel: 'kos', channelName: '员工 KOS', title: '门店探店日常 (待生成)', status: '待人设确认', strategy: '员工日常', basis: '日常探店、产品推荐', materialStatus: '待确认', content: '', aiAdvice: '需确认人设', aiReason: '当前缺少具体执行人的真实反馈风格', aiWarning: '需先选择门店员工身份' },
  { id: 'c5', channel: 'kos', channelName: '员工 KOS', title: '客户真实服务 (待生成)', status: '待人设确认', strategy: '服务记录', basis: '店面服务、客户体验', materialStatus: '待确认', content: '', aiAdvice: '需确认人设', aiReason: '当前缺少具体执行人的真实反馈风格', aiWarning: '需先选择门店员工身份' },

  // 真实客户快发
  { id: 'c6', channel: 'koc_real', channelName: '真实客户快发', title: '现场扫码包 (5 个名额)', status: '待现场扫码', strategy: '真实反馈', basis: '到店体验、真实好评', materialStatus: '待现场扫码', content: '', aiAdvice: '快发包已准备', aiReason: '适用对象：到店/已购买/已使用客户', aiWarning: '需要客户现场选择体验场景 + 补一句真实感受\n预计 3-5 秒初稿，15 秒精修', isQuickCode: true },

  // 泛素人
  { id: 'c7', channel: 'koc_general', channelName: '泛素人分发', title: '素人种草计划 (8 个名额)', status: '待分配人设', strategy: '素人种草', basis: '真实体验、宠物日常', materialStatus: '待分配', content: '', aiAdvice: '需要先分配人设', aiReason: '当前待分配：宝妈 3、大学生 2、养宠新手 3', aiWarning: '', isPersona: true }
];

const GROUPS = [
  { id: 'official', name: '官方号', countStr: '3 篇可确认', batchAction: '批量确认可发布内容', color: 'bg-blue-500' },
  { id: 'kos', name: 'KOS', countStr: '2 篇待人设确认', batchAction: '批量发送人设确认', color: 'bg-indigo-500' },
  { id: 'koc_real', name: '真实客户快发', countStr: '5 个待现场扫码', batchAction: '批量生成现场二维码', color: 'bg-amber-500' },
  { id: 'koc_general', name: '泛素人分发', countStr: '8 个待分配人设', batchAction: '批量进入人设分配', color: 'bg-emerald-500' },
];

export const ContentDetailDrawer = ({ onClose }: { onClose: () => void }) => {
  const [items, setItems] = useState(MOCK_ITEMS);
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentItem = items[currentIndex];

  const handleNext = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const getStatusColor = (status: string) => {
    if (status === '可进入排期') return 'bg-emerald-50 text-emerald-600 border-emerald-200';
    if (status === '需重写') return 'bg-rose-50 text-rose-600 border-rose-200';
    if (status === '待补素材') return 'bg-orange-50 text-orange-600 border-orange-200';
    return 'bg-amber-50 text-amber-600 border-amber-200';
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-neutral-900/20 backdrop-blur-sm" onClick={onClose} />
      
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="w-[900px] bg-neutral-100 h-full shadow-2xl flex flex-col relative z-10"
      >
        {/* Header */}
        <div className="h-16 px-6 border-b border-neutral-200 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2">
            <Play size={18} className="text-indigo-600" />
            <h3 className="font-bold text-neutral-900 text-[16px]">批量快审工作台</h3>
            <span className="text-[12px] text-neutral-500 ml-2">总计 20 篇内容</span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
            <X size={18} className="text-neutral-500" />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Left: Groups & Queue */}
          <div className="w-[320px] bg-white border-r border-neutral-200 flex flex-col shrink-0">
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-6">
              {GROUPS.map(group => {
                const groupItems = items.filter(i => i.channel === group.id);
                if (groupItems.length === 0) return null;
                return (
                  <div key={group.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${group.color}`} />
                        <h4 className="font-bold text-[13px] text-neutral-900">{group.name}</h4>
                      </div>
                      <span className="text-[11px] font-bold text-neutral-500">{group.countStr}</span>
                    </div>
                    
                    <button className="w-full py-1.5 border border-neutral-200 text-[12px] font-bold text-neutral-600 rounded-lg hover:bg-neutral-50 transition-colors">
                      {group.batchAction}
                    </button>

                    <div className="space-y-2">
                      {groupItems.map(item => {
                        const globalIndex = items.findIndex(i => i.id === item.id);
                        const isSelected = globalIndex === currentIndex;
                        return (
                          <div 
                            key={item.id}
                            onClick={() => setCurrentIndex(globalIndex)}
                            className={`p-3 rounded-xl border cursor-pointer transition-colors ${isSelected ? 'border-indigo-500 bg-indigo-50/30 shadow-sm' : 'border-neutral-200 hover:border-indigo-300'}`}
                          >
                            <div className="text-[13px] font-bold text-neutral-900 mb-1.5 truncate">{item.title}</div>
                            <div className="flex items-center justify-between">
                              <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${getStatusColor(item.status)}`}>
                                {item.status}
                              </span>
                              <span className="text-[11px] text-neutral-500">{item.strategy}</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right: Quick Review Area */}
          <div className="flex-1 bg-neutral-50 flex flex-col relative overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar pb-24">
              {currentItem ? (
                <div className="max-w-2xl mx-auto space-y-6">
                  {/* Header info */}
                  <div>
                    <h2 className="text-[20px] font-bold text-neutral-900 mb-3">{currentItem.title}</h2>
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-bold bg-neutral-200 text-neutral-700 px-2 py-1 rounded">{currentItem.channelName}</span>
                      <span className="text-[12px] font-bold text-neutral-500 border border-neutral-200 px-2 py-1 rounded bg-white">打法：{currentItem.strategy}</span>
                      <span className={`text-[12px] font-bold px-2 py-1 rounded border ${getStatusColor(currentItem.status)}`}>
                        {currentItem.status}
                      </span>
                    </div>
                  </div>

                  {/* Context Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm">
                      <div className="text-[12px] font-bold text-neutral-500 mb-1.5 flex items-center gap-1.5"><Compass size={14} /> 生成依据</div>
                      <div className="text-[13px] font-medium text-neutral-800">{currentItem.basis}</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm">
                      <div className="text-[12px] font-bold text-neutral-500 mb-1.5 flex items-center gap-1.5"><ImageIcon size={14} /> 素材状态</div>
                      <div className={`text-[13px] font-bold ${currentItem.materialStatus === '已组装' ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {currentItem.materialStatus}
                      </div>
                    </div>
                  </div>

                  {/* AI Review Suggestion */}
                  <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5 shadow-sm space-y-3">
                    <div className="flex items-center gap-2 text-indigo-700 font-bold text-[14px]">
                      <Wand2 size={16} /> 审核建议：{currentItem.aiAdvice}
                    </div>
                    <p className="text-[13px] text-indigo-900/80 font-medium">原因：{currentItem.aiReason}</p>
                    {currentItem.aiWarning && (
                      <div className="mt-2 text-[12px] bg-white text-indigo-800 p-2.5 rounded-lg border border-indigo-100 shadow-sm">
                        <span className="font-bold text-rose-600 mr-1">需要注意：</span>{currentItem.aiWarning}
                      </div>
                    )}
                  </div>

                  {/* Special Cases */}
                  {currentItem.missingMaterial && (
                    <div className="bg-white border-2 border-orange-200 rounded-xl p-5 shadow-sm space-y-4">
                      <div className="flex items-center gap-2 text-orange-600 font-bold text-[14px]">
                        <AlertTriangle size={18} /> {currentItem.missingMaterial.desc}
                      </div>
                      <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
                        <div className="text-[12px] font-bold text-orange-800 mb-2">建议发送给：{currentItem.missingMaterial.target}</div>
                        <div className="text-[12px] font-bold text-orange-800 mb-1">拍摄要求：</div>
                        <ul className="list-decimal pl-4 text-[12px] text-orange-800/80 space-y-1">
                          {currentItem.missingMaterial.reqs.map((req, i) => <li key={i}>{req}</li>)}
                        </ul>
                      </div>
                      <div className="flex gap-3">
                        <button className="flex-1 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-[13px] font-bold rounded-lg transition-colors">发送拍摄任务</button>
                        <button className="flex-1 py-2 bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 text-[13px] font-bold rounded-lg transition-colors">换负责人</button>
                        <button className="flex-1 py-2 bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 text-[13px] font-bold rounded-lg transition-colors">暂用库内素材</button>
                      </div>
                    </div>
                  )}

                  {currentItem.isQuickCode && (
                    <div className="bg-white border-2 border-amber-200 rounded-xl p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-5">
                      <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center shadow-sm">
                        <QrCode size={32} />
                      </div>
                      <div>
                        <h4 className="text-[16px] font-bold text-neutral-900 mb-2">生成现场二维码</h4>
                        <p className="text-[13px] text-neutral-500 max-w-sm">门店可直接出示该二维码，客户扫码即可开始现场体验与评价回传。</p>
                      </div>
                      <div className="flex gap-3 w-full max-w-sm">
                        <button className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-[13px] font-bold rounded-xl transition-colors">生成二维码</button>
                        <button className="flex-1 py-2.5 bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 text-[13px] font-bold rounded-xl transition-colors">查看扫码体验</button>
                        <button className="flex-1 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-500 text-[13px] font-bold rounded-xl transition-colors">暂停快发</button>
                      </div>
                    </div>
                  )}

                  {currentItem.isPersona && (
                    <div className="bg-white border-2 border-emerald-200 rounded-xl p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-5">
                      <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm">
                        <Users size={32} />
                      </div>
                      <div>
                        <h4 className="text-[16px] font-bold text-neutral-900 mb-2">进入人设分配</h4>
                        <p className="text-[13px] text-neutral-500 max-w-sm">需要先为这 8 个泛素人分发名额分配具体的人设画像，再生成内容。</p>
                      </div>
                      <button className="w-full max-w-sm py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-[13px] font-bold rounded-xl transition-colors">进入人设分配大厅</button>
                    </div>
                  )}

                  {/* Content Preview */}
                  {currentItem.content && (
                    <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm space-y-3">
                      <div className="text-[13px] font-bold text-neutral-400 mb-2 flex items-center gap-1.5"><FileText size={14} /> 正文预览</div>
                      {currentItem.content.split('\n').map((p, i) => (
                        <p key={i} className="text-[13px] text-neutral-700 leading-relaxed min-h-[1em]">{p}</p>
                      ))}
                    </div>
                  )}

                </div>
              ) : null}
            </div>

            {/* Bottom Fixed Action Bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-neutral-200 p-4 flex items-center justify-between z-20 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
              <div className="flex items-center gap-4">
                <button 
                  onClick={handlePrev} 
                  disabled={currentIndex === 0}
                  className="flex items-center gap-1.5 text-[13px] font-bold text-neutral-600 hover:text-neutral-900 disabled:opacity-30 disabled:hover:text-neutral-600 transition-colors"
                >
                  <SkipBack size={16} /> 上一篇
                </button>
                <div className="text-[12px] text-neutral-500 font-medium">当前 {currentIndex + 1}/20，预计还需 6 分钟</div>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={handleNext}
                  className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 text-[13px] font-bold rounded-lg transition-colors"
                >
                  暂缓
                </button>
                <button 
                  onClick={handleNext}
                  className="px-4 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 text-[13px] font-bold rounded-lg transition-colors"
                >
                  退回重写
                </button>
                <button 
                  onClick={handleNext}
                  className="px-4 py-2 bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 text-[13px] font-bold rounded-lg transition-colors"
                >
                  改一下
                </button>
                <button 
                  onClick={handleNext}
                  className="px-6 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-[13px] font-bold rounded-lg transition-colors shadow-md flex items-center gap-2"
                >
                  <CheckCircle2 size={16} /> 确认通过
                </button>
                
                <button 
                  onClick={handleNext} 
                  disabled={currentIndex === items.length - 1}
                  className="ml-2 flex items-center gap-1.5 text-[13px] font-bold text-neutral-600 hover:text-neutral-900 disabled:opacity-30 disabled:hover:text-neutral-600 transition-colors"
                >
                  下一篇 <SkipForward size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};


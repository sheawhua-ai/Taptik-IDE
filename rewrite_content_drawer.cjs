const fs = require('fs');

const code = `import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, CheckCircle2, ChevronRight, Wand2, FileText, 
  Image as ImageIcon, Compass, Send, CheckCircle, Clock,
  MessageSquare, User
} from 'lucide-react';

const MOCK_CONTENT = [
  {
    id: 'c1',
    channel: 'official',
    channelName: '官方号',
    title: '幼犬软便怎么办？这3个换粮误区你中招了吗？',
    status: '可确认',
    strategy: '专业科普',
    memory: '品牌背书、7日换粮法、无谷配方',
    materials: '官方产品海报、成分拆解图',
    readyForPublish: true,
    content: '作为一名从医5年的宠物医生，接诊过太多因为换粮不当导致肠胃炎的幼犬。今天就来科普一下正确的换粮姿势。\\n\\n误区一：一次性全部换新粮。幼犬肠胃脆弱，需要7天过渡期（俗称7日换粮法）。\\n\\n误区二：只看包装不看成分。一定要学会看配料表，首选鲜肉配方，避开肉粉和诱食剂。\\n\\n选粮建议：推荐肠胃敏感的幼犬选择含有益生菌、无谷低敏配方的狗粮。最近测评的一款国产粮，鲜肉含量高达70%，且添加了枯草芽孢杆菌，对幼犬肠胃非常友好。',
    tags: '#宠物科普 #狗狗软便 #健康养宠'
  },
  {
    id: 'c2',
    channel: 'kos',
    channelName: 'KOS',
    title: '店长手记：今天接诊了一只挑食小金毛',
    status: '待人设确认',
    strategy: '员工经验打法',
    memory: '线下门店场景、真实服务案例',
    materials: '需补拍门店问答场景',
    readyForPublish: false,
    content: '（正文待确认人设后生成）',
    tags: ''
  },
  {
    id: 'c3',
    channel: 'koc_3rd',
    channelName: '第三方 KOC',
    title: '幼犬换粮第 3 天体验 (任务 Brief)',
    status: '等待试用素材',
    strategy: '素人避坑体验打法',
    memory: '用户痛点：玻璃胃、挑食',
    materials: '开箱图、喂食图、便便状态、真实感受',
    readyForPublish: false,
    isBrief: true,
    briefDesc: '由于第三方 KOC 需要真实体验，目前暂不生成正文。系统已下发体验任务。',
    briefTasks: [
      '收到产品后拍 1 张开箱图',
      '第 3 天拍 1 张喂食场景',
      '记录狗狗吃不吃、便便是否正常',
      '回传 3-5 张图片和一段真实感受'
    ]
  },
  {
    id: 'c4',
    channel: 'koc_client',
    channelName: '客户 KOC',
    title: '客户换粮反馈邀请 (任务 Brief)',
    status: '等待客户反馈',
    strategy: '真实好评推荐打法',
    memory: '复购客户标签',
    materials: '客户真实生活照、狗狗合影',
    readyForPublish: false,
    isBrief: true,
    briefDesc: '客户 KOC 需要真实的口碑沉淀，系统已发送 H5 邀请链接。',
    briefTasks: [
      '邀请客户拍一段喂食小视频',
      '收集客户的一句话评价',
      '等待客户通过 H5 授权发布'
    ]
  }
];

export const ContentDetailDrawer: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [selectedContent, setSelectedContent] = useState<typeof MOCK_CONTENT[0] | null>(null);

  const renderChannelGroup = (channelCode: string, title: string, count: string, color: string) => {
    const items = MOCK_CONTENT.filter(c => c.channel === channelCode);
    if (items.length === 0) return null;
    
    return (
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className={\`w-2 h-2 rounded-full \${color}\`} />
          <h3 className="font-bold text-[14px] text-neutral-900">{title}</h3>
          <span className="text-[12px] font-medium text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">{count}</span>
        </div>
        <div className="space-y-3">
          {items.map(item => (
            <div 
              key={item.id} 
              onClick={() => setSelectedContent(item)}
              className={\`border rounded-xl p-4 cursor-pointer transition-colors \${selectedContent?.id === item.id ? 'border-indigo-500 bg-indigo-50/30' : 'border-neutral-200 bg-white hover:border-indigo-300'}\`}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-bold text-[13px] text-neutral-900">{item.title}</h4>
                <ChevronRight size={16} className="text-neutral-400" />
              </div>
              <div className="flex items-center gap-2">
                <span className={\`text-[11px] font-bold px-2 py-0.5 rounded \${item.readyForPublish ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}\`}>
                  {item.status}
                </span>
                <span className="text-[11px] text-neutral-500">{item.strategy}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-neutral-900/20 backdrop-blur-sm" />
      
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="w-[800px] bg-white h-full shadow-2xl flex flex-col relative z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-indigo-600" />
            <h3 className="font-bold text-neutral-900 text-[16px]">内容确认 (20 篇)</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-neutral-200 rounded-full transition-colors">
            <X size={18} className="text-neutral-500" />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Left: List */}
          <div className="w-[340px] border-r border-neutral-100 flex flex-col bg-neutral-50/30">
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              {renderChannelGroup('official', '官方号', '3 篇可确认', 'bg-blue-500')}
              {renderChannelGroup('kos', 'KOS', '2 篇待人设确认，2 篇可确认', 'bg-indigo-500')}
              {renderChannelGroup('koc_3rd', '第三方 KOC', '等待试用素材，不生成正文', 'bg-emerald-500')}
              {renderChannelGroup('koc_client', '客户 KOC', '等待客户反馈，不生成正文', 'bg-amber-500')}
            </div>
          </div>

          {/* Right: Detail */}
          <div className="flex-1 flex flex-col bg-white overflow-y-auto custom-scrollbar">
            {selectedContent ? (
              <div className="p-6 space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[12px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{selectedContent.channelName}</span>
                    <span className={\`text-[12px] font-bold px-2 py-0.5 rounded \${selectedContent.readyForPublish ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}\`}>
                      {selectedContent.status}
                    </span>
                  </div>
                  <h2 className="text-[18px] font-bold text-neutral-900">{selectedContent.title}</h2>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-100">
                    <div className="text-[12px] text-neutral-500 flex items-center gap-1.5 mb-1"><Compass size={14} />使用打法</div>
                    <div className="text-[13px] font-bold text-neutral-800">{selectedContent.strategy}</div>
                  </div>
                  <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-100">
                    <div className="text-[12px] text-neutral-500 flex items-center gap-1.5 mb-1"><Wand2 size={14} />引用商家记忆</div>
                    <div className="text-[13px] font-bold text-neutral-800">{selectedContent.memory}</div>
                  </div>
                </div>

                <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-100">
                  <div className="text-[12px] text-neutral-500 flex items-center gap-1.5 mb-1"><ImageIcon size={14} />需要哪些素材</div>
                  <div className="text-[13px] font-bold text-neutral-800">{selectedContent.materials}</div>
                </div>

                <div className="border-t border-neutral-100 pt-6">
                  {selectedContent.isBrief ? (
                    <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-5 space-y-4">
                      <div className="flex items-center gap-2 text-amber-700 font-bold text-[14px]">
                        <Clock size={16} /> 任务 Brief (等待回传后生成内容)
                      </div>
                      <p className="text-[13px] text-amber-800/80">{selectedContent.briefDesc}</p>
                      <div className="space-y-2 bg-white rounded-lg p-3 border border-amber-100/50">
                        <div className="text-[12px] font-bold text-neutral-700 mb-2">希望回传：</div>
                        {selectedContent.briefTasks?.map((task, i) => (
                          <div key={i} className="flex items-start gap-2 text-[13px] text-neutral-600">
                            <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">{i + 1}</span>
                            {task}
                          </div>
                        ))}
                      </div>
                      <button className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white text-[13px] font-bold rounded-lg transition-colors">
                        发送任务邀请
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="text-[14px] font-bold text-neutral-900">正文预览</div>
                        {selectedContent.readyForPublish && (
                          <button className="text-[12px] font-bold text-indigo-600 hover:text-indigo-700">编辑正文</button>
                        )}
                      </div>
                      <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm space-y-3">
                        {selectedContent.content.split('\\n').map((p, i) => (
                          <p key={i} className="text-[13px] text-neutral-700 leading-relaxed min-h-[1em]">{p}</p>
                        ))}
                        {selectedContent.tags && (
                          <p className="text-[13px] text-indigo-600 font-medium">{selectedContent.tags}</p>
                        )}
                      </div>
                      
                      {selectedContent.readyForPublish ? (
                        <button className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-[14px] font-bold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2">
                          <CheckCircle2 size={16} /> 确认并进入排期
                        </button>
                      ) : (
                        <button className="w-full py-3 bg-neutral-100 text-neutral-400 text-[14px] font-bold rounded-xl cursor-not-allowed flex items-center justify-center gap-2">
                          等待前置条件完成
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-neutral-400 p-6 text-center">
                <FileText size={48} className="mb-4 text-neutral-200" />
                <p className="text-[14px] font-medium text-neutral-600 mb-1">请在左侧选择一篇内容或任务</p>
                <p className="text-[12px]">KOC 通道将展示任务 Brief，官方号将展示正文预览</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
`;

fs.writeFileSync('src/components/rings/ContentDetailDrawer.tsx', code);
console.log("Rewrite completed");

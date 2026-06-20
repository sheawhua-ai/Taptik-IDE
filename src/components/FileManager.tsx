import React, { useState } from 'react';
import { 
  Search, Plus, ChevronDown, FolderOpen, FileText, ImageIcon, 
  Brain, Database, SlidersHorizontal, X, BookOpen, User, 
  ArrowUpRight, Link2, MoreVertical, PenTool, LayoutGrid, Globe, Scissors, FileImage, Settings2, Lightbulb, RefreshCw, Clock,
  Check, Activity, Bell, AlertTriangle
} from 'lucide-react';

interface FileManagerProps {
  filesTab: 'project' | 'knowledge';
  setFilesTab: (val: 'project' | 'knowledge') => void;
  activeProject: any;
  activeDoc: string | null;
  setActiveDoc: (doc: string | null) => void;
}

export const FileManager: React.FC<FileManagerProps> = ({ 
  filesTab, setFilesTab, activeProject, activeDoc, setActiveDoc 
}) => {
  const [activeContext, setActiveContext] = useState<string>('m1');
   
  const TYPE_CONFIG: Record<string, { icon: React.ElementType, color: string, bg: string }> = {
    web: { icon: Globe, color: 'text-blue-500', bg: 'bg-blue-50' },
    snippet: { icon: Scissors, color: 'text-amber-500', bg: 'bg-amber-50' },
    doc: { icon: FileText, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    image: { icon: FileImage, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  };

  const MOCK_DATA: Record<string, any> = {
    operator: {
      name: '操盘手独立空间',
      desc: '你的个人操作习惯、灵感剪报与全局规则',
      categories: [
        {
          title: '我的灵感与剪报 (随手记)',
          icon: Lightbulb,
          items: [
            { id: 1, title: '2024美妆起号破冰思路', type: 'web', source: '微信公众号', tags: ['起号', '爆款'], date: '今天 10:20', synced: true, autoUpdate: false },
            { id: 2, title: '小红书高点击封面视觉参考', type: 'image', source: '即刻', tags: ['视觉', '封面'], date: '昨天 15:30', synced: true, autoUpdate: true },
            { id: 3, title: '个人IP常用高频违禁词', type: 'doc', source: '本地文档', tags: ['规避', '风控'], date: '3天前', synced: true, autoUpdate: false }
          ]
        },
        {
          title: '个人操作习惯与预设体系',
          icon: Settings2,
          items: [
            { id: 4, title: '我的系统级 Prompt 预设库', type: 'doc', source: '本地配置', tags: ['指令', '大模型'], date: '1周前', synced: true, autoUpdate: false }
          ]
        }
      ]
    },
    m1: {
      name: '奈雪的茶 - 品牌知识库',
      desc: '品牌的专属业务资料、核心资产与限制规则',
      categories: [
        {
          title: '视觉与审核约束 (核心)',
          icon: BookOpen,
          items: [
            { id: 10, title: '品牌VI视觉规范2.0', type: 'image', source: '知识库导入', tags: ['VI', '视觉'], date: '1个月前', synced: true, autoUpdate: false },
            { id: 11, title: '奈雪夏日特别季违规词库', type: 'doc', source: '本地上传', tags: ['防守', '公关'], date: '上周', synced: true, autoUpdate: false }
          ]
        },
        {
          title: '品牌动态与基础资料',
          icon: Database,
          items: [
            { id: 12, title: '2024夏季新品说明书.pdf', type: 'doc', source: '本地文档', tags: ['产品', '规格'], date: '2天前', synced: true, autoUpdate: false },
          ]
        },
        {
          title: '情报采集与竞品监控',
          icon: Activity,
          items: [
             { id: 14, title: '【预警】霸王茶姬同类新品发布', type: 'web', source: '小红书监控', tags: ['竞品', '异动'], date: '10分钟前', synced: true, autoUpdate: true, isAlert: true },
             { id: 15, title: '重点茶饮竞品全网营销动态记录', type: 'web', source: '公众号订阅', tags: ['营销', '竞品'], date: '1小时前', synced: true, autoUpdate: true },
             { id: 16, title: '官方微博/小红书同步源', type: 'web', source: '联网同步', tags: ['动态', '实时'], date: '10分钟前', synced: true, autoUpdate: true }
          ]
        }
      ]
    }
  };

  const currentData = MOCK_DATA[activeContext] || MOCK_DATA['m1'];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#fcfcfc] overflow-hidden">
      {/* Top Header */}
      <div className="h-16 border-b border-neutral-100 flex items-center justify-between px-8 bg-white shrink-0">
        <div className="flex items-center gap-8">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center text-white">
                 <BookOpen size={18} />
              </div>
              <h2 className="text-[15px] font-black tracking-widest text-neutral-900">知识库</h2>
           </div>
           
           <div className="flex bg-neutral-100 p-1 rounded-xl">
              <button 
                onClick={() => setActiveContext('m1')}
                className={`px-5 py-1.5 rounded-lg text-[12px] font-black transition-all ${activeContext === 'm1' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-400 hover:text-neutral-600'}`}
              >
                项目专属知识
              </button>
              <button 
                onClick={() => setActiveContext('operator')}
                className={`px-5 py-1.5 rounded-lg text-[12px] font-black transition-all ${activeContext === 'operator' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-400 hover:text-neutral-600'}`}
              >
                操盘手空间
              </button>
           </div>
        </div>

        <div className="flex items-center gap-3">
           <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-300" />
              <input 
                placeholder="搜索文档、笔记、图片或链接..." 
                className="bg-neutral-50 border border-neutral-200 rounded-xl py-2 pl-9 pr-3 text-[12px] w-[260px] focus:outline-none focus:border-primary-500 transition-all font-medium"
              />
           </div>
           
           <button 
              onClick={() => setActiveDoc('【预警】霸王茶姬同类新品发布')}
              className="relative w-9 h-9 flex items-center justify-center text-neutral-400 hover:text-neutral-900 transition-colors bg-white hover:bg-neutral-50 rounded-xl border border-neutral-200 shadow-sm"
           >
              <Bell size={16} />
              <div className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
           </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Right: Knowledge Cards Grid */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative bg-[#fafafa]">
           {activeDoc ? (
             <div className="flex-1 flex flex-col h-full bg-white relative z-20">
                <div className="h-16 px-8 border-b border-neutral-100 flex items-center justify-between shadow-sm shrink-0">
                   <div className="flex items-center gap-4">
                      <button onClick={() => setActiveDoc(null)} className="w-8 h-8 flex items-center justify-center rounded-xl bg-neutral-100/80 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-900 transition-colors">
                         <X size={16} />
                      </button>
                      <h2 className="text-[16px] font-black tracking-tight text-neutral-900 flex items-center gap-2">
                         {activeDoc.includes('预警') ? <AlertTriangle size={16} className="text-red-500" /> : <BookOpen size={16} className="text-primary-500" />}
                         {activeDoc}
                      </h2>
                      {activeDoc.includes('预警') ? (
                         <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded text-[10px] font-black uppercase tracking-widest border border-red-100 flex items-center gap-1">异动分析</span>
                      ) : (
                         <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[10px] font-black uppercase tracking-widest border border-emerald-100 flex items-center gap-1">已向量化</span>
                      )}
                   </div>
                   <div className="flex gap-2">
                       <button className="px-5 py-2 bg-neutral-900 text-white rounded-xl text-[12px] font-black shadow-lg hover:bg-primary-500 transition-all flex items-center gap-2">
                          <Database size={14}/> 确认并应用到项目
                       </button>
                   </div>
                </div>
                <div className="flex-1 p-8 overflow-y-auto">
                   <div className="max-w-4xl mx-auto h-full flex flex-col pt-4">
                      {activeDoc.includes('预警') ? (
                         <div className="space-y-6">
                            <div className="flex items-start gap-4 p-5 bg-red-50 border border-red-100 rounded-2xl">
                               <AlertTriangle size={20} className="text-red-500 shrink-0 mt-0.5" />
                               <div>
                                  <h3 className="text-[14px] font-black text-red-900 mb-1">竞品新品视觉异动</h3>
                                  <p className="text-[13px] text-red-800/80 font-medium">系统监控到「霸王茶姬」于今日上午在小红书发布了秋季新品「觉醒伯牙」。分析表明，其视觉主色调和产品概念与我们正在筹划的秋季项目存在 75% 的人群重合度。</p>
                               </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                               <div className="border border-neutral-200 rounded-xl overflow-hidden bg-neutral-50 relative group">
                                  <div className="p-3 border-b border-neutral-200 bg-white flex justify-between items-center">
                                     <span className="text-[12px] font-bold text-neutral-500">源采集图像片段</span>
                                     <span className="text-[10px] font-black text-neutral-300 uppercase tracking-widest">Image Source</span>
                                  </div>
                                  <div className="h-[240px] bg-neutral-200 flex items-center justify-center text-neutral-400">
                                     <ImageIcon size={32} />
                                  </div>
                               </div>
                               
                               <div className="border border-neutral-200 rounded-xl overflow-hidden bg-white relative">
                                  <div className="p-3 border-b border-neutral-200 bg-neutral-50 flex justify-between items-center">
                                     <span className="text-[12px] font-bold text-primary-600 flex items-center gap-1.5"><Brain size={14} /> AI 结构化对比分析</span>
                                  </div>
                                  <div className="p-5 text-[13px] leading-relaxed text-neutral-700 font-medium space-y-4">
                                     <div>
                                        <div className="font-black text-neutral-900 mb-1">设计元素比对：</div>
                                        <p>竞品大量使用了低保真复古滤镜及中式印章元素。建议我们在应对策略中，强化自身的“现代自然”属性，以冷色调或清新亮色进行区隔排他。</p>
                                     </div>
                                     <div>
                                        <div className="font-black text-neutral-900 mb-1">模型建议动作：</div>
                                        <p>已自动生成 3 条秋季新品的规避指引，是否立刻一键合并至项目规则？</p>
                                     </div>
                                  </div>
                               </div>
                            </div>
                         </div>
                      ) : (
                         <div className="flex-1 bg-white border border-neutral-200 rounded-2xl p-8 shadow-sm flex flex-col focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500 transition-all">
                            <textarea 
                               defaultValue={`# ${activeDoc}\n\n当前包含以下核心规则：\n\n- 品牌心智与基调： 高端、自然、无添加。内容口吻应保持克制与专业。\n- 视觉设计规范： 主视觉以低饱和度自然色为主，严禁用高饱和度霓虹色。\n- 风控与安全过滤： 严禁使用“全网第一”、“最极致”、“平替”等极限词汇。\n\n你可以直接在这里修改或补充内容，下次大模型生成内容时将自动应用最新的约束配置。`} 
                               className="w-full h-[500px] text-[14px] leading-loose focus:outline-none resize-none font-medium text-neutral-700 bg-transparent"
                            />
                         </div>
                      )}
                   </div>
                </div>
             </div>
           ) : (
             <div className="max-w-6xl mx-auto space-y-10 p-10">
                <div className="flex items-end justify-between border-b border-neutral-100 pb-8">
                   <div>
                      <h1 className="text-3xl font-black text-neutral-900 tracking-tight mb-2">{currentData.name}</h1>
                      <p className="text-neutral-500 font-bold">{currentData.desc}</p>
                   </div>
                </div>

                {/* Smart Upload Input */}
                <div className="bg-white border-2 border-dashed border-neutral-200 rounded-3xl p-6 hover:border-primary-400 transition-all group flex flex-col items-center justify-center relative overflow-hidden focus-within:border-primary-500 focus-within:ring-4 focus-within:ring-primary-50 shadow-sm">
                   <div className="w-full flex items-center gap-4 bg-neutral-50 p-2 pl-6 rounded-2xl border border-neutral-100 relative z-10 box-border">
                      <Brain size={22} className="text-primary-500 shrink-0" />
                      <input placeholder="输入网址、文本片段，或拖拽文件到这里，AI将自动归类到相应分组..." className="flex-1 bg-transparent text-[13px] font-bold focus:outline-none text-neutral-800 placeholder:text-neutral-400" />
                      <button className="h-11 px-6 bg-neutral-900 text-white rounded-xl text-[12px] font-black shrink-0 hover:bg-primary-500 transition-colors shadow-md flex items-center gap-2">
                         <Plus size={16} /> AI 一键收录
                      </button>
                   </div>
                   <p className="text-[11px] font-bold text-neutral-400 mt-4 relative z-10 flex text-center items-center gap-2">
                      <span className="w-2 h-2 rounded-full border border-neutral-400 bg-transparent flex items-center justify-center"><Check size={6} className="text-neutral-400" /></span> 支持智能解析与多模态：文档 / 图片 / 网页链接 / 纯文本
                   </p>
                </div>

                {currentData.categories.map((cat: any, idx: number) => (
                  <div key={idx} className="space-y-4">
                     <h2 className="text-[14px] font-black text-neutral-900 flex items-center gap-2">
                        <cat.icon className="text-primary-500" size={18} />
                        {cat.title}
                     </h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                       {cat.items.map((item: any) => {
                         const CardIcon = TYPE_CONFIG[item.type].icon;
                         return (
                           <div 
                              key={item.id} 
                              onClick={() => setActiveDoc(item.title)}
                              className={`group cursor-pointer bg-white border ${item.isAlert ? 'border-red-200 shadow-[0_0_15px_rgba(239,68,68,0.1)] hover:border-red-400' : 'border-neutral-200/80 hover:border-primary-400'} rounded-[20px] p-4 hover:shadow-xl hover:-translate-y-0.5 transition-all flex flex-col h-[130px] relative overflow-hidden`}
                           >
                              {item.autoUpdate && !item.isAlert && (
                                <div className="absolute top-4 right-4 text-[10px] text-blue-600 flex items-center gap-1.5 bg-blue-50/80 px-2 py-0.5 rounded-md font-black border border-blue-100/50">
                                  <RefreshCw size={10} className="animate-spin-slow" /> 联网订阅
                                </div>
                              )}
                              {item.isAlert && (
                                <div className="absolute top-4 right-4 text-[10px] text-red-600 flex items-center gap-1.5 bg-red-50 px-2 py-0.5 rounded-md font-black border border-red-200">
                                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" /> 异动预警
                                </div>
                              )}
                              <div className="flex items-start gap-4">
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${TYPE_CONFIG[item.type].bg} ${TYPE_CONFIG[item.type].color} shadow-sm border border-white`}>
                                      <CardIcon size={18} />
                                  </div>
                                  <div className="flex-1 min-w-0 pr-16">
                                     <h4 className="text-[14px] font-black text-neutral-900 truncate group-hover:text-primary-600 transition-colors">{item.title}</h4>
                                     <div className="flex items-center gap-2 mt-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        <p className="text-[11px] text-neutral-400 font-bold truncate">来源: {item.source}</p>
                                     </div>
                                  </div>
                              </div>
                              <div className="flex items-end justify-between mt-auto">
                                  <div className="flex flex-wrap gap-1.5">
                                     {item.tags.map((t: string) => (
                                        <span key={t} className="text-[10px] bg-neutral-100/80 text-neutral-500 px-2 py-0.5 rounded-md uppercase font-black tracking-tight group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">#{t}</span>
                                     ))}
                                  </div>
                                  <div className="text-[10px] font-bold text-neutral-300 flex items-center gap-1">
                                     <Clock size={10} /> {item.date}
                                  </div>
                              </div>
                           </div>
                         );
                       })}
                     </div>
                  </div>
                ))}

                <div className="border-2 border-dashed border-neutral-200 rounded-[24px] p-8 mt-8 flex flex-col items-center justify-center hover:border-primary-400 hover:bg-primary-50/50 transition-all cursor-pointer text-neutral-400 hover:text-primary-600 group">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-neutral-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform relative">
                     <Plus size={24} className="text-primary-500 relative z-10" />
                     <div className="absolute inset-0 bg-primary-100/50 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h3 className="text-[14px] font-black mb-1 text-neutral-900 group-hover:text-primary-700">添加卡片式文件夹</h3>
                  <p className="text-[11px] font-bold">由 AI 基于主题和模态自动维护的新分类集</p>
                </div>

             </div>
           )}
        </div>
      </div>
    </div>
  );
};

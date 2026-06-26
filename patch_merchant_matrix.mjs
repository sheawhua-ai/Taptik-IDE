
import fs from 'fs';
fs.writeFileSync('src/pages/MerchantMatrix.tsx', `import React, { useState } from 'react';
import { 
  PlusCircle, Target, Check, ArrowRight, Camera, 
  Image as ImageIcon, Sparkles, X, LayoutGrid, ArrowLeft, Wand2,
  AlertTriangle, CheckCircle2, ChevronRight, MessageSquare, Play,
  ListTodo
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const MOCK_PROJECTS = [
  {
    id: "p1",
    name: "幼犬换粮避坑 7 天搜索卡位",
    goal: "搜索卡位 + 自然流起量",
    directions: "避坑 / 挑食 / 软便 / 专业科普",
    structure: "素人 8 / 专业 4",
    sources: "素材库 4 / 外部实拍 3 / 内部补拍 2",
    paths: "A01 测试号 / A02 避坑号 / A05 专业号 / 外部领取",
    status: "3 可发｜4 缺素材｜2 待回传｜1 需重写",
    aiNote: "2 篇有潜力但封面弱，建议先补封面再发。",
  },
  {
    id: "p2",
    name: "成犬肠胃调理周期种草",
    goal: "场景种草 + 痛点转化",
    directions: "呕吐 / 软便 / 泪痕",
    structure: "素人 10 / 专业 2",
    sources: "素材库 8 / 外部实拍 4",
    paths: "多账号分发",
    status: "5 可发｜2 缺素材｜5 待回传",
    aiNote: "存在 2 篇口吻偏官方，建议让 AI 软化改写。",
  }
];

const FORMS = ["素人口吻", "专业号", "外部体验", "短视频"];
const DIRECTIONS = ["幼犬换粮避坑", "肠胃敏感", "挑食误区", "专业科普"];

const MOCK_MATRIX = [
  [ // 素人口吻
    [{ id: "pack1", title: "幼犬挑食其实是你的锅", format: "图文", material: "缺封面", path: "A01", status: "待补素材", collab: "", aiFlag: "素材阻塞", quality: "优" }],
    [{ id: "pack2", title: "软便换粮指南", format: "图文", material: "素材已齐", path: "A05", status: "待审核", collab: "等客户审核", aiFlag: "口吻风险", quality: "良" }],
    [],
    [{ id: "pack3", title: "不吃狗粮怎么办", format: "图文", material: "素材已齐", path: "A02", status: "发布就绪", collab: "", aiFlag: "发布就绪", quality: "优" }]
  ],
  [ // 专业号
    [{ id: "pack4", title: "幼犬肠胃发育期科普", format: "图文", material: "素材已齐", path: "A05", status: "可发", collab: "", aiFlag: "建议转视频", quality: "良" }],
    [],
    [{ id: "pack5", title: "挑食的生理性原因", format: "图文", material: "缺内页", path: "A05", status: "待回传", collab: "等李店长回传", aiFlag: "素材阻塞", quality: "中" }],
    []
  ],
  [ // 外部体验
    [],
    [{ id: "pack6", title: "亲测软便改善记录", format: "图文", material: "待回传", path: "外部", status: "执行中", collab: "等外部 KOC 上传", aiFlag: "待外部回传", quality: "待定" }],
    [],
    []
  ],
  [ // 短视频
    [{ id: "pack7", title: "换粮翻车经历", format: "短视频", material: "实拍已交", path: "A01", status: "待验收", collab: "素材已回传待验收", aiFlag: "值得人看", quality: "良" }],
    [],
    [],
    [{ id: "pack8", title: "医生教你选狗粮", format: "短视频", material: "素材已齐", path: "A05", status: "发布就绪", collab: "", aiFlag: "可自动推进", quality: "良" }]
  ]
];

export default function MerchantMatrix() {
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [activeDrawer, setActiveDrawer] = useState<'ai_focus' | 'single_pack' | null>(null);
  const [activePack, setActivePack] = useState<any>(null);
  const [showFullPicture, setShowFullPicture] = useState(false);

  const getAiFlagColor = (flag: string) => {
    switch (flag) {
      case "素材阻塞": return "border-amber-400 bg-amber-50 text-amber-600";
      case "口吻风险": return "border-rose-400 bg-rose-50 text-rose-600";
      case "发布就绪": return "border-emerald-400 bg-emerald-50 text-emerald-600";
      case "建议转视频": return "border-indigo-400 bg-indigo-50 text-indigo-600";
      case "待外部回传": return "border-blue-400 bg-blue-50 text-blue-600";
      case "值得人看": return "border-purple-400 bg-purple-50 text-purple-600";
      case "可自动推进": return "border-emerald-400 bg-emerald-50 text-emerald-600";
      default: return "border-neutral-200 bg-white text-neutral-600";
    }
  };

  const handleOpenPack = (pack: any) => {
    setActivePack(pack);
    setActiveDrawer('single_pack');
  };

  if (!activeProject) {
    return (
      <div className="flex flex-col h-full bg-neutral-50/50 w-full relative">
        <div className="h-20 border-b border-neutral-100 px-8 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-neutral-900 text-white rounded-2xl flex items-center justify-center shadow-lg">
              <LayoutGrid size={24} />
            </div>
            <div>
              <h2 className="text-[17px] font-semibold text-neutral-900">项目概览</h2>
              <p className="text-[11px] text-neutral-400 mt-0.5">多项目并行，关注核心变量</p>
            </div>
          </div>
          <button className="px-5 py-2.5 bg-neutral-900 text-white rounded-[14px] text-[13px] font-medium flex items-center gap-2 hover:bg-neutral-800 shadow-md">
            <PlusCircle size={16} /> 新建内容战役
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-6xl mx-auto space-y-6">
            {MOCK_PROJECTS.map(proj => (
              <div key={proj.id} className="bg-white border border-neutral-200 rounded-[24px] overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col md:flex-row">
                <div className="flex-1 p-6 border-b md:border-b-0 md:border-r border-neutral-100 space-y-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-[18px] font-bold text-neutral-900">{proj.name}</h3>
                      <p className="text-[13px] text-neutral-500 mt-1">{proj.goal}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6">
                    <div className="space-y-1">
                      <div className="text-[11px] text-neutral-400">内容方向</div>
                      <div className="text-[13px] text-neutral-800 font-medium">{proj.directions}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[11px] text-neutral-400">内容结构</div>
                      <div className="text-[13px] text-neutral-800 font-medium">{proj.structure}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[11px] text-neutral-400">素材来源</div>
                      <div className="text-[13px] text-neutral-800 font-medium">{proj.sources}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[11px] text-neutral-400">账号路径</div>
                      <div className="text-[13px] text-neutral-800 font-medium">{proj.paths}</div>
                    </div>
                    <div className="space-y-1 col-span-2">
                      <div className="text-[11px] text-neutral-400">当前状态</div>
                      <div className="text-[13px] text-neutral-800 font-medium">{proj.status}</div>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-[320px] bg-primary-50/50 p-6 flex flex-col justify-between shrink-0">
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-1.5 text-primary-600 font-semibold text-[13px]">
                      <Sparkles size={16} /> AI 重点
                    </div>
                    <p className="text-[13px] text-primary-800 leading-relaxed">
                      {proj.aiNote}
                    </p>
                  </div>
                  <button onClick={() => setActiveProject(proj.id)} className="w-full py-3 bg-primary-600 text-white rounded-xl text-[14px] font-medium hover:bg-primary-700 transition-colors shadow-md flex items-center justify-center gap-2">
                    进入战役 <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-neutral-50 w-full relative overflow-hidden">
      {/* Top Banner & Header */}
      <div className="bg-white shrink-0 shadow-sm z-20">
        <div className="h-16 px-6 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setActiveProject(null)} className="p-2 hover:bg-neutral-100 rounded-full text-neutral-500">
              <ArrowLeft size={18} />
            </button>
            <h2 className="text-[16px] font-bold text-neutral-900">内容矩阵视图</h2>
            <span className="text-[12px] text-neutral-400 px-2 py-0.5 bg-neutral-100 rounded">幼犬换粮避坑 7 天搜索卡位</span>
          </div>
          <button onClick={() => setShowFullPicture(true)} className="text-[13px] text-neutral-600 hover:text-neutral-900 flex items-center gap-1 font-medium bg-neutral-100 px-3 py-1.5 rounded-lg">
            <ListTodo size={16} /> 查看全貌
          </button>
        </div>

        <div className="bg-amber-50 border-b border-amber-100 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[13px] text-amber-800">
            <Sparkles size={16} className="text-amber-500" /> 
            <strong>AI 已标出 5 个需要关注的内容包：</strong>2 个封面弱，2 个待回传，1 个口吻偏官方。
          </div>
          <button onClick={() => setActiveDrawer('ai_focus')} className="px-4 py-2 bg-amber-500 text-white rounded-lg text-[12px] font-bold shadow-sm hover:bg-amber-600 transition-colors flex items-center gap-1.5">
            处理 AI 标重点 <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Main Content: The Matrix */}
      <div className="flex-1 overflow-auto p-8 custom-scrollbar">
        <div className="min-w-max mx-auto space-y-6 pb-20">
          
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
            {/* Header Row */}
            <div className="flex border-b border-neutral-100 bg-neutral-50">
              <div className="w-[120px] shrink-0 border-r border-neutral-100 p-4 flex items-center justify-center font-medium text-neutral-500 text-[13px]">
                内容形态 ＼ 方向
              </div>
              {DIRECTIONS.map(dir => (
                <div key={dir} className="flex-1 w-[260px] p-4 text-center font-bold text-neutral-800 text-[14px]">
                  {dir}
                </div>
              ))}
            </div>

            {/* Matrix Body */}
            {FORMS.map((form, rIdx) => (
              <div key={form} className="flex border-b border-neutral-100 last:border-0">
                <div className="w-[120px] shrink-0 border-r border-neutral-100 p-4 flex items-center justify-center font-bold text-neutral-700 text-[13px] bg-neutral-50/50">
                  {form}
                </div>
                {MOCK_MATRIX[rIdx].map((packs, cIdx) => (
                  <div key={cIdx} className="flex-1 w-[260px] p-3 border-r border-neutral-100 last:border-0 bg-neutral-50/20">
                    <div className="space-y-3 flex flex-col h-full">
                      {packs.length === 0 ? (
                        <div className="h-24 border-2 border-dashed border-neutral-200 rounded-xl flex items-center justify-center text-neutral-400 hover:border-neutral-300 hover:bg-neutral-50 cursor-pointer transition-colors">
                          <Plus size={20} />
                        </div>
                      ) : (
                        packs.map((pack: any) => (
                          <div 
                            key={pack.id} 
                            onClick={() => handleOpenPack(pack)}
                            className={\`bg-white rounded-xl p-3 cursor-pointer transition-all shadow-sm hover:shadow-md \${pack.aiFlag ? \`border-2 \${getAiFlagColor(pack.aiFlag).split(' ')[0]}\` : 'border border-neutral-200'}\`}
                          >
                            <h4 className="text-[13px] font-bold text-neutral-900 mb-2 leading-snug">{pack.title}</h4>
                            <div className="flex flex-wrap gap-1.5 mb-2">
                              <span className="text-[10px] bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded">{pack.format}</span>
                              <span className="text-[10px] bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded">{pack.material}</span>
                              <span className="text-[10px] bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded">{pack.path}</span>
                              <span className={\`text-[10px] px-1.5 py-0.5 rounded border \${
                                pack.status.includes('就绪') ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                pack.status.includes('缺') || pack.status.includes('待补') ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                'bg-blue-50 text-blue-600 border-blue-100'
                              }\`}>{pack.status}</span>
                            </div>
                            {pack.collab && (
                              <div className="text-[10px] text-blue-600 flex items-center gap-1 mt-1 bg-blue-50/50 p-1 rounded">
                                <MessageSquare size={10} /> {pack.collab}
                              </div>
                            )}
                            {pack.aiFlag && (
                              <div className={\`mt-2 text-[10px] font-bold px-2 py-1 rounded \${getAiFlagColor(pack.aiFlag)}\`}>
                                {pack.aiFlag}
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Dynamic Main Action Footer */}
      <div className="h-20 bg-white border-t border-neutral-200 shrink-0 px-8 flex items-center justify-between z-20">
        <div>
          <div className="text-[12px] text-neutral-500 mb-0.5 flex items-center gap-2">
            将处理：<span className="text-amber-600">2 篇口吻问题</span> <ArrowRight size={12}/> 
            <span className="text-blue-600">2 个素材缺口</span> <ArrowRight size={12}/> 
            <span className="text-emerald-600">3 个发布就绪内容</span>
          </div>
          <div className="text-[14px] font-medium text-neutral-900">当前主动作：处理 AI 标重点</div>
        </div>
        <button onClick={() => setActiveDrawer('ai_focus')} className="px-6 py-3 bg-neutral-900 text-white rounded-xl text-[14px] font-medium shadow-lg hover:bg-neutral-800 transition-colors">
          处理 AI 标重点
        </button>
      </div>

      {/* Right Drawer */}
      <AnimatePresence>
        {activeDrawer && (
          <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setActiveDrawer(null)}>
            <div className="absolute inset-0 bg-neutral-900/20 backdrop-blur-sm" />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-1/2 bg-white h-full shadow-2xl flex flex-col relative z-10"
              onClick={(e) => e.stopPropagation()}
            >
              {activeDrawer === 'ai_focus' && (
                <>
                  <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between bg-amber-50/50">
                    <div>
                      <h3 className="font-bold text-neutral-900 text-[16px] flex items-center gap-2">
                        <Sparkles size={18} className="text-amber-500" /> AI 重点处理
                      </h3>
                      <p className="text-[12px] text-neutral-500 mt-1">2 篇封面弱，建议先补素材</p>
                    </div>
                    <button onClick={() => setActiveDrawer(null)} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
                      <X size={18} className="text-neutral-500" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="bg-white border border-neutral-200 rounded-xl p-4 space-y-4 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-16 bg-neutral-100 rounded flex items-center justify-center shrink-0">
                          <ImageIcon size={20} className="text-neutral-400" />
                        </div>
                        <div>
                          <h4 className="font-bold text-[14px] text-neutral-900">幼犬挑食其实是你的锅</h4>
                          <p className="text-[12px] text-neutral-500 mt-0.5">图文｜A01</p>
                        </div>
                      </div>
                      <div className="bg-amber-50 p-3 rounded-lg text-[12px] text-amber-800 border border-amber-100">
                        <strong>AI 判断依据：</strong> 封面首图缺乏视觉吸引力，且文案情绪较强，可能导致点击率偏低。
                      </div>
                      <div className="bg-emerald-50 p-3 rounded-lg text-[12px] text-emerald-800 border border-emerald-100">
                        <strong>推荐处理方案：</strong> 从素材库补充 1 张高对比度“狗狗挑食”实拍图作为封面。
                      </div>
                      <div className="text-[11px] text-neutral-400">执行后影响：将解除“素材阻塞”状态，推入待发布池。</div>
                      
                      <div className="flex flex-col gap-2 pt-2 border-t border-neutral-100">
                        <button className="w-full py-2.5 bg-neutral-900 text-white text-[13px] font-medium rounded-lg hover:bg-neutral-800 transition-colors">
                          按建议处理 (去挑选素材)
                        </button>
                        <button className="w-full py-2 bg-white border border-neutral-200 text-neutral-700 text-[12px] rounded-lg hover:bg-neutral-50 transition-colors">
                          换处理方式：提交内部补拍任务
                        </button>
                      </div>
                      <div className="relative mt-2">
                        <input type="text" placeholder="或告诉 AI 你的偏好..." className="w-full bg-neutral-50 border border-neutral-200 rounded-lg pl-3 pr-8 py-2 text-[12px] outline-none focus:border-amber-400" />
                        <button className="absolute right-2 top-2 text-neutral-400 hover:text-amber-500">
                          <Send size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeDrawer === 'single_pack' && activePack && (
                <>
                  <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-neutral-900 text-[16px]">{activePack.title}</h3>
                      <p className="text-[12px] text-neutral-500 mt-1">内容包详情与状态干预</p>
                    </div>
                    <button onClick={() => setActiveDrawer(null)} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
                      <X size={18} className="text-neutral-500" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100 space-y-1">
                        <div className="text-[11px] text-neutral-400">文案质量</div>
                        <div className="text-[14px] font-medium text-neutral-900">{activePack.quality}</div>
                      </div>
                      <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100 space-y-1">
                        <div className="text-[11px] text-neutral-400">素材状态</div>
                        <div className="text-[14px] font-medium text-neutral-900">{activePack.material}</div>
                      </div>
                      <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100 space-y-1">
                        <div className="text-[11px] text-neutral-400">账号路径</div>
                        <div className="text-[14px] font-medium text-neutral-900">{activePack.path}</div>
                      </div>
                      <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100 space-y-1">
                        <div className="text-[11px] text-neutral-400">协同任务</div>
                        <div className="text-[13px] font-medium text-blue-600">{activePack.collab || '无'}</div>
                      </div>
                    </div>

                    <div className="bg-white border border-neutral-200 p-4 rounded-xl shadow-sm">
                      <h4 className="text-[13px] font-bold text-neutral-900 mb-3">小红书预览</h4>
                      <div className="aspect-[3/4] bg-neutral-100 rounded-lg flex items-center justify-center text-neutral-400 mb-3 relative overflow-hidden">
                        {activePack.format === '图文' ? <ImageIcon size={32} /> : <Play size={32} />}
                      </div>
                      <p className="text-[12px] text-neutral-600 line-clamp-3">这里是笔记的文案预览内容，包含了主要的关键词和痛点描述，引导用户产生共鸣...</p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-[13px] font-bold text-neutral-900">最近流转记录</h4>
                      <div className="text-[11px] text-neutral-500 space-y-1.5 pl-2 border-l-2 border-neutral-100">
                        <div>10:30 AI 完成文案起草</div>
                        <div>11:05 分配至账号 A01</div>
                        {activePack.collab && <div className="text-blue-500">11:10 触发协同：{activePack.collab}</div>}
                      </div>
                    </div>

                  </div>
                  <div className="p-4 border-t border-neutral-100 bg-white grid grid-cols-2 gap-2 shrink-0">
                    {activePack.collab ? (
                      <>
                        <button className="col-span-2 py-2 bg-blue-50 text-blue-600 text-[12px] font-medium rounded-lg hover:bg-blue-100 border border-blue-100">
                          协同操作：催办 / 改派 / 查看提交
                        </button>
                        <button className="py-2.5 bg-neutral-900 text-white text-[13px] font-medium rounded-lg hover:bg-neutral-800">要求重拍</button>
                        <button className="py-2.5 bg-white border border-neutral-200 text-neutral-700 text-[13px] font-medium rounded-lg hover:bg-neutral-50">采用回传素材</button>
                      </>
                    ) : (
                      <>
                        <button className="py-2 bg-neutral-100 text-neutral-700 text-[12px] font-medium rounded-lg hover:bg-neutral-200">让 AI 轻改</button>
                        <button className="py-2 bg-neutral-100 text-neutral-700 text-[12px] font-medium rounded-lg hover:bg-neutral-200">补素材</button>
                        <button className="py-2 bg-neutral-100 text-neutral-700 text-[12px] font-medium rounded-lg hover:bg-neutral-200">派发任务</button>
                        <button className="py-2 bg-neutral-100 text-neutral-700 text-[12px] font-medium rounded-lg hover:bg-neutral-200">进入审核</button>
                        <button className="col-span-2 py-2.5 bg-neutral-900 text-white text-[13px] font-medium rounded-lg hover:bg-neutral-800 mt-1 shadow-sm">
                          推入发布池
                        </button>
                      </>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Full Picture Modal */}
      <AnimatePresence>
        {showFullPicture && (
          <div className="fixed inset-0 z-[60] bg-neutral-900/40 backdrop-blur-sm flex justify-center items-center p-8" onClick={() => setShowFullPicture(false)}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[24px] shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 border-b border-neutral-100 flex justify-between items-center bg-neutral-50">
                <h3 className="text-[18px] font-bold text-neutral-900 flex items-center gap-2">
                  <ListTodo size={20} className="text-neutral-500" /> 项目全链路全貌
                </h3>
                <button onClick={() => setShowFullPicture(false)} className="p-2 hover:bg-neutral-200 rounded-full text-neutral-500 transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-8 overflow-x-auto">
                <div className="flex items-center gap-2 min-w-max">
                  {['策略确认', '文案生成', '素材补齐', '内容审核', '协同回传', '发布就绪', '排期发布', '数据回收'].map((step, i, arr) => (
                    <React.Fragment key={step}>
                      <div className="w-[120px] bg-white border border-neutral-200 rounded-xl p-4 shadow-sm flex flex-col items-center text-center">
                        <div className="text-[13px] font-bold text-neutral-800 mb-2">{step}</div>
                        <div className="text-[20px] font-semibold text-neutral-900">{Math.floor(Math.random() * 20) + 1}</div>
                        {i === 2 || i === 4 ? <div className="text-[10px] text-red-500 mt-1 bg-red-50 px-1.5 py-0.5 rounded">异常 2</div> : <div className="text-[10px] text-transparent mt-1">-</div>}
                      </div>
                      {i < arr.length - 1 && <ArrowRight size={16} className="text-neutral-300" />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
`);

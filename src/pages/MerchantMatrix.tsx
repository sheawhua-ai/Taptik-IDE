import React, { useState } from 'react';
import { 
  PlusCircle, Target, Check, ArrowRight, Camera, Plus, Send,
  Image as ImageIcon, Sparkles, X, LayoutGrid, ArrowLeft, Wand2,
  AlertTriangle, CheckCircle2, ChevronRight, MessageSquare, Play,
  ListTodo, ChevronDown, ChevronUp, Layers, Activity, FileText, CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const MOCK_PROJECTS = [
  {
    id: "p1",
    name: "幼犬换粮避坑长期战役",
    goal: "搜索卡位 + 自然流起量",
    currentDirection: "避坑 / 挑食 / 软便 / 专业科普",
    totalPacks: 156,
    weeklyAdded: 24,
    status: { ready: 12, pendingMaterial: 8, pendingReturn: 4 },
    bestDirection: "挑食误区",
    nextStep: "推荐下一步：补 2 篇封面 -> 审 3 篇内容 -> 推 3 篇进发布池",
    batches: [
      { id: "b2", name: "第 2 批｜低粉爆款复刻", count: 24, ready: 8, pendingMaterial: 6, pendingReturn: 3, revision: 2, goal: "低粉爆款复刻", structure: "素人 16 / 专业 8", materialGap: "缺真实喂食视频", progress: "30%", dataPerformance: "CPA 降低 20%", aiReview: "素人口吻表现优异，建议加大投放" },
      { id: "b1", name: "第 1 批｜搜索卡位测试", count: 12, ready: 12, pendingMaterial: 0, pendingReturn: 0, revision: 0, goal: "搜索卡位", structure: "素人 8 / 专业 4", materialGap: "无", progress: "100%", dataPerformance: "收录率 90%", aiReview: "已完成初步卡位" }
    ]
  },
  {
    id: "p2",
    name: "成犬肠胃调理周期种草",
    goal: "场景种草 + 痛点转化",
    currentDirection: "呕吐 / 软便 / 泪痕",
    totalPacks: 45,
    weeklyAdded: 0,
    status: { ready: 15, pendingMaterial: 2, pendingReturn: 5 },
    bestDirection: "软便场景",
    nextStep: "推荐下一步：催办 5 个待回传 -> 推 15 篇进发布池",
    batches: [
      { id: "b3", name: "第 1 批｜场景种草", count: 45, ready: 15, pendingMaterial: 2, pendingReturn: 5, revision: 1, goal: "场景种草", structure: "素人 30 / 专业 15", materialGap: "缺泪痕对比图", progress: "60%", dataPerformance: "互动率 3.5%", aiReview: "整体平稳，泪痕方向转化较高" }
    ]
  }
];

const FORMS = ["素人口吻", "专业号", "外部体验", "短视频"];
const DIRECTIONS = ["幼犬换粮避坑", "肠胃敏感", "挑食误区", "专业科普"];

const MOCK_MATRIX = [
  [
    { id: "g1", title: "幼犬换粮避坑", total: 18, published: 6, pendingMaterial: 4, hotPotential: 2, needsRevision: 1, aiFlags: ["封面弱", "值得人看"] },
    { id: "g2", title: "肠胃敏感", total: 12, published: 8, pendingMaterial: 0, hotPotential: 1, needsRevision: 2, aiFlags: ["口吻风险"] },
    { id: "g3", title: "挑食误区", total: 24, published: 10, pendingMaterial: 2, hotPotential: 5, needsRevision: 0, aiFlags: ["可自动推进"] },
    null
  ],
  [
    { id: "g4", title: "幼犬换粮避坑", total: 8, published: 4, pendingMaterial: 0, hotPotential: 0, needsRevision: 0, aiFlags: ["可自动推进"] },
    null,
    { id: "g5", title: "挑食误区", total: 6, published: 2, pendingMaterial: 3, hotPotential: 1, needsRevision: 0, aiFlags: ["口吻风险"] },
    null
  ],
  [
    null,
    { id: "g6", title: "肠胃敏感", total: 30, published: 15, pendingMaterial: 0, pendingReturn: 8, hotPotential: 3, needsRevision: 0, aiFlags: ["待外部回传"] },
    null,
    null
  ],
  [
    { id: "g7", title: "幼犬换粮避坑", total: 10, published: 2, pendingMaterial: 5, hotPotential: 0, needsRevision: 1, aiFlags: ["封面弱"] },
    null,
    null,
    { id: "g8", title: "专业科普", total: 5, published: 5, pendingMaterial: 0, hotPotential: 2, needsRevision: 0, aiFlags: ["可自动推进"] }
  ]
];

const MOCK_AI_FOCUS_QUEUE = [
  { id: 1, packName: "幼犬挑食其实是你的锅", packId: "pack1", reason: "封面弱", detail: "封面首图缺乏视觉吸引力，且文案情绪较强，可能导致点击率偏低。", action: "从素材库补充 1 张高对比度“狗狗挑食”实拍图作为封面。", flow: "解除卡点状态，推入可排期池", format: "图文", path: "A01" },
  { id: 2, packName: "换粮翻车经历", packId: "pack7", reason: "封面弱", detail: "视频前 3 秒画面较暗，且标题字号偏小，难以吸引停留。", action: "建议让 AI 重绘一张带醒目大字报的封面。", flow: "解除卡点状态，推入可排期池", format: "短视频", path: "A01" },
  { id: 3, packName: "软便换粮指南", packId: "pack2", reason: "口吻风险", detail: "用词过于专业严谨，缺乏真实养宠人的情绪共鸣。", action: "让 AI 一键软化改写，增加口语化表达和真实吐槽。", flow: "生成新文案，进入待审核队列", format: "图文", path: "A05" },
  { id: 4, packName: "亲测软便改善记录", packId: "pack6", reason: "待外部回传", detail: "外部达人已超过约定回传时间 2 天，可能影响排期。", action: "发送一键催办提醒至达人微信/后台。", flow: "更新回传状态，等待素材", format: "图文", path: "外部领取" }
];

const MOCK_SINGLE_PACK = {
  id: "pack1",
  title: "幼犬挑食其实是你的锅",
  quality: "优",
  material: "缺封面",
  path: "A01",
  collab: "",
  format: "图文",
  currentJudgment: "素材缺失，封面不抓人。建议先补充高对比度实拍图再排期。",
  history: [
    "10:30 AI 完成文案起草",
    "11:05 分配至账号 A01"
  ]
};

const STAGES = ['策略确认', '文案生成', '素材补齐', '内容审核', '回传素材', '可排期', '排期发布', '数据回收'];
const STAGE_DATA = [
  { name: '策略确认', completed: 156, block: 0, error: 0 },
  { name: '文案生成', completed: 140, block: 0, error: 0 },
  { name: '素材补齐', completed: 120, block: 8, error: 2 },
  { name: '内容审核', completed: 110, block: 0, error: 0 },
  { name: '回传素材', completed: 80, block: 4, error: 0 },
  { name: '可排期', completed: 76, block: 0, error: 0 },
  { name: '排期发布', completed: 50, block: 0, error: 0 },
  { name: '数据回收', completed: 30, block: 0, error: 0 }
];

export default function MerchantMatrix() {
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const [activeDrawer, setActiveDrawer] = useState<'ai_focus' | 'group_detail' | 'pack_detail' | 'add_batch' | null>(null);
  const [activePack, setActivePack] = useState<any>(null);
  const [showFullPicture, setShowFullPicture] = useState(false);
  const [focusIndex, setFocusIndex] = useState(0);

  const getAiFlagColor = (flag: string) => {
    switch (flag) {
      case "口吻风险": return "bg-rose-500 text-white shadow-[0_0_10px_rgba(244,63,94,0.3)]";
      case "封面弱": return "bg-amber-500 text-white shadow-[0_0_10px_rgba(245,158,11,0.3)]";
      case "待外部回传": return "bg-indigo-500 text-white shadow-[0_0_10px_rgba(99,102,241,0.3)]";
      case "可自动推进": return "bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.3)]";
      case "值得人看": return "bg-purple-500 text-white shadow-[0_0_10px_rgba(168,85,247,0.3)]";
      default: return "bg-neutral-800 text-white";
    }
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
              <h2 className="text-[17px] font-semibold text-neutral-900">战役总览</h2>
              <p className="text-[11px] text-neutral-400 mt-0.5">多内容战役并行，AI 标出当前最值得处理的内容问题。</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-6xl mx-auto space-y-4">
            {MOCK_PROJECTS.map(proj => (
              <div key={proj.id} className="bg-white border border-neutral-200 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden">
                <div className="flex items-center">
                  {/* Left: Info */}
                  <div className="flex-1 p-6 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-[18px] font-bold text-neutral-900">{proj.name}</h3>
                      <span className="px-2 py-0.5 bg-neutral-100 text-neutral-500 rounded text-[12px]">运营中</span>
                    </div>
                    <div className="text-[13px] text-neutral-500 flex items-center gap-3">
                      <span>主攻方向：<strong className="text-neutral-800">{proj.currentDirection}</strong></span>
                      <span className="w-1 h-1 rounded-full bg-neutral-300" />
                      <span>本轮目标：{proj.goal}</span>
                    </div>
                  </div>

                  {/* Middle: Key Metrics */}
                  <div className="flex items-center gap-8 px-8 py-6 border-l border-neutral-100 bg-neutral-50/50">
                    <div className="flex flex-col">
                      <span className="text-[12px] text-neutral-400 mb-1">内容总量</span>
                      <span className="text-[20px] font-bold text-neutral-900">{proj.totalPacks}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[12px] text-neutral-400 mb-1">可排期</span>
                      <span className="text-[20px] font-bold text-emerald-600">{proj.status.ready}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[12px] text-amber-500 font-medium mb-1 flex items-center gap-1"><Sparkles size={12}/> 卡点</span>
                      <span className="text-[14px] font-bold text-amber-700">{proj.status.pendingMaterial} 缺素材，{proj.status.pendingReturn} 待回传</span>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="p-6 border-l border-neutral-100 flex items-center gap-3 bg-white">
                    <button onClick={() => setActiveProject(proj.id)} className="px-6 py-3 bg-neutral-900 text-white rounded-xl text-[14px] font-bold hover:bg-neutral-800 transition-colors shadow-md">
                      进入作战室
                    </button>
                    <button onClick={() => setActiveDrawer('add_batch')} className="w-12 h-12 flex items-center justify-center bg-white border border-neutral-200 text-neutral-600 rounded-xl hover:bg-neutral-50 transition-colors">
                      <Plus size={20} />
                    </button>
                  </div>
                </div>

                {/* AI Next Step Banner */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50/30 px-6 py-2.5 border-t border-amber-100/50 text-[12px] text-amber-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles size={14} className="text-amber-500" />
                    <strong>AI 建议：</strong> {proj.nextStep}
                  </div>
                  <button 
                    onClick={() => setExpandedProject(expandedProject === proj.id ? null : proj.id)}
                    className="text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1"
                  >
                    查看批次详情 {expandedProject === proj.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                </div>

                {/* Batches Drawer */}
                <AnimatePresence>
                  {(expandedProject === proj.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden border-t border-neutral-100 bg-neutral-50/50"
                    >
                      <div className="p-6 grid grid-cols-2 gap-4">
                        {proj.batches.map(batch => (
                          <div key={batch.id} className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
                            <div>
                              <h4 className="font-bold text-[14px] text-neutral-900">{batch.name}</h4>
                              <div className="text-[12px] text-neutral-500 mt-1 flex gap-3">
                                <span>{batch.count} 篇</span>
                                <span className="text-emerald-600">{batch.ready} 可排期</span>
                                <span className="text-amber-600">{batch.pendingMaterial} 缺素材</span>
                              </div>
                            </div>
                            <span className="text-[12px] font-bold text-neutral-400 bg-neutral-100 px-2 py-1 rounded">
                              {batch.progress}
                            </span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* Add Batch Drawer */}
        <AnimatePresence>
          {activeDrawer === 'add_batch' && (
            <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setActiveDrawer(null)}>
              <div className="absolute inset-0 bg-neutral-900/20 backdrop-blur-sm" />
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="w-[480px] bg-white h-full shadow-2xl flex flex-col relative z-10"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between">
                  <h3 className="font-bold text-neutral-900 text-[18px]">加一轮内容</h3>
                  <button onClick={() => setActiveDrawer(null)} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
                    <X size={18} className="text-neutral-500" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-[13px] text-blue-800 leading-relaxed">
                    <strong className="flex items-center gap-1 mb-2"><Sparkles size={16} className="text-blue-500"/> AI 批次建议</strong>
                    上一轮“幼犬挑食 + 素人口吻”表现较好，CPA 降低 20%。建议追加 20 篇同方向变体，其中 12 篇自然流，8 篇外部体验领取。
                  </div>
                  
                  <div className="space-y-4">
                    <button className="w-full p-4 border-2 border-primary-500 bg-primary-50 rounded-xl flex items-center justify-between text-left">
                      <div>
                        <div className="font-bold text-primary-900 text-[15px]">按建议加一轮</div>
                        <div className="text-primary-700 text-[12px] mt-1">生成 20 篇挑食方向变体内容</div>
                      </div>
                      <CheckCircle2 size={24} className="text-primary-500" />
                    </button>
                    <button className="w-full p-4 border border-neutral-200 bg-white hover:bg-neutral-50 transition-colors rounded-xl flex items-center justify-between text-left">
                      <div>
                        <div className="font-bold text-neutral-900 text-[15px]">基于新活动加一轮</div>
                        <div className="text-neutral-500 text-[12px] mt-1">围绕 618 大促重新配置方向</div>
                      </div>
                      <ChevronRight size={20} className="text-neutral-400" />
                    </button>
                    <button className="w-full p-4 border border-neutral-200 bg-white hover:bg-neutral-50 transition-colors rounded-xl flex items-center justify-between text-left">
                      <div>
                        <div className="font-bold text-neutral-900 text-[15px]">补齐缺口方向</div>
                        <div className="text-neutral-500 text-[12px] mt-1">补充专业科普类评测内容</div>
                      </div>
                      <ChevronRight size={20} className="text-neutral-400" />
                    </button>
                  </div>
                </div>
                <div className="p-6 border-t border-neutral-100 bg-white shrink-0">
                  <button className="w-full py-3 bg-neutral-900 text-white rounded-xl font-bold text-[15px] hover:bg-neutral-800 shadow-lg">
                    确认生成
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  const currentFocus = MOCK_AI_FOCUS_QUEUE[focusIndex];

  return (
    <div className="flex flex-col h-full bg-neutral-50 w-full relative overflow-hidden">
      {/* Top Banner & Header */}
      <div className="bg-white shrink-0 shadow-sm z-20">
        <div className="h-16 px-6 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setActiveProject(null)} className="p-2 hover:bg-neutral-100 rounded-full text-neutral-500">
              <ArrowLeft size={18} />
            </button>
            <h2 className="text-[16px] font-bold text-neutral-900">内容矩阵</h2>
            <span className="text-[12px] text-neutral-400 px-2 py-0.5 bg-neutral-100 rounded">幼犬换粮避坑长期战役</span>
          </div>
          <button onClick={() => setShowFullPicture(true)} className="text-[13px] text-neutral-600 hover:text-neutral-900 flex items-center gap-1 font-medium bg-neutral-100 px-3 py-1.5 rounded-lg">
            <Activity size={16} /> 本项目链路全貌
          </button>
        </div>

        <div className="bg-amber-50 border-b border-amber-100 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
              <Sparkles size={16} className="text-amber-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] text-amber-900 font-bold">AI 优先级判断：2 个封面弱，2 个待回传，1 个口吻风险。</span>
              <span className="text-[12px] text-amber-700">下一步链路：补封面 {'->'} 审核 3 篇 {'->'} 推入发布池</span>
            </div>
          </div>
          <button onClick={() => setActiveDrawer('ai_focus')} className="px-5 py-2 bg-amber-500 text-white rounded-xl text-[13px] font-bold shadow-md hover:bg-amber-600 transition-colors flex items-center gap-2 active:scale-95">
            队列式处理卡点 <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Main Content: The Matrix */}
      <div className="flex-1 overflow-auto p-8 custom-scrollbar">
        <div className="min-w-max mx-auto space-y-6 pb-20">
          
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
            {/* Header Row */}
            <div className="flex border-b border-neutral-100 bg-neutral-50">
              <div className="w-[140px] shrink-0 border-r border-neutral-100 p-4 flex items-center justify-center font-medium text-neutral-500 text-[13px]">
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
                <div className="w-[140px] shrink-0 border-r border-neutral-100 p-4 flex items-center justify-center font-bold text-neutral-700 text-[13px] bg-neutral-50/50">
                  {form}
                </div>
                {MOCK_MATRIX[rIdx].map((group, cIdx) => (
                  <div key={cIdx} className="flex-1 w-[260px] p-4 border-r border-neutral-100 last:border-0 bg-neutral-50/20">
                    <div className="h-full">
                      {!group ? (
                        <div className="h-24 border-2 border-dashed border-neutral-200 rounded-xl flex items-center justify-center text-neutral-400 hover:border-neutral-300 hover:bg-neutral-50 cursor-pointer transition-colors">
                          <Plus size={20} />
                        </div>
                      ) : (
                        <div 
                          onClick={() => { setActivePack(MOCK_SINGLE_PACK); setActiveDrawer('pack_detail'); }}
                          className="bg-white rounded-2xl p-0 cursor-pointer transition-all shadow-sm hover:shadow-lg border border-neutral-200 flex flex-col h-full relative group_card overflow-hidden"
                        >
                          <div className={`px-4 py-2 flex items-center justify-between ${group.aiFlags.length > 0 ? getAiFlagColor(group.aiFlags[0]) : 'bg-neutral-50 border-b border-neutral-100'}`}>
                            <span className="text-[12px] font-bold truncate">
                              {group.aiFlags.length > 0 ? group.aiFlags[0] : "无风险卡点"}
                            </span>
                            {group.aiFlags.length > 1 && (
                              <span className="text-[10px] bg-white/20 px-1.5 rounded">+1</span>
                            )}
                          </div>
                          <div className="p-4 flex flex-col flex-1 bg-white">
                            <h4 className="text-[14px] font-bold text-neutral-900 mb-2">{group.title}</h4>
                            <div className="flex flex-wrap gap-1.5 mt-auto">
                              <span className="text-[11px] bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded font-medium">{group.total} 篇</span>
                              {group.published > 0 && <span className="text-[11px] text-neutral-500">{group.published} 已发布</span>}
                              {group.hotPotential > 0 && <span className="text-[11px] text-purple-600 font-medium">{group.hotPotential} 爆文</span>}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

        </div>
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
              className="w-[480px] bg-white h-full shadow-2xl flex flex-col relative z-10"
              onClick={(e) => e.stopPropagation()}
            >
              {activeDrawer === 'ai_focus' && currentFocus && (
                <>
                  <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 font-bold text-[14px]">
                        {focusIndex + 1}/{MOCK_AI_FOCUS_QUEUE.length}
                      </div>
                      <h3 className="font-bold text-neutral-900 text-[16px]">
                        第 {focusIndex + 1} 个重点
                      </h3>
                    </div>
                    <button onClick={() => setActiveDrawer(null)} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
                      <X size={18} className="text-neutral-500" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-8 flex flex-col justify-center">
                    
                    <AnimatePresence mode="wait">
                      <motion.div 
                        key={focusIndex}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white border border-neutral-200 rounded-[24px] p-8 shadow-xl relative overflow-hidden">
                        
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-400 to-rose-400" />
                        
                        <div className="flex items-center gap-2 text-[14px] text-neutral-500 mb-6 font-medium">
                          <span className="text-neutral-900 font-bold">{currentFocus.packName}</span>
                          <span className="px-1.5 border-l border-neutral-300">|</span>
                          <span className="text-amber-600 font-bold">{currentFocus.reason}</span>
                        </div>

                        <div className="space-y-6">
                          <div>
                            <div className="text-[12px] text-neutral-400 mb-1">AI 诊断</div>
                            <div className="text-[16px] text-neutral-800 leading-relaxed font-medium">
                              {currentFocus.detail}
                            </div>
                          </div>
                          
                          <div className="p-5 bg-neutral-50 rounded-2xl border border-neutral-100">
                            <div className="text-[12px] text-neutral-400 mb-2">执行方案</div>
                            <div className="text-[15px] font-bold text-neutral-900 mb-3">
                              {currentFocus.action}
                            </div>
                            <div className="text-[12px] text-neutral-500 flex items-center gap-1.5">
                              <CheckCircle size={14} className="text-emerald-500"/> 执行后流向：{currentFocus.flow}
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-8 pt-6 border-t border-neutral-100 flex gap-4">
                          <button 
                            onClick={() => {
                              if (focusIndex < MOCK_AI_FOCUS_QUEUE.length - 1) {
                                setFocusIndex(focusIndex + 1);
                              } else {
                                setActiveDrawer(null);
                              }
                            }}
                            className="flex-1 py-4 bg-neutral-900 text-white text-[15px] font-bold rounded-xl hover:bg-neutral-800 shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                          >
                            <CheckCircle2 size={18} /> 处理并下一个
                          </button>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </>
              )}

              {activeDrawer === 'pack_detail' && activePack && (
                <>
                  <div className="px-8 py-6 border-b border-neutral-100 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-neutral-900 text-[20px]">{activePack.title}</h3>
                      <div className="text-[13px] text-neutral-500 mt-1 flex gap-2">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold text-white bg-amber-500`}>封面弱</span>
                        <span>{activePack.format}</span>
                      </div>
                    </div>
                    <button onClick={() => setActiveDrawer(null)} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
                      <X size={20} className="text-neutral-500" />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-8 bg-neutral-50/50">
                    <div className="bg-white border border-neutral-200 rounded-[20px] p-6 shadow-sm mb-6">
                      <h4 className="text-[14px] font-bold text-neutral-900 mb-4 flex items-center gap-2">
                        <Sparkles size={16} className="text-amber-500" /> AI 诊断与处理建议
                      </h4>
                      <p className="text-[14px] text-neutral-700 leading-relaxed mb-6">
                        {activePack.currentJudgment}
                      </p>
                      
                      <div className="flex gap-3">
                        <button className="flex-1 py-3 bg-neutral-900 text-white rounded-xl font-bold text-[14px] hover:bg-neutral-800 shadow-md transition-all">
                          一键补封面
                        </button>
                        <button className="flex-1 py-3 bg-white border border-neutral-200 text-neutral-700 rounded-xl font-bold text-[14px] hover:bg-neutral-50 transition-colors">
                          忽略，强制排期
                        </button>
                      </div>
                    </div>
                    
                    <div className="bg-white border border-neutral-200 rounded-[20px] p-6 shadow-sm">
                      <h4 className="text-[14px] font-bold text-neutral-900 mb-4">内容预览</h4>
                      <div className="aspect-video bg-neutral-100 rounded-xl flex items-center justify-center text-neutral-400 mb-4">
                         <ImageIcon size={32} />
                      </div>
                      <p className="text-[13px] text-neutral-600 line-clamp-3">
                        很多新手家长一看到狗狗不吃饭就慌了，立马换粮换罐头，其实这恰恰助长了它们的挑食毛病！今天来聊聊怎么纠正...
                      </p>
                    </div>
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
              className="bg-white rounded-[24px] shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 border-b border-neutral-100 flex justify-between items-center bg-neutral-50">
                <div>
                  <h3 className="text-[18px] font-bold text-neutral-900 flex items-center gap-2">
                    <Activity size={20} className="text-neutral-500" /> 本项目链路全貌
                  </h3>
                  <p className="text-[12px] text-neutral-500 mt-1">幼犬换粮避坑长期战役 - 当前各阶段内容包流转状态</p>
                </div>
                <button onClick={() => setShowFullPicture(false)} className="p-2 hover:bg-neutral-200 rounded-full text-neutral-500 transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-8 overflow-x-auto custom-scrollbar">
                <div className="flex items-center gap-3 min-w-max pb-4">
                  {STAGE_DATA.map((step, i, arr) => (
                    <React.Fragment key={step.name}>
                      <div className="w-[140px] bg-white border border-neutral-200 rounded-xl p-4 shadow-sm flex flex-col items-center text-center relative">
                        {step.block > 0 && (
                          <div className="absolute -top-2 -right-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                            阻塞 {step.block}
                          </div>
                        )}
                        {step.error > 0 && (
                          <div className="absolute -top-2 -left-2 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                            异常 {step.error}
                          </div>
                        )}
                        <div className="text-[13px] font-bold text-neutral-800 mb-2">{step.name}</div>
                        <div className="text-[24px] font-semibold text-neutral-900">{step.completed}</div>
                        <div className="text-[11px] text-neutral-400 mt-1">已完成</div>
                      </div>
                      {i < arr.length - 1 && <ArrowRight size={18} className="text-neutral-300" />}
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

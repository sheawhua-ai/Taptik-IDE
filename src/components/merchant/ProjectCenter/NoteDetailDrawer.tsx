import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  X, CheckCircle2, ChevronRight, FileText, Image as ImageIcon,
  MessageSquare, User, Clock, AlertCircle, Sparkles, ExternalLink, ShieldCheck, Check
} from "lucide-react";

interface NoteDetailDrawerProps {
  note: any;
  projectId?: string;
  onClose: () => void;
  onActionClick?: () => void;
  onOpenInExecutionCenter?: () => void;
}

export function NoteDetailDrawer({ note, projectId, onClose, onActionClick, onOpenInExecutionCenter }: NoteDetailDrawerProps) {
  const isPackage = note.isNotePackage || note.title?.includes("笔记包") || note.type?.includes("KOC") || note.type?.includes("消费者") || note.packageSpec;
  const isKocExperience = note.contentDirection?.includes("幼犬换粮体验") || note.title?.includes("幼犬换粮体验") || note.id === "ns5";
  const isKosStore = note.contentDirection?.includes("门店接诊") || note.title?.includes("门店接诊") || note.id === "ns6";

  const [showFullAnswers, setShowFullAnswers] = useState(false);

  // Derive display metadata
  const currentStatusText = () => {
    if (note.packageSpec?.questionnaireStatus === "待填写" || note.publishStatus === "待领包") {
      return "待领取";
    }
    if (note.publishStatus === "观察中" || note.resultStatus === "观察中") {
      return "观察中";
    }
    if (note.publishStatus === "待发布") {
      return "待发布";
    }
    if (note.contentStatus === "待确认") {
      return "内容待确认";
    }
    if (note.contentStatus === "已确认") {
      return "内容已就绪";
    }
    return note.publishStatus || note.status || "执行中";
  };

  const getTopicDirection = () => {
    if (note.contentDirection) return note.contentDirection.replace(/^规定的写作框架：/, "");
    if (note.title) return note.title.replace(/^【笔记包】/, "");
    return "幼犬换粮体验、软便缓解心得与真实避坑建议。";
  };

  const getMustCoverInfo = () => {
    if (isKosStore) {
      return "店长专业视角解答3个新手幼犬换粮常见误区，结合门店实景，推荐试用装与专利益生菌过渡方案。";
    }
    if (isKocExperience) {
      return "说明狗狗品种与月龄，记录从软便到便便成型的7天换粮过程，体现专利益生菌的辅助改善作用。";
    }
    return note.packageSpec?.guidelines || "说明具体使用背景与宠物状态，突出产品核心卖点与专利益生菌在换粮期的吸收保护效果。";
  };

  const getForbiddenRules = () => {
    if (isKosStore) {
      return "禁止出现“100%治愈软便”、“处方药级别疗效”、“行业最强”等绝对化、医疗化违规用词。";
    }
    return "禁止出现“绝对不拉肚子”、“处方粮”、“治百病”等绝对化或医疗用词。";
  };

  // Material scenes
  const getMaterialScenes = () => {
    if (isKosStore) {
      return [
        {
          title: "场景一：门店货架与陈列实景",
          badge: "建议 1 张 · 必拍",
          req: "要求：光线明亮清晰，展示门店狗粮货架陈列与试用装展示区，店长工服需露出品牌标识。",
          taboo: "禁忌：画面杂乱、货架积灰或出现竞品明显商标。"
        },
        {
          title: "场景二：店长工服出镜讲解或产品特写",
          badge: "建议 1 张 · 选拍",
          req: "要求：店长手持产品向镜头展示包装细节与专利益生菌成分标识，神态专业亲切。",
          taboo: "禁忌：过度美颜滤镜导致包装文字失真。"
        }
      ];
    }

    return [
      {
        title: "场景一：狗狗进食中",
        badge: "建议 1 张 · 必拍",
        req: "要求：自然光线，狗狗吃粮的特写或半身照，需露出包装袋一角与食盆。",
        taboo: "禁忌：画面杂乱，有其他品牌狗粮包装明显入镜。"
      },
      {
        title: "场景二：狗狗便便状态与精神面貌",
        badge: "建议 1 张 · 可选",
        req: "要求：便便成型后的远景或打码处理，或狗狗精神活泼的全身生活照，证明换粮效果。",
        taboo: "禁忌：过分特写引起观感不适。"
      }
    ];
  };

  const isPendingClaim = note.packageSpec?.questionnaireStatus === "待填写" || note.publishStatus === "待领包";

  return (
    <div className="fixed inset-0 z-[150] flex justify-end">
      <div 
        className="absolute inset-0 bg-neutral-900/30 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />
      
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="relative w-[500px] bg-[#fcfcfc] h-full shadow-2xl flex flex-col z-10 border-l border-neutral-200"
      >
        {/* Top Header */}
        <div className="p-5 border-b border-neutral-200 bg-white flex justify-between items-center shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[16px] font-extrabold text-[#111827]">
                {isPackage ? "笔记包详情" : "笔记详情"}
              </h2>
              {isPackage && (
                <span className="px-2 py-0.5 bg-primary-50 text-primary-700 text-[11px] font-bold rounded-md border border-primary-200">
                  定向内容包
                </span>
              )}
            </div>
            <div className="text-[12px] text-neutral-500 mt-0.5 truncate max-w-[380px]">
              {note.title || note.contentDirection || "未命名笔记"}
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-neutral-400 hover:text-neutral-900 rounded-xl hover:bg-neutral-100 transition-colors"
          >
            <X size={19} />
          </button>
        </div>

        {/* Scrollable Content Body - Unified Vertical Sections */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* 1. 内容包/笔记概况 */}
          <div className="space-y-3">
            <h3 className="text-[14px] font-bold text-neutral-900 flex items-center gap-2">
              <div className="w-1.5 h-3.5 bg-neutral-900 rounded-full" />
              {isPackage ? "内容包概况" : "笔记概况"}
            </h3>
            <div className="bg-white rounded-xl border border-neutral-200 p-4 space-y-3 shadow-2xs text-[13px]">
              <div className="flex justify-between items-center">
                <span className="text-neutral-500 text-[12px]">当前状态</span>
                <span className={`text-[12px] font-bold px-2.5 py-0.5 rounded-lg border ${
                  isPendingClaim 
                    ? 'bg-neutral-100 text-neutral-600 border-neutral-200' 
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}>
                  {currentStatusText()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500 text-[12px]">执行账号/领取者</span>
                <span className="font-bold text-neutral-900 text-[12px]">
                  {isPendingClaim ? "待匹配创作者 / 待领取" : (note.participant || note.account || "小红薯_汪汪队")}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500 text-[12px]">账号类型</span>
                <span className="font-medium text-neutral-700 text-[12px]">
                  {note.type || "KOC 真实体验"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500 text-[12px]">事实问卷版本</span>
                <span className="font-medium text-neutral-700 text-[12px]">v1.2 (项目统一标准版)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500 text-[12px]">计划排期</span>
                <span className="font-medium text-neutral-700 text-[12px]">{note.plannedDate || "2024-03-12"}</span>
              </div>
            </div>
          </div>

          {/* 2. 笔记生成要求 */}
          <div className="space-y-3">
            <h3 className="text-[14px] font-bold text-neutral-900 flex items-center gap-2">
              <div className="w-1.5 h-3.5 bg-neutral-900 rounded-full" />
              笔记生成要求
            </h3>
            <div className="bg-white rounded-xl border border-neutral-200 p-4 space-y-4 shadow-2xs text-[12px]">
              <div>
                <div className="text-neutral-500 mb-1.5 font-medium">主题方向</div>
                <div className="font-bold text-neutral-900 text-[13px] leading-relaxed">
                  {getTopicDirection()}
                </div>
              </div>
              <div>
                <div className="text-neutral-500 mb-1.5 font-medium">必须覆盖的信息</div>
                <div className="text-neutral-800 leading-relaxed bg-[#F7F8FA] p-3 rounded-lg border border-neutral-100">
                  {getMustCoverInfo()}
                </div>
              </div>
              <div>
                <div className="text-neutral-500 mb-1.5 font-medium">禁用表达与合规红线</div>
                <div className="font-medium text-rose-700 bg-rose-50 px-3 py-2 rounded-lg border border-rose-200/60 leading-relaxed">
                  {getForbiddenRules()}
                </div>
              </div>
            </div>
          </div>

          {/* 3. 个性化生成依据 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[14px] font-bold text-neutral-900 flex items-center gap-2">
                <div className="w-1.5 h-3.5 bg-neutral-900 rounded-full" />
                个性化生成依据
              </h3>
            </div>
            <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-2xs">
              {isPendingClaim ? (
                <div className="text-[12px] text-neutral-500 text-center py-5 space-y-2">
                  <div className="w-8 h-8 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center mx-auto">
                    <Sparkles size={16} />
                  </div>
                  <div className="font-medium text-neutral-800 text-[13px]">等待提交事实问卷</div>
                  <div className="text-[#667085] leading-relaxed max-w-[340px] mx-auto text-[12px]">
                    创作者通过落地页或扫码提交真实喂养/门店问卷后，AI 操盘手将自动提取核心事实、匹配定制人设口吻生成专属笔记。
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                    <div className="text-[12px] font-bold text-neutral-700">问卷与事实快照</div>
                    <button 
                      onClick={() => setShowFullAnswers(!showFullAnswers)}
                      className="text-[12px] font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1"
                    >
                      {showFullAnswers ? "收起完整回答" : "查看完整回答"} <ChevronRight size={13} className={showFullAnswers ? "rotate-90 transition-transform" : ""} />
                    </button>
                  </div>
                  <div className="space-y-2 text-[12px]">
                    <div className="flex gap-2">
                      <span className="text-neutral-400 shrink-0">提取重点:</span>
                      <span className="font-medium text-neutral-900">
                        {isKosStore 
                          ? "新店接诊超30例幼犬频繁换粮腹泻，重点科普七日渐进换粮法与益生菌加持。"
                          : "3个月金毛幼犬，近期软便严重，希望解决肠胃脆弱问题并顺利过渡。"}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-neutral-400 shrink-0">采用角度:</span>
                      <span className="font-medium text-neutral-900">
                        {isKosStore 
                          ? "资深宠物店长权威科普避坑，解答铲屎官常见误区。"
                          : "新手铲屎官从焦虑求助转为真实亲测经验分享。"}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-neutral-400 shrink-0">采用语气:</span>
                      <span className="font-medium text-neutral-900">
                        {isKosStore ? "专业严谨、条理清晰、有亲和力" : "高口语化、真实生活感、亲切真诚"}
                      </span>
                    </div>
                  </div>

                  {showFullAnswers && (
                    <div className="pt-3 border-t border-neutral-100 space-y-2 text-[11px] bg-neutral-50 p-3 rounded-lg">
                      <div><span className="text-neutral-400">1. 宠物基本情况：</span><span className="text-neutral-700 font-medium">3个月金毛幼犬，体重 4.2kg</span></div>
                      <div><span className="text-neutral-400">2. 目前喂养困扰：</span><span className="text-neutral-700 font-medium">换粮第3天出现不成型软便，食欲正常</span></div>
                      <div><span className="text-neutral-400">3. 试用粮体验反馈：</span><span className="text-neutral-700 font-medium">适口性极好，搭配益生菌后便便在第5天成型</span></div>
                    </div>
                  )}

                  {note.body && (
                    <div className="pt-3 border-t border-neutral-100">
                      <div className="text-[12px] text-neutral-500 mb-1.5 font-medium">已生成正文草案预览</div>
                      <div className="p-3 bg-[#F7F8FA] rounded-lg text-[12px] text-neutral-700 leading-relaxed max-h-28 overflow-y-auto">
                        {note.body}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 4. 照片拍摄要求 */}
          <div className="space-y-3">
            <h3 className="text-[14px] font-bold text-neutral-900 flex items-center gap-2">
              <div className="w-1.5 h-3.5 bg-neutral-900 rounded-full" />
              照片拍摄与素材要求
            </h3>
            <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-2xs space-y-4">
              {getMaterialScenes().map((scene, idx) => (
                <div key={idx} className={idx > 0 ? "border-t border-neutral-100 pt-4" : ""}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="text-[13px] font-bold text-neutral-900">{scene.title}</div>
                    <div className="text-[11px] font-bold text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded">
                      {scene.badge}
                    </div>
                  </div>
                  <div className="text-[12px] text-neutral-600 mb-1.5 leading-relaxed">{scene.req}</div>
                  <div className="text-[12px] text-rose-600 font-medium">{scene.taboo}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 5. 执行时间线 */}
          <div className="space-y-3 pb-6">
            <h3 className="text-[14px] font-bold text-neutral-900 flex items-center gap-2">
              <div className="w-1.5 h-3.5 bg-neutral-900 rounded-full" />
              执行时间线
            </h3>
            <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-2xs">
              {isPendingClaim ? (
                <div className="relative pl-4 space-y-5 before:absolute before:inset-y-0 before:left-[7px] before:w-[2px] before:bg-neutral-100">
                  <div className="relative">
                    <div className="absolute w-3 h-3 bg-emerald-500 rounded-full -left-[9px] top-1 border-2 border-white" />
                    <div className="pl-4">
                      <div className="text-[12px] font-bold text-neutral-900">任务包已创建并下发</div>
                      <div className="text-[11px] text-neutral-400 mt-0.5">08-13 14:00</div>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute w-3 h-3 bg-primary-500 rounded-full -left-[9px] top-1 border-2 border-white animate-pulse" />
                    <div className="pl-4">
                      <div className="text-[12px] font-bold text-primary-700">等待领取并提交问卷</div>
                      <div className="text-[11px] text-neutral-400 mt-0.5">预计排期: {note.plannedDate || "近期"}</div>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute w-3 h-3 bg-white border-2 border-neutral-200 rounded-full -left-[9px] top-1" />
                    <div className="pl-4">
                      <div className="text-[12px] font-medium text-neutral-400">AI 即时生成专属笔记与素材预检</div>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute w-3 h-3 bg-white border-2 border-neutral-200 rounded-full -left-[9px] top-1" />
                    <div className="pl-4">
                      <div className="text-[12px] font-medium text-neutral-400">小红书发布与自动识别观察</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative pl-4 space-y-5 before:absolute before:inset-y-0 before:left-[7px] before:w-[2px] before:bg-neutral-100">
                  <div className="relative">
                    <div className="absolute w-3 h-3 bg-neutral-400 rounded-full -left-[9px] top-1 border-2 border-white" />
                    <div className="pl-4">
                      <div className="text-[12px] font-bold text-neutral-900">任务已领取并锁定</div>
                      <div className="text-[11px] text-neutral-400 mt-0.5">08-13 15:30</div>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute w-3 h-3 bg-neutral-400 rounded-full -left-[9px] top-1 border-2 border-white" />
                    <div className="pl-4">
                      <div className="text-[12px] font-bold text-neutral-900">问卷已提交，AI生成正文草案</div>
                      <div className="text-[11px] text-neutral-400 mt-0.5">08-13 15:35</div>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute w-3 h-3 bg-emerald-500 rounded-full -left-[9px] top-1 border-2 border-white" />
                    <div className="pl-4">
                      <div className="text-[12px] font-bold text-emerald-700">照片已上传并检查通过</div>
                      <div className="text-[11px] text-neutral-400 mt-0.5">08-13 16:10</div>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute w-3 h-3 bg-white border-2 border-neutral-200 rounded-full -left-[9px] top-1" />
                    <div className="pl-4">
                      <div className="text-[12px] font-bold text-neutral-400">等待进入小红书发布与自动识别</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}


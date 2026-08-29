import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  X, Image as ImageIcon, FileText, Send, Eye, 
  ArrowUp, ArrowDown, Trash2, Plus, ExternalLink, 
  CheckCircle2, AlertCircle, Camera
} from "lucide-react";
import { Note } from "../../../data/projectStore";
import { getUnifiedBusinessStatus, getStatusStyleClass } from "../../../utils/noteStatus";
import { getNotePrimaryAction, getNoteReadiness } from "../../../utils/noteStatus";
import { ExecutionAction } from "../../../data/unifiedStore";
import { formatChineseDate } from "../../../utils/formatDate";

interface NormalNoteDetailDrawerProps {
  note: Note;
  projectId?: string;
  onClose: () => void;
  onExecuteAction?: (action: ExecutionAction) => void;
}

export function NormalNoteDetailDrawer({
  note,
  projectId,
  onClose,
  onExecuteAction,
}: NormalNoteDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState<"content" | "images" | "publish" | "observe">("content");

  const getSelectedImages = () => (note.selectedMaterials || []).map(material => ({
    id: material.id,
    url: material.url,
    name: material.title
  }));
  const [images, setImages] = useState(getSelectedImages);

  useEffect(() => {
    setImages(getSelectedImages());
  }, [note.id]);

  const uStatus = getUnifiedBusinessStatus(note);
  const style = getStatusStyleClass(uStatus);
  const primaryAction = getNotePrimaryAction(note);
  const readiness = getNoteReadiness(note);

  const moveImage = (index: number, direction: "up" | "down") => {
    const newIdx = direction === "up" ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= images.length) return;
    const newImages = [...images];
    const temp = newImages[index];
    newImages[index] = newImages[newIdx];
    newImages[newIdx] = temp;
    setImages(newImages);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const hasRedNoteId = !!note.publishLink || note.resultStatus === "观察中" || note.resultStatus === "已完成";
  const mockNoteUrl = note.publishLink || (hasRedNoteId ? `https://www.xiaohongshu.com/explore/64f89a1c0000000000000000` : null);

  return (
    <div className="fixed inset-0 z-[150] flex justify-end">
      <div 
        className="absolute inset-0 bg-btn-main/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />
      
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 220 }}
        className="relative w-full max-w-[580px] bg-[#fcfcfc] h-full shadow-2xl flex flex-col z-10 border-l border-border-default"
      >
        {/* Header */}
        <div className="p-5 border-b border-border-default bg-surface-1 flex justify-between items-start shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-[16px] font-semibold text-text-main truncate max-w-[360px]">
                {note.title || note.contentDirection || "未命名笔记"}
              </h2>
              <span className={`px-2 py-0.5 rounded-md text-[13px] font-medium border shrink-0 ${style.bg} ${style.text} ${style.border}`}>
                {uStatus}
              </span>
            </div>
            <div className="flex items-center gap-3 text-[13px] text-text-tertiary">
              <span>账号: <span className="font-medium text-text-main">{note.account || "特唯普官方旗舰店"}</span></span>
              <span>·</span>
              <span>类型: <span className="font-medium text-text-secondary">{note.type || "品牌号"}</span></span>
              <span>·</span>
              <span>发布计划：{formatChineseDate(note.plannedDate) || "排期中"}</span>
            </div>
          </div>

          <button 
            onClick={onClose} 
            className="p-2 text-text-tertiary hover:text-text-main rounded-xl hover:bg-hover-bg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 bg-surface-1 border-b border-border-default flex gap-4 text-[13px] font-medium shrink-0">
          {[
            { id: "content", label: "内容" },
            { id: "images", label: "图片" },
            { id: "publish", label: "发布" },
            { id: "observe", label: "观察" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 relative ${
                activeTab === tab.id ? "text-text-main font-semibold" : "text-text-tertiary hover:text-text-secondary"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="noteTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-500 rounded-full"
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: 内容 */}
          {activeTab === "content" && (
            <div className="space-y-4 text-[13px]">
              {/* Consumer Questionnaire Results (Only for notes generated from consumer questionnaire) */}
              {note.consumerQuestionnaire && (
                <div className="bg-surface-1 rounded-xl p-4 border border-border-default space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-text-secondary" />
                      <h4 className="font-semibold text-text-main text-[13.5px]">
                        消费者问卷结果
                      </h4>
                    </div>
                    <span className="text-[13px] px-2 py-0.5 bg-surface-2 text-text-secondary font-medium rounded-md border border-border-default">
                      依据问卷定制起草
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 text-[13px] pt-1">
                    <div className="p-2.5 bg-surface-2 rounded-lg border border-border-default">
                      <span className="text-text-tertiary font-normal block text-[13px]">宠物月龄与品种</span>
                      <span className="font-medium text-text-main mt-0.5 block">
                        {note.consumerQuestionnaire.petBreed || "金毛幼犬"} · {note.consumerQuestionnaire.petAge || "4个月"}
                      </span>
                    </div>

                    <div className="p-2.5 bg-surface-2 rounded-lg border border-border-default">
                      <span className="text-text-tertiary font-normal block text-[13px]">推荐意愿</span>
                      <span className="font-medium text-emerald-700 mt-0.5 block">
                        {note.consumerQuestionnaire.willingnessToRecommend || "一定会推荐"}
                      </span>
                    </div>

                    <div className="p-2.5 bg-surface-2 rounded-lg border border-border-default col-span-2">
                      <span className="text-text-tertiary font-normal block text-[13px]">换粮前主要困扰</span>
                      <span className="font-normal text-text-main mt-0.5 block">
                        {note.consumerQuestionnaire.symptom || "幼犬初次换粮软便拉稀、食欲挑食"}
                      </span>
                    </div>

                    <div className="p-2.5 bg-surface-2 rounded-lg border border-border-default col-span-2">
                      <span className="text-text-tertiary font-normal block text-[13px]">试用效果与真实变化</span>
                      <span className="font-normal text-text-main mt-0.5 block">
                        {note.consumerQuestionnaire.experience || "按照7日换粮法第4天便便完全成型，精神活泼，胃口大开"}
                      </span>
                    </div>
                  </div>

                  <div className="text-[13px] text-text-tertiary flex items-center justify-between pt-1 border-t border-border-default">
                    <span>内容包：{note.consumerQuestionnaire.sourcePackageName || "消费者真实体验内容包"} · 反馈 V{note.consumerQuestionnaire.feedbackVersion || 1}</span>
                    <span>提交时间：{formatChineseDate(note.consumerQuestionnaire.submittedAt, true)}</span>
                  </div>
                </div>
              )}

              <div className="bg-surface-1 rounded-xl p-4 border border-border-default space-y-3">
                <div>
                  <label className="text-[13px] text-text-tertiary font-normal block mb-1">笔记标题</label>
                  <div className="font-medium text-text-main text-[14px] bg-surface-2 p-3 rounded-lg border border-border-default">
                    {note.title || "幼犬换粮总软便？宠物店长教你3步过渡避坑指南"}
                  </div>
                </div>

                <div>
                  <label className="text-[13px] text-text-tertiary font-normal block mb-1">笔记正文</label>
                  <div className="text-text-main leading-relaxed bg-surface-2 p-3 rounded-lg border border-border-default whitespace-pre-line text-[13px] max-h-60 overflow-y-auto">
                    {note.body || `很多新手家长在幼犬3-6个月换粮期，常常遇到软便拉稀的问题。\n\n其实幼犬肠胃娇嫩，换粮最忌讳直接一刀切！\n\n📌 建议遵循【7日渐进换粮法】：\nDay 1-2：旧粮 80% + 新粮 20%\nDay 3-4：旧粮 50% + 新粮 50%\nDay 5-6：旧粮 20% + 新粮 80%\nDay 7+：完全过渡为新粮\n\n✨ 核心划重点：搭配活性益生菌配方，有助于平稳建立肠道菌群。如果狗狗有挑食问题，可以温水微泡激发肉香。`}
                  </div>
                </div>

                <div>
                  <label className="text-[13px] text-text-tertiary font-normal block mb-1.5">话题与标签</label>
                  <div className="flex flex-wrap gap-1.5">
                    {["#幼犬换粮", "#新手养狗避坑", "#狗狗软便", "#宠物店长科普", "#特唯普宠粮"].map((tag) => (
                      <span key={tag} className="px-2.5 py-1 bg-hover-bg text-text-secondary text-[13px] font-normal rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-border-default flex items-center justify-between text-[13px] text-text-tertiary">
                  <span>发布主体: <span className="font-medium text-text-main">{note.account || "特唯普官方旗舰店"}</span></span>
                  <span>内容状态: <span className="font-medium text-emerald-700">已就绪</span></span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 图片 */}
          {activeTab === "images" && (
            <div className="space-y-4 text-[13px]">
              {/* Picture count banner */}
              <div className="p-3 bg-hover-bg rounded-xl border border-border-default text-[13px] flex items-center justify-between">
                <span className="text-text-secondary">
                  当前 <strong className="font-semibold text-text-main">{images.length}</strong> 张 · 建议 3-6 张
                </span>
                {images.length < 3 ? (
                  <span className="text-amber-800 font-medium bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[13px]">
                    尚缺 {3 - images.length} 张
                  </span>
                ) : (
                  <span className="text-emerald-800 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[13px]">
                    数量达标
                  </span>
                )}
              </div>

              {/* Action bar */}
              <div className="flex gap-2">
                {onExecuteAction && (
                  <button
                    onClick={() => onExecuteAction("replace_material")}
                    className="flex-1 py-2 bg-surface-1 border border-border-default rounded-xl text-[13px] font-medium text-text-secondary hover:bg-surface-2 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Plus size={13} /> 从素材中心选择
                  </button>
                )}
                {onExecuteAction && (
                  <button
                    onClick={() => onExecuteAction("create_material_task")}
                    className="flex-1 py-2 bg-surface-1 border border-border-default rounded-xl text-[13px] font-medium text-text-secondary hover:bg-surface-2 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Camera size={13} /> 发起拍摄任务
                  </button>
                )}
              </div>

              {note.materialTask?.returnedUrls?.length ? (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[13px] font-semibold text-amber-900">素材任务已回传 {note.materialTask.returnedUrls.length} 件</div>
                    <div className="text-[13px] text-amber-800 mt-0.5">验收通过后才会计入当前笔记素材。</div>
                  </div>
                  {onExecuteAction && (
                    <button
                      onClick={() => onExecuteAction("review_material")}
                      className="shrink-0 px-3 py-1.5 bg-surface-1 border border-amber-300 rounded-lg text-[13px] font-medium text-amber-900 hover:bg-amber-100"
                    >
                      去验收
                    </button>
                  )}
                </div>
              ) : null}

              {note.recommendedMaterials?.length ? (
                <div className="rounded-xl border border-border-default bg-surface-1 p-3 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[13px] font-semibold text-text-main">项目素材库推荐</div>
                      <div className="text-[13px] text-text-tertiary">推荐不等于已选，需操盘手确认后才会进入笔记。</div>
                    </div>
                    {onExecuteAction && (
                      <button onClick={() => onExecuteAction("replace_material")} className="text-[13px] font-medium text-text-main hover:underline">
                        去选图
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {note.recommendedMaterials.map(material => (
                      <div key={material.id} className="flex items-center gap-2 rounded-lg bg-surface-subtle p-2 border border-border-default min-w-0">
                        <img src={material.url} alt={material.title} className="w-10 h-10 object-cover rounded-md shrink-0" />
                        <div className="min-w-0">
                          <div className="text-[13px] font-medium text-text-main truncate">{material.title}</div>
                          <div className="text-[13px] text-text-tertiary">匹配 {material.matchScore}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Image List (Unified hierarchy: 1st is cover) */}
              <div className="space-y-3">
                {images.length === 0 && (
                  <div className="rounded-xl border border-dashed border-border-strong bg-surface-subtle px-4 py-6 text-center">
                    <ImageIcon size={22} className="mx-auto text-text-tertiary mb-2" />
                    <div className="text-[13px] font-medium text-text-main">当前还没有已确认素材</div>
                    <div className="text-[13px] text-text-tertiary mt-1">可从推荐素材中选择，或发起新的拍摄任务。</div>
                  </div>
                )}
                {images.map((img, index) => (
                  <div
                    key={img.id}
                    className="bg-surface-1 rounded-xl p-3 border border-border-default flex items-center gap-3"
                  >
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-hover-bg shrink-0 border border-border-default">
                      <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                      {index === 0 && (
                        <div className="absolute top-0 left-0 right-0 bg-btn-main/80 text-white text-[13px] font-medium py-0.5 text-center">
                          封面
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-medium text-text-main truncate">
                        P{index + 1}: {img.name}
                      </div>
                      <div className="text-[13px] text-text-tertiary mt-0.5">
                        {index === 0 ? "第一张将作为小红书封面图" : `内图 ${index}`}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => moveImage(index, "up")}
                        disabled={index === 0}
                        className="p-1 text-text-tertiary hover:text-text-main disabled:opacity-30 rounded hover:bg-hover-bg"
                        title="上移"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        onClick={() => moveImage(index, "down")}
                        disabled={index === images.length - 1}
                        className="p-1 text-text-tertiary hover:text-text-main disabled:opacity-30 rounded hover:bg-hover-bg"
                        title="下移"
                      >
                        <ArrowDown size={14} />
                      </button>
                      <button
                        onClick={() => removeImage(index)}
                        className="p-1 text-text-tertiary hover:text-danger rounded hover:bg-danger-light"
                        title="删除"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: 发布 */}
          {activeTab === "publish" && (
            <div className="space-y-4 text-[13px]">
              <div className="bg-surface-1 rounded-xl p-4 border border-border-default space-y-3">
                <h4 className="font-semibold text-text-main text-[13.5px]">发布执行事实</h4>
                
                <div className="space-y-2.5 text-[13px]">
                  <div className="flex justify-between items-center py-1.5 border-b border-border-default">
                    <span className="text-text-tertiary">发布类型</span>
                    <span className="font-medium text-text-main">{note.type || "品牌号定向发布"}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-border-default">
                    <span className="text-text-tertiary">发布主体/执行人</span>
                    <span className="font-medium text-text-main">{note.account || "特唯普官方旗舰店 (张店长)"}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-border-default">
                    <span className="text-text-tertiary">计划发布时间</span>
                    <span className="font-medium text-text-main">{note.plannedDate || "2026-08-15"}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-border-default">
                    <span className="text-text-tertiary">小红书发布事实</span>
                    <span className="font-normal text-text-main">
                      {hasRedNoteId ? "已完成发布并识别" : "等待外部执行端在小红书完成发布"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1.5">
                    <span className="text-text-tertiary">小红书笔记ID</span>
                    <span className="font-mono text-text-secondary">
                      {hasRedNoteId ? "64f89a1c0000000000000000" : "等待系统自动识别"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-1">
                {hasRedNoteId && mockNoteUrl && (
                  <a
                    href={mockNoteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 bg-surface-1 border border-border-default text-text-main rounded-xl text-[13px] font-medium hover:bg-surface-2 transition-colors flex items-center justify-center gap-2"
                  >
                    <ExternalLink size={14} /> 查看小红书原笔记
                  </a>
                )}

                {uStatus === "异常" && onExecuteAction && (
                  <button
                    onClick={() => onExecuteAction("handle_publish_error")}
                    className="w-full py-2.5 bg-danger-light text-danger border border-danger-light rounded-xl text-[13px] font-medium hover:bg-danger-light transition-colors flex items-center justify-center gap-2"
                  >
                    <AlertCircle size={15} /> 前往执行中心处理异常
                  </button>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: 观察 */}
          {activeTab === "observe" && (
            <div className="space-y-4 text-[13px]">
              <div className="bg-surface-1 rounded-xl p-4 border border-border-default space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-text-main text-[13.5px]">观察周期与进度</h4>
                  <span className="text-[13px] text-text-tertiary">最近更新: 10分钟前</span>
                </div>

                <div className="p-3 bg-surface-2 rounded-lg border border-border-default text-[13px] flex justify-between items-center">
                  <span>观察窗口: <span className="font-medium text-text-main">发布后 14 天</span></span>
                  <span className="text-brand-700 font-medium">已观察第 3 天 (进行中)</span>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-3 gap-2.5 pt-1">
                  <div className="p-3 bg-surface-2 rounded-lg border border-border-default text-center">
                    <div className="text-[13px] text-text-tertiary">预估浏览</div>
                    <div className="text-[16px] font-semibold tabular-nums text-text-main mt-0.5">1,248</div>
                  </div>
                  <div className="p-3 bg-surface-2 rounded-lg border border-border-default text-center">
                    <div className="text-[13px] text-text-tertiary">点赞互动</div>
                    <div className="text-[16px] font-semibold tabular-nums text-text-main mt-0.5">86</div>
                  </div>
                  <div className="p-3 bg-surface-2 rounded-lg border border-border-default text-center">
                    <div className="text-[13px] text-text-tertiary">收藏保存</div>
                    <div className="text-[16px] font-semibold tabular-nums text-text-main mt-0.5">52</div>
                  </div>
                  <div className="p-3 bg-surface-2 rounded-lg border border-border-default text-center">
                    <div className="text-[13px] text-text-tertiary">评论咨询</div>
                    <div className="text-[16px] font-semibold tabular-nums text-text-main mt-0.5">14</div>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100 text-center col-span-2">
                    <div className="text-[13px] text-emerald-700 font-medium">有效换粮咨询</div>
                    <div className="text-[16px] font-semibold tabular-nums text-emerald-900 mt-0.5">9 条</div>
                  </div>
                </div>

                <div className="text-[13px] text-text-tertiary leading-relaxed pt-2 border-t border-border-default">
                  搜索卡位：关键词【幼犬换粮软便】当前排在第 8 位；收录正常。
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border-default bg-surface-1 flex justify-between items-center shrink-0">
          <div className="text-[13px] text-text-tertiary">
            {readiness.readyToPublish ? "标题、正文、标签与素材已完整" : `还缺：${readiness.missing.join("、") || "待确认"}`}
          </div>
          <div className="flex items-center gap-2">
            {primaryAction && onExecuteAction && (
              <button onClick={() => onExecuteAction(primaryAction.action)} className="px-4 py-2 bg-btn-main text-white font-medium text-[13px] rounded-xl hover:bg-btn-main-hover transition-colors">
                {primaryAction.label}
              </button>
            )}
            <button onClick={onClose} className="px-4 py-2 border border-border-default bg-surface-1 text-text-secondary font-medium text-[13px] rounded-xl hover:bg-hover-bg transition-colors">
              关闭
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  X, Image as ImageIcon, FileText, Send, Eye, 
  ArrowUp, ArrowDown, Trash2, Plus, ExternalLink, 
  CheckCircle2, AlertCircle, Sparkles, Camera
} from "lucide-react";
import { Note } from "../../../data/projectStore";
import { getUnifiedBusinessStatus, getStatusStyleClass } from "../../../utils/noteStatus";

interface NormalNoteDetailDrawerProps {
  note: Note;
  projectId?: string;
  onClose: () => void;
  onOpenExecutionCenter?: () => void;
  onSelectFromMaterials?: () => void;
  onTriggerPhotoTask?: () => void;
}

export function NormalNoteDetailDrawer({
  note,
  projectId,
  onClose,
  onOpenExecutionCenter,
  onSelectFromMaterials,
  onTriggerPhotoTask,
}: NormalNoteDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState<"content" | "images" | "publish" | "observe">("content");

  // Editable / manageable image state
  const defaultImages = [
    { id: "img_1", url: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop", name: "幼犬换粮吃食封面图" },
    { id: "img_2", url: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&auto=format&fit=crop", name: "狗粮颗粒硬度微距特写" },
    { id: "img_3", url: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=600&auto=format&fit=crop", name: "成分报告与益生菌说明" },
  ];

  const [images, setImages] = useState(defaultImages);

  const uStatus = getUnifiedBusinessStatus(note);
  const style = getStatusStyleClass(uStatus);

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
        className="absolute inset-0 bg-neutral-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />
      
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 220 }}
        className="relative w-full max-w-[580px] bg-[#fcfcfc] h-full shadow-2xl flex flex-col z-10 border-l border-neutral-200"
      >
        {/* Header */}
        <div className="p-5 border-b border-neutral-200 bg-white flex justify-between items-start shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-[16px] font-extrabold text-neutral-900 truncate max-w-[360px]">
                {note.title || note.contentDirection || "未命名笔记"}
              </h2>
              <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border shrink-0 ${style.bg} ${style.text} ${style.border}`}>
                {uStatus}
              </span>
            </div>
            <div className="flex items-center gap-3 text-[12px] text-neutral-500">
              <span>账号: <strong className="text-neutral-800">{note.account || "特唯普官方旗舰店"}</strong></span>
              <span>·</span>
              <span>类型: <strong className="text-neutral-700">{note.type || "品牌号"}</strong></span>
              <span>·</span>
              <span>计划: {note.plannedDate || "2026-08-15"}</span>
            </div>
          </div>

          <button 
            onClick={onClose} 
            className="p-2 text-neutral-400 hover:text-neutral-900 rounded-xl hover:bg-neutral-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 bg-white border-b border-neutral-200 flex gap-4 text-[13px] font-bold shrink-0">
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
                activeTab === tab.id ? "text-neutral-900" : "text-neutral-400 hover:text-neutral-600"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="noteTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-neutral-900 rounded-full"
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
                <div className="bg-white rounded-xl p-4 border border-indigo-200/80 shadow-2xs space-y-3 bg-gradient-to-br from-indigo-50/40 to-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-indigo-600" />
                      <h4 className="font-bold text-neutral-900 text-[13.5px]">
                        消费者真实问卷结果
                      </h4>
                    </div>
                    <span className="text-[11px] px-2 py-0.5 bg-indigo-50 text-indigo-700 font-bold rounded-md border border-indigo-200">
                      AI 依据答卷个性化起草
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 text-[12px] pt-1">
                    <div className="p-2.5 bg-neutral-50 rounded-lg border border-neutral-100">
                      <span className="text-neutral-500 font-medium block text-[11px]">宠物月龄与品种</span>
                      <span className="font-bold text-neutral-900 mt-0.5 block">
                        {note.consumerQuestionnaire.petBreed || "金毛幼犬"} · {note.consumerQuestionnaire.petAge || "4个月"}
                      </span>
                    </div>

                    <div className="p-2.5 bg-neutral-50 rounded-lg border border-neutral-100">
                      <span className="text-neutral-500 font-medium block text-[11px]">推荐意愿</span>
                      <span className="font-bold text-emerald-700 mt-0.5 block">
                        {note.consumerQuestionnaire.willingnessToRecommend || "一定会推荐"}
                      </span>
                    </div>

                    <div className="p-2.5 bg-neutral-50 rounded-lg border border-neutral-100 col-span-2">
                      <span className="text-neutral-500 font-medium block text-[11px]">换粮前主要困扰</span>
                      <span className="font-medium text-neutral-800 mt-0.5 block">
                        {note.consumerQuestionnaire.symptom || "幼犬初次换粮软便拉稀、食欲挑食"}
                      </span>
                    </div>

                    <div className="p-2.5 bg-neutral-50 rounded-lg border border-neutral-100 col-span-2">
                      <span className="text-neutral-500 font-medium block text-[11px]">试用效果与真实变化</span>
                      <span className="font-medium text-neutral-800 mt-0.5 block">
                        {note.consumerQuestionnaire.experience || "按照7日换粮法第4天便便完全成型，精神活泼，胃口大开"}
                      </span>
                    </div>
                  </div>

                  <div className="text-[11px] text-neutral-400 flex items-center justify-between pt-1 border-t border-neutral-100">
                    <span>问卷来源: {note.consumerQuestionnaire.sourcePackageName || "换粮体验事实问卷 (标准版)"}</span>
                    <span>提交时间: {note.consumerQuestionnaire.submittedAt || "2024-03-06 08:30"}</span>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-xl p-4 border border-neutral-200 shadow-2xs space-y-3">
                <div>
                  <label className="text-[12px] text-neutral-500 font-medium block mb-1">笔记标题</label>
                  <div className="font-bold text-neutral-900 text-[14px] bg-neutral-50 p-3 rounded-lg border border-neutral-100">
                    {note.title || "幼犬换粮总软便？宠物店长教你3步过渡避坑指南"}
                  </div>
                </div>

                <div>
                  <label className="text-[12px] text-neutral-500 font-medium block mb-1">笔记正文</label>
                  <div className="text-neutral-800 leading-relaxed bg-neutral-50 p-3 rounded-lg border border-neutral-100 whitespace-pre-line text-[12.5px] max-h-60 overflow-y-auto">
                    {note.body || `很多新手家长在幼犬3-6个月换粮期，常常遇到软便拉稀的问题。\n\n其实幼犬肠胃娇嫩，换粮最忌讳直接一刀切！\n\n📌 建议遵循【7日渐进换粮法】：\nDay 1-2：旧粮 80% + 新粮 20%\nDay 3-4：旧粮 50% + 新粮 50%\nDay 5-6：旧粮 20% + 新粮 80%\nDay 7+：完全过渡为新粮\n\n✨ 核心划重点：搭配活性益生菌配方，有助于平稳建立肠道菌群。如果狗狗有挑食问题，可以温水微泡激发肉香。`}
                  </div>
                </div>

                <div>
                  <label className="text-[12px] text-neutral-500 font-medium block mb-1.5">话题与标签</label>
                  <div className="flex flex-wrap gap-1.5">
                    {["#幼犬换粮", "#新手养狗避坑", "#狗狗软便", "#宠物店长科普", "#特唯普宠粮"].map((tag) => (
                      <span key={tag} className="px-2.5 py-1 bg-neutral-100 text-neutral-700 text-[11.5px] font-medium rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[12px] text-neutral-500">
                  <span>发布主体: <strong className="text-neutral-800">{note.account || "特唯普官方旗舰店"}</strong></span>
                  <span>内容状态: <strong className="text-emerald-700">已就绪</strong></span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 图片 */}
          {activeTab === "images" && (
            <div className="space-y-4 text-[13px]">
              {/* Picture count banner */}
              <div className="p-3 bg-neutral-100 rounded-xl border border-neutral-200 text-[12.5px] flex items-center justify-between">
                <span className="text-neutral-700">
                  当前 <strong>{images.length}</strong> 张 · 建议 3-6 张
                </span>
                {images.length < 3 ? (
                  <span className="text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[11.5px]">
                    尚缺 {3 - images.length} 张
                  </span>
                ) : (
                  <span className="text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11.5px]">
                    数量达标
                  </span>
                )}
              </div>

              {/* Action bar */}
              <div className="flex gap-2">
                {onSelectFromMaterials && (
                  <button
                    onClick={onSelectFromMaterials}
                    className="flex-1 py-2 bg-white border border-neutral-200 rounded-xl text-[12px] font-bold text-neutral-700 hover:bg-neutral-50 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Plus size={13} /> 从素材中心选择
                  </button>
                )}
                {onTriggerPhotoTask && (
                  <button
                    onClick={onTriggerPhotoTask}
                    className="flex-1 py-2 bg-white border border-neutral-200 rounded-xl text-[12px] font-bold text-neutral-700 hover:bg-neutral-50 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Camera size={13} /> 发起拍摄任务
                  </button>
                )}
              </div>

              {/* Image List (Unified hierarchy: 1st is cover) */}
              <div className="space-y-3">
                {images.map((img, index) => (
                  <div
                    key={img.id}
                    className="bg-white rounded-xl p-3 border border-neutral-200 shadow-2xs flex items-center gap-3"
                  >
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200">
                      <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                      {index === 0 && (
                        <div className="absolute top-0 left-0 right-0 bg-neutral-900/80 text-white text-[9px] font-bold py-0.5 text-center">
                          封面
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-bold text-neutral-900 truncate">
                        P{index + 1}: {img.name}
                      </div>
                      <div className="text-[11.5px] text-neutral-400 mt-0.5">
                        {index === 0 ? "第一张将作为小红书封面图" : `内图 ${index}`}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => moveImage(index, "up")}
                        disabled={index === 0}
                        className="p-1 text-neutral-400 hover:text-neutral-900 disabled:opacity-30 rounded hover:bg-neutral-100"
                        title="上移"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        onClick={() => moveImage(index, "down")}
                        disabled={index === images.length - 1}
                        className="p-1 text-neutral-400 hover:text-neutral-900 disabled:opacity-30 rounded hover:bg-neutral-100"
                        title="下移"
                      >
                        <ArrowDown size={14} />
                      </button>
                      <button
                        onClick={() => removeImage(index)}
                        className="p-1 text-neutral-400 hover:text-rose-600 rounded hover:bg-rose-50"
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
              <div className="bg-white rounded-xl p-4 border border-neutral-200 shadow-2xs space-y-3">
                <h4 className="font-bold text-neutral-900 text-[13.5px]">发布执行事实</h4>
                
                <div className="space-y-2.5 text-[12.5px]">
                  <div className="flex justify-between items-center py-1.5 border-b border-neutral-100">
                    <span className="text-neutral-500">发布类型</span>
                    <span className="font-bold text-neutral-900">{note.type || "品牌号定向发布"}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-neutral-100">
                    <span className="text-neutral-500">发布主体/执行人</span>
                    <span className="font-bold text-neutral-900">{note.account || "特唯普官方旗舰店 (张店长)"}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-neutral-100">
                    <span className="text-neutral-500">计划发布时间</span>
                    <span className="font-bold text-neutral-900">{note.plannedDate || "2026-08-15"}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-neutral-100">
                    <span className="text-neutral-500">小红书发布事实</span>
                    <span className="font-medium text-neutral-800">
                      {hasRedNoteId ? "已完成发布并识别" : "等待外部执行端在小红书完成发布"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1.5">
                    <span className="text-neutral-500">小红书笔记ID</span>
                    <span className="font-mono text-neutral-700">
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
                    className="w-full py-2.5 bg-white border border-neutral-200 text-neutral-800 rounded-xl text-[12.5px] font-bold hover:bg-neutral-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <ExternalLink size={14} /> 查看小红书原笔记
                  </a>
                )}

                {uStatus === "异常" && onOpenExecutionCenter && (
                  <button
                    onClick={onOpenExecutionCenter}
                    className="w-full py-2.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-[12.5px] font-bold hover:bg-rose-100 transition-colors flex items-center justify-center gap-2"
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
              <div className="bg-white rounded-xl p-4 border border-neutral-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-neutral-900 text-[13.5px]">观察周期与进度</h4>
                  <span className="text-[11.5px] text-neutral-500">最近更新: 10分钟前</span>
                </div>

                <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-100 text-[12px] flex justify-between items-center">
                  <span>观察窗口: <strong>发布后 14 天</strong></span>
                  <span className="text-primary-700 font-bold">已观察第 3 天 (进行中)</span>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-3 gap-2.5 pt-1">
                  <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-100 text-center">
                    <div className="text-[11px] text-neutral-500">预估浏览</div>
                    <div className="text-[16px] font-extrabold text-neutral-900 mt-0.5">1,248</div>
                  </div>
                  <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-100 text-center">
                    <div className="text-[11px] text-neutral-500">点赞互动</div>
                    <div className="text-[16px] font-extrabold text-neutral-900 mt-0.5">86</div>
                  </div>
                  <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-100 text-center">
                    <div className="text-[11px] text-neutral-500">收藏保存</div>
                    <div className="text-[16px] font-extrabold text-neutral-900 mt-0.5">52</div>
                  </div>
                  <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-100 text-center">
                    <div className="text-[11px] text-neutral-500">评论咨询</div>
                    <div className="text-[16px] font-extrabold text-neutral-900 mt-0.5">14</div>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100 text-center col-span-2">
                    <div className="text-[11px] text-emerald-700">有效换粮咨询</div>
                    <div className="text-[16px] font-extrabold text-emerald-900 mt-0.5">9 条</div>
                  </div>
                </div>

                <div className="text-[11.5px] text-neutral-500 leading-relaxed pt-2 border-t border-neutral-100">
                  💡 搜索卡位：关键词【幼犬换粮软便】当前排在第 8 位；AI收录正常。
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-200 bg-white flex justify-between items-center shrink-0">
          <div className="text-[12px] text-neutral-500">
            ID: {note.id || "note_single"}
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-neutral-900 text-white font-bold text-[13px] rounded-xl hover:bg-neutral-800 transition-colors"
          >
            完成查看
          </button>
        </div>
      </motion.div>
    </div>
  );
}

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  X, HelpCircle, FileText, Camera, Send, 
  CheckCircle2, AlertCircle, ChevronRight, Edit3, Image as ImageIcon, QrCode, ExternalLink
} from "lucide-react";
import { Note } from "../../../data/projectStore";

interface NotePackageDetailDrawerProps {
  note: Note;
  projectId?: string;
  onClose: () => void;
  onEditQuestionnaire?: () => void;
}

export function NotePackageDetailDrawer({
  note,
  projectId,
  onClose,
  onEditQuestionnaire,
}: NotePackageDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState<"reqs" | "questionnaire" | "photos" | "publish">("reqs");
  const [showQuestionnairePreview, setShowQuestionnairePreview] = useState(false);

  const claimedCount = note.claimedCount || 4;
  const totalCount = note.totalSlotsCount || 10;
  const isQuestionnaireEnabled = note.packageSpec?.questionnaireStatus !== "未启用";

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
              <h2 className="text-[16px] font-semibold text-text-main">
                {note.title || "消费者体验测评内容包"}
              </h2>
              <span className="px-2 py-0.5 bg-surface-2 text-text-secondary text-[11px] font-normal rounded border border-border-default">
                消费者KOC · 笔记包
              </span>
            </div>
            <div className="flex items-center gap-3 text-[12px] text-text-tertiary">
              <span>招募进度: <span className="font-semibold text-text-main tabular-nums">{claimedCount}</span> / <span className="tabular-nums">{totalCount}</span> 人已领取</span>
              <span>·</span>
              <span>体验反馈: <span className="font-medium text-emerald-700">{isQuestionnaireEnabled ? "已配置" : "未配置"}</span></span>
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
            { id: "reqs", label: "生成要求" },
            { id: "questionnaire", label: "体验反馈" },
            { id: "photos", label: "照片拍摄要求" },
            { id: "publish", label: "发布要求" },
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
                  layoutId="packageTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-500 rounded-full"
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: 生成要求 */}
          {activeTab === "reqs" && (
            <div className="space-y-4 text-[13px]">
              {/* Dynamic Note banner */}
              <div className="p-3.5 bg-surface-2 rounded-xl border border-border-default text-text-secondary text-[12.5px] leading-relaxed flex items-start gap-2.5">
                <FileText size={16} className="text-text-secondary shrink-0 mt-0.5" />
                <div>
                  <strong className="text-text-main font-medium">动态即时生成说明：</strong> 本内容包不是固定模板复制。消费者领取后提交真实体验反馈，反馈与该内容包及当前方案版本绑定，再生成消费者视角的个人笔记。
                </div>
              </div>

              {/* Must cover info */}
              <div className="bg-surface-1 rounded-xl p-4 border border-border-default space-y-2">
                <h4 className="font-semibold text-text-main text-[13.5px]">必须覆盖的信息</h4>
                <p className="text-text-secondary leading-relaxed bg-surface-2 p-3 rounded-lg border border-border-default">
                  {note.packageSpec?.guidelines || "说明狗狗具体品种与月龄，记录从软便到便便成型的真实换粮过程；突出专利益生菌在幼犬换粮期的护肠吸收保护效果。"}
                </p>
              </div>

              {/* Forbidden terms */}
              <div className="bg-surface-1 rounded-xl p-4 border border-border-default space-y-2">
                <h4 className="font-semibold text-text-main text-[13.5px]">禁止表达与合规红线</h4>
                <p className="text-danger leading-relaxed bg-danger-light p-3 rounded-lg border border-danger-light font-normal text-[12.5px]">
                  严禁出现“100%不拉稀”、“处方药级疗效”、“包治百病”等绝对化或医疗化词汇；严禁拉踩其他宠粮品牌。
                </p>
              </div>

              {/* Angles & Tone */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-surface-1 rounded-xl p-3.5 border border-border-default space-y-1">
                  <span className="text-[11.5px] text-text-tertiary font-normal">内容角度范围</span>
                  <div className="font-medium text-text-main text-[12.5px]">
                    换粮避坑测评 / 幼犬成长记录 / 软便改善分享
                  </div>
                </div>

                <div className="bg-surface-1 rounded-xl p-3.5 border border-border-default space-y-1">
                  <span className="text-[11.5px] text-text-tertiary font-normal">建议语气与风格</span>
                  <div className="font-medium text-text-main text-[12.5px]">
                    真实亲切、高口语化、生活感强、真诚种草
                  </div>
                </div>

                <div className="bg-surface-1 rounded-xl p-3.5 border border-border-default space-y-1">
                  <span className="text-[11.5px] text-text-tertiary font-normal">建议字数范围</span>
                  <div className="font-medium text-text-main text-[12.5px]">
                    250 - 450 字 (小红书精炼图文)
                  </div>
                </div>

                <div className="bg-surface-1 rounded-xl p-3.5 border border-border-default space-y-1">
                  <span className="text-[11.5px] text-text-tertiary font-normal">推荐话题与标签</span>
                  <div className="font-medium text-text-main text-[12.5px]">
                    #幼犬换粮 #养狗避坑 #狗狗软便 #特唯普
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 体验反馈 */}
          {activeTab === "questionnaire" && (
            <div className="space-y-4 text-[13px]">
              <div className="p-3.5 bg-hover-bg/70 rounded-xl border border-border-default text-[12.5px] text-text-secondary leading-relaxed">
                <strong className="text-text-main font-medium">体验反馈作用：</strong> 消费者领取内容包后，用约 10 秒提交真实体验。反馈只影响这位消费者生成的笔记，不会修改内容包本身或其他消费者的内容。
              </div>

              <div className="bg-surface-1 rounded-xl p-4 border border-border-default space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-text-main text-[13.5px]">
                      内容包体验反馈 V{note.packageSpec?.feedbackVersion || 1}
                    </h4>
                    <span className="text-[11.5px] text-text-tertiary">共 {note.packageSpec?.feedbackQuestions?.length || 3} 题 · 约 10 秒完成</span>
                  </div>

                  {onEditQuestionnaire && (
                    <button
                      onClick={onEditQuestionnaire}
                      className="px-3 py-1.5 bg-btn-main text-white rounded-lg text-[12px] font-medium hover:bg-btn-main-hover transition-colors flex items-center gap-1.5"
                    >
                      <Edit3 size={13} /> 编辑体验反馈
                    </button>
                  )}
                </div>

                {/* Feedback question list */}
                <div className="space-y-2.5 pt-2 border-t border-border-default">
                  {(note.packageSpec?.feedbackQuestions || [
                    { id: "age", prompt: "狗狗现在多大？", options: ["0-3个月", "3-6个月", "6个月以上"], contentField: "identity" as const },
                    { id: "problem", prompt: "体验前最困扰什么？", options: ["软便/拉稀", "挑食不爱吃", "泪痕明显"], contentField: "problem" as const },
                    { id: "experience", prompt: "这次最真实的变化？", options: ["便便更成型", "胃口变好了", "暂时没明显变化"], contentField: "experience" as const }
                  ]).map((question, index) => (
                    <div key={question.id} className="p-3 bg-surface-2 rounded-lg border border-border-default space-y-1.5">
                      <div className="font-medium text-text-main text-[12.5px]">{index + 1}. {question.prompt}</div>
                      <div className="text-[11.5px] text-text-tertiary pl-3">{question.options.join(" / ")}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: 照片拍摄要求 */}
          {activeTab === "photos" && (
            <div className="space-y-4 text-[13px]">
              <div className="text-[12.5px] text-text-secondary">
                消费者仅需上传真实照片（仅限静态照片），系统在提交后自动进行场景合规质检。
              </div>

              {/* Scene 1 */}
              <div className="bg-surface-1 rounded-xl p-4 border border-border-default space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-btn-main text-white text-[11px] font-medium flex items-center justify-center">
                      1
                    </div>
                    <h4 className="font-semibold text-text-main text-[13.5px]">
                      场景一：狗狗进食中与粮袋实景
                    </h4>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[11px] font-medium rounded border border-emerald-200">
                    必拍 · 1-2 张
                  </span>
                </div>

                <div className="space-y-2 text-[12px]">
                  <div className="p-2.5 bg-surface-2 rounded-lg border border-border-default text-text-secondary leading-relaxed">
                    <strong className="text-text-main font-medium">拍摄说明：</strong> 拍摄自然光线下狗狗吃粮的特写或半身照，画面中需露出产品包装袋一角或食盆。
                  </div>
                  <div className="p-2.5 bg-danger-light rounded-lg border border-danger-light text-danger font-normal">
                    <strong className="font-medium">不可出现内容：</strong> 严禁画面杂乱、出现竞品狗粮明显标识或反光模糊。
                  </div>
                </div>
              </div>

              {/* Scene 2 */}
              <div className="bg-surface-1 rounded-xl p-4 border border-border-default space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-btn-main text-white text-[11px] font-medium flex items-center justify-center">
                      2
                    </div>
                    <h4 className="font-semibold text-text-main text-[13.5px]">
                      场景二：狗狗精神面貌或生活全身照
                    </h4>
                  </div>
                  <span className="px-2 py-0.5 bg-hover-bg text-text-secondary text-[11px] font-medium rounded">
                    选拍 · 1 张
                  </span>
                </div>

                <div className="space-y-2 text-[12px]">
                  <div className="p-2.5 bg-surface-2 rounded-lg border border-border-default text-text-secondary leading-relaxed">
                    <strong className="text-text-main font-medium">拍摄说明：</strong> 狗狗精神饱满的生活照、玩耍照或便便成型后的打码对比，体现换粮成果。
                  </div>
                  <div className="p-2.5 bg-danger-light rounded-lg border border-danger-light text-danger font-normal">
                    <strong className="font-medium">不可出现内容：</strong> 严禁过度重口味特写导致观感不适。
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: 发布要求 */}
          {activeTab === "publish" && (
            <div className="space-y-4 text-[13px]">
              <div className="bg-surface-1 rounded-xl p-4 border border-border-default space-y-3">
                <h4 className="font-semibold text-text-main text-[13.5px]">执行时限与奖励规则</h4>
                
                <div className="grid grid-cols-2 gap-3 text-[12px]">
                  <div className="p-3 bg-surface-2 rounded-lg border border-border-default">
                    <div className="text-text-tertiary font-normal">领取有效期</div>
                    <div className="font-semibold text-text-main mt-0.5">扫码后 48 小时内</div>
                  </div>
                  <div className="p-3 bg-surface-2 rounded-lg border border-border-default">
                    <div className="text-text-tertiary font-normal">生成后发布时限</div>
                    <div className="font-semibold text-text-main mt-0.5">笔记生成后 24 小时内</div>
                  </div>
                  <div className="p-3 bg-surface-2 rounded-lg border border-border-default">
                    <div className="text-text-tertiary font-normal">发布奖励</div>
                    <div className="font-semibold text-emerald-700 mt-0.5">50元新品宠粮券 + 试用装</div>
                  </div>
                  <div className="p-3 bg-surface-2 rounded-lg border border-border-default">
                    <div className="text-text-tertiary font-normal">默认观察周期</div>
                    <div className="font-semibold text-text-main mt-0.5">发布后持续观察 14 天</div>
                  </div>
                </div>
              </div>

              <div className="bg-surface-1 rounded-xl p-4 border border-border-default space-y-3">
                <h4 className="font-semibold text-text-main text-[13.5px]">发布识别与提醒机制</h4>
                <div className="space-y-2.5 text-[12.5px] text-text-secondary">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong className="text-text-main font-medium">自动识别：</strong> 消费者在小红书App发布后无需手动粘贴笔记链接，系统将在 5-15 分钟内自动识别小红书笔记ID并绑定。</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong className="text-text-main font-medium">企业服务号提醒：</strong> 消费者领取时建议关注服务号，用于实时接收“笔记已生成”、“照片待补拍”、“奖励已到账”等通知。</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border-default bg-surface-1 flex justify-between items-center shrink-0">
          <div className="text-[12px] text-text-tertiary">
            ID: {note.id || "pkg_placeholder"}
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-btn-main text-white font-medium text-[13px] rounded-xl hover:bg-btn-main-hover transition-colors"
          >
            完成查看
          </button>
        </div>
      </motion.div>
    </div>
  );
}

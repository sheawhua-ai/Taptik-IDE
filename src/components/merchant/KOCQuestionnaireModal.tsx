import React, { useState } from "react";
import { X, Sparkles, CheckCircle2, Camera, FileText, HelpCircle } from "lucide-react";
import { Note } from "../../data/projectStore";
import { useProjectStore } from "../../context/ProjectContext";

interface KOCQuestionnaireModalProps {
  note: Note;
  onClose: () => void;
}

export const KOCQuestionnaireModal: React.FC<KOCQuestionnaireModalProps> = ({ note, onClose }) => {
  const { submitKOCQuestionnaire } = useProjectStore();

  const [petBreed, setPetBreed] = useState("会");
  const [petAge, setPetAge] = useState("3-6个月");
  const [symptom, setSymptom] = useState("软便/拉稀，挑食/不爱吃");
  const [experience, setExperience] = useState("便便成型，胃口变好");
  const [storeName, setStoreName] = useState("上海陆家嘴旗舰店");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      submitKOCQuestionnaire(note.id, {
        petBreed,
        petAge,
        symptom,
        experience,
        storeName
      });
      setIsSubmitting(false);
      setIsDone(true);

      setTimeout(() => {
        onClose();
      }, 1200);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-btn-main/30 backdrop-blur-xs" onClick={onClose} />
      
      <div className="relative bg-surface-1 rounded-xl w-full max-w-xl shadow-2xl overflow-hidden border border-border-default">
        <div className="p-5 border-b border-border-default flex justify-between items-center bg-page-bg">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary-100 text-primary-700 rounded-xl">
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className="font-bold text-[16px] text-text-main">KOC 体验官问卷提交</h3>
              <p className="text-[12px] text-text-tertiary">提交问卷即可根据【笔记包规则】即时生成专属笔记与拍摄任务</p>
            </div>
          </div>
          <button onClick={onClose} className="text-text-tertiary hover:text-text-secondary p-1 rounded-lg hover:bg-selected-bg transition-colors">
            <X size={18}/>
          </button>
        </div>

        {isDone ? (
          <div className="p-10 text-center space-y-3">
            <CheckCircle2 size={48} className="text-emerald-500 mx-auto animate-bounce" />
            <h4 className="text-[18px] font-bold text-text-main">问卷提交成功！</h4>
            <p className="text-[14px] text-text-tertiary">已即时生成专属笔记草稿，并向您下发按任务拍摄素材需求。</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            {/* Note Package Specs */}
            <div className="bg-brand-light/60 border border-primary-200 rounded-xl p-4 space-y-2 text-[13px]">
              <div className="font-bold text-primary-900 flex items-center gap-1.5">
                <FileText size={15} /> 笔记包规定（要怎么写）：
              </div>
              <div className="text-primary-800 leading-relaxed font-medium">
                {note.packageSpec?.guidelines || "【写作要求】需包含狗狗品种与月龄、7天换粮过渡心量、真实便便改善与体验推荐。"}
              </div>
              <div className="pt-2 border-t border-primary-200/80 font-bold text-primary-900 flex items-center gap-1.5 mt-2">
                <Camera size={15} /> 素材按任务拍摄需求：
              </div>
              <div className="text-primary-800 leading-relaxed">
                {note.packageSpec?.materialTaskReqs || "【任务拍摄】1. 幼犬进食干饭短视频(>10s) 1条；2. 试用粮与狗狗合影 2张。"}
              </div>
            </div>

            {/* Questionnaire Fields - Simple Choices */}
            <div className="space-y-6">
              {/* Q1 */}
              <div>
                <label className="block text-[13px] font-bold text-text-main mb-2">
                  1. 宠物当前月龄？ <span className="text-brand-logo">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {["0-3个月", "3-6个月", "6个月以上"].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setPetAge(opt)}
                      className={`px-4 py-2 rounded-xl text-[13px] font-medium border transition-colors ${
                        petAge === opt 
                          ? 'border-primary-500 bg-brand-light text-primary-700 font-bold shadow-xs' 
                          : 'border-border-default bg-surface-1 text-text-secondary hover:bg-page-bg'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Q2 */}
              <div>
                <label className="block text-[13px] font-bold text-text-main mb-2">
                  2. 换粮前最主要的困扰？(可多选) <span className="text-brand-logo">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {["软便/拉稀", "挑食/不爱吃", "泪痕严重", "毛发粗糙", "太瘦不长肉"].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        if (symptom.includes(opt)) {
                          setSymptom(symptom.replace(opt + "，", "").replace(opt, "").replace(/，$/, ""));
                        } else {
                          setSymptom(symptom ? symptom + "，" + opt : opt);
                        }
                      }}
                      className={`px-4 py-2 rounded-xl text-[13px] font-medium border transition-colors ${
                        symptom.includes(opt) 
                          ? 'border-primary-500 bg-brand-light text-primary-700 font-bold shadow-xs' 
                          : 'border-border-default bg-surface-1 text-text-secondary hover:bg-page-bg'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Q3 */}
              <div>
                <label className="block text-[13px] font-bold text-text-main mb-2">
                  3. 试用本产品的效果？(可多选) <span className="text-brand-logo">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {["便便成型", "胃口变好", "毛发变亮", "长肉发腮", "无明显变化"].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        if (experience.includes(opt)) {
                          setExperience(experience.replace(opt + "，", "").replace(opt, "").replace(/，$/, ""));
                        } else {
                          setExperience(experience ? experience + "，" + opt : opt);
                        }
                      }}
                      className={`px-4 py-2 rounded-xl text-[13px] font-medium border transition-colors ${
                        experience.includes(opt) 
                          ? 'border-primary-500 bg-brand-light text-primary-700 font-bold shadow-xs' 
                          : 'border-border-default bg-surface-1 text-text-secondary hover:bg-page-bg'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Q4 */}
              <div>
                <label className="block text-[13px] font-bold text-text-main mb-2">
                  4. 你会向朋友推荐吗？ <span className="text-brand-logo">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {["会", "可能会", "不会"].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setPetBreed(opt)}
                      className={`px-4 py-2 rounded-xl text-[13px] font-medium border transition-colors ${
                        petBreed === opt 
                          ? 'border-primary-500 bg-brand-light text-primary-700 font-bold shadow-xs' 
                          : 'border-border-default bg-surface-1 text-text-secondary hover:bg-page-bg'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border-default flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-border-default text-text-secondary text-[13px] font-bold rounded-xl hover:bg-page-bg transition-colors"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 bg-primary-600 text-white text-[13px] font-bold rounded-xl hover:bg-primary-700 transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50"
              >
                <Sparkles size={14} />
                {isSubmitting ? "即时生成笔记中..." : "提交问卷并即时生成笔记"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

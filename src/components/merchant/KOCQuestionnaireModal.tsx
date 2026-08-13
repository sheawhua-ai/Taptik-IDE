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

  const [petBreed, setPetBreed] = useState("柯基幼犬");
  const [petAge, setPetAge] = useState("4个月");
  const [symptom, setSymptom] = useState("吃颗粒太硬的旧粮频繁拉软便，不敢轻易换粮");
  const [experience, setExperience] = useState("按照7天递减混粮法，第3天便便形状就很漂亮了！粮粒酥脆，狗狗秒干饭。");
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
      <div className="absolute inset-0 bg-neutral-900/30 backdrop-blur-xs" onClick={onClose} />
      
      <div className="relative bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden border border-[#EAECF0]">
        <div className="p-5 border-b border-[#EAECF0] flex justify-between items-center bg-[#F7F8FA]">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary-100 text-primary-700 rounded-xl">
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className="font-bold text-[16px] text-[#111827]">KOC 体验官问卷提交</h3>
              <p className="text-[12px] text-[#667085]">提交问卷即可根据【笔记包规则】即时生成专属笔记与拍摄任务</p>
            </div>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-[#667085] p-1 rounded-lg hover:bg-neutral-200">
            <X size={18}/>
          </button>
        </div>

        {isDone ? (
          <div className="p-10 text-center space-y-3">
            <CheckCircle2 size={48} className="text-emerald-500 mx-auto animate-bounce" />
            <h4 className="text-[18px] font-bold text-[#111827]">问卷提交成功！</h4>
            <p className="text-[14px] text-[#667085]">已即时生成专属笔记草稿，并向您下发按任务拍摄素材需求。</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            {/* Note Package Specs */}
            <div className="bg-primary-50/60 border border-primary-200 rounded-xl p-4 space-y-2 text-[13px]">
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

            {/* Questionnaire Fields */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-bold text-[#111827] mb-1">
                    宠物品种 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={petBreed}
                    onChange={(e) => setPetBreed(e.target.value)}
                    placeholder="如：柯基幼犬"
                    className="w-full px-3 py-2 bg-white border border-[#EAECF0] rounded-xl text-[13px] outline-none focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-[#111827] mb-1">
                    宠物月龄/年龄 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={petAge}
                    onChange={(e) => setPetAge(e.target.value)}
                    placeholder="如：4个月"
                    className="w-full px-3 py-2 bg-white border border-[#EAECF0] rounded-xl text-[13px] outline-none focus:border-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-[#111827] mb-1">
                  换粮前主要困扰/痛点 <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={symptom}
                  onChange={(e) => setSymptom(e.target.value)}
                  placeholder="如：吃颗粒太硬的旧粮经常拉软便，不敢随便换粮..."
                  className="w-full px-3 py-2 bg-white border border-[#EAECF0] rounded-xl text-[13px] outline-none focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-[#111827] mb-1">
                  7天试用心得与效果 feedback <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="如：按照7天减量换粮法，第3天便便形状就很漂亮了！狗狗特别爱吃..."
                  className="w-full px-3 py-2 bg-white border border-[#EAECF0] rounded-xl text-[13px] outline-none focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-[#111827] mb-1">
                  关联体验门店/领样渠道
                </label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="如：上海陆家嘴旗舰店"
                  className="w-full px-3 py-2 bg-white border border-[#EAECF0] rounded-xl text-[13px] outline-none focus:border-primary-500"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#EAECF0] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-[#EAECF0] text-[#111827] text-[13px] font-medium rounded-xl hover:bg-neutral-50 transition-colors"
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

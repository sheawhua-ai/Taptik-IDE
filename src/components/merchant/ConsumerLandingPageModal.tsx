import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Smartphone, CheckCircle2, Upload, 
  Sparkles, Send, Copy, Check, ChevronRight, 
  ExternalLink, RefreshCw, AlertCircle, Award
} from "lucide-react";
import { Project } from "../../data/projectStore";

interface Props {
  project?: Project;
  onClose: () => void;
}

export function ConsumerLandingPageModal({ project, onClose }: Props) {
  const [step, setStep] = useState<
    "claim" | "questionnaire" | "generating" | "note_confirm" | "photos" | "checking" | "photo_retry" | "publish" | "recognized"
  >("claim");

  // Questionnaire state
  const contentPackage = project?.notes?.find(note => note.isNotePackage);
  const feedbackVersion = contentPackage?.packageSpec?.feedbackVersion || 1;
  const [answers, setAnswers] = useState({
    petAge: "",
    problem: "",
    effect: ""
  });

  // Generated note state
  const [title, setTitle] = useState("我家3个月金毛幼犬换粮体验，记录7天软便改善！");
  const [body, setBody] = useState(
    `今天给各位新手铲屎官分享真实的幼犬换粮经验！\n\n我家金毛刚满3个月，之前换粮老拉稀软便，愁死人了。\n\n后来按照【7天渐进过渡法】，搭配这款特唯普专利益生菌粮，第5天便便就完全成型了！适口性也很赞，颗粒大小刚好适合幼犬咀嚼。\n\n有同款换粮焦虑的家长可以放心冲！\n\n#幼犬换粮 #狗狗软便 #新手养狗避坑 #特唯普宠粮`
  );

  // Photo state
  const [photos, setPhotos] = useState<string[]>([
    "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop"
  ]);
  const [photoError, setPhotoError] = useState("");

  const [copiedTitle, setCopiedTitle] = useState(false);
  const [copiedBody, setCopiedBody] = useState(false);

  const handleStartQuestionnaire = () => {
    setStep("questionnaire");
  };

  const handleSubmitQuestionnaire = () => {
    setStep("generating");
    setTimeout(() => {
      // Synthesize note based on user's answers
      if (answers.problem.includes("挑食")) {
        setTitle("挑食狗狂喜！我家幼犬换粮成功，大口炫粮记录");
        setBody(
          `我家挑食小怪兽终于肯好好吃饭了！\n\n之前换了好几款粮都不爱吃，这次换特唯普幼犬粮，微温水泡一下肉香好浓，秒光盘！\n\n而且益生菌配方肠胃适应得很好，一点没软便，太省心了！\n\n#幼犬换粮 #狗狗挑食 #新手养狗 #特唯普`
        );
      } else {
        setTitle(`我家${answers.petAge}金毛换粮测评，终于告别${answers.problem}！`);
        setBody(
          `真心分享换粮经验！之前因为${answers.problem}天天提心吊胆。\n\n按方法过渡到特唯普幼犬粮后，我最真实的感受是${answers.effect}。每只狗狗的情况不一样，这是我自己的体验记录，也会继续观察。\n\n#幼犬换粮 #狗狗软便改善 #真实养宠记录 #养宠日常`
        );
      }
      setStep("note_confirm");
    }, 1800);
  };

  const handleCheckPhotos = (simulateFail = false) => {
    setStep("checking");
    setTimeout(() => {
      if (simulateFail || photos.length === 0) {
        setPhotoError("未识别到产品包装袋或清晰吃食场景，请补拍 1 张产品合影");
        setStep("photo_retry");
      } else {
        setStep("publish");
      }
    }, 1500);
  };

  const handleCopy = (text: string, type: "title" | "body") => {
    navigator.clipboard.writeText(text);
    if (type === "title") {
      setCopiedTitle(true);
      setTimeout(() => setCopiedTitle(false), 2000);
    } else {
      setCopiedBody(true);
      setTimeout(() => setCopiedBody(false), 2000);
    }
  };

  const handleOpenApp = () => {
    setTimeout(() => {
      setStep("recognized");
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-btn-main/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative flex bg-transparent max-h-[92vh] w-full max-w-[840px] z-10"
      >
        {/* Left Side: Desktop Guidance */}
        <div className="hidden md:flex flex-col w-[390px] bg-surface-1 rounded-l-3xl p-7 border-r border-border-default justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Smartphone size={22} className="text-text-main" />
              <h3 className="text-[18px] font-extrabold text-text-main">
                消费者 KOC 移动端 H5
              </h3>
            </div>
            
            <p className="text-[13px] text-text-secondary leading-relaxed">
              消费者领取内容包后，用约 10 秒提交真实体验反馈。反馈与该内容包、当前方案版本绑定，并据此生成消费者视角的个人笔记。
            </p>

            <div className="p-3.5 bg-page-bg rounded-xl border border-border-default space-y-2.5 text-[12.5px]">
              <div className="font-bold text-text-main">全流程自动化闭环：</div>
              <div className="space-y-2 text-text-secondary">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                  <span>3 个真实体验选择（约 10 秒）</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                  <span>反馈绑定内容包与当前方案版本</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                  <span>上传照片自动场景质检与智能补拍</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                  <span>内容与素材完整后进入待发笔记池</span>
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-full py-2.5 bg-hover-bg text-text-secondary font-bold rounded-xl hover:bg-selected-bg transition-colors text-[13px]"
          >
            关闭模拟器
          </button>
        </div>

        {/* Right Side: Mobile Phone Frame */}
        <div className="flex-1 flex flex-col items-center bg-hover-bg/90 p-4 md:rounded-r-3xl rounded-2xl relative overflow-hidden backdrop-blur-sm shadow-2xl">
          <div className="w-[360px] h-[680px] bg-surface-1 rounded-[38px] shadow-2xl border-[10px] border-neutral-900 overflow-hidden relative flex flex-col">
            
            {/* Status bar */}
            <div className="h-6 w-full bg-surface-1 flex justify-between items-center px-6 text-[11px] font-bold text-text-main shrink-0">
              <span>09:41</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px]">5G</span>
                <div className="w-4 h-2.5 bg-btn-main rounded-[2px]" />
              </div>
            </div>

            {/* Mobile Scrollable Viewport */}
            <div className="flex-1 overflow-y-auto bg-page-bg relative">
              
              {/* STEP 1: 扫码领取落地页 */}
              {step === "claim" && (
                <div className="relative min-h-full pb-20 bg-surface-1">
                  <div className="h-[570px] bg-btn-main relative">
                    <img 
                      src={project?.landingPageSettings?.bannerUrl || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&auto=format&fit=crop"}
                      className="w-full h-full object-cover"
                      alt="活动海报"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent px-4 pb-5 pt-24 text-white">
                      <div className="text-[10.5px] text-white/80">即将领取</div>
                      <div className="mt-1 text-[15px] font-bold line-clamp-2">{contentPackage?.title || contentPackage?.contentDirection || "消费者真实体验内容包"}</div>
                      <div className="mt-1.5 text-[11px] leading-relaxed text-white/80">
                        领取后提交 3 个真实体验选择，反馈将与内容包绑定并生成你的个人笔记。
                      </div>
                    </div>
                  </div>

                  <div className="fixed bottom-3 left-3 right-3 max-w-[336px] mx-auto z-20">
                    <button
                      onClick={handleStartQuestionnaire}
                      className="w-full py-3 bg-btn-main text-white font-bold text-[14px] rounded-xl shadow-lg active:scale-95 transition-transform"
                    >
                      领取内容包
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: 真实体验反馈 */}
              {step === "questionnaire" && (
                <div className="p-4 space-y-4 pb-20">
                  <div className="bg-surface-1 rounded-xl p-4 border border-border-default shadow-2xs space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-extrabold text-[15px] text-text-main">真实体验反馈</h3>
                      <span className="rounded bg-surface-subtle px-2 py-0.5 text-[10px] text-text-tertiary">约 10 秒</span>
                    </div>
                    <p className="text-[11.5px] text-text-tertiary">反馈 V{feedbackVersion} · 已绑定当前内容包，仅用于生成你的真实体验笔记</p>
                  </div>

                  {/* Q1 */}
                  <div className="bg-surface-1 rounded-xl p-3.5 border border-border-default space-y-2">
                    <div className="text-[12.5px] font-bold text-text-main">1. 狗狗现在多大？</div>
                    <div className="grid grid-cols-3 gap-2 text-[12px]">
                      {["0-3个月", "3-6个月", "6个月以上"].map((item) => (
                        <button
                          key={item}
                          onClick={() => setAnswers({ ...answers, petAge: item })}
                          className={`py-2 rounded-xl border text-center font-bold transition-all ${
                            answers.petAge === item
                              ? "bg-btn-main text-white border-neutral-900"
                              : "bg-page-bg text-text-secondary border-border-default"
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Q2 */}
                  <div className="bg-surface-1 rounded-xl p-3.5 border border-border-default space-y-2">
                    <div className="text-[12.5px] font-bold text-text-main">2. 体验前最困扰什么？</div>
                    <div className="grid grid-cols-2 gap-2 text-[12px]">
                      {["软便/拉稀", "挑食不爱吃", "泪痕严重", "太瘦不长肉"].map((item) => (
                        <button
                          key={item}
                          onClick={() => setAnswers({ ...answers, problem: item })}
                          className={`py-2 rounded-xl border text-center font-bold transition-all ${
                            answers.problem === item
                              ? "bg-btn-main text-white border-neutral-900"
                              : "bg-page-bg text-text-secondary border-border-default"
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Q3 */}
                  <div className="bg-surface-1 rounded-xl p-3.5 border border-border-default space-y-2">
                    <div className="text-[12.5px] font-bold text-text-main">3. 这次最真实的变化？</div>
                    <div className="grid grid-cols-2 gap-2 text-[12px]">
                      {["便便更成型", "胃口变好了", "状态更稳定", "暂时没明显变化"].map((item) => (
                        <button
                          key={item}
                          onClick={() => setAnswers({ ...answers, effect: item })}
                          className={`py-2 rounded-xl border text-center font-bold transition-all ${
                            answers.effect === item
                              ? "bg-btn-main text-white border-neutral-900"
                              : "bg-page-bg text-text-secondary border-border-default"
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="fixed bottom-3 left-3 right-3 max-w-[336px] mx-auto z-20">
                    <button
                      onClick={handleSubmitQuestionnaire}
                      disabled={!answers.petAge || !answers.problem || !answers.effect}
                      className="w-full py-3 bg-btn-main text-white font-bold text-[14px] rounded-xl shadow-lg active:scale-95 transition-transform disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      生成我的体验笔记
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: 生成中 */}
              {step === "generating" && (
                <div className="h-full flex flex-col items-center justify-center p-6 text-center space-y-3">
                  <Sparkles size={36} className="text-brand-logo animate-spin" />
                  <h3 className="font-extrabold text-[16px] text-text-main">
                    AI 正在根据你的真实反馈生成体验笔记...
                  </h3>
                  <p className="text-[12px] text-text-tertiary max-w-[260px]">
                    已提炼：{answers.petAge}幼犬 · 解决{answers.problem}痛点 · 采用真实亲测口吻
                  </p>
                </div>
              )}

              {/* STEP 4: 笔记确认与微调 */}
              {step === "note_confirm" && (
                <div className="p-4 space-y-3.5 pb-20 text-[13px]">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 text-[12px] font-bold">
                    <CheckCircle2 size={16} className="shrink-0" />
                    已为您生成专属换粮测评笔记！
                  </div>

                  <div className="bg-surface-1 rounded-xl p-3.5 border border-border-default shadow-2xs space-y-2">
                    <label className="text-[12px] font-bold text-text-secondary">推荐标题</label>
                    <div className="p-2.5 bg-page-bg rounded-xl text-[12.5px] font-bold text-text-main border border-border-default">
                      {title}
                    </div>
                  </div>

                  <div className="bg-surface-1 rounded-xl p-3.5 border border-border-default shadow-2xs space-y-2">
                    <label className="text-[12px] font-bold text-text-secondary">笔记正文</label>
                    <div className="p-2.5 bg-page-bg rounded-xl text-[11.5px] text-text-main leading-relaxed border border-border-default whitespace-pre-line max-h-48 overflow-y-auto">
                      {body}
                    </div>
                  </div>

                  <div className="fixed bottom-3 left-3 right-3 max-w-[336px] mx-auto z-20">
                    <button
                      onClick={() => setStep("photos")}
                      className="w-full py-3 bg-btn-main text-white font-bold text-[14px] rounded-xl shadow-lg active:scale-95 transition-transform"
                    >
                      下一步：上传体验照片
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 5: 上传照片 */}
              {(step === "photos" || step === "photo_retry") && (
                <div className="p-4 space-y-3.5 pb-20 text-[13px]">
                  {step === "photo_retry" && (
                    <div className="p-3 bg-rose-50 border border-danger-light rounded-xl text-danger text-[12px] font-medium space-y-1">
                      <div className="font-bold flex items-center gap-1.5">
                        <AlertCircle size={14} className="text-danger" />
                        AI 场景质检未通过
                      </div>
                      <div>{photoError}</div>
                    </div>
                  )}

                  <div className="bg-surface-1 rounded-xl p-3.5 border border-border-default shadow-2xs space-y-2">
                    <div className="font-bold text-text-main text-[13.5px]">拍摄要求</div>
                    <div className="text-[12px] text-text-secondary space-y-1 bg-page-bg p-2.5 rounded-xl border border-border-default">
                      <div><strong>场景 1 (必拍):</strong> 狗狗进食特写或与粮袋合影 (1-2张)</div>
                      <div><strong>场景 2 (选拍):</strong> 狗狗精神饱满生活照 (1张)</div>
                    </div>
                  </div>

                  <div className="bg-surface-1 rounded-xl p-3.5 border border-border-default shadow-2xs space-y-3">
                    <div className="flex items-center justify-between text-[12px] font-bold text-text-secondary">
                      <span>已选照片 ({photos.length})</span>
                      <button
                        onClick={() => setPhotos([...photos, "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&auto=format&fit=crop"])}
                        className="text-brand-logo font-bold hover:underline"
                      >
                        + 模拟加一张合影
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {photos.map((url, i) => (
                        <div key={i} className="aspect-square rounded-xl overflow-hidden border border-border-default relative">
                          <img src={url} alt="pet" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="fixed bottom-3 left-3 right-3 max-w-[336px] mx-auto z-20 space-y-2">
                    <button
                      onClick={() => handleCheckPhotos(false)}
                      className="w-full py-3 bg-btn-main text-white font-bold text-[14px] rounded-xl shadow-lg active:scale-95 transition-transform"
                    >
                      提交照片并进行 AI 质检
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 6: 照片检查中 */}
              {step === "checking" && (
                <div className="h-full flex flex-col items-center justify-center p-6 text-center space-y-3">
                  <RefreshCw size={32} className="text-brand-logo animate-spin" />
                  <h3 className="font-extrabold text-[15px] text-text-main">
                    AI 正在质检照片合规性...
                  </h3>
                  <p className="text-[12px] text-text-tertiary">
                    检测产品包装、吃食场景与光线清晰度
                  </p>
                </div>
              )}

              {/* STEP 7: 复制与发布 */}
              {step === "publish" && (
                <div className="p-4 space-y-3.5 pb-20 text-[13px]">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-[12px] font-bold flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    照片质检通过！请复制内容前往小红书发布
                  </div>

                  {/* Copy Title */}
                  <div className="bg-surface-1 rounded-xl p-3 border border-border-default space-y-2">
                    <div className="flex justify-between items-center text-[12px]">
                      <span className="font-bold text-text-secondary">1. 复制标题</span>
                      <button
                        onClick={() => handleCopy(title, "title")}
                        className={`px-3 py-1 rounded-lg text-[11.5px] font-bold ${
                          copiedTitle ? "bg-emerald-600 text-white" : "bg-btn-main text-white"
                        }`}
                      >
                        {copiedTitle ? "已复制" : "复制标题"}
                      </button>
                    </div>
                    <div className="text-[12px] text-text-main font-bold bg-page-bg p-2 rounded-lg truncate">
                      {title}
                    </div>
                  </div>

                  {/* Copy Body */}
                  <div className="bg-surface-1 rounded-xl p-3 border border-border-default space-y-2">
                    <div className="flex justify-between items-center text-[12px]">
                      <span className="font-bold text-text-secondary">2. 复制正文</span>
                      <button
                        onClick={() => handleCopy(body, "body")}
                        className={`px-3 py-1 rounded-lg text-[11.5px] font-bold ${
                          copiedBody ? "bg-emerald-600 text-white" : "bg-btn-main text-white"
                        }`}
                      >
                        {copiedBody ? "已复制" : "复制正文"}
                      </button>
                    </div>
                    <div className="text-[11.5px] text-text-secondary bg-page-bg p-2 rounded-lg max-h-24 overflow-y-auto whitespace-pre-line">
                      {body}
                    </div>
                  </div>

                  <div className="fixed bottom-3 left-3 right-3 max-w-[336px] mx-auto z-20">
                    <button
                      onClick={handleOpenApp}
                      className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-[14px] rounded-xl shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
                    >
                      <ExternalLink size={16} /> 打开小红书 App 发布
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 8: 发布成功自动识别 */}
              {step === "recognized" && (
                <div className="h-full flex flex-col items-center justify-center p-6 text-center space-y-4">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <Award size={32} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-[17px] text-text-main">
                      发布成功并自动识别！
                    </h3>
                    <p className="text-[12px] text-text-tertiary max-w-[260px]">
                      系统已绑定小红书笔记并生成观察任务，专属 50 元优惠券与礼包已发放至您的账户！
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 bg-btn-main text-white font-bold text-[13px] rounded-xl"
                  >
                    完成体验
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

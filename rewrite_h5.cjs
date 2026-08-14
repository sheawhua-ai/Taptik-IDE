const fs = require('fs');

const content = `import React, { useState } from 'react';
import { 
  X, Smartphone, CheckCircle2, Upload, 
  Sparkles, Send, Copy, Check, ChevronRight, FileText, Image as ImageIcon, ExternalLink, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProjectStore } from '../../context/ProjectContext';
import { Project } from '../../data/projectStore';

interface Props {
  project: Project;
  onClose: () => void;
}

export function ConsumerLandingPageModal({ project, onClose }: Props) {
  // Steps: 'claim' -> 'questionnaire' -> 'generating' -> 'note_confirm' -> 'photo_tasks' -> 'checking' -> 'publish' -> 'done'
  const [step, setStep] = useState<'claim' | 'questionnaire' | 'generating' | 'note_confirm' | 'photo_tasks' | 'checking' | 'publish' | 'done'>('claim');
  
  // Questionnaire answers
  const [answers, setAnswers] = useState<Record<string, any>>({});
  
  // Note Generation
  const [title, setTitle] = useState('我家金毛幼犬换粮体验，记录七天变化');
  const [body, setBody] = useState('今天给各位家长分享幼犬换粮的避坑经验！我家3个月大的金毛最近软便，按规定换粮法加专利益生菌，真的有改善。');
  
  // Photos
  const [photos, setPhotos] = useState<string[]>([]);
  const [photoError, setPhotoError] = useState('');
  
  // Copy state
  const [copiedTitle, setCopiedTitle] = useState(false);
  const [copiedBody, setCopiedBody] = useState(false);

  const simulateGeneration = () => {
    setStep('generating');
    setTimeout(() => {
      setStep('note_confirm');
    }, 2000);
  };

  const simulatePhotoCheck = () => {
    setStep('checking');
    setTimeout(() => {
      if (photos.length === 0) {
        setPhotoError('请上传至少一张照片');
        setStep('photo_tasks');
      } else {
        setStep('publish');
      }
    }, 1500);
  };

  const handleCopy = (text: string, type: 'title' | 'body') => {
    navigator.clipboard.writeText(text);
    if (type === 'title') {
      setCopiedTitle(true);
      setTimeout(() => setCopiedTitle(false), 2000);
    } else {
      setCopiedBody(true);
      setTimeout(() => setCopiedBody(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        className="relative flex bg-transparent max-h-[90vh] w-full max-w-[800px] z-10"
      >
        {/* Left Side: Context Info for PC User */}
        <div className="hidden md:flex flex-col w-[400px] bg-white rounded-l-3xl p-8 border-r border-neutral-200">
          <div className="flex items-center gap-2 mb-6">
            <Smartphone size={24} className="text-neutral-900" />
            <h2 className="text-[20px] font-extrabold text-neutral-900">消费者移动端 H5 演示</h2>
          </div>
          
          <div className="space-y-4 text-[13px] text-neutral-600 leading-relaxed">
            <p>
              本页面模拟消费者扫描二维码后，在手机端看到的完整提交流程。
            </p>
            <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-2">
              <div className="font-bold text-neutral-900">核心流程验证：</div>
              <ul className="list-disc pl-4 space-y-1">
                <li>消费者不看到复杂的创作规则</li>
                <li>只需做简单的问卷选择</li>
                <li>AI 基于问卷秒级生成专属笔记</li>
                <li>根据场景完成极简照片上传</li>
                <li>发布后一键确认，无需粘贴链接</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-auto pt-6">
            <button 
              onClick={onClose}
              className="w-full py-3 bg-neutral-100 text-neutral-700 font-bold rounded-xl hover:bg-neutral-200 transition-colors"
            >
              关闭模拟器
            </button>
          </div>
        </div>

        {/* Right Side: The "Phone" container */}
        <div className="flex-1 flex flex-col items-center bg-neutral-50/50 p-4 md:rounded-r-3xl rounded-3xl relative overflow-hidden backdrop-blur-sm shadow-2xl">
          <div className="w-[375px] h-[750px] max-h-full bg-white rounded-[40px] shadow-2xl border-[12px] border-neutral-900 overflow-hidden relative flex flex-col">
            
            {/* Phone Status Bar (Mock) */}
            <div className="h-6 w-full bg-white flex justify-between items-center px-6 text-[10px] font-medium text-neutral-900 shrink-0 relative z-50">
              <span>9:41</span>
              <div className="flex items-center gap-1">
                <span>5G</span>
                <div className="w-5 h-2.5 bg-neutral-900 rounded-[3px] relative before:absolute before:right-[-2px] before:top-1 before:w-[2px] before:h-1 before:bg-neutral-900 before:rounded-r-sm" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-neutral-50 relative scrollbar-none">
              
              {/* Step 1: Claim */}
              {step === 'claim' && (
                <div className="pb-24">
                  <div className="h-48 bg-neutral-200 w-full relative">
                    <img src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&auto=format&fit=crop" className="w-full h-full object-cover" alt="banner" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="text-white font-extrabold text-[20px] leading-tight">幼犬换粮体验招募活动</div>
                    </div>
                  </div>
                  <div className="p-5 space-y-5">
                    <div className="bg-white rounded-2xl p-5 shadow-2xs border border-neutral-200">
                      <h3 className="font-bold text-[15px] text-neutral-900 mb-3">本次任务说明</h3>
                      <div className="space-y-3 text-[13px] text-neutral-600">
                        <div className="flex items-center gap-2"><FileText size={16} className="text-neutral-400" /> 填写体验问卷 (共 3 题)</div>
                        <div className="flex items-center gap-2"><ImageIcon size={16} className="text-neutral-400" /> 拍摄体验照片 (1 - 2 张)</div>
                        <div className="flex items-center gap-2"><Send size={16} className="text-neutral-400" /> 发布至小红书</div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center justify-between">
                        <div className="text-[12px] text-neutral-500">预计完成时间</div>
                        <div className="text-[14px] font-bold text-neutral-900">3-5 分钟</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="fixed bottom-0 left-0 right-0 p-5 bg-white border-t border-neutral-100 pb-8">
                    <button 
                      onClick={() => setStep('questionnaire')}
                      className="w-full py-3.5 bg-neutral-900 text-white font-bold text-[15px] rounded-xl active:scale-95 transition-transform"
                    >
                      开始填写
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Questionnaire */}
              {step === 'questionnaire' && (
                <div className="pb-24">
                  <div className="p-5 bg-white border-b border-neutral-200 sticky top-0 z-10">
                    <h3 className="font-bold text-[16px] text-neutral-900">体验问卷调查</h3>
                    <div className="text-[12px] text-neutral-500 mt-1">我们将根据您的真实回答生成专属笔记</div>
                  </div>
                  <div className="p-5 space-y-6">
                    {/* Q1 */}
                    <div className="space-y-3">
                      <label className="block text-[14px] font-bold text-neutral-900">
                        1. 您的狗狗目前处于什么阶段？
                      </label>
                      <div className="space-y-2.5">
                        {["3-6个月幼犬", "6-12个月幼犬", "1-3岁成犬", "3岁以上"].map(opt => (
                          <button
                            key={opt}
                            onClick={() => setAnswers({...answers, q1: opt})}
                            className={\`w-full text-left px-4 py-3 rounded-xl border \${answers.q1 === opt ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-200 bg-white text-neutral-700'}\`}
                          >
                            <div className="font-medium text-[14px]">{opt}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* Q2 */}
                    <div className="space-y-3">
                      <label className="block text-[14px] font-bold text-neutral-900">
                        2. 狗狗近期是否有以下症状？（可多选）
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {["软便/腹泻", "挑食不爱吃", "泪痕严重", "毛发干枯", "没有明显症状"].map(opt => {
                          const isSelected = (answers.q2 || []).includes(opt);
                          return (
                            <button
                              key={opt}
                              onClick={() => {
                                const current = answers.q2 || [];
                                if (isSelected) {
                                  setAnswers({...answers, q2: current.filter((i:string) => i !== opt)});
                                } else {
                                  setAnswers({...answers, q2: [...current, opt]});
                                }
                              }}
                              className={\`px-4 py-2 rounded-xl border text-[13px] font-medium \${isSelected ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-200 bg-white text-neutral-700'}\`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  
                  <div className="fixed bottom-0 left-0 right-0 p-5 bg-white border-t border-neutral-100 pb-8">
                    <button 
                      onClick={simulateGeneration}
                      className="w-full py-3.5 bg-neutral-900 text-white font-bold text-[15px] rounded-xl active:scale-95 transition-transform"
                    >
                      生成我的体验笔记
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Generating */}
              {step === 'generating' && (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-4">
                  <Sparkles size={32} className="text-amber-500 animate-pulse" />
                  <div className="text-[16px] font-bold text-neutral-900">正在根据您的回答<br/>生成专属笔记...</div>
                  <div className="text-[13px] text-neutral-500">融合您的真实体验与产品亮点</div>
                </div>
              )}

              {/* Step 4: Note Confirmation */}
              {step === 'note_confirm' && (
                <div className="pb-24">
                  <div className="p-5 bg-white border-b border-neutral-200 sticky top-0 z-10 flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-[16px] text-neutral-900">确认您的专属笔记</h3>
                    </div>
                    <button className="text-[13px] text-neutral-500 flex items-center gap-1 font-bold">
                      <RefreshCw size={14} /> 换一种表达
                    </button>
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="bg-white rounded-2xl p-4 shadow-2xs border border-neutral-200">
                      <div className="font-extrabold text-[16px] text-neutral-900 mb-3">{title}</div>
                      <div className="text-[14px] text-neutral-700 leading-relaxed whitespace-pre-wrap">{body}</div>
                      <div className="mt-4 pt-3 border-t border-neutral-100 flex gap-2">
                        <span className="text-[12px] text-primary-600 font-bold">#幼犬换粮</span>
                        <span className="text-[12px] text-primary-600 font-bold">#狗狗软便</span>
                      </div>
                    </div>
                    <div className="text-[12px] text-neutral-500 px-2 text-center">
                      您可以点击文案进行轻量编辑，或点击右上角切换风格。确认无误后进入拍照环节。
                    </div>
                  </div>
                  
                  <div className="fixed bottom-0 left-0 right-0 p-5 bg-white border-t border-neutral-100 pb-8">
                    <button 
                      onClick={() => setStep('photo_tasks')}
                      className="w-full py-3.5 bg-neutral-900 text-white font-bold text-[15px] rounded-xl active:scale-95 transition-transform"
                    >
                      确认并继续拍照
                    </button>
                  </div>
                </div>
              )}

              {/* Step 5: Photo Tasks */}
              {step === 'photo_tasks' && (
                <div className="pb-24">
                  <div className="p-5 bg-white border-b border-neutral-200 sticky top-0 z-10">
                    <h3 className="font-bold text-[16px] text-neutral-900">完成拍摄任务</h3>
                    <div className="text-[12px] text-neutral-500 mt-1">需上传 1 组照片，通过AI检查后即可发布</div>
                  </div>
                  <div className="p-5 space-y-4">
                    {photoError && (
                      <div className="bg-rose-50 text-rose-600 text-[12px] font-bold p-3 rounded-xl border border-rose-200">
                        {photoError}
                      </div>
                    )}
                    <div className="bg-white rounded-2xl p-4 shadow-2xs border border-neutral-200 space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="font-bold text-[14px] text-neutral-900">任务一：狗狗进食中</div>
                        <div className="text-[12px] text-neutral-500 font-medium">{photos.length}/1 张</div>
                      </div>
                      <div className="text-[12px] text-neutral-600">要求：自然光线，狗狗吃粮的特写或半身照，需露出包装袋一角。</div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        {photos.map((p, i) => (
                          <div key={i} className="aspect-square bg-neutral-100 rounded-xl overflow-hidden relative">
                            <img src={p} className="w-full h-full object-cover" alt="user photo" />
                            <div className="absolute inset-0 ring-1 ring-inset ring-neutral-900/10 rounded-xl" />
                          </div>
                        ))}
                        {photos.length === 0 && (
                          <button 
                            onClick={() => {
                              setPhotoError('');
                              setPhotos(["https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&auto=format&fit=crop"]);
                            }}
                            className="aspect-square rounded-xl border-2 border-dashed border-neutral-300 flex flex-col items-center justify-center text-neutral-500 hover:bg-neutral-50 active:bg-neutral-100"
                          >
                            <Upload size={24} className="mb-2" />
                            <span className="text-[12px] font-bold">上传照片</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="fixed bottom-0 left-0 right-0 p-5 bg-white border-t border-neutral-100 pb-8">
                    <button 
                      onClick={simulatePhotoCheck}
                      className="w-full py-3.5 bg-neutral-900 text-white font-bold text-[15px] rounded-xl active:scale-95 transition-transform"
                    >
                      提交并检查照片
                    </button>
                  </div>
                </div>
              )}

              {/* Step 6: Checking */}
              {step === 'checking' && (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-4">
                  <div className="relative">
                    <ImageIcon size={40} className="text-neutral-400" />
                    <Sparkles size={20} className="text-amber-500 absolute -top-2 -right-2 animate-pulse" />
                  </div>
                  <div className="text-[16px] font-bold text-neutral-900">正在进行 AI 图像检查...</div>
                  <div className="text-[13px] text-neutral-500">检查是否符合任务要求</div>
                </div>
              )}

              {/* Step 7: Publish */}
              {step === 'publish' && (
                <div className="pb-24">
                  <div className="p-5 bg-emerald-50 border-b border-emerald-100 sticky top-0 z-10">
                    <h3 className="font-bold text-[16px] text-emerald-800 flex items-center gap-1.5"><CheckCircle2 size={18}/> 准备就绪</h3>
                    <div className="text-[12px] text-emerald-600 mt-1">照片检查通过，请分步复制并前往小红书发布</div>
                  </div>
                  <div className="p-5 space-y-5">
                    
                    <div className="space-y-2">
                      <div className="text-[13px] font-bold text-neutral-900">第一步：复制标题</div>
                      <div className="bg-white border border-neutral-200 rounded-xl p-3 flex gap-3 shadow-2xs items-center justify-between">
                        <div className="text-[13px] text-neutral-700 line-clamp-1">{title}</div>
                        <button 
                          onClick={() => handleCopy(title, 'title')}
                          className="px-3 py-1.5 bg-neutral-100 text-neutral-700 font-bold text-[12px] rounded-lg shrink-0 flex items-center gap-1"
                        >
                          {copiedTitle ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                          {copiedTitle ? "已复制" : "复制"}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-[13px] font-bold text-neutral-900">第二步：复制正文</div>
                      <div className="bg-white border border-neutral-200 rounded-xl p-3 shadow-2xs">
                        <div className="text-[13px] text-neutral-700 line-clamp-2 mb-3">{body}</div>
                        <button 
                          onClick={() => handleCopy(body, 'body')}
                          className="w-full py-2 bg-neutral-100 text-neutral-700 font-bold text-[12px] rounded-lg shrink-0 flex items-center justify-center gap-1"
                        >
                          {copiedBody ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                          {copiedBody ? "已复制" : "复制全文"}
                        </button>
                      </div>
                    </div>

                    <div className="bg-neutral-50 rounded-xl p-4 text-[12px] text-neutral-500 border border-neutral-200">
                      发布完成后，系统将自动识别您的笔记，无需手动回传链接。
                    </div>

                  </div>
                  
                  <div className="fixed bottom-0 left-0 right-0 p-5 bg-white border-t border-neutral-100 pb-8">
                    <button 
                      onClick={() => setStep('done')}
                      className="w-full py-3.5 bg-rose-500 text-white font-bold text-[15px] rounded-xl active:scale-95 transition-transform flex items-center justify-center gap-2 shadow-md shadow-rose-500/20"
                    >
                      打开小红书客户端 <ExternalLink size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 8: Done */}
              {step === 'done' && (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-4">
                  <CheckCircle2 size={48} className="text-emerald-500" />
                  <div className="text-[18px] font-bold text-neutral-900">您已进入小红书</div>
                  <div className="text-[13px] text-neutral-500 leading-relaxed">
                    发布成功后，平台将自动为您统计数据并结算奖励。您现在可以关闭此页面。
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

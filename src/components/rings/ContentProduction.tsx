import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Zap, LayoutGrid, FileText, Settings2, 
  RefreshCw, CheckCircle2, ChevronRight, Copy, 
  ArrowRight, Image as ImageIcon, Wand2, Star,
  AlertCircle, MessageSquare, TrendingUp, Layers, Target, PenTool, Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GenerationResult {
  id: string;
  title: string;
  style: string;
  content: string;
  prediction: {
    ctr: string;
    engagement: string;
  };
}

export const ContentProduction: React.FC<{ hasData?: boolean }> = ({ hasData = true }) => {
  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState({
    keyword: '',
    selectedBlueOcean: '',
    intent: '',
    imageSource: 'ai' as 'ai' | 'original'
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentDraft, setCurrentDraft] = useState<string>('');
  const [iterationCount, setIterationCount] = useState(0);

  const [blueOceanWords, setBlueOceanWords] = useState<string[]>([]);
  const [plans, setPlans] = useState<string[]>([]);
  const [results, setResults] = useState<GenerationResult[]>([]);

  const isEmpty = !hasData && !formData.keyword && !isGenerating;

  useEffect(() => {
    const handleBridge = (e: any) => {
      setFormData(prev => ({ ...prev, keyword: e.detail.keyword }));
      setActiveStep(1);
    };
    window.addEventListener('nav-to-factory', handleBridge);
    return () => window.removeEventListener('nav-to-factory', handleBridge);
  }, []);

  const fetchBlueOcean = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setBlueOceanWords(['青岛带私人泳池民宿', '崂山高性价比民宿', '青岛海景房淡季攻略']);
      setIsGenerating(false);
      setActiveStep(2);
    }, 1000);
  };

  const generateIntent = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setPlans([
         '强调“反向出行”的高性价比与开窗即是大海的治愈感',
         '测评青岛3家带泳池民宿，突出私密性与出片率',
         '以“本地人避坑”视角，推荐低价高质的住宿体验'
      ]);
      setIsGenerating(false);
      setActiveStep(3);
    }, 1000);
  };

  const handleInitialGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setCurrentDraft('住过青岛不下20家酒店，瑞吉这间270°海景房真的惊艳到我了！淡季入住简直是性价比天花板...');
      setIterationCount(1);
      setIsGenerating(false);
      setActiveStep(4);
    }, 2000);
  };

  const handleIterate = (direction: string) => {
    setIsGenerating(true);
    setTimeout(() => {
      setCurrentDraft(prev => prev + `\n\n[AI 迭代: ${direction}]\n新增了更多关于「洗浴耗材」和「早餐种类」的具体描述，并加强了末尾的引导点击话术。`);
      setIterationCount(prev => prev + 1);
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      <div className="h-20 border-b border-neutral-100 px-8 flex items-center justify-between shrink-0 bg-white z-10">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-neutral-900 text-white rounded-2xl flex items-center justify-center shadow-lg">
               <Sparkles size={24} />
            </div>
            <div>
               <h2 className="text-[17px] font-black text-neutral-900 tracking-tight">Studio | 智造工坊</h2>
               <p className="text-[11px] font-bold text-neutral-400">Creative Agent: 正在为 82 个 KOS 账号生成差异化笔记</p>
            </div>
         </div>
        
        <div className="flex items-center gap-6">
           <div className="flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-500 rounded-lg text-[11px] font-black italic">
              <RefreshCw size={12} className="animate-spin-slow" />
              流程循环中
           </div>
           <div className="flex bg-neutral-50 p-1 rounded-xl">
              {[
                { id: 1, name: '输入', icon: Settings2 },
                { id: 2, name: '蓝海词', icon: Target },
                { id: 3, name: '策略', icon: Layers },
                { id: 4, name: '精调', icon: PenTool }
              ].map((s) => (
                <div key={s.id} className={`px-4 py-1.5 rounded-lg text-[12px] font-black transition-all flex items-center gap-2 ${activeStep === s.id ? 'bg-white text-neutral-900 shadow-sm border border-neutral-100' : 'text-neutral-400'}`}>
                   {activeStep >= s.id ? <CheckCircle2 size={12} /> : s.id}
                   {s.name}
                </div>
              ))}
           </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
         {isEmpty ? (
            <div className="flex-1 flex flex-col items-center justify-center p-20 text-center bg-neutral-50/10">
               <div className="w-32 h-32 bg-purple-50 rounded-[48px] flex items-center justify-center text-purple-200 mb-10 group hover:rotate-6 transition-transform">
                  <Sparkles size={64} />
               </div>
               <h3 className="text-3xl font-black text-neutral-900 mb-4 tracking-tight italic">智造工坊待命</h3>
               <p className="text-neutral-400 font-bold max-w-md mx-auto leading-relaxed">
                  目前内容仓库为空。建议先从“全域巡航”选择蓝海词，或直接在左侧启动多模态生产流。
               </p>
               <div className="mt-12 flex gap-4">
                  <button 
                     onClick={() => window.dispatchEvent(new CustomEvent('nav-to-strategy'))}
                     className="px-8 py-4 bg-white border border-neutral-200 text-neutral-900 rounded-2xl text-[14px] font-black shadow-sm hover:bg-neutral-50 transition-all"
                  >
                     去蓝图选词
                  </button>
               </div>
            </div>
         ) : (
           <>
            <div className="w-[440px] border-r border-neutral-100 flex flex-col h-full bg-neutral-50/20 overflow-y-auto custom-scrollbar">
            <div className="p-8 space-y-8">
               <div className="space-y-12">
                  {/* Step 1 */}
                  <div className={`space-y-6 transition-all ${activeStep > 1 ? 'opacity-70' : ''}`}>
                     <h3 className="text-[14px] font-black text-neutral-900 flex items-center gap-2 uppercase tracking-widest">
                        <Settings2 size={16} className={`${activeStep > 1 ? 'text-primary-500' : 'text-neutral-400'}`}/> {activeStep > 1 ? '1. 生产指令设定期' : '启动生产流'}
                     </h3>
                     <div className="space-y-4">
                        <div className="space-y-2">
                           <label className="text-[11px] font-black text-neutral-400 uppercase tracking-widest pl-1">选择生产品类</label>
                           <div className="grid grid-cols-2 gap-2">
                              {[
                                 { id: 'note', label: '图文/笔记', sub: 'XHS/知乎', disabled: activeStep > 1 },
                                 { id: 'video', label: '短视频脚本', sub: '抖音/TikTok', disabled: activeStep > 1 },
                                 { id: 'storyboard', label: '视频分镜', sub: '等待能力接入', disabled: true },
                                 { id: 'visual', label: '视觉封面', sub: 'Flux/MJ 驱动', disabled: activeStep > 1 },
                              ].map(m => (
                                 <button key={m.id} disabled={m.disabled} className={`p-3 bg-white border border-neutral-100 rounded-xl text-left transition-all group ${m.disabled ? 'opacity-40 cursor-not-allowed bg-neutral-50/50' : 'hover:border-primary-500'}`}>
                                    <div className={`text-[12px] font-black ${m.disabled ? 'text-neutral-400' : 'text-neutral-700 group-hover:text-primary-500'}`}>{m.label}</div>
                                    <div className="text-[9px] font-bold text-neutral-400 uppercase tracking-tighter">{m.sub}</div>
                                 </button>
                              ))}
                           </div>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[11px] font-black text-neutral-400 uppercase tracking-widest pl-1">核心主题/词</label>
                           <input 
                              value={formData.keyword}
                              onChange={(e) => setFormData({...formData, keyword: e.target.value})}
                              disabled={activeStep > 1}
                              className={`w-full bg-white border border-neutral-200 rounded-2xl p-4 text-[14px] font-bold text-neutral-900 transition-all font-mono ${activeStep > 1 ? 'opacity-70 bg-neutral-50' : 'focus:border-primary-500'}`}
                              placeholder="例如：青岛民宿"
                           />
                        </div>
                        {activeStep === 1 && (
                           <button onClick={fetchBlueOcean} className="w-full h-14 bg-neutral-900 text-white rounded-2xl font-black text-[14px] flex items-center justify-center gap-2 hover:bg-primary-500 transition-all shadow-lg active:scale-95 mt-4">
                              调度蓝海探测 Agent <Zap size={16} className="fill-current"/>
                           </button>
                        )}
                     </div>
                  </div>

                  {/* Step 2 */}
                  {activeStep >= 2 && (
                     <div className={`space-y-6 mt-8 transition-all relative ${activeStep > 2 ? 'opacity-70' : 'animate-in fade-in slide-in-from-top-4'}`}>
                        <div className="absolute -top-10 left-3.5 w-0.5 h-10 bg-neutral-200 rounded-full" />
                        <h3 className="text-[14px] font-black text-neutral-900 flex items-center gap-2 uppercase tracking-widest">
                           <Target size={16} className={`${activeStep > 2 ? 'text-primary-500' : 'text-neutral-400'}`}/> 2. 蓝海切入锚点评估
                        </h3>
                        <div className="space-y-3">
                           {blueOceanWords.map(word => (
                              <button 
                                 key={word}
                                 disabled={activeStep > 2}
                                 onClick={() => setFormData({...formData, selectedBlueOcean: word})}
                                 className={`w-full p-4 rounded-2xl border text-left transition-all ${activeStep > 2 ? 'bg-neutral-50/50' : ''} ${formData.selectedBlueOcean === word ? 'bg-white border-primary-500 shadow-sm' : 'bg-white/50 border-neutral-200 hover:border-neutral-300'}`}
                              >
                                 <div className="flex items-center justify-between">
                                    <span className={`text-[13px] font-bold ${formData.selectedBlueOcean === word ? 'text-primary-600' : 'text-neutral-700'}`}>{word}</span>
                                    {formData.selectedBlueOcean === word && <div className="w-4 h-4 bg-primary-500 rounded-full flex items-center justify-center text-white"><CheckCircle2 size={12}/></div>}
                                 </div>
                              </button>
                           ))}
                           {activeStep === 2 && (
                              <button onClick={generateIntent} disabled={!formData.selectedBlueOcean} className="w-full h-12 bg-white border border-neutral-200 text-neutral-900 rounded-xl font-black text-[13px] flex items-center justify-center gap-2 hover:border-primary-500 hover:text-primary-500 transition-all disabled:opacity-50 mt-2">
                                 确立此方向并生成大纲 <ArrowRight size={14}/>
                              </button>
                           )}
                        </div>
                     </div>
                  )}

                  {/* Step 3 */}
                  {activeStep >= 3 && (
                     <div className={`space-y-6 mt-8 transition-all relative ${activeStep > 3 ? 'opacity-70' : 'animate-in fade-in slide-in-from-top-4'}`}>
                        <div className="absolute -top-10 left-3.5 w-0.5 h-10 bg-neutral-200 rounded-full" />
                        <h3 className="text-[14px] font-black text-neutral-900 flex items-center gap-2 uppercase tracking-widest">
                           <FileText size={16} className={`${activeStep > 3 ? 'text-primary-500' : 'text-neutral-400'}`}/> 3. 网感与撰写大纲
                        </h3>
                        <div className="space-y-3">
                           {plans.map(p => (
                              <button 
                                 key={p}
                                 disabled={activeStep > 3}
                                 onClick={() => setFormData({...formData, intent: p})}
                                 className={`w-full p-4 rounded-2xl border text-left transition-all ${activeStep > 3 ? 'bg-neutral-50/50' : ''} ${formData.intent === p ? 'bg-white border-primary-500 shadow-sm' : 'bg-white/50 border-neutral-200 hover:border-neutral-300'}`}
                              >
                                 <p className={`text-[13px] font-bold leading-relaxed ${formData.intent === p ? 'text-primary-600' : 'text-neutral-700'}`}>{p}</p>
                              </button>
                           ))}
                           
                           {activeStep === 3 && (
                              <div className="pt-4 flex flex-col gap-4">
                                 <button onClick={handleInitialGenerate} disabled={!formData.intent} className="w-full h-14 bg-neutral-900 text-white rounded-2xl font-black text-[14px] flex items-center justify-center gap-2 hover:bg-primary-500 transition-all shadow-lg active:scale-95 mt-2">
                                    进入全链路生成 <Sparkles size={16}/>
                                 </button>
                              </div>
                           )}
                        </div>
                     </div>
                  )}

                  {/* Step 4 */}
                  {activeStep >= 4 && (
                     <div className="space-y-6 mt-8 relative animate-in fade-in slide-in-from-top-4">
                        <div className="absolute -top-10 left-3.5 w-0.5 h-10 bg-neutral-200 rounded-full" />
                        <h3 className="text-[14px] font-black text-neutral-900 flex items-center gap-2 uppercase tracking-widest">
                           <PenTool size={16} className="text-secondary-500"/> 4. 实时人工微调 (HITL)
                        </h3>
                        <div className="p-6 bg-neutral-900 rounded-[32px] text-white overflow-hidden relative group">
                           <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none">
                              <Target size={200} className="absolute -bottom-10 -right-10 text-white" />
                           </div>
                           <p className="text-[11px] font-black text-primary-400 uppercase tracking-widest mb-4">实时介入反馈</p>
                           <p className="text-[13px] font-bold text-neutral-300 mb-6 leading-relaxed">可点击下方微指令，Agent 将实时重构右侧产出节点。即刻生效。</p>
                           <div className="grid grid-cols-2 gap-2 relative z-10">
                              {[
                                 '加强互动引导', '多用口语化表达', '精简文本篇幅', '强调价格优势'
                              ].map(dir => (
                                 <button 
                                   key={dir}
                                   onClick={() => handleIterate(dir)}
                                   className="py-3 px-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 text-[11px] font-black text-left transition-all flex items-center justify-between group/btn text-neutral-300 hover:text-white"
                                 >
                                    <span className="truncate">{dir}</span>
                                    <RefreshCw size={12} className="text-neutral-500 group-hover/btn:rotate-180 group-hover/btn:text-primary-400 transition-all shrink-0 ml-1" />
                                 </button>
                              ))}
                           </div>
                        </div>
                        
                        <div className="pt-4">
                           <button 
                             onClick={() => setActiveStep(5)}
                             className="w-full h-14 bg-emerald-500 text-white rounded-2xl font-black text-[14px] flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 active:scale-95 mt-2"
                           >
                              生产确认并推进至矩阵排期 <CheckCircle2 size={16}/>
                           </button>
                        </div>
                     </div>
                  )}
               </div>

               {activeStep === 5 && (
                  <div className="space-y-6">
                     <div className="p-8 bg-emerald-50 rounded-[40px] border border-emerald-100 flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-emerald-500 mb-6">
                           <CheckCircle2 size={32} />
                        </div>
                        <h4 className="text-xl font-black text-neutral-900">入库生产任务已闭环</h4>
                        <p className="text-[13px] font-bold text-neutral-500 mt-2">笔记已存入预备库，排期任务已生成</p>
                        <button 
                          onClick={() => {
                            window.dispatchEvent(new CustomEvent('nav-to-tab', { detail: { tab: 'interaction' } }));
                          }}
                          className="mt-8 px-8 py-3 bg-neutral-900 text-white rounded-2xl text-[13px] font-black hover:bg-primary-500 transition-all"
                        >
                          查看分发与互动
                        </button>
                     </div>
                  </div>
               )}
            </div>
            </div>

            <div className="flex-1 bg-neutral-50/30 overflow-y-auto custom-scrollbar p-12 relative flex">
               <div className="flex-1 overflow-y-auto no-scrollbar">
                  <AnimatePresence mode="wait">
                     {isGenerating ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full">
                           <div className="relative">
                              <RefreshCw className="animate-spin text-primary-500 mb-6" size={48} />
                              <div className="absolute inset-0 animate-ping opacity-20"><RefreshCw size={48} className="text-primary-500" /></div>
                           </div>
                           <p className="text-[14px] font-black text-neutral-400 animate-pulse uppercase tracking-[0.2em]">Agent 正在构建您的内容...</p>
                           <div className="mt-8 space-y-2 w-48">
                              <div className="h-1 bg-neutral-100 rounded-full overflow-hidden">
                                 <motion.div 
                                    initial={{ width: 0 }} 
                                    animate={{ width: '100%' }} 
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="h-full bg-primary-500" 
                                 />
                              </div>
                           </div>
                        </motion.div>
                     ) : activeStep >= 4 ? (
                        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
                           <div className="bg-white rounded-[40px] border border-neutral-200 overflow-hidden shadow-2xl relative">
                              <div className="p-10 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/20">
                                 <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-purple-500 border border-neutral-100">
                                       <FileText size={22}/>
                                    </div>
                                    <div>
                                       <h4 className="text-xl font-black text-neutral-900">{iterationCount === 1 ? '内容初稿 (V1 Draft)' : `迭代版本 V${iterationCount}`}</h4>
                                       <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">智策系统 文案 Agent 强力驱动</p>
                                    </div>
                                 </div>
                                 <div className="flex gap-2">
                                    <div className="flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black border border-emerald-100">
                                       原创度预估: 95%+
                                    </div>
                                 </div>
                              </div>
                              
                              <div className="p-10 space-y-8">
                                 <div className="space-y-4">
                                    <h5 className="text-[12px] font-black text-neutral-400 uppercase tracking-widest">小红书标题建议</h5>
                                    <p className="text-2xl font-black text-neutral-900 italic tracking-tight leading-tight">
                                    推开窗的那一刻，我知道这980花得太值了！🏨
                                    </p>
                                 </div>

                                 <div className="space-y-4">
                                    <h5 className="text-[12px] font-black text-neutral-400 uppercase tracking-widest">正文内容 (Bodytext)</h5>
                                    <div className="p-8 bg-neutral-50 rounded-[32px] border border-neutral-100 shadow-inner">
                                       <p className="text-[15px] font-bold text-neutral-700 leading-relaxed whitespace-pre-wrap">
                                          {currentDraft}
                                       </p>
                                    </div>
                                 </div>

                                 <div className="grid grid-cols-2 gap-6">
                                    <div className="p-6 bg-blue-50/50 rounded-[32px] border border-blue-100">
                                       <h5 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-4">视觉策略建议</h5>
                                       <div className="flex items-center gap-4">
                                          <div className="w-16 h-20 bg-white rounded-xl shadow-sm border border-blue-100 flex items-center justify-center text-blue-300">
                                             <ImageIcon size={28}/>
                                          </div>
                                          <div>
                                             <p className="text-[13px] font-black text-neutral-800">首图建议：开窗海景特写</p>
                                             <p className="text-[11px] font-semibold text-blue-400 mt-1">Agent 已自动匹配背景素材库</p>
                                          </div>
                                       </div>
                                    </div>
                                    <div className="p-6 bg-neutral-900 rounded-[32px] text-white">
                                       <h5 className="text-[10px] font-black text-primary-400 uppercase tracking-widest mb-4">数据表现预测</h5>
                                       <div className="grid grid-cols-2 gap-4">
                                          <div>
                                             <p className="text-[9px] text-neutral-500 uppercase">点击率 (CTR)</p>
                                             <p className="text-lg font-black text-success-400">高 (HIGH)</p>
                                          </div>
                                          <div>
                                             <p className="text-[9px] text-neutral-500 uppercase">互动潜力</p>
                                             <p className="text-lg font-black text-primary-400">极佳 (ELITE)</p>
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </motion.div>
                     ) : (
                        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center h-full text-center">
                           <div className="w-24 h-24 bg-white rounded-[40px] shadow-2xl flex items-center justify-center mb-10 group hover:scale-110 transition-transform">
                              <Wand2 className="text-purple-400 group-hover:rotate-12 transition-transform" size={40} />
                           </div>
                           <h3 className="text-2xl font-black text-neutral-900 tracking-tight leading-tight">智造流水线已就绪</h3>
                           <p className="text-neutral-400 font-bold mt-4 max-w-sm mx-auto leading-relaxed">请完成左侧运营决策步骤，Agent 将根据您的业务偏好实时进行多轮文本博弈与合成。</p>
                        </div>
                     )}
                  </AnimatePresence>
               </div>
            </div>
           </>
         )}
      </div>
    </div>
  );
};

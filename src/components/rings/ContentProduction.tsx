import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Zap, LayoutGrid, FileText, Settings2, 
  RefreshCw, CheckCircle2, ChevronRight, Copy, 
  ArrowRight, Image as ImageIcon, Wand2, Star,
  AlertCircle, MessageSquare, TrendingUp, Layers, Target
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

export const ContentProduction: React.FC = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState({
    keyword: '青岛民宿',
    selectedBlueOcean: '',
    intent: '',
    imageSource: 'ai' as 'ai' | 'original'
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [blueOceanWords, setBlueOceanWords] = useState<string[]>([]);
  const [plans, setPlans] = useState<string[]>([]);
  const [results, setResults] = useState<GenerationResult[]>([]);

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

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setResults([
        {
          id: 'A',
          style: '情绪型',
          title: '推开窗的那一刻，我知道这980花得太值了',
          content: '住过青岛不下20家酒店，瑞吉这间270°海景房真的惊艳到我了！淡季入住简直是性价比天花板...',
          prediction: { ctr: '高', engagement: '高' }
        }
      ]);
      setIsGenerating(false);
      setActiveStep(4);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      <div className="h-20 border-b border-neutral-100 px-8 flex items-center justify-between shrink-0 bg-white z-10">
        <div className="flex items-center gap-4">
           <div className="w-10 h-10 bg-purple-50 text-purple-500 rounded-2xl flex items-center justify-center">
              <Sparkles size={24} />
           </div>
           <div>
              <h2 className="text-[17px] font-black text-neutral-900 tracking-tight">内容智造中枢</h2>
              <p className="text-[11px] font-bold text-neutral-400">从蓝海发现到笔记落地的全自动闭环</p>
           </div>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="flex bg-neutral-50 p-1 rounded-xl">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className={`px-4 py-1.5 rounded-lg text-[12px] font-black transition-all ${activeStep === s ? 'bg-white text-neutral-900 shadow-sm border border-neutral-100' : 'text-neutral-400'}`}>
                   Step {s}
                </div>
              ))}
           </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
         <div className="w-[440px] border-r border-neutral-100 flex flex-col h-full bg-neutral-50/20 overflow-y-auto custom-scrollbar">
            <div className="p-8 space-y-8">
               {activeStep === 1 && (
                  <div className="space-y-6">
                     <h3 className="text-[14px] font-black text-neutral-900 flex items-center gap-2 uppercase tracking-widest">
                        <Settings2 size={16} className="text-neutral-400"/> 启动需求
                     </h3>
                     <div className="space-y-4">
                        <div className="space-y-2">
                           <label className="text-[11px] font-black text-neutral-400 uppercase tracking-widest pl-1">输入核心关键词</label>
                           <input 
                              value={formData.keyword}
                              onChange={(e) => setFormData({...formData, keyword: e.target.value})}
                              className="w-full bg-white border border-neutral-200 rounded-2xl p-4 text-[14px] font-bold text-neutral-900 focus:border-primary-500 transition-all"
                              placeholder="例如：青岛民宿"
                           />
                        </div>
                        <button onClick={fetchBlueOcean} className="w-full h-14 bg-neutral-900 text-white rounded-2xl font-black text-[14px] flex items-center justify-center gap-2 hover:bg-primary-500 transition-all">
                           挖掘蓝海词 <ArrowRight size={16}/>
                        </button>
                     </div>
                  </div>
               )}

               {activeStep === 2 && (
                  <div className="space-y-6">
                     <h3 className="text-[14px] font-black text-neutral-900 flex items-center gap-2 uppercase tracking-widest">
                        <Target size={16} className="text-neutral-400"/> 选择目标蓝海词
                     </h3>
                     <div className="space-y-3">
                        {blueOceanWords.map(word => (
                           <button 
                              key={word}
                              onClick={() => setFormData({...formData, selectedBlueOcean: word})}
                              className={`w-full p-4 rounded-2xl border text-left transition-all ${formData.selectedBlueOcean === word ? 'bg-primary-50 border-primary-500 shadow-sm' : 'bg-white border-neutral-200 hover:border-neutral-300'}`}
                           >
                              <div className="flex items-center justify-between">
                                 <span className={`text-[13px] font-bold ${formData.selectedBlueOcean === word ? 'text-primary-600' : 'text-neutral-700'}`}>{word}</span>
                                 {formData.selectedBlueOcean === word && <CheckCircle2 size={16} className="text-primary-500"/>}
                              </div>
                           </button>
                        ))}
                        <button onClick={generateIntent} disabled={!formData.selectedBlueOcean} className="w-full h-14 mt-4 bg-neutral-900 text-white rounded-2xl font-black text-[14px] flex items-center justify-center gap-2 hover:bg-primary-500 transition-all disabled:opacity-50">
                           制定运营意图 <Zap size={16} className="fill-current"/>
                        </button>
                     </div>
                  </div>
               )}

               {activeStep === 3 && (
                  <div className="space-y-6">
                     <h3 className="text-[14px] font-black text-neutral-900 flex items-center gap-2 uppercase tracking-widest">
                        <FileText size={16} className="text-neutral-400"/> 确认内容方案
                     </h3>
                     <div className="space-y-3">
                        {plans.map(p => (
                           <button 
                              key={p}
                              onClick={() => setFormData({...formData, intent: p})}
                              className={`w-full p-4 rounded-2xl border text-left transition-all ${formData.intent === p ? 'bg-primary-50 border-primary-500 shadow-sm' : 'bg-white border-neutral-200 hover:border-neutral-300'}`}
                           >
                              <p className={`text-[13px] font-bold leading-relaxed ${formData.intent === p ? 'text-primary-600' : 'text-neutral-700'}`}>{p}</p>
                           </button>
                        ))}
                        
                        <div className="pt-4 border-t border-neutral-100 flex flex-col gap-4">
                           <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-neutral-200">
                              <span className="text-[12px] font-bold text-neutral-500">图片生成策略</span>
                              <div className="flex p-0.5 bg-neutral-100 rounded-lg">
                                 <button onClick={() => setFormData({...formData, imageSource: 'ai'})} className={`px-3 py-1 text-[10px] font-black rounded-md transition-all ${formData.imageSource === 'ai' ? 'bg-white shadow-sm' : 'text-neutral-400'}`}>AI自动出图</button>
                                 <button onClick={() => setFormData({...formData, imageSource: 'original'})} className={`px-3 py-1 text-[10px] font-black rounded-md transition-all ${formData.imageSource === 'original' ? 'bg-white shadow-sm' : 'text-neutral-400'}`}>人工补图</button>
                              </div>
                           </div>
                           <button onClick={handleGenerate} disabled={!formData.intent} className="w-full h-14 bg-neutral-900 text-white rounded-2xl font-black text-[14px] flex items-center justify-center gap-2 hover:bg-primary-500 transition-all">
                              一键生成笔记 <Sparkles size={16}/>
                           </button>
                        </div>
                     </div>
                  </div>
               )}

               {activeStep === 4 && (
                  <div className="space-y-6">
                     <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-3">
                        <CheckCircle2 size={24} className="text-emerald-500"/>
                        <div>
                           <p className="text-[13px] font-black text-emerald-900">流程已完成</p>
                           <p className="text-[11px] font-bold text-emerald-600">笔记已生成，任务已自动派发</p>
                        </div>
                     </div>
                     <button onClick={() => setActiveStep(1)} className="w-full h-14 border border-neutral-200 text-neutral-600 rounded-2xl font-black text-[14px] hover:bg-white transition-all">
                        开始新任务
                     </button>
                  </div>
               )}
            </div>
         </div>

         <div className="flex-1 bg-neutral-50/30 overflow-y-auto custom-scrollbar p-12">
            <AnimatePresence mode="wait">
               {isGenerating ? (
                   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-40">
                      <RefreshCw className="animate-spin text-primary-500 mb-4" size={32} />
                      <p className="text-[14px] font-black text-neutral-400 animate-pulse uppercase tracking-[0.2em]">AI Intelligence Processing...</p>
                   </motion.div>
               ) : activeStep === 4 ? (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-8">
                      {results.map(res => (
                         <div key={res.id} className="bg-white rounded-[32px] border border-neutral-200 overflow-hidden p-8 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                               <h4 className="text-xl font-black text-neutral-900">{res.title}</h4>
                               <div className="flex gap-2">
                                  <button className="p-2 hover:bg-neutral-50 rounded-xl"><Copy size={18} className="text-neutral-400"/></button>
                               </div>
                            </div>
                            <p className="text-neutral-600 font-bold leading-relaxed whitespace-pre-wrap mb-6">{res.content}</p>
                            
                            <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-center justify-between">
                               <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-500">
                                     <ImageIcon size={24}/>
                                  </div>
                                  <div>
                                     <p className="text-[13px] font-black text-neutral-900">{formData.imageSource === 'ai' ? 'AI 正在自动合成配图...' : '已自动给对应运营发送补图任务'}</p>
                                     <p className="text-[11px] font-bold text-neutral-400">{formData.imageSource === 'ai' ? '预计 30s 后可见预览' : '指派人：摄影组-小李'}</p>
                                  </div>
                               </div>
                               <button className="px-6 py-2.5 bg-neutral-900 text-white rounded-xl text-[13px] font-black hover:bg-blue-600 transition-all">
                                  发布到日历排期
                               </button>
                            </div>
                         </div>
                      ))}
                  </motion.div>
               ) : (
                  <div className="max-w-4xl mx-auto flex flex-col items-center justify-center py-40 text-center">
                     <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center mb-8">
                        <Wand2 className="text-purple-400" size={32} />
                     </div>
                     <h3 className="text-xl font-black text-neutral-900">请完成左侧步骤</h3>
                     <p className="text-neutral-400 font-bold mt-2">AI 将根据您的运营意图实时输出高质量笔记</p>
                  </div>
               )}
            </AnimatePresence>
         </div>
      </div>
    </div>
  );
};

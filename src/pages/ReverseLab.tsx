import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertTriangle, XCircle, RefreshCw, ShieldAlert, Sparkles, Activity, FileText } from 'lucide-react';

export default function ReverseLab() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(true);

  const [content, setContent] = useState(
    "标题：绝绝子！这款美白精华真的让我白到发光✨\n\n正文：家人们谁懂啊！最近发现了一款神仙精华，号称全网第一美白神器，用了一周直接白了两个度！绝对没有平替！里面含有最高浓度的VC成分，抗老又美白，不管你是敏感肌还是孕妇都能放心闭眼入。趁着双十一大促，赶紧囤起来，手慢无！\n\n#护肤日常 #美白精华 #第一美白神器"
  );

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setShowResults(false);
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);
    }, 1500);
  };

  const handleRewrite = () => {
    setContent(
      "标题：早C晚A打卡！分享我的近期提亮好物✨\n\n正文：整理了最近爱用的提亮精华。质地很水润，吸收挺快的。看了下成分，主要是VC衍生物，比较温和，适合大部分肤质（敏感肌建议先在耳后测试哦）。坚持用了一段时间，感觉肤色有变均匀，光泽感也提升了。双十一有活动，有需要的姐妹可以参考一下～\n\n#护肤日常 #精华分享 #好物推荐"
    );
    handleAnalyze();
  };

  return (
    <div className="p-6 space-y-6 max-w-[1200px] mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900 flex items-center gap-2">
            <ShieldAlert className="text-rose-500" />
            AI 内容违规预检与健康度评分
          </h2>
          <p className="text-sm text-neutral-500 mt-1">发布前自动检查广告法违禁词、平台敏感词，提供多维度质量评估。</p>
        </div>
        <div className="flex gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-[12px] text-emerald-700 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> 模型库已更新
          </span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left: Input */}
        <div className="col-span-12 lg:col-span-5 bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm flex flex-col h-[700px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[15px] font-bold flex items-center gap-2 text-neutral-900">
              <FileText size={18} className="text-neutral-400" />
              待检笔记内容
            </h3>
            <button className="text-[12px] text-neutral-500 hover:text-neutral-900" onClick={() => setContent('')}>清空</button>
          </div>
          
          <textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 w-full bg-neutral-50 border border-neutral-200 rounded-xl p-4 text-[14px] text-neutral-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none leading-relaxed"
            placeholder="粘贴小红书笔记标题与正文..."
          />
          
          <button 
            onClick={handleAnalyze}
            disabled={isAnalyzing || !content}
            className="mt-4 w-full bg-neutral-900 text-white py-3.5 rounded-xl text-[14px] font-bold shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 hover:bg-neutral-800 disabled:opacity-50"
          >
            {isAnalyzing ? (
              <><RefreshCw size={18} className="animate-spin" /> AI 深度检测中...</>
            ) : (
              <><Activity size={18} /> 开始全方位预检</>
            )}
          </button>
        </div>

        {/* Right: Dashboard */}
        <div className="col-span-12 lg:col-span-7 bg-white border border-neutral-200 rounded-2xl shadow-sm flex flex-col h-[700px] overflow-hidden relative bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-neutral-50 via-white to-white">
          {!showResults && !isAnalyzing ? (
            <div className="flex-1 flex flex-col items-center justify-center text-neutral-400">
              <ShieldAlert size={48} className="mb-4 opacity-20" />
              <p>点击左侧按钮开始检测</p>
            </div>
          ) : isAnalyzing ? (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="relative">
                <div className="w-24 h-24 border-4 border-neutral-100 rounded-full"></div>
                <div className="w-24 h-24 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin absolute inset-0"></div>
                <ShieldAlert size={32} className="absolute inset-0 m-auto text-indigo-500 animate-pulse" />
              </div>
              <p className="mt-6 text-neutral-500 text-[14px] font-medium">正在比对最新广告法与平台敏感词库...</p>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar"
            >
              {/* Score Header */}
              {content.includes("绝绝子") ? (
                <div className="flex items-center gap-6 p-6 bg-rose-50 border border-rose-100 rounded-2xl shadow-[0_4px_20px_-4px_rgba(225,29,72,0.1)]">
                  <div className="shrink-0 text-center">
                    <div className="text-[48px] font-black text-rose-600 leading-none drop-shadow-sm">42</div>
                    <div className="text-[12px] font-bold text-rose-500 mt-1">综合健康度</div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <XCircle size={18} className="text-rose-600" />
                      <h4 className="font-bold text-rose-900 text-[16px]">存在严重违规风险，建议拦截发布</h4>
                    </div>
                    <p className="text-[13px] text-rose-700/80 leading-relaxed">检测出 3 处绝对化用语，以及对特殊人群（孕妇）的不当承诺。若强行发布将面临被限流或封号的风险。</p>
                  </div>
                  <button 
                    onClick={handleRewrite}
                    className="shrink-0 bg-rose-600 text-white px-5 py-3 rounded-xl font-bold text-[14px] shadow-lg shadow-rose-600/20 hover:bg-rose-700 active:scale-95 transition-all flex items-center gap-2"
                  >
                    <Sparkles size={16} /> AI 一键合规改写
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-6 p-6 bg-emerald-50 border border-emerald-100 rounded-2xl shadow-[0_4px_20px_-4px_rgba(16,185,129,0.1)]">
                  <div className="shrink-0 text-center">
                    <div className="text-[48px] font-black text-emerald-600 leading-none drop-shadow-sm">92</div>
                    <div className="text-[12px] font-bold text-emerald-500 mt-1">综合健康度</div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 size={18} className="text-emerald-600" />
                      <h4 className="font-bold text-emerald-900 text-[16px]">内容健康度极佳，准许发布</h4>
                    </div>
                    <p className="text-[13px] text-emerald-700/80 leading-relaxed">未检测出敏感词及广告法违规。行文自然，客观描述产品功效，符合平台社区规范，推荐发布。</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-6">
                {/* Radar Chart Visual (CSS Art Polygon) */}
                <div className="bg-neutral-50 border border-neutral-100 rounded-2xl p-6 flex flex-col items-center justify-center">
                  <h4 className="text-[13px] font-bold text-neutral-900 mb-6 w-full text-center">多维评估雷达图</h4>
                  <div className="relative w-48 h-48">
                    <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                      <polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5" fill="none" stroke="#e5e5e5" strokeWidth="1" />
                      <polygon points="50,15 85,32.5 85,67.5 50,85 15,67.5 15,32.5" fill="none" stroke="#e5e5e5" strokeWidth="1" />
                      <polygon points="50,25 75,37.5 75,62.5 50,75 25,62.5 25,37.5" fill="none" stroke="#e5e5e5" strokeWidth="1" />
                      <polygon points="50,35 65,42.5 65,57.5 50,65 35,57.5 35,42.5" fill="none" stroke="#e5e5e5" strokeWidth="1" />
                      <line x1="50" y1="50" x2="50" y2="5" stroke="#e5e5e5" strokeWidth="1" />
                      <line x1="50" y1="50" x2="95" y2="27.5" stroke="#e5e5e5" strokeWidth="1" />
                      <line x1="50" y1="50" x2="95" y2="72.5" stroke="#e5e5e5" strokeWidth="1" />
                      <line x1="50" y1="50" x2="50" y2="95" stroke="#e5e5e5" strokeWidth="1" />
                      <line x1="50" y1="50" x2="5" y2="72.5" stroke="#e5e5e5" strokeWidth="1" />
                      <line x1="50" y1="50" x2="5" y2="27.5" stroke="#e5e5e5" strokeWidth="1" />
                      
                      {/* Data Polygon based on content */}
                      {content.includes("绝绝子") ? (
                        <polygon points="50,70 85,32.5 70,72.5 50,85 20,60 15,40" fill="rgba(225, 29, 72, 0.2)" stroke="#e11d48" strokeWidth="2" />
                      ) : (
                        <polygon points="50,15 90,30 85,70 50,85 10,70 15,30" fill="rgba(16, 185, 129, 0.2)" stroke="#10b981" strokeWidth="2" />
                      )}
                    </svg>
                    
                    {content.includes("绝绝子") ? (
                      <>
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-rose-600 bg-white px-1">合规性(极低)</span>
                        <span className="absolute top-1/4 -right-10 text-[10px] font-bold text-emerald-600 bg-white px-1">吸引力(高)</span>
                        <span className="absolute bottom-1/4 -right-10 text-[10px] font-bold text-emerald-600 bg-white px-1">可读性(良)</span>
                        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-emerald-600 bg-white px-1">封面匹配(优)</span>
                        <span className="absolute bottom-1/4 -left-12 text-[10px] font-bold text-rose-600 bg-white px-1">爆款相似度(低)</span>
                        <span className="absolute top-1/4 -left-10 text-[10px] font-bold text-emerald-600 bg-white px-1">人设契合(中)</span>
                      </>
                    ) : (
                      <>
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-emerald-600 bg-white px-1">合规性(极高)</span>
                        <span className="absolute top-1/4 -right-10 text-[10px] font-bold text-emerald-600 bg-white px-1">吸引力(高)</span>
                        <span className="absolute bottom-1/4 -right-10 text-[10px] font-bold text-emerald-600 bg-white px-1">可读性(优)</span>
                        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-emerald-600 bg-white px-1">封面匹配(优)</span>
                        <span className="absolute bottom-1/4 -left-12 text-[10px] font-bold text-emerald-600 bg-white px-1">爆款相似度(高)</span>
                        <span className="absolute top-1/4 -left-10 text-[10px] font-bold text-emerald-600 bg-white px-1">人设契合(高)</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Warnings List */}
                <div className="space-y-3">
                  {content.includes("绝绝子") ? (
                    <>
                      <div className="p-3 border-l-4 border-rose-500 bg-white shadow-sm rounded-r-xl border-y border-r border-neutral-100 flex items-start gap-3">
                        <AlertTriangle size={16} className="text-rose-500 mt-0.5 shrink-0" />
                        <div>
                          <span className="text-[12px] font-bold text-neutral-900 block mb-1">广告法绝对化用语</span>
                          <p className="text-[11px] text-neutral-500 leading-relaxed">发现「全网第一」、「绝对」等词汇，违反《广告法》第9条。强烈建议修改或使用 AI 一键合规。</p>
                        </div>
                      </div>
                      <div className="p-3 border-l-4 border-rose-500 bg-white shadow-sm rounded-r-xl border-y border-r border-neutral-100 flex items-start gap-3">
                        <AlertTriangle size={16} className="text-rose-500 mt-0.5 shrink-0" />
                        <div>
                          <span className="text-[12px] font-bold text-neutral-900 block mb-1">特殊人群承诺风险</span>
                          <p className="text-[11px] text-neutral-500 leading-relaxed">发现「孕妇都能放心闭眼入」。根据平台规范，非特殊用途化妆品不得对孕妇群体做绝对安全承诺。</p>
                        </div>
                      </div>
                      <div className="p-3 border-l-4 border-amber-500 bg-white shadow-sm rounded-r-xl border-y border-r border-neutral-100 flex items-start gap-3">
                        <AlertTriangle size={16} className="text-amber-500 mt-0.5 shrink-0" />
                        <div>
                          <span className="text-[12px] font-bold text-neutral-900 block mb-1">营销水军识别预警</span>
                          <p className="text-[11px] text-neutral-500 leading-relaxed">「家人们谁懂啊」、「绝绝子」过度使用，易被小红书风控系统判定为营销水军，降低初始流量池。</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="p-4 border border-emerald-100 bg-emerald-50/50 shadow-sm rounded-xl flex items-start gap-3 h-full flex-col justify-center">
                        <CheckCircle2 size={32} className="text-emerald-500 mb-2" />
                        <div>
                          <span className="text-[14px] font-bold text-neutral-900 block mb-1">未发现违规项</span>
                          <p className="text-[12px] text-neutral-500 leading-relaxed">该文案已通过 30,000+ 平台敏感词库及最新广告法筛查。客观真实，口吻自然。</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

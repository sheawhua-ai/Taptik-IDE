import React, { useState } from 'react';

export default function TaskDispatch() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showTasks, setShowTasks] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowTasks(true);
    }, 1500);
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto min-h-full flex flex-col space-y-6">
      <header className="flex justify-between items-end shrink-0">
        <div>
          <h1 className="text-[2rem] font-extrabold tracking-tight text-zinc-900 mb-2">任务派发与素材审核</h1>
          <p className="text-zinc-500 max-w-2xl text-sm">统一掌管多商家、多门店的拍摄任务执行，打通“需求下发 - 素材回传 - AI预审 - 人工终审”全链路。</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-zinc-200 text-zinc-700 font-bold rounded-xl text-sm hover:bg-zinc-50 transition-colors shadow-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">settings</span>
            自动派发配置
          </button>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        {/* 左侧：任务生成与派发 */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 min-h-0">
          <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6 flex flex-col h-full">
            <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-[#5157a7]">assignment_add</span>
              AI 智能拆单与派发
            </h2>
            
            <div className="space-y-5 flex-1 overflow-y-auto custom-scrollbar pr-2">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-2">输入笔记灵感或拍摄需求</label>
                <textarea 
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#5157a7]/20 h-28 resize-none" 
                  placeholder="例如：需要一篇极氪001的春季出游种草笔记，重点突出大空间和露营模式..."
                  defaultValue="需要一篇极氪001的春季出游种草笔记，重点突出大空间和露营模式，需要有外景和内饰特写。"
                ></textarea>
                <button 
                  onClick={handleGenerate}
                  className="w-full mt-3 bg-zinc-900 text-white py-2.5 rounded-xl text-xs font-bold shadow-md hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <><span className="material-symbols-outlined text-[16px] animate-spin">sync</span> AI 拆解中...</>
                  ) : (
                    <><span className="material-symbols-outlined text-[16px]">auto_awesome</span> AI 拆解为拍摄任务</>
                  )}
                </button>
              </div>

              {showTasks && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="p-4 bg-[#e0e0ff]/30 border border-[#5157a7]/20 rounded-xl space-y-3">
                    <h3 className="text-xs font-bold text-[#5157a7] flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">format_list_bulleted</span> 拆解出的素材需求
                    </h3>
                    <div className="space-y-2">
                      <div className="bg-white p-2.5 rounded-lg border border-zinc-100 text-xs text-zinc-700 flex items-start gap-2 shadow-sm">
                        <span className="bg-zinc-100 text-zinc-500 px-1.5 py-0.5 rounded text-[10px] font-bold mt-0.5">镜头1</span>
                        <span>车辆外观全景图（需在户外自然环境，如草地/公园）</span>
                      </div>
                      <div className="bg-white p-2.5 rounded-lg border border-zinc-100 text-xs text-zinc-700 flex items-start gap-2 shadow-sm">
                        <span className="bg-zinc-100 text-zinc-500 px-1.5 py-0.5 rounded text-[10px] font-bold mt-0.5">镜头2</span>
                        <span>后备箱露营模式特写（需展示空间感，最好有露营装备）</span>
                      </div>
                      <div className="bg-white p-2.5 rounded-lg border border-zinc-100 text-xs text-zinc-700 flex items-start gap-2 shadow-sm">
                        <span className="bg-zinc-100 text-zinc-500 px-1.5 py-0.5 rounded text-[10px] font-bold mt-0.5">镜头3</span>
                        <span>中控屏幕特写（亮屏状态，展示导航或音乐界面）</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-zinc-700">选择目标商家与门店</label>
                    <select className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5157a7]/20">
                      <option>极氪智慧出行</option>
                      <option>JD Architecture</option>
                    </select>
                    <div className="p-3 border border-zinc-200 rounded-xl bg-zinc-50 space-y-2.5 max-h-32 overflow-y-auto custom-scrollbar">
                      <label className="flex items-center gap-2 text-xs cursor-pointer text-zinc-700"><input type="checkbox" defaultChecked className="rounded text-[#5157a7] w-3.5 h-3.5 accent-[#5157a7]" /> 杭州城西银泰店 (导购: 8人)</label>
                      <label className="flex items-center gap-2 text-xs cursor-pointer text-zinc-700"><input type="checkbox" defaultChecked className="rounded text-[#5157a7] w-3.5 h-3.5 accent-[#5157a7]" /> 上海万象城店 (导购: 12人)</label>
                      <label className="flex items-center gap-2 text-xs cursor-pointer text-zinc-700"><input type="checkbox" className="rounded text-[#5157a7] w-3.5 h-3.5 accent-[#5157a7]" /> 广州太古汇店 (导购: 6人)</label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-zinc-100 shrink-0">
              <button className={`w-full py-3.5 rounded-xl text-sm font-bold shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 ${showTasks ? 'bg-[#5157a7] text-white hover:bg-[#444a99] shadow-[#5157a7]/20' : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'}`}>
                <span className="material-symbols-outlined text-[18px]">send</span>
                一键派发任务至门店
              </button>
            </div>
          </div>
        </div>

        {/* 右侧：执行看板与素材审核 */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6 min-h-0">
          
          {/* 多商家执行大盘 */}
          <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6 shrink-0">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-zinc-400">dashboard</span>
                多商家任务执行大盘
              </h2>
              <div className="flex gap-2">
                <span className="flex items-center gap-1 text-[10px] font-bold text-zinc-500 bg-zinc-50 px-2 py-1 rounded-md border border-zinc-100"><span className="w-2 h-2 rounded-full bg-zinc-300"></span> 待接单 24</span>
                <span className="flex items-center gap-1 text-[10px] font-bold text-zinc-500 bg-zinc-50 px-2 py-1 rounded-md border border-zinc-100"><span className="w-2 h-2 rounded-full bg-blue-400"></span> 拍摄中 15</span>
                <span className="flex items-center gap-1 text-[10px] font-bold text-zinc-500 bg-zinc-50 px-2 py-1 rounded-md border border-zinc-100"><span className="w-2 h-2 rounded-full bg-amber-400"></span> 待审核 8</span>
                <span className="flex items-center gap-1 text-[10px] font-bold text-zinc-500 bg-zinc-50 px-2 py-1 rounded-md border border-zinc-100"><span className="w-2 h-2 rounded-full bg-emerald-400"></span> 已完成 142</span>
              </div>
            </div>
            
            <div className="overflow-x-auto custom-scrollbar pb-2">
              <table className="w-full text-left whitespace-nowrap">
                <thead>
                  <tr className="text-[11px] font-black text-zinc-400 uppercase tracking-widest border-b border-zinc-100">
                    <th className="pb-3 font-black">商家 / 门店</th>
                    <th className="pb-3 font-black">任务名称</th>
                    <th className="pb-3 font-black">执行人</th>
                    <th className="pb-3 font-black">当前状态</th>
                    <th className="pb-3 font-black text-right">更新时间</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  <tr className="hover:bg-zinc-50 transition-colors">
                    <td className="py-3">
                      <div className="text-xs font-bold text-zinc-800">极氪智慧出行</div>
                      <div className="text-[10px] text-zinc-500">上海万象城店</div>
                    </td>
                    <td className="py-3 text-xs text-zinc-700">春季出游种草素材采集</td>
                    <td className="py-3 text-xs text-zinc-600 flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px] text-zinc-400">person</span> 导购-李明</td>
                    <td className="py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-100">待审核 (3/3)</span>
                    </td>
                    <td className="py-3 text-[10px] text-zinc-400 text-right">10分钟前</td>
                  </tr>
                  <tr className="hover:bg-zinc-50 transition-colors">
                    <td className="py-3">
                      <div className="text-xs font-bold text-zinc-800">极氪智慧出行</div>
                      <div className="text-[10px] text-zinc-500">杭州城西银泰店</div>
                    </td>
                    <td className="py-3 text-xs text-zinc-700">春季出游种草素材采集</td>
                    <td className="py-3 text-xs text-zinc-600 flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px] text-zinc-400">person</span> 导购-王芳</td>
                    <td className="py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100">拍摄中 (1/3)</span>
                    </td>
                    <td className="py-3 text-[10px] text-zinc-400 text-right">1小时前</td>
                  </tr>
                  <tr className="hover:bg-zinc-50 transition-colors">
                    <td className="py-3">
                      <div className="text-xs font-bold text-zinc-800">JD Architecture</div>
                      <div className="text-[10px] text-zinc-500">北京国贸店</div>
                    </td>
                    <td className="py-3 text-xs text-zinc-700">极简风样板间实拍</td>
                    <td className="py-3 text-xs text-zinc-600 flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px] text-zinc-400">person</span> 设计师-张伟</td>
                    <td className="py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-100 text-zinc-600 border border-zinc-200">待接单</span>
                    </td>
                    <td className="py-3 text-[10px] text-zinc-400 text-right">2小时前</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 素材双重审核中心 */}
          <div className="bg-zinc-900 rounded-2xl shadow-xl p-6 flex-1 flex flex-col min-h-0">
            <div className="flex justify-between items-center mb-6 shrink-0">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-[#e0e0ff]">fact_check</span>
                素材双重审核中心
              </h2>
              <span className="text-[10px] text-zinc-400">AI 预审完成，等待人工终审</span>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2">
              {/* 审核卡片 1 */}
              <div className="bg-zinc-800 rounded-xl p-4 border border-zinc-700">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-white">春季出游种草素材采集 <span className="text-xs font-normal text-zinc-400 ml-2">极氪智慧出行 - 上海万象城店</span></h3>
                    <p className="text-[10px] text-zinc-500 mt-1">提交人: 导购-李明 • 包含 3 张图片</p>
                  </div>
                </div>
                
                <div className="flex gap-4 mb-4">
                  <div className="w-24 h-24 rounded-lg bg-zinc-700 overflow-hidden relative group cursor-pointer">
                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDT-C7I9NAtz_G1_Z4hV5V89-mN0B-X_7yP8O1e4R4Y6fH7p9S0A1C2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1U2V3W4X5Y6Z" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" referrerPolicy="no-referrer" />
                    <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[8px] px-1 rounded">镜头1</span>
                  </div>
                  <div className="w-24 h-24 rounded-lg bg-zinc-700 overflow-hidden relative group cursor-pointer">
                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjNQhURlDCwsCTZwyAYT3J7m1CCxl4HDURD1JEa_bpLmITpUaDjlaXBfx2kQ5a_cX06ND7muUxQXRLo5dnDO15f0upgG5NgNpOCAGrTNh9y4jqDha_o2tZ6KUZHeANe0Apw4Ezt5R6zFsq9DuQY_iuY1vOlH1_SzIYDSP8unQ94YUDYXbQ7YXbQK4Q6UTh_v4k2aqHhDHodtQYf0LuF7dK3yGzXQpJhCAqA7isNbG733wy5BTyW5YFN1HeNWZjH2PXGM0G-V6ByWw" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" referrerPolicy="no-referrer" />
                    <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[8px] px-1 rounded">镜头2</span>
                  </div>
                  <div className="w-24 h-24 rounded-lg bg-zinc-700 overflow-hidden relative group cursor-pointer">
                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTxvHjWOcr_BTI6F70PLATbiqcpIyg3o6RWxc8g2MF3B6qFZ-Wpxr-F2d53hJe8mPrQ9wag_gyGtCRxTBSSv27t1cDIFvtZy4-a4MpM4Rfe53JsSJtoYA2J9XTQ95vOUHyaJvY74hENa69UKPpeK96Hf6Lj2YQ3oU_8q3qTmkU4cbqP40E3agCrYJXeSu-CVOcMJZgjYzjHm11GD0jRO9_OMm1sRyblmenI2H4DuzAPM6EaBloiOWp_BSTSDcbgJ6Ls9uRZ0-YiJI" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" referrerPolicy="no-referrer" />
                    <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[8px] px-1 rounded">镜头3</span>
                  </div>
                </div>

                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg mb-4 flex items-start gap-2">
                  <span className="material-symbols-outlined text-emerald-400 text-[16px] mt-0.5">verified</span>
                  <div>
                    <p className="text-xs font-bold text-emerald-400">AI 预审通过</p>
                    <p className="text-[10px] text-zinc-400 mt-0.5">画面清晰度达标，已识别到户外场景、露营装备及中控屏幕，符合任务需求约束。</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 py-2 bg-[#5157a7] text-white text-xs font-bold rounded-lg hover:bg-[#444a99] transition-colors shadow-md shadow-[#5157a7]/20">人工审核通过，推入生产线</button>
                  <button className="px-4 py-2 bg-zinc-700 text-zinc-300 text-xs font-bold rounded-lg hover:bg-zinc-600 transition-colors">打回重拍</button>
                </div>
              </div>

              {/* 审核卡片 2 */}
              <div className="bg-zinc-800 rounded-xl p-4 border border-red-500/30">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-white">极简风样板间实拍 <span className="text-xs font-normal text-zinc-400 ml-2">JD Architecture - 深圳湾店</span></h3>
                    <p className="text-[10px] text-zinc-500 mt-1">提交人: 设计师-王磊 • 包含 1 张图片</p>
                  </div>
                </div>
                
                <div className="flex gap-4 mb-4">
                  <div className="w-24 h-24 rounded-lg bg-zinc-700 overflow-hidden relative group cursor-pointer border-2 border-red-500/50">
                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDaset48DydtP7YJ7F6WChuXTpWoTuqwZpibjzK7OZm5nknO2R78MyaIioFeStDuwlI2UBLA_P0jewzi_eBYRjqIWblGcDfrWOtfrwOCwDMudEE3NBD_Z04Gwc8F2ow1YdAAgikBFIuYHw6TpmHlz5387QNc7diwhQcZABnC_QyoeE7zbFZnSj_eaadkoPWjMSU9bNVQ4NKugcCLpOB9zEUxiIFaAlQkTqNb4GLMer7XenUZ6gSQP0xG2Wjv6qcaaplONCu4WCk7wc" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" referrerPolicy="no-referrer" />
                    <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[8px] px-1 rounded">镜头1</span>
                  </div>
                </div>

                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg mb-4 flex items-start gap-2">
                  <span className="material-symbols-outlined text-red-400 text-[16px] mt-0.5">error</span>
                  <div>
                    <p className="text-xs font-bold text-red-400">AI 预审未通过</p>
                    <p className="text-[10px] text-zinc-400 mt-0.5">光线过暗，画面噪点较多，且未能有效突出“极简”风格的核心家具元素。</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 py-2 bg-zinc-700 text-zinc-300 text-xs font-bold rounded-lg hover:bg-zinc-600 transition-colors">一键打回重拍 (附带AI建议)</button>
                  <button className="px-4 py-2 bg-zinc-800 border border-zinc-600 text-zinc-400 text-xs font-bold rounded-lg hover:bg-zinc-700 transition-colors">忽略警告，强制通过</button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

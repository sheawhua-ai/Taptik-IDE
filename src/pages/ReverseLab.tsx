import React, { useState } from 'react';

export default function ReverseLab() {
  const [inputType, setInputType] = useState<'keyword' | 'link'>('keyword');
  const [expandedId, setExpandedId] = useState<number | null>(1);
  const [analyzingId, setAnalyzingId] = useState<number | null>(1);

  const candidates = [
    {
      id: 1,
      title: "不砸钱也能装出高级感？这 5 个细节绝了...",
      author: "装修小白日记",
      followers: 420,
      likes: "2.4k",
      type: "图文",
      content: "今天给大家分享一下我家的极简风装修，真的没花多少钱，但是效果绝绝子！\n\n1. 越少越好：不要做复杂的吊顶，双眼皮吊顶便宜又好看。\n2. 颜色统一：全屋大白墙搭配原木色家具，怎么都不会出错。\n3. 灯光氛围：无主灯设计真的太香了，见光不见灯，氛围感拉满。\n4. 软装点缀：买几幅有艺术感的挂画，瞬间提升格调。\n5. 保持整洁：断舍离才是最高级的装修！\n\n#沉浸式装修 #省钱秘籍 #极简主义"
    },
    {
      id: 2,
      title: "租房党必看！百元打造梦幻卧室，这灯光绝了...",
      author: "独居的娜娜",
      followers: 122,
      likes: "1.8k",
      type: "视频",
      content: "[视频语音转写] 哈喽大家好，我是娜娜。今天带大家看看我花了一百块钱改造的卧室。大家看这个氛围灯，是不是绝了？其实就是在网上买的几十块钱的灯带，贴在床头背后。还有这个四件套，也是纯棉的，睡起来特别舒服。墙上的海报也是我自己打印的，才花了几块钱。租房也要好好生活呀！喜欢的姐妹赶紧抄作业！\n\n#租房改造 #氛围感灯光 #独居生活"
    },
    {
      id: 3,
      title: "谁懂啊！这种奶油风厨房真的太治愈了...",
      author: "美食家大雄",
      followers: 880,
      likes: "3.2k",
      type: "图文",
      content: "终于拥有了梦中情厨！奶油风真的太治愈了，每次做饭心情都超级好。\n\n橱柜选了肤感膜的奶油色，台面是纯白石英石，水槽是白色大单槽，整体看起来非常干净。最满意的是这个小白砖，贴上去复古又清新。大家装修厨房一定要多花点心思，毕竟是一日三餐产生的地方呀！\n\n#奶油风厨房 #软装搭配 #小户型案例"
    }
  ];

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-zinc-900">爆款拆解与模板</h2>
          <p className="text-sm text-zinc-500">将行业爆款的图文逻辑提炼为可复用的标准任务模板</p>
        </div>
        <div className="flex gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-zinc-200 text-[10px] font-bold text-zinc-600">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5157a7] animate-pulse"></span> 实时同步中
          </span>
        </div>
      </div>

      {/* 第一部分：检索与候选笔记 */}
      <section className="grid grid-cols-12 gap-6">
        {/* 左侧输入区 */}
        <div className="col-span-12 lg:col-span-4 bg-white border border-zinc-200 rounded-xl p-5 shadow-sm flex flex-col">
          <h3 className="text-sm font-bold flex items-center gap-2 mb-4 text-zinc-900">
            <span className="material-symbols-outlined text-[18px] text-[#5157a7]">travel_explore</span>
            爆款内容检索与导入
          </h3>
          
          <div className="flex bg-zinc-100 p-1 rounded-lg mb-4 shrink-0">
            <button 
              onClick={() => setInputType('keyword')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors ${inputType === 'keyword' ? 'bg-white text-[#5157a7] shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
            >
              关键词检索
            </button>
            <button 
              onClick={() => setInputType('link')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors ${inputType === 'link' ? 'bg-white text-[#5157a7] shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
            >
              链接直接读取
            </button>
          </div>

          {inputType === 'keyword' ? (
            <div className="space-y-4 flex-1">
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 mb-1.5 uppercase tracking-wider">搜索关键词</label>
                <input className="w-full border border-zinc-200 bg-zinc-50 rounded-lg p-3 text-sm focus:ring-1 focus:ring-[#5157a7]/30 outline-none" placeholder="例如：极简装修、春季穿搭" type="text" defaultValue="极简装修" />
              </div>
              <div className="p-3 bg-[#e0e0ff]/30 border border-[#5157a7]/20 rounded-lg flex items-start gap-2">
                <span className="material-symbols-outlined text-[#5157a7] text-[16px] mt-0.5">filter_alt</span>
                <div>
                  <p className="text-xs font-bold text-[#5157a7]">默认检索低粉爆款</p>
                  <p className="text-[10px] text-zinc-500 mt-0.5">系统将自动过滤头部大号，优先寻找粉丝数 &lt; 1000 但点赞数 &gt; 1000 的高潜力笔记。</p>
                </div>
              </div>
              <button className="w-full bg-zinc-900 text-white text-xs font-bold py-3 rounded-lg hover:bg-zinc-800 transition-colors shadow-md mt-auto">
                检索候选笔记
              </button>
            </div>
          ) : (
            <div className="space-y-4 flex-1">
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 mb-1.5 uppercase tracking-wider">小红书笔记链接</label>
                <textarea className="w-full border border-zinc-200 bg-zinc-50 rounded-lg p-3 text-sm focus:ring-1 focus:ring-[#5157a7]/30 h-32 resize-none outline-none" placeholder="请粘贴小红书笔记链接..."></textarea>
              </div>
              <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg flex items-start gap-2">
                <span className="material-symbols-outlined text-zinc-400 text-[16px] mt-0.5">info</span>
                <p className="text-[10px] text-zinc-500">支持图文及视频笔记。视频笔记将自动提取语音并转化为文本供 AI 拆解。</p>
              </div>
              <button className="w-full bg-zinc-900 text-white text-xs font-bold py-3 rounded-lg hover:bg-zinc-800 transition-colors shadow-md mt-auto">
                读取笔记原文
              </button>
            </div>
          )}
        </div>

        {/* 右侧候选列表 */}
        <div className="col-span-12 lg:col-span-8 bg-white border border-zinc-200 rounded-xl p-5 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold flex items-center gap-2 text-zinc-900">
              <span className="material-symbols-outlined text-[18px] text-[#5157a7]">list_alt</span>
              候选笔记原文 (3)
            </h3>
            <span className="text-[10px] text-zinc-400 font-medium">请点开查看原文，并选择一篇进行 AI 拆解</span>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar max-h-[400px]">
            {candidates.map((candidate) => (
              <div key={candidate.id} className={`border rounded-xl transition-all duration-200 overflow-hidden ${analyzingId === candidate.id ? 'border-[#5157a7] ring-1 ring-[#5157a7]/20 bg-[#e0e0ff]/10' : expandedId === candidate.id ? 'border-zinc-300 bg-white' : 'border-zinc-200 bg-white hover:border-zinc-300'}`}>
                {/* Header */}
                <div 
                  className="p-4 flex items-center justify-between cursor-pointer"
                  onClick={() => setExpandedId(expandedId === candidate.id ? null : candidate.id)}
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded ${candidate.type === '视频' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                        {candidate.type}
                      </span>
                      <h4 className="text-sm font-bold text-zinc-900 truncate">{candidate.title}</h4>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-zinc-500">
                      <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">person</span> {candidate.author}</span>
                      <span className="flex items-center gap-1 text-emerald-600 font-medium"><span className="material-symbols-outlined text-[14px]">group</span> 粉丝 {candidate.followers}</span>
                      <span className="flex items-center gap-1 text-red-500 font-medium"><span className="material-symbols-outlined text-[14px]">favorite</span> 点赞 {candidate.likes}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {analyzingId === candidate.id && (
                      <span className="text-[10px] font-bold text-[#5157a7] bg-[#e0e0ff] px-2 py-1 rounded-md flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px] animate-spin">sync</span> 拆解中
                      </span>
                    )}
                    <span className={`material-symbols-outlined text-zinc-400 transition-transform duration-200 ${expandedId === candidate.id ? 'rotate-180' : ''}`}>
                      expand_more
                    </span>
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedId === candidate.id && (
                  <div className="px-4 pb-4 pt-1 border-t border-zinc-100 bg-zinc-50/50">
                    <div className="mb-3 flex justify-between items-center">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">笔记原文读取结果</span>
                      {candidate.type === '视频' && (
                        <span className="text-[9px] font-bold text-amber-600 bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px]">graphic_eq</span> 视频语音已转文本
                        </span>
                      )}
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-zinc-200 text-xs text-zinc-700 leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto custom-scrollbar">
                      {candidate.content}
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setAnalyzingId(candidate.id);
                        }}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${analyzingId === candidate.id ? 'bg-[#5157a7] text-white shadow-md shadow-[#5157a7]/20' : 'bg-zinc-900 text-white hover:bg-zinc-800'}`}
                      >
                        <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                        {analyzingId === candidate.id ? '正在拆解此笔记...' : '选择此篇进行 AI 拆解'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 第二部分：拆解结果 (仅在有选中拆解时显示) */}
      <div className={`transition-all duration-500 ${analyzingId ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none hidden'}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="h-[1px] flex-1 bg-zinc-200"></div>
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">AI 拆解结果</span>
          <div className="h-[1px] flex-1 bg-zinc-200"></div>
        </div>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined material-symbols-filled text-zinc-900 text-[20px]">palette</span>
              <h4 className="text-xs font-bold text-zinc-900">画面拆解结果</h4>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-zinc-50 border border-zinc-100 rounded-lg">
                  <span className="text-[10px] text-zinc-400 block mb-1">首图特征</span>
                  <span className="text-[11px] font-bold text-[#5157a7]">强人像 / 情绪特写</span>
                </div>
                <div className="p-3 bg-zinc-50 border border-zinc-100 rounded-lg">
                  <span className="text-[10px] text-zinc-400 block mb-1">图片数量</span>
                  <span className="text-[11px] font-bold text-[#5157a7]">平均 4-6 张</span>
                </div>
              </div>
              <p className="text-[10px] text-zinc-500 italic bg-zinc-50 p-2 rounded border border-zinc-100">💡 “视觉一致性是该样本获得高留存的核心原因”</p>
            </div>
          </div>

          <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined material-symbols-filled text-zinc-900 text-[20px]">psychology</span>
              <h4 className="text-xs font-bold text-zinc-900">文案套路拆解</h4>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-zinc-50 border border-zinc-100 rounded-lg">
                <span className="text-[10px] text-zinc-400 block mb-1">高频词汇</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  <span className="px-2 py-0.5 bg-[#e0e0ff]/50 text-[#5157a7] border border-[#5157a7]/20 text-[9px] font-bold rounded">#沉浸式</span>
                  <span className="px-2 py-0.5 bg-[#e0e0ff]/50 text-[#5157a7] border border-[#5157a7]/20 text-[9px] font-bold rounded">#省钱秘籍</span>
                  <span className="px-2 py-0.5 bg-[#e0e0ff]/50 text-[#5157a7] border border-[#5157a7]/20 text-[9px] font-bold rounded">#绝绝子</span>
                </div>
              </div>
              <div className="p-3 bg-zinc-50 border border-zinc-100 rounded-lg">
                <span className="text-[10px] text-zinc-400 block mb-1">行文结构</span>
                <span className="text-[11px] font-bold text-[#5157a7]">痛点引入 -&gt; 方案反转 -&gt; 情绪共鸣</span>
              </div>
            </div>
          </div>
        </section>

        {/* 第三部分：模板配置 */}
        <section className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-sm font-bold mb-6 flex items-center gap-2 text-zinc-900"><span className="material-symbols-outlined text-[#5157a7]">architecture</span> 提炼为标准任务模板</h2>
          
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-8 space-y-6">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-2">模板名称</label>
                <input type="text" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#5157a7]/20" defaultValue="极简风低成本改造模板" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-2">图片数量要求</label>
                  <select className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#5157a7]/20">
                    <option>必须包含 3 张图</option>
                    <option>3-5 张图</option>
                    <option>不限制</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-2">首图画面约束</label>
                  <select className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#5157a7]/20">
                    <option>必须包含人像</option>
                    <option>必须包含产品特写</option>
                    <option>不限制</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-2">文案风格设定</label>
                <input type="text" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#5157a7]/20" defaultValue="痛点引入，强调性价比，多用感叹号和Emoji" />
              </div>
            </div>

            <div className="col-span-12 lg:col-span-4 flex flex-col">
              <div className="flex-1">
                <label className="block text-xs font-bold text-zinc-700 mb-2">挂载到指定商家</label>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1.5 bg-[#e0e0ff]/50 text-[#5157a7] rounded-lg text-xs font-bold flex items-center gap-1 border border-[#5157a7]/20">极氪智慧出行 <span className="material-symbols-outlined text-[14px] cursor-pointer hover:bg-[#5157a7]/20 rounded-full">close</span></span>
                  <span className="px-3 py-1.5 bg-zinc-50 text-zinc-600 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer hover:bg-zinc-100 transition-colors border border-zinc-200"><span className="material-symbols-outlined text-[14px]">add</span> 添加商家</span>
                </div>
                <p className="text-[10px] text-zinc-500 leading-relaxed">挂载后，该商家的门店导购即可在小程序端接收到此模板的拍摄与发文任务。</p>
              </div>
              
              <button className="w-full bg-zinc-900 text-white py-3.5 rounded-xl text-sm font-bold shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2 hover:bg-zinc-800">
                <span className="material-symbols-outlined text-[18px]">save</span>
                保存为标准模板
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

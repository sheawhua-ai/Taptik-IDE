import fs from 'fs';

let content = fs.readFileSync('src/components/rings/ExecutionPreview.tsx', 'utf-8');

// Replace the return block to wrap it in a flex container
content = content.replace(/return \(\s*<motion\.div\s*initial=\{\{ opacity: 0, scale: 0.98 \}\}\s*animate=\{\{ opacity: 1, scale: 1 \}\}\s*className="bg-\[#fcfcfc\] rounded-3xl border border-neutral-200 shadow-xl overflow-hidden"\s*>/, 
`  const [activeAdjust, setActiveAdjust] = useState<string | null>(null);

  const getSubAgentContent = () => {
    switch(activeAdjust) {
      case "direction":
        return {
          title: "主方向",
          current: "幼犬换粮避坑",
          reason: "低粉爆款信号增强，评论需求聚集，适合当前商家自然流切入",
          alternatives: [
            { name: "软便过渡期清单", desc: "更适合自然流" },
            { name: "换粮失败案例复盘", desc: "话题更具冲突感" },
            { name: "幼犬冻干平替测评", desc: "更适合测评号，不适合官方号" }
          ]
        };
      case "group":
        return {
          title: "内容分组",
          current: "素人 8 / 专业 4",
          reason: "先拿自然流测试，再用专业号补充信任背书",
          alternatives: [
            { name: "素人 10 / 专业 2", desc: "优先追求自然流起量，减少专业号占比" },
            { name: "素人 6 / 专业 6", desc: "品牌信任要求更高，想更快建立官方背书" },
            { name: "仅素人组", desc: "当前阶段只做低成本自然流测试，不强调官方信任" }
          ]
        };
      case "dist":
        return {
          title: "分发方式",
          current: "自有号定向承接 + 外部随机领取池",
          reason: "自有号可精确控制内容匹配，外部号适合后续随机扩散",
          alternatives: [
            { name: "仅用自有号", desc: "所有内容都将绑定自有号。更可控，但覆盖范围变小" },
            { name: "先自有号，次轮再开放外部池", desc: "分阶段放量，风险更低" },
            { name: "外部池只允许领取素人口吻内容", desc: "精细化管控口吻" }
          ]
        };
      case "sync":
        return {
          title: "协同方式",
          current: "进入待审核队列，并同步飞书项目群",
          reason: "确保内容先审后发，团队成员可以在飞书同步跟进",
          alternatives: [
            { name: "只生成不入队", desc: "供内部提前审阅" },
            { name: "进入审核但不同步飞书", desc: "减少打扰" },
            { name: "只同步内部，不同步客户群", desc: "内部确认优先" }
          ]
        };
      default:
        return null;
    }
  };

  const agentContent = getSubAgentContent();

  return (
    <div className="flex flex-col lg:flex-row gap-6 relative items-start w-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className={\`bg-[#fcfcfc] rounded-3xl border border-neutral-200 shadow-xl overflow-hidden transition-all duration-300 \${activeAdjust ? 'w-full lg:w-[65%]' : 'w-full'}\`}
      >`);

// Add the right panel to the end
content = content.replace(/<\/motion\.div>\s*\);\s*\}\s*const XIcon/g, `</motion.div>

      <AnimatePresence>
        {activeAdjust && agentContent && (
          <motion.div
            initial={{ opacity: 0, x: 20, width: 0 }}
            animate={{ opacity: 1, x: 0, width: '35%' }}
            exit={{ opacity: 0, x: 20, width: 0 }}
            className="hidden lg:flex flex-col shrink-0 sticky top-0 h-[calc(100vh-120px)] bg-white rounded-3xl border border-neutral-200 shadow-xl overflow-hidden"
          >
            <div className="p-6 border-b border-neutral-100 bg-indigo-50/30">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={18} className="text-indigo-500" />
                <h4 className="text-[15px] font-bold text-neutral-900">正在协同调整：{agentContent.title}</h4>
              </div>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto">
              <div className="mb-6">
                <div className="text-[12px] font-semibold text-neutral-400 mb-1">当前方案：</div>
                <div className="text-[14px] font-bold text-neutral-900 mb-2">{agentContent.current}</div>
                <div className="text-[13px] text-neutral-600 bg-neutral-50 p-3 rounded-xl border border-neutral-100 leading-relaxed">
                  <strong className="text-neutral-800">理由：</strong> {agentContent.reason}
                </div>
              </div>

              <div>
                <div className="text-[12px] font-semibold text-neutral-400 mb-3">可替代方案：</div>
                <div className="space-y-3">
                  {agentContent.alternatives.map((alt, idx) => (
                    <div key={idx} className="p-3 border border-neutral-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50/30 transition-colors cursor-pointer group">
                      <div className="text-[13px] font-bold text-neutral-900 mb-1 group-hover:text-indigo-700">{idx + 1}. {alt.name}</div>
                      <div className="text-[12px] text-neutral-500 leading-relaxed"><strong className="text-neutral-600">适合：</strong> {alt.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-neutral-100 bg-neutral-50/50 space-y-3">
              <div className="text-[12px] text-neutral-500 mb-2">请选择一种，或告诉我你的偏好。</div>
              <button className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-[13px] font-medium transition-colors">采用方案 1</button>
              <button className="w-full py-2.5 bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 rounded-xl text-[13px] font-medium transition-colors">让我再给一个更激进版本</button>
              <button className="w-full py-2.5 bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 rounded-xl text-[13px] font-medium transition-colors">按我的偏好重算</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const XIcon`);

// Now replace the buttons in the judgements with '接受' and '协同调整'
content = content.replace(/\{\[\s*\{\s*label:\s*"保持",\s*val:\s*"幼犬换粮避坑"\s*\},[\s\S]*?\]\.map\(\(opt\) => \([\s\S]*?<\/button>\s*\)\)\}/, 
`<button onClick={() => setActiveAdjust(null)} className="px-4 py-1.5 bg-neutral-900 text-white text-[12px] font-medium rounded-lg shadow-sm hover:bg-neutral-800 transition-colors">接受</button>
 <button onClick={() => setActiveAdjust("direction")} className="px-4 py-1.5 bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:text-indigo-600 text-[12px] font-medium rounded-lg flex items-center gap-1.5 transition-colors">
   <Sparkles size={14} className="text-indigo-500" /> 协同调整
 </button>`);

content = content.replace(/\{\[\s*\{\s*label:\s*"保持",\s*val:\s*"素人 8 \/ 专业 4"\s*\},[\s\S]*?\]\.map\(\(opt\) => \([\s\S]*?<\/button>\s*\)\)\}/, 
`<button onClick={() => setActiveAdjust(null)} className="px-4 py-1.5 bg-neutral-900 text-white text-[12px] font-medium rounded-lg shadow-sm hover:bg-neutral-800 transition-colors">接受</button>
 <button onClick={() => setActiveAdjust("group")} className="px-4 py-1.5 bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:text-indigo-600 text-[12px] font-medium rounded-lg flex items-center gap-1.5 transition-colors">
   <Sparkles size={14} className="text-indigo-500" /> 协同调整
 </button>`);

content = content.replace(/\{\[\s*\{\s*label:\s*"保持",\s*val:\s*"自有号定向承接 \+ 外部随机领取池"\s*\},[\s\S]*?\]\.map\(\(opt\) => \([\s\S]*?<\/button>\s*\)\)\}/, 
`<button onClick={() => setActiveAdjust(null)} className="px-4 py-1.5 bg-neutral-900 text-white text-[12px] font-medium rounded-lg shadow-sm hover:bg-neutral-800 transition-colors">接受</button>
 <button onClick={() => setActiveAdjust("dist")} className="px-4 py-1.5 bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:text-indigo-600 text-[12px] font-medium rounded-lg flex items-center gap-1.5 transition-colors">
   <Sparkles size={14} className="text-indigo-500" /> 协同调整
 </button>`);

content = content.replace(/\{\[\s*\{\s*label:\s*"保持",\s*val:\s*"进入待审核队列，并同步飞书项目群"\s*\},[\s\S]*?\]\.map\(\(opt\) => \([\s\S]*?<\/button>\s*\)\)\}/, 
`<button onClick={() => setActiveAdjust(null)} className="px-4 py-1.5 bg-neutral-900 text-white text-[12px] font-medium rounded-lg shadow-sm hover:bg-neutral-800 transition-colors">接受</button>
 <button onClick={() => setActiveAdjust("sync")} className="px-4 py-1.5 bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:text-indigo-600 text-[12px] font-medium rounded-lg flex items-center gap-1.5 transition-colors">
   <Sparkles size={14} className="text-indigo-500" /> 协同调整
 </button>`);

fs.writeFileSync('src/components/rings/ExecutionPreview.tsx', content);

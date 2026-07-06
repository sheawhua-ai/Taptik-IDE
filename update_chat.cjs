const fs = require('fs');
const file = 'src/components/rings/Strategy.tsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /<div className="mt-4 p-4 bg-indigo-50\/50 rounded-xl border border-indigo-100 flex flex-col gap-3">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;

const replacement = `<div className="mt-4 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <Bot size={16} className="text-indigo-600" />
                    <span className="text-[13px] font-bold text-indigo-900">操盘副手</span>
                  </div>
                  
                  {isAiThinking ? (
                    <div className="text-[13px] text-indigo-800 bg-white p-3 rounded-lg border border-indigo-100 shadow-sm flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                      <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                      <span className="ml-1">正在理解您的意图并调整参数...</span>
                    </div>
                  ) : aiMessage ? (
                    <div className="text-[13px] text-indigo-800 bg-white p-3 rounded-lg border border-indigo-100 shadow-sm leading-relaxed">
                      {aiMessage}
                    </div>
                  ) : (
                    <div className="text-[13px] text-indigo-800 bg-white p-3 rounded-lg border border-indigo-100 shadow-sm leading-relaxed">
                      您可以直接告诉我怎么调整，例如：“把真实客户的篇数加到 20 篇”，或者“更偏向自然流起量”。我会自动帮您修改下方的参数。
                    </div>
                  )}

                  <div className="relative mt-1">
                    <input 
                      type="text" 
                      value={aiInput}
                      onChange={(e) => setAiInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && aiInput) handleAiSubmit();
                      }}
                      placeholder="输入您的调整需求..." 
                      className="w-full bg-white border border-indigo-200 rounded-lg pl-3 pr-10 py-2 text-[13px] focus:outline-none focus:border-indigo-400"
                    />
                    <button 
                      onClick={handleAiSubmit}
                      disabled={!aiInput || isAiThinking}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-indigo-600 hover:text-indigo-700 disabled:text-indigo-300 bg-indigo-50 p-1 rounded-md transition-colors"
                    >
                      <Send size={14} />
                    </button>
                  </div>
                </div>
              </div>`;

content = content.replace(regex, replacement);

const stateRegex = /const \[adjustMemory, setAdjustMemory\] = useState\("only_once"\);/;
const newStates = `const [adjustMemory, setAdjustMemory] = useState("only_once");
  const [aiInput, setAiInput] = useState("");
  const [aiMessage, setAiMessage] = useState("");
  const [isAiThinking, setIsAiThinking] = useState(false);

  const handleAiSubmit = () => {
    if (!aiInput) return;
    setIsAiThinking(true);
    setTimeout(() => {
      setIsAiThinking(false);
      setAiMessage("没问题，我已经将主攻目标切换为“自然流起量”，并为您增加了真实客户快发的篇数（加至20篇），下方的参数已自动为您更新。");
      setFormValues({ ...formValues, koc: 20 });
      setSelectedTarget("自然流起量");
      setAiInput("");
    }, 1500);
  };`;

content = content.replace(stateRegex, newStates);

fs.writeFileSync(file, content);
console.log("Success update AI chat");

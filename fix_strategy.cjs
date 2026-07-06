const fs = require('fs');
const file = 'src/components/rings/Strategy.tsx';
let content = fs.readFileSync(file, 'utf8');

// fix imports
content = content.replace(/  X,\n  MessageSquare,\n  User,\n  Image as ImageIcon/m, "  X,\n  MessageSquare,\n  Send,\n  Image as ImageIcon");

// add AI chat
const targetStr = `                <p className="text-[13px] text-neutral-500">
                  修改运营参数，AI 将重新生成对应的起盘计划
                </p>
              </div>`;
const replacementStr = `                <p className="text-[13px] text-neutral-500">
                  修改运营参数，AI 将重新生成对应的起盘计划
                </p>

                {/* AI Assistant Chat inside Adjust Drawer */}
                <div className="mt-4 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <Bot size={16} className="text-indigo-600" />
                    <span className="text-[13px] font-bold text-indigo-900">操盘副手</span>
                  </div>
                  <div className="text-[13px] text-indigo-800 bg-white p-3 rounded-lg border border-indigo-100 shadow-sm leading-relaxed">
                    您可以直接告诉我怎么调整，例如：“把外部 KOC 的篇数加到 20 篇”，或者“更偏向自然流起量”。我会自动帮您修改下方的参数。
                  </div>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="输入您的调整需求..." 
                      className="w-full bg-white border border-indigo-200 rounded-lg pl-3 pr-10 py-2 text-[13px] focus:outline-none focus:border-indigo-400"
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 text-indigo-600 hover:text-indigo-700 bg-indigo-50 p-1 rounded-md">
                      <Send size={14} />
                    </button>
                  </div>
                </div>
              </div>`;

content = content.replace(targetStr, replacementStr);
fs.writeFileSync(file, content);
console.log("Success fix strategy");

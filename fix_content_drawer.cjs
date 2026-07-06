const fs = require('fs');
const file = 'src/components/rings/ContentDetailDrawer.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add states
content = content.replace(
  /const \[selectedContent, setSelectedContent\] = useState<any>\(MOCK_CONTENT\[0\]\);/,
  "const [selectedContent, setSelectedContent] = useState<any>(MOCK_CONTENT[0]);\n  const [isEditing, setIsEditing] = useState(false);\n  const [editContent, setEditContent] = useState('');\n  const [aiPrompt, setAiPrompt] = useState('');\n  const [isAiRewriting, setIsAiRewriting] = useState(false);\n"
);

// Add missing imports
if (!content.includes('Bot')) {
  content = content.replace(/X,\s*CheckCircle2,/, "X, CheckCircle2, Bot,");
}

// Ensure Send is imported
if (!content.includes('Send,')) {
    content = content.replace(/X,\s*CheckCircle2,/, "X, CheckCircle2, Send,");
}

// Modify the item click to reset editing
content = content.replace(
  /onClick=\{\(\) => setSelectedContent\(item\)\}/g,
  "onClick={() => { setSelectedContent(item); setIsEditing(false); setEditContent(item.content); }}"
);

// We need to replace the content block for `!selectedContent.isBrief`
const oldBlockRegex = /<div className="space-y-4">\s*<div className="flex items-center justify-between">\s*<div className="text-\[14px\] font-bold text-neutral-900">正文预览<\/div>\s*\{selectedContent\.readyForPublish && \(\s*<button className="text-\[12px\] font-bold text-indigo-600 hover:text-indigo-700">编辑正文<\/button>\s*\)\}\s*<\/div>[\s\S]*?(?:<\/div>\s*<\/div>\s*<\/div>\s*\)\s*:\s*\()/;

const newBlock = `<div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="text-[14px] font-bold text-neutral-900">正文预览</div>
                        {selectedContent.readyForPublish && !isEditing && (
                          <button 
                            className="text-[12px] font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg"
                            onClick={() => {
                              setIsEditing(true);
                              setEditContent(selectedContent.content);
                            }}
                          >
                            GUI + AI 智能编辑
                          </button>
                        )}
                        {isEditing && (
                          <button 
                            className="text-[12px] font-bold text-neutral-600 hover:text-neutral-900 bg-neutral-100 px-3 py-1.5 rounded-lg"
                            onClick={() => {
                              setIsEditing(false);
                              setSelectedContent({...selectedContent, content: editContent});
                            }}
                          >
                            保存修改
                          </button>
                        )}
                      </div>
                      
                      {isEditing ? (
                        <div className="space-y-4">
                          <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full h-48 bg-white border border-neutral-200 rounded-xl p-4 text-[13px] text-neutral-700 leading-relaxed focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none shadow-inner"
                          />
                          <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 flex flex-col gap-3">
                            <div className="flex items-center gap-2">
                              <Bot size={16} className="text-indigo-600" />
                              <span className="text-[13px] font-bold text-indigo-900">AI 改写助手</span>
                            </div>
                            <div className="relative">
                              <input 
                                type="text"
                                value={aiPrompt}
                                onChange={(e) => setAiPrompt(e.target.value)}
                                placeholder="输入改写指令，例如：'语气更口语化一些' 或 '把重点放在换粮法上'"
                                className="w-full bg-white border border-indigo-200 rounded-lg pl-3 pr-10 py-2.5 text-[13px] focus:outline-none focus:border-indigo-400"
                              />
                              <button 
                                onClick={() => {
                                  if(!aiPrompt) return;
                                  setIsAiRewriting(true);
                                  setTimeout(() => {
                                    setIsAiRewriting(false);
                                    setEditContent(editContent + "\\n\\n[AI已根据您的要求润色，语气更口语化]");
                                    setAiPrompt("");
                                  }, 1500);
                                }}
                                disabled={isAiRewriting || !aiPrompt}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-indigo-600 hover:text-indigo-700 disabled:text-indigo-300 bg-indigo-50 p-1.5 rounded-md transition-colors"
                              >
                                {isAiRewriting ? <div className="w-4 h-4 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" /> : <Send size={14} />}
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm space-y-3">
                          {selectedContent.content.split('\\n').map((p: string, i: number) => (
                            <p key={i} className="text-[13px] text-neutral-700 leading-relaxed min-h-[1em]">{p}</p>
                          ))}
                          {selectedContent.tags && (
                            <p className="text-[13px] text-indigo-600 font-medium">{selectedContent.tags}</p>
                          )}
                        </div>
                      )}
                      
                      {!isEditing && (
                        selectedContent.readyForPublish ? (
                          <button className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-[14px] font-bold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2">
                            <CheckCircle2 size={16} /> 确认并进入排期
                          </button>
                        ) : (
                          <button className="w-full py-3 bg-neutral-100 text-neutral-400 text-[14px] font-bold rounded-xl cursor-not-allowed flex items-center justify-center gap-2">
                            等待前置条件完成
                          </button>
                        )
                      )}
                    </div>`;

content = content.replace(oldBlockRegex, newBlock + "\n                </div>\n              </div>\n            ) : (");

fs.writeFileSync(file, content);
console.log("Success update content drawer");

const fs = require('fs');
let code = fs.readFileSync('src/components/rings/ContentReviewWorkbench.tsx', 'utf8');

const oldState = "const [showBatchConfirm, setShowBatchConfirm] = useState(false);";
const newState = oldState + "\n  const [activeArea, setActiveArea] = useState<'title' | 'content' | 'tags' | 'materials' | null>(null);";
code = code.replace(oldState, newState);

const oldTitleContent = `<input 
                      type="text" 
                      defaultValue={activeNote.title}
                      className="w-full text-[20px] font-bold text-neutral-900 mb-6 focus:outline-none placeholder-neutral-300"
                      placeholder="输入标题..."
                    />
                    
                    <div 
                      className="text-[15px] leading-relaxed text-neutral-800 min-h-[300px] focus:outline-none relative"
                      onMouseUp={handleSelection}
                      onKeyUp={handleSelection}
                      dangerouslySetInnerHTML={{__html: activeNote.content}}
                    />`;

const newTitleContent = `<input 
                      type="text" 
                      defaultValue={activeNote.title}
                      onFocus={() => { setActiveArea('title'); setActiveRightTab('issues'); }}
                      onBlur={() => setActiveArea(null)}
                      className={\`w-full text-[20px] font-bold text-neutral-900 mb-6 focus:outline-none placeholder-neutral-300 px-2 -mx-2 rounded transition-colors \${activeArea === 'title' ? 'bg-primary-50/50' : 'hover:bg-neutral-50'}\`}
                      placeholder="输入标题..."
                    />
                    
                    <div 
                      className={\`text-[15px] leading-relaxed text-neutral-800 min-h-[300px] focus:outline-none relative px-2 -mx-2 rounded transition-colors \${activeArea === 'content' ? 'bg-primary-50/50' : 'hover:bg-neutral-50'}\`}
                      onMouseUp={handleSelection}
                      onKeyUp={handleSelection}
                      onClick={() => { setActiveArea('content'); setActiveRightTab('issues'); }}
                      dangerouslySetInnerHTML={{__html: activeNote.content}}
                      contentEditable
                      suppressContentEditableWarning
                    />`;

code = code.replace(oldTitleContent, newTitleContent);

const oldTags = `<div className="mt-8 pt-6 border-t border-neutral-100 space-y-4">
                      <div>
                        <div className="text-[13px] font-bold text-neutral-900 flex items-center gap-1.5 mb-2">
                          <Tag size={14} /> 话题标签
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {activeNote.tags.map(t => (
                            <span key={t} className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded text-[12px]">#{t}</span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="text-[13px] font-bold text-neutral-900 flex items-center gap-1.5 mb-2">
                          <AlertOctagon size={14} /> 配图要求
                        </div>
                        <div className="text-[13px] text-neutral-600 bg-neutral-50 p-3 rounded-lg border border-neutral-100">
                          {activeNote.materialReq}
                        </div>
                      </div>
                    </div>`;

const newTags = `<div className="mt-8 pt-6 border-t border-neutral-100 space-y-4">
                      <div 
                        className={\`p-2 -mx-2 rounded transition-colors cursor-pointer \${activeArea === 'tags' ? 'bg-primary-50/50 ring-1 ring-primary-100' : 'hover:bg-neutral-50'}\`}
                        onClick={() => { setActiveArea('tags'); setActiveRightTab('issues'); }}
                      >
                        <div className="text-[13px] font-bold text-neutral-900 flex items-center gap-1.5 mb-2">
                          <Tag size={14} /> 话题标签
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {activeNote.tags.map(t => (
                            <span key={t} className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded text-[12px]">#{t}</span>
                          ))}
                          <button className="px-2 py-1 bg-neutral-50 border border-neutral-200 text-neutral-400 rounded text-[12px] hover:text-neutral-600 flex items-center gap-1"><Plus size={12}/> 添加</button>
                        </div>
                      </div>
                      <div 
                        className={\`p-2 -mx-2 rounded transition-colors cursor-pointer \${activeArea === 'materials' ? 'bg-primary-50/50 ring-1 ring-primary-100' : 'hover:bg-neutral-50'}\`}
                        onClick={() => { setActiveArea('materials'); setActiveRightTab('issues'); }}
                      >
                        <div className="text-[13px] font-bold text-neutral-900 flex items-center gap-1.5 mb-2">
                          <AlertOctagon size={14} /> 配图要求
                        </div>
                        <textarea 
                          className="w-full text-[13px] text-neutral-600 bg-neutral-50 p-3 rounded-lg border border-neutral-100 focus:outline-none focus:border-primary-300 resize-none min-h-[60px]"
                          defaultValue={activeNote.materialReq.replace('需要：', '')}
                          placeholder="输入配图要求..."
                        />
                      </div>
                    </div>`;

code = code.replace(oldTags, newTags);

fs.writeFileSync('src/components/rings/ContentReviewWorkbench.tsx', code);
console.log("Left pane modified");

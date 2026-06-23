import fs from 'fs';

let code = fs.readFileSync('src/pages/MerchantMatrix.tsx', 'utf8');

const titleRegex = /<div className="space-y-3">\s*<label className="text-\[14px\] font-black text-neutral-900 flex items-center gap-2">\s*<PenTool size=\{18\} className="text-neutral-400" \/>\s*笔记标题\s*<\/label>\s*<input type="text" defaultValue=\{reviewingDraft\.title\} className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3\.5 text-\[15px\] font-black outline-none focus:border-primary-500 transition-colors shadow-inner" \/>\s*<\/div>/g;

const newTitle = `<div className="space-y-3 group/title relative">
                           <div className="flex items-center justify-between">
                              <label className="text-[14px] font-black text-neutral-900 flex items-center gap-2">
                                <PenTool size={18} className="text-neutral-400" />
                                笔记标题
                              </label>
                              <button className="text-[11px] font-bold text-primary-600 bg-primary-50 px-2.5 py-1.5 rounded-lg hover:bg-primary-100 flex items-center gap-1.5 transition-colors opacity-0 group-hover/title:opacity-100 shadow-sm border border-primary-100">
                                 <Sparkles size={12} /> AI 优化吸睛标题
                              </button>
                           </div>
                           <div className="relative">
                             <input type="text" defaultValue={reviewingDraft.title} className="w-full bg-white border border-neutral-200 rounded-xl pl-4 pr-10 py-3.5 text-[15px] font-black outline-none focus:border-primary-500 hover:border-neutral-300 transition-colors shadow-inner" />
                             <button className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-300 hover:text-primary-500 transition-colors">
                               <Sparkles size={16} />
                             </button>
                           </div>
                        </div>`;

code = code.replace(titleRegex, newTitle);


const contentRegex = /<div className="space-y-3">\s*<label className="text-\[14px\] font-black text-neutral-900 flex items-center gap-2">\s*<PenTool size=\{18\} className="text-neutral-400" \/>\s*笔记正文与排版\s*<\/label>\s*<textarea rows=\{10\} defaultValue=\{reviewingDraft\.content\} className="w-full bg-white border border-neutral-200 rounded-xl p-4 text-\[14px\] font-bold outline-none focus:border-primary-500 transition-colors resize-none custom-scrollbar leading-relaxed shadow-inner" \/>\s*<\/div>/g;

const newContent = `<div className="space-y-3 group/content relative">
                           <div className="flex flex-wrap items-center justify-between gap-2">
                              <label className="text-[14px] font-black text-neutral-900 flex items-center gap-2">
                                <PenTool size={18} className="text-neutral-400" />
                                笔记正文与排版
                              </label>
                              <div className="flex items-center gap-2 opacity-0 group-hover/content:opacity-100 transition-opacity">
                                 <button className="text-[11px] font-bold text-primary-600 bg-primary-50 px-2.5 py-1.5 rounded-lg hover:bg-primary-100 flex items-center gap-1.5 transition-colors shadow-sm border border-primary-100">
                                    <Sparkles size={12} /> 提取爆款文案风格
                                 </button>
                                 <button className="text-[11px] font-bold text-primary-600 bg-primary-50 px-2.5 py-1.5 rounded-lg hover:bg-primary-100 flex items-center gap-1.5 transition-colors shadow-sm border border-primary-100">
                                    <Sparkles size={12} /> 更口语化/加颜文字
                                 </button>
                              </div>
                           </div>
                           <div className="relative">
                              <textarea rows={10} defaultValue={reviewingDraft.content} className="w-full bg-white border border-neutral-200 hover:border-neutral-300 rounded-xl p-4 text-[14px] font-bold outline-none focus:border-primary-500 transition-colors resize-none custom-scrollbar leading-relaxed shadow-inner block" />
                              <button className="absolute right-3 bottom-3 p-1.5 bg-neutral-100 hover:bg-primary-50 text-neutral-400 hover:text-primary-600 rounded-lg drop-shadow-sm transition-all border border-neutral-200 hover:border-primary-200 flex items-center gap-1">
                                 <Bot size={14} /> <span className="text-[10px] font-bold">选中内容进行 AI 修改</span>
                              </button>
                           </div>
                        </div>`;

code = code.replace(contentRegex, newContent);

const imgRegex = /<div className="flex items-center justify-between">\s*<label className="text-\[14px\] font-black text-neutral-900 flex items-center gap-2">\s*<ImageIcon size=\{18\} className="text-neutral-400" \/>\s*视觉图预览 \(可双指放大\)\s*<\/label>\s*<button className="text-\[11px\] font-bold text-neutral-500 border border-neutral-200 hover:bg-neutral-100 hover:text-neutral-700 px-2 py-1 rounded">使用品牌素材库更换<\/button>\s*<\/div>/g;

const newImg = `<div className="flex items-center justify-between">
                             <label className="text-[14px] font-black text-neutral-900 flex items-center gap-2">
                               <ImageIcon size={18} className="text-neutral-400" />
                               视觉图预览 <span className="text-[12px] font-bold text-neutral-400 font-normal ml-1">(可双指放大)</span>
                             </label>
                             <div className="flex items-center gap-2">
                                 <button className="text-[11px] font-bold text-primary-600 bg-primary-50 border border-primary-100 hover:bg-primary-100 hover:border-primary-200 px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-all shadow-sm">
                                    <Sparkles size={12} /> AI 智能重构版式
                                 </button>
                                 <button className="text-[11px] font-bold text-neutral-600 border border-neutral-200 hover:bg-neutral-50 hover:text-neutral-900 px-2.5 py-1.5 rounded-lg transition-all shadow-sm">
                                    使用品牌素材库更换
                                 </button>
                             </div>
                           </div>`;

code = code.replace(imgRegex, newImg);

fs.writeFileSync('src/pages/MerchantMatrix.tsx', code);

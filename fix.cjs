const fs = require('fs');
let code = fs.readFileSync('src/components/FileManager.tsx', 'utf8');

const regex = /<span className="px-2 py-0\.5 bg-blue-50 text-blue-600 rounded tex[\s\S]*?\) : \(/m;
code = code.replace(regex, `<span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[10px] font-black uppercase tracking-widest border border-emerald-100 flex items-center gap-1">已向量化</span>
                   </div>
                   <div className="flex gap-2">
                       <button className="px-5 py-2 bg-neutral-900 text-white rounded-xl text-[12px] font-black shadow-lg hover:bg-primary-500 transition-all flex items-center gap-2">
                          <Database size={14}/> 保存并应用规则
                       </button>
                   </div>
                </div>
                <div className="flex-1 p-8 overflow-y-auto">
                   <div className="max-w-4xl mx-auto h-full flex flex-col pt-4">
                      <div className="flex-1 bg-white border border-neutral-200 rounded-2xl p-8 shadow-sm flex flex-col focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500 transition-all">
                         <textarea 
                            defaultValue={\`# \${activeDoc}\\n\\n当前包含以下核心规则：\\n\\n- 品牌心智与基调： 高端、自然、无添加。内容口吻应保持克制与专业。\\n- 视觉设计规范： 主视觉以低饱和度自然色为主，严禁用高饱和度霓虹色。\\n- 风控与安全过滤： 严禁使用“全网第一”、“最极致”、“平替”等极限词汇。\\n\\n你可以直接在这里修改或补充内容，下次大模型生成内容时将自动应用最新的约束配置。\`} 
                            className="w-full h-[500px] text-[14px] leading-loose focus:outline-none resize-none font-medium text-neutral-700 bg-transparent"
                         />
                      </div>
                   </div>
                </div>
             </div>
           ) : (`);
fs.writeFileSync('src/components/FileManager.tsx', code);
console.log('Fixed');

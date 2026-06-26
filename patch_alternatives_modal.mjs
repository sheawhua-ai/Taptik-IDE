import fs from 'fs';

let content = fs.readFileSync('src/components/rings/ExecutionPreview.tsx', 'utf-8');

const modalHtml = `
        <AnimatePresence>
          {activeAlternatives && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setActiveAlternatives(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl border border-neutral-200 w-full max-w-lg overflow-hidden flex flex-col"
              >
                <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <Sparkles size={16} />
                    </div>
                    <div>
                      <h3 className="font-bold text-neutral-900 text-[15px]">{activeAlternatives.title}</h3>
                      <p className="text-[12px] text-neutral-500">{activeAlternatives.subtitle}</p>
                    </div>
                  </div>
                  <button onClick={() => setActiveAlternatives(null)} className="p-2 hover:bg-neutral-100 rounded-full text-neutral-400 transition-colors">
                    <XIcon size={16} />
                  </button>
                </div>
                
                <div className="p-5 space-y-3 bg-neutral-50/30">
                  {activeAlternatives.alternatives?.map((alt: any, idx: number) => (
                    <div key={idx} className="bg-white border border-neutral-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm hover:border-indigo-300 transition-colors group">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="w-5 h-5 rounded flex items-center justify-center bg-neutral-100 text-[11px] font-bold text-neutral-600 group-hover:bg-indigo-50 group-hover:text-indigo-600">{alt.id || ['A','B','C'][idx]}</span>
                          <span className="font-bold text-[14px] text-neutral-900">{alt.name}</span>
                        </div>
                        <p className="text-[12px] text-neutral-500 pl-7">{alt.desc}</p>
                      </div>
                      <button 
                        onClick={() => {
                          window.dispatchEvent(new CustomEvent("adopt-alternative", { detail: { adjustType: activeAlternatives.adjustType, name: alt.name } }));
                          setActiveAlternatives(null);
                        }}
                        className="shrink-0 px-4 py-2 bg-neutral-900 text-white text-[12px] font-medium rounded-lg hover:bg-neutral-800 transition-all active:scale-95 sm:w-auto w-full"
                      >
                        采用
                      </button>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-white border-t border-neutral-100 flex items-center gap-3">
                  <span className="text-[13px] text-neutral-500 whitespace-nowrap">都不满意？</span>
                  <button 
                    onClick={() => {
                      window.dispatchEvent(
                        new CustomEvent("open-expert", {
                          detail: {
                            expert: "操盘副手",
                            context: "我需要你帮忙重新思考：" + activeAlternatives.title,
                          },
                        }),
                      );
                      setActiveAlternatives(null);
                    }}
                    className="flex-1 px-4 py-2 bg-neutral-50 border border-neutral-200 text-neutral-700 text-[12px] font-medium rounded-lg hover:bg-neutral-100 transition-colors text-left text-neutral-400"
                  >
                    呼叫副手，手动输入新要求...
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
`;

content = content.replace('      </motion.div>\n    </div>', modalHtml + '      </motion.div>\n    </div>');

fs.writeFileSync('src/components/rings/ExecutionPreview.tsx', content);

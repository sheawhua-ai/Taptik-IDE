import re

with open("src/components/Workbench.tsx", "r") as f:
    code = f.read()

start_marker = '                <div className="bg-surface-1 p-2 rounded-[24px] shadow-[0_4px_18px_rgba(0,0,0,0.06)] flex items-end gap-3 pr-3 border border-neutral-300 focus-within:border-neutral-500 focus-within:ring-1 focus-within:ring-neutral-300 transition-all text-text-main">'
end_marker = '          {/* === Bottom Agent Workflow Bar === */}'

start_idx = code.find(start_marker)
end_idx = code.find(end_marker)

if start_idx != -1 and end_idx != -1:
    new_input_container = """                <div className="bg-surface-1 p-2 rounded-[24px] shadow-[0_4px_18px_rgba(0,0,0,0.06)] flex flex-col border border-neutral-300 focus-within:border-neutral-500 focus-within:ring-1 focus-within:ring-neutral-300 transition-all text-text-main relative">
                  
                  {/* Top: The input wrapper */}
                  <div className="flex-1 relative flex flex-col min-h-[48px] justify-center px-1 py-1">
                    {activeProjectId === 'project-b' && references.length > 0 && (
                      <div className="flex flex-wrap gap-2 px-3 pt-2 pb-1 bg-surface-1 max-h-[100px] overflow-y-auto">
                        {references.slice(0, 3).map((ref: any) => (
                          <div key={ref.id} className="group relative flex items-center gap-1.5 bg-transparent border border-[#E5EAF1] text-text-main pl-2 pr-1 py-1 rounded-md text-[13px] shadow-sm cursor-pointer hover:bg-[#F6F8FB] transition-colors">
                            {ref.type === 'folder' ? <Folder size={12} className="text-[#98A2B3]"/> : <File size={12} className="text-[#98A2B3]"/>}
                            <span>{ref.name}</span>
                            <button 
                              onClick={(ev) => {
                                 ev.stopPropagation();
                                 setReferences((prev: any) => prev.filter((r: any) => r.id !== ref.id));
                              }}
                              className="text-[#98A2B3] hover:text-text-main ml-1 p-0.5 hover:bg-[#E5EAF1] rounded transition-colors"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                        {references.length > 3 && (
                          <div className="flex items-center justify-center bg-transparent border border-[#E5EAF1] text-text-secondary px-2 py-1 rounded-md text-[13px] shadow-sm cursor-pointer">
                            +{references.length - 3}
                          </div>
                        )}
                      </div>
                    )}

                    {selectedShortcut && (
                      <div className="flex mb-1 ml-2 mt-1">
                        <div className="flex items-center gap-1.5 bg-transparent text-text-main border border-[#E5EAF1] px-2.5 py-1 rounded-md text-[13px] shadow-sm shrink-0">
                          <PieChart size={14} className="text-[#98A2B3]" />
                          <span>{selectedShortcut.name}</span>
                          <button
                            onClick={() => {
                              setSelectedShortcut(null);
                              setQuery("");
                              if (textareaRef.current) {
                                textareaRef.current.style.height = "auto";
                              }
                            }}
                            className="text-[#98A2B3] hover:text-text-main ml-1 opacity-60 hover:opacity-100 transition-opacity"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      </div>
                    )}
                    <SmartInput
                      ref={textareaRef}
                      id="chat-input"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onFocus={() => setIsInputFocused(true)}
                      onBlur={() => setIsInputFocused(false)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleExecute();
                          if (activeProjectId === 'project-b') { setReferences((prev: any) => prev.filter((r: any) => r.pinned)); }
                          setSelectedShortcut(null);
                          if (textareaRef.current) {
                            textareaRef.current.style.height = "auto";
                          }
                        }
                      }}
                      placeholder={
                        query || selectedShortcut
                          ? ""
                          : `我们要做什么？`
                      }
                      className="bg-transparent border-none outline-none text-[16px] text-text-main w-full placeholder:text-text-tertiary placeholder:transition-opacity pl-2 resize-none overflow-y-auto"
                      rows={1}
                      style={{ minHeight: "24px", maxHeight: "300px" }}
                    />
                  </div>
                  
                  {/* Bottom: Action bar */}
                  <div className="flex items-center justify-between px-1 pb-1 mt-1">
                    <div className="flex items-center gap-1">
                      {/* Plus Button */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => {
                            setIsAttachMenuOpen(!isAttachMenuOpen);
                            setIsApprovalMenuOpen(false);
                            setIsModelMenuOpen(false);
                            setIsAgentSelectorOpen(false);
                            setIsCommandDirOpen(false);
                          }}
                          className={`w-9 h-9 flex items-center justify-center rounded-full transition-all ${isAttachMenuOpen ? "bg-neutral-100 text-neutral-900 rotate-45" : "text-[#98A2B3] hover:text-neutral-900 hover:bg-neutral-100"}`}
                          title="添加"
                          aria-label={isAttachMenuOpen ? "关闭添加菜单" : "添加"}
                        >
                          <Plus
                            size={20}
                            className="transition-transform duration-300"
                          />
                        </button>
                        <AnimatePresence>
                          {isAttachMenuOpen && (
                            <>
                              <div
                                className="fixed inset-0 z-40"
                                onClick={() => setIsAttachMenuOpen(false)}
                              />
                              <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.96 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.96 }}
                                className="absolute left-0 bottom-full mb-2 w-[260px] bg-surface-1 border border-border-default shadow-xl rounded-2xl z-50 py-1.5 flex flex-col overflow-hidden"
                              >
                                <div className="px-1.5 py-1 flex flex-col">
                                  <div className="px-2 py-1.5 text-[12px] font-medium text-text-tertiary">添加</div>
                                  
                                  <button onClick={() => setIsAttachMenuOpen(false)} className="flex items-center gap-3 px-2 py-2 hover:bg-page-bg rounded-lg text-text-secondary hover:text-text-main transition-colors text-[13px] text-left w-full group">
                                    <Paperclip size={15} className="text-text-tertiary shrink-0" />
                                    <span>文件和文件夹</span>
                                  </button>
                                  
                                  <button onClick={() => setIsAttachMenuOpen(false)} className="flex items-center gap-3 px-2 py-2 hover:bg-page-bg rounded-lg text-text-secondary hover:text-text-main transition-colors text-[13px] text-left w-full group">
                                    <Folder size={15} className="text-text-tertiary shrink-0" />
                                    <div className="flex flex-col">
                                      <span className="font-medium text-text-main">在项目中工作</span>
                                      <span className="text-text-tertiary text-[12px]">在项目中开始聊天</span>
                                    </div>
                                  </button>

                                  <button onClick={() => setIsAttachMenuOpen(false)} className="flex items-center gap-3 px-2 py-2 hover:bg-page-bg rounded-lg text-text-secondary hover:text-text-main transition-colors text-[13px] text-left w-full group">
                                    <Target size={15} className="text-text-tertiary shrink-0" />
                                    <div className="flex flex-col">
                                      <span className="font-medium text-text-main">目标</span>
                                      <span className="text-text-tertiary text-[12px]">设置要持续追求的目标</span>
                                    </div>
                                  </button>
                                  
                                  <button onClick={() => setIsAttachMenuOpen(false)} className="flex items-center gap-3 px-2 py-2 hover:bg-page-bg rounded-lg bg-surface-subtle text-text-secondary hover:text-text-main transition-colors text-[13px] text-left w-full group mt-1">
                                    <Lightbulb size={15} className="text-text-tertiary shrink-0" />
                                    <div className="flex flex-col">
                                      <span className="font-medium text-text-main">计划模式</span>
                                      <span className="text-text-tertiary text-[12px]">开启计划模式</span>
                                    </div>
                                  </button>

                                  <div className="mt-3 px-2 py-1 text-[12px] font-medium text-text-tertiary">插件</div>
                                  
                                  <button onClick={() => setIsAttachMenuOpen(false)} className="flex items-center gap-3 px-2 py-2 hover:bg-page-bg rounded-lg text-text-secondary hover:text-text-main transition-colors text-[13px] text-left w-full group">
                                    <Triangle size={15} className="text-text-tertiary shrink-0 fill-current" />
                                    <div className="flex flex-col overflow-hidden">
                                      <span className="font-medium text-text-main">Vercel</span>
                                      <span className="text-text-tertiary text-[12px] truncate">Build and deploy web apps and agents</span>
                                    </div>
                                  </button>
                                  
                                  <button onClick={() => setIsAttachMenuOpen(false)} className="flex items-center gap-3 px-2 py-2 hover:bg-page-bg rounded-lg text-text-secondary hover:text-text-main transition-colors text-[13px] text-left w-full group">
                                    <Github size={15} className="text-text-tertiary shrink-0" />
                                    <div className="flex flex-col overflow-hidden">
                                      <span className="font-medium text-text-main">GitHub</span>
                                      <span className="text-text-tertiary text-[12px] truncate">Triage PRs, issues, CI, and publish flows</span>
                                    </div>
                                  </button>
                                </div>
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Approval Dropdown Wrapper */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => {
                            setIsApprovalMenuOpen(!isApprovalMenuOpen);
                            setIsAttachMenuOpen(false);
                            setIsModelMenuOpen(false);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-subtle hover:bg-hover-bg text-text-secondary hover:text-text-main text-[13px] font-medium transition-colors"
                        >
                          {approvalMode === 'request' ? <Hand size={14} /> : <Terminal size={14} />}
                          {approvalMode === 'request' ? '请求批准' : '帮我批准'}
                        </button>

                        <AnimatePresence>
                          {isApprovalMenuOpen && (
                            <>
                              <div
                                className="fixed inset-0 z-40"
                                onClick={() => setIsApprovalMenuOpen(false)}
                              />
                              <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.96 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.96 }}
                                className="absolute left-0 bottom-full mb-2 w-[340px] bg-surface-1 border border-border-default shadow-xl rounded-2xl z-50 py-2 flex flex-col overflow-hidden"
                              >
                                <div className="px-4 py-2 flex items-center justify-between mb-1">
                                  <span className="text-[13px] text-text-secondary">应如何批准 AI 操作？</span>
                                  <a href="#" className="text-[13px] text-text-tertiary hover:text-text-secondary underline underline-offset-2">了解更多</a>
                                </div>
                                <div className="px-2 py-1">
                                  <button
                                    onClick={() => {
                                      setApprovalMode('request');
                                      setIsApprovalMenuOpen(false);
                                    }}
                                    className="flex items-start justify-between w-full px-3 py-2.5 rounded-xl hover:bg-page-bg group transition-colors text-left"
                                  >
                                    <div className="flex items-start gap-3">
                                      <Hand size={16} className="text-text-secondary shrink-0 mt-0.5" />
                                      <div>
                                        <div className="text-[14px] text-text-main font-medium mb-0.5">请求批准</div>
                                        <div className="text-[12px] text-text-tertiary leading-tight">编辑外部文件和使用互联网时始终询问</div>
                                      </div>
                                    </div>
                                    {approvalMode === 'request' && <Check size={16} className="text-text-main shrink-0 mt-1" />}
                                  </button>

                                  <button
                                    onClick={() => {
                                      setApprovalMode('auto');
                                      setIsApprovalMenuOpen(false);
                                    }}
                                    className="flex items-start justify-between w-full px-3 py-2.5 rounded-xl hover:bg-page-bg group transition-colors text-left"
                                  >
                                    <div className="flex items-start gap-3">
                                      <Terminal size={16} className="text-text-secondary shrink-0 mt-0.5" />
                                      <div>
                                        <div className="text-[14px] text-text-main font-medium mb-0.5">帮我批准</div>
                                        <div className="text-[12px] text-text-tertiary leading-tight">仅对检测到的风险操作请求批准</div>
                                      </div>
                                    </div>
                                    {approvalMode === 'auto' && <Check size={16} className="text-text-main shrink-0 mt-1" />}
                                  </button>
                                </div>
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Model Selection */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => {
                            setIsModelMenuOpen(!isModelMenuOpen);
                            setIsAttachMenuOpen(false);
                            setIsApprovalMenuOpen(false);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-surface-subtle text-text-secondary hover:text-text-main text-[13px] font-medium transition-colors"
                        >
                          <Zap size={14} className={selectedModel === 'extreme' ? 'text-amber-500' : 'text-text-secondary'} />
                          {selectedModel === 'fast' ? '快速' : '极致'}
                          <ChevronDown size={14} className="opacity-60 ml-0.5" />
                        </button>
                        
                        <AnimatePresence>
                          {isModelMenuOpen && (
                            <>
                              <div
                                className="fixed inset-0 z-40"
                                onClick={() => setIsModelMenuOpen(false)}
                              />
                              <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.96 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.96 }}
                                className="absolute right-0 bottom-full mb-2 w-[240px] bg-surface-1 border border-border-default shadow-xl rounded-2xl z-50 p-2 flex flex-col"
                              >
                                <button
                                  onClick={() => {
                                    setSelectedModel('fast');
                                    setIsModelMenuOpen(false);
                                  }}
                                  className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl hover:bg-page-bg group transition-colors text-left"
                                >
                                  <div className="flex flex-col">
                                    <span className="text-[14px] text-text-main font-medium">快速</span>
                                    <span className="text-[12px] text-text-tertiary">1倍消耗，适合日常任务</span>
                                  </div>
                                  {selectedModel === 'fast' && <Check size={16} className="text-text-main shrink-0" />}
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedModel('extreme');
                                    setIsModelMenuOpen(false);
                                  }}
                                  className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl hover:bg-page-bg group transition-colors text-left mt-1"
                                >
                                  <div className="flex flex-col">
                                    <span className="text-[14px] text-text-main font-medium flex items-center gap-1.5">极致 <Zap size={12} className="text-amber-500 fill-current"/></span>
                                    <span className="text-[12px] text-text-tertiary">2倍消耗，深思熟虑推理</span>
                                  </div>
                                  {selectedModel === 'extreme' && <Check size={16} className="text-text-main shrink-0" />}
                                </button>
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </div>

                      <button type="button" className="w-8 h-8 flex items-center justify-center rounded-full text-text-tertiary hover:text-text-main hover:bg-surface-subtle transition-colors">
                        <Mic size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (isProcessing) {
                            setIsProcessing(false);
                            setMessages((prev: any) => prev.map((m: any) => {
                              if (m.role === 'agent' && (m.isThinking || (m.card && m.card.type === 'progress'))) {
                                return {
                                  ...m,
                                  isThinking: false,
                                  content: '任务已取消。',
                                  isCancelled: true,
                                  card: undefined
                                };
                              }
                              return m;
                            }));
                          } else {
                            handleExecute();
                            if (activeProjectId === 'project-b') { setReferences((prev: any) => prev.filter((r: any) => r.pinned)); }
                          }
                        }}
                        className={`w-9 h-9 ml-1 rounded-full flex items-center justify-center transition-all active:scale-95 shadow-sm shrink-0 cursor-pointer ${query || isProcessing ? 'bg-neutral-900 text-white hover:bg-neutral-800' : 'bg-neutral-900 text-white hover:bg-neutral-800'}`}
                        aria-label={isProcessing ? "停止当前任务" : "发送消息"}
                      >
                        {isProcessing ? (
                          <div className="w-2.5 h-2.5 bg-surface-1 rounded-sm" />
                        ) : (
                          query ? <ArrowUp size={18} /> : <AudioLines size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
"""
    code = code[:start_idx] + new_input_container + "\n" + code[end_idx:]

with open("src/components/Workbench.tsx", "w") as f:
    f.write(code)

print("Replaced successfully")

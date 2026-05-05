const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'src', 'App.tsx');
let code = fs.readFileSync(targetPath, 'utf8');

const returnStart = code.lastIndexOf('  return (\n    <div className="flex flex-col');
const componentEnd = code.lastIndexOf('  );\n}\n');

if (returnStart === -1 || componentEnd === -1) {
    console.error("Could not find start/end bounds.");
    process.exit(1);
}

const UI_CODE = `  return (
    <div className="flex h-[100dvh] w-full bg-white text-zinc-900 font-sans overflow-hidden">
      {/* Leftmost Sidebar - SaaS Nav */}
      <div className="w-[80px] xl:w-[200px] border-r border-zinc-200 bg-[#fbfbfb] flex flex-col shrink-0 flex-none h-full relative z-20">
        {/* Logo */}
        <div className="h-16 flex items-center justify-center xl:justify-start xl:px-5 font-black text-lg tracking-tight text-zinc-900 gap-2">
          <div className="w-7 h-7 bg-[#605EA7] rounded-md flex items-center justify-center text-white shrink-0">
            <Hexagon size={16} className="fill-current" />
          </div>
          <span className="hidden xl:block">TAPTIK</span>
        </div>

        {/* Project Selector */}
        <div className="px-2 xl:px-3 py-2">
          <div className="text-[11px] font-bold text-zinc-400 mb-1.5 px-1 xl:px-2 hidden xl:block">当前项目</div>
          <button className="w-full flex items-center justify-center xl:justify-between hover:bg-zinc-100 rounded-lg p-2 xl:px-2 xl:py-1.5 text-sm font-bold text-zinc-700 transition-colors">
             <div className="flex items-center gap-2">
               <div className="w-6 h-6 xl:w-5 xl:h-5 rounded bg-[#F4ECF6] text-[#605EA7] flex items-center justify-center font-black text-[10px] shrink-0">?</div>
               <span className="hidden xl:block truncate">选择项目</span>
             </div>
             <ChevronDown size={14} className="text-zinc-400 hidden xl:block" />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-2 py-3 space-y-1 overflow-y-auto custom-scrollbar mt-2">
          {NAV_ITEMS.map((item) => (
            <button 
              key={item.id} 
              onClick={() => setActiveNav(item.id)}
              className={\`w-full flex items-center justify-center xl:justify-start gap-3 p-2 xl:px-3 xl:py-2.5 rounded-lg text-[13px] font-bold transition-all relative \${
                activeNav === item.id 
                  ? 'text-[#605EA7] bg-[#605EA7]/10' 
                  : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
              }\`}
              title={item.name}
            >
              {activeNav === item.id && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#605EA7] rounded-r-full" />}
              <item.icon size={18} strokeWidth={activeNav === item.id ? 2.5 : 2} className="shrink-0" />
              <span className="hidden xl:block truncate">{item.name}</span>
            </button>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-3 xl:p-4 border-t border-zinc-200 flex items-center justify-center xl:justify-start gap-2">
          <div className="w-8 h-8 xl:w-6 xl:h-6 rounded-full bg-zinc-200 flex items-center justify-center font-bold text-zinc-600 text-[10px] shrink-0">T</div>
          <span className="text-[11px] font-bold truncate text-zinc-600 hidden xl:block">taptik:1324...</span>
          <LogOut size={14} className="ml-auto text-zinc-400 cursor-pointer hover:text-zinc-600 hidden xl:block shrink-0" title="退出" onClick={() => { localStorage.clear(); window.location.reload(); }} />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 h-full flex relative z-10 bg-white">
        {activeNav === 'ai' && (
          <>
            {/* Context Sub-Sidebar for AI */}
            {subSidebarOpen && (
              <div className="w-[200px] xl:w-[240px] border-r border-zinc-200 bg-white flex flex-col h-full shrink-0 relative transition-all">
                <div className="p-4 flex items-center justify-between border-b border-zinc-100 shrink-0">
                  <span className="text-[13px] font-bold text-zinc-900">历史对话</span>
                  <button className="px-2 py-1 bg-white border border-zinc-200 rounded-md shadow-sm text-[11px] font-bold text-zinc-600 hover:text-[#605EA7] hover:border-[#605EA7]/30 transition-colors flex items-center gap-1">
                    <Plus size={12} /> <span className="hidden xl:inline">新建</span>
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-0.5">
                  {chatHistory.map(h => (
                    <button key={h.id} className="w-full text-left flex flex-col gap-1 px-3 py-2.5 hover:bg-zinc-50 rounded-lg transition-colors group">
                      <span className="text-[13px] font-bold text-zinc-800 line-clamp-1">{h.title}</span>
                      <span className="text-[11px] font-medium text-zinc-400">{h.time}</span>
                    </button>
                  ))}
                  <div className="w-full text-left flex flex-col gap-1 px-3 py-2.5 bg-[#605EA7]/5 rounded-lg transition-colors border-l-2 border-[#605EA7]">
                      <span className="text-[13px] font-bold text-[#605EA7] line-clamp-1">测试2</span>
                      <span className="text-[11px] font-medium text-zinc-400">当前</span>
                  </div>
                </div>

                {/* File Tree Section */}
                <div className="h-2/5 border-t border-zinc-200 flex flex-col bg-zinc-50/50">
                  <div className="p-3 text-[11px] font-bold text-zinc-500 tracking-wider flex items-center justify-between border-b border-zinc-100">
                    <span>项目文件 (拖放调用)</span>
                    <FolderOpen size={12} />
                  </div>
                  <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                    {UNIFIED_FILE_TREE.map((node, i) => (
                      <div key={i} className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2 px-2 py-1.5 text-[12px] font-bold text-zinc-700 select-none">
                           <FolderOpen size={12} className="text-zinc-400" /> {node.name}
                        </div>
                        <div className="pl-5 flex flex-col gap-0.5">
                           {node.children.map((child, j) => (
                              <div key={j} draggable onDragStart={(e) => handleTreeDragStart(e, child.type, child.name)} className="flex items-center gap-2 px-2 py-1 hover:bg-[#605EA7]/10 rounded-md cursor-grab active:cursor-grabbing text-[12px] font-medium text-zinc-600 select-none group transition-colors">
                                 {child.type === 'Folder' ? (
                                    <FolderOpen size={12} className="text-[#605EA7]/70 group-hover:text-[#605EA7]" />
                                 ) : child.type === 'RAG' ? (
                                    <Brain size={12} className="text-[#605EA7]/70 group-hover:text-[#605EA7]" />
                                 ) : (
                                    <FileIcon size={12} className="text-[#605EA7]/70 group-hover:text-[#605EA7]" />
                                 )}
                                 <span className="truncate">{child.name}</span>
                              </div>
                           ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Main Chat Interface */}
            <div className="flex-1 flex flex-col h-full bg-[#fbfbfb] relative min-w-0" onDragOver={handleChatDragOver} onDragLeave={handleChatDragLeave} onDrop={handleChatDrop}>
              {/* Header */}
              <div className="h-16 flex items-center justify-between px-6 border-b border-zinc-100 bg-white shrink-0">
                <div className="flex items-center gap-4">
                  <button onClick={() => setSubSidebarOpen(!subSidebarOpen)} className="text-zinc-400 hover:text-zinc-700 transition-colors">
                    <Menu size={18} />
                  </button>
                  <div className="flex flex-col">
                    <span className="text-[14px] font-bold text-zinc-900 leading-tight">AI 工作台</span>
                    <span className="text-[11px] font-medium text-zinc-500">测试2</span>
                  </div>
                </div>
                <button onClick={() => {setMessages([]); setContextItems([]);}} className="px-3 py-1.5 border border-zinc-200 rounded-md text-[12px] font-bold text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors shadow-sm bg-white">
                  清空对话
                </button>
              </div>

              {/* Chat Area */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 relative">
                 {/* Drag Overlay */}
                 <AnimatePresence>
                    {isGlobalDragging && (
                       <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={\`absolute inset-0 z-50 flex items-center justify-center m-4 rounded-2xl border-2 transition-colors backdrop-blur-[1px] \${isDragHoveringChat ? 'border-[#605EA7] bg-[#605EA7]/5' : 'border-dashed border-[#605EA7]/30 bg-[#605EA7]/5'}\`}>
                          <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-lg border border-zinc-100 pointer-events-none">
                             {isDragHoveringChat ? <ArrowUp size={32} className="text-[#605EA7] mb-2 animate-bounce" /> : <LayersDropIcon className="w-8 h-8 text-[#605EA7] mb-2" />}
                             <span className="text-[14px] font-bold text-[#605EA7]">{isDragHoveringChat ? '松开以装载资产' : '拖放至此插入上下文'}</span>
                          </div>
                       </motion.div>
                    )}
                 </AnimatePresence>

                 {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center max-w-2xl mx-auto w-full">
                       <div className="w-14 h-14 bg-[#F4ECF6] text-[#605EA7] rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-[#605EA7]/20">
                          <Zap size={28} className="fill-current opacity-80" />
                       </div>
                       <h2 className="text-2xl font-black text-zinc-900 mb-2">你好，我是 TAPTIK AI</h2>
                       <p className="text-[13px] font-medium text-zinc-500 mb-10 text-center">告诉我的你的运营需求，或选择下方的内置 Skill 快速开始</p>

                       <div className="grid grid-cols-2 gap-4 w-full">
                          <div onClick={() => insertMention('爆款笔记批量生成', '@')} className="bg-white border text-left border-zinc-200 p-4 rounded-xl shadow-sm hover:border-[#605EA7]/40 hover:shadow-md cursor-pointer transition-all group">
                             <h3 className="text-[13px] font-bold text-zinc-900 mb-1 group-hover:text-[#605EA7] transition-colors">爆款笔记批量生成</h3>
                             <p className="text-[11px] text-zinc-500 font-medium leading-relaxed">基于方案信息 AI 批量生成笔记，自动打标签、匹配素材</p>
                          </div>
                          <div onClick={() => insertMention('笔记落地页配置', '@')} className="bg-white border text-left border-zinc-200 p-4 rounded-xl shadow-sm hover:border-[#605EA7]/40 hover:shadow-md cursor-pointer transition-all group">
                             <h3 className="text-[13px] font-bold text-zinc-900 mb-1 group-hover:text-[#605EA7] transition-colors">笔记落地页配置</h3>
                             <p className="text-[11px] text-zinc-500 font-medium leading-relaxed">为指定方案配置落地页海报、登录模式，生成可分享的分发链接</p>
                          </div>
                       </div>
                    </div>
                 ) : (
                    <div className="max-w-4xl mx-auto space-y-6 pb-2">
                       {messages.map((msg, idx) => (
                         <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={\`flex flex-col \${msg.role === 'user' ? 'items-end' : 'items-start'}\`}>
                           {msg.role === 'user' ? (
                             <div className="flex flex-col items-end max-w-[90%]">
                                <div className="px-5 py-3.5 rounded-2xl bg-[#18181b] text-white border border-zinc-800 shadow-md rounded-br-sm text-[14px] leading-relaxed font-medium">{renderMessageContent(msg.content as string, msg.role)}</div>
                             </div>
                           ) : (
                             <div className="max-w-[90%]">
                                <div className="flex items-center gap-2 mb-2 px-1">
                                   <div className={\`w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-sm \${msg.role === 'system' ? 'bg-[#CEC8E2] text-[#605EA7]' : 'bg-[#605EA7]'}\`}>
                                      {msg.role === 'system' ? 'SYS' : 'L0'}
                                   </div>
                                   <span className="text-[11px] font-bold text-zinc-500 tracking-wide uppercase">{msg.role === 'system' ? '提示' : 'TAPTIK 引擎'}</span>
                                </div>
                                <div className={\`px-5 py-3.5 rounded-2xl bg-white border border-zinc-200 shadow-sm text-[14px] text-zinc-800 leading-relaxed rounded-bl-sm font-medium \${msg.role === 'system' ? 'bg-zinc-50/80' : ''}\`}>{renderMessageContent(msg.content as string, msg.role)}</div>
                             </div>
                           )}
                         </motion.div>
                       ))}
                       <div ref={chatEndRef} />
                    </div>
                 )}
              </div>

              {/* Input Area */}
              <div className="p-4 pt-0 shrink-0 max-w-4xl mx-auto w-full relative">
                 <AnimatePresence>
                   {showMentionMenu && (
                     <motion.div initial={{ opacity: 0, y: 10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.98 }} className="absolute bottom-full left-4 mb-2 w-72 bg-white border border-zinc-200 shadow-xl rounded-xl z-50 overflow-hidden flex flex-col max-h-64">
                        <div className="px-3 py-2 text-[10px] uppercase font-bold text-zinc-400 border-b border-zinc-100 bg-zinc-50">
                           调用已有 Skill 能力
                        </div>
                        <div className="overflow-y-auto w-full flex-1 p-1 custom-scrollbar">
                           <div onClick={() => insertMention('爆款笔记批量生成', '@')} className="px-3 py-2 flex items-center gap-2 hover:bg-[#605EA7]/10 hover:text-[#605EA7] rounded-lg cursor-pointer text-[13px] font-bold text-zinc-700 transition-colors">
                              <Component size={14} />爆款笔记批量生成
                           </div>
                           <div onClick={() => insertMention('内容方案AI策划', '@')} className="px-3 py-2 flex items-center gap-2 hover:bg-[#605EA7]/10 hover:text-[#605EA7] rounded-lg cursor-pointer text-[13px] font-bold text-zinc-700 transition-colors">
                              <Component size={14} />内容方案 AI 策划
                           </div>
                           <div onClick={() => insertMention('竞品标题仿写助手', '@')} className="px-3 py-2 flex items-center gap-2 hover:bg-[#605EA7]/10 hover:text-[#605EA7] rounded-lg cursor-pointer text-[13px] font-bold text-zinc-700 transition-colors">
                              <Component size={14} />竞品标题仿写助手
                           </div>
                        </div>
                     </motion.div>
                   )}
                 </AnimatePresence>

                 {contextItems.length > 0 && (
                    <div className="mb-2 flex flex-wrap gap-1.5 px-1">
                       {contextItems.map((ctx, i) => {
                          let label = ctx;
                          let icon = <FileBox size={10} />;
                          if (ctx.startsWith('「🔗 ')) { icon = <Link2 size={10} />; label = ctx.slice(3, -1); }
                          else if (ctx.startsWith('「📄 ')) { icon = <FileBox size={10} />; label = ctx.slice(3, -1); }
                          else if (ctx.startsWith('「📁 ')) { icon = <FolderOpen size={10} />; label = ctx.slice(3, -1); }
                          else if (ctx.startsWith('「🧠 ')) { icon = <Brain size={10} />; label = ctx.slice(3, -1); }
                          
                          return (
                             <span key={i} className="flex items-center gap-1.5 px-2.5 py-1 bg-[#605EA7]/10 text-[#605EA7] rounded-[5px] text-[11px] font-bold border border-[#605EA7]/20 relative group whitespace-nowrap">
                               {icon} {label}
                               <X size={10} className="cursor-pointer ml-1 hover:text-red-500 opacity-60 group-hover:opacity-100 transition-colors" onClick={() => setContextItems(contextItems.filter(c => c !== ctx))} />
                             </span>
                          )
                       })}
                    </div>
                 )}

                 <div className="bg-white rounded-[14px] border border-zinc-200 shadow-sm overflow-hidden flex relative transition-all focus-within:border-[#605EA7]/50 focus-within:shadow-md ring-1 ring-transparent focus-within:ring-[#605EA7]/10">
                   <textarea 
                      rows={1}
                      value={inputValue}
                      onChange={handleInputChange}
                      onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                      placeholder="输入你的运营需求... （Enter 发送 / Shift+Enter 换行 / @skill 触发 Skill）"
                      className="flex-1 max-h-48 min-h-[56px] py-3.5 pl-4 pr-14 resize-none bg-transparent text-[14px] text-zinc-800 placeholder:text-zinc-400 focus:outline-none"
                   />
                   <div className="absolute right-2 bottom-2">
                      <button 
                         onClick={handleSend}
                         disabled={!inputValue.trim()}
                         className="w-10 h-10 rounded-[10px] bg-[#605EA7] hover:bg-[#4d4a8e] disabled:bg-[#f1f1f4] disabled:text-zinc-400 text-white flex items-center justify-center transition-all shadow-sm disabled:shadow-none"
                      >
                         {inputValue.trim() ? <ArrowUp size={18} strokeWidth={2.5} /> : <Zap size={18} className="fill-current opacity-50" />}
                      </button>
                   </div>
                 </div>
              </div>
            </div>
          </>
        )}

        {/* Publish Management Mock */}
        {activeNav === 'publish' && (
          <div className="flex-1 flex h-full bg-[#fbfbfb]">
             <div className="w-[240px] border-r border-zinc-200 bg-white flex flex-col shrink-0">
                <div className="p-4 border-b border-zinc-100">
                   <span className="text-[12px] font-bold text-zinc-500">内容方案</span>
                </div>
                <div className="flex flex-col">
                   {[
                     { id: '1', title: '1', sub: '手动创建', active: activePlanId === '1' },
                     { id: '2', title: '方案 2026-04-15 13:33', sub: '宠物 (新) - 宠物食品-猫主粮-猫粮', active: activePlanId === '2' },
                     { id: '3', title: '测试方案', sub: '手动创建', active: activePlanId === '3' }
                   ].map(plan => (
                      <div key={plan.id} onClick={() => setActivePlanId(plan.id)} className={\`p-4 border-b border-zinc-100 cursor-pointer \${plan.active ? 'bg-[#F4ECF6] border-l-4 border-l-[#605EA7]' : 'hover:bg-zinc-50'}\`}>
                         <div className={\`text-[13px] font-bold \${plan.active ? 'text-[#605EA7]' : 'text-zinc-700'}\`}>{plan.title}</div>
                         <div className="text-[12px] text-zinc-400 mt-1 line-clamp-1">{plan.sub}</div>
                      </div>
                   ))}
                </div>
             </div>
             <div className="flex-1 p-6 xl:p-8 overflow-y-auto custom-scrollbar">
                <div className="mb-8">
                   <h1 className="text-2xl font-black text-zinc-900">发布管理</h1>
                   <p className="text-[13px] text-zinc-500 font-medium mt-1">为每个内容方案配置 TapTik 落地页并获取分发链接</p>
                </div>

                <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm mb-6 relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-1 h-full bg-[#605EA7]" />
                   <div className="flex items-center justify-between mb-6">
                      <div>
                         <h2 className="text-[15px] font-bold text-zinc-900">落地页配置</h2>
                         <p className="text-[12px] text-zinc-500 mt-1">方案 [方案 2026-04-15 13:33] 的 TapTik 落地页设置</p>
                      </div>
                      <button className="bg-[#605EA7] text-white px-5 py-2 rounded-lg text-[13px] font-bold shadow-sm hover:bg-[#4d4a8e] transition-colors">
                         保存配置
                      </button>
                   </div>
                   
                   <div className="flex gap-6">
                      <div className="flex-1">
                         <label className="block text-[12px] font-bold text-zinc-700 mb-2">海报图 URL (选填)</label>
                         <input type="text" placeholder="https://..." className="w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-[13px] focus:outline-none focus:border-[#605EA7] focus:ring-1 focus:ring-[#605EA7]/20 transition-all" />
                      </div>
                      <div className="flex-1">
                         <label className="block text-[12px] font-bold text-zinc-700 mb-2">登录模式</label>
                         <select className="w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-[13px] focus:outline-none focus:border-[#605EA7] focus:ring-1 focus:ring-[#605EA7]/20 bg-white transition-all outline-none">
                            <option>默认 (不强制登录)</option>
                            <option>强制登录 (要求授权)</option>
                         </select>
                      </div>
                   </div>
                </div>

                <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
                   <div className="flex items-center justify-between mb-4">
                      <h2 className="text-[15px] font-bold text-zinc-900">笔记分发链接</h2>
                      <button className="text-[12px] font-bold text-zinc-400 hover:text-zinc-600 transition-colors">刷新</button>
                   </div>
                   <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between p-4 border border-zinc-100 rounded-xl bg-[#fbfbfb]">
                         <div className="flex items-center gap-3">
                            <span className="text-[13px] font-bold text-zinc-700">(无标题)</span>
                            <span className="text-[11px] font-bold text-orange-500 bg-orange-100 px-2 py-0.5 rounded-md border border-orange-200/50">草稿</span>
                         </div>
                         <button className="text-[12px] font-bold text-[#605EA7] hover:bg-[#605EA7]/10 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-[#605EA7]/20">获取链接</button>
                      </div>
                      <div className="flex items-center justify-between p-4 border border-zinc-100 rounded-xl bg-[#fbfbfb]">
                         <div className="flex items-center gap-3">
                            <span className="text-[13px] font-bold text-zinc-700">(无标题)</span>
                            <span className="text-[11px] font-bold text-orange-500 bg-orange-100 px-2 py-0.5 rounded-md border border-orange-200/50">草稿</span>
                         </div>
                         <button className="text-[12px] font-bold text-[#605EA7] hover:bg-[#605EA7]/10 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-[#605EA7]/20">获取链接</button>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* Skill Market Mock */}
        {activeNav === 'skills' && (
          <div className="flex-1 flex flex-col h-full bg-[#fbfbfb]">
             <div className="p-6 xl:px-8 border-b border-zinc-200 bg-white flex items-center justify-between shrink-0 shadow-sm relative z-10">
                <div>
                   <div className="flex items-center gap-4 mb-2 mt-1">
                     <h1 className="text-2xl font-black text-zinc-900">Skill 市场</h1>
                     <div className="flex items-center bg-zinc-100 rounded-lg p-1 text-[13px] font-bold">
                        <button onClick={() => setSkillMarketTab('my')} className={\`px-4 py-1.5 rounded-md transition-all shadow-sm \${skillMarketTab === 'my' ? 'bg-white text-zinc-800' : 'text-zinc-500 hover:text-zinc-700 shadow-none'}\`}>我的 Skills</button>
                        <button onClick={() => setSkillMarketTab('market')} className={\`px-4 py-1.5 rounded-md transition-all shadow-sm \${skillMarketTab === 'market' ? 'bg-white text-zinc-800' : 'text-zinc-500 hover:text-zinc-700 shadow-none'}\`}>发现市场</button>
                     </div>
                   </div>
                   <p className="text-[13px] text-zinc-500 font-medium">管理已有 Skill 并发现社区分享的工作流</p>
                </div>
             </div>

             <div className="flex-1 overflow-y-auto custom-scrollbar p-6 xl:p-8">
                <div className="max-w-6xl w-full mx-auto">
                   
                   <div className="mb-10">
                      <h2 className="text-[15px] font-black text-zinc-800 flex items-center gap-2 mb-4">
                         内置 Skill <span className="text-[11px] font-bold bg-[#605EA7]/10 text-[#605EA7] px-2 py-0.5 rounded-md">平台提供</span>
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                         <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm hover:border-[#605EA7]/30 hover:shadow-md transition-all group">
                            <div className="flex justify-between items-start mb-3">
                               <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-md">内容创作</span>
                               <div className="w-8 h-4 bg-[#605EA7] rounded-full relative cursor-pointer shadow-inner">
                                  <div className="w-3 h-3 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm" />
                               </div>
                            </div>
                            <h3 className="text-[15px] font-bold text-zinc-900 mb-2">爆款笔记批量生成</h3>
                            <p className="text-[12px] text-zinc-500 font-medium leading-relaxed mb-5 min-h-[36px]">基于方案信息 AI 批量生成笔记，自动打标签、匹配素材</p>
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#605EA7]">
                               <div className="w-1.5 h-1.5 rounded-full bg-[#605EA7] animate-pulse" /> 已启用
                            </div>
                         </div>
                         
                         <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm opacity-60 hover:opacity-100 transition-opacity">
                            <div className="flex justify-between items-start mb-3">
                               <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-md">内容创作</span>
                               <div className="w-8 h-4 bg-zinc-200 rounded-full relative cursor-pointer shadow-inner border border-zinc-300/50">
                                  <div className="w-3 h-3 bg-white rounded-full absolute left-0.5 top-0.5 shadow-sm" />
                               </div>
                            </div>
                            <h3 className="text-[15px] font-bold text-zinc-900 mb-2">内容方案 AI 策划</h3>
                            <p className="text-[12px] text-zinc-500 font-medium leading-relaxed mb-5 min-h-[36px]">通过对话引导收集行业定位与产品信息，自动完成方案创建</p>
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-400">
                               <div className="w-1.5 h-1.5 rounded-full bg-zinc-300" /> 已禁用
                            </div>
                         </div>
                         
                         <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm hover:border-[#605EA7]/30 hover:shadow-md transition-all">
                            <div className="flex justify-between items-start mb-3">
                               <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-md">发布分发</span>
                               <div className="w-8 h-4 bg-[#605EA7] rounded-full relative cursor-pointer shadow-inner">
                                  <div className="w-3 h-3 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm" />
                               </div>
                            </div>
                            <h3 className="text-[15px] font-bold text-zinc-900 mb-2">笔记落地页配置</h3>
                            <p className="text-[12px] text-zinc-500 font-medium leading-relaxed mb-5 min-h-[36px]">为指定方案配置落地页海报、登录模式，生成可分享的分发链接</p>
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#605EA7]">
                               <div className="w-1.5 h-1.5 rounded-full bg-[#605EA7] animate-pulse" /> 已启用
                            </div>
                         </div>
                      </div>
                   </div>

                   <div>
                      <h2 className="text-[15px] font-black text-zinc-800 flex items-center gap-2 mb-4">
                         自定义 Skill <span className="text-[12px] font-medium text-zinc-500 font-normal">· 在 AI 工作台右键历史对话可生成新 Skill</span>
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                         <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm relative group hover:border-[#605EA7]/30 hover:shadow-md transition-all">
                            <div className="flex justify-between items-start mb-3">
                               <span className="text-[11px] font-bold text-purple-600 bg-purple-50 border border-purple-100 px-2.5 py-0.5 rounded-md">自定义</span>
                               <div className="flex items-center gap-3">
                                  <div className="w-8 h-4 bg-zinc-200 rounded-full relative cursor-pointer shadow-inner border border-zinc-300/50">
                                     <div className="w-3 h-3 bg-white rounded-full absolute left-0.5 top-0.5 shadow-sm" />
                                  </div>
                                  <X size={14} className="text-zinc-300 hover:text-red-500 cursor-pointer transition-colors" />
                               </div>
                            </div>
                            <h3 className="text-[15px] font-bold text-zinc-900 mb-2 group-hover:text-[#605EA7] transition-colors">竞品标题仿写助手</h3>
                            <p className="text-[12px] text-zinc-500 font-medium leading-relaxed mb-5 min-h-[72px]">自动抓取3个固定竞品账号在指定关键词下的最热笔记标题，分析爆款结构规律，并生成5条同风格高点击率标题</p>
                            <div className="flex items-center justify-between">
                               <div className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-400">
                                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-300" /> 已禁用
                               </div>
                               <button className="text-[12px] font-bold text-[#605EA7] bg-[#605EA7]/5 hover:bg-[#605EA7]/10 px-3 py-1.5 rounded-md transition-colors border border-transparent hover:border-[#605EA7]/20">发布到市场</button>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* Temporary Fallback for Empty Tabs */}
        {['content', 'data', 'files', 'settings'].includes(activeNav) && (
          <div className="flex-1 flex flex-col items-center justify-center bg-[#fbfbfb] text-zinc-400">
             <Hexagon size={48} className="mb-4 opacity-20" />
             <p className="font-bold text-[14px]">模块开发中...</p>
          </div>
        )}

      </div>
    </div>
  );
}

const LayersDropIcon = ({className}:{className?:string}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
    <polyline points="2 12 12 17 22 12"></polyline>
    <polyline points="2 17 12 22 22 17"></polyline>
  </svg>
)
`;

code = code.substring(0, returnStart) + UI_CODE;
fs.writeFileSync(targetPath, code);
console.log('Successfully re-wrote UI layout.');

import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Replace project menu logic
content = content.replace(
  `                    <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover/project:opacity-100 transition-opacity relative group/pmenu">
                      <button className="text-slate-400 hover:text-slate-700 p-1" title="更多">
                        <MoreHorizontal size={14} />
                      </button>
                      <button className="text-slate-400 hover:text-slate-700 p-1" title="编辑">
                        <Edit2 size={14} />
                      </button>
                      
                      {/* Project Menu Dropdown */}
                      <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-xl border border-slate-200 z-[100] hidden group-hover/pmenu:flex flex-col py-1.5 text-slate-700">`,
  `                    <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover/project:opacity-100 transition-opacity relative">
                      <button 
                        className="text-slate-400 hover:text-slate-700 p-1 project-menu-trigger" 
                        title="更多"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveProjectMenuId(activeProjectMenuId === 'new-project' ? null : 'new-project');
                          setActiveSessionMenuId(null);
                        }}
                      >
                        <MoreHorizontal size={14} />
                      </button>
                      <button className="text-slate-400 hover:text-slate-700 p-1" title="编辑">
                        <Edit2 size={14} />
                      </button>
                      
                      {/* Project Menu Dropdown */}
                      {activeProjectMenuId === 'new-project' && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-xl border border-slate-200 z-[100] flex flex-col py-1.5 text-slate-700 project-menu-container">`
);

// Close Project Menu Dropdown condition
content = content.replace(
  `                        <button className="flex items-center gap-2.5 px-3 py-2 text-[13px] text-red-600 hover:bg-red-50 transition-colors text-left w-full">
                          <X size={14} className="shrink-0" /> 移除
                        </button>
                      </div>
                    </div>`,
  `                        <button className="flex items-center gap-2.5 px-3 py-2 text-[13px] text-red-600 hover:bg-red-50 transition-colors text-left w-full">
                          <X size={14} className="shrink-0" /> 移除
                        </button>
                        </div>
                      )}
                    </div>`
);

// Replace session menu logic
content = content.replace(
  `                        {i === 0 && (
                          <div className="shrink-0 opacity-0 group-hover/session:opacity-100 transition-opacity relative group/smenu">
                            <button className="text-slate-400 hover:text-slate-600 p-1" title="删除">
                              <Trash2 size={12} />
                            </button>
                            
                            {/* Session Menu Dropdown */}
                            <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-xl shadow-xl border border-slate-200 z-[100] hidden group-hover/smenu:flex flex-col py-1.5">`,
  `                        {i === 0 && (
                          <div className="shrink-0 opacity-0 group-hover/session:opacity-100 transition-opacity relative">
                            <button 
                              className="text-slate-400 hover:text-slate-600 p-1 session-menu-trigger" 
                              title="更多"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveSessionMenuId(activeSessionMenuId === session.id ? null : session.id);
                                setActiveProjectMenuId(null);
                              }}
                            >
                              <MoreHorizontal size={14} />
                            </button>
                            
                            {/* Session Menu Dropdown */}
                            {activeSessionMenuId === session.id && (
                              <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-xl shadow-xl border border-slate-200 z-[100] flex flex-col py-1.5 session-menu-container">`
);

content = content.replace(
  `                              <button className="px-4 py-2 text-[13px] text-red-600 hover:bg-red-50 transition-colors text-left w-full mt-1 pt-2 border-t border-slate-100">
                                删除
                              </button>
                            </div>
                          </div>
                        )}`,
  `                              <button className="px-4 py-2 text-[13px] text-red-600 hover:bg-red-50 transition-colors text-left w-full mt-1 pt-2 border-t border-slate-100">
                                删除
                              </button>
                              </div>
                            )}
                          </div>
                        )}`
);


fs.writeFileSync('src/App.tsx', content);

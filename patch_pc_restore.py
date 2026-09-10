import re

with open("src/components/merchant/ProjectCenter.tsx", "r") as f:
    code = f.read()

# We need to find:
#             </div>
#             
#             <div className="flex-1 overflow-y-auto">
#           <div className="max-w-[1100px] mx-auto p-6 space-y-5">

restore_code = """
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {filteredProjects.length === 0 ? (
                <div className="flex flex-1 items-center justify-center p-6 text-center">
                  <p className="text-[13px] leading-5 text-text-tertiary">没有符合条件的方案</p>
                </div>
              ) : (
                <div className="flex flex-col">
                  {filteredProjects.map((project) => (
                    <div 
                      key={project.id}
                      onClick={() => {
                        setActiveProjectId(project.id);
                        if (window.innerWidth < 1024) setIsSidebarOpen(false);
                      }}
                      className={`group relative cursor-pointer border-b border-border-subtle p-4 transition-colors hover:bg-surface-hover ${
                        project.id === activeProjectId ? 'bg-brand-50/50' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0 pr-4">
                          <h3 className={`truncate text-[14px] font-semibold ${
                            project.id === activeProjectId ? 'text-brand-700' : 'text-text-main'
                          }`}>
                            {project.name}
                          </h3>
                          <div className="mt-1 flex items-center gap-2 text-[12px] text-text-tertiary">
                            <span className="truncate">{project.target}</span>
                          </div>
                        </div>
                        {project.pendingCount > 0 && (
                          <span className="mt-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                            {project.pendingCount}
                          </span>
                        )}
                      </div>
                      
                      <div className="mt-3 flex items-center gap-2">
                        <span className={`rounded px-1.5 py-0.5 text-[11px] font-medium ${
                          project.status === '执行' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : project.status === '草案'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-surface-subtle text-text-secondary border border-border-default'
                        }`}>
                          {project.status}
                        </span>
                        <span className="text-[11px] text-text-tertiary truncate">
                          {project.stage}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-full flex-1 overflow-y-auto bg-page-bg">
        <div className="max-w-[1100px] mx-auto p-6 space-y-5">
"""

code = code.replace(
    '''            </div>
            
            <div className="flex-1 overflow-y-auto">
          <div className="max-w-[1100px] mx-auto p-6 space-y-5">''',
    restore_code
)

with open("src/components/merchant/ProjectCenter.tsx", "w") as f:
    f.write(code)

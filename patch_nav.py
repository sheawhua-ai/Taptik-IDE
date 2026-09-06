import re

with open("src/components/merchant/ExecutionCenter.tsx", "r") as f:
    code = f.read()

# Modify workspaceNavigation
old_nav = """  const workspaceNavigation = (
    <div className="flex shrink-0 items-center gap-1">
<nav className="flex items-center gap-0.5 rounded-lg bg-surface-subtle p-0.5" aria-label="执行任务类型">
        {(Object.keys(domainLabel) as DomainTab[]).map(tab => (
          <button
            key={tab}
            type="button"
            onClick={() => switchDomain(tab)}
            className={`rounded-md px-2 py-1 text-[13px] font-medium transition-colors ${domain === tab ? 'bg-neutral-950 text-white shadow-sm' : 'text-text-secondary hover:bg-surface-1 hover:text-text-main'}`}
          >
            {domainLabel[tab]} <span className="opacity-65">{counts[tab]}</span>
          </button>
        ))}
      </nav>
      <button
        type="button"
        onClick={() => setProgressOpen(true)}
        className="flex items-center gap-1 rounded-md px-2 py-1 text-[13px] text-text-tertiary hover:bg-hover-bg hover:text-text-main"
      >
        <Activity size={11} />任务进展 {counts.progress}
      </button>
      <ProjectScopePicker
        projects={projects}
        value={selectedProjectId}
        onChange={projectId => {
          setSelectedProjectId(projectId);
          setSelectedTaskId(null);
          setActiveTaskId(null);
          setActiveDirectAction(undefined);
        }}
      />
    </div>
  );"""

new_nav = """  const workspaceNavigation = (
    <div className="flex flex-1 w-full shrink-0 items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <nav className="flex items-center gap-0.5 rounded-lg bg-surface-subtle p-0.5" aria-label="执行任务类型">
          {(Object.keys(domainLabel) as DomainTab[]).map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => switchDomain(tab)}
              className={`rounded-md px-2 py-1 text-[13px] font-medium transition-colors ${domain === tab ? 'bg-neutral-950 text-white shadow-sm' : 'text-text-secondary hover:bg-surface-1 hover:text-text-main'}`}
            >
              {domainLabel[tab]} <span className="opacity-65">{counts[tab]}</span>
            </button>
          ))}
        </nav>
        <ProjectScopePicker
          projects={projects}
          value={selectedProjectId}
          onChange={projectId => {
            setSelectedProjectId(projectId);
            setSelectedTaskId(null);
            setActiveTaskId(null);
            setActiveDirectAction(undefined);
          }}
        />
      </div>
      
      <button
        type="button"
        onClick={() => setProgressOpen(true)}
        className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] border border-border-default bg-surface-1 text-text-secondary hover:bg-surface-subtle hover:text-text-main transition-colors"
      >
        <Activity size={14} />任务进展 {counts.progress}
      </button>
    </div>
  );"""

code = code.replace(old_nav, new_nav)

with open("src/components/merchant/ExecutionCenter.tsx", "w") as f:
    f.write(code)

print("Patched ExecutionCenter")

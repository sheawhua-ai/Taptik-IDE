with open("src/components/merchant/ReviewCenter/ReviewWorkbench.tsx", "r") as f:
    text = f.read()

broken = """<div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              {!isSidebarOpen && <button onClick={() => setIsSidebarOpen(true)} className="p-1.5 rounded-lg text-text-tertiary hover:bg-hover-bg hover:text-text-main transition-colors shrink-0" title="展开侧边栏"><PanelLeftOpen size={18} /></button>}<div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className="rounded bg-neutral-950 px-1.5 py-0.5 text-[13px] font-semibold text-white">{action.priority}</span><span className="text-[13px] text-text-tertiary">{action.category}</span><span className="flex items-center gap-1 rounded bg-surface-subtle px-1.5 py-0.5 text-[13px] text-text-secondary"><Settings2 size={10} />修改到：{destination.label}</span></div><h4 className="mt-2 text-[13px] font-semibold text-text-main">{action.title}</h4><p className="mt-1 text-[13px] leading-5 text-text-secondary">{action.reason}</p></div><div className="flex shrink-0 items-center gap-2">{applied ? <span className="flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1.5 text-[13px] font-medium text-emerald-700"><CheckCircle2 size={12} />{action.appliedDestinationLabel}</span> : <><button onClick={() => handleOpenActionDestination(action)} className="flex items-center gap-1 rounded-lg border border-border-default px-3 py-2 text-[13px] font-medium text-text-main">{destination.button}<ExternalLink size={11} /></button><button onClick={() => setActionToApply(action)} className="rounded-lg bg-neutral-950 px-3 py-2 text-[13px] font-medium text-white">查看并确认应用</button></>}</div></div>"""

fixed = """<div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className="rounded bg-neutral-950 px-1.5 py-0.5 text-[13px] font-semibold text-white">{action.priority}</span><span className="text-[13px] text-text-tertiary">{action.category}</span><span className="flex items-center gap-1 rounded bg-surface-subtle px-1.5 py-0.5 text-[13px] text-text-secondary"><Settings2 size={10} />修改到：{destination.label}</span></div><h4 className="mt-2 text-[13px] font-semibold text-text-main">{action.title}</h4><p className="mt-1 text-[13px] leading-5 text-text-secondary">{action.reason}</p></div><div className="flex shrink-0 items-center gap-2">{applied ? <span className="flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1.5 text-[13px] font-medium text-emerald-700"><CheckCircle2 size={12} />{action.appliedDestinationLabel}</span> : <><button onClick={() => handleOpenActionDestination(action)} className="flex items-center gap-1 rounded-lg border border-border-default px-3 py-2 text-[13px] font-medium text-text-main">{destination.button}<ExternalLink size={11} /></button><button onClick={() => setActionToApply(action)} className="rounded-lg bg-neutral-950 px-3 py-2 text-[13px] font-medium text-white">查看并确认应用</button></>}</div></div>"""

text = text.replace(broken, fixed)

# And fix the header structure!
# The header structure is:
# <header className="workspace-header shrink-0 border-b border-border-default bg-surface-1">
#          <div className="flex flex-wrap items-start justify-between gap-4">
#            <div className="flex items-center gap-3">
#              {!isSidebarOpen && <button ...}
#            <div className="min-w-0"><div className="flex items-center gap-2"><h1 ...

header_broken = """        <header className="workspace-header shrink-0 border-b border-border-default bg-surface-1">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              {!isSidebarOpen && <button onClick={() => setIsSidebarOpen(true)} className="p-1.5 rounded-lg text-text-tertiary hover:bg-hover-bg hover:text-text-main transition-colors shrink-0" title="展开侧边栏"><PanelLeftOpen size={18} /></button>}
            <div className="min-w-0"><div className="flex items-center gap-2"><h1 className="truncate text-[17px] font-semibold text-text-main">{currentTask.title}</h1><span className={`rounded-md border px-2 py-0.5 text-[13px] font-medium ${meta.className}`}>{meta.label}</span></div><div className="mt-1.5 flex flex-wrap items-center gap-2 text-[13px] text-text-tertiary"><span className="flex items-center gap-1"><Clock size={12} />{formatChineseDate(currentTask.dateRange.start)} 至 {formatChineseDate(currentTask.dateRange.end)}</span><span>·</span><span className="flex items-center gap-1"><Layers size={12} />{currentTask.projectNames.join("、")}</span><span>·</span><span>更新于 {currentTask.updatedAt}</span></div></div>
            </div><div className="flex items-center gap-2">"""

header_fixed = """        <header className="workspace-header shrink-0 border-b border-border-default bg-surface-1 p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              {!isSidebarOpen && <button onClick={() => setIsSidebarOpen(true)} className="p-1.5 rounded-lg text-text-tertiary hover:bg-hover-bg hover:text-text-main transition-colors shrink-0" title="展开侧边栏"><PanelLeftOpen size={18} /></button>}
              <div className="min-w-0"><div className="flex items-center gap-2"><h1 className="truncate text-[17px] font-semibold text-text-main">{currentTask.title}</h1><span className={`rounded-md border px-2 py-0.5 text-[13px] font-medium ${meta.className}`}>{meta.label}</span></div><div className="mt-1.5 flex flex-wrap items-center gap-2 text-[13px] text-text-tertiary"><span className="flex items-center gap-1"><Clock size={12} />{formatChineseDate(currentTask.dateRange.start)} 至 {formatChineseDate(currentTask.dateRange.end)}</span><span>·</span><span className="flex items-center gap-1"><Layers size={12} />{currentTask.projectNames.join("、")}</span><span>·</span><span>更新于 {currentTask.updatedAt}</span></div></div>
            </div>
            <div className="flex items-center gap-2">"""

text = text.replace(header_broken, header_fixed)

with open("src/components/merchant/ReviewCenter/ReviewWorkbench.tsx", "w") as f:
    f.write(text)

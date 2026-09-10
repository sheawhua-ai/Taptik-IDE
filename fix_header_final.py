with open("src/components/merchant/ReviewCenter/ReviewWorkbench.tsx", "r") as f:
    text = f.read()

broken_header = """            <div className="min-w-0"><div className="flex items-center gap-2"><h1 className="truncate text-[17px] font-semibold text-text-main">{currentTask.title}</h1><span className={`rounded-md border px-2 py-0.5 text-[13px] font-medium ${meta.className}`}>{meta.label}</span></div><div className="mt-1.5 flex flex-wrap items-center gap-2 text-[13px] text-text-tertiary"><span className="flex items-center gap-1"><Clock size={12} />{formatChineseDate(currentTask.dateRange.start)} 至 {formatChineseDate(currentTask.dateRange.end)}</span><span>·</span><span className="flex items-center gap-1"><Layers size={12} />{currentTask.projectNames.join("、")}</span><span>·</span><span>更新于 {currentTask.updatedAt}</span></div></div>
            <div className="flex items-center gap-2">"""

fixed_header = """            <div className="min-w-0"><div className="flex items-center gap-2"><h1 className="truncate text-[17px] font-semibold text-text-main">{currentTask.title}</h1><span className={`rounded-md border px-2 py-0.5 text-[13px] font-medium ${meta.className}`}>{meta.label}</span></div><div className="mt-1.5 flex flex-wrap items-center gap-2 text-[13px] text-text-tertiary"><span className="flex items-center gap-1"><Clock size={12} />{formatChineseDate(currentTask.dateRange.start)} 至 {formatChineseDate(currentTask.dateRange.end)}</span><span>·</span><span className="flex items-center gap-1"><Layers size={12} />{currentTask.projectNames.join("、")}</span><span>·</span><span>更新于 {currentTask.updatedAt}</span></div></div>
            </div>
            <div className="flex items-center gap-2">"""

text = text.replace(broken_header, fixed_header)

with open("src/components/merchant/ReviewCenter/ReviewWorkbench.tsx", "w") as f:
    f.write(text)

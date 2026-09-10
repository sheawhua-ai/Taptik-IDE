with open("src/components/merchant/ReviewCenter/ReviewWorkbench.tsx", "r") as f:
    text = f.read()

broken_275 = """<div className="flex flex-wrap items-start justify-between gap-4">            <div className="flex items-center gap-3">              {!isSidebarOpen && <button onClick={() => setIsSidebarOpen(true)} className="p-1.5 rounded-lg text-text-tertiary hover:bg-hover-bg hover:text-text-main transition-colors shrink-0" title="展开侧边栏"><PanelLeftOpen size={18} /></button>}          <div><div className="text-[13px] font-semibold tracking-[0.18em] text-blue-700">TAPTIK · 小红书运营复盘报告</div><h2 className="mt-2 text-[22px] font-semibold leading-8 text-text-main">{currentTask.title}</h2><p className="mt-1.5 text-[13px] text-text-tertiary">报告周期：{formatChineseDate(currentTask.dateRange.start)}—{formatChineseDate(currentTask.dateRange.end)} · 数据截止：{formatChineseDate(dataSummary.cutoff, true) || dataSummary.cutoff} · 生成时间：{currentTask.updatedAt}</p><p className="mt-1 text-[13px] text-text-tertiary">方案：{currentTask.projectNames.join("、")}</p></div>          <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[13px] font-medium text-emerald-700">数据覆盖 {dataSummary.returnedCount}/{dataSummary.sampleCount} 篇 · 中高可信</span>        </div>"""

fixed_275 = """<div className="flex flex-wrap items-start justify-between gap-4">
          <div><div className="text-[13px] font-semibold tracking-[0.18em] text-blue-700">TAPTIK · 小红书运营复盘报告</div><h2 className="mt-2 text-[22px] font-semibold leading-8 text-text-main">{currentTask.title}</h2><p className="mt-1.5 text-[13px] text-text-tertiary">报告周期：{formatChineseDate(currentTask.dateRange.start)}—{formatChineseDate(currentTask.dateRange.end)} · 数据截止：{formatChineseDate(dataSummary.cutoff, true) || dataSummary.cutoff} · 生成时间：{currentTask.updatedAt}</p><p className="mt-1 text-[13px] text-text-tertiary">方案：{currentTask.projectNames.join("、")}</p></div>
          <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[13px] font-medium text-emerald-700">数据覆盖 {dataSummary.returnedCount}/{dataSummary.sampleCount} 篇 · 中高可信</span>
        </div>"""

text = text.replace(broken_275, fixed_275)

with open("src/components/merchant/ReviewCenter/ReviewWorkbench.tsx", "w") as f:
    f.write(text)

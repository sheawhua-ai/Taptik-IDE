with open("src/components/merchant/ReviewCenter/ReviewWorkbench.tsx", "r") as f:
    text = f.read()

empty_state_old = """      <div className="flex flex-1 flex-col items-center justify-center bg-surface-subtle p-8 text-center"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-1 text-text-tertiary shadow-sm"><Sparkles size={20} /></div><h2 className="mt-4 text-[15px] font-semibold text-text-main">还没有复盘记录</h2><p className="mt-1 text-[13px] text-text-tertiary">创建复盘后，最新报告会显示在这里。</p><button onClick={() => setIsCreateModalOpen(true)} className="mt-4 rounded-lg bg-neutral-950 px-4 py-2 text-[13px] font-medium text-white">新建复盘</button></div>"""

empty_state_new = """      <div className="flex flex-1 flex-col bg-page-bg">
        <div className="flex items-center px-6 py-4 border-b border-border-default bg-surface-1 shrink-0 h-[61px]">
          <h2 className="text-[16px] font-semibold text-text-main">复盘报告</h2>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-1 text-text-tertiary shadow-sm border border-border-default">
            <Sparkles size={20} />
          </div>
          <h2 className="mt-4 text-[16px] font-semibold text-text-main">还没有复盘记录</h2>
          <p className="mt-2 text-[14px] text-text-secondary max-w-sm">从一个方案开始，整理本周期的进展、内容表现和下一步行动。</p>
          <button onClick={() => setIsCreateModalOpen(true)} className="mt-6 rounded-lg bg-neutral-950 px-5 py-2.5 text-[14px] font-medium text-white shadow-sm hover:bg-neutral-800 transition-colors">
            生成第一份复盘
          </button>
        </div>
      </div>"""

text = text.replace(empty_state_old, empty_state_new)

with open("src/components/merchant/ReviewCenter/ReviewWorkbench.tsx", "w") as f:
    f.write(text)

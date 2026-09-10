with open("src/components/knowledge/OverviewTab.tsx", "r") as f:
    text = f.read()

target = """      <section className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-border-default bg-surface-1 px-6 py-10 text-center shadow-sm">
        <span className={`flex h-14 w-14 items-center justify-center rounded-2xl ${hasChecked ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-danger'}`}>
          {hasChecked ? <CheckCircle2 className="h-7 w-7" /> : <ClipboardCheck className="h-7 w-7" />}
        </span>
        <h2 className="mt-5 text-xl font-semibold text-text-main">{hasChecked ? '知识库体检完成' : '给知识库做一次体检'}</h2>
        <p className="mt-2 text-sm text-text-tertiary">{hasChecked ? `发现 ${attentionCount} 项需要关注，已按影响范围排好顺序。` : '看看哪些内容已经齐全，哪些还需要补充。'}</p>
        <button onClick={() => setHasChecked(true)} className="mt-5 flex items-center rounded-lg bg-btn-main px-5 py-2.5 text-sm font-medium text-white hover:bg-btn-main-hover">
          <ClipboardCheck className="mr-1.5 h-4 w-4" />{hasChecked ? '重新体检' : '开始体检'}
        </button>
      </section>"""

replacement = """      <section className="flex items-center justify-between rounded-xl border border-border-default bg-surface-1 px-5 py-4 shadow-sm">
        <div className="flex items-center gap-3">
          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${hasChecked ? 'bg-emerald-50 text-emerald-600' : 'bg-brand-50 text-brand-600'}`}>
            {hasChecked ? <CheckCircle2 className="h-5 w-5" /> : <ClipboardCheck className="h-5 w-5" />}
          </span>
          <div>
            <h2 className="text-[14px] font-semibold text-text-main">{hasChecked ? '知识库体检完成' : '知识库体检'}</h2>
            <p className="mt-0.5 text-[13px] text-text-tertiary">{hasChecked ? `发现 ${attentionCount} 项需要关注，已按影响范围排好顺序。` : '一键扫描知识库健康度，发现需要补充的内容。'}</p>
          </div>
        </div>
        <button onClick={() => setHasChecked(true)} className="flex shrink-0 items-center rounded-lg bg-surface-subtle border border-border-default px-4 py-2 text-[13px] font-medium text-text-main hover:bg-surface-hover">
          <ClipboardCheck className="mr-1.5 h-4 w-4 text-text-secondary" />{hasChecked ? '重新体检' : '开始体检'}
        </button>
      </section>"""

text = text.replace(target, replacement)

with open("src/components/knowledge/OverviewTab.tsx", "w") as f:
    f.write(text)

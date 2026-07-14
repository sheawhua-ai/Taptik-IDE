with open("src/components/rings/InteractionWorkbench.tsx", "r") as f:
    content = f.read()

old_metrics = """          <div className="mr-2 flex items-center gap-2">
            <h2 className="text-[16px] font-bold text-neutral-900">互动承接</h2>
          </div>
          <div className="h-4 w-px bg-neutral-200 mx-2"></div>"""

new_metrics = """          <div className="mr-2 flex items-center gap-4">
            <h2 className="text-[16px] font-bold text-neutral-900">互动承接</h2>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[12px] font-bold border border-emerald-200 cursor-pointer hover:bg-emerald-100 transition-colors">快速确认 (12)</span>
              <span className="px-2 py-1 bg-rose-50 text-rose-700 rounded-lg text-[12px] font-bold border border-rose-200 cursor-pointer hover:bg-rose-100 transition-colors">需要处理 (6)</span>
              <span className="px-2 py-1 bg-amber-50 text-amber-700 rounded-lg text-[12px] font-bold border border-amber-200 cursor-pointer hover:bg-amber-100 transition-colors">等待推进 (2)</span>
            </div>
          </div>
          <div className="h-4 w-px bg-neutral-200 mx-2"></div>"""

content = content.replace(old_metrics, new_metrics)

with open("src/components/rings/InteractionWorkbench.tsx", "w") as f:
    f.write(content)

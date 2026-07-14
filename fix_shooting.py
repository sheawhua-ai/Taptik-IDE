with open("src/components/rings/ShootingAndUploadWorkbench.tsx", "r") as f:
    content = f.read()

old_metrics = """              <span className="px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded text-[12px] font-medium">当前18篇笔记需要素材</span>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[12px] font-medium border border-emerald-100">7篇素材已齐</span>
              <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[12px] font-medium border border-blue-100">6篇拍摄中</span>
              <span className="px-2 py-0.5 bg-rose-50 text-rose-600 rounded text-[12px] font-medium border border-rose-100">5篇仍有待办</span>
              <span className="px-2 py-0.5 bg-amber-50 text-amber-600 rounded text-[12px] font-medium border border-amber-100">3项需要介入</span>"""

new_metrics = """              <span className="px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded text-[12px] font-medium">当前18篇笔记需要素材</span>
              <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded text-[12px] font-bold border border-emerald-200 cursor-pointer hover:bg-emerald-100 transition-colors">快速确认 (4)</span>
              <span className="px-2 py-1 bg-rose-50 text-rose-700 rounded text-[12px] font-bold border border-rose-200 cursor-pointer hover:bg-rose-100 transition-colors">需要处理 (12)</span>
              <span className="px-2 py-1 bg-amber-50 text-amber-700 rounded text-[12px] font-bold border border-amber-200 cursor-pointer hover:bg-amber-100 transition-colors">等待推进 (5)</span>"""

content = content.replace(old_metrics, new_metrics)

with open("src/components/rings/ShootingAndUploadWorkbench.tsx", "w") as f:
    f.write(content)

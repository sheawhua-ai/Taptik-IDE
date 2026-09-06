import re

with open("src/components/merchant/CreateProject/StructuredPlanCreationFlow.tsx", "r") as f:
    code = f.read()

# Remove observationDays state
code = re.sub(r'  const \[observationDays, setObservationDays\] = useState.*?;\n', '', code)

# Remove Observation days UI and 48 hours text block
code = re.sub(r'<div><div><label className="block text-\[13px\] font-semibold mb-1\.5">发布后观察周期</label>[\s\S]*?自动生成首评、互动检查和搜索收录观察任务。</div></div>', '', code)
# Fix wrapper grid to simple div since only dates remain
code = code.replace('<div className="grid md:grid-cols-2 gap-4"><div><label className="block text-[13px] font-semibold mb-1.5">开始日期', '<div><div className="grid md:grid-cols-2 gap-4"><div><label className="block text-[13px] font-semibold mb-1.5">开始日期')
# Just simple replace to clean it up
code = re.sub(r'<div className="grid md:grid-cols-2 gap-4"><div><label className="block text-\[13px\] font-semibold mb-1\.5">开始日期</label>[\s\S]*?</div></div>', r'<div className="grid md:grid-cols-2 gap-4"><div><label className="block text-[13px] font-semibold mb-1.5">开始日期</label><input type="date" value={draft.startDate} onChange={(event) => setDraft((current) => ({ ...current, startDate: event.target.value }))} className="w-full rounded-xl border border-border-default px-3 py-2.5 text-[13px]" /></div><div><label className="block text-[13px] font-semibold mb-1.5">结束日期</label><input type="date" value={draft.endDate} onChange={(event) => setDraft((current) => ({ ...current, endDate: event.target.value }))} className="w-full rounded-xl border border-border-default px-3 py-2.5 text-[13px]" /></div></div>', code)

# Fix onConfirm
code = re.sub(r'      observationDays,\n', '', code)

with open("src/components/merchant/CreateProject/StructuredPlanCreationFlow.tsx", "w") as f:
    f.write(code)

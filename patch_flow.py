import re

with open("src/components/merchant/CreateProject/StructuredPlanCreationFlow.tsx", "r") as f:
    code = f.read()

# 1. Add Date Range Picker
old_top = """                  <section className="rounded-xl border border-border-default bg-surface-1 p-5 space-y-5">
                    <div>
                      <label className="block text-[13px] font-semibold mb-1.5">方案名称</label>
                      <input type="text" value={draft.projectName} onChange={(event) => setDraft((current) => ({ ...current, projectName: event.target.value }))} className="w-full rounded-xl border border-border-default px-3 py-2 text-[14px] font-medium" />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[13px] font-semibold mb-1.5">开始日期</label>
                        <input type="date" value={draft.startDate} onChange={(event) => setDraft((current) => ({ ...current, startDate: event.target.value }))} className="w-full rounded-xl border border-border-default px-3 py-2.5 text-[13px]" />
                      </div>
                      <div>
                        <label className="block text-[13px] font-semibold mb-1.5">结束日期</label>
                        <input type="date" value={draft.endDate} onChange={(event) => setDraft((current) => ({ ...current, endDate: event.target.value }))} className="w-full rounded-xl border border-border-default px-3 py-2.5 text-[13px]" />
                      </div>
                    </div>
                  </section>"""

new_top = """                  <section className="rounded-xl border border-border-default bg-surface-1 p-5 space-y-5">
                    <div>
                      <label className="block text-[13px] font-semibold mb-1.5">方案名称 *</label>
                      <input value={draft.projectName} onChange={(event) => setDraft((current) => ({ ...current, projectName: event.target.value }))} placeholder="例如：9月KOC真实体验验证" className="w-full rounded-xl border border-border-default px-3.5 py-2.5 text-[13px] outline-none focus:border-neutral-500" />
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold mb-1.5">起止时间 *</label>
                      <div className="flex items-center gap-2 w-full rounded-xl border border-border-default px-3.5 py-2 text-[13px] outline-none focus-within:border-neutral-500 bg-white">
                        <span className="text-text-tertiary">从</span>
                        <input type="date" value={draft.startDate} onChange={(event) => setDraft((current) => ({ ...current, startDate: event.target.value }))} className="bg-transparent outline-none flex-1 cursor-pointer" />
                        <span className="text-text-tertiary">至</span>
                        <input type="date" value={draft.endDate} onChange={(event) => setDraft((current) => ({ ...current, endDate: event.target.value }))} className="bg-transparent outline-none flex-1 cursor-pointer" />
                      </div>
                    </div>
                  </section>"""
code = code.replace(old_top, new_top)

# Wait, looking at the previous cat output, the current code has:
#                     <div><label className="block text-[13px] font-semibold mb-1.5">方案名称 *</label><input value={draft.projectName} onChange={(event) => setDraft((current) => ({ ...current, projectName: event.target.value }))} placeholder="例如：9月KOC真实体验验证" className="w-full rounded-xl border border-border-default px-3.5 py-2.5 text-[13px] outline-none focus:border-neutral-500" /></div>
# Let's use regex to replace it properly.

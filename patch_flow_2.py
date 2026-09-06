import re

with open("src/components/merchant/CreateProject/StructuredPlanCreationFlow.tsx", "r") as f:
    code = f.read()

# 1. Add Date Range Picker
# The current code has:
#                     <div><label className="block text-[13px] font-semibold mb-1.5">方案名称 *</label><input value={draft.projectName} onChange={(event) => setDraft((current) => ({ ...current, projectName: event.target.value }))} placeholder="例如：9月KOC真实体验验证" className="w-full rounded-xl border border-border-default px-3.5 py-2.5 text-[13px] outline-none focus:border-neutral-500" /></div>
old_title_block = r'<div><label className="block text-\[13px\] font-semibold mb-1.5">方案名称 \*</label><input value=\{draft\.projectName\}.*?/></div>'

new_title_block = """<div><label className="block text-[13px] font-semibold mb-1.5">方案名称 *</label><input value={draft.projectName} onChange={(event) => setDraft((current) => ({ ...current, projectName: event.target.value }))} placeholder="例如：9月KOC真实体验验证" className="w-full rounded-xl border border-border-default px-3.5 py-2.5 text-[13px] outline-none focus:border-neutral-500" /></div>
                    <div>
                      <label className="block text-[13px] font-semibold mb-1.5">起止时间 *</label>
                      <div className="flex items-center gap-2 w-full rounded-xl border border-border-default px-3.5 py-2 text-[13px] outline-none focus-within:border-neutral-500 bg-white">
                        <span className="text-text-tertiary">从</span>
                        <input type="date" value={draft.startDate} onChange={(event) => setDraft((current) => ({ ...current, startDate: event.target.value }))} className="bg-transparent outline-none flex-1 cursor-pointer" />
                        <span className="text-text-tertiary">至</span>
                        <input type="date" value={draft.endDate} onChange={(event) => setDraft((current) => ({ ...current, endDate: event.target.value }))} className="bg-transparent outline-none flex-1 cursor-pointer" />
                      </div>
                    </div>"""

code = re.sub(old_title_block, new_title_block, code)

# 2. Product Knowledge Base tags style
old_tag_block = r"\{?\['无谷高蛋白鲜肉全价幼犬粮', '成犬低脂配方粮', '宠物益生菌'\]\.map\(tag => \(.*?<button key=\{tag\}.*?className=\"rounded-md border border-brand-logo/30 bg-brand-logo/5 px-2 py-1 text-\[12px\] text-brand-logo hover:bg-brand-logo/10\">\{tag\}</button>.*?\)\)\}?"
new_tag_block = """{['无谷高蛋白鲜肉全价幼犬粮', '成犬低脂配方粮', '宠物益生菌'].map(tag => {
      const isSelected = draft.promotionTarget.targetName === tag;
      return (
        <button 
          key={tag} 
          type="button" 
          onClick={() => setDraft(curr => ({ ...curr, promotionTarget: { ...curr.promotionTarget, targetName: tag } }))} 
          className={`rounded-md border px-2 py-1 text-[12px] transition-colors ${isSelected ? 'bg-neutral-900 border-neutral-900 text-white' : 'bg-surface-subtle border-border-default text-text-secondary hover:bg-surface-2'}`}
        >
          {tag}
        </button>
      );
    })}"""
code = re.sub(old_tag_block, new_tag_block, code, flags=re.DOTALL)

# 3. Remove "这里确认的数量是硬约束..."
code = code.replace('<p className="text-[13px] text-text-tertiary mt-1">这里确认的数量是硬约束，后续AI不会自行改动。</p>', '')

# 4. Remove total notes block
total_notes_regex = r'<div className="rounded-xl bg-surface-subtle border border-border-default p-4 flex items-center justify-between"><div><span className="text-\[13px\] text-text-secondary">本轮总笔记数</span><strong className="ml-3 text-\[22px\]">\{counts\.total\}</strong></div><div className="text-\[12px\] text-text-tertiary">品牌 \{counts\.brand\} · KOS \{counts\.kos\} · KOC \{counts\.koc\}</div></div>'
code = re.sub(total_notes_regex, '', code)

# 5. Remove 快捷分配
quick_alloc_regex = r'<div><label className="block text-\[13px\] font-semibold mb-2">快捷分配</label><div className="flex flex-wrap gap-2">.*?</div></div>'
code = re.sub(quick_alloc_regex, '', code, flags=re.DOTALL)

with open("src/components/merchant/CreateProject/StructuredPlanCreationFlow.tsx", "w") as f:
    f.write(code)

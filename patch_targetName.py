import re

with open("src/components/merchant/CreateProject/StructuredPlanCreationFlow.tsx", "r") as f:
    code = f.read()

old_target = '<div><label className="block text-[13px] font-semibold mb-1.5">主推产品 / 服务 *</label><input value={draft.promotionTarget.targetName} onChange={(event) => setDraft((current) => ({ ...current, promotionTarget: { ...current.promotionTarget, targetName: event.target.value } }))} placeholder="这轮主要推广什么" className="w-full rounded-xl border border-border-default px-3.5 py-2.5 text-[13px] outline-none focus:border-neutral-500" /></div>'

new_target = """<div>
  <label className="block text-[13px] font-semibold mb-1.5">主推产品 / 服务 *</label>
  <input value={draft.promotionTarget.targetName} onChange={(event) => setDraft((current) => ({ ...current, promotionTarget: { ...current.promotionTarget, targetName: event.target.value } }))} placeholder="这轮主要推广什么，如果知识库还没有，则可以手动填写。" className="w-full rounded-xl border border-border-default px-3.5 py-2.5 text-[13px] outline-none focus:border-neutral-500" />
  <div className="mt-2 flex flex-wrap gap-2 items-center">
    <span className="text-[12px] text-text-tertiary">商家知识库:</span>
    {['无谷高蛋白鲜肉全价幼犬粮', '成犬低脂配方粮', '宠物益生菌'].map(tag => (
      <button key={tag} type="button" onClick={() => setDraft(curr => ({ ...curr, promotionTarget: { ...curr.promotionTarget, targetName: tag } }))} className="rounded-md border border-brand-logo/30 bg-brand-logo/5 px-2 py-1 text-[12px] text-brand-logo hover:bg-brand-logo/10">{tag}</button>
    ))}
  </div>
</div>"""

code = code.replace(old_target, new_target)

with open("src/components/merchant/CreateProject/StructuredPlanCreationFlow.tsx", "w") as f:
    f.write(code)


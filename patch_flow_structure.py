import re

with open("src/components/merchant/CreateProject/StructuredPlanCreationFlow.tsx", "r") as f:
    code = f.read()

# Remove REVIEW_TABS definition
code = re.sub(r'const REVIEW_TABS: Array.*?\];\n', '', code, flags=re.DOTALL)
code = re.sub(r"type ReviewTab = 'strategy' \| 'content' \| 'publish';\n", '', code)

# Remove reviewTab state
code = re.sub(r'  const \[reviewTab, setReviewTab\] = useState<ReviewTab>\(\'strategy\'\);\n', '', code)
code = re.sub(r'  const \[conversionGoal, setConversionGoal\] = useState\(\'收藏 / 关注\'\);\n', '', code)

# Remove conversionGoal from PlanCreationSettings
code = re.sub(r'  conversionGoal: string;\n', '', code)

# Remove tab nav rendering
old_nav = """          <div className="border-b border-border-default bg-surface-1 px-6">
            <div className="mx-auto max-w-[1320px] flex items-center gap-1">
              {REVIEW_TABS.map((tab) => (
                <button key={tab.id} type="button" onClick={() => setReviewTab(tab.id)} className={`px-5 py-3.5 text-left border-b-2 ${reviewTab === tab.id ? 'border-neutral-900 text-text-main' : 'border-transparent text-text-tertiary hover:text-text-main'}`}>
                  <span className="block text-[13px] font-semibold">{tab.label}</span>
                  <span className="block text-[11px] mt-0.5">{tab.description}</span>
                </button>
              ))}
            </div>
          </div>"""
code = code.replace(old_nav, "")

# Remove conditional wrappers
code = code.replace("{reviewTab === 'strategy' ? (", "")
code = code.replace("{reviewTab === 'content' ? (", "")
code = code.replace("{reviewTab === 'publish' ? (", "")
code = code.replace(") : null}", "")

# Refactor form validation to just not use setReviewTab
code = re.sub(r"      setReviewTab\('strategy'\);\n", "", code)
code = re.sub(r"      setReviewTab\('content'\);\n", "", code)
code = re.sub(r"      setReviewTab\('publish'\);\n", "", code)

# Remove 站内承接 field
old_conversion_field = """                      <div><label className="block text-[13px] font-semibold mb-1.5">站内承接</label><select value={conversionGoal} onChange={(event) => setConversionGoal(event.target.value)} className="w-full rounded-xl border border-border-default px-3.5 py-2.5 text-[13px] outline-none focus:border-neutral-500 bg-surface-1"><option>收藏 / 关注</option><option>主页访问</option><option>商品访问</option><option>私信咨询</option><option>门店访问</option></select></div>"""
code = code.replace(old_conversion_field, "")
code = code.replace(' className="grid md:grid-cols-2 gap-4"', "") # Removing grid for that row if it only has one element now, wait, maybe just leave it, it's fine. Wait, better to remove the grid layout for targetName if we remove conversionGoal.
old_target_name = """                    <div className="grid md:grid-cols-2 gap-4">
                      <div><label className="block text-[13px] font-semibold mb-1.5">主推产品 / 服务 *</label><input value={draft.promotionTarget.targetName} onChange={(event) => setDraft((current) => ({ ...current, promotionTarget: { ...current.promotionTarget, targetName: event.target.value } }))} placeholder="这轮主要推广什么" className="w-full rounded-xl border border-border-default px-3.5 py-2.5 text-[13px] outline-none focus:border-neutral-500" /></div>
                      
                    </div>"""
new_target_name = """                    <div>
                      <label className="block text-[13px] font-semibold mb-1.5">主推产品 / 服务 *</label>
                      <input value={draft.promotionTarget.targetName} onChange={(event) => setDraft((current) => ({ ...current, promotionTarget: { ...current.promotionTarget, targetName: event.target.value } }))} placeholder="这轮主要推广什么，如果知识库还没有，则可以手动填写。" className="w-full rounded-xl border border-border-default px-3.5 py-2.5 text-[13px] outline-none focus:border-neutral-500" />
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="text-[12px] text-text-tertiary mt-1">推荐:</span>
                        {['春季冲锋衣', '防水登山鞋', '户外保暖抓绒'].map(tag => (
                          <button key={tag} type="button" onClick={() => setDraft(curr => ({ ...curr, promotionTarget: { ...curr.promotionTarget, targetName: tag } }))} className="rounded-md border border-border-default bg-surface-subtle px-2 py-1 text-[12px] text-text-secondary hover:text-text-main">{tag}</button>
                        ))}
                      </div>
                    </div>"""
# The above replace won't work well due to exact whitespace matching. Let's do regex.
code = re.sub(r'<div className="grid md:grid-cols-2 gap-4">\s*<div><label className="block text-\[13px\] font-semibold mb-1\.5">主推产品 / 服务 \*</label><input value=\{draft\.promotionTarget\.targetName\}[^>]*/></div>\s*</div>', new_target_name, code)


# Remove content direction fields
code = re.sub(r'<div className="grid md:grid-cols-3 gap-3">[\s\S]*?</div>\s*<label className="flex items-start gap-3', '<label className="flex items-start gap-3', code)

# Remove publish frequency, primaryBusinessGoal, successCriteria, stopCriteria
old_publish = """                    <div><h2 className="text-[16px] font-semibold">发布与验证</h2><p className="text-[13px] text-text-tertiary mt-1">确认发布周期、承接动作和复盘条件。</p></div>
                    <div className="grid md:grid-cols-3 gap-4"><div><label className="block text-[13px] font-semibold mb-1.5">开始日期</label><input type="date" value={draft.startDate} onChange={(event) => setDraft((current) => ({ ...current, startDate: event.target.value }))} className="w-full rounded-xl border border-border-default px-3 py-2.5 text-[13px]" /></div><div><label className="block text-[13px] font-semibold mb-1.5">结束日期</label><input type="date" value={draft.endDate} onChange={(event) => setDraft((current) => ({ ...current, endDate: event.target.value }))} className="w-full rounded-xl border border-border-default px-3 py-2.5 text-[13px]" /></div><div><label className="block text-[13px] font-semibold mb-1.5">发布频次</label><select value={publishFrequency} onChange={(event) => setPublishFrequency(event.target.value)} className="w-full rounded-xl border border-border-default px-3 py-2.5 text-[13px] bg-surface-1"><option>每天 1–2 篇</option><option>每天 1 篇</option><option>每周 3 篇</option><option>按账号错峰发布</option></select></div></div>
                    <div><label className="block text-[13px] font-semibold mb-1.5">本轮验证目标</label><textarea rows={3} value={draft.coreGoalAndVerification.primaryBusinessGoal} onChange={(event) => setDraft((current) => ({ ...current, coreGoalAndVerification: { ...current.coreGoalAndVerification, primaryBusinessGoal: event.target.value } }))} className="w-full rounded-xl border border-border-default px-3.5 py-2.5 text-[13px] leading-6 resize-none" /></div>
                    <div className="grid md:grid-cols-2 gap-4"><div><label className="block text-[13px] font-semibold mb-1.5">继续铺量条件</label><textarea rows={3} value={draft.coreGoalAndVerification.successCriteria} onChange={(event) => setDraft((current) => ({ ...current, coreGoalAndVerification: { ...current.coreGoalAndVerification, successCriteria: event.target.value } }))} className="w-full rounded-xl border border-border-default px-3.5 py-2.5 text-[13px] leading-6 resize-none" /></div><div><label className="block text-[13px] font-semibold mb-1.5">暂停或换打法条件</label><textarea rows={3} value={draft.coreGoalAndVerification.stopCriteria} onChange={(event) => setDraft((current) => ({ ...current, coreGoalAndVerification: { ...current.coreGoalAndVerification, stopCriteria: event.target.value } }))} className="w-full rounded-xl border border-border-default px-3.5 py-2.5 text-[13px] leading-6 resize-none" /></div></div>
                    <div className="grid md:grid-cols-2 gap-4"><div><label className="block text-[13px] font-semibold mb-1.5">发布后观察周期</label><div className="flex items-center gap-2"><input type="number" min={1} value={observationDays} onChange={(event) => setObservationDays(Math.max(1, Number(event.target.value)))} className="w-24 rounded-xl border border-border-default px-3 py-2.5 text-[13px]" /><span className="text-[13px] text-text-secondary">天</span></div></div><div className="rounded-xl bg-surface-subtle border border-border-default p-3 text-[12px] text-text-secondary"><strong className="block text-text-main mb-1">发布后48小时</strong>自动生成首评、互动检查和搜索收录观察任务。</div></div>"""

new_publish = """                    <div><h2 className="text-[16px] font-semibold">发布与验证</h2><p className="text-[13px] text-text-tertiary mt-1">确认发布周期和复盘条件。</p></div>
                    <div className="grid md:grid-cols-2 gap-4"><div><label className="block text-[13px] font-semibold mb-1.5">开始日期</label><input type="date" value={draft.startDate} onChange={(event) => setDraft((current) => ({ ...current, startDate: event.target.value }))} className="w-full rounded-xl border border-border-default px-3 py-2.5 text-[13px]" /></div><div><label className="block text-[13px] font-semibold mb-1.5">结束日期</label><input type="date" value={draft.endDate} onChange={(event) => setDraft((current) => ({ ...current, endDate: event.target.value }))} className="w-full rounded-xl border border-border-default px-3 py-2.5 text-[13px]" /></div></div>
                    
                    <div className="grid md:grid-cols-2 gap-4"><div><label className="block text-[13px] font-semibold mb-1.5">发布后观察周期</label><div className="flex items-center gap-2"><input type="number" min={1} value={observationDays} onChange={(event) => setObservationDays(Math.max(1, Number(event.target.value)))} className="w-24 rounded-xl border border-border-default px-3 py-2.5 text-[13px]" /><span className="text-[13px] text-text-secondary">天</span></div></div><div className="rounded-xl bg-surface-subtle border border-border-default p-3 text-[12px] text-text-secondary"><strong className="block text-text-main mb-1">发布后48小时</strong>自动生成首评、互动检查和搜索收录观察任务。</div></div>"""
code = code.replace(old_publish, new_publish)

# Remove conversionGoal from sidebar summary
code = re.sub(r'<div className="flex justify-between pt-2 border-t border-border-default"><span className="text-text-secondary">站内承接</span><strong>\{conversionGoal\}</strong></div>', '', code)

with open("src/components/merchant/CreateProject/StructuredPlanCreationFlow.tsx", "w") as f:
    f.write(code)

print("Pass 1 structural changes complete")

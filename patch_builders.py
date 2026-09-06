import re

with open("src/components/merchant/CreateProject/StructuredPlanCreationFlow.tsx", "r") as f:
    code = f.read()

# Add imports
imports = """import { CoreProblemBuilder } from './Builders/CoreProblemBuilder';
import { TargetAudienceBuilder } from './Builders/TargetAudienceBuilder';
import { ContentMethodBuilder } from './Builders/ContentMethodBuilder';
import { TargetKeywordsBuilder } from './Builders/TargetKeywordsBuilder';\n"""

# Inject after React import
code = re.sub(r'import React, { useState } from \'react\';\n', f"import React, {{ useState }} from 'react';\n{imports}", code)

# Fix settings destructure (we removed conversionGoal)
code = re.sub(r'  conversionGoal: string;\n', '', code)

# Now we need to handle targetKeywords which is just a string right now
code = code.replace("  const [targetKeywords, setTargetKeywords] = useState('幼犬换粮、幼犬软便、换粮方法');", "  const [targetKeywords, setTargetKeywords] = useState<string[]>(['幼犬换粮', '幼犬软便', '换粮方法']);")

# Replace CoreProblem
old_core_prob = r'<div><label className="block text-\[13px\] font-semibold mb-1\.5">核心问题 \*</label><textarea rows=\{3\} value=\{draft\.coreStrategy\.problemToSolve\} onChange=\{\(event\) => setDraft\(\(current\) => \(\{ \.\.\.current, coreStrategy: \{ \.\.\.current\.coreStrategy, problemToSolve: event\.target\.value \} \}\)\)\} placeholder="本轮具体要解决什么运营问题" className="w-full rounded-xl border border-border-default px-3\.5 py-2\.5 text-\[13px\] leading-6 outline-none focus:border-neutral-500 resize-none" /></div>'
new_core_prob = """<CoreProblemBuilder 
                      primaryGoal={primaryGoal} 
                      value={draft.coreStrategy.problemToSolve} 
                      onChange={(val) => setDraft(curr => ({ ...curr, coreStrategy: { ...curr.coreStrategy, problemToSolve: val } }))}
                      structuredValue={draft.coreStrategy.core_problem_structured}
                      onStructuredValueChange={(val) => setDraft(curr => ({ ...curr, coreStrategy: { ...curr.coreStrategy, core_problem_structured: val } }))}
                    />"""
code = re.sub(old_core_prob, new_core_prob, code)

# Replace TargetAudience
old_audience = r'<div><label className="block text-\[13px\] font-semibold mb-1\.5">目标人群 \*</label><textarea rows=\{2\} value=\{draft\.promotionTarget\.targetAudience\} onChange=\{\(event\) => setDraft\(\(current\) => \(\{ \.\.\.current, promotionTarget: \{ \.\.\.current\.promotionTarget, targetAudience: event\.target\.value \} \}\)\)\} placeholder="这轮内容主要给谁看" className="w-full rounded-xl border border-border-default px-3\.5 py-2\.5 text-\[13px\] leading-6 outline-none focus:border-neutral-500 resize-none" /></div>'
new_audience = """<TargetAudienceBuilder 
                      value={draft.promotionTarget.targetAudience}
                      onChange={(val) => setDraft(curr => ({ ...curr, promotionTarget: { ...curr.promotionTarget, targetAudience: val } }))}
                      audienceTags={draft.promotionTarget.audience_tags}
                      onAudienceTagsChange={(tags) => setDraft(curr => ({ ...curr, promotionTarget: { ...curr.promotionTarget, audience_tags: tags } }))}
                    />"""
code = re.sub(old_audience, new_audience, code)

# Replace ContentMethod
old_content = r'<div><label className="block text-\[13px\] font-semibold mb-1\.5">内容方法 \*</label><textarea rows=\{3\} value=\{draft\.coreStrategy\.contentLogic\} onChange=\{\(event\) => setDraft\(\(current\) => \(\{ \.\.\.current, coreStrategy: \{ \.\.\.current\.coreStrategy, contentLogic: event\.target\.value \} \}\)\)\} className="w-full rounded-xl border border-border-default px-3\.5 py-2\.5 text-\[13px\] leading-6 outline-none focus:border-neutral-500 resize-none" /></div>'
new_content = """<ContentMethodBuilder 
                      primaryGoal={primaryGoal}
                      structuredProblem={draft.coreStrategy.core_problem_structured}
                      value={draft.coreStrategy.contentLogic}
                      onChange={(val) => setDraft(curr => ({ ...curr, coreStrategy: { ...curr.coreStrategy, contentLogic: val } }))}
                      methodCards={draft.coreStrategy.method_cards}
                      onMethodCardsChange={(cards) => setDraft(curr => ({ ...curr, coreStrategy: { ...curr.coreStrategy, method_cards: cards } }))}
                    />"""
code = re.sub(old_content, new_content, code)

# Replace TargetKeywords
old_keywords = r'<div><label className="block text-\[13px\] font-semibold mb-1\.5">目标关键词 <span className="font-normal text-text-tertiary">搜索类方案必填</span></label><input value=\{targetKeywords\} onChange=\{\(event\) => setTargetKeywords\(\(event\.target\.value\)\)\} placeholder="用逗号分隔关键词" className="w-full rounded-xl border border-border-default px-3\.5 py-2\.5 text-\[13px\] outline-none focus:border-neutral-500" /></div>'
new_keywords = """<TargetKeywordsBuilder 
                      primaryGoal={primaryGoal}
                      keywords={targetKeywords}
                      onChange={setTargetKeywords}
                    />"""
code = re.sub(old_keywords, new_keywords, code)

with open("src/components/merchant/CreateProject/StructuredPlanCreationFlow.tsx", "w") as f:
    f.write(code)

print("Builders integration complete")

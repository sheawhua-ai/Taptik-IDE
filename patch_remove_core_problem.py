import re

with open("src/components/merchant/CreateProject/StructuredPlanCreationFlow.tsx", "r") as f:
    code = f.read()

# Remove import
code = code.replace("import { CoreProblemBuilder } from './Builders/CoreProblemBuilder';", "")

# Replace usage with static block
old_block = """                    <CoreProblemBuilder 
                      primaryGoal={primaryGoal} 
                      value={draft.coreStrategy.problemToSolve} 
                      onChange={(val) => setDraft(curr => ({ ...curr, coreStrategy: { ...curr.coreStrategy, problemToSolve: val } }))}
                      structuredValue={draft.coreStrategy.core_problem_structured}
                      onStructuredValueChange={(val) => setDraft(curr => ({ ...curr, coreStrategy: { ...curr.coreStrategy, core_problem_structured: val } }))}
                    />"""

new_block = """                    {/* 商家全局画像/核心问题 */}
                    <div className="rounded-xl border border-brand-logo/30 bg-brand-logo/5 p-4 relative overflow-hidden">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[13px] font-semibold text-brand-logo">全局业务诊断 (自动同步自商家画像)</span>
                      </div>
                      <p className="text-[13px] text-text-main leading-relaxed relative z-10">
                        {draft.coreStrategy.problemToSolve || '当前运营在【搜索卡位】环节存在明显瓶颈。具体表现为：收录率低、内容同质化严重，导致整体转化率偏低，需要重点优化。'}
                      </p>
                    </div>"""

code = code.replace(old_block, new_block)

# Add Database icon to import if not present
if "Database" not in code:
    code = code.replace("import {", "import { Database,", 1)

with open("src/components/merchant/CreateProject/StructuredPlanCreationFlow.tsx", "w") as f:
    f.write(code)

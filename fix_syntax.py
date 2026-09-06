import re

with open("src/components/merchant/CreateProject/StructuredPlanCreationFlow.tsx", "r") as f:
    code = f.read()

bad_snippet = """                      <p className="text-[13px] text-text-main leading-relaxed relative z-10">
                        {draft.coreStrategy.problemToSolve || '当前运营在【搜索卡位】环节存在明显瓶颈。具体表现为：收录率低、内容同质化严重，导致整体转化率偏低，需要重点优化。'}
                      </p>
                    </div>"""

code = code.replace(bad_snippet, "")

with open("src/components/merchant/CreateProject/StructuredPlanCreationFlow.tsx", "w") as f:
    f.write(code)

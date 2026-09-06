import re

with open("src/components/merchant/CreateProject/StructuredPlanCreationFlow.tsx", "r") as f:
    code = f.read()

old_dropdown = """                                <select className="w-full bg-surface-1 border border-border-default rounded-lg px-2 py-1.5 text-[12px] outline-none text-text-main">
                                  <option value="">不使用预设模板 (由AI自动决策)</option>
                                  <option value="template-1">模板：科普评测风 (适合成分党)</option>
                                  <option value="template-2">模板：开箱体验风 (适合新手)</option>
                                  <option value="template-3">模板：剧情反转风 (适合泛流量)</option>
                                </select>"""

new_dropdown = """                                <select className="w-full bg-surface-1 border border-border-default rounded-lg px-2 py-2 text-[12px] outline-none text-text-main font-medium">
                                  <option value="">🤖 交由 AI 结合「{primaryGoal}」目标自主路由</option>
                                  <option disabled>────── 账号预设知识库模板 ──────</option>
                                  <option value="template-1">模板：科普评测风 (适合成分党)</option>
                                  <option value="template-2">模板：开箱体验风 (适合新手)</option>
                                  <option value="template-3">模板：剧情反转风 (适合泛流量)</option>
                                </select>
                                <p className="text-[11px] text-text-tertiary mt-1.5 leading-4">
                                  AI 将根据您在【账号资产】中圈定的可选模板范围，结合本次的营销目标自动路由并应用最优框架。
                                </p>"""

code = code.replace(old_dropdown, new_dropdown)

with open("src/components/merchant/CreateProject/StructuredPlanCreationFlow.tsx", "w") as f:
    f.write(code)

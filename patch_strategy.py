import re

with open("src/components/merchant/ProjectCenter.tsx", "r") as f:
    code = f.read()

# Change button
code = code.replace(
    '<button onClick={() => setShowStrategyCustomization(true)} className="rounded-lg bg-btn-main px-3 py-1.5 text-[13px] font-medium text-white hover:bg-btn-main-hover">\n                      专家定制\n                    </button>',
    '<button onClick={() => setShowStrategyCustomization(true)} className="rounded-lg bg-btn-main px-3 py-1.5 text-[13px] font-medium text-white hover:bg-btn-main-hover">\n                      编辑\n                    </button>'
)

# Remove '专家定制版本' text
old_text = '{activeStrategyVersion?.source === "expert_adjustment" ? "专家定制版本" : activeStrategyVersion?.source === "review_applied" ? "复盘建议应用版本" : "首次方案生成版本"}\n                        {activeStrategyVersion?.effectiveFrom ? ` · ${formatChineseDate(activeStrategyVersion.effectiveFrom, true)} 起生效` : ""}'

new_text = '{activeStrategyVersion?.source === "review_applied" ? "复盘建议应用版本 · " : activeStrategyVersion?.source === "initial" ? "首次方案生成版本 · " : ""}\n                        {activeStrategyVersion?.effectiveFrom ? `${formatChineseDate(activeStrategyVersion.effectiveFrom, true)} 起生效` : ""}'

code = code.replace(old_text, new_text)

with open("src/components/merchant/ProjectCenter.tsx", "w") as f:
    f.write(code)

with open("src/components/merchant/CreateProjectWorkstation.tsx", "r") as f:
    code = f.read()

# Replace solutionSummary
code = code.replace("solutionSummary: `${activeDraft.coreStrategy.contentLogic}｜站内承接：${settings.conversionGoal}｜目标关键词：${settings.targetKeywords || '未设置'}`,", "solutionSummary: `${activeDraft.coreStrategy.contentLogic}｜目标关键词：${settings.targetKeywords || '未设置'}`,")

# Replace publishFrequency
code = code.replace("publishFrequency: settings.publishFrequency,", "publishFrequency: '每天 1-2 篇',")

with open("src/components/merchant/CreateProjectWorkstation.tsx", "w") as f:
    f.write(code)

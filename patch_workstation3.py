import re

with open("src/components/merchant/CreateProjectWorkstation.tsx", "r") as f:
    code = f.read()

old_default = """    settings: PlanCreationSettings = {
      targetKeywords: '',
      conversionGoal: '收藏 / 关注',
      publishFrequency: '每天 1–2 篇',
      observationDays: 14,
      needMaterials: true,
      allowIndustryFallback: true
    }"""

new_default = """    settings: PlanCreationSettings = {
      targetKeywords: [],
      observationDays: 14,
      needMaterials: true,
      allowIndustryFallback: true
    }"""

code = code.replace(old_default, new_default)

with open("src/components/merchant/CreateProjectWorkstation.tsx", "w") as f:
    f.write(code)

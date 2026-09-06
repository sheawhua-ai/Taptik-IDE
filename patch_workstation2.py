with open("src/components/merchant/CreateProjectWorkstation.tsx", "r") as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if "conversionGoal: settings.conversionGoal" in line:
        continue
    if "frequency: settings.publishFrequency" in line:
        line = line.replace("frequency: settings.publishFrequency", "frequency: '每天 1–2 篇'")
    if "targetKeywords: settings.targetKeywords," in line:
        line = line.replace("targetKeywords: settings.targetKeywords,", "targetKeywords: settings.targetKeywords.join(','),")
    new_lines.append(line)

with open("src/components/merchant/CreateProjectWorkstation.tsx", "w") as f:
    f.writelines(new_lines)

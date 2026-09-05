import re

with open("src/utils/noteStatus.ts", "r") as f:
    code = f.read()

code = code.replace('| "发布识别中"\n', '')

# Modify getUnifiedBusinessStatus
code = re.sub(
    r'  // 4\. 发布识别中\n  if \(note\.publishStatus === "已发布" && !note\.publishLink && note\.resultStatus !== "已完成" && note\.resultStatus !== "观察中"\) \{\n    return "发布识别中";\n  \}',
    '',
    code
)

code = re.sub(
    r'  // 2\. 观察中\n  if \(note\.resultStatus === "观察中" \|\| \(note\.publishStatus === "已发布" && note\.publishLink && note\.resultStatus === "未开始观察"\)\) \{',
    r'  // 2. 观察中\n  if (note.resultStatus === "观察中" || (note.publishStatus === "已发布" && note.resultStatus !== "已完成")) {',
    code
)

code = re.sub(r'    case "发布识别中":\n', '', code)

with open("src/utils/noteStatus.ts", "w") as f:
    f.write(code)

with open("src/components/merchant/ProjectCenter.tsx", "r") as f:
    code = f.read()

# Replace any manual reference to "发布识别中"
code = code.replace('      if (statusFilter === "发布识别中" && uStatus !== "发布识别中") return false;\n', '')
code = code.replace('    detecting: allNotes.filter(n => getUnifiedBusinessStatus(n) === "发布识别中").length,\n', '')
code = code.replace('                        { label: "发布识别中", count: counts.detecting, filter: "发布识别中" },\n', '')

with open("src/components/merchant/ProjectCenter.tsx", "w") as f:
    f.write(code)

print("Fixed note status")

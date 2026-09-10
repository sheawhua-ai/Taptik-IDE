import re

with open("src/components/merchant/ProjectCenter.tsx", "r") as f:
    text = f.read()

text = text.replace(
    'const [projectFilterStatus, setProjectFilterStatus] = useState<"全部" | "进行中" | "已结束" | "已归档">("全部");',
    'const [projectFilterStatus, setProjectFilterStatus] = useState<"进行中" | "已结束">("进行中");'
)

text = text.replace(
    'if (projectFilterStatus !== "全部" && p.status !== projectFilterStatus) return false;',
    'if (projectFilterStatus === "进行中" && p.status !== "进行中" && p.status !== "准备中") return false;\n    if (projectFilterStatus === "已结束" && p.status !== "已结束") return false;'
)

text = text.replace(
    '{(["全部", "进行中", "已结束", "已归档"] as const).map((status) => (',
    '{(["进行中", "已结束"] as const).map((status) => ('
)

with open("src/components/merchant/ProjectCenter.tsx", "w") as f:
    f.write(text)

import re

with open("src/components/merchant/ProjectCenter.tsx", "r") as f:
    code = f.read()

code = code.replace(
    'const [projectFilterStatus, setProjectFilterStatus] = useState<"全部" | "运行中" | "准备中" | "已归档">("全部");',
    'const [projectFilterStatus, setProjectFilterStatus] = useState<"全部" | "进行中" | "已结束" | "已归档">("全部");'
)

code = code.replace(
    '{(["全部", "运行中", "准备中", "已归档"] as const).map((status) => (',
    '{(["全部", "进行中", "已结束", "已归档"] as const).map((status) => ('
)

# Update the filter logic
old_filter = """  const filteredProjects = scopedProjects.filter((p) => {
    if (projectSearchQuery && !p.name.toLowerCase().includes(projectSearchQuery.toLowerCase())) return false;
    if (projectFilterStatus === "运行中" && p.status !== "进行中") return false;
    if (projectFilterStatus === "准备中" && p.status !== "准备中") return false;
    if (projectFilterStatus === "已归档" && p.status !== "已结束") return false;
    return true;
  });"""
new_filter = """  const filteredProjects = scopedProjects.filter((p) => {
    if (projectSearchQuery && !p.name.toLowerCase().includes(projectSearchQuery.toLowerCase())) return false;
    if (projectFilterStatus !== "全部" && p.status !== projectFilterStatus) return false;
    return true;
  });"""
code = code.replace(old_filter, new_filter)

# Update getProjectLifecycleState
old_get_state = """  const getProjectLifecycleState = (project: Project) => {
    if (project.status === "已结束") return { label: "已归档", tone: "archived" as const };
    if (project.status === "准备中") return { label: "准备中", tone: "idle" as const };
    return { label: "运行中", tone: "running" as const };
  };"""
new_get_state = """  const getProjectLifecycleState = (project: Project) => {
    if (project.status === "已归档") return { label: "已归档", tone: "archived" as const };
    if (project.status === "已结束") return { label: "已结束", tone: "idle" as const };
    if (project.status === "准备中") return { label: "准备中", tone: "idle" as const };
    return { label: "进行中", tone: "running" as const };
  };"""
code = code.replace(old_get_state, new_get_state)

with open("src/components/merchant/ProjectCenter.tsx", "w") as f:
    f.write(code)

with open("src/components/rings/ExecutionResult.tsx", "r") as f:
    content = f.read()

content = content.replace("selectedTask.type", "selectedTask.moduleName")
content = content.replace("selectedTask.projects.join(\"、\")", "selectedTask.projectsDesc")
content = content.replace("selectedTask.title", "selectedTask.importantResult")
content = content.replace("selectedTask.aiRecommendation", "selectedTask.mainAction")
content = content.replace("selectedTask.aiReasoning", "selectedTask.aiWork")

with open("src/components/rings/ExecutionResult.tsx", "w") as f:
    f.write(content)

with open("src/components/rings/InteractionWorkbench.tsx", "r") as f:
    content = f.read()

content = content.replace("const [activeTab, setActiveTab] = useState<'private_msg' | 'comment' | 'intercept' | 'competitor' | 'risk'>('private_msg');",
"const [activeTab, setActiveTab] = useState<'private_msg' | 'comment' | 'intercept' | 'competitor' | 'risk'>('private_msg');\n  const [taskStatusView, setTaskStatusView] = useState<'quick' | 'action' | 'wait'>('action');")

with open("src/components/rings/InteractionWorkbench.tsx", "w") as f:
    f.write(content)

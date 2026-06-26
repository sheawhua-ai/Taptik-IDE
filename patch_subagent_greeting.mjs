import fs from 'fs';

let content = fs.readFileSync('src/components/SubagentChat.tsx', 'utf-8');

// Add state for dynamic greeting
content = content.replace(
  /const \[currentExpert, setCurrentExpert\] = useState<string>\(/,
  `const [customGreeting, setCustomGreeting] = useState<string | null>(null);\n  const [currentExpert, setCurrentExpert] = useState<string>(`
);

// Add event listener for custom-greeting
content = content.replace(
  /const handleOpenExpert = \(e: any\) => \{/,
  `const handleCustomGreeting = (e: any) => {
    if (e.detail?.greeting) {
      setCustomGreeting(e.detail.greeting);
    }
    if (e.detail?.expert) {
      setCurrentExpert(e.detail.expert);
    }
  };
  useEffect(() => {
    window.addEventListener('set-custom-greeting', handleCustomGreeting);
    return () => window.removeEventListener('set-custom-greeting', handleCustomGreeting);
  }, []);
  
  const handleOpenExpert = (e: any) => {`
);

// Update useEffect for messages initialization
content = content.replace(
  /const greetings: Record<string, string> = \{[\s\S]*?\};\n\n\s*setMessages\(\[\n\s*\{\n\s*id: "1",\n\s*role: "agent",\n\s*content: greetings\[moduleId\] \|\| "你好，我是你的 AI 搭档。",/,
  `const greetings: Record<string, string> = {
      strategy: \`我已经完成这个商家的今日巡航。\\n\\n当前最值得优先处理的是「幼犬换粮避坑」方向。它适合用自然流内容先测试，不建议一开始直接做硬广投流。\\n\\n你可以直接说：\\n“开始操盘”\\n“继续深挖低粉爆款”\\n“换成专业号方向”\\n“只用 A01 和 A02”\`,
      matrix: \`矩阵调度数字员工已就绪。正在为您监控自有 KOS 账号与外部素人发文状态。您可以让我下发任务或排查账号异常。\`,
      content: \`内容助手已就绪。正在为您解析最近的爆款笔记逻辑。您可以下达改写、生成或润色内容指令。\`,
      execution: \`编排中心数字员工在线。正在管理您的自动化任务流。需要我调整执行顺序或增加监控节点吗？\`,
      interaction: \`触达转化助手已连接。正在分析意图私信。您可以让我自动回复或导出高潜线索。\`,
      metrics: \`数据巡航系统正在运行。您可以让我分析今日流量分布、诊断异常掉粉，或生成业务报告。\`,
    };

    setMessages([
      {
        id: "1",
        role: "agent",
        content: customGreeting || greetings[moduleId] || "你好，我是你的 AI 搭档。",`
);

// Also add a listener when customGreeting changes to re-init messages if it's empty
content = content.replace(
  /\}, \[moduleId\]\); \/\/ Only reset when changing modules/,
  `}, [moduleId, customGreeting]); // Only reset when changing modules`
);

fs.writeFileSync('src/components/SubagentChat.tsx', content);

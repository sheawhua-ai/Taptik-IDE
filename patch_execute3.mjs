import fs from 'fs';

let content = fs.readFileSync('src/components/Workbench.tsx', 'utf-8');

// The file is corrupted between handleExecute and return (. Let's find handleExecute and the end of the component.
const startIdx = content.indexOf('const handleExecute =');
const endIdx = content.indexOf('return (', startIdx);

const correctImplementation = `const handleExecute = (customQuery?: string) => {
    let finalQuery = customQuery || query;
    
    if (selectedShortcut && !customQuery) {
      if (selectedShortcut.action === '') {
        finalQuery = \`[\${selectedShortcut.name}] \${finalQuery}\`.trim();
      } else if (!finalQuery.includes(selectedShortcut.name) && !finalQuery.includes(selectedShortcut.action)) {
        finalQuery = \`[\${selectedShortcut.name}] \${finalQuery}\`.trim();
      }
    }
    
    if (!finalQuery.trim()) {
      if (selectedShortcut && selectedShortcut.action === '') {
        finalQuery = \`执行技能：\${selectedShortcut.name}\`;
      } else {
        return;
      }
    }

    setSelectedShortcut(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    const userMsgId = Math.random().toString(36).substring(2);
    const agentMsgId = Math.random().toString(36).substring(2);

    const newMsg: ChatMessage = { id: userMsgId, role: 'user', content: finalQuery, time: '刚才' };
    setMessages(prev => [...prev, newMsg]);
    setQuery('');
    
    const agentMsg: ChatMessage = {
      id: agentMsgId,
      role: 'agent',
      content: '',
      time: '刚才',
      isThinking: true,
      thoughts: []
    };
    
    setMessages(prev => [...prev, agentMsg]);
    setIsProcessing(true);

    if (isNewMerchant) {
      let step = 0;
      const stages = [
        { type: 'think', content: '正在分析您的输入并提取品牌语义特征...' }
      ] as any[];

      const interval = setInterval(() => {
        if (step < stages.length) {
          const currentStep = step;
          const stage = stages[currentStep];
          setMessages(prev => prev.map(m => {
            if (m.id === agentMsgId) {
              const newThoughts = [...(m.thoughts || []), { id: \`t\${currentStep}\`, ...stage }];
              return { ...m, thoughts: newThoughts };
            }
            return m;
          }));
          step++;
        } else {
          clearInterval(interval);
          if (onboardingStep === 0) {
            setTimeout(() => setOnboardingData((prev: any) => ({ ...prev, industry: "美妆护肤", audience: "18-25岁 年轻女大学生" })), 0);
            setMessages(prev => prev.map(m => m.id === agentMsgId ? {
              ...m,
              isThinking: false,
              content: '✅ 收到！看来我们的核心是**“敏感肌可用卸妆油”**，主要受众群是**年轻女大学生**。\\n\\n那么，在文案风格上，您希望我们是“专业严谨的护肤专家”，还是“贴心分享的闺蜜种草”？是否有绝对不能碰的竞品或防坑雷区（比如不要提平替）？'
            } : m));
            setOnboardingStep(1);
          } else if (onboardingStep === 1) {
            setTimeout(() => setOnboardingData((prev: any) => ({ ...prev, traps: "避免拉踩、不提平替", tone: "闺蜜种草，亲切活泼" })), 0);
            setMessages(prev => prev.map(m => m.id === agentMsgId ? {
              ...m,
              isThinking: false,
              content: '✅ 非常清晰！已经收到您的防坑雷区与品牌声调预设，并同步为全域智体的底层系统护栏。\\n\\n🎉 **您的品牌画像基座已初始完成！**\\n\\n现在您可以解锁左侧的「项目工作流」进行实操，或者点击我下方的按钮，一键生成第一季度的打法节奏。'
            } : m));
            setOnboardingStep(3);
          } else {
            setMessages(prev => prev.map(m => m.id === agentMsgId ? {
              ...m,
              isThinking: false,
              content: '基座已建设完毕，正为您执行具体的工作指令。'
            } : m));
            setTimeout(() => setActiveNav('workflow'), 1000);
          }
          setIsProcessing(false);
        }
      }, 1000);
      return;
    }

    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === agentMsgId ? {
        ...m,
        isThinking: false,
        card: {
          type: 'confirmation',
          goal: \`为您执行：\${finalQuery}\`,
          tools: ['策略专家：搜索蓝海词和低粉爆款', '内容专家：生成真人感笔记', '数据专家：参考历史账号表现'],
          destinations: ['宠粮新客运营项目', '内容车间草稿区'],
          wontDo: ['自动发布', '自动修改排期'],
          recommendedDestination: '写入「宠粮新客运营」项目，并生成内容任务',
          cmd: finalQuery
        }
      } : m));
      setIsProcessing(false);
    }, 800);
  };

  `;
  
content = content.substring(0, startIdx) + correctImplementation + content.substring(endIdx);
fs.writeFileSync('src/components/Workbench.tsx', content);

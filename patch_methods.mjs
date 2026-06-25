import fs from 'fs';

let content = fs.readFileSync('src/components/Workbench.tsx', 'utf-8');

const regex = /const handleExecuteSuggestion = \([\s\S]*?\}, 7000\);\n  };/;

const newMethods = `const handleExecuteSuggestion = (suggestion: any) => {
    const userMsgId = Math.random().toString(36).substring(2);
    const agentMsgId = Math.random().toString(36).substring(2);
    
    const newMsg: ChatMessage = { id: userMsgId, role: 'user', content: suggestion.cmd, time: '刚才' };
    setMessages(prev => [...prev, newMsg]);
    
    const agentMsg: ChatMessage = {
      id: agentMsgId,
      role: 'agent',
      content: '',
      time: '刚才',
      isThinking: true
    };
    
    setTimeout(() => {
      setMessages(prev => [...prev, agentMsg]);
      setTimeout(() => {
        setMessages(prev => prev.map(m => m.id === agentMsgId ? { 
          ...m, 
          isThinking: false, 
          card: {
            type: 'confirmation',
            goal: \`为「商家 A：宠物食品组」寻找本周可执行的蓝海内容机会，并生成一批自然流笔记。\`,
            tools: ['策略专家：搜索蓝海词和低粉爆款', '内容专家：生成真人感笔记', '数据专家：参考历史账号表现', '知识库：调用品牌卖点和禁忌词'],
            destinations: ['宠粮新客运营项目', '内容车间草稿区', '项目经验库'],
            wontDo: ['不会自动发布', '不会自动通知客户', '不会自动修改排期'],
            recommendedDestination: '写入「宠粮新客运营」项目，并生成内容任务',
            cmd: suggestion.cmd
          } 
        } : m));
      }, 800);
    }, 400);
  };

  const handleToggleProgress = (msgId: string) => {
    setMessages(prev => prev.map(m => {
      if (m.id === msgId && m.card && m.card.type === 'progress') {
        return { ...m, card: { ...m.card, isExpanded: !m.card.isExpanded } };
      }
      return m;
    }));
  };

  const handleConfirmExecute = (msgId: string, cmd: string) => {
    setMessages(prev => prev.map(m => {
      if (m.id === msgId) {
        return {
          ...m,
          card: {
            type: 'progress',
            currentStep: '正在读取商家画像...',
            steps: [
              { title: '正在读取商家画像', status: 'active' },
              { title: '正在调用品牌知识库', status: 'pending' },
              { title: '正在搜索低粉爆款样本', status: 'pending' },
              { title: '正在分析账号历史表现', status: 'pending' },
              { title: '正在生成选题包', status: 'pending' },
              { title: '正在准备内容草稿', status: 'pending' }
            ],
            isExpanded: true
          }
        };
      }
      return m;
    }));

    const stepDelays = [1000, 2000, 3000, 4000, 5000, 6000];
    stepDelays.forEach((delay, index) => {
      setTimeout(() => {
        setMessages(prev => prev.map(m => {
          if (m.id === msgId && m.card && m.card.type === 'progress') {
            const newSteps = [...m.card.steps!];
            if (index > 0) newSteps[index - 1].status = 'completed';
            newSteps[index].status = 'active';
            return {
              ...m,
              card: {
                ...m.card,
                currentStep: newSteps[index].title,
                steps: newSteps
              }
            };
          }
          return m;
        }));
      }, delay);
    });

    setTimeout(() => {
      setMessages(prev => prev.map(m => {
        if (m.id === msgId) {
          return {
            ...m,
            card: {
              type: 'result',
              title: '已完成蓝海机会分析',
              items: [
                { title: '幼犬换粮避坑', desc: '自然流机会强，适合素人避坑口吻' },
                { title: '国产冻干平替测评', desc: '适合测评号，适合作为第二优先级' },
                { title: '多猫家庭喂养清单', desc: '搜索热度稳定，适合长期内容池' }
              ],
              recommendation: '我建议先启动「幼犬换粮避坑」7 天搜索卡位项目。',
              actions: ['开始操盘', '继续深挖', '保存到项目']
            }
          };
        }
        return m;
      }));
    }, 7000);
  };`;

content = content.replace(regex, newMethods);
fs.writeFileSync('src/components/Workbench.tsx', content);

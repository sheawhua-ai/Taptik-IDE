import fs from 'fs';

let content = fs.readFileSync('src/components/rings/ExecutionPreview.tsx', 'utf-8');

const replacement = `const getSubAgentContent = (type: string) => {
    switch (type) {
      case "direction":
        return {
          title: "调整主方向",
          subtitle: "已基于当前商家画像、内容目标和账号池生成 3 个替代方案",
          alternatives: [
            { id: "A", name: "保持幼犬换粮避坑", desc: "最适合当前自然流起量" },
            { id: "B", name: "切到肠胃敏感测评", desc: "更容易接专业号内容，但真人感略弱" },
            { id: "C", name: "切到新手养狗避坑", desc: "覆盖面更大，但搜索卡位更分散" }
          ]
        };
      case "group":
        return {
          title: "调整内容分组",
          subtitle: "已基于当前商家画像、内容目标和账号池生成 3 个替代方案",
          alternatives: [
            { id: "A", name: "素人 8 / 专业 4", desc: "先拿自然流测试，再用专业号补充信任背书" },
            { id: "B", name: "素人 10 / 专业 2", desc: "优先追求自然流起量，减少专业号占比" },
            { id: "C", name: "仅素人组", desc: "当前阶段只做低成本自然流测试，不强调官方信任" }
          ]
        };
      case "dist":
        return {
          title: "调整分发方式",
          subtitle: "已基于当前商家画像、内容目标和账号池生成 3 个替代方案",
          alternatives: [
            { id: "A", name: "自有号定向承接 + 外部池", desc: "自有号可精确控制内容匹配，外部号随机扩散" },
            { id: "B", name: "仅用自有号", desc: "所有内容都将绑定自有号。更可控，但覆盖范围变小" },
            { id: "C", name: "先自有号，次轮外部", desc: "分阶段放量，风险更低" }
          ]
        };
      case "sync":
        return {
          title: "调整协同方式",
          subtitle: "已基于当前商家画像、内容目标和账号池生成 3 个替代方案",
          alternatives: [
            { id: "A", name: "待审核队列 + 同步飞书", desc: "确保内容先审后发，团队成员可以在飞书同步跟进" },
            { id: "B", name: "进入审核但不同步飞书", desc: "减少打扰" },
            { id: "C", name: "只生成不入队", desc: "供内部提前审阅" }
          ]
        };
      default:
        return null;
    }
  };

  const handleCollaborate = (adjustType: string) => {
    const content = getSubAgentContent(adjustType);
    if (!content) return;

    window.dispatchEvent(
      new CustomEvent("open-expert", {
        detail: {
          expert: "操盘副手",
          alternativesData: content,
        },
      }),
    );
  };`;

content = content.replace(
  /const getSubAgentContent = \(type: string\) => \{[\s\S]*?\}\s*,\s*\)\s*;\s*\};/,
  replacement
);

content = content.replace(/<Settings2 size=\{14\} \/> 协同调整/g, '<Settings2 size={14} /> 调整');
content = content.replace(/<Sparkles size=\{14\} className="text-indigo-500" \/> 协同调整/g, '<Sparkles size={14} className="text-indigo-500" /> 调整');

fs.writeFileSync('src/components/rings/ExecutionPreview.tsx', content);

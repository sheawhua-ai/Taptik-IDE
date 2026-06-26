import fs from 'fs';

let content = fs.readFileSync('src/components/rings/ExecutionPreview.tsx', 'utf-8');

const replacement = `const getSubAgentContent = (type: string) => {
    switch (type) {
      case "direction":
        return {
          title: "调整主方向",
          subtitle: "已基于当前商家画像、内容目标和账号池生成 3 个替代方案",
          alternatives: [
            { id: "A", name: "软便过渡期清单", desc: "更适合自然流" },
            { id: "B", name: "换粮失败案例复盘", desc: "更容易接专业号内容，话题更具冲突感" },
            { id: "C", name: "新手养狗避坑", desc: "覆盖面更大，但搜索卡位更分散" }
          ]
        };
      case "group":
        return {
          title: "调整内容分组",
          subtitle: "已基于当前商家画像、内容目标和账号池生成 3 个替代方案",
          alternatives: [
            { id: "A", name: "素人 10 / 专业 2", desc: "优先追求自然流起量，减少专业号占比" },
            { id: "B", name: "素人 6 / 专业 6", desc: "品牌信任要求更高，想更快建立官方背书" },
            { id: "C", name: "仅素人组", desc: "当前阶段只做低成本自然流测试，不强调官方信任" }
          ]
        };
      case "dist":
        return {
          title: "调整分发方式",
          subtitle: "已基于当前商家画像、内容目标和账号池生成 3 个替代方案",
          alternatives: [
            { id: "A", name: "仅用自有号", desc: "所有内容都将绑定自有号。更可控，但覆盖范围变小" },
            { id: "B", name: "先自有号，次轮外部", desc: "分阶段放量，风险更低" },
            { id: "C", name: "外部池只允许领取素人口吻内容", desc: "精细化管控口吻" }
          ]
        };
      case "sync":
        return {
          title: "调整协同方式",
          subtitle: "已基于当前商家画像、内容目标和账号池生成 3 个替代方案",
          alternatives: [
            { id: "A", name: "进入审核但不同步飞书", desc: "减少打扰" },
            { id: "B", name: "只生成不入队", desc: "供内部提前审阅" },
            { id: "C", name: "只同步内部，不同步客户群", desc: "内部确认优先" }
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
          alternativesData: { ...content, adjustType },
        },
      }),
    );
  };`;

content = content.replace(
  /const getSubAgentContent = \(type: string\) => \{[\s\S]*?\}\s*,\s*\)\s*;\s*\};/,
  replacement
);

content = content.replace(/<button className="px-4 py-1\.5 bg-neutral-900 text-white text-\[12px\] font-medium rounded-lg shadow-sm hover:bg-neutral-800 transition-colors">\s*接受\s*<\/button>/g, '<div className="px-4 py-1.5 bg-neutral-100 text-neutral-500 text-[12px] font-medium rounded-lg">当前默认</div>');

fs.writeFileSync('src/components/rings/ExecutionPreview.tsx', content);

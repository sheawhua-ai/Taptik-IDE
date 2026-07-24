import fs from 'fs';
let content = fs.readFileSync('src/components/merchant/ProjectCenter.tsx', 'utf-8');

const target = `  const [drawerType, setDrawerType] = useState<string | null>(null); // confirm_strategy, confirm_publish, handle_anomaly, pause_project, etc.
  const [aiChatInput, setAiChatInput] = useState("");`;

const replacement = `  const [drawerType, setDrawerType] = useState<string | null>(null); // confirm_strategy, confirm_publish, handle_anomaly, pause_project, etc.
  const [aiChatInput, setAiChatInput] = useState("");
  
  // Create Project States
  const [createProjectStep, setCreateProjectStep] = useState(1);
  const [createStrategyType, setCreateStrategyType] = useState<"auto" | "history">("auto");
  const [createKbStatus, setCreateKbStatus] = useState<"idle" | "checking" | "missing" | "ok">("idle");
  const [createGeneratedStrategy, setCreateGeneratedStrategy] = useState("1. 全网痛点洞察：锁定“幼犬软便”、“换粮过渡期”等核心搜索词。\\n2. 达人矩阵策略：30位母婴萌宠KOC真实开箱测评。\\n3. 店长号人设：专业育宠师身份，建立信任。\\n4. 私域承接：企微社群发放试吃装优惠券，提升复购。");`;

content = content.replace(target, replacement);

fs.writeFileSync('src/components/merchant/ProjectCenter.tsx', content);

import fs from 'fs';

let content = fs.readFileSync('src/components/merchant/ProjectCenter.tsx', 'utf-8');

const updatedHandler = `
  const handleCardPrimaryAction = (proj: any) => {
    setSelectedProjectId(proj.id);
    
    if (proj.recommendedAction === "confirm_strategy") {
      setViewState("wizard");
      setWizardStep(2);
    } else if (proj.recommendedAction === "confirm_publish") {
      setViewState("detail");
      setDetailTab("总览");
      setShowLinkMethodModal(true);
    } else if (proj.recommendedAction === "view_ai_review") {
      setViewState("detail");
      setDetailTab("总览");
      alert("带入项目上下文，打开AI复盘面板");
    } else if (proj.recommendedAction === "handle_anomaly") {
      setViewState("detail");
      setDetailTab("发布与互动");
    } else if (proj.recommendedAction === "view_archive") {
      setViewState("detail");
      setDetailTab("总览");
    } else if (proj.recommendedAction === "view_resume_conditions") {
      setViewState("detail");
      setDetailTab("总览");
      alert("打开暂停恢复条件检查面板");
    } else {
      setViewState("detail");
      setDetailTab("总览");
    }
  };
`;

content = content.replace(/const handleCardPrimaryAction = \(\s*proj\s*:\s*any\s*\)\s*=>\s*\{[\s\S]*?\};\n/, updatedHandler + '\n');
fs.writeFileSync('src/components/merchant/ProjectCenter.tsx', content);

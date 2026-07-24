import fs from 'fs';

let content = fs.readFileSync('src/components/merchant/ProjectCenter.tsx', 'utf-8');

const replacement = `
  const handleCardClick = (proj: any) => {
    setSelectedProjectId(proj.id);
    if (proj.status === "立项草案") {
      setViewState("wizard");
      setWizardStep(2);
    } else {
      setViewState("detail");
      setDetailTab("总览");
    }
  };
`;

content = content.replace('  const handleCardPrimaryAction =', replacement + '\n  const handleCardPrimaryAction =');
content = content.replace('onClick={() => handleCardPrimaryAction(proj)}', 'onClick={() => handleCardClick(proj)}');

fs.writeFileSync('src/components/merchant/ProjectCenter.tsx', content);

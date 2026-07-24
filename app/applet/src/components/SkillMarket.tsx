import React from 'react';
import { ExpertSkillCenter } from './expert-skills/ExpertSkillCenter';

interface SkillMarketProps {
  creatingSkill?: boolean;
  setCreatingSkill?: (val: boolean) => void;
  skillMarketTab?: string;
  setSkillMarketTab?: (val: string) => void;
  selectedSkill?: any;
  setSelectedSkill?: (val: any) => void;
}

export const SkillMarket: React.FC<SkillMarketProps> = ({
  skillMarketTab = 'agent'
}) => {
  const initialTab =
    skillMarketTab === 'my'
      ? 'my_capabilities'
      : skillMarketTab === 'skill'
      ? 'skills'
      : 'experts';

  return <ExpertSkillCenter initialTab={initialTab} />;
};

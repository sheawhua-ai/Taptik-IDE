import fs from 'fs';

let content = fs.readFileSync('src/components/Workbench.tsx', 'utf-8');

content = content.replace(
  "import { useOnboarding } from '../App';",
  ""
);

content = content.replace(
  "interface WorkbenchProps {\\n  setActiveNav: (nav: string) => void;\\n  isNewMerchant: boolean;\\n  setOnboardingData: (data: any) => void;\\n  setWorkflowTab: (tab: any) => void;\\n  messages: ChatMessage[];\\n  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;\\n}",
  \`interface WorkbenchProps {
  setActiveNav: (nav: string) => void;
  setDataSubNav: (nav: string) => void;
  isNewMerchant?: boolean;
  setOnboardingData?: (data: any) => void;
  onboardingData?: any;
  onboardingStep: number;
  setOnboardingStep: (step: number) => void;
  setWorkflowTab?: (tab: any) => void;
  messages?: ChatMessage[];
  setMessages?: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}\`
);

content = content.replace(
  "export const Workbench: React.FC<WorkbenchProps> = ({\\n  setActiveNav, isNewMerchant, setOnboardingData, setWorkflowTab, messages, setMessages\\n}) => {\\n  const { onboardingStep, setOnboardingStep } = useOnboarding();",
  \`export const Workbench: React.FC<WorkbenchProps> = ({
  setActiveNav, setDataSubNav, isNewMerchant, setOnboardingData, onboardingData, onboardingStep, setOnboardingStep, setWorkflowTab, messages = [], setMessages = () => {}
}) => {\`
);

fs.writeFileSync('src/components/Workbench.tsx', content);

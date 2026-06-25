import fs from 'fs';

let content = fs.readFileSync('src/components/Workbench.tsx', 'utf-8');

const oldType = `type ChatMessage = {
 id: string;
 role: 'user' | 'agent' | 'system';
 content: string;
 time: string;
 thoughts?: AgentThought[];
 isThinking?: boolean;
 card?: {
   type: 'confirmation';
   title: string;
   desc: string;
   actionLabel: string;
   cmd: string;
 };
};`;

const newType = `type ChatMessage = {
 id: string;
 role: 'user' | 'agent' | 'system';
 content: string;
 time: string;
 thoughts?: AgentThought[];
 isThinking?: boolean;
 card?: {
    type: 'confirmation' | 'progress' | 'result';
    
    // For confirmation
    goal?: string;
    tools?: string[];
    destinations?: string[];
    wontDo?: string[];
    recommendedDestination?: string;
    
    // For progress
    currentStep?: string;
    steps?: { title: string, status: 'pending' | 'active' | 'completed' }[];
    isExpanded?: boolean;

    // For result
    title?: string;
    items?: { title: string, desc: string }[];
    recommendation?: string;
    actions?: string[];
    
    // Common
    cmd?: string;
 };
};`;

content = content.replace(oldType, newType);
fs.writeFileSync('src/components/Workbench.tsx', content);

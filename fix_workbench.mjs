import fs from 'fs';

let content = fs.readFileSync('src/components/Workbench.tsx', 'utf-8');

const missingHeader = `import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, Send, Image as ImageIcon, FileText, CheckCircle2, ChevronRight, Hash, 
  Target, Sparkles, X, ChevronDown, ListFilter, Play, ArrowRight, Activity, Zap, MessageSquare, Plus, Lock, 
  Copy, Settings, Palette, HelpCircle, ArrowUpCircle, LogOut, Bell, Link2, Gift, UserCircle, Database, ShieldCheck, Users, ShieldAlert, Paperclip, ArrowDownRight, PieChart, Lightbulb
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useOnboarding } from '../App';

export interface ChatMessage {
  id: string;
  role: 'user' | 'agent';
  content: string;
  time: string;
  isThinking?: boolean;
  thoughts?: { id: string; type: string; content: string }[];
  card?: any;
}

interface WorkbenchProps {
  setActiveNav: (nav: string) => void;
  isNewMerchant: boolean;
  setOnboardingData: (data: any) => void;
  setWorkflowTab: (tab: any) => void;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

const QUICK_SHORTCUTS = [
  { id: '1', name: '文档处理', action: '帮我总结和处理这份文档。' },
  { id: '2', name: '金融服务', action: '提供金融分析和建议。' },
  { id: '3', name: '高考我帮你', action: '解答高考相关问题并提供志愿建议。' },
  { id: '4', name: '数据分析及可视化', action: '帮我分析这些数据并生成可视化图表。' },
  { id: '5', name: '深度研究', action: '对这个主题进行深入的学术和市场研究。' }
];

export const Workbench: React.FC<WorkbenchProps> = ({
  setActiveNav, isNewMerchant, setOnboardingData, setWorkflowTab, messages, setMessages
}) => {
  const { onboardingStep, setOnboardingStep } = useOnboarding();
  const [query, setQuery] = useState('');
  const [selectedShortcut, setSelectedShortcut] = useState<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEscortOpen, setIsEscortOpen] = useState(false);
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = Math.min(scrollHeight, 300) + 'px';
    }
  }, [query, selectedShortcut]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

`;

// First, check if it already has imports
if (!content.startsWith('import ')) {
  content = missingHeader + content;
}

// Remove trailing `};` 
content = content.replace(/\\s*\\};\\s*$/, '\\n');

fs.writeFileSync('src/components/Workbench.tsx', content);

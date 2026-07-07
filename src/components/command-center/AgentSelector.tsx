import React, { useState } from 'react';
import { Target, Sparkles, LineChart, MessageSquare, Users, Bot, Search, Check, ShoppingCart, X } from 'lucide-react';
import { motion } from 'motion/react';

export interface Agent {
 id: string;
 name: string;
 desc: string;
 icon: any;
 iconBg?: string;
 iconColor?: string;
}

export const AVAILABLE_AGENTS: Agent[] = [
 { id: 'core', name: 'Taptik 智能大脑', desc: '全局业务管家，可调度所有子节点智能体', icon: Bot, iconBg: 'bg-neutral-900', iconColor: 'text-white' },
 { id: 'strategy', name: '策略专家', desc: '负责蓝海挖掘、竞品分析与选题规划', icon: Target, iconBg: 'bg-primary-50', iconColor: 'text-primary-500' },
 { id: 'content', name: '全域内容打法团队', desc: '基于热点批量合成笔记，矩阵自动分发', icon: Sparkles, iconBg: 'bg-primary-50', iconColor: 'text-primary-500' },
 { id: 'interaction', name: '客资转化智能体', desc: '监控全域消息，执行意向分级与转化 SOP', icon: MessageSquare, iconBg: 'bg-primary-50', iconColor: 'text-primary-500' },
];

interface AgentSelectorProps {
 isOpen: boolean;
 onClose: () => void;
 activeAgentId: string;
 onSelectAgent: (agentId: string) => void;
 onOpenMarket: () => void;
}

export const AgentSelector: React.FC<AgentSelectorProps> = ({ isOpen, onClose, activeAgentId, onSelectAgent, onOpenMarket }) => {
 if (!isOpen) return null;

 return (
 <motion.div 
 initial={{ opacity: 0, y: 10, scale: 0.98 }}
 animate={{ opacity: 1, y: 0, scale: 1 }}
 exit={{ opacity: 0, y: 10, scale: 0.98 }}
 className="absolute bottom-full left-0 mb-4 w-[320px] bg-white rounded-2xl shadow-2xl border border-neutral-100 flex flex-col z-50 overflow-hidden"
 >
 <div className="p-3 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50 shrink-0">
 <h3 className="text-[12px] font-semibold text-neutral-900 ml-1">切换执行模型</h3>
 <button onClick={onClose} className="p-1 hover:bg-neutral-200 rounded-lg text-neutral-400 transition-colors">
 <X size={14} />
 </button>
 </div>
 
 <div className="flex-1 overflow-y-auto w-full max-h-[300px] custom-scrollbar p-2 space-y-1">
 {AVAILABLE_AGENTS.map(agent => (
 <button 
 key={agent.id}
 onClick={() => { onSelectAgent(agent.id); onClose(); }}
 className={`w-full text-left px-3 py-2.5 rounded-xl transition-all group flex items-center justify-between ${activeAgentId === agent.id ? 'bg-primary-50/50 text-primary-600' : 'bg-transparent hover:bg-neutral-50 text-neutral-700'}`}
 >
 <div className="flex items-center gap-3">
 <div className={`w-6 h-6 rounded-md ${agent.iconBg} flex items-center justify-center ${agent.iconColor} shrink-0`}>
 <agent.icon size={12} />
 </div>
 <span className="text-[13px] ">{agent.name}</span>
 </div>
 {activeAgentId === agent.id && <Check size={14} className="text-primary-500" />}
 </button>
 ))}
 </div>

 <div className="p-2 border-t border-neutral-100 bg-neutral-50/50">
 <button 
 onClick={() => { onOpenMarket(); onClose(); }} 
 className="w-full py-2.5 rounded-xl text-[12px] text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200/50 transition-colors flex items-center justify-center gap-2"
 >
 <ShoppingCart size={14} /> 前往专家与技能市场
 </button>
 </div>
 </motion.div>
 );
};


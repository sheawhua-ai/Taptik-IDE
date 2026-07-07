import React, { useState } from 'react';
import { 
  Activity, ArrowUp, MessageSquare, Target, 
  LineChart, Sparkles, AlertTriangle, ShieldAlert,
  Flame, Image, X, ArrowRight,
  Send, CheckCircle2, Zap, Save, BrainCircuit, FileText, Video,
  TrendingUp, Download, Eye, MousePointerClick
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { DataCenter } from '../DataCenter';

interface EventItem {
  id: string;
  type: string;
  title: string;
  icon: any;
  color: string;
  bgColor: string;
  evidence: string;
  impact: string;
  aiSuggestion: string;
  actionText: string;
}

const MOCK_EVENTS: EventItem[] = [
  {
    id: 'e1',
    type: '爆文苗子',
    title: '幼犬挑食其实是你的锅',
    icon: Flame,
    color: 'text-rose-500',
    bgColor: 'bg-rose-50',
    evidence: '发布 3 小时互动率高于账号均值 2.4 倍，评论集中在“换粮软便”。',
    impact: '影响当前“幼犬换粮”项目',
    aiSuggestion: '建议追加 10 篇同方向变体，并沉淀为下一轮操盘建议。',
    actionText: '创建追加内容'
  },
  {
    id: 'e2',
    type: '素材表现优异',
    title: '实拍+大字报封面点击率创新高',
    icon: Image,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-50',
    evidence: '该素材组合点击率达 15%，比历史平均高 40%。',
    impact: '可大幅提升后续笔记点击率',
    aiSuggestion: '将此类封面加入优质素材库，并在接下来的项目中优先使用。',
    actionText: '标记为优质素材'
  },
  {
    id: 'e3',
    type: '高意向评论',
    title: '关于“冻干猫粮”的 2 条意向评论',
    icon: MessageSquare,
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-50',
    evidence: '评论包含明确购买意向：“求链接”、“怎么买”。',
    impact: '潜在转化线索',
    aiSuggestion: '建议立即回复，并推送到客服企微群跟进。',
    actionText: '指派客服跟进'
  }
];

export const ProjectReview: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'results' | 'attribution' | 'dashboards'>('results');
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  return (
    <div className="h-full flex flex-col bg-[#fafafa]">
      <div className="px-8 pt-8 pb-4 flex-shrink-0 flex justify-between items-end">
        <div>
          <h2 className="text-[20px] font-bold text-neutral-900 flex items-center gap-2">
            <Target className="text-primary-500" />
            复盘与归因
          </h2>
          <p className="text-[14px] text-neutral-500 mt-1">
            追踪项目的执行结果，深度分析数据归因与转化趋势。
          </p>
        </div>
        <div className="flex bg-neutral-100/80 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab('results')}
            className={`px-4 py-1.5 text-[13px] font-medium rounded-md transition-all ${activeTab === 'results' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
          >
            结果追踪
          </button>
          <button 
            onClick={() => setActiveTab('attribution')}
            className={`px-4 py-1.5 text-[13px] font-medium rounded-md transition-all ${activeTab === 'attribution' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
          >
            数据归因
          </button>
          <button 
            onClick={() => setActiveTab('dashboards')}
            className={`px-4 py-1.5 text-[13px] font-medium rounded-md transition-all ${activeTab === 'dashboards' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
          >
            数据大屏
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        {activeTab === 'results' && (
          <div className="flex-1 overflow-y-auto px-8 pb-12">
            <div className="space-y-6 pt-4">
              {/* KPI Cards */}
              <div className="grid grid-cols-4 gap-4">
              {[
                { title: '已发内容', value: '42', unit: '篇', icon: FileText, color: 'text-blue-500', trend: '+12' },
                { title: '累计曝光', value: '12.8', unit: 'w', icon: Eye, color: 'text-indigo-500', trend: '+2.1w' },
                { title: '互动总量', value: '3,492', unit: '次', icon: MousePointerClick, color: 'text-emerald-500', trend: '+450' },
                { title: '高意向线索', value: '18', unit: '条', icon: Target, color: 'text-rose-500', trend: '+5' },
              ].map((kpi, i) => (
                <div key={i} className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-8 h-8 rounded-full bg-neutral-50 flex items-center justify-center">
                      <kpi.icon size={16} className={kpi.color} />
                    </div>
                    <span className="text-[12px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                      <TrendingUp size={12} /> {kpi.trend}
                    </span>
                  </div>
                  <div className="text-[13px] font-medium text-neutral-500 mb-1">{kpi.title}</div>
                  <div className="text-[24px] font-bold text-neutral-900">
                    {kpi.value} <span className="text-[14px] text-neutral-400 font-normal">{kpi.unit}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* 智能 Findings */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-[15px] text-neutral-900 flex items-center gap-2">
                  <Sparkles size={16} className="text-indigo-500" />
                  智能业务发现
                </h3>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {MOCK_EVENTS.map(event => (
                  <div key={event.id} className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm hover:border-indigo-200 transition-colors flex flex-col">
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`w-6 h-6 rounded-md flex items-center justify-center ${event.bgColor} ${event.color}`}>
                        <event.icon size={14} />
                      </div>
                      <span className={`text-[12px] font-bold ${event.color}`}>{event.type}</span>
                    </div>
                    <h4 className="font-bold text-[15px] text-neutral-900 mb-2 leading-snug">{event.title}</h4>
                    <p className="text-[13px] text-neutral-500 mb-4 flex-1">{event.evidence}</p>
                    
                    <div className="bg-neutral-50 p-3 rounded-lg text-[12px] text-neutral-600 mb-4 border border-neutral-100">
                      <strong>系统建议：</strong>{event.aiSuggestion}
                    </div>
                    
                    <button className="w-full py-2 bg-neutral-900 text-white text-[13px] font-medium rounded-lg hover:bg-neutral-800 transition-colors">
                      {event.actionText}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Trends Chart Mock */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-[15px] text-neutral-900 mb-6 flex items-center gap-2">
                <LineChart size={16} className="text-neutral-500" />
                项目转化趋势
              </h3>
              <div className="h-48 border-b border-l border-neutral-200 relative flex items-end justify-between pt-4 px-2 pb-0">
                {/* SVG Chart Line Mock */}
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <path d="M0,90 Q10,80 20,85 T40,60 T60,50 T80,30 T100,10" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" />
                  <path d="M0,90 Q10,80 20,85 T40,60 T60,50 T80,30 T100,10 L100,100 L0,100 Z" fill="url(#grad)" />
                  <defs>
                    <linearGradient id="grad" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
                {/* Bars */}
                {[20, 35, 25, 45, 60, 50, 75, 90].map((h, i) => (
                  <div key={i} className="w-8 flex flex-col items-center gap-2 z-10">
                    <div className="w-full bg-indigo-100 rounded-t-sm" style={{ height: `${h}%` }}>
                      <div className="w-full bg-indigo-500 rounded-t-sm transition-all" style={{ height: `${h * 0.7}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 px-2 text-[11px] text-neutral-400">
                <span>10/01</span>
                <span>10/02</span>
                <span>10/03</span>
                <span>10/04</span>
                <span>10/05</span>
                <span>10/06</span>
                <span>10/07</span>
                <span>今日</span>
              </div>
            </div>
            </div>
          </div>
        )}

        {activeTab === 'attribution' && (
          <div className="flex-1 overflow-hidden relative">
            <DataCenter dataSubNav="roi_attribution" setDataSubNav={() => {}} setActiveNav={() => {}} />
          </div>
        )}

        {activeTab === 'dashboards' && (
          <div className="flex-1 overflow-hidden relative">
            <DataCenter dataSubNav="dashboards" setDataSubNav={() => {}} setActiveNav={() => {}} />
          </div>
        )}
      </div>
    </div>
  );
};

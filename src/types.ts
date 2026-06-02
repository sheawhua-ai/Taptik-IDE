import React from 'react';

export interface ThoughtStep {
  id: string;
  status: string; // Wrapped business state (e.g., "⏳ 正在匹配运营方案...")
  log?: string;   // Technical details
  startTime: number;
  endTime?: number;
  meta?: {
    toolName?: string;
    description?: string;
  };
}

export interface DynamicContent {
  type: 'report' | 'card' | 'analysis' | 'chart' | 'custom_html';
  title?: string;
  data?: any;
  html?: string; // AI generated Tailwind HTML
}

export interface Message {
  id: string;
  role: 'user' | 'agent' | 'system';
  content: string | React.ReactNode;
  thoughts?: ThoughtStep[];
  dynamicContent?: DynamicContent;
  status?: 'thinking' | 'completed' | 'error';
  timestamp?: number;
}

export interface Project {
  id: string;
  name: string;
  initial: string;
  color: string;
  textColor: string;
  fileTree: any[];
  chatHistory: any[];
}

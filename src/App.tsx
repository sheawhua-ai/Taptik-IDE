import React, { useState } from 'react';
import { 
  Plus, History, Folder, Chrome, MessageSquare, Sparkles, Minus, Square, X,
  ChevronDown, Search, FolderOpen, Play, ChevronLeft, ChevronRight, RotateCw, Home, MoreVertical,
  Mic, Camera, Bot, Activity, TerminalSquare, AtSign, Box, Send, Database, Zap, LayoutTemplate, Monitor, FileText, LayoutGrid
} from 'lucide-react';
import { motion } from 'motion/react';

const BRAND = {
  primary: '#06b6d4' // Cyan color matching the reference image's active states
};

export default function App() {
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="flex flex-col w-full h-[100dvh] bg-[#0A0A0A] text-zinc-300 font-sans overflow-hidden">
      
      {/* 1. TOP BAR */}
      <div className="h-[40px] flex items-center justify-between border-b border-zinc-800 shrink-0 px-2 pl-3 bg-[#0a0a0a]">
        
        {/* Left Actions */}
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-emerald-900 border border-emerald-500 flex items-center justify-center text-white text-[10px] font-bold ring-2 ring-emerald-500/20">
            h
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 bg-[#1e1e1e] border border-zinc-700/50 hover:bg-zinc-800 text-[11px] font-bold text-white px-3 py-1.5 rounded-full transition-colors">
              New Workspace <Plus size={10} className="text-zinc-500 ml-1" />
            </button>
            <button className="text-zinc-500 hover:text-zinc-300">
              <Plus size={14} />
            </button>
          </div>
        </div>
        
        <div className="w-[1px] h-4 bg-zinc-800 mx-2"></div>

        {/* Center Tabs */}
        <div className="flex items-end h-[40px] flex-1 pl-4 gap-0.5">
           <div className="flex items-center gap-2 px-4 pb-2 pt-2 text-[12px] text-zinc-500 font-bold hover:bg-zinc-800/50 cursor-pointer rounded-t-lg transition-colors border-x border-transparent">
             <span className="w-2 h-2 rounded-full bg-zinc-600"></span> New Chat
           </div>
           <div className="flex items-center gap-2 px-4 pb-2 pt-2 text-[12px] text-zinc-500 font-bold hover:bg-zinc-800/50 cursor-pointer rounded-t-lg transition-colors border-x border-transparent">
             <span className="w-2 h-2 rounded-full bg-zinc-600"></span> New Chat
           </div>
           
           {/* Active Tab */}
           <div className="flex items-center gap-2 px-4 pb-2 pt-2.5 text-[12px] text-white font-bold bg-[#111111] rounded-t-lg cursor-default relative border-t border-x border-[#06b6d4] z-10 translate-y-[1px]">
             <span className="w-2 h-2 rounded-full" style={{ backgroundColor: BRAND.primary }}></span> New Chat
             {/* Hide bottom border using a pseudo element */}
             <div className="absolute -bottom-[2px] left-0 right-0 h-[3px] bg-[#111111]"></div>
           </div>
           <button className="px-3 pb-2 pt-2 text-zinc-500 hover:text-zinc-300 transition-colors">
             <Plus size={14} />
           </button>
        </div>

        {/* Right Nav Icons */}
        <div className="flex items-center gap-3.5 text-zinc-400">
          <History size={14} className="hover:text-zinc-200 cursor-pointer" />
          <Folder size={14} className="hover:text-zinc-200 cursor-pointer text-[#06b6d4]" />
          <Chrome size={14} className="hover:text-zinc-200 cursor-pointer" />
          <MessageSquare size={14} className="hover:text-zinc-200 cursor-pointer text-[#06b6d4]" />
          <Sparkles size={14} className="hover:text-zinc-200 cursor-pointer" />
          <div className="w-[1px] h-4 bg-zinc-700 mx-1"></div>
          <Minus size={14} className="cursor-pointer hover:text-white" />
          <Square size={11} className="cursor-pointer hover:text-white" />
          <X size={14} className="cursor-pointer hover:text-white" />
        </div>
      </div>

      {/* 2. MAIN LAYOUT FLEX */}
      <div className="flex-1 flex overflow-hidden min-h-0 bg-[#000000]">
        
        {/* A. Far Left Thin Sidebar */}
        <div className="w-[42px] flex flex-col items-center py-4 bg-[#0A0A0A] border-r border-[#1a1a1a] gap-5 text-zinc-500 shrink-0 select-none">
           <div className="w-5 h-5 rounded flex items-center justify-center border border-zinc-700 text-zinc-400 mb-2 cursor-pointer hover:bg-zinc-800">
             <FolderOpen size={12} />
           </div>
           <LayoutTemplate size={16} className="cursor-pointer hover:text-zinc-300" />
           <div className="w-5 border-b border-zinc-800 my-1"></div>
           <Folder size={16} className="text-amber-500 cursor-pointer" fill="currentColor" fillOpacity={0.2} />
           <Chrome size={16} className="text-blue-500 cursor-pointer" />
           <Database size={16} className="text-emerald-500 cursor-pointer" />
           <div className="w-5 border-b border-zinc-800 my-1"></div>
           <div className="text-[10px] scale-75 text-zinc-600 bg-zinc-900 rounded px-1 -my-2 tracking-widest border border-zinc-800">个人</div>
           <Monitor size={16} className="cursor-pointer hover:text-zinc-300 text-[#06b6d4]" />
           <FileText size={16} className="cursor-pointer hover:text-zinc-300" />
           <Box size={16} className="cursor-pointer hover:text-zinc-300" />
        </div>

        {/* B. File Explorer */}
        <div className="w-[280px] bg-[#111111] flex flex-col border-r border-zinc-800/80 shrink-0">
           <div className="px-3 py-2 border-b border-zinc-800 flex items-center justify-between text-zinc-400">
             <div className="flex items-center gap-3">
               <ChevronLeft size={16} className="cursor-pointer hover:text-white" />
               <ChevronRight size={16} className="cursor-pointer hover:text-white" />
               <ArrowUp size={16} className="cursor-pointer hover:text-white" />
               <span className="text-[13px] text-zinc-300 font-medium ml-1 flex items-center gap-1 cursor-pointer">
                 <ChevronDown size={14}/> 私域
               </span>
             </div>
             <div className="flex items-center gap-2">
               <LayoutGrid size={14} className="cursor-pointer hover:text-white" />
               <Search size={14} className="cursor-pointer hover:text-white" />
             </div>
           </div>
           <div className="flex text-[12px] font-bold text-zinc-400 border-b border-zinc-800">
              <div className="flex-1 py-2 px-3 border-b-[3px] border-[#06b6d4] text-[#06b6d4] flex items-center gap-2 bg-zinc-800/30">
                <Folder size={14}/> 私域
              </div>
              <div className="flex-1 py-1.5 px-3 hover:bg-zinc-800/50 cursor-pointer border-b-2 border-transparent">
                Des...
              </div>
           </div>
           
           <div className="flex-1 overflow-y-auto custom-scrollbar p-1">
              <div className="flex items-start gap-3 px-2 py-2.5 hover:bg-zinc-800/50 cursor-pointer rounded-lg bg-zinc-800/30">
                <Folder size={20} className="text-amber-500 mt-1" fill="currentColor" fillOpacity={0.8} />
                <div className="flex flex-col">
                  <div className="text-[13px] font-bold text-[#06b6d4] mb-0.5">日报周报月报</div>
                  <div className="text-[11px] text-zinc-500">4天前 17:20</div>
                </div>
              </div>
              
              {[
                { icon: Chrome, color: "text-blue-500", name: "五一活动选品方案_30款.html", sub: "今天 16:17 · 31.0 KB" },
                { icon: Database, color: "text-emerald-500", name: "私域部门月报计划.xlsx", sub: "02/02 11:00 · 94.6 KB" },
                { icon: Database, color: "text-emerald-500", name: "香港5000以下优势货盘表.xlsx", sub: "01/15 09:28 · 1.2 GB" },
                { icon: FileText, color: "text-rose-500", name: "徐华展开168x264mm双面2折包心折+展...", sub: "01/13 10:36 · 3.7 MB" },
                { icon: Box, color: "text-blue-400", name: "c5fbe4f680496772329c130ffb664dff.jpg", sub: "01/07 12:41 · 6.1 MB" },
                { icon: Database, color: "text-emerald-500", name: "国内部周报模板.xlsx", sub: "01/06 09:57 · 1.4 MB" },
                { icon: Database, color: "text-emerald-500", name: "2025年私域业绩.xlsx", sub: "01/04 12:04 · 2.9 MB" },
                { icon: FileText, color: "text-rose-500", name: "私域1月计划和执行 (12月30日私域会议) .pdf", sub: "2025/12/29 · 492.1 KB" }
              ].map((file, i) => (
                <div key={i} className="flex items-start gap-3 px-2 py-2.5 hover:bg-zinc-800/50 cursor-pointer rounded-lg">
                  <file.icon size={18} className={`${file.color} mt-1`} />
                  <div className="flex flex-col overflow-hidden">
                    <div className="text-[13px] text-zinc-300 truncate mb-0.5">{file.name}</div>
                    <div className="text-[11px] text-zinc-500">{file.sub}</div>
                  </div>
                </div>
              ))}
           </div>
           
           <div className="px-4 py-2 border-t border-zinc-800 text-[10px] text-zinc-500 flex justify-between bg-[#0a0a0a]">
             <span>41 个项目</span>
             <span>906.5 GB 可用  2 GB</span>
           </div>
        </div>

        {/* C. Middle Panel (Browser) */}
        <div className="flex-1 min-w-[300px] flex flex-col border-r border-[#1a1a1a] bg-[#1a1a1a] shrink-0 relative z-0">
          <div className="flex items-center bg-[#0a0a0a] h-[40px] px-2 gap-2 shrink-0 border-b border-zinc-800">
            <div className="flex items-center px-4 py-2 bg-[#1a1a1a] rounded-t-lg gap-2 text-zinc-200 text-[12px] w-48 relative border-t border-x border-[#06b6d4] translate-y-[1px]">
              <div className="w-3.5 h-3.5 rounded-full bg-white flex items-center justify-center p-[2px]">
                <div className="w-full h-full rounded-full border-[3px] border-blue-500 border-t-red-500 border-l-yellow-500 border-r-green-500"></div>
              </div>
              <span className="flex-1 truncate font-medium">Google</span>
              <X size={12} className="text-zinc-500 hover:text-white cursor-pointer" />
              <div className="absolute -bottom-[2px] left-0 right-0 h-[3px] bg-[#1a1a1a]"></div>
            </div>
            <Plus size={16} className="text-zinc-600 hover:text-white cursor-pointer" />
          </div>
          
          <div className="flex items-center gap-3 px-3 py-1.5 border-b border-zinc-800 bg-[#1a1a1a] shrink-0">
            <ChevronLeft size={16} className="text-zinc-500 cursor-pointer hover:text-white" />
            <ChevronRight size={16} className="text-zinc-600 cursor-pointer hover:text-white" />
            <RotateCw size={14} className="text-zinc-400 cursor-pointer hover:text-white" />
            <Home size={16} className="text-zinc-400 cursor-pointer hover:text-white" />
            <div className="flex-1 bg-[#111111] rounded-full h-7 flex items-center px-4 border border-zinc-800 text-[12px] text-zinc-300 justify-center">
              www.google.com
            </div>
            <MoreVertical size={16} className="text-zinc-400 cursor-pointer hover:text-white" />
            <X size={16} className="text-zinc-400 cursor-pointer hover:text-white" />
          </div>

          <div className="flex-1 flex flex-col items-center justify-center relative bg-[#1c1c1c]">
             {/* Top Links */}
             <div className="absolute top-4 right-6 flex items-center gap-5 text-[13px] text-zinc-300">
               <span className="cursor-pointer hover:underline">Gmail</span>
               <span className="cursor-pointer hover:underline">图片</span>
               <LayoutGrid size={18} className="cursor-pointer opacity-80 hover:opacity-100" />
               <button className="bg-blue-100/90 text-blue-900 font-bold px-6 py-1.5 rounded-full hover:bg-white transition-colors">登录</button>
             </div>
             
             {/* Google Logo Mock */}
             <div className="text-[76px] font-bold text-white tracking-tighter mb-8 font-sans flex items-center gap-1 select-none">
               <span>G</span>
               <span>o</span>
               <span>o</span>
               <span>g</span>
               <span>l</span>
               <span>e</span>
             </div>
             
             {/* Search Bar */}
             <div className="w-full max-w-[580px] h-[48px] bg-[#303030] rounded-full flex items-center px-5 border border-zinc-600 gap-4 shadow-lg focus-within:bg-[#404040]">
               <Plus size={22} className="text-zinc-400 font-light" />
               <div className="flex-1"></div>
               <Mic size={18} className="text-zinc-400 cursor-pointer hover:text-white" />
               <Camera size={18} className="text-zinc-400 cursor-pointer hover:text-white" />
               <div className="bg-zinc-700/80 px-4 py-1.5 rounded-full text-[13px] font-bold text-zinc-200 flex items-center gap-1.5 cursor-pointer hover:bg-zinc-600">
                 <Search size={14} /> AI 模式
               </div>
             </div>

             <div className="flex gap-4 mt-8">
               <button className="bg-[#303030] px-5 py-2.5 text-[13px] text-zinc-300 rounded hover:border-zinc-500 border border-transparent transition-colors shadow">Google 搜索</button>
               <button className="bg-[#303030] px-5 py-2.5 text-[13px] text-zinc-300 rounded hover:border-zinc-500 border border-transparent transition-colors shadow">手气不错</button>
             </div>

             <div className="text-[12px] text-zinc-400 mt-8">
               Google 提供: <span className="text-blue-400 cursor-pointer hover:underline">English</span>
             </div>
             
             {/* Footer Links */}
             <div className="absolute bottom-0 left-0 right-0 py-3 border-t border-zinc-800 flex justify-around px-20 text-[12px] text-zinc-400 bg-[#141414]">
                <span className="cursor-pointer hover:underline">关于 Google</span>
                <span className="cursor-pointer hover:underline">广告</span>
                <span className="cursor-pointer hover:underline">商务</span>
                <span className="cursor-pointer hover:underline">Google 搜索的运作方式</span>
                <span className="cursor-pointer hover:underline">隐私权</span>
                <span className="cursor-pointer hover:underline">条款</span>
                <span className="cursor-pointer hover:underline">设置</span>
             </div>
          </div>
        </div>

        {/* D. Right Panel (Chat) */}
        <div className="w-[380px] bg-[#111111] flex flex-col shrink-0 relative border-x border-[#06b6d4] z-10 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 pt-16 flex flex-col items-center">
             
             <h1 className="text-[32px] font-bold text-zinc-100 font-serif mb-10 w-full text-center flex items-center justify-center tracking-tight">
                晚上好, <span className="font-sans font-black ml-2 tracking-tighter text-white">hua xu</span>
             </h1>
             
             <div className="bg-[#1a1a1a] rounded-[20px] border border-zinc-800 p-5 mb-6 shadow-sm w-full">
                <textarea 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full bg-transparent border-none text-[13px] text-zinc-300 placeholder:text-zinc-600 resize-none focus:outline-none mb-6 font-medium leading-relaxed"
                  placeholder="你可以直接开始，或者选择一个 combo 完成特定任务，或者将历史对话整理成一个 combo"
                  rows={3}
                />
                <div className="flex items-center justify-between">
                  <div className="flex gap-4 text-zinc-500">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-zinc-800 cursor-pointer"><AtSign size={16} className="text-zinc-400" /></div>
                    <div className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-zinc-800 cursor-pointer"><Box size={16} className="text-zinc-400" /></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-[11px] font-bold text-zinc-400 bg-[#222222] px-3 py-1.5 rounded-full hover:bg-zinc-800 cursor-pointer transition-colors border border-zinc-800/50">
                      claude-sonnet-4-6 <ChevronDown size={12} />
                    </div>
                    <button className="text-zinc-500 hover:text-white transition-colors p-1.5">
                      <Send size={16} />
                    </button>
                  </div>
                </div>
             </div>

             <div className="flex flex-wrap gap-2 mb-6 w-full px-2">
                <span className="px-3 py-1.5 rounded-full text-[12px] font-bold bg-[#06b6d4]/10 text-[#06b6d4] flex items-center gap-1.5 cursor-pointer border border-[#06b6d4]/20 hover:bg-[#06b6d4]/20 transition-colors">
                  <Sparkles size={12}/> 推荐
                </span>
                <span className="px-3 py-1.5 rounded-full text-[12px] font-bold text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 cursor-pointer flex items-center gap-1.5 transition-colors border border-transparent">
                  <Sparkles size={12}/> 自定义
                </span>
                <span className="px-3 py-1.5 rounded-full text-[12px] font-bold text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 cursor-pointer flex items-center gap-1.5 transition-colors border border-transparent">
                  <Activity size={12}/> 分析
                </span>
             </div>

             <div className="space-y-3 w-full">
                <div className="px-5 py-4 rounded-[16px] border border-zinc-800 bg-transparent hover:bg-zinc-800/50 hover:border-zinc-700 cursor-pointer text-[13px] text-zinc-300 font-medium transition-all shadow-sm">
                  根据我选中的文档，写一个漂亮的 PPT 汇报用
                </div>
                <div className="px-5 py-4 rounded-[16px] border border-zinc-800 bg-transparent hover:bg-zinc-800/50 hover:border-zinc-700 cursor-pointer text-[13px] text-zinc-300 font-medium transition-all shadow-sm">
                  分析这个目录结构，帮我做一个整理计划
                </div>
                <div className="px-5 py-4 rounded-[16px] border border-zinc-800 bg-transparent hover:bg-zinc-800/50 hover:border-zinc-700 cursor-pointer text-[13px] text-zinc-300 font-medium transition-all shadow-sm">
                  根据目录内的表格文件，给出一些洞察
                </div>
                <div className="px-5 py-4 rounded-[16px] border border-zinc-800 bg-transparent hover:bg-zinc-800/50 hover:border-zinc-700 cursor-pointer text-[13px] text-zinc-300 font-medium transition-all shadow-sm">
                  根据 PDF 报告，生成一个信息图
                </div>
             </div>
          </div>
        </div>

        {/* E. Far Right Panel (Combo Skills) */}
        <div className="w-[280px] bg-[#0A0A0A] flex flex-col shrink-0 border-l border-[#1a1a1a]">
          <div className="h-[48px] px-5 flex items-center justify-between border-b border-[#1a1a1a] shrink-0 pt-2">
             <span className="text-zinc-100 font-bold flex items-center gap-2 text-[15px]">
               <Sparkles size={16} className="text-[#06b6d4]" /> Combo <br/>Skills
             </span>
             <div className="flex gap-4 text-zinc-500">
                <Home size={14} className="cursor-pointer hover:text-white" />
                <RotateCw size={14} className="cursor-pointer hover:text-white" />
             </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
             <h4 className="text-[13px] font-bold text-zinc-400 mb-4 px-1">推荐</h4>
             
             {/* Special Skill Card */}
             <div className="rounded-[16px] p-[1.5px] bg-gradient-to-br from-[#06b6d4]/40 via-blue-500/20 to-purple-500/10 mb-4 cursor-pointer hover:from-[#06b6d4]/60 transition-colors">
                <div className="bg-[#111111] rounded-[15px] p-5 h-full relative overflow-hidden flex flex-col">
                   <h3 className="text-white font-bold text-[15px] mb-2 relative z-10 w-4/5 leading-snug">你希望 Floatboat 做些什么？</h3>
                   <p className="text-zinc-400 text-[11px] mb-6 font-medium leading-relaxed relative z-10 w-4/5">说出你的目标，让我们帮你实现它们</p>
                   <button className="bg-zinc-800/90 text-zinc-300 text-[11px] font-bold px-4 py-2 rounded-xl border border-zinc-700/50 hover:bg-zinc-700 hover:text-white transition-colors relative z-10 shadow-sm w-fit">填写你的目标</button>
                   {/* Background aura decoration */}
                   <div className="absolute right-[-30px] bottom-[-20px] w-28 h-28 bg-[#06b6d4]/5 rounded-full blur-2xl"></div>
                </div>
             </div>
             
             {/* Standard Skill Card 1 */}
             <div className="rounded-[16px] p-5 bg-[#141414] border border-zinc-800/80 mb-3 cursor-pointer hover:border-zinc-700 hover:bg-[#1a1a1a] transition-all">
                <div className="flex items-start justify-between mb-4">
                   <h4 className="text-zinc-100 font-bold text-[14px]">PPT ...</h4>
                   <button className="bg-[#06b6d4] text-[#0A0A0A] text-[11px] font-bold px-3 py-1 rounded-full hover:bg-cyan-400 transition-colors">安装</button>
                </div>
                <div className="flex gap-2 mb-4">
                   <span className="text-[10px] font-bold text-zinc-500 flex items-center pr-1">v0...</span>
                   <span className="text-[10px] font-bold text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700/50">加密</span>
                   <span className="text-[10px] font-bold text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700/50">用户</span>
                </div>
                <p className="text-[12px] text-zinc-500 font-medium leading-relaxed">
                  A professional PPT creation tool: supports image OCR, semantic restructuring, and the generation of HTML slides in a warm academic style.
                </p>
             </div>

             {/* Standard Skill Card 2 */}
             <div className="rounded-[16px] p-5 bg-[#141414] border border-zinc-800/80 mb-3 cursor-pointer hover:border-zinc-700 hover:bg-[#1a1a1a] transition-all">
                <div className="flex items-start justify-between mb-4">
                   <h4 className="text-zinc-100 font-bold text-[14px]">Noti...</h4>
                   <button className="bg-[#06b6d4] text-[#0A0A0A] text-[11px] font-bold px-3 py-1 rounded-full hover:bg-cyan-400 transition-colors">安装</button>
                </div>
                <div className="flex gap-2 mb-4">
                   <span className="text-[10px] font-bold text-zinc-500 flex items-center pr-1">v0...</span>
                   <span className="text-[10px] font-bold text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700/50">加密</span>
                   <span className="text-[10px] font-bold text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700/50">官方</span>
                </div>
                <p className="text-[12px] text-zinc-500 font-medium leading-relaxed">
                  Comprehensive Notion integration for managing pages and...
                </p>
             </div>
          </div>
          
          <div className="p-3 border-t border-[#1a1a1a] text-[11px] text-zinc-500 font-medium flex items-center pl-5">
             已安装 0 个Combo
          </div>
        </div>

      </div>
    </div>
  );
}

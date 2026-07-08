import React, { useState } from "react";
import { 
  FolderOpen, FileText, Image as ImageIcon, Send, Activity, BookOpen, Search, Filter, PlayCircle, MoreHorizontal, ArrowUpRight
} from "lucide-react";
import { motion } from "motion/react";

export function ProjectAssets() {
  const [activeTab, setActiveTab] = useState("content");

  const TABS = [
    { id: "content", name: "内容资产", icon: FileText, count: 42 },
    { id: "material", name: "素材资产", icon: ImageIcon, count: 156 },
    { id: "publish", name: "发布资产", icon: Send, count: 38 },
    { id: "leads", name: "互动线索", icon: Activity, count: 18 },
    { id: "knowledge", name: "知识沉淀", icon: BookOpen, count: 5 }
  ];

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden text-neutral-900 rounded-2xl shadow-sm border border-neutral-100">
      {/* 顶部信息 */}
      <div className="px-8 py-6 border-b border-neutral-100 bg-neutral-50/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-[20px] font-bold text-neutral-900">幼犬换粮避坑搜索卡位</h2>
            <span className="px-2.5 py-1 bg-green-50 text-green-700 text-[12px] font-bold rounded-lg border border-green-200">执行中</span>
          </div>
          
        </div>
        <div className="grid grid-cols-4 gap-6">
          <div>
            <div className="text-[12px] text-neutral-500 mb-1 font-medium">项目目标</div>
            <div className="text-[14px] text-neutral-900 font-bold">搜索卡位 + 私域承接</div>
          </div>
          <div>
            <div className="text-[12px] text-neutral-500 mb-1 font-medium">执行周期</div>
            <div className="text-[14px] text-neutral-900 font-bold">2026-07-01 至 2026-07-07</div>
          </div>
          <div>
            <div className="text-[12px] text-neutral-500 mb-1 font-medium">内容产出</div>
            <div className="text-[14px] text-neutral-900 font-bold">42 篇笔记 / 38 篇已发布</div>
          </div>
          <div>
            <div className="text-[12px] text-neutral-500 mb-1 font-medium">业务转化</div>
            <div className="text-[14px] text-neutral-900 font-bold text-primary-600">18 条线索 / 6 条待处理</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-8 pt-4 border-b border-neutral-100 bg-white">
        <div className="flex items-center gap-6">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 flex items-center gap-2 text-[14px] font-bold border-b-2 transition-colors ${
                activeTab === tab.id 
                  ? 'border-neutral-900 text-neutral-900' 
                  : 'border-transparent text-neutral-500 hover:text-neutral-700'
              }`}
            >
              <tab.icon size={16} />
              {tab.name}
              <span className={`px-2 py-0.5 rounded-full text-[11px] ${
                activeTab === tab.id ? 'bg-neutral-100 text-neutral-900' : 'bg-neutral-100 text-neutral-500'
              }`}>{tab.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-neutral-50/30 p-8">
        <div className="flex flex-col gap-6 max-w-[1200px] mx-auto">
          {activeTab === "content" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-[16px] font-bold text-neutral-900">内容资产库</h3>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input type="text" placeholder="搜索笔记..." className="pl-9 pr-4 py-2 bg-white border border-neutral-200 rounded-lg text-[13px] outline-none focus:border-neutral-400 w-[240px]" />
                  </div>
                  <button className="px-3 py-2 bg-white border border-neutral-200 rounded-lg text-[13px] font-medium text-neutral-600 flex items-center gap-2 hover:bg-neutral-50">
                    <Filter size={14} /> 筛选
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                    <div className="h-32 bg-neutral-100 relative overflow-hidden">
                      <img src={`https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=300&fit=crop&q=80`} alt="Cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 text-white text-[10px] font-bold rounded backdrop-blur-sm">
                        KOC / 泛素人
                      </div>
                      <div className="absolute top-2 right-2 px-2 py-1 bg-green-500 text-white text-[10px] font-bold rounded backdrop-blur-sm shadow-sm">
                        已发布
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="text-[14px] font-bold text-neutral-900 mb-2 line-clamp-2">新手养狗必看！幼犬换粮期怎么平稳度过？</h4>
                      <p className="text-[12px] text-neutral-500 line-clamp-2 mb-4">今天带大家看一看我家狗狗是怎么换粮的，特别是幼犬肠胃脆弱，一定要循序渐进...</p>
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-2 text-[12px] text-neutral-500">
                          <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="Avatar" className="w-5 h-5 rounded-full" />
                          <span>Molly麻麻</span>
                        </div>
                        <button className="text-neutral-400 hover:text-neutral-900 transition-colors">
                          <MoreHorizontal size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeTab !== "content" && (
            <div className="h-[400px] flex flex-col items-center justify-center text-center opacity-60">
              <FolderOpen size={48} className="text-neutral-300 mb-4" />
              <h3 className="text-[16px] font-bold text-neutral-900 mb-2">{TABS.find(t => t.id === activeTab)?.name} 正在加载</h3>
              <p className="text-[13px] text-neutral-500">该分类下的数据正在从项目中归档</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

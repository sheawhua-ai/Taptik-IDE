import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Settings, Play, CheckCircle2, ChevronRight, LayoutTemplate, Save, Search, Camera, FileText, Send, MoreHorizontal } from 'lucide-react';

export default function TaskDispatch() {
  const [isPlaying, setIsPlaying] = useState(false);

  // SOP Nodes State
  const nodes = [
    { id: '1', title: '全网选题推荐', type: 'ai', icon: Search, status: 'completed' },
    { id: '2', title: '智能 批量写稿', type: 'ai', icon: FileText, status: 'completed' },
    { id: '3', title: '素材拍摄回传', type: 'human', icon: Camera, status: 'active' },
    { id: '4', title: '健康度预审', type: 'ai', icon: CheckCircle2, status: 'waiting' },
    { id: '5', title: '定时自动排期', type: 'system', icon: Send, status: 'waiting' }
  ];

  return (
    <div className="p-8 max-w-[1400px] mx-auto min-h-full flex flex-col space-y-8">
      <header className="flex justify-between items-end shrink-0">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 flex items-center gap-2">
            <LayoutTemplate className="text-indigo-600" size={28} />
            SOP 自动化流水线 & 审核
          </h1>
          <p className="text-neutral-500 mt-2 font-medium">可视化拖拽编排运营流水线，新人一键执行标准化 SOP，并统一审核素材。</p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 bg-white border border-neutral-200 text-neutral-700 rounded-lg text-sm font-bold hover:bg-neutral-50 transition-colors shadow-sm flex items-center gap-2">
            <Save size={16} />
            存为机构专属 SOP
          </button>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-5 py-2.5 rounded-lg text-sm font-bold shadow-md transition-colors flex items-center gap-2 ${isPlaying ? 'bg-rose-500 text-white hover:bg-rose-600' : 'bg-neutral-900 text-white hover:bg-neutral-800'}`}
          >
            <Play size={16} />
            {isPlaying ? '停止流水线' : '一键执行 SOP'}
          </button>
        </div>
      </header>

      {/* Visual Pipeline Editor */}
      <section className="bg-white border border-neutral-200 rounded-2xl p-8 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-[16px] font-bold text-neutral-900">新客引流标准流水线 (Pipeline)</h2>
          <span className="text-[12px] bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-bold">运行进度: 40%</span>
        </div>

        <div className="flex items-center gap-2 relative">
          {/* Connecting Line */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-neutral-100 z-0 rounded-full"></div>
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[45%] h-1 bg-indigo-500 z-0 rounded-full transition-all duration-1000"></div>

          {nodes.map((node, index) => (
            <React.Fragment key={node.id}>
              <div className={`relative z-10 flex flex-col items-center gap-3 w-40 cursor-grab active:cursor-grabbing hover:-translate-y-1 transition-transform group`}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm border-2 transition-colors ${
                  node.status === 'completed' ? 'bg-emerald-500 border-emerald-500 text-white' :
                  node.status === 'active' ? 'bg-white border-indigo-500 text-indigo-600 ring-4 ring-indigo-500/20' :
                  'bg-white border-neutral-200 text-neutral-400'
                }`}>
                  <node.icon size={24} />
                </div>
                
                <div className="text-center">
                  <div className="text-[13px] font-bold text-neutral-900 mb-1">{node.title}</div>
                  <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
                    node.type === 'ai' ? 'bg-indigo-50 text-indigo-600' :
                    node.type === 'human' ? 'bg-amber-50 text-amber-600' :
                    'bg-neutral-100 text-neutral-600'
                  }`}>
                    {node.type === 'ai' ? '智能 节点' : node.type === 'human' ? '人工审核' : '系统调度'}
                  </div>
                </div>

                {node.status === 'active' && (
                  <div className="absolute -top-3 -right-2">
                    <span className="flex h-3 w-3 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                    </span>
                  </div>
                )}
              </div>

              {index < nodes.length - 1 && (
                <div className="flex-1 flex justify-center z-10">
                  <ChevronRight size={20} className="text-neutral-300" />
                </div>
              )}
            </React.Fragment>
          ))}

          <div className="flex-1 flex justify-center z-10">
            <ChevronRight size={20} className="text-neutral-300" />
          </div>

          <div className="relative z-10 w-14 h-14 rounded-2xl bg-neutral-50 border-2 border-dashed border-neutral-300 text-neutral-400 flex items-center justify-center hover:bg-neutral-100 hover:border-neutral-400 cursor-pointer transition-all">
            <Plus size={24} />
          </div>
        </div>
      </section>

      {/* Active Node Workspace - Content Review */}
      <section className="bg-neutral-900 rounded-2xl p-1 shadow-lg flex-1 min-h-[400px] flex flex-col">
        <div className="px-6 py-4 flex items-center justify-between border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
            </span>
            <h3 className="text-white font-bold">当前卡点：素材审核与指派</h3>
            <span className="bg-neutral-800 text-neutral-400 text-[12px] px-2 py-0.5 rounded">节点 3/5</span>
          </div>
        </div>
        
        <div className="flex-1 bg-white rounded-xl m-1 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
            <h4 className="text-[16px] font-bold text-neutral-900">待办审批 (12)</h4>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-neutral-200 rounded-md text-[13px] font-bold text-neutral-700 hover:bg-neutral-50">批量打回重拍</button>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-md text-[13px] font-bold hover:bg-indigo-700">批量通过并进入下一节点</button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 bg-neutral-50 grid grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm group hover:border-indigo-300 transition-colors">
                <div className="aspect-video bg-neutral-100 rounded-lg mb-4 relative overflow-hidden flex items-center justify-center text-neutral-400">
                  <Camera size={32} />
                  <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-sm">门店回传</div>
                </div>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-bold text-neutral-900 text-[14px] mb-1">初夏防晒大作战素材</div>
                    <div className="text-[12px] text-neutral-500">提报人: 杭州西湖店 - 李四</div>
                  </div>
                  <MoreHorizontal size={16} className="text-neutral-400 cursor-pointer" />
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 py-1.5 border border-rose-200 text-rose-600 bg-rose-50 text-[12px] font-bold rounded hover:bg-rose-100">打回修改</button>
                  <button className="flex-1 py-1.5 bg-neutral-900 text-white text-[12px] font-bold rounded hover:bg-neutral-800">审核通过</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

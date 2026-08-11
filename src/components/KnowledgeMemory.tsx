import React, { useState, useRef, useEffect } from 'react';
import { Play, ChevronDown, FileUp, Folder, Link as LinkIcon, Settings2 } from 'lucide-react';
import { OverviewTab } from './knowledge/OverviewTab';
import { KnowledgeTab } from './knowledge/KnowledgeTab';
import { DataSourcesTab } from './knowledge/DataSourcesTab';
import { PendingWorkbenchModal } from './knowledge/PendingWorkbenchModal';
import { KnowledgeDetailsDrawer } from './knowledge/KnowledgeDetailsDrawer';
import { TestAnswerDrawer } from './knowledge/TestAnswerDrawer';
import { CategorySettingsDrawer } from './knowledge/CategorySettingsDrawer';

import { mockPendingTasks, mockKnowledgeList, mockSources } from '../data/knowledgeMock';
import { KnowledgeItem, PendingTask } from '../types/knowledge';

export function KnowledgeMemory({ activeProject }: { activeProject?: any }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'knowledge' | 'sources'>('overview');
  
  // Drawer/Modal States
  const [isWorkbenchOpen, setIsWorkbenchOpen] = useState(false);
  const [initialWorkbenchTask, setInitialWorkbenchTask] = useState<string | null>(null);
  
  const [isKnowledgeDrawerOpen, setIsKnowledgeDrawerOpen] = useState(false);
  const [selectedKnowledge, setSelectedKnowledge] = useState<KnowledgeItem | null>(null);
  
  const [isTestDrawerOpen, setIsTestDrawerOpen] = useState(false);
  const [isCategorySettingsOpen, setIsCategorySettingsOpen] = useState(false);

  // Upload Dropdown State
  const [isUploadDropdownOpen, setIsUploadDropdownOpen] = useState(false);
  const uploadDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (uploadDropdownRef.current && !uploadDropdownRef.current.contains(event.target as Node)) {
        setIsUploadDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOpenWorkbench = (task: PendingTask) => {
    setInitialWorkbenchTask(task.id);
    setIsWorkbenchOpen(true);
  };

  const handleOpenKnowledge = (item: KnowledgeItem) => {
    setSelectedKnowledge(item);
    setIsKnowledgeDrawerOpen(true);
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-white">
      {/* Header */}
      <header className="shrink-0 bg-white border-b border-neutral-100 flex flex-col z-10">
        <div className="flex justify-between items-center px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">知识与记忆</h1>
            <p className="text-xs text-neutral-400 mt-1 flex items-center space-x-2">
              <span>调用优先级：</span>
              <span className="font-medium text-neutral-500">商家已确认事实</span>
              <span>&gt;</span>
              <span className="font-medium text-neutral-500">规则与禁区</span>
              <span>&gt;</span>
              <span className="font-medium text-neutral-500">项目要求</span>
              <span>&gt;</span>
              <span className="font-medium text-neutral-500">经验建议</span>
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setIsTestDrawerOpen(true)}
              className="flex items-center px-4 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-lg text-sm font-medium hover:bg-neutral-50 transition-colors shadow-sm"
            >
              <Play className="w-4 h-4 mr-1.5 fill-current" /> 测试回答
            </button>
            <button 
              onClick={() => setIsCategorySettingsOpen(true)}
              className="flex items-center px-4 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-lg text-sm font-medium hover:bg-neutral-50 transition-colors shadow-sm"
            >
              <Settings2 className="w-4 h-4 mr-1.5" /> 分类设置
            </button>
            <div className="relative" ref={uploadDropdownRef}>
              <button 
                onClick={() => setIsUploadDropdownOpen(!isUploadDropdownOpen)}
                className="flex items-center px-4 py-2 bg-neutral-900 text-white rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors shadow-sm"
              >
                上传资料 <ChevronDown className="w-4 h-4 ml-1.5" />
              </button>
              
              {/* Upload Dropdown */}
              {isUploadDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-neutral-200 rounded-xl shadow-lg py-1 z-50">
                  <button 
                    onClick={() => setIsUploadDropdownOpen(false)}
                    className="w-full text-left px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 flex items-center transition-colors"
                  >
                    <FileUp className="w-4 h-4 mr-3 text-neutral-400" /> 添加文件
                  </button>
                  <button 
                    onClick={() => setIsUploadDropdownOpen(false)}
                    className="w-full text-left px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 flex items-center transition-colors"
                  >
                    <Folder className="w-4 h-4 mr-3 text-neutral-400" /> 连接本地文件夹
                  </button>
                  <button 
                    onClick={() => setIsUploadDropdownOpen(false)}
                    className="w-full text-left px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 flex items-center transition-colors"
                  >
                    <LinkIcon className="w-4 h-4 mr-3 text-neutral-400" /> 粘贴文本或链接
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 flex space-x-8 text-sm">
          <button 
            className={`pb-3 border-b-2 font-medium transition-colors ${activeTab === 'overview' ? 'border-neutral-900 text-neutral-900' : 'border-transparent text-neutral-500 hover:text-neutral-700'}`}
            onClick={() => setActiveTab('overview')}
          >
            总览
          </button>
          <button 
            className={`pb-3 border-b-2 font-medium transition-colors ${activeTab === 'knowledge' ? 'border-neutral-900 text-neutral-900' : 'border-transparent text-neutral-500 hover:text-neutral-700'}`}
            onClick={() => setActiveTab('knowledge')}
          >
            知识
          </button>
          <button 
            className={`pb-3 border-b-2 font-medium transition-colors ${activeTab === 'sources' ? 'border-neutral-900 text-neutral-900' : 'border-transparent text-neutral-500 hover:text-neutral-700'}`}
            onClick={() => setActiveTab('sources')}
          >
            资料来源
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-neutral-50/30 p-6">
        {activeTab === 'overview' && (
          <OverviewTab 
            pendingTasks={mockPendingTasks}
            recentlyUpdated={mockKnowledgeList.slice(0, 2)}
            sources={mockSources}
            onOpenWorkbench={handleOpenWorkbench}
            onOpenKnowledge={handleOpenKnowledge}
          />
        )}
        
        {activeTab === 'knowledge' && (
          <KnowledgeTab 
            knowledgeList={mockKnowledgeList}
            onOpenKnowledge={handleOpenKnowledge}
          />
        )}

        {activeTab === 'sources' && (
          <DataSourcesTab 
            sources={mockSources}
          />
        )}
      </main>

      {/* Modals & Drawers */}
      <PendingWorkbenchModal 
        isOpen={isWorkbenchOpen}
        onClose={() => setIsWorkbenchOpen(false)}
        tasks={mockPendingTasks}
        initialTaskId={initialWorkbenchTask}
      />

      <KnowledgeDetailsDrawer
        isOpen={isKnowledgeDrawerOpen}
        onClose={() => setIsKnowledgeDrawerOpen(false)}
        item={selectedKnowledge}
      />

      <TestAnswerDrawer
        isOpen={isTestDrawerOpen}
        onClose={() => setIsTestDrawerOpen(false)}
      />

      <CategorySettingsDrawer
        isOpen={isCategorySettingsOpen}
        onClose={() => setIsCategorySettingsOpen(false)}
      />
    </div>
  );
}

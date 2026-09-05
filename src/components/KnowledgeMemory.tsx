import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';
import { OverviewTab } from './knowledge/OverviewTab';
import { KnowledgeTab } from './knowledge/KnowledgeTab';
import { DataSourcesTab } from './knowledge/DataSourcesTab';
import { PendingWorkbenchModal } from './knowledge/PendingWorkbenchModal';
import { KnowledgeDetailsDrawer } from './knowledge/KnowledgeDetailsDrawer';
import { CategorySettingsDrawer, DEFAULT_CATEGORIES, type KnowledgeCategoryConfig } from './knowledge/CategorySettingsDrawer';

import { mockPendingTasks, mockKnowledgeList, mockSources } from '../data/knowledgeMock';
import { KnowledgeItem, PendingTask, SourceItem, type BusinessCategory, type DecompositionItem } from '../types/knowledge';

function getFileType(fileName: string): 'PDF' | 'Word' | 'Excel' | '文本' {
  const lower = fileName.toLowerCase();
  if (lower.endsWith('.pdf')) return 'PDF';
  if (lower.endsWith('.doc') || lower.endsWith('.docx')) return 'Word';
  if (lower.endsWith('.xls') || lower.endsWith('.xlsx') || lower.endsWith('.csv')) return 'Excel';
  return '文本';
}

export function KnowledgeMemory({ activeProject }: { activeProject?: any }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'knowledge' | 'sources'>('overview');
  const mainScrollRef = useRef<HTMLElement>(null);
  
  // Sources state to reflect newly selected local files/folders
  const [sourcesList, setSourcesList] = useState<SourceItem[]>(mockSources);
  const [pendingTasks, setPendingTasks] = useState<PendingTask[]>(mockPendingTasks);
  const [knowledgeList, setKnowledgeList] = useState<KnowledgeItem[]>(mockKnowledgeList);
  const [categoryConfigs, setCategoryConfigs] = useState<KnowledgeCategoryConfig[]>(DEFAULT_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState<BusinessCategory>('品牌与产品');

  useEffect(() => {
    mainScrollRef.current?.scrollTo({ top: 0, left: 0 });
  }, [activeTab]);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = (msg: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Hidden native file/folder picker inputs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  // Drawer/Modal States
  const [isWorkbenchOpen, setIsWorkbenchOpen] = useState(false);
  const [initialWorkbenchTask, setInitialWorkbenchTask] = useState<string | null>(null);
  
  const [isKnowledgeDrawerOpen, setIsKnowledgeDrawerOpen] = useState(false);
  const [selectedKnowledge, setSelectedKnowledge] = useState<KnowledgeItem | null>(null);
  
  const [isCategorySettingsOpen, setIsCategorySettingsOpen] = useState(false);

  const queueSourceForDecomposition = (source: SourceItem, itemCount = 3) => {
    const pendingSource: SourceItem = { ...source, extractedCount: 0, pendingCount: itemCount, state: '拆解中' };
    setSourcesList(prev => [pendingSource, ...prev]);
    window.setTimeout(() => {
      const templates: DecompositionItem[] = [
        { id: `${source.id}-part-1`, category: '品牌与产品', format: '商家事实', summary: '产品成分、价格与功效边界，保留原文来源和有效期。' },
        { id: `${source.id}-part-2`, category: '话术与承接', format: '常见问答', summary: '用户常见问题与对应回答，写清适用场景。' },
        { id: `${source.id}-part-3`, category: '禁区与流转', format: '运营规则', summary: '不能使用的表达和对应依据，发布前需要检查。' }
      ];
      const decompositionItems = templates.slice(0, itemCount);
      const uniqueCategoryCount = new Set(decompositionItems.map(item => item.category)).size;
      const task: PendingTask = {
        id: `decompose-${source.id}`,
        title: `《${source.name}》拆成 ${decompositionItems.length} 条，进了 ${uniqueCategoryCount} 个区块`,
        type: '拆解预览',
        reason: 'AI 已按各区块的说明完成拆解和归位，等待确认。',
        impact: '确认后写入对应知识区块',
        sourceFile: source.name,
        decompositionItems
      };
      setSourcesList(prev => prev.map(item => item.id === source.id ? { ...item, state: '待处理', pendingCount: decompositionItems.length } : item));
      setPendingTasks(prev => [task, ...prev.filter(item => item.id !== task.id)]);
      setInitialWorkbenchTask(task.id);
      setIsWorkbenchOpen(true);
      showToast(`《${source.name}》拆解完成，拆成 ${decompositionItems.length} 条，待你确认`);
    }, 1200);
  };

  // Direct File Picker Handler
  const handlePickFiles = async () => {
    if ('showOpenFilePicker' in window) {
      try {
        const handles = await (window as any).showOpenFilePicker({
          multiple: true,
          types: [
            {
              description: '本地知识资料 (PDF, Word, Excel, Markdown, TXT)',
              accept: {
                'application/pdf': ['.pdf'],
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
                'application/msword': ['.doc'],
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
                'text/markdown': ['.md'],
                'text/plain': ['.txt']
              }
            }
          ]
        });
        if (handles && handles.length > 0) {
          const addedSources: SourceItem[] = [];
          for (const handle of handles) {
            const file = await handle.getFile();
            addedSources.push({
              id: `s-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
              name: file.name,
              type: getFileType(file.name),
              deviceOrLocation: `本地路径: /${file.name}`,
              extractedCount: 0,
              pendingCount: 3,
              lastSyncTime: '刚刚',
              state: '拆解中'
            });
          }
          addedSources.forEach(source => queueSourceForDecomposition(source));
          return;
        }
      } catch (err: any) {
        if (err.name === 'AbortError') return; // User cancelled
        fileInputRef.current?.click();
      }
    } else {
      fileInputRef.current?.click();
    }
  };

  // Direct Folder Picker Handler
  const handlePickFolder = async () => {
    if ('showDirectoryPicker' in window) {
      try {
        const dirHandle = await (window as any).showDirectoryPicker();
        if (dirHandle) {
          const folderName = dirHandle.name;
          const newSource: SourceItem = {
            id: `s-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            name: folderName,
            type: '本地文件夹',
            deviceOrLocation: `本地目录: /${folderName}`,
            extractedCount: 0,
            pendingCount: 3,
            lastSyncTime: '刚刚',
            state: '拆解中'
          };
          queueSourceForDecomposition(newSource);
          return;
        }
      } catch (err: any) {
        if (err.name === 'AbortError') return; // User cancelled
        folderInputRef.current?.click();
      }
    } else {
      folderInputRef.current?.click();
    }
  };

  // Fallback native input changes
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files: File[] = Array.from(e.target.files);
      const addedSources: SourceItem[] = files.map((file: File) => ({
        id: `s-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        name: file.name,
        type: getFileType(file.name),
        deviceOrLocation: `本地路径: /${(file as any).webkitRelativePath || file.name}`,
        extractedCount: 0,
        pendingCount: 3,
        lastSyncTime: '刚刚',
        state: '拆解中'
      }));
      addedSources.forEach(source => queueSourceForDecomposition(source));
      e.target.value = '';
    }
  };

  const handleFolderInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files: File[] = Array.from(e.target.files);
      const firstPath = (files[0] as any).webkitRelativePath || '';
      const folderName = firstPath ? firstPath.split('/')[0] : '本地知识目录';
      const newSource: SourceItem = {
        id: `s-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        name: folderName,
        type: '本地文件夹',
        deviceOrLocation: `本地目录: /${folderName} (共 ${files.length} 个文件)`,
        extractedCount: 0,
        pendingCount: 3,
        lastSyncTime: '刚刚',
        state: '拆解中'
      };
      queueSourceForDecomposition(newSource);
      e.target.value = '';
    }
  };

  const handleOpenWorkbench = (task: PendingTask) => {
    setInitialWorkbenchTask(task.id);
    setIsWorkbenchOpen(true);
  };

  const handleOpenKnowledge = (item: KnowledgeItem) => {
    setSelectedKnowledge(item);
    setIsKnowledgeDrawerOpen(true);
  };

  const handleSaveKnowledge = (updatedItem: KnowledgeItem) => {
    setKnowledgeList(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
    setSelectedKnowledge(updatedItem);
    showToast('知识已更新');
  };

  const handleOpenCategory = (category: BusinessCategory) => {
    setSelectedCategory(category);
    setActiveTab('knowledge');
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-surface-1 relative">
      {/* Hidden File / Folder inputs */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileInputChange} 
        multiple 
        className="hidden" 
      />
      <input 
        type="file" 
        ref={folderInputRef} 
        onChange={handleFolderInputChange} 
        {...({ webkitdirectory: "", directory: "" } as any)} 
        multiple 
        className="hidden" 
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute bottom-6 right-6 z-[100] bg-surface-1 text-text-main text-[13px] font-medium px-4 py-2 rounded-xl shadow-lg border border-border-default flex items-center gap-2 h-10 max-h-[48px] animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 size={16} className="text-success shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <header className="shrink-0 bg-surface-1 border-b border-border-default flex flex-col z-10">
        <div className="px-8 py-3.5">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[18px] font-semibold text-text-main tracking-tight">知识库</h1>
            </div>
            <div className="mt-0.5 text-[13px] leading-5 text-text-secondary">
              <p className="font-medium text-text-main">集中管理资料，上传后 AI 自动拆解并归入相关板块。</p>
              <p><span className="text-text-tertiary">调用优先级：</span><span className="font-medium text-text-secondary">商家确认过的事实 ＞ 规则与禁区 ＞ 项目需求 ＞ 经验建议</span></p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="h-13 px-8 flex items-center justify-between border-t border-border-default bg-surface-1">
          <div className="flex items-center gap-8 h-full">
            {[
              { id: 'overview', label: '总览' },
              { id: 'sources', label: '资料' },
              { id: 'knowledge', label: '知识板块' },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`relative h-full flex items-center gap-2 px-1 text-[14px] transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'font-semibold text-text-main'
                      : 'font-medium text-text-secondary hover:text-text-main'
                  }`}
                >
                  <span>{tab.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="knowledgeTab"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-neutral-900 rounded-full"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main ref={mainScrollRef} className="flex-1 overflow-y-auto bg-page-bg/30 p-8">
        {activeTab === 'overview' && (
          <OverviewTab 
            pendingTasks={pendingTasks}
            knowledgeList={knowledgeList}
            sources={sourcesList}
            categories={categoryConfigs}
            onOpenWorkbench={handleOpenWorkbench}
            onOpenCategory={handleOpenCategory}
            onPickFiles={handlePickFiles}
          />
        )}
        
        {activeTab === 'knowledge' && (
          <KnowledgeTab 
            knowledgeList={knowledgeList}
            categories={categoryConfigs}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onOpenKnowledge={handleOpenKnowledge}
            onOpenSettings={() => setIsCategorySettingsOpen(true)}
            onPickFiles={handlePickFiles}
          />
        )}

        {activeTab === 'sources' && (
          <DataSourcesTab 
            sources={sourcesList}
            onPickFiles={handlePickFiles}
            onPickFolder={handlePickFolder}
          />
        )}
      </main>

      {/* Modals & Drawers */}
      <PendingWorkbenchModal 
        isOpen={isWorkbenchOpen}
        onClose={() => setIsWorkbenchOpen(false)}
        tasks={pendingTasks}
        initialTaskId={initialWorkbenchTask}
      />

      <KnowledgeDetailsDrawer
        isOpen={isKnowledgeDrawerOpen}
        onClose={() => setIsKnowledgeDrawerOpen(false)}
        item={selectedKnowledge}
        allItems={knowledgeList}
        onSave={handleSaveKnowledge}
      />

      <CategorySettingsDrawer
        isOpen={isCategorySettingsOpen}
        onClose={() => setIsCategorySettingsOpen(false)}
        categories={categoryConfigs}
        onSave={setCategoryConfigs}
      />
    </div>
  );
}

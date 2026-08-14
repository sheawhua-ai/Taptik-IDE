import React, { useState, useRef } from 'react';
import { FilePlus, FolderPlus, Settings2, CheckCircle2 } from 'lucide-react';
import { OverviewTab } from './knowledge/OverviewTab';
import { KnowledgeTab } from './knowledge/KnowledgeTab';
import { DataSourcesTab } from './knowledge/DataSourcesTab';
import { PendingWorkbenchModal } from './knowledge/PendingWorkbenchModal';
import { KnowledgeDetailsDrawer } from './knowledge/KnowledgeDetailsDrawer';
import { CategorySettingsDrawer } from './knowledge/CategorySettingsDrawer';

import { mockPendingTasks, mockKnowledgeList, mockSources } from '../data/knowledgeMock';
import { KnowledgeItem, PendingTask, SourceItem } from '../types/knowledge';

function getFileType(fileName: string): 'PDF' | 'Word' | 'Excel' | '文本' {
  const lower = fileName.toLowerCase();
  if (lower.endsWith('.pdf')) return 'PDF';
  if (lower.endsWith('.doc') || lower.endsWith('.docx')) return 'Word';
  if (lower.endsWith('.xls') || lower.endsWith('.xlsx') || lower.endsWith('.csv')) return 'Excel';
  return '文本';
}

export function KnowledgeMemory({ activeProject }: { activeProject?: any }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'knowledge' | 'sources'>('overview');
  
  // Sources state to reflect newly selected local files/folders
  const [sourcesList, setSourcesList] = useState<SourceItem[]>(mockSources);

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

  // Direct File Picker Handler
  const handlePickFiles = async () => {
    if ('showOpenFilePicker' in window) {
      try {
        const handles = await (window as any).showOpenFilePicker({
          multiple: true,
          types: [
            {
              description: '知识库文档 (PDF, Word, Excel, Markdown, TXT)',
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
              extractedCount: Math.floor(Math.random() * 8) + 3,
              pendingCount: 0,
              lastSyncTime: '刚刚',
              state: '正常'
            });
          }
          setSourcesList(prev => [...addedSources, ...prev]);
          showToast(`已直接选择并连接本地文件：${addedSources.map(s => s.name).join('、')}`);
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
            extractedCount: Math.floor(Math.random() * 20) + 12,
            pendingCount: 0,
            lastSyncTime: '刚刚',
            state: '正常'
          };
          setSourcesList(prev => [newSource, ...prev]);
          showToast(`已直接选择并连接本地文件夹："${folderName}"`);
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
        extractedCount: Math.floor(Math.random() * 8) + 3,
        pendingCount: 0,
        lastSyncTime: '刚刚',
        state: '正常'
      }));
      setSourcesList(prev => [...addedSources, ...prev]);
      showToast(`已直接选择并连接本地文件：${files.map(f => f.name).join('、')}`);
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
        extractedCount: files.length,
        pendingCount: 0,
        lastSyncTime: '刚刚',
        state: '正常'
      };
      setSourcesList(prev => [newSource, ...prev]);
      showToast(`已直接选择并连接本地文件夹："${folderName}"（包含 ${files.length} 个文件）`);
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

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-white relative">
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
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[100] bg-neutral-900 text-white text-xs font-medium px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

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
          <div className="flex items-center space-x-2.5">
            <button 
              onClick={() => setIsCategorySettingsOpen(true)}
              className="flex items-center px-3.5 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-xl text-sm font-medium hover:bg-neutral-50 transition-colors shadow-2xs"
            >
              <Settings2 className="w-4 h-4 mr-1.5 text-neutral-500" /> 分类设置
            </button>

            {/* 添加文件 - 直接弹出电脑选择文件 */}
            <button 
              onClick={handlePickFiles}
              className="flex items-center px-3.5 py-2 bg-white border border-neutral-200 hover:border-neutral-300 text-neutral-800 rounded-xl text-sm font-bold hover:bg-neutral-50 transition-colors shadow-2xs cursor-pointer"
              title="直接选择本地文件"
            >
              <FilePlus className="w-4 h-4 mr-1.5 text-neutral-700" />
              <span>添加文件</span>
            </button>

            {/* 添加文件夹 - 直接弹出电脑选择文件夹 */}
            <button 
              onClick={handlePickFolder}
              className="flex items-center px-3.5 py-2 bg-neutral-900 text-white rounded-xl text-sm font-bold hover:bg-neutral-800 transition-colors shadow-2xs cursor-pointer"
              title="直接选择本地文件夹"
            >
              <FolderPlus className="w-4 h-4 mr-1.5 text-white" />
              <span>添加文件夹</span>
            </button>
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
            sources={sourcesList}
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
            sources={sourcesList}
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

      <CategorySettingsDrawer
        isOpen={isCategorySettingsOpen}
        onClose={() => setIsCategorySettingsOpen(false)}
      />
    </div>
  );
}

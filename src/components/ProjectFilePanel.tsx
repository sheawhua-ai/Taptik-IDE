import React, { useState, useEffect, useRef } from 'react';
import { Folder, File, FileText, ChevronRight, ChevronDown, MoreVertical, Plus, RefreshCw, ExternalLink, HardDrive, X, Image as ImageIcon, FileCode, Monitor } from 'lucide-react';

interface FileNode {
  id: string;
  name: string;
  type: 'folder' | 'file' | 'system_group';
  children?: FileNode[];
}

export const MOCK_FILE_TREE: FileNode[] = [
  { id: '1', name: '需求文档', type: 'folder', children: [
    { id: '1-1', name: '2025产品企划.pdf', type: 'file' },
    { id: '1-2', name: '竞品分析报告.docx', type: 'file' }
  ]},
  { id: '2', name: '设计资产', type: 'folder', children: [
    { id: '2-1', name: 'Logo_v2.png', type: 'file' },
    { id: '2-2', name: '主视觉_1080p.jpg', type: 'file' }
  ]},
  { id: '3', name: '活动策划_Q3.md', type: 'file' },
  { id: 'sys', name: '系统文件', type: 'system_group', children: [
    { id: 's1', name: '.taptik', type: 'folder' },
    { id: 's2', name: 'skills', type: 'folder' },
    { id: 's3', name: 'temp_cache.log', type: 'file' },
    { id: 's4', name: 'process.json', type: 'file' }
  ]}
];

interface ProjectFilePanelProps {
  isOpen: boolean;
  onClose: () => void;
  onDragStartNode: (e: React.DragEvent, node: FileNode) => void;
  onNodeDoubleClick?: (node: FileNode) => void;
}

export const ProjectFilePanel: React.FC<ProjectFilePanelProps> = ({ isOpen, onClose, onDragStartNode, onNodeDoubleClick }) => {
  const [width, setWidth] = useState(280);
  const [isResizing, setIsResizing] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['1', '2']));
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFloating, setIsFloating] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('taptik_file_panel_width');
    if (saved) setWidth(parseInt(saved, 10));
    
    const checkWidth = () => {
      setIsFloating(window.innerWidth < 768);
    };
    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    if (!isResizing) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      // Allow window to dictate limits, but we ensure minimum 240px and max 460px.
      // Also ensure chat area > 720px. Since panel is absolute on left (x=0 roughly for its container)
      let newWidth = e.clientX - 64;
      if (newWidth < 200) newWidth = 200;
      if (newWidth > 460) newWidth = 460;
      
      setWidth(newWidth);
    };
    
    const handleMouseUp = () => {
      setIsResizing(false);
      localStorage.setItem('taptik_file_panel_width', width.toString());
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, isFloating, width]);

  const toggleFolder = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const getIcon = (node: FileNode) => {
    if (node.type === 'folder') return <Folder size={14} className="text-[#98A2B3]" />;
    if (node.type === 'system_group') return <Monitor size={14} className="text-[#98A2B3]" />;
    if (node.name.endsWith('.pdf')) return <FileText size={14} className="text-[#98A2B3]" />;
    if (node.name.endsWith('.png') || node.name.endsWith('.jpg')) return <ImageIcon size={14} className="text-[#98A2B3]" />;
    return <File size={14} className="text-[#98A2B3]" />;
  };

  const renderTree = (nodes: FileNode[], depth = 0) => {
    return nodes.map(node => {
      const isFolder = node.type === 'folder' || node.type === 'system_group';
      const isExpanded = expandedFolders.has(node.id);
      const isSelected = selectedFileId === node.id;
      const isSystem = node.type === 'system_group' || depth > 0 && node.name.startsWith('.');

      return (
        <div key={node.id}>
          <div 
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('text/plain', node.id);
              onDragStartNode(e, node);
            }}
            onClick={() => setSelectedFileId(node.id)}
            onDoubleClick={(e) => {
              if (isFolder) toggleFolder(node.id, e);
              else {
                // Open preview
                alert(`正在打开预览: ${node.name}`);
              }
            }}
            className={`flex items-center gap-2 py-1.5 px-2 cursor-pointer rounded-lg transition-colors
              ${isSelected ? 'bg-hover-bg text-text-main' : 'text-text-secondary hover:bg-page-bg'}
              ${isSystem ? 'opacity-70' : ''}
              relative group
            `}
            style={{ paddingLeft: `${depth * 12 + 8}px` }}
            title={node.name}
          >
            {isSelected && <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#DF4965] rounded-r-full" />}
            
            <div className="w-4 h-4 flex items-center justify-center shrink-0" onClick={(e) => isFolder && toggleFolder(node.id, e)}>
              {isFolder ? (
                isExpanded ? <ChevronDown size={14} className="text-[#98A2B3]" /> : <ChevronRight size={14} className="text-[#98A2B3]" />
              ) : null}
            </div>
            <div className="relative">
              {getIcon(node)}
              {/* Optional: Mocking new/updated file dot indicator for demo purposes */}
              {node.name.includes('企划') && <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#DF4965] rounded-full border border-white" />}
            </div>
            <span className="text-[13px] truncate select-none flex-1 group-hover:text-text-main transition-colors">{node.name}</span>
            <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 shrink-0 ml-2">
              <MoreVertical size={14} className="text-[#98A2B3] hover:text-text-main transition-colors" />
            </div>
          </div>
          {isFolder && isExpanded && node.children && (
            <div className="flex flex-col mt-0.5 space-y-0.5">
              {renderTree(node.children, depth + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  if (!isOpen) return null;

  return (
    <>
      {isFloating && <div className="absolute inset-0 z-40 bg-black/10 backdrop-blur-[1px]" onClick={onClose} />}
      <div 
        className={`bg-surface-1 flex flex-col shrink-0 border-r border-[#E5EAF1] z-50 ${isFloating ? 'absolute h-full left-0 shadow-2xl' : 'relative h-full'}`}
        style={{ width: `${width}px` }}
      >
        {/* Header */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-[#E5EAF1] shrink-0">
          <h2 className="text-[14px] font-semibold text-text-main">项目文件</h2>
          <div className="flex items-center gap-1">
            <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-selected-bg/60 text-text-secondary transition-colors">
              <Plus size={15} />
            </button>
            <div className="relative">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-selected-bg/60 text-text-secondary transition-colors"
              >
                <MoreVertical size={15} />
              </button>
              {isMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-1 w-44 bg-surface-1 rounded-xl shadow-xl border border-border-default py-1.5 z-50">
                    <button className="w-full text-left px-4 py-2 hover:bg-page-bg flex items-center gap-2 text-[13px] text-text-secondary"><Folder size={14} className="text-text-tertiary"/> 新建文件夹</button>
                    <button className="w-full text-left px-4 py-2 hover:bg-page-bg flex items-center gap-2 text-[13px] text-text-secondary"><RefreshCw size={14} className="text-text-tertiary"/> 刷新</button>
                    <button className="w-full text-left px-4 py-2 hover:bg-page-bg flex items-center gap-2 text-[13px] text-text-secondary"><ExternalLink size={14} className="text-text-tertiary"/> 在系统文件管理器中打开</button>
                    <div className="h-px bg-hover-bg my-1"></div>
                    <button className="w-full text-left px-4 py-2 hover:bg-page-bg flex items-center gap-2 text-[13px] text-text-secondary"><Monitor size={14} className="text-text-tertiary"/> 显示系统文件</button>
                    <button className="w-full text-left px-4 py-2 hover:bg-page-bg flex items-center gap-2 text-[13px] text-text-secondary"><HardDrive size={14} className="text-text-tertiary"/> 更换本地项目</button>
                  </div>
                </>
              )}
            </div>
            {isFloating && (
              <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-selected-bg/60 text-text-secondary transition-colors ml-1">
                <X size={15} />
              </button>
            )}
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
          {renderTree(MOCK_FILE_TREE)}
        </div>

        {/* Drag handle */}
        <div 
          className="absolute right-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-btn-main/20 active:bg-btn-main/40 transition-colors flex items-center justify-center group"
          onMouseDown={handleMouseDown}
        >
          {isResizing && <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-btn-main -tranneutral-x-1/2 z-50"></div>}
        </div>
      </div>
    </>
  );
};

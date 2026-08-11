const fs = require('fs');

let panelCode = fs.readFileSync('src/components/ProjectFilePanel.tsx', 'utf-8');

// Add onNodeDoubleClick to props
panelCode = panelCode.replace(
  "onDragStartNode: (e: React.DragEvent, node: FileNode) => void;",
  "onDragStartNode: (e: React.DragEvent, node: FileNode) => void;\n  onNodeDoubleClick?: (node: FileNode) => void;"
);
panelCode = panelCode.replace(
  "export const ProjectFilePanel: React.FC<ProjectFilePanelProps> = ({ isOpen, onClose, onDragStartNode }) => {",
  "export const ProjectFilePanel: React.FC<ProjectFilePanelProps> = ({ isOpen, onClose, onDragStartNode, onNodeDoubleClick }) => {"
);

// Call it in onDoubleClick
panelCode = panelCode.replace(
  /onDoubleClick=\{\(e\) => \{\s*if \(isFolder\) toggleFolder\(node\.id, e\);\s*\}\}/,
  `onDoubleClick={(e) => {
              if (isFolder) { toggleFolder(node.id, e); }
              else if (onNodeDoubleClick) { onNodeDoubleClick(node); }
            }}`
);

fs.writeFileSync('src/components/ProjectFilePanel.tsx', panelCode);

// Workbench changes
let wbCode = fs.readFileSync('src/components/Workbench.tsx', 'utf-8');

if (!wbCode.includes('openedTabs')) {
  wbCode = wbCode.replace(
    "const [filePanelOpen, setFilePanelOpen] = useState(true);",
    "const [filePanelOpen, setFilePanelOpen] = useState(true);\n  const [openedTabs, setOpenedTabs] = useState<any[]>([]);\n  const [activeTabId, setActiveTabId] = useState<string>('workbench');"
  );
}

// Update Top Header to include tabs
const newHeader = `
      {/* Top Header with Tabs */}
      <div className="h-[46px] border-b border-neutral-200 flex items-end px-2 bg-neutral-50/50 shrink-0 z-20 overflow-x-auto custom-scrollbar">
        {activeProjectId === 'project-b' && (
          <div className="flex items-center gap-1 mb-1.5 mr-2">
            <button
              onClick={() => setFilePanelOpen(!filePanelOpen)}
              className={\`w-7 h-7 flex items-center justify-center rounded transition-colors \${filePanelOpen ? 'bg-neutral-200/50 text-neutral-900' : 'text-neutral-500 hover:bg-neutral-200/50 hover:text-neutral-900'}\`}
              title="切换项目文件"
            >
              <PanelLeftOpen size={16} />
            </button>
          </div>
        )}
        
        {/* Tabs Container */}
        <div className="flex items-end h-full gap-1">
          {/* Workbench Tab */}
          <div 
            onClick={() => setActiveTabId('workbench')}
            className={\`group relative h-[36px] flex items-center gap-2 px-4 min-w-[120px] max-w-[200px] rounded-t-lg border-t border-x cursor-pointer transition-all \${activeTabId === 'workbench' ? 'bg-white border-neutral-200/80 text-neutral-900 z-10' : 'bg-transparent border-transparent text-neutral-500 hover:bg-neutral-200/30'}\`}
          >
            {activeTabId === 'workbench' && <div className="absolute -bottom-[1px] left-0 right-0 h-[1px] bg-white z-20"></div>}
            <MessageSquare size={14} className={activeTabId === 'workbench' ? 'text-primary-500' : ''} />
            <span className="text-[13px] font-medium truncate">工作台</span>
          </div>

          {/* Opened Files Tabs */}
          {openedTabs.map(tab => (
            <div 
              key={tab.id}
              onClick={() => setActiveTabId(tab.id)}
              className={\`group relative h-[36px] flex items-center justify-between gap-3 px-3 pr-2 min-w-[120px] max-w-[200px] rounded-t-lg border-t border-x cursor-pointer transition-all \${activeTabId === tab.id ? 'bg-white border-neutral-200/80 text-neutral-900 z-10' : 'bg-transparent border-transparent text-neutral-500 hover:bg-neutral-200/30'}\`}
            >
              {activeTabId === tab.id && <div className="absolute -bottom-[1px] left-0 right-0 h-[1px] bg-white z-20"></div>}
              <div className="flex items-center gap-2 overflow-hidden">
                <File size={14} />
                <span className="text-[13px] font-medium truncate">{tab.name}</span>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  const newTabs = openedTabs.filter(t => t.id !== tab.id);
                  setOpenedTabs(newTabs);
                  if (activeTabId === tab.id) {
                    setActiveTabId(newTabs.length > 0 ? newTabs[newTabs.length - 1].id : 'workbench');
                  }
                }}
                className={\`p-0.5 rounded transition-colors \${activeTabId === tab.id ? 'text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900' : 'text-transparent group-hover:text-neutral-400 hover:bg-neutral-200/50 hover:!text-neutral-900'}\`}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
`;

wbCode = wbCode.replace(
  /\{\/\* Top Header \*\/\}[\s\S]*?<\/div>\s*<\/div>/,
  newHeader
);

wbCode = wbCode.replace(
  /<ProjectFilePanel \n            isOpen=\{filePanelOpen\} \n            onClose=\{\(\) => setFilePanelOpen\(false\)\} \n            onDragStartNode=\{handleDragStartNode\} \n          \/>/,
  `<ProjectFilePanel 
            isOpen={filePanelOpen} 
            onClose={() => setFilePanelOpen(false)} 
            onDragStartNode={handleDragStartNode} 
            onNodeDoubleClick={(node) => {
              if (node.type !== 'folder' && node.type !== 'system_group') {
                if (!openedTabs.find(t => t.id === node.id)) {
                  setOpenedTabs(prev => [...prev, node]);
                }
                setActiveTabId(node.id);
              }
            }}
          />`
);

wbCode = wbCode.replace(
  "import { MessageSquare, Paperclip, Sparkles, Send, Box, ChevronDown, Plus, LayoutGrid, RotateCw, Play, Search, Target, Video, Type, CheckCircle2, Circle, MoreHorizontal, File, Hash, Clock, Cpu, FileText, Bot, Folder, X, AlignLeft, Mic } from 'lucide-react';",
  "import { MessageSquare, Paperclip, Sparkles, Send, Box, ChevronDown, Plus, LayoutGrid, RotateCw, Play, Search, Target, Video, Type, CheckCircle2, Circle, MoreHorizontal, File, Hash, Clock, Cpu, FileText, Bot, Folder, X, AlignLeft, Mic, PanelLeftOpen } from 'lucide-react';"
);

// Conditionally render main content based on active tab
const mainContentWrapperStart = `
          {/* Main Workspace Area (Chat or File View) */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
            {activeTabId === 'workbench' ? (
              <>
`;

const mainContentWrapperEnd = `
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center bg-white text-neutral-400">
                <File size={48} className="mb-4 text-neutral-200" />
                <p className="text-[14px]">
                  {openedTabs.find(t => t.id === activeTabId)?.name || '未找到文件'}
                </p>
                <p className="text-[12px] mt-2">（文件预览区域，可接入外部编辑器或表格组件）</p>
              </div>
            )}
          </div>
`;

// Looking for <div className="flex-1 flex flex-col min-w-0 bg-white shadow-[-10px_0_30px_-15px_rgba(0,0,0,0.05)] relative z-10 rounded-tl-2xl overflow-hidden border-t border-l border-neutral-100">
// Wait, the structure in the provided output:
// <div className="flex-1 flex overflow-hidden relative bg-neutral-50/30">
//   {activeProjectId === 'project-b' && ( <ProjectFilePanel ... /> )}
//   <div className="w-[320px] bg-white border-r ... timeline ... </div>
//   <div className="flex-1 flex flex-col ... "> ... </div>

wbCode = wbCode.replace(
  /<div className="flex-1 flex overflow-hidden relative bg-neutral-50\/30">/,
  `<div className="flex-1 flex overflow-hidden relative bg-neutral-50/30">`
);

// We need to wrap the rest of the workspace.
// Actually, it might be better to just wrap the Timeline + Chat area.

fs.writeFileSync('src/components/Workbench.tsx', wbCode);

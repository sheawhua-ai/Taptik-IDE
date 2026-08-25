import React, { useState, useEffect, useMemo } from 'react';
import { 
  ArrowLeft, CheckCircle2, AlertCircle, Clock, ExternalLink, 
  Send, User, Tag, Plus, Trash2, RotateCcw, AlertTriangle, 
  ChevronDown, ChevronRight, FileText, Camera, Share2, 
  Sparkles, RefreshCw, Pin, MoreHorizontal, QrCode, Check,
  Eye, Image as ImageIcon, ShieldAlert, ArrowRight, CornerDownRight,
  Info, Maximize2, X, ShieldCheck, CheckCheck, Edit3, MessageSquare,
  Layers, Users, CheckSquare, Square, FolderPlus, DownloadCloud, Sparkle
} from 'lucide-react';
import { 
  ExecutionTask, MaterialSubItem, SelectionAIProposal, SelectionTargetType, 
  UploadedAsset, LibraryMaterialItem, GeneratedMaterialTask 
} from './types';
import { ExecutionAction } from '../../../data/unifiedStore';
import { getProjectLibraryMaterials, MOCK_STAFF_MEMBERS } from './materialMockData';
import { ContentAiHub } from './aiPanels/ContentAiHub';
import { MaterialAiHub } from './aiPanels/MaterialAiHub';
import { PublishAiHub } from './aiPanels/PublishAiHub';
import { AnomalyAiHub } from './aiPanels/AnomalyAiHub';

interface TaskDetailViewProps {
  task: ExecutionTask;
  categoryQueue: ExecutionTask[];
  onSelectTask: (task: ExecutionTask) => void;
  onBack: () => void;
  onUpdateTask: (updated: ExecutionTask) => void;
  onNextTask?: () => void;
  initialAction?: ExecutionAction;
}

function getDefaultMaterialTasks(projectId: string): GeneratedMaterialTask[] {
  if (projectId === 'p89') {
    return [
      {
        id: 'gen-task-hotel-1',
        requirement: '回传宴会厅采光、落地窗与布场全景实拍',
        assigneeRole: 'KOC体验官',
        assigneeName: '试菜体验官_晴晴',
        deadline: '明天 18:00',
        status: 'pending',
        selectedForBatch: false,
        isCustom: false
      },
      {
        id: 'gen-task-hotel-2',
        requirement: '回传试菜现场主菜、菜单名牌与餐桌细节',
        assigneeRole: 'KOC体验官',
        assigneeName: '试菜体验官_晴晴',
        deadline: '后天 18:00',
        status: 'pending',
        selectedForBatch: false,
        isCustom: false
      }
    ];
  }

  return [
    {
      id: 'gen-task-1',
      requirement: '拍摄幼犬进食场景高清特写（需体现食欲与产品颗粒）',
      assigneeRole: 'KOC体验官',
      assigneeName: '小红薯_汪汪队',
      deadline: '明天 18:00',
      status: 'pending',
      selectedForBatch: false,
      isCustom: false
    },
    {
      id: 'gen-task-2',
      requirement: '拍摄新旧粮颗粒细节对比图（手持量杯参照）',
      assigneeRole: '门店KOS',
      assigneeName: '张店长 (陆家嘴店)',
      deadline: '今天 22:00',
      status: 'pending',
      selectedForBatch: false,
      isCustom: false
    }
  ];
}

function getInitialMaterialTasks(task: ExecutionTask): GeneratedMaterialTask[] {
  if (!task.generatedMaterialTasks?.length) return getDefaultMaterialTasks(task.projectId);

  return task.generatedMaterialTasks.map(item => ({
    id: item.id,
    requirement: item.requirement,
    assigneeRole: '执行人',
    assigneeName: item.assignee,
    deadline: item.deadline,
    status: item.status === '已派发' ? 'sent' : 'pending',
    selectedForBatch: false,
    isCustom: true
  }));
}

export function TaskDetailView({
  task,
  categoryQueue,
  onSelectTask,
  onBack,
  onUpdateTask,
  onNextTask,
  initialAction
}: TaskDetailViewProps) {
  const availableLibraryMaterials = useMemo(
    () => getProjectLibraryMaterials(task.projectId),
    [task.projectId]
  );

  // Content editing state
  const [draftTitle, setDraftTitle] = useState(task.draftTitle || task.noteTitle || '');
  const [draftBody, setDraftBody] = useState(task.draftBody || '');
  const [tags, setTags] = useState<string[]>(task.tags || []);
  const [selectedTagIndex, setSelectedTagIndex] = useState<number | null>(null);
  const [newTagInput, setNewTagInput] = useState('');
  const [showAddTag, setShowAddTag] = useState(false);

  // Material Matching & Task Generation State (for Note Confirmation Flow)
  const [selectedCoverUrl, setSelectedCoverUrl] = useState<string>(
    task.selectedCoverUrl || task.selectedMaterialAssets?.[0]?.url || getProjectLibraryMaterials(task.projectId)[0]?.url || ''
  );
  const [selectedMaterialAssets, setSelectedMaterialAssets] = useState<LibraryMaterialItem[]>(
    task.selectedMaterialAssets || getProjectLibraryMaterials(task.projectId).slice(0, 2)
  );
  const [generatedMaterialTasks, setGeneratedMaterialTasks] = useState<GeneratedMaterialTask[]>(
    getInitialMaterialTasks(task)
  );

  // Material Library Modal & Task Generation Modal State
  const [showLibraryModal, setShowLibraryModal] = useState<boolean>(false);
  const [materialFilterCategory, setMaterialFilterCategory] = useState<string>('all');
  const [showCreateTaskModal, setShowCreateTaskModal] = useState<boolean>(false);
  const [newTaskRequirement, setNewTaskRequirement] = useState<string>('');
  const [newTaskAssignee, setNewTaskAssignee] = useState<string>('小红薯_汪汪队');
  const [newTaskDeadline, setNewTaskDeadline] = useState<string>('明天 18:00');

  // Merge & Batch Send Modal State
  const [showBatchSendModal, setShowBatchSendModal] = useState<boolean>(false);
  const [batchTargetStaff, setBatchTargetStaff] = useState<string>('张店长 (陆家嘴店)');
  const [batchNoteMemo, setBatchNoteMemo] = useState<string>('请在规定时间内完成拍摄并从小程序回传，重点突出真实场景');

  // Selection-Aware AI Collaboration State
  const [selectionTarget, setSelectionTarget] = useState<SelectionTargetType>(null);
  const [selectedTextExcerpt, setSelectedTextExcerpt] = useState<string>('');
  const [userAIPrompt, setUserAIPrompt] = useState<string>('');
  const [isAIGenerating, setIsAIGenerating] = useState<boolean>(false);
  const [activeAIProposal, setActiveAIProposal] = useState<SelectionAIProposal | null>(null);

  // Reshoot dialog state for material sub-item
  const [reshootTargetItem, setReshootTargetItem] = useState<MaterialSubItem | null>(null);
  const [reshootInputReason, setReshootInputReason] = useState('');

  // Image preview modal state
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  // Data sync QR Code modal state
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrVerified, setQrVerified] = useState(false);

  // Reassign modal state
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [reassignedAssignee, setReassignedAssignee] = useState('李店长 (静安店)');

  // Collapsible panels
  const [isEvidenceOpen, setIsEvidenceOpen] = useState(false);
  const [isStrategyOpen, setIsStrategyOpen] = useState(false);
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);

  // Toast feedback
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  useEffect(() => {
    // 同一类操作共用一个工作台；切换笔记时必须以新任务的数据重置，
    // 避免上一篇笔记的文案、素材或弹窗状态残留到下一篇。
    setDraftTitle(task.draftTitle || task.noteTitle || '');
    setDraftBody(task.draftBody || '');
    setTags(task.tags || []);
    setSelectedTagIndex(null);
    setNewTagInput('');
    setShowAddTag(false);

    setSelectedCoverUrl(
      task.selectedCoverUrl || task.selectedMaterialAssets?.[0]?.url || getProjectLibraryMaterials(task.projectId)[0]?.url || ''
    );
    setSelectedMaterialAssets(
      task.selectedMaterialAssets || getProjectLibraryMaterials(task.projectId).slice(0, 2)
    );
    setGeneratedMaterialTasks(
      getInitialMaterialTasks(task)
    );

    setShowLibraryModal(false);
    setMaterialFilterCategory('all');
    setShowCreateTaskModal(initialAction === 'create_material_task');
    setNewTaskRequirement('');
    setShowBatchSendModal(false);
    setSelectionTarget(
      initialAction === 'replace_material' || initialAction === 'create_material_task'
        ? 'material_recommendation'
        : null
    );
    setSelectedTextExcerpt('');
    setUserAIPrompt('');
    setIsAIGenerating(false);
    setActiveAIProposal(null);
    setReshootTargetItem(null);
    setReshootInputReason('');
    setPreviewImageUrl(null);
    setShowQrModal(false);
    setQrVerified(false);
    setShowReassignModal(false);
    setIsEvidenceOpen(false);
    setIsStrategyOpen(false);
    setIsTimelineOpen(false);
    setFeedbackMessage(null);
  }, [initialAction, task]);

  const showToast = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  // Selection handlers
  const handleSelectTitle = () => {
    setSelectionTarget('title');
    setSelectedTextExcerpt(draftTitle);
    setActiveAIProposal(null);
    setUserAIPrompt('');
  };

  const handleBodySelection = () => {
    const selection = window.getSelection()?.toString().trim();
    if (selection && selection.length > 3) {
      setSelectionTarget('body_paragraph');
      setSelectedTextExcerpt(selection);
    } else {
      setSelectionTarget('body_all');
      setSelectedTextExcerpt(draftBody.slice(0, 120) + '...');
    }
    setActiveAIProposal(null);
    setUserAIPrompt('');
  };

  const handleSelectTag = (index: number) => {
    setSelectedTagIndex(index);
    setSelectionTarget('tags');
    setSelectedTextExcerpt(tags[index]);
    setActiveAIProposal(null);
    setUserAIPrompt('');
  };

  // Generate AI Proposal based on selection
  const handleGenerateAIProposal = (promptOverride?: string) => {
    const prompt = promptOverride || userAIPrompt || '优化表达，更符合自然种草口吻';
    setIsAIGenerating(true);

    setTimeout(() => {
      setIsAIGenerating(false);

      if (selectionTarget === 'title') {
        if (prompt.includes('痛点') || prompt.includes('软便')) {
          setActiveAIProposal({
            target: 'title',
            selectedExcerpt: draftTitle,
            originalText: draftTitle,
            suggestedText: '幼犬换粮软便别慌！宠物店长教你7天科学过渡法',
            reason: '突出“软便”高频搜索痛点词，强化店长专业身份与避坑情绪，提升点击率',
            impactScope: '仅修改笔记标题，正文与话题保持不变'
          });
        } else {
          setActiveAIProposal({
            target: 'title',
            selectedExcerpt: draftTitle,
            originalText: draftTitle,
            suggestedText: '新手铲屎官必看：幼犬7天科学换粮实操指南（附防软便技巧）',
            reason: '强化目标人群“新手铲屎官”，增加“实操指南”结构感',
            impactScope: '仅修改笔记标题，正文与话题保持不变'
          });
        }
      } else if (selectionTarget === 'body_paragraph' || selectionTarget === 'body_all') {
        const excerpt = selectedTextExcerpt;
        if (excerpt.includes('专利级') || prompt.includes('功效') || prompt.includes('合规')) {
          setActiveAIProposal({
            target: selectionTarget,
            selectedExcerpt: excerpt,
            originalText: '专利级益生菌配方',
            suggestedText: '特定多联益生菌过渡',
            reason: '规避无专利证书编号的医疗/绝对化宣传词，符合广告法，保护笔记推荐权重',
            impactScope: '仅替换选中的功效描述语句，不改变段落其余内容'
          });
        } else if (prompt.includes('口语') || prompt.includes('店长')) {
          setActiveAIProposal({
            target: selectionTarget,
            selectedExcerpt: excerpt,
            originalText: excerpt,
            suggestedText: excerpt.replace('遇到软便、拉稀，急得团团转！', '一看到便便软就慌了神，其实先别急～'),
            reason: '增强宠物店长亲切交流感，语气更自然口语化',
            impactScope: '仅优化选中段落的语气用词'
          });
        } else {
          setActiveAIProposal({
            target: selectionTarget,
            selectedExcerpt: excerpt,
            originalText: excerpt,
            suggestedText: excerpt + '\n\n💡 店长提醒：换粮期间切忌喂食过多零食，保持饮水充足。',
            reason: '根据门店经验补充实用避坑细节，增加种草可信度',
            impactScope: '仅对选中段落补充店长贴士'
          });
        }
      } else if (selectionTarget === 'tags') {
        setActiveAIProposal({
          target: 'tags',
          selectedExcerpt: selectedTagIndex !== null ? tags[selectedTagIndex] : '话题列表',
          originalText: selectedTagIndex !== null ? tags[selectedTagIndex] : '',
          suggestedText: '幼犬玻璃胃',
          reason: '项目词簇中“幼犬玻璃胃”与换粮痛点搜索高度相关，替换宽泛话题',
          impactScope: '替换当前选中的话题标签'
        });
      }
    }, 450);
  };

  // Apply AI proposal to the selected content
  const handleApplyAIProposal = () => {
    if (!activeAIProposal) return;

    if (activeAIProposal.target === 'title') {
      setDraftTitle(activeAIProposal.suggestedText);
      showToast('已将AI建议应用到标题');
    } else if (activeAIProposal.target === 'body_paragraph' || activeAIProposal.target === 'body_all') {
      if (draftBody.includes(activeAIProposal.originalText)) {
        setDraftBody(draftBody.replace(activeAIProposal.originalText, activeAIProposal.suggestedText));
      } else {
        setDraftBody(draftBody + '\n' + activeAIProposal.suggestedText);
      }
      showToast('已将AI建议应用到正文选中内容');
    } else if (activeAIProposal.target === 'tags') {
      if (selectedTagIndex !== null) {
        const nextTags = [...tags];
        nextTags[selectedTagIndex] = activeAIProposal.suggestedText;
        setTags(nextTags);
        showToast('已更新话题标签');
      }
    }
    setActiveAIProposal(null);
  };

  const handleDiscardAIProposal = () => {
    setActiveAIProposal(null);
    showToast('已保留原文');
  };

  // === Material Matching & Task Dispatch Handlers (for Note Confirmation Flow) ===
  const handleSelectMaterialCover = (mat: LibraryMaterialItem) => {
    setSelectedCoverUrl(mat.url);
    // If not already in selected list, add it
    if (!selectedMaterialAssets.some(a => a.id === mat.id)) {
      setSelectedMaterialAssets(prev => [mat, ...prev]);
    }
    showToast(`已将《${mat.title}》设为本篇笔记推荐封面`);
  };

  const handleToggleMaterialAsset = (mat: LibraryMaterialItem) => {
    if (selectedMaterialAssets.some(a => a.id === mat.id)) {
      setSelectedMaterialAssets(prev => prev.filter(a => a.id !== mat.id));
      showToast(`已移出素材《${mat.title}》`);
    } else {
      setSelectedMaterialAssets(prev => [...prev, mat]);
      showToast(`已从素材库选用《${mat.title}》`);
    }
  };

  const handleCreateNewMaterialTask = () => {
    if (!newTaskRequirement.trim()) return;
    const newTask: GeneratedMaterialTask = {
      id: `gen-task-${Date.now()}`,
      requirement: newTaskRequirement.trim(),
      assigneeRole: newTaskAssignee.includes('店长') ? '门店KOS' : 'KOC体验官',
      assigneeName: newTaskAssignee,
      deadline: newTaskDeadline,
      status: 'pending',
      selectedForBatch: false,
      isCustom: true
    };
    setGeneratedMaterialTasks(prev => [...prev, newTask]);
    setNewTaskRequirement('');
    setShowCreateTaskModal(false);
    showToast('已生成新素材拍摄任务并加入待下发列表');
  };

  const handleDeleteGeneratedTask = (id: string) => {
    setGeneratedMaterialTasks(prev => prev.filter(t => t.id !== id));
    showToast('已移除该素材任务');
  };

  const handleToggleTaskBatchSelect = (id: string) => {
    setGeneratedMaterialTasks(prev => 
      prev.map(t => t.id === id ? { ...t, selectedForBatch: !t.selectedForBatch } : t)
    );
  };

  const handleSelectAllPendingTasksForBatch = (select: boolean) => {
    setGeneratedMaterialTasks(prev => 
      prev.map(t => t.status === 'pending' ? { ...t, selectedForBatch: select } : t)
    );
  };

  const handleExecuteBatchMergeAndSend = () => {
    const selectedTasks = generatedMaterialTasks.filter(t => t.selectedForBatch && t.status === 'pending');
    if (selectedTasks.length === 0) return;

    // Mark them as sent / merged
    setGeneratedMaterialTasks(prev => 
      prev.map(t => t.selectedForBatch ? { ...t, status: 'sent', selectedForBatch: false, assigneeName: batchTargetStaff } : t)
    );

    setShowBatchSendModal(false);
    showToast(`已将 ${selectedTasks.length} 项素材拍摄要求合并派发给【${batchTargetStaff}】！`);
  };

  // === Content Actions ===
  const handleConfirmNoteContent = () => {
    const updated: ExecutionTask = {
      ...task,
      draftTitle,
      draftBody,
      tags,
      selectedCoverUrl,
      selectedMaterialAssets,
      generatedMaterialTasks,
      status: '已完成',
      isAnomaly: false,
      operatorActionSummary: '笔记正文与素材方案已确认定稿，已自动进入素材待办/拍摄流转',
      waitingParty: '已完成',
      waitingRole: 'completed',
      isMeWaiting: false,
      isBlocked: false,
      timelineEvents: [
        ...task.timelineEvents,
        {
          id: `evt-${Date.now()}`,
          time: '刚刚',
          actor: '操盘手',
          action: `确认笔记定稿（已选封面与${selectedMaterialAssets.length}张素材库图，派发${generatedMaterialTasks.length}项素材任务）`
        }
      ]
    };
    onUpdateTask(updated);
    showToast('笔记确认定稿！系统已锁定图文方案并流转至【素材待办】。');
    if (onNextTask) {
      setTimeout(() => onNextTask(), 600);
    }
  };

  const handleSaveDraft = () => {
    const updated: ExecutionTask = {
      ...task,
      draftTitle,
      draftBody,
      tags,
      selectedCoverUrl,
      selectedMaterialAssets,
      generatedMaterialTasks,
      timelineEvents: [
        ...task.timelineEvents,
        {
          id: `evt-${Date.now()}`,
          time: '刚刚',
          actor: '操盘手',
          action: '保存正文、标签与素材方案草稿'
        }
      ]
    };
    onUpdateTask(updated);
    showToast('草稿已保存');
  };

  // === Material Actions ===
  const handleAcceptMaterialSubItem = (itemId: string) => {
    if (!task.materialSubItems) return;
    const nextItems = task.materialSubItems.map(item => 
      item.id === itemId ? { ...item, manualStatus: '已通过' as const } : item
    );
    const updated: ExecutionTask = {
      ...task,
      materialSubItems: nextItems,
      timelineEvents: [
        ...task.timelineEvents,
        {
          id: `evt-${Date.now()}`,
          time: '刚刚',
          actor: '操盘手',
          action: `人工验收通过素材项`
        }
      ]
    };
    onUpdateTask(updated);
    showToast('该素材项已验收通过');
  };

  const handleReshootSubmit = () => {
    if (!reshootTargetItem || !reshootInputReason.trim() || !task.materialSubItems) return;
    const nextItems = task.materialSubItems.map(item => 
      item.id === reshootTargetItem.id 
        ? { ...item, manualStatus: '需补拍' as const, reshootReason: reshootInputReason }
        : item
    );
    const updated: ExecutionTask = {
      ...task,
      materialSubItems: nextItems,
      timelineEvents: [
        ...task.timelineEvents,
        {
          id: `evt-${Date.now()}`,
          time: '刚刚',
          actor: '操盘手',
          action: `退回素材并下发补拍要求: ${reshootInputReason}`
        }
      ]
    };
    onUpdateTask(updated);
    setReshootTargetItem(null);
    setReshootInputReason('');
    showToast('补拍要求已下发给执行人');
  };

  const handleFinishMaterialAcceptance = () => {
    const updated: ExecutionTask = {
      ...task,
      status: '已完成',
      isAnomaly: false,
      operatorActionSummary: '素材已全部验收通过，已生成手动发布任务',
      waitingParty: '已完成',
      waitingRole: 'completed',
      isMeWaiting: false,
      isBlocked: false,
      timelineEvents: [
        ...task.timelineEvents,
        {
          id: `evt-${Date.now()}`,
          time: '刚刚',
          actor: '操盘手',
          action: '完成素材验收，系统自动生成手动发布任务'
        }
      ]
    };
    onUpdateTask(updated);
    showToast('素材验收完成！系统已自动生成对应执行人的【手动发布任务包】。');
    if (onNextTask) {
      setTimeout(() => onNextTask(), 600);
    }
  };

  // === Publish Actions ===
  const handleConfirmPublishArchive = () => {
    const updated: ExecutionTask = {
      ...task,
      status: '已完成',
      isAnomaly: false,
      operatorActionSummary: '发布结果已核销并归档，进入数据归集',
      waitingParty: '已完成',
      waitingRole: 'completed',
      isMeWaiting: false,
      isBlocked: false,
      timelineEvents: [
        ...task.timelineEvents,
        {
          id: `evt-${Date.now()}`,
          time: '刚刚',
          actor: '操盘手',
          action: '核销小红书发布结果并归档，开启后效数据归集'
        }
      ]
    };
    onUpdateTask(updated);
    showToast('发布结果已核销并归档！已自动接入数据归集监控。');
    if (onNextTask) {
      setTimeout(() => onNextTask(), 600);
    }
  };

  // === Anomaly Recovery Actions ===
  const handleReassignExecutor = () => {
    const updated: ExecutionTask = {
      ...task,
      waitingParty: reassignedAssignee,
      waitingRole: 'team',
      isAnomaly: false,
      isMeWaiting: false,
      isBlocked: false,
      timelineEvents: [
        ...task.timelineEvents,
        {
          id: `evt-${Date.now()}`,
          time: '刚刚',
          actor: '操盘手',
          action: `重新指派执行人给【${reassignedAssignee}】`
        }
      ]
    };
    onUpdateTask(updated);
    setShowReassignModal(false);
    showToast(`任务已成功重新指派给 ${reassignedAssignee}`);
  };

  const handleVerifyQrSuccess = () => {
    setQrVerified(true);
    setTimeout(() => {
      const updated: ExecutionTask = {
        ...task,
        status: '已完成',
        isAnomaly: false,
        isMeWaiting: false,
        isBlocked: false,
        operatorActionSummary: '创作者数据同步授权已更新',
        timelineEvents: [
          ...task.timelineEvents,
          {
            id: `evt-${Date.now()}`,
            time: '刚刚',
            actor: '操盘手',
            action: '扫码更新小红书创作者服务平台数据同步授权'
          }
        ]
      };
      onUpdateTask(updated);
      setShowQrModal(false);
      showToast('数据归集授权已更新，系统将自动补齐缺失数据');
    }, 600);
  };

  const handleRemindExecutor = () => {
    const updated: ExecutionTask = {
      ...task,
      timelineEvents: [
        ...task.timelineEvents,
        {
          id: `evt-${Date.now()}`,
          time: '刚刚',
          actor: '操盘手',
          action: '向执行人发送微信/短信催促提醒'
        }
      ]
    };
    onUpdateTask(updated);
    showToast('已向执行人发送催促提醒通知');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-canvas overflow-hidden">
      
      {/* Toast Feedback */}
      {feedbackMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-neutral-900 text-white text-[12.5px] rounded-lg shadow-dialog flex items-center gap-2 animate-in fade-in duration-150">
          <CheckCircle2 size={15} className="text-emerald-400" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <div className="h-13 px-5 bg-surface border-b border-border-default flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors flex items-center gap-1 text-[12.5px]"
          >
            <ArrowLeft size={16} />
            <span>返回执行中心</span>
          </button>
          <span className="text-border-strong">/</span>
          <span className="text-[13px] font-semibold text-text-primary truncate max-w-md">
            {task.title}
          </span>
          <span className="text-[11.5px] text-text-tertiary">
            ({task.projectName})
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="px-3 py-1.5 text-[12.5px] font-medium text-text-secondary hover:text-text-primary hover:bg-surface-hover border border-border-default rounded-lg transition-colors"
          >
            保存草稿
          </button>

          {onNextTask && (
            <button
              type="button"
              onClick={onNextTask}
              className="px-3.5 py-1.5 text-[12.5px] font-medium text-text-primary bg-surface-subtle hover:bg-surface-hover border border-border-default rounded-lg transition-colors flex items-center gap-1.5"
            >
              <span>查看下一项</span>
              <ArrowRight size={14} className="text-text-secondary" />
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area: 3-column Layout */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        
        {/* Column 1: Left Queue Sidebar (240px) */}
        <div className="w-60 border-r border-border-default bg-surface flex flex-col shrink-0">
          <div className="p-3 border-b border-border-subtle bg-surface-subtle flex items-center justify-between">
            <span className="text-[12px] font-semibold text-text-secondary">同类待处理队列</span>
            <span className="text-[11px] text-text-tertiary">{categoryQueue.length} 项</span>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {categoryQueue.map(qTask => {
              const isCurrent = qTask.id === task.id;
              return (
                <button
                  key={qTask.id}
                  type="button"
                  onClick={() => onSelectTask(qTask)}
                  className={`w-full text-left p-2.5 rounded-lg text-[12px] transition-all relative ${
                    isCurrent 
                      ? 'bg-surface-selected text-text-primary font-medium' 
                      : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                  }`}
                >
                  {isCurrent && (
                    <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-brand-500 rounded-r" />
                  )}
                  <div className="line-clamp-2 leading-snug">{qTask.title}</div>
                  <div className="flex items-center justify-between text-[11px] text-text-tertiary mt-1.5">
                    <span className="truncate max-w-[120px]">{qTask.targetAccount}</span>
                    {qTask.isBlocked && (
                      <span className="text-amber-700 font-medium shrink-0">阻断</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Column 2: Center Editor / Inspector Area (Flex-1) */}
        <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-5 bg-canvas">
          
          {/* Top Intervention Banner: You need to do / Why intervention is needed */}
          <div className="p-4 bg-surface border border-border-default rounded-xl space-y-2.5">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[14px] font-semibold text-text-primary flex items-center gap-2">
                  <span>{task.operatorActionSummary}</span>
                  {task.isBlocked && (
                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                      阻断后续流转
                    </span>
                  )}
                </div>
                <div className="text-[12.5px] text-text-secondary mt-1">
                  <strong>介入原因：</strong>{task.reasonForIntervention}
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-[11.5px] text-text-tertiary">处理截止</div>
                <div className={`text-[12.5px] font-medium ${task.deadlineLabel === '已逾期' ? 'text-rose-600' : 'text-text-primary'}`}>
                  {task.deadline || '未设置'}
                </div>
              </div>
            </div>

            {/* Confirmed facts */}
            {task.confirmedFacts && task.confirmedFacts.length > 0 && (
              <div className="pt-2.5 border-t border-border-subtle flex items-start gap-2 text-[12px] text-text-secondary">
                <ShieldCheck size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-medium text-text-primary">已确认事实：</span>
                  {task.confirmedFacts.map((fact, i) => (
                    <span key={i} className="inline-block mr-3">· {fact}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* === A. 笔记确认交互 (Content Review) === */}
          {task.operatorCategory === 'content' && (
            <div className="space-y-4">
              
              {/* Title Section */}
              <div 
                onClick={handleSelectTitle}
                className={`p-4 bg-surface rounded-xl border transition-all cursor-pointer ${
                  selectionTarget === 'title' 
                    ? 'border-neutral-900 ring-2 ring-neutral-900/5' 
                    : 'border-border-default hover:border-border-strong'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[12px] font-semibold text-text-secondary flex items-center gap-1.5">
                    <span>笔记标题</span>
                    <span className="text-[11px] font-normal text-text-tertiary">（点击选中后可在右侧通过 AI 优化）</span>
                  </label>
                  {selectionTarget === 'title' && (
                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-neutral-900 text-white">
                      正在修改标题
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  value={draftTitle}
                  onChange={(e) => setDraftTitle(e.target.value)}
                  className="w-full text-[15px] font-semibold text-text-primary bg-transparent focus:outline-none border-b border-transparent focus:border-border-strong pb-1"
                  placeholder="请输入笔记标题..."
                />
              </div>

              {/* Body Section */}
              <div 
                onClick={handleBodySelection}
                className={`p-4 bg-surface rounded-xl border transition-all cursor-text ${
                  selectionTarget === 'body_paragraph' || selectionTarget === 'body_all'
                    ? 'border-neutral-900 ring-2 ring-neutral-900/5' 
                    : 'border-border-default hover:border-border-strong'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[12px] font-semibold text-text-secondary flex items-center gap-1.5">
                    <span>笔记正文</span>
                    <span className="text-[11px] font-normal text-text-tertiary">（划选文字或段落，AI 将只针对选中范围提供修改）</span>
                  </label>
                  {(selectionTarget === 'body_paragraph' || selectionTarget === 'body_all') && (
                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-neutral-900 text-white">
                      {selectionTarget === 'body_paragraph' ? '已选中局部段落' : '正在修改整篇正文'}
                    </span>
                  )}
                </div>
                <textarea
                  rows={8}
                  value={draftBody}
                  onChange={(e) => setDraftBody(e.target.value)}
                  className="w-full text-[13.5px] leading-relaxed text-text-primary bg-transparent focus:outline-none resize-none font-normal"
                  placeholder="请输入笔记正文..."
                />
                <div className="text-[11.5px] text-text-tertiary text-right pt-2 border-t border-border-subtle">
                  当前字数：{draftBody.length} 字
                </div>
              </div>

              {/* Tags Section */}
              <div className="p-4 bg-surface rounded-xl border border-border-default space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-[12px] font-semibold text-text-secondary">
                    话题标签（点击标签可通过 AI 调整）
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowAddTag(!showAddTag)}
                    className="text-[11.5px] text-text-secondary hover:text-text-primary flex items-center gap-1 font-medium"
                  >
                    <Plus size={13} />
                    <span>添加标签</span>
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {tags.map((tag, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectTag(idx)}
                      className={`px-3 py-1 rounded-md text-[12px] transition-all flex items-center gap-1.5 ${
                        selectedTagIndex === idx && selectionTarget === 'tags'
                          ? 'bg-neutral-900 text-white font-medium shadow-sm'
                          : 'bg-surface-subtle hover:bg-surface-hover text-text-secondary border border-border-default'
                      }`}
                    >
                      <span>#{tag}</span>
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          setTags(tags.filter((_, i) => i !== idx));
                        }}
                        className="hover:text-rose-400 transition-colors ml-0.5"
                      >
                        ×
                      </span>
                    </button>
                  ))}

                  {showAddTag && (
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={newTagInput}
                        onChange={(e) => setNewTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && newTagInput.trim()) {
                            setTags([...tags, newTagInput.trim()]);
                            setNewTagInput('');
                            setShowAddTag(false);
                          }
                        }}
                        placeholder="输入新标签按回车"
                        className="px-2.5 py-1 text-[12px] bg-surface border border-border-default rounded-md focus:outline-none focus:border-neutral-900 w-32"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Material Module (素材模块 - 支持素材中心匹配/选图/生成拍摄任务/合并派发) */}
              <div 
                id="material-section"
                onClick={() => {
                  setSelectionTarget('material_recommendation');
                  setActiveAIProposal(null);
                  setUserAIPrompt('');
                }}
                className={`p-4 bg-surface rounded-xl border transition-all cursor-pointer space-y-3.5 ${
                  selectionTarget === 'material_recommendation'
                    ? 'border-neutral-900 ring-2 ring-neutral-900/5'
                    : 'border-border-default hover:border-border-strong'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ImageIcon size={15} className="text-text-secondary" />
                    <label className="text-[13px] font-semibold text-text-primary">
                      笔记素材与封面方案
                    </label>
                    <span className="text-[11px] font-normal text-text-tertiary">
                      （点击此模块，右侧将展开素材库推荐与选图）
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {selectionTarget === 'material_recommendation' && (
                      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-neutral-900 text-white">
                        右侧已展开素材推荐
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowLibraryModal(true);
                      }}
                      className="px-2.5 py-1 bg-surface-subtle hover:bg-surface-hover text-text-secondary hover:text-text-primary border border-border-default rounded-md text-[11.5px] font-medium transition-colors flex items-center gap-1"
                    >
                      <FolderPlus size={13} />
                      <span>素材库选图</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowCreateTaskModal(true);
                      }}
                      className="px-2.5 py-1 bg-surface-subtle hover:bg-surface-hover text-text-secondary hover:text-text-primary border border-border-default rounded-md text-[11.5px] font-medium transition-colors flex items-center gap-1"
                    >
                      <Plus size={13} />
                      <span>生成素材任务</span>
                    </button>
                  </div>
                </div>

                {/* 1. Selected Cover & Assets Preview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                  
                  {/* Selected Cover Banner */}
                  <div className="p-2.5 bg-surface-subtle rounded-lg border border-border-default flex gap-3 items-center">
                    <div className="relative w-16 h-16 rounded-md overflow-hidden bg-neutral-100 shrink-0 border border-border-subtle group">
                      <img
                        src={selectedCoverUrl}
                        alt="推荐封面"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewImageUrl(selectedCoverUrl);
                        }}
                        className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                      >
                        <Maximize2 size={12} />
                      </button>
                    </div>
                    <div className="space-y-0.5 overflow-hidden">
                      <div className="flex items-center gap-1 text-[10.5px] font-semibold text-rose-700">
                        <Sparkle size={11} />
                        <span>已选推荐封面</span>
                      </div>
                      <div className="text-[12px] font-medium text-text-primary truncate">
                        点击右侧更换封面
                      </div>
                      <div className="text-[11px] text-text-tertiary">
                        自动适配 3:4 小红书大图
                      </div>
                    </div>
                  </div>

                  {/* Selected Library Assets Summary */}
                  <div className="p-2.5 bg-surface-subtle rounded-lg border border-border-default md:col-span-2 flex items-center justify-between">
                    <div className="space-y-1 overflow-hidden">
                      <div className="text-[11.5px] font-medium text-text-secondary flex items-center gap-1.5">
                        <span>已从素材中心选用</span>
                        <span className="font-semibold text-text-primary">({selectedMaterialAssets.length} 张)</span>
                      </div>
                      <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
                        {selectedMaterialAssets.slice(0, 5).map((asset) => (
                          <div key={asset.id} className="relative w-8 h-8 rounded border border-border-default overflow-hidden shrink-0 group">
                            <img src={asset.url} alt={asset.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleMaterialAsset(asset);
                              }}
                              className="absolute inset-0 bg-rose-600/80 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center text-[9px] transition-opacity"
                            >
                              <X size={10} />
                            </button>
                          </div>
                        ))}
                        {selectedMaterialAssets.length > 5 && (
                          <div className="w-8 h-8 rounded bg-surface border border-border-default flex items-center justify-center text-[10px] text-text-tertiary shrink-0">
                            +{selectedMaterialAssets.length - 5}
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowLibraryModal(true);
                      }}
                      className="text-[11.5px] text-text-secondary hover:text-text-primary font-medium shrink-0 ml-2"
                    >
                      去选图 →
                    </button>
                  </div>

                </div>

                {/* 2. Generated Material Tasks for Employees */}
                <div className="pt-2 border-t border-border-subtle space-y-2">
                  
                  <div className="flex items-center justify-between">
                    <div className="text-[12px] font-semibold text-text-primary flex items-center gap-2">
                      <Camera size={13} className="text-text-secondary" />
                      <span>缺口拍摄任务 ({generatedMaterialTasks.length})</span>
                      <span className="text-[11px] font-normal text-text-tertiary">
                        若素材库不足可生成拍摄任务，勾选多项可合并派发给员工
                      </span>
                    </div>

                    {/* Batch Merge & Send Action */}
                    {generatedMaterialTasks.some(t => t.status === 'pending') && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const allSelected = generatedMaterialTasks.filter(t => t.status === 'pending').every(t => t.selectedForBatch);
                            handleSelectAllPendingTasksForBatch(!allSelected);
                          }}
                          className="text-[11px] text-text-secondary hover:text-text-primary flex items-center gap-1"
                        >
                          {generatedMaterialTasks.filter(t => t.status === 'pending').every(t => t.selectedForBatch) ? (
                            <CheckSquare size={12} className="text-text-primary" />
                          ) : (
                            <Square size={12} className="text-text-tertiary" />
                          )}
                          <span>全选</span>
                        </button>

                        <button
                          type="button"
                          disabled={!generatedMaterialTasks.some(t => t.selectedForBatch && t.status === 'pending')}
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowBatchSendModal(true);
                          }}
                          className="px-2.5 py-1 bg-action-primary hover:bg-action-primary-hover text-white rounded text-[11px] font-semibold transition-colors disabled:opacity-40 flex items-center gap-1"
                        >
                          <Users size={11} />
                          <span>合并派发任务 ({generatedMaterialTasks.filter(t => t.selectedForBatch && t.status === 'pending').length})</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Tasks List */}
                  <div className="space-y-1.5">
                    {generatedMaterialTasks.length === 0 ? (
                      <div className="p-3 text-center text-[12px] text-text-tertiary bg-surface-subtle rounded-lg border border-border-subtle">
                        暂无拍摄缺口任务，素材均已从素材中心匹配完成。
                      </div>
                    ) : (
                      generatedMaterialTasks.map((t) => (
                        <div
                          key={t.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (t.status === 'pending') handleToggleTaskBatchSelect(t.id);
                          }}
                          className={`p-2.5 rounded-lg border text-[12px] flex items-center justify-between transition-all ${
                            t.status === 'sent'
                              ? 'bg-surface-subtle border-border-subtle text-text-secondary'
                              : t.selectedForBatch
                              ? 'bg-neutral-50 border-neutral-900 ring-1 ring-neutral-900/10'
                              : 'bg-surface border-border-default hover:border-border-strong'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 overflow-hidden">
                            {t.status === 'pending' ? (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleTaskBatchSelect(t.id);
                                }}
                                className="shrink-0 text-text-primary"
                              >
                                {t.selectedForBatch ? (
                                  <CheckSquare size={14} className="text-neutral-900" />
                                ) : (
                                  <Square size={14} className="text-text-tertiary" />
                                )}
                              </button>
                            ) : (
                              <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                            )}

                            <div className="truncate">
                              <span className="font-medium text-text-primary mr-2">{t.requirement}</span>
                              <span className="text-[11px] text-text-tertiary font-normal">
                                执行人：{t.assigneeName} ({t.assigneeRole}) · 截止：{t.deadline}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 ml-2">
                            {t.status === 'sent' ? (
                              <span className="px-2 py-0.5 rounded text-[10.5px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                                已派发
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10.5px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                                待下发
                              </span>
                            )}
                            {t.status === 'pending' && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteGeneratedTask(t.id);
                                }}
                                className="text-text-tertiary hover:text-rose-500 transition-colors p-1"
                              >
                                <Trash2 size={12} />
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                </div>

              </div>

              {/* Action Bar */}
              <div className="p-4 bg-surface-subtle border border-border-default rounded-xl flex items-center justify-between">
                <div className="text-[12px] text-text-secondary">
                  确认定稿将自动锁定文案与素材，并转入<strong>素材待办与发布核销</strong>流转。
                </div>
                <button
                  type="button"
                  onClick={handleConfirmNoteContent}
                  className="px-4 py-2 bg-action-primary hover:bg-action-primary-hover text-white rounded-lg text-[13px] font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Check size={15} />
                  <span>确认笔记并进入素材待办</span>
                </button>
              </div>

            </div>
          )}

          {/* === B. 素材验收交互 (Material Inspection) === */}
          {task.operatorCategory === 'material' && (
            <div className="space-y-4">
              
              {/* Matched / Uploaded Items List */}
              <div className="space-y-3">
                {task.materialSubItems?.map((item) => (
                  <div key={item.id} className="p-4 bg-surface rounded-xl border border-border-default space-y-3">
                    
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-[13px] font-semibold text-text-primary flex items-center gap-2">
                          <span>{item.requirement}</span>
                          {item.isRequired ? (
                            <span className="px-1.5 py-0.5 rounded text-[10.5px] font-medium bg-neutral-100 text-neutral-700">必需镜头</span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded text-[10.5px] font-medium bg-surface-subtle text-text-tertiary">可选镜头</span>
                          )}
                        </div>
                        <div className="text-[12px] text-emerald-700 mt-1 flex items-center gap-1">
                          <ShieldCheck size={13} />
                          <span>{item.autoCheckResult}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {item.manualStatus === '已通过' ? (
                          <span className="px-2.5 py-1 rounded-md text-[12px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                            <CheckCircle2 size={13} className="text-emerald-600" />
                            已验收通过
                          </span>
                        ) : item.manualStatus === '需补拍' ? (
                          <span className="px-2.5 py-1 rounded-md text-[12px] font-medium bg-rose-50 text-rose-800 border border-rose-200">
                            需补拍：{item.reshootReason || '要求重新拍摄'}
                          </span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setReshootTargetItem(item);
                                setReshootInputReason('');
                              }}
                              className="px-3 py-1.5 text-[12px] font-medium text-rose-700 hover:text-rose-800 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors"
                            >
                              要求补拍
                            </button>
                            <button
                              type="button"
                              onClick={() => handleAcceptMaterialSubItem(item.id)}
                              className="px-3 py-1.5 text-[12px] font-semibold text-white bg-action-primary hover:bg-action-primary-hover rounded-lg transition-colors flex items-center gap-1"
                            >
                              <Check size={13} />
                              <span>验收通过</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Image thumbnails & metadata */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      {item.uploadedAssets.map((asset) => (
                        <div key={asset.id} className="p-2.5 bg-surface-subtle rounded-lg border border-border-subtle flex items-start gap-3">
                          <div 
                            onClick={() => setPreviewImageUrl(asset.url)}
                            className="w-20 h-20 rounded-md overflow-hidden bg-black/5 shrink-0 relative group cursor-pointer"
                          >
                            <img src={asset.url} alt={asset.filename} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                              <Maximize2 size={16} />
                            </div>
                          </div>
                          <div className="flex-1 text-[11.5px] space-y-1 text-text-secondary">
                            <div className="font-medium text-text-primary truncate">{asset.filename}</div>
                            <div>分辨率：{asset.resolution} · {asset.fileSize}</div>
                            <div>比例：{asset.technicalCheck.aspectRatio} · 光线：{asset.technicalCheck.lightingQuality}</div>
                            <div className="text-text-tertiary text-[11px]">{asset.technicalCheck.summary}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                ))}
              </div>

              {/* Complete Material Acceptance Action Bar */}
              <div className="p-4 bg-surface-subtle border border-border-default rounded-xl flex items-center justify-between">
                <div className="text-[12px] text-text-secondary">
                  素材全部通过后，系统将自动生成<strong>员工手动发布任务</strong>并下发排期。
                </div>
                <button
                  type="button"
                  onClick={handleFinishMaterialAcceptance}
                  className="px-4 py-2 bg-action-primary hover:bg-action-primary-hover text-white rounded-lg text-[13px] font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Check size={15} />
                  <span>完成素材验收并生成手动发布任务</span>
                </button>
              </div>

            </div>
          )}

          {/* === C. 发布核销交互 (Publish Verification) === */}
          {task.operatorCategory === 'publish' && (
            <div className="space-y-4">
              
              {/* Notice for unverified status */}
              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2">
                <div className="text-[13.5px] font-semibold text-amber-900 flex items-center gap-2">
                  <AlertCircle size={16} className="text-amber-700" />
                  <span>回传结果待人工核销</span>
                </div>
                <div className="text-[12.5px] text-amber-800 leading-relaxed">
                  系统暂时无法确认该链接的公开状态，请根据执行者回传的链接或截图进行核销。
                </div>
              </div>

              {/* Returned Info Card */}
              <div className="p-4 bg-surface rounded-xl border border-border-default space-y-3">
                <div className="text-[13px] font-semibold text-text-primary border-b border-border-subtle pb-2">
                  执行者回传凭证
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[12.5px]">
                  <div>
                    <span className="text-text-secondary">发布账号：</span>
                    <strong className="text-text-primary">{task.targetAccount}</strong>
                  </div>
                  <div>
                    <span className="text-text-secondary">发布人：</span>
                    <span className="text-text-primary">{task.publisherName || '合作体验官'}</span>
                  </div>
                  <div>
                    <span className="text-text-secondary">回传发布时间：</span>
                    <span className="text-text-primary">{task.returnedData?.publishTime || '今天 08:15'}</span>
                  </div>
                  <div>
                    <span className="text-text-secondary">小红书链接：</span>
                    <a 
                      href={task.returnedData?.publishUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-brand-700 hover:underline font-mono inline-flex items-center gap-1 text-[12px]"
                    >
                      <span>{task.returnedData?.publishUrl}</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>

                {/* Screenshot preview */}
                {task.returnedData?.screenshotUrl && (
                  <div className="pt-2 border-t border-border-subtle">
                    <div className="text-[12px] font-medium text-text-secondary mb-2">发布截图回传：</div>
                    <div 
                      onClick={() => setPreviewImageUrl(task.returnedData?.screenshotUrl || null)}
                      className="w-32 h-44 rounded-lg border border-border-default overflow-hidden bg-black/5 cursor-pointer relative group"
                    >
                      <img src={task.returnedData.screenshotUrl} alt="发布截图" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                        <Maximize2 size={16} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Publish & Archive Action Bar */}
              <div className="p-4 bg-surface-subtle border border-border-default rounded-xl flex items-center justify-between">
                <div className="text-[12px] text-text-secondary">
                  核销通过后，内容将正式归档并接入<strong>后效数据归集</strong>与复盘监控。
                </div>
                <button
                  type="button"
                  onClick={handleConfirmPublishArchive}
                  className="px-4 py-2 bg-action-primary hover:bg-action-primary-hover text-white rounded-lg text-[13px] font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Check size={15} />
                  <span>确认发布并归档</span>
                </button>
              </div>

            </div>
          )}

          {/* === D. 异常处理交互 (Anomaly Handling) === */}
          {task.operatorCategory === 'anomaly' && (
            <div className="space-y-4">
              
              <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-xl space-y-2">
                <div className="text-[13.5px] font-semibold text-rose-900 flex items-center gap-2">
                  <AlertTriangle size={16} className="text-rose-600" />
                  <span>异常事实详情</span>
                </div>
                <div className="text-[12.5px] text-rose-800 leading-relaxed">
                  {task.currentOccurrence}
                </div>
              </div>

              {/* Recovery Action Form based on anomaly type */}
              <div className="p-4 bg-surface rounded-xl border border-border-default space-y-4">
                <div className="text-[13px] font-semibold text-text-primary border-b border-border-subtle pb-2">
                  人工纠偏与恢复动作
                </div>

                {task.anomalyType === 'data_sync_auth_expired' && (
                  <div className="space-y-3">
                    <div className="text-[12.5px] text-text-secondary">
                      小红书创作者服务平台的数据读取授权会话已过期，需要重新扫码以恢复数据归集。
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowQrModal(true)}
                      className="px-4 py-2 bg-action-primary hover:bg-action-primary-hover text-white rounded-lg text-[12.5px] font-semibold transition-colors flex items-center gap-2"
                    >
                      <QrCode size={15} />
                      <span>扫码更新数据授权</span>
                    </button>
                  </div>
                )}

                {task.anomalyType === 'executor_account_unavailable' && (
                  <div className="space-y-3">
                    <div className="text-[12.5px] text-text-secondary">
                      原定执行人反馈账号受限，建议重新指派备用门店账号或由操盘手代发。
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setShowReassignModal(true)}
                        className="px-4 py-2 bg-action-primary hover:bg-action-primary-hover text-white rounded-lg text-[12.5px] font-semibold transition-colors flex items-center gap-1.5"
                      >
                        <User size={15} />
                        <span>重新指派执行人</span>
                      </button>
                    </div>
                  </div>
                )}

                {task.anomalyType === 'material_reshoot_overdue' && (
                  <div className="space-y-3">
                    <div className="text-[12.5px] text-text-secondary">
                      创作者逾期未回传暖光海参特写，可一键催促或更换备用KOC。
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={handleRemindExecutor}
                        className="px-4 py-2 bg-action-primary hover:bg-action-primary-hover text-white rounded-lg text-[12.5px] font-semibold transition-colors flex items-center gap-1.5"
                      >
                        <Send size={14} />
                        <span>发送催促提醒</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowReassignModal(true)}
                        className="px-3.5 py-2 text-[12.5px] font-medium text-text-primary bg-surface-subtle hover:bg-surface-hover border border-border-default rounded-lg transition-colors"
                      >
                        重新派发任务
                      </button>
                    </div>
                  </div>
                )}

              </div>

            </div>
          )}

          {/* Secondary Collapsible Sections: Progressive Disclosure */}
          <div className="space-y-2 pt-2">
            
            {/* Strategy Context Accordion */}
            <div className="border border-border-default rounded-xl bg-surface overflow-hidden">
              <button
                type="button"
                onClick={() => setIsStrategyOpen(!isStrategyOpen)}
                className="w-full px-4 py-3 text-left flex items-center justify-between text-[12.5px] font-medium text-text-secondary hover:text-text-primary transition-colors"
              >
                <span>查看方案策略上下文</span>
                <ChevronDown size={15} className={`transition-transform ${isStrategyOpen ? 'rotate-180' : ''}`} />
              </button>
              {isStrategyOpen && (
                <div className="px-4 pb-4 pt-1 border-t border-border-subtle text-[12px] space-y-2 text-text-secondary bg-surface-subtle">
                  <div><strong>意图：</strong>{task.strategyContext?.intent || '通过科普建立信任'}</div>
                  <div><strong>人群：</strong>{task.strategyContext?.targetAudience || '幼犬初次养宠人群'}</div>
                  <div><strong>核心痛点：</strong>{task.strategyContext?.corePainPoint || '换粮软便'}</div>
                  <div><strong>关键词词簇：</strong>{task.strategyContext?.searchKeywords?.join('、') || '幼犬换粮、七日换粮法'}</div>
                </div>
              )}
            </div>

            {/* Timeline Accordion */}
            <div className="border border-border-default rounded-xl bg-surface overflow-hidden">
              <button
                type="button"
                onClick={() => setIsTimelineOpen(!isTimelineOpen)}
                className="w-full px-4 py-3 text-left flex items-center justify-between text-[12.5px] font-medium text-text-secondary hover:text-text-primary transition-colors"
              >
                <span>查看历史流转记录 ({task.timelineEvents.length})</span>
                <ChevronDown size={15} className={`transition-transform ${isTimelineOpen ? 'rotate-180' : ''}`} />
              </button>
              {isTimelineOpen && (
                <div className="px-4 pb-4 pt-2 border-t border-border-subtle text-[12px] space-y-2.5 bg-surface-subtle">
                  {task.timelineEvents.map((evt) => (
                    <div key={evt.id} className="flex items-start gap-2.5 text-[11.5px]">
                      <span className="text-text-tertiary shrink-0 font-mono">{evt.time}</span>
                      <strong className="text-text-primary shrink-0">{evt.actor}：</strong>
                      <span className="text-text-secondary">{evt.action}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Column 3: Task-Specific AI Coordination Hub */}
        {task.operatorCategory === 'material' ? (
          <MaterialAiHub
            task={task}
            onOpenReshootModal={(item, defaultReason) => {
              setReshootTargetItem(item);
              setReshootInputReason(defaultReason || '');
            }}
            onAcceptSubItem={(itemId) => {
              handleAcceptMaterialSubItem(itemId);
            }}
            showToast={showToast}
          />
        ) : task.operatorCategory === 'publish' ? (
          <PublishAiHub
            task={task}
            onConfirmPublishArchive={handleConfirmPublishArchive}
            showToast={showToast}
          />
        ) : task.operatorCategory === 'anomaly' ? (
          <AnomalyAiHub
            task={task}
            onOpenReassignModal={() => setShowReassignModal(true)}
            onOpenQrModal={() => setShowQrModal(true)}
            onRemindExecutor={handleRemindExecutor}
            onResolveAnomaly={(planTitle) => {
              const updated: ExecutionTask = {
                ...task,
                status: '已完成',
                isAnomaly: false,
                operatorActionSummary: `已执行异常处置：${planTitle}`,
                waitingParty: '已完成',
                waitingRole: 'completed',
                isMeWaiting: false,
                isBlocked: false,
                timelineEvents: [
                  ...task.timelineEvents,
                  {
                    id: `evt-${Date.now()}`,
                    time: '刚刚',
                    actor: '操盘手',
                    action: `执行异常处置方案：${planTitle}`
                  }
                ]
              };
              onUpdateTask(updated);
              showToast(`已成功执行【${planTitle}】，异常已解除！`);
              if (onNextTask) {
                setTimeout(() => onNextTask(), 600);
              }
            }}
            showToast={showToast}
          />
        ) : (
          <ContentAiHub
            task={task}
            draftTitle={draftTitle}
            setDraftTitle={setDraftTitle}
            draftBody={draftBody}
            setDraftBody={setDraftBody}
            tags={tags}
            setTags={setTags}
            selectedTagIndex={selectedTagIndex}
            setSelectedTagIndex={setSelectedTagIndex}
            selectionTarget={selectionTarget}
            setSelectionTarget={setSelectionTarget}
            selectedTextExcerpt={selectedTextExcerpt}
            setSelectedTextExcerpt={setSelectedTextExcerpt}
            selectedCoverUrl={selectedCoverUrl}
            setSelectedCoverUrl={setSelectedCoverUrl}
            selectedMaterialAssets={selectedMaterialAssets}
            setSelectedMaterialAssets={setSelectedMaterialAssets}
            onOpenLibraryModal={() => setShowLibraryModal(true)}
            onOpenCreateTaskModal={() => setShowCreateTaskModal(true)}
            showToast={showToast}
          />
        )}

      </div>

      {/* Reshoot Reason Input Modal */}
      {reshootTargetItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
          <div className="bg-surface border border-border-default rounded-xl shadow-dialog w-full max-w-md p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[14px] font-semibold text-text-primary">下发补拍要求</h3>
              <button onClick={() => setReshootTargetItem(null)} className="text-text-tertiary hover:text-text-primary">
                <X size={16} />
              </button>
            </div>
            <div className="text-[12.5px] text-text-secondary">
              针对镜头：<strong>{reshootTargetItem.requirement}</strong>
            </div>
            <div className="space-y-1.5">
              <label className="text-[12px] font-medium text-text-primary">补拍具体要求（将同步至执行人小程序）：</label>
              <textarea
                rows={3}
                value={reshootInputReason}
                onChange={(e) => setReshootInputReason(e.target.value)}
                placeholder="例如：请开启暖光灯在正上方俯拍，保持主产品光泽感与包装完整..."
                className="w-full px-3 py-2 text-[12.5px] bg-surface border border-border-default rounded-lg focus:outline-none focus:border-neutral-900"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setReshootTargetItem(null)}
                className="px-3.5 py-1.5 text-[12px] text-text-secondary hover:text-text-primary rounded-lg"
              >
                取消
              </button>
              <button
                type="button"
                disabled={!reshootInputReason.trim()}
                onClick={handleReshootSubmit}
                className="px-4 py-1.5 text-[12px] font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg disabled:opacity-50"
              >
                下发补拍要求
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImageUrl && (
        <div 
          onClick={() => setPreviewImageUrl(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6 backdrop-blur-sm cursor-zoom-out"
        >
          <img src={previewImageUrl} alt="Preview" className="max-w-full max-h-full rounded-lg object-contain" />
        </div>
      )}

      {/* QR Code Simulation Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
          <div className="bg-surface border border-border-default rounded-xl shadow-dialog w-full max-w-sm p-5 text-center space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-[14px] font-semibold text-text-primary">扫码更新数据授权</h3>
              <button onClick={() => setShowQrModal(false)} className="text-text-tertiary hover:text-text-primary">
                <X size={16} />
              </button>
            </div>
            <div className="w-48 h-48 mx-auto bg-surface-subtle border border-border-default rounded-xl flex items-center justify-center">
              <QrCode size={140} className="text-text-primary" />
            </div>
            <div className="text-[12px] text-text-secondary">
              请使用小红书 App 扫描上方二维码更新创作者服务平台数据读取授权。
            </div>
            <button
              type="button"
              onClick={handleVerifyQrSuccess}
              className="w-full py-2 bg-action-primary hover:bg-action-primary-hover text-white rounded-lg text-[12.5px] font-semibold transition-colors"
            >
              已在手机端确认授权
            </button>
          </div>
        </div>
      )}

      {/* Reassign Modal */}
      {showReassignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
          <div className="bg-surface border border-border-default rounded-xl shadow-dialog w-full max-w-sm p-5 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-[14px] font-semibold text-text-primary">重新指派执行人</h3>
              <button onClick={() => setShowReassignModal(false)} className="text-text-tertiary hover:text-text-primary">
                <X size={16} />
              </button>
            </div>
            <div className="space-y-2 text-[12.5px]">
              <label className="block text-text-secondary font-medium">选择接管人：</label>
              <select
                value={reassignedAssignee}
                onChange={(e) => setReassignedAssignee(e.target.value)}
                className="w-full px-3 py-2 bg-surface border border-border-default rounded-lg focus:outline-none focus:border-neutral-900 text-[13px]"
              >
                <option value="操盘手">操盘手（由我接管）</option>
                <option value="李店长 (静安店)">李店长 (静安店)</option>
                <option value="备用KOC_小丸子">备用KOC_小丸子</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowReassignModal(false)}
                className="px-3.5 py-1.5 text-[12px] text-text-secondary hover:text-text-primary"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleReassignExecutor}
                className="px-4 py-1.5 text-[12px] font-semibold text-white bg-action-primary hover:bg-action-primary-hover rounded-lg"
              >
                确认指派
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Material Library Selection Modal */}
      {showLibraryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4">
          <div className="bg-surface border border-border-default rounded-xl shadow-dialog w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-border-default flex items-center justify-between">
              <div>
                <h3 className="text-[15px] font-semibold text-text-primary">从素材中心选择素材与配图</h3>
                <p className="text-[11.5px] text-text-tertiary mt-0.5">已为您智能筛选当前商品与关键词相关实拍素材</p>
              </div>
              <button onClick={() => setShowLibraryModal(false)} className="text-text-tertiary hover:text-text-primary p-1">
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {availableLibraryMaterials.map((item) => {
                  const isSelected = selectedMaterialAssets.some(a => a.id === item.id);
                  const isCover = selectedCoverUrl === item.url;
                  return (
                    <div
                      key={item.id}
                      className={`group relative rounded-lg border overflow-hidden transition-all ${
                        isSelected || isCover
                          ? 'border-neutral-900 ring-2 ring-neutral-900/10'
                          : 'border-border-default hover:border-border-strong'
                      }`}
                    >
                      <div className="aspect-square bg-neutral-100 relative">
                        <img src={item.url} alt={item.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        {isCover && (
                          <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-rose-600 text-white rounded text-[9px] font-bold">
                            当前封面
                          </div>
                        )}
                        {isSelected && (
                          <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[10px]">
                            <Check size={11} />
                          </div>
                        )}
                      </div>
                      <div className="p-2 bg-surface text-[11px] space-y-1">
                        <div className="font-medium text-text-primary truncate">{item.title}</div>
                        <div className="flex items-center justify-between text-[10px] text-text-tertiary">
                          <span>{item.category}</span>
                          <span>{item.dimensions}</span>
                        </div>
                        <div className="pt-1.5 flex gap-1 border-t border-border-subtle">
                          <button
                            type="button"
                            onClick={() => handleSelectMaterialCover(item)}
                            className={`flex-1 py-1 rounded text-[10px] font-medium transition-colors ${
                              isCover ? 'bg-rose-50 text-rose-700 font-bold' : 'bg-surface-subtle hover:bg-surface-hover text-text-secondary'
                            }`}
                          >
                            {isCover ? '封面' : '设封面'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleMaterialAsset(item)}
                            className={`flex-1 py-1 rounded text-[10px] font-medium transition-colors ${
                              isSelected ? 'bg-neutral-900 text-white' : 'bg-surface-subtle hover:bg-surface-hover text-text-secondary'
                            }`}
                          >
                            {isSelected ? '已选' : '选用'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-4 border-t border-border-default bg-surface-subtle flex items-center justify-between">
              <div className="text-[12px] text-text-secondary">
                已选用配图 <strong>{selectedMaterialAssets.length}</strong> 张 · 封面已设定
              </div>
              <button
                type="button"
                onClick={() => setShowLibraryModal(false)}
                className="px-4 py-2 bg-action-primary hover:bg-action-primary-hover text-white text-[12.5px] font-semibold rounded-lg transition-colors"
              >
                完成选择
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Material Task Modal */}
      {showCreateTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4">
          <div className="bg-surface border border-border-default rounded-xl shadow-dialog w-full max-w-md p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[14px] font-semibold text-text-primary">生成素材拍摄任务</h3>
                <p className="text-[11.5px] text-text-tertiary mt-0.5">下发缺口拍摄要求，支持多任务合并派发给员工</p>
              </div>
              <button onClick={() => setShowCreateTaskModal(false)} className="text-text-tertiary hover:text-text-primary">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 text-[12.5px]">
              <div>
                <label className="block text-[12px] font-medium text-text-secondary mb-1">拍摄要求说明：</label>
                <textarea
                  rows={3}
                  value={newTaskRequirement}
                  onChange={(e) => setNewTaskRequirement(e.target.value)}
                  placeholder="例如：手持幼犬粮颗粒特写，展示冻干肉松包裹质感，自然光拍摄..."
                  className="w-full px-3 py-2 bg-surface border border-border-default rounded-lg focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-medium text-text-secondary mb-1">指派员工：</label>
                  <select
                    value={newTaskAssignee}
                    onChange={(e) => setNewTaskAssignee(e.target.value)}
                    className="w-full px-3 py-2 bg-surface border border-border-default rounded-lg focus:outline-none focus:border-neutral-900 text-[12.5px]"
                  >
                    {MOCK_STAFF_MEMBERS.map((staff) => (
                      <option key={staff.id} value={staff.id}>
                        {staff.name} ({staff.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[12px] font-medium text-text-secondary mb-1">截止日期：</label>
                  <input
                    type="date"
                    value={newTaskDeadline}
                    onChange={(e) => setNewTaskDeadline(e.target.value)}
                    className="w-full px-3 py-2 bg-surface border border-border-default rounded-lg focus:outline-none focus:border-neutral-900 text-[12.5px]"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border-subtle">
              <button
                type="button"
                onClick={() => setShowCreateTaskModal(false)}
                className="px-3.5 py-1.5 text-[12px] text-text-secondary hover:text-text-primary"
              >
                取消
              </button>
              <button
                type="button"
                disabled={!newTaskRequirement.trim()}
                onClick={handleCreateNewMaterialTask}
                className="px-4 py-1.5 text-[12px] font-semibold text-white bg-action-primary hover:bg-action-primary-hover rounded-lg disabled:opacity-50 transition-colors"
              >
                生成任务
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Batch Send Confirmation Modal */}
      {showBatchSendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4">
          <div className="bg-surface border border-border-default rounded-xl shadow-dialog w-full max-w-lg p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[14px] font-semibold text-text-primary">合并派发拍摄任务</h3>
                <p className="text-[11.5px] text-text-tertiary mt-0.5">将勾选的多个拍摄需求打包合并后统一推送给指定员工</p>
              </div>
              <button onClick={() => setShowBatchSendModal(false)} className="text-text-tertiary hover:text-text-primary">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <div className="text-[12px] font-medium text-text-secondary">
                待合并的任务项 ({generatedMaterialTasks.filter(t => t.selectedForBatch && t.status === 'pending').length} 项)：
              </div>

              <div className="max-h-48 overflow-y-auto space-y-1.5 bg-surface-subtle p-3 rounded-lg border border-border-subtle text-[12px]">
                {generatedMaterialTasks.filter(t => t.selectedForBatch && t.status === 'pending').map((t, idx) => (
                  <div key={t.id} className="flex items-start gap-2 text-text-primary">
                    <span className="text-text-tertiary font-mono">{idx + 1}.</span>
                    <span className="flex-1">{t.requirement}</span>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-[12px] font-medium text-text-secondary mb-1">选择统一承接人：</label>
                <select
                  value={batchTargetStaff}
                  onChange={(e) => setBatchTargetStaff(e.target.value)}
                  className="w-full px-3 py-2 bg-surface border border-border-default rounded-lg focus:outline-none focus:border-neutral-900 text-[12.5px]"
                >
                  {MOCK_STAFF_MEMBERS.map((staff) => (
                    <option key={staff.id} value={staff.id}>
                      {staff.name} ({staff.role})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border-subtle">
              <button
                type="button"
                onClick={() => setShowBatchSendModal(false)}
                className="px-3.5 py-1.5 text-[12px] text-text-secondary hover:text-text-primary"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleExecuteBatchMergeAndSend}
                className="px-4 py-1.5 text-[12px] font-semibold text-white bg-action-primary hover:bg-action-primary-hover rounded-lg transition-colors"
              >
                确认合并并派发
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

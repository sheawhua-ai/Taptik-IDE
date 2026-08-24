import React, { useState } from 'react';
import { 
  Camera, CheckCircle2, AlertTriangle, Sparkles, Copy, 
  Send, RefreshCw, Eye, ShieldCheck, Tag, Check, MessageSquare, 
  ArrowRight, Sparkle, Image as ImageIcon, Sliders, SunMedium,
  Maximize2, ZoomIn, Eraser, Lightbulb
} from 'lucide-react';
import { ExecutionTask, MaterialSubItem } from '../types';

interface MaterialAiHubProps {
  task: ExecutionTask;
  activeSubItemId?: string | null;
  onSelectSubItem?: (item: MaterialSubItem) => void;
  onOpenReshootModal: (item: MaterialSubItem, defaultReason?: string) => void;
  onAcceptSubItem: (itemId: string) => void;
  showToast: (msg: string) => void;
}

export function MaterialAiHub({
  task,
  activeSubItemId,
  onSelectSubItem,
  onOpenReshootModal,
  onAcceptSubItem,
  showToast
}: MaterialAiHubProps) {
  const subItems = task.materialSubItems || [];
  const [selectedItemIndex, setSelectedItemIndex] = useState<number>(0);
  const currentItem = subItems[selectedItemIndex] || subItems[0] || null;

  // Custom AI Reshoot prompt generation
  const [reshootFocus, setReshootFocus] = useState<'lighting' | 'angle' | 'focus' | 'background'>('lighting');
  const [customReshootDirective, setCustomReshootDirective] = useState<string>('');
  const [isGeneratingDirective, setIsGeneratingDirective] = useState<boolean>(false);
  const [generatedPrompt, setGeneratedPrompt] = useState<string>(
    '请在白天自然光线下，以45度近景俯拍幼犬进食特写，确保食盆与狗粮颗粒纹理清晰，避免杂乱背景。'
  );

  const handleGenerateCustomDirective = (focusType: 'lighting' | 'angle' | 'focus' | 'background') => {
    setReshootFocus(focusType);
    setIsGeneratingDirective(true);
    setTimeout(() => {
      setIsGeneratingDirective(false);
      if (focusType === 'lighting') {
        setGeneratedPrompt('当前画面光线偏暗，请在白天窗边自然光或柔光灯下重新补拍，避免顶光阴影遮挡颗粒。');
      } else if (focusType === 'angle') {
        setGeneratedPrompt('建议调整为45度微俯角拍摄，让食盆中的粮颗粒与狗狗头部同时入镜，画面层次更丰富。');
      } else if (focusType === 'focus') {
        setGeneratedPrompt('对焦点请锁定在狗粮颗粒表面，手指或量杯作为参照物放置于右下方，体现微距清晰度。');
      } else if (focusType === 'background') {
        setGeneratedPrompt('拍摄背景请保持干净简洁（素色木地板或浅色垫子），避免出现其他杂物影响视觉焦点。');
      }
      showToast('已生成针对性补拍指导话术');
    }, 300);
  };

  const copyToClipboard = (text: string, tip: string) => {
    navigator.clipboard.writeText(text);
    showToast(tip);
  };

  // Recommended auto tags for material
  const aiTags = ['#幼犬实拍', '#颗粒细节特写', '#自然采光', '#真实种草场景', '#无水印合规'];

  return (
    <div className="w-80 border-l border-border-default bg-surface flex flex-col shrink-0">
      
      {/* Header */}
      <div className="p-3.5 border-b border-border-default bg-surface-subtle flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-neutral-900 text-white flex items-center justify-center text-[11px] font-bold">
            <Camera size={13} />
          </div>
          <div>
            <div className="text-[13px] font-semibold text-text-primary">
              视觉质检与拍摄 AI 协调
            </div>
            <div className="text-[11px] text-text-tertiary">
              多维画质质检 · 智能补拍话术
            </div>
          </div>
        </div>
      </div>

      {/* Body Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-[12.5px]">
        
        {/* Item Selector Tabs (if multiple items) */}
        {subItems.length > 0 && (
          <div className="space-y-1.5">
            <div className="text-[11.5px] font-semibold text-text-secondary flex items-center justify-between">
              <span>当前诊断镜头：</span>
              <span className="text-[10.5px] text-text-tertiary">共 {subItems.length} 个镜头</span>
            </div>
            <div className="flex gap-1 overflow-x-auto pb-1">
              {subItems.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedItemIndex(idx)}
                  className={`px-2.5 py-1 text-[11px] rounded-md transition-colors truncate max-w-[120px] shrink-0 ${
                    selectedItemIndex === idx
                      ? 'bg-neutral-900 text-white font-medium shadow-sm'
                      : 'bg-surface-subtle text-text-secondary hover:bg-surface-hover border border-border-default'
                  }`}
                >
                  镜头 {idx + 1}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 1. AI Objective Vision Diagnostics Card */}
        <div className="p-3.5 bg-surface-subtle border border-border-subtle rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-[12px] font-semibold text-text-primary flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-600" />
              <span>AI 视觉质检分析</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10.5px] font-medium bg-emerald-100 text-emerald-800">
              综合评分 96 分
            </span>
          </div>

          <div className="space-y-2 text-[11.5px]">
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">主体清晰度：</span>
              <span className="font-medium text-text-primary">主体突出 (98% 达标)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">光线与色温：</span>
              <span className="font-medium text-text-primary">室内自然采光 / 曝光正常</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">违规/水印排查：</span>
              <span className="font-medium text-emerald-700 flex items-center gap-0.5">
                <Check size={11} />
                无第三方水印及贴纸
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">种草真实度：</span>
              <span className="font-medium text-text-primary">生活化实景 (高信任感)</span>
            </div>
          </div>

          <div className="p-2 bg-surface rounded-lg border border-border-subtle text-[11px] text-text-secondary leading-relaxed flex items-start gap-1.5">
            <Lightbulb size={13} className="text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>AI 建议：</strong>画面整体符合小红书爆款图文调性，适宜作为正文首图或步骤对比图。
            </div>
          </div>
        </div>

        {/* 2. AI Reshoot Directive Generator */}
        <div className="p-3.5 bg-surface rounded-xl border border-border-default space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-[12px] font-semibold text-text-primary flex items-center gap-1.5">
              <Sparkles size={13} className="text-amber-600" />
              <span>生成精准补拍指令</span>
            </div>
            <span className="text-[10.5px] text-text-tertiary">一键填入下发</span>
          </div>

          <div className="space-y-1.5">
            <div className="text-[11px] text-text-tertiary">快捷针对性问题方向：</div>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => handleGenerateCustomDirective('lighting')}
                className={`px-2 py-1.5 text-[11px] rounded-lg border text-left transition-colors flex items-center gap-1.5 ${
                  reshootFocus === 'lighting'
                    ? 'bg-neutral-900 text-white border-neutral-900'
                    : 'bg-surface-subtle text-text-secondary hover:bg-surface-hover border-border-default'
                }`}
              >
                <SunMedium size={12} className={reshootFocus === 'lighting' ? 'text-amber-300' : 'text-amber-600'} />
                <span>提升画面采光</span>
              </button>
              <button
                type="button"
                onClick={() => handleGenerateCustomDirective('angle')}
                className={`px-2 py-1.5 text-[11px] rounded-lg border text-left transition-colors flex items-center gap-1.5 ${
                  reshootFocus === 'angle'
                    ? 'bg-neutral-900 text-white border-neutral-900'
                    : 'bg-surface-subtle text-text-secondary hover:bg-surface-hover border-border-default'
                }`}
              >
                <Maximize2 size={12} className={reshootFocus === 'angle' ? 'text-blue-300' : 'text-blue-600'} />
                <span>调整俯拍角度</span>
              </button>
              <button
                type="button"
                onClick={() => handleGenerateCustomDirective('focus')}
                className={`px-2 py-1.5 text-[11px] rounded-lg border text-left transition-colors flex items-center gap-1.5 ${
                  reshootFocus === 'focus'
                    ? 'bg-neutral-900 text-white border-neutral-900'
                    : 'bg-surface-subtle text-text-secondary hover:bg-surface-hover border-border-default'
                }`}
              >
                <ZoomIn size={12} className={reshootFocus === 'focus' ? 'text-purple-300' : 'text-purple-600'} />
                <span>加强微距特写</span>
              </button>
              <button
                type="button"
                onClick={() => handleGenerateCustomDirective('background')}
                className={`px-2 py-1.5 text-[11px] rounded-lg border text-left transition-colors flex items-center gap-1.5 ${
                  reshootFocus === 'background'
                    ? 'bg-neutral-900 text-white border-neutral-900'
                    : 'bg-surface-subtle text-text-secondary hover:bg-surface-hover border-border-default'
                }`}
              >
                <Eraser size={12} className={reshootFocus === 'background' ? 'text-rose-300' : 'text-rose-600'} />
                <span>清理杂乱背景</span>
              </button>
            </div>
          </div>

          {/* Generated prompt box */}
          <div className="p-2.5 bg-surface-subtle border border-border-subtle rounded-lg space-y-2">
            <div className="text-[11.5px] text-text-primary leading-relaxed">
              "{generatedPrompt}"
            </div>
            
            <div className="flex items-center justify-between pt-1 border-t border-border-subtle">
              <button
                type="button"
                onClick={() => copyToClipboard(generatedPrompt, '补拍要求已复制到剪贴板')}
                className="text-[11px] text-text-secondary hover:text-text-primary flex items-center gap-1"
              >
                <Copy size={11} />
                <span>复制要求</span>
              </button>

              {currentItem && (
                <button
                  type="button"
                  onClick={() => onOpenReshootModal(currentItem, generatedPrompt)}
                  className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-[11px] font-medium transition-colors flex items-center gap-1 shadow-sm"
                >
                  <Send size={11} />
                  <span>一键填入并下发补拍</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 3. AI Smart Visual Tagging */}
        <div className="p-3.5 bg-surface-subtle border border-border-subtle rounded-xl space-y-2">
          <div className="text-[12px] font-semibold text-text-primary flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Tag size={13} className="text-text-secondary" />
              <span>视觉特征与入库标签</span>
            </div>
            <span className="text-[10.5px] text-emerald-700 font-medium">已关联方案词簇</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {aiTags.map(tag => (
              <span key={tag} className="px-2 py-0.5 bg-surface border border-border-default rounded text-[11px] text-text-secondary font-mono">
                {tag}
              </span>
            ))}
          </div>
          <div className="text-[10.5px] text-text-tertiary">
            验收通过后将自动以该标签归档至【素材中心】资产库。
          </div>
        </div>

        {/* 4. Instant Communication Message Templates */}
        <div className="space-y-2 pt-1 border-t border-border-subtle">
          <div className="text-[11.5px] font-semibold text-text-secondary flex items-center gap-1">
            <MessageSquare size={12} />
            <span>执行人微信/企微快捷消息：</span>
          </div>

          <div className="space-y-1.5">
            <button
              type="button"
              onClick={() => copyToClipboard(
                `亲亲，您回传的【${task.noteTitle}】拍摄素材光线和细节特别棒，已通过验收！非常感谢配合～`,
                '验收通过文案已复制！'
              )}
              className="w-full text-left p-2 bg-surface hover:bg-surface-hover border border-border-default rounded-lg text-[11.5px] transition-colors group flex items-center justify-between"
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                <span className="text-text-primary truncate">验收通过鼓励文案</span>
              </div>
              <Copy size={12} className="text-text-tertiary group-hover:text-text-primary shrink-0 ml-1" />
            </button>

            <button
              type="button"
              onClick={() => copyToClipboard(
                `亲亲，素材整体很好看！为了笔记能冲上小红书搜索推荐，需要麻烦您按指导补拍一张照片：${generatedPrompt}`,
                '补拍沟通文案已复制！'
              )}
              className="w-full text-left p-2 bg-surface hover:bg-surface-hover border border-border-default rounded-lg text-[11.5px] transition-colors group flex items-center justify-between"
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <MessageSquare size={13} className="text-amber-600 shrink-0" />
                <span className="text-text-primary truncate">委婉指导补拍文案</span>
              </div>
              <Copy size={12} className="text-text-tertiary group-hover:text-text-primary shrink-0 ml-1" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}

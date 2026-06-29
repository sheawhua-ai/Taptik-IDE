import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Replace, RefreshCw, Scissors, ThumbsUp } from 'lucide-react';

export const InlineAIToolbar: React.FC = () => {
  const [selection, setSelection] = useState<{ text: string; rect: DOMRect | null }>({ text: '', rect: null });
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const handleMouseUp = () => {
      setTimeout(() => {
        const sel = window.getSelection();
        if (sel && sel.toString().trim().length > 0 && sel.rangeCount > 0) {
          const anchorNode = sel.anchorNode;
          const parentWithAttr = anchorNode?.parentElement?.closest('[data-inline-ai="true"]');
          
          if (parentWithAttr) {
            const range = sel.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            setSelection({
              text: sel.toString().trim(),
              rect
            });
          } else {
            setSelection({ text: '', rect: null });
          }
        } else {
          setSelection({ text: '', rect: null });
        }
      }, 10);
    };

    const handleMouseDown = (e: MouseEvent) => {
      // Don't close if clicking inside the toolbar itself
      if ((e.target as HTMLElement).closest('#inline-ai-toolbar')) {
        return;
      }
      setSelection({ text: '', rect: null });
    };

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  const handleAction = (action: string) => {
    setIsProcessing(true);
    
    let promptText = '';
    if (action === 'rewrite') promptText = '请润色这段内容：\n' + selection.text;
    else if (action === 'tone') promptText = '请使这段内容语气更像真实素人：\n' + selection.text;
    else if (action === 'shorter') promptText = '请精简这段内容：\n' + selection.text;
    else if (action === 'analyze') promptText = '请分析这段原因：\n' + selection.text;

    // Call subagent with the selected context
    window.dispatchEvent(
      new CustomEvent('open-expert', {
        detail: {
          expert: '内容助手',
          context: promptText,
        }
      })
    );

    setTimeout(() => {
      setIsProcessing(false);
      setSelection({ text: '', rect: null });
    }, 500);
  };

  if (!selection.rect || !selection.text) return null;

  return (
    <AnimatePresence>
      <motion.div
        id="inline-ai-toolbar"
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        style={{
          position: 'fixed',
          top: selection.rect.top - 50,
          left: selection.rect.left + selection.rect.width / 2,
          transform: 'translateX(-50%)',
          zIndex: 9999,
        }}
        className="bg-neutral-900 shadow-2xl rounded-xl border border-neutral-700 p-1.5 flex items-center gap-1"
      >
        {isProcessing ? (
          <div className="flex items-center gap-2 px-3 py-1 text-white text-[12px]">
            <RefreshCw size={14} className="animate-spin text-indigo-400" />
            <span>AI 处理中...</span>
          </div>
        ) : (
          <>
            <button onClick={() => handleAction('rewrite')} className="px-3 py-1.5 hover:bg-neutral-800 rounded-lg flex items-center gap-1.5 text-white text-[12px] font-medium transition-colors">
              <Sparkles size={14} className="text-indigo-400" />
              润色
            </button>
            <div className="w-[1px] h-4 bg-neutral-700 mx-1"></div>
            <button onClick={() => handleAction('tone')} className="px-3 py-1.5 hover:bg-neutral-800 rounded-lg flex items-center gap-1.5 text-white text-[12px] font-medium transition-colors">
              <ThumbsUp size={14} className="text-emerald-400" />
              更像真实素人
            </button>
            <button onClick={() => handleAction('shorter')} className="px-3 py-1.5 hover:bg-neutral-800 rounded-lg flex items-center gap-1.5 text-white text-[12px] font-medium transition-colors">
              <Scissors size={14} className="text-amber-400" />
              精简
            </button>
            <div className="w-[1px] h-4 bg-neutral-700 mx-1"></div>
            <button onClick={() => handleAction('analyze')} className="px-3 py-1.5 hover:bg-neutral-800 rounded-lg flex items-center gap-1.5 text-white text-[12px] font-medium transition-colors">
              <Sparkles size={14} className="text-indigo-400" />
              分析这段原因
            </button>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

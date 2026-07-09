import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, X, RefreshCw } from "lucide-react";

export interface TextSelection {
  text: string;
  start: number;
  end: number;
}

interface NoteEditorProps {
  onSelectionChange?: (selection: TextSelection | null) => void;
  replacementCommand?: { newText: string; start: number; end: number; id: number } | null;
}

export function NoteEditor({ onSelectionChange, replacementCommand }: NoteEditorProps) {
  const [noteTitle, setNoteTitle] = useState("幼犬换粮到底怎么选？这篇告诉你真相！");
  const [noteBody, setNoteBody] = useState("我家修勾最近总是软便，真的操碎了心！做足了功课终于知道换粮到底该怎么选了...\n\n第一点就是要看成分表的肉含量，千万别踩坑。我家现在吃的是这款，适口性好，便便成型也挺好！大家可以参考一下哦。");
  const [noteTopics, setNoteTopics] = useState("#幼犬换粮 #新手养狗 #宠物好物");
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (replacementCommand) {
      const { newText, start, end } = replacementCommand;
      const newBody = noteBody.substring(0, start) + newText + noteBody.substring(end);
      setNoteBody(newBody);
      if (onSelectionChange) onSelectionChange(null);
    }
  }, [replacementCommand]);

  const handleMouseUp = () => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      if (start !== end) {
        const text = noteBody.substring(start, end);
        if (onSelectionChange) onSelectionChange({ text, start, end });
      } else {
        if (onSelectionChange) onSelectionChange(null);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNoteBody(e.target.value);
    if (onSelectionChange) onSelectionChange(null);
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <h4 className="text-[14px] font-bold text-neutral-900 mb-2">笔记详情编辑</h4>
      
      <div className="space-y-4 flex-1 overflow-y-auto pr-2 pb-4">
        <div>
          <label className="block text-[12px] font-bold text-neutral-500 mb-1">标题</label>
          <input 
            type="text" 
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
            className="w-full border border-neutral-200 rounded-lg p-3 text-[14px] font-bold text-neutral-900 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
          />
        </div>
        
        <div className="flex-1 flex flex-col relative min-h-[250px]">
          <label className="block text-[12px] font-bold text-neutral-500 mb-1">正文 (划选文字可在右侧使用 AI 修改)</label>
          <textarea 
            ref={textareaRef}
            value={noteBody}
            onChange={handleChange}
            onMouseUp={handleMouseUp}
            className="w-full flex-1 border border-neutral-200 rounded-lg p-4 text-[14px] text-neutral-800 leading-relaxed focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 resize-none bg-white shadow-inner"
          />
        </div>
        
        <div>
          <label className="block text-[12px] font-bold text-neutral-500 mb-1">话题</label>
          <input 
            type="text" 
            value={noteTopics}
            onChange={(e) => setNoteTopics(e.target.value)}
            className="w-full border border-neutral-200 rounded-lg p-3 text-[13px] text-primary-600 font-medium focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
          />
        </div>
      </div>
    </div>
  );
}

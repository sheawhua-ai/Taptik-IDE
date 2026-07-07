import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Image, FileText, Settings, Sparkles } from 'lucide-react';

interface SmartInputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  onValueChange?: (value: string) => void;
}

export const SmartInput = forwardRef<HTMLTextAreaElement, SmartInputProps>(({ 
  value, 
  onValueChange,
  onChange,
  className,
  ...props 
}, ref) => {
  const [menuType, setMenuType] = useState<'@' | '/' | null>(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const internalRef = useRef<HTMLTextAreaElement>(null);
  
  useImperativeHandle(ref, () => internalRef.current as HTMLTextAreaElement);
  
  const [internalValue, setInternalValue] = useState(value || '');

  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInternalValue(val);
    if (onValueChange) onValueChange(val);
    if (onChange) onChange(e);

    // Naive implementation: check the last character typed
    const cursor = e.target.selectionStart;
    const lastChar = val.slice(cursor - 1, cursor);
    
    if (lastChar === '@') {
      setMenuType('@');
      updateMenuPosition(e.target);
    } else if (lastChar === '/') {
      setMenuType('/');
      updateMenuPosition(e.target);
    } else {
      setMenuType(null);
    }
  };

  const updateMenuPosition = (textarea: HTMLTextAreaElement) => {
    // A simplified position calculation for demo purposes
    const rect = textarea.getBoundingClientRect();
    // Since we are absolutely positioning inside a relative container
    // We can just anchor it near the bottom
    setMenuPos({
      top: textarea.clientHeight - 40 > 0 ? textarea.clientHeight - 40 : -100, 
      left: 20
    });
  };

  const handleInsert = (text: string) => {
    if (!internalRef.current) return;
    const cursor = internalRef.current.selectionStart;
    const before = String(internalValue).slice(0, cursor - 1);
    const after = String(internalValue).slice(cursor);
    const newValue = before + text + ' ' + after;
    
    setInternalValue(newValue);
    if (onValueChange) onValueChange(newValue);
    
    // Also trigger onChange if needed by simulating event
    if (onChange) {
      const e = {
        target: { value: newValue }
      } as React.ChangeEvent<HTMLTextAreaElement>;
      onChange(e);
    }
    
    setMenuType(null);
    
    setTimeout(() => {
      if (internalRef.current) {
        internalRef.current.focus();
        internalRef.current.selectionStart = cursor - 1 + text.length + 1;
        internalRef.current.selectionEnd = cursor - 1 + text.length + 1;
      }
    }, 0);
  };

  const menuItems = {
    '@': [
      { icon: <Image size={14} />, label: '资产: 软便避坑爆款首图', insert: '[资产: 软便避坑爆款首图]' },
      { icon: <Settings size={14} />, label: '规则: 绝不提竞品', insert: '[规则: 绝不提竞品]' },
      { icon: <FileText size={14} />, label: '记忆: 幼犬粮Q2复盘', insert: '[记忆: 幼犬粮Q2复盘]' },
    ],
    '/': [
      { icon: <Sparkles size={14} />, label: '智能: 润色当前草稿', insert: '[智能指令: 润色草稿]' },
      { icon: <Sparkles size={14} />, label: '智能: 扩写产品卖点', insert: '[智能指令: 扩写卖点]' },
      { icon: <Sparkles size={14} />, label: '智能: 生成爆款标题', insert: '[智能指令: 生成标题]' },
    ]
  };

  return (
    <div className="relative w-full h-full">
      <textarea
        ref={internalRef}
        value={internalValue}
        onChange={handleChange}
        className={className}
        {...props}
      />
      
      <AnimatePresence>
        {menuType && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            style={{ 
              bottom: '100%', 
              left: 0,
              marginBottom: '10px'
            }}
            className="absolute z-[999] w-64 bg-white border border-neutral-200 rounded-xl shadow-2xl overflow-hidden"
          >
            <div className="px-3 py-2 bg-neutral-50/50 border-b border-neutral-100 text-[11px] font-bold text-neutral-500 uppercase tracking-wider flex items-center justify-between">
              <span>{menuType === '@' ? '插入变量' : '快捷指令'}</span>
              <span className="text-[10px] text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded">Enter 确认</span>
            </div>
            <div className="p-1 max-h-[200px] overflow-y-auto">
              {menuItems[menuType].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleInsert(item.insert)}
                  className="w-full text-left px-3 py-2 hover:bg-primary-50 hover:text-primary-700 rounded-lg flex items-center gap-2 text-[13px] text-neutral-700 transition-colors focus:bg-primary-50 focus:outline-none"
                >
                  <span className="opacity-70">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen, GripVertical } from 'lucide-react';

interface ResizableSidebarProps {
  side: 'left' | 'right';
  defaultWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  children: React.ReactNode;
  borderClass?: string;
  className?: string;
  isCollapsible?: boolean;
  hideWhenClosed?: boolean;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ResizableSidebar({
  side,
  defaultWidth = 320,
  minWidth = 240,
  maxWidth = 600,
  children,
  borderClass = "border-border-default",
  className = "",
  isCollapsible = true,
  isOpen: controlledIsOpen,
  onOpenChange,
  hideWhenClosed = false
}: ResizableSidebarProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(true);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const setIsOpen = (val: boolean) => {
    if (controlledIsOpen === undefined) setInternalIsOpen(val);
    if (onOpenChange) onOpenChange(val);
  };
  const [width, setWidth] = useState(defaultWidth);
  const [isDragging, setIsDragging] = useState(false);
  
  const sidebarRef = useRef<HTMLDivElement>(null);

  const startDrag = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!sidebarRef.current) return;
      
      let newWidth;
      if (side === 'left') {
        const sidebarRect = sidebarRef.current.getBoundingClientRect();
        newWidth = e.clientX - sidebarRect.left;
      } else {
        const sidebarRect = sidebarRef.current.getBoundingClientRect();
        newWidth = sidebarRect.right - e.clientX;
      }
      
      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    // Add a class to body to prevent text selection and show resizing cursor globally
    document.body.classList.add('cursor-col-resize', 'select-none');

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.classList.remove('cursor-col-resize', 'select-none');
    };
  }, [isDragging, side, minWidth, maxWidth]);

  if (!isOpen) {
    if (hideWhenClosed) return null;
    return (
      <div className={`shrink-0 flex items-start p-2 ${side === 'left' ? 'border-r' : 'border-l'} ${borderClass} bg-surface`}>
        <button 
          onClick={() => setIsOpen(true)}
          className="p-1.5 rounded-lg text-text-tertiary hover:text-text-main hover:bg-surface-hover transition-colors"
          title={side === 'left' ? '展开左侧边栏' : '展开右侧边栏'}
        >
          {side === 'left' ? <PanelLeftOpen size={16} /> : <PanelRightOpen size={16} />}
        </button>
      </div>
    );
  }

  return (
    <div 
      ref={sidebarRef}
      className={`relative shrink-0 flex flex-col bg-surface ${side === 'left' ? 'border-r' : 'border-l'} ${borderClass} ${className}`}
      style={{ width: `${width}px` }}
    >
      {/* Sidebar Content */}
      <div className="flex-1 min-h-0 flex flex-col relative overflow-hidden h-full">
        {/* Toggle Button */}
        {isCollapsible && (
          <button 
            onClick={() => setIsOpen(false)}
            className={`absolute top-3 z-10 p-1.5 rounded-lg bg-surface/80 backdrop-blur-sm text-text-tertiary hover:text-text-main hover:bg-surface-hover transition-colors ${side === 'left' ? 'right-2' : 'left-2'}`}
            title={side === 'left' ? '收起左侧边栏' : '收起右侧边栏'}
          >
            {side === 'left' ? <PanelLeftClose size={16} /> : <PanelRightClose size={16} />}
          </button>
        )}
        
        {/* Content Wrapper */}
        <div className="w-full h-full flex flex-col">
          {children}
        </div>
      </div>

      {/* Resize Handle */}
      <div 
        className={`absolute top-0 bottom-0 w-3 cursor-col-resize flex items-center justify-center group hover:bg-brand-500/10 active:bg-brand-500/20 z-50 ${side === 'left' ? '-right-1.5' : '-left-1.5'}`}
        onMouseDown={startDrag}
      >
        <div className={`w-[2px] h-8 bg-border-strong rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${isDragging ? 'opacity-100 bg-brand-500' : ''}`} />
      </div>
    </div>
  );
}

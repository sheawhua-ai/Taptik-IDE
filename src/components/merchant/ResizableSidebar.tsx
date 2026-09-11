import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen } from 'lucide-react';

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
  storageKey?: string;
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
  hideWhenClosed = false,
  storageKey
}: ResizableSidebarProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(true);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const setIsOpen = (val: boolean) => {
    if (controlledIsOpen === undefined) setInternalIsOpen(val);
    if (onOpenChange) onOpenChange(val);
  };

  const [width, setWidth] = useState<number>(() => {
    if (storageKey && typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const parsed = parseInt(saved, 10);
          if (!isNaN(parsed) && parsed >= minWidth && parsed <= maxWidth) {
            return parsed;
          }
        }
      } catch {
        // ignore localStorage errors
      }
    }
    return defaultWidth;
  });

  const [isDragging, setIsDragging] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const startDrag = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleResetWidth = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWidth(defaultWidth);
    if (storageKey && typeof window !== 'undefined') {
      try {
        localStorage.setItem(storageKey, String(defaultWidth));
      } catch {
        // ignore
      }
    }
  }, [defaultWidth, storageKey]);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!sidebarRef.current) return;
      
      let newWidth: number;
      if (side === 'left') {
        const sidebarRect = sidebarRef.current.getBoundingClientRect();
        newWidth = e.clientX - sidebarRect.left;
      } else {
        const sidebarRect = sidebarRef.current.getBoundingClientRect();
        newWidth = sidebarRect.right - e.clientX;
      }
      
      const clampedWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
      setWidth(clampedWidth);

      if (storageKey && typeof window !== 'undefined') {
        try {
          localStorage.setItem(storageKey, String(Math.round(clampedWidth)));
        } catch {
          // ignore
        }
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.classList.add('cursor-col-resize', 'select-none');

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.classList.remove('cursor-col-resize', 'select-none');
    };
  }, [isDragging, side, minWidth, maxWidth, storageKey]);

  if (!isOpen) {
    if (hideWhenClosed) return null;
    return (
      <div className={`shrink-0 flex items-start p-2 ${side === 'left' ? 'border-r' : 'border-l'} ${borderClass} bg-surface-1`}>
        <button 
          onClick={() => setIsOpen(true)}
          className="p-1.5 rounded-lg text-text-tertiary hover:text-text-main hover:bg-hover-bg transition-colors"
          title={side === 'left' ? '展开左侧边栏' : '展开右侧边栏'}
        >
          {side === 'left' ? <PanelLeftOpen size={16} /> : <PanelRightOpen size={16} />}
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Barrier overlay when actively dragging to avoid losing events to iframes/inputs */}
      {isDragging && (
        <div className="fixed inset-0 z-[99999] cursor-col-resize select-none bg-transparent" />
      )}

      <div 
        ref={sidebarRef}
        className={`relative shrink-0 flex flex-col bg-surface-1 ${side === 'left' ? 'border-r' : 'border-l'} ${borderClass} ${className}`}
        style={{ width: `${width}px` }}
      >
        {/* Sidebar Content */}
        <div className="flex-1 min-h-0 flex flex-col relative overflow-hidden h-full w-full">
          {/* Toggle Button */}
          {isCollapsible && (
            <button 
              onClick={() => setIsOpen(false)}
              className={`absolute top-3 z-10 p-1.5 rounded-lg bg-surface-1/80 backdrop-blur-sm text-text-tertiary hover:text-text-main hover:bg-hover-bg transition-colors ${side === 'left' ? 'right-2' : 'left-2'}`}
              title={side === 'left' ? '收起左侧边栏' : '收起右侧边栏'}
            >
              {side === 'left' ? <PanelLeftClose size={16} /> : <PanelRightClose size={16} />}
            </button>
          )}
          
          {/* Content Wrapper */}
          <div className="w-full h-full flex flex-col min-h-0 overflow-hidden">
            {children}
          </div>
        </div>

        {/* Resize Handle */}
        <div 
          className={`absolute top-0 bottom-0 w-4 cursor-col-resize flex items-center justify-center group z-40 select-none transition-colors ${
            side === 'left' ? '-right-2' : '-left-2'
          }`}
          onMouseDown={startDrag}
          onDoubleClick={handleResetWidth}
          title="按住拖拽调节宽度，双击恢复默认"
        >
          {/* Subtle vertical indicator line */}
          <div 
            className={`absolute inset-y-0 w-[2px] transition-colors pointer-events-none ${
              side === 'left' ? 'right-[7px]' : 'left-[7px]'
            } ${
              isDragging 
                ? 'bg-neutral-900 opacity-100' 
                : 'bg-transparent group-hover:bg-neutral-400/80'
            }`} 
          />
          {/* Central grip pill */}
          <div 
            className={`w-1 h-7 rounded-full transition-all pointer-events-none ${
              isDragging 
                ? 'bg-neutral-900 opacity-100 scale-y-110' 
                : 'bg-border-strong opacity-0 group-hover:opacity-100 group-hover:bg-text-secondary'
            }`} 
          />
        </div>
      </div>
    </>
  );
}

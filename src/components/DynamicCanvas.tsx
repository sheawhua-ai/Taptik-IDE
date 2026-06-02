import React from 'react';
import { motion } from 'motion/react';
import { DynamicContent } from '../types';
import { Maximize2, Download, Share2, MoreHorizontal, Layout, BarChart3, FileText } from 'lucide-react';

interface DynamicCanvasContainerProps {
  content: DynamicContent;
}

export const DynamicCanvasContainer: React.FC<DynamicCanvasContainerProps> = ({ content }) => {
  const getIcon = () => {
    switch (content.type) {
      case 'report': return <FileText size={18} />;
      case 'chart': return <BarChart3 size={18} />;
      case 'analysis': return <Layout size={18} />;
      default: return <Layout size={18} />;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="mt-6 mb-4 bg-taptik-paper border border-taptik-line rounded-[32px] shadow-xl overflow-hidden group"
    >
      {/* Container Header */}
      <div className="px-6 py-4 border-b border-taptik-line flex items-center justify-between bg-taptik-paper/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-taptik-cream rounded-xl flex items-center justify-center text-taptik-ember border border-taptik-line/50">
            {getIcon()}
          </div>
          <div>
            <h4 className="text-[15px] font-black text-taptik-ink tracking-tight font-serif">
              {content.title || 'TapTik 智策结果'}
            </h4>
            <div className="flex items-center gap-2">
               <span className="text-[9px] text-taptik-muted font-black uppercase tracking-[0.2em] opacity-40">
                 {content.type} Rendered
               </span>
               <div className="w-1 h-1 rounded-full bg-taptik-moss/30" />
               <span className="text-[9px] text-taptik-moss font-bold uppercase tracking-widest">
                 Verify Verified
               </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
           <button className="p-2 text-taptik-muted hover:text-taptik-ink hover:bg-taptik-cream rounded-lg transition-colors">
             <Share2 size={16} />
           </button>
           <button className="p-2 text-taptik-muted hover:text-taptik-ink hover:bg-taptik-cream rounded-lg transition-colors">
             <Download size={16} />
           </button>
           <button className="p-2 text-taptik-muted hover:text-taptik-ink hover:bg-taptik-cream rounded-lg transition-colors">
             <Maximize2 size={16} />
           </button>
        </div>
      </div>

      {/* Dynamic Content Area */}
      <div className="p-1 min-h-[100px] relative">
        {content.html ? (
          <div 
            className="w-full h-full"
            dangerouslySetInnerHTML={{ __html: content.html }} 
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-taptik-muted/30">
             <div className="w-12 h-12 rounded-full border-2 border-dashed border-taptik-line mb-4" />
             <p className="text-[12px] font-bold">无渲染数据</p>
          </div>
        )}
      </div>
      
      {/* Context Footer */}
      <div className="px-6 py-3 bg-taptik-cream/30 border-t border-taptik-line/50 flex items-center justify-between">
         <span className="text-[9px] font-black text-taptik-muted/40 uppercase tracking-[0.24em]">
           Auto-Generated Canvas &copy; 2026 TapTik
         </span>
         <div className="flex items-center gap-1.5 px-2.5 py-1 bg-taptik-moss/10 rounded-full border border-taptik-moss/20">
            <div className="w-1 h-1 rounded-full bg-taptik-moss animate-pulse" />
            <span className="text-[9px] text-taptik-moss font-black uppercase tracking-widest">Live Preview</span>
         </div>
      </div>
    </motion.div>
  );
};

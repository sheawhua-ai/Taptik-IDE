import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, CheckCircle2, Loader2, Terminal, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ThoughtStep } from '../types';

interface ThoughtProcessAccordionProps {
  thoughts: ThoughtStep[];
  status?: 'thinking' | 'completed' | 'error';
}

export const ThoughtProcessAccordion: React.FC<ThoughtProcessAccordionProps> = ({ 
  thoughts, 
  status = 'completed' 
}) => {
  const [isExpanded, setIsExpanded] = useState(status === 'thinking');

  // Unified business state text
  const currentStep = thoughts[thoughts.length - 1];
  const summaryText = status === 'thinking' 
    ? (currentStep?.status || '正在深度思考...')
    : `已深度思考 (经过 ${thoughts.length} 步思考)`;

  return (
    <div className="my-4 overflow-hidden border border-taptik-line/20 rounded-[20px] bg-taptik-cream/30">
      {/* Header / Summary Bar */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-taptik-cream/50 transition-colors group"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center">
            {status === 'thinking' ? (
              <Loader2 size={16} className="text-taptik-ember animate-spin" />
            ) : (
              <CheckCircle2 size={16} className="text-taptik-moss" />
            )}
          </div>
          <span className={`text-[13px] font-black tracking-tight ${status === 'thinking' ? 'text-taptik-ember' : 'text-taptik-muted'}`}>
            {summaryText}
          </span>
          {status === 'completed' && (
             <span className="text-[10px] text-taptik-muted/40 font-bold ml-1">
               展开详情
             </span>
          )}
        </div>
        <div className={`text-taptik-muted/30 group-hover:text-taptik-muted transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
          <ChevronDown size={14} />
        </div>
      </button>

      {/* Expanded Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-4 pb-4 space-y-3">
              <div className="h-px bg-taptik-line/10 mb-3" />
              {thoughts.map((step, idx) => (
                <div key={step.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-1.5 h-1.5 rounded-full mt-1.5 ${idx === thoughts.length - 1 && status === 'thinking' ? 'bg-taptik-ember animate-pulse' : 'bg-taptik-muted/30'}`} />
                    {idx !== thoughts.length - 1 && <div className="w-px flex-1 bg-taptik-line/10 my-1" />}
                  </div>
                  <div className="flex-1 pb-1">
                    <div className="flex items-center justify-between mb-1">
                       <p className="text-[12px] font-bold text-taptik-ink opacity-80">{step.status}</p>
                       <span className="text-[9px] font-mono text-taptik-muted/30 uppercase tracking-tighter">
                         Step {idx + 1}
                       </span>
                    </div>
                    {step.log && (
                      <div className="bg-taptik-ink/[0.02] border border-taptik-line/10 rounded-lg p-2.5 font-mono text-[11px] text-taptik-muted/60 leading-relaxed whitespace-pre-wrap">
                        {step.log}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

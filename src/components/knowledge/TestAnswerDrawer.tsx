import React, { useState } from 'react';
import { X, MessageSquare, Play, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface TestAnswerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TestAnswerDrawer({ isOpen, onClose }: TestAnswerDrawerProps) {
  const [question, setQuestion] = useState('');
  const [hasTested, setHasTested] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleTest = () => {
    if (!question.trim()) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setHasTested(true);
    }, 1000);
  };

  return (
    <>
      <div className="fixed inset-0 bg-neutral-900/20 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full sm:w-[600px] bg-white shadow-2xl z-50 flex flex-col transform transition-transform">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-neutral-100 bg-neutral-50/50">
          <div className="flex items-center text-neutral-900 font-bold text-lg">
            <MessageSquare className="w-5 h-5 mr-2 text-neutral-900" />
            测试回答
          </div>
          <button onClick={onClose} className="p-2 text-neutral-400 hover:text-neutral-600 rounded-full hover:bg-neutral-100 transition-colors shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col">
          {/* Input Area */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-neutral-900">输入真实业务问题测试知识调用结果</label>
            <textarea
              className="w-full border border-neutral-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-neutral-200 focus:border-neutral-400 outline-none resize-none transition-all shadow-sm bg-white"
              rows={4}
              placeholder="例如：幼犬换粮拉肚子时店长应该怎么回答？"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <div className="flex justify-end">
              <button
                onClick={handleTest}
                disabled={!question.trim() || isLoading}
                className="flex items-center px-6 py-2 bg-neutral-900 text-white rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? '思考中...' : <><Play className="w-4 h-4 mr-1.5 fill-current" /> 生成测试回答</>}
              </button>
            </div>
          </div>

          {/* Results Area */}
          {hasTested && (
            <div className="flex-1 flex flex-col space-y-6 mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="border-t border-neutral-100 pt-6">
                <h3 className="text-sm font-semibold text-neutral-900 mb-3">AI 最终回答</h3>
                <div className="bg-neutral-50 p-4 rounded-xl text-sm text-neutral-800 leading-relaxed border border-neutral-100">
                  <p>亲爱的家长您好！幼犬在换粮期间由于肠胃还在适应新配方，偶尔出现软便属于正常过渡现象。建议您采取“七日换粮法”，逐渐增加新粮比例来帮助肠胃适应。</p>
                  <p className="mt-2 text-neutral-500 italic text-xs">（注意：这段回答运用了专业营养师人设，并避开了治疗承诺，符合品牌禁区规定。）</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-neutral-900">调用详情与依据溯源</h3>
                
                {/* Warning for unconfirmed knowledge */}
                <div className="flex items-start bg-amber-50 text-amber-800 p-3 rounded-lg border border-amber-200 text-xs">
                  <ShieldAlert className="w-4 h-4 mr-2 shrink-0 mt-0.5 text-amber-600" />
                  <span>发现 1 条相关但尚未确认的高风险知识，未用于本次回答。请在“待确认工作台”中处理后再测试。</span>
                </div>

                <div className="bg-white border border-neutral-100 rounded-xl overflow-hidden text-sm">
                  <div className="p-3 bg-neutral-50 font-medium text-neutral-700 border-b border-neutral-100 flex items-center justify-between">
                    <span>规则与禁区</span>
                    <span className="text-xs text-neutral-500 font-normal">优先级最高</span>
                  </div>
                  <div className="p-3 text-neutral-600 flex items-start">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2 shrink-0 mt-0.5" />
                    换粮软便场景不得使用‘治疗、治愈’等功效承诺。
                  </div>
                </div>

                <div className="bg-white border border-neutral-100 rounded-xl overflow-hidden text-sm">
                  <div className="p-3 bg-neutral-50 font-medium text-neutral-700 border-b border-neutral-100 flex items-center justify-between">
                    <span>经验建议</span>
                    <span className="text-xs text-neutral-500 font-normal">次优先</span>
                  </div>
                  <div className="p-3 text-neutral-600 flex items-start">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2 shrink-0 mt-0.5" />
                    店长号使用专业解释加真实案例，比单纯促销更容易产生咨询。
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

import React, { useState } from 'react';
import { 
  Share2, ShieldCheck, Check, Clock, TrendingUp, 
  MessageSquare, Copy, AlertCircle, Sparkles, CheckCheck,
  ExternalLink, Bell, CheckCircle2
} from 'lucide-react';
import { ExecutionTask } from '../types';

interface PublishAiHubProps {
  task: ExecutionTask;
  onConfirmPublishArchive: () => void;
  showToast: (msg: string) => void;
}

export function PublishAiHub({
  task,
  onConfirmPublishArchive,
  showToast
}: PublishAiHubProps) {
  const [selectedCommentIndex, setSelectedCommentIndex] = useState<number>(0);

  const commentTemplates = [
    {
      id: 'c1',
      title: '专业答疑与私信承接',
      badge: '推荐 · 信任度高',
      content: `大家如果拿不准自家毛孩子的换粮比例，可以在评论区留言【狗狗月龄 + 体重 + 现有狗粮】，店长看到会一一帮大家计算换粮过渡方案哦～`,
      strategy: '通过专业答疑引导评论区提问，拉高互动率与转粉率'
    },
    {
      id: 'c2',
      title: '线下门店到店礼包引流',
      badge: '高转化 · 到店客资',
      content: `【粉丝专属福利】凭本篇笔记截图到我们【陆家嘴门店】，即可免费领取【幼犬7日换粮保姆级试吃礼包】一份！数量有限，先到先得～`,
      strategy: '通过线下专属小样/礼包吸引本地精准备婚/养宠同城客户到店'
    },
    {
      id: 'c3',
      title: '提问互动引发评论区热议',
      badge: '冲算法推荐',
      content: `大家在给毛孩子换粮时遇到过最头疼的问题是什么？是挑食不吃还是软便拉稀？欢迎在评论区吐个槽，互相避个坑～`,
      strategy: '降低评论门槛，引导泛用户表达观点，触发小红书推荐算法二级流量池'
    }
  ];

  const copyToClipboard = (text: string, tip: string) => {
    navigator.clipboard.writeText(text);
    showToast(tip);
  };

  return (
    <div className="w-80 border-l border-border-default bg-surface flex flex-col shrink-0">
      
      {/* Header */}
      <div className="p-3.5 border-b border-border-default bg-surface-subtle flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-neutral-900 text-white flex items-center justify-center text-[13px] font-bold">
            <Share2 size={13} />
          </div>
          <div>
            <div className="text-[13px] font-semibold text-text-primary">
              发布核销与转化 AI 协调
            </div>
            <div className="text-[13px] text-text-tertiary">
              OCR 一致性比对 · 置顶首评生成
            </div>
          </div>
        </div>
      </div>

      {/* Body Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-[13px]">
        
        {/* 1. OCR Verification & Consistency Report */}
        <div className="p-3.5 bg-surface-subtle border border-border-subtle rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-[13px] font-semibold text-text-primary flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-600" />
              <span>智能 OCR 一致性验真报告</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[13px] font-medium bg-emerald-100 text-emerald-800">
              一致率 100%
            </span>
          </div>

          <div className="space-y-1.5 text-[13px]">
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">标题比对：</span>
              <span className="font-medium text-text-primary flex items-center gap-0.5">
                <Check size={11} className="text-emerald-600" />
                与定稿完全一致
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">首图及配图：</span>
              <span className="font-medium text-text-primary flex items-center gap-0.5">
                <Check size={11} className="text-emerald-600" />
                已核验 3 张，无水印无违规
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">话题标签挂载：</span>
              <span className="font-medium text-text-primary flex items-center gap-0.5">
                <Check size={11} className="text-emerald-600" />
                核心搜索词已完整植入
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">账号身份比对：</span>
              <span className="font-medium text-text-primary">{task.targetAccount}</span>
            </div>
          </div>

          <div className="p-2 bg-emerald-50/80 rounded-lg border border-emerald-200/80 text-[13px] text-emerald-900 leading-relaxed flex items-start gap-1.5">
            <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong>核验结论：</strong>发布链接真实有效，内容与操盘手确认定稿无偏差，可放心核销归档。
            </div>
          </div>
        </div>

        {/* 2. Traffic & Search Indexing Forecast */}
        <div className="p-3.5 bg-surface rounded-xl border border-border-default space-y-2.5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-[13px] font-semibold text-text-primary flex items-center gap-1.5">
              <TrendingUp size={13} className="text-brand-600" />
              <span>流量时段与搜索收录预估</span>
            </div>
            <span className="text-[13px] text-text-tertiary">黄金发布期</span>
          </div>

          <div className="space-y-1.5 text-[13px]">
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">目标活跃时段：</span>
              <span className="font-medium text-text-primary">18:30 - 21:30 (晚高峰)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">预估收录耗时：</span>
              <span className="font-medium text-text-primary">约 2-4 小时进入索引</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">建议承接动作：</span>
              <span className="font-medium text-emerald-700">1 小时内跟进置顶首评</span>
            </div>
          </div>
        </div>

        {/* 3. AI Generated Pinned First Comment (3 Models) */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="text-[13px] font-semibold text-text-primary flex items-center gap-1.5">
              <Sparkles size={13} className="text-amber-600" />
              <span>AI 置顶首评与引流话术</span>
            </div>
            <span className="text-[13px] text-text-tertiary">一键复制带节奏</span>
          </div>

          {/* Model selection tabs */}
          <div className="flex gap-1 overflow-x-auto pb-1">
            {commentTemplates.map((t, idx) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedCommentIndex(idx)}
                className={`px-2.5 py-1 text-[13px] rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  selectedCommentIndex === idx
                    ? 'bg-neutral-900 text-white font-medium shadow-sm'
                    : 'bg-surface-subtle text-text-secondary hover:bg-surface-hover border border-border-default'
                }`}
              >
                {t.title}
              </button>
            ))}
          </div>

          {/* Selected comment display */}
          {commentTemplates[selectedCommentIndex] && (
            <div className="p-3 bg-surface border border-border-default rounded-xl space-y-2.5 shadow-sm animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[13px] font-medium bg-amber-50 text-amber-900 border border-amber-200">
                  {commentTemplates[selectedCommentIndex].badge}
                </span>
                <span className="text-[13px] text-text-tertiary">
                  {commentTemplates[selectedCommentIndex].strategy}
                </span>
              </div>

              <div className="p-2.5 bg-surface-subtle border border-border-subtle rounded-lg text-[13px] text-text-primary leading-relaxed">
                "{commentTemplates[selectedCommentIndex].content}"
              </div>

              <div className="flex items-center justify-end gap-2 pt-1 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={() => copyToClipboard(
                    commentTemplates[selectedCommentIndex].content,
                    '置顶首评文案已复制到剪贴板！'
                  )}
                  className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-[13px] font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Copy size={12} />
                  <span>复制首评文案</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 4. Sentiment & Comments Monitoring Alert Rule */}
        <div className="p-3 bg-surface-subtle border border-border-subtle rounded-xl space-y-2">
          <div className="text-[13px] font-semibold text-text-primary flex items-center gap-1.5">
            <Bell size={13} className="text-brand-600" />
            <span>自动舆情与差评预警监控</span>
          </div>
          <div className="text-[13px] text-text-secondary leading-relaxed">
            归档后系统将自动挂载小红书评论监控，若出现<strong>“软便/拉稀/假货/差评”</strong>等负面关键词，将即时通知操盘手协同回复。
          </div>
        </div>

      </div>

    </div>
  );
}

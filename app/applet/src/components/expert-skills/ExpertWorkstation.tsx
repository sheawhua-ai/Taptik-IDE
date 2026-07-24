import React, { useState } from 'react';
import { ExpertItem, OpportunityHypothesis, TaskUnderstandingCardData } from './types';
import {
  ChevronLeft, Send, Sparkles, Plus, Layers, BookOpen, User, Building2,
  Folder, CheckCircle2, AlertTriangle, MessageSquare, Play, HelpCircle,
  FileText, Shield, ArrowRight, X, Clock, RefreshCw, Eye, Edit3, Trash2,
  ChevronRight, Bot, PanelRightClose, PanelRightOpen, Check, ShieldCheck
} from 'lucide-react';

interface ExpertWorkstationProps {
  expert: ExpertItem;
  onBack: () => void;
  onOpenValidationPlan: (hyp: OpportunityHypothesis) => void;
  onOpenRunLog: () => void;
}

export const ExpertWorkstation: React.FC<ExpertWorkstationProps> = ({
  expert,
  onBack,
  onOpenValidationPlan,
  onOpenRunLog
}) => {
  const [taskInput, setTaskInput] = useState('');
  const [selectedContexts, setSelectedContexts] = useState<string[]>([
    '当前商家: 皇家宠物食品',
    '当前项目: 幼猫换粮抗应激项目'
  ]);

  // Workstation state
  const [viewState, setViewState] = useState<
    'empty' | 'understanding' | 'executing' | 'results' | 'missing_input' | 'failed'
  >('results');

  // AI Collaboration panel toggle
  const [showCollabPanel, setShowCollabPanel] = useState(false);
  const [collabMessages, setCollabMessages] = useState<
    { sender: 'expert' | 'user'; text: string; time: string }[]
  >([
    {
      sender: 'expert',
      text: '您好！我是蓝海机会研究专家。我已经阅读了您提供的商家资料和历史评论数据。',
      time: '10:30'
    },
    {
      sender: 'expert',
      text: '提醒：在第2个假设“挑食老猫伴粮”中，缺乏同行在天猫平台的真实月度退款率，建议是否需要人工补充？',
      time: '10:31'
    }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Task understanding card mock data
  const [taskCard, setTaskCard] = useState<TaskUnderstandingCardData>({
    problemToSolve: '分析幼猫换粮过程中的用户痛点，寻找低竞争高转化的蓝海搜索切入词与内容选题。',
    currentScope: '预算 5000 元，涵盖 10 篇 KOC 笔记 + 2 篇 KOS 店长号专业解答。',
    acquiredData: [
      '品牌主推SKU（益生元冻干幼猫粮）',
      '近30天小红书换粮词频搜索量 18,400',
      '既往200条转化评论原声数据'
    ],
    missingInfo: [
      '竞品在三方电商平台的真实退货率与退款负评'
    ],
    suggestedMethod: '对标人群痛点抽离 -> 生成蓝海机会假设卡片 -> 人工确认后纳入验证计划。',
    expectedDeliverables: [
      '2张精细化蓝海机会假设卡片',
      '推荐发布测试的KOC/KOS账号组合方案'
    ],
    manualConfirmLocation: '确认拟验证的机会假设方向及首轮测试笔记预算'
  });

  // Opportunity hypotheses list
  const [hypotheses, setHypotheses] = useState<OpportunityHypothesis[]>([
    {
      id: 'hyp_1',
      name: '幼猫换粮软便抗应激切入点',
      userProblem: '新手猫主换粮过程中猫咪容易拉稀、软便，担心宠物肠胃受损及看诊高额费用。',
      userExpressions: ['幼猫换粮软便怎么办', '换粮拉稀要吃益生菌吗', '猫咪换粮玻璃胃应激'],
      worthReason: '搜索量月增45%，现存笔记多为纯药物推销，缺少“科学过渡换粮+保护肠道”的品牌解决方案，竞品投放重合度低。',
      confirmedFacts: [
        '商家当前SKU含有独家益生元与高消化率冻干颗粒',
        '小红书搜索“换粮软便”近30天搜索指数为 18,400',
        '评论区 38% 的提问集中在“7天换粮法是否依然拉稀”'
      ],
      aiInferences: [
        '用户对传统“7天换粮法”存在执行痛点，希望获得无缝不软便的省心替代方案',
        '配合真实KOS店长号出面讲“换粮不踩坑”更易建立专业信任'
      ],
      hypothesesToVerify: [
        '以“换粮软便救星/无应激换粮”为题眼，主打实测案例，可提升进店咨询率 30% 以上'
      ],
      evidenceSources: [
        { name: '小红书宠物行业大盘词频表', time: '2026-07-20' },
        { name: '商家既往200条转化评论分析', time: '2026-07-22' }
      ],
      missingData: [
        '同行竞品“A品牌幼猫粮”在天猫的真实月度退款率'
      ],
      suggestedContentDir: '真实养猫人“换粮翻车记录” + 科普防护 + 试吃装引流',
      suggestedAccountType: 'KOC素人真实体验 + KOS店长号专业答疑',
      sampleSize: '第一波测试 10 篇 KOC 笔记 + 2 篇 KOS 店长号深入解答',
      observationPeriod: '发布后 14 天',
      passCriteria: '平均互动率 > 4.5%，产生意向评论占比 > 15%，千次展现进店成本 < 8元',
      failCriteria: '14天内互动率 < 1.8% 或高意向评论数为 0',
      status: 'to_verify'
    },
    {
      id: 'hyp_2',
      name: '挑食老猫高蛋白冻干伴粮机会',
      userProblem: '老年猫牙齿退化不爱吃硬干粮，猫主苦恼营养摄入不足且消瘦。',
      userExpressions: ['老猫不吃粮怎么增重', '挑食猫咪复原罐头伴粮', '老猫适口性好的粮'],
      worthReason: '老猫照护人群消费意愿极高，且市场主流品牌集中在幼猫成猫，老猫专属伴粮赛道处于蓝海蓝海期。',
      confirmedFacts: [
        '“老猫照护”搜索量年同比增长 62%',
        '商家产品颗粒酥脆易咀嚼，肉香浓郁'
      ],
      aiInferences: [
        '老猫主人对“消瘦/掉毛/不爱动”极度焦虑，需要情感共鸣与物理易咀嚼的场景证明'
      ],
      hypothesesToVerify: [
        '突出“专为老猫设计的物理酥脆与温水泡粮复原”，能获得高复购率人群关注'
      ],
      evidenceSources: [
        { name: '历史项目：老猫护理类图文', time: '2026-07-15' }
      ],
      missingData: [
        '老猫主人在私域群的真实留存复购周期'
      ],
      suggestedContentDir: '老猫日常温情记录 + 酥脆复水实测视频',
      suggestedAccountType: '资深多猫家庭 KOC',
      sampleSize: '5 篇视频笔记',
      observationPeriod: '7 天',
      passCriteria: '收藏率 > 6%，互动成本 < 3.5元',
      failCriteria: '收藏率 < 2%',
      status: 'ai_inference'
    }
  ]);

  const handleTaskSubmit = () => {
    if (!taskInput.trim()) return;
    setViewState('understanding');
  };

  const handleConfirmUnderstanding = () => {
    setViewState('executing');
    setTimeout(() => {
      setViewState('results');
    }, 2000);
  };

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    const userMsg = { sender: 'user' as const, text: chatInput, time: '10:32' };
    setCollabMessages(prev => [...prev, userMsg]);
    setChatInput('');

    setTimeout(() => {
      setCollabMessages(prev => [
        ...prev,
        {
          sender: 'expert',
          text: '好的，我已经记下了您的补充说明，并将对应的建议样本量更新到机会卡片中。',
          time: '10:33'
        }
      ]);
    }, 1000);
  };

  const toggleContext = (ctx: string) => {
    if (selectedContexts.includes(ctx)) {
      setSelectedContexts(selectedContexts.filter(c => c !== ctx));
    } else {
      setSelectedContexts([...selectedContexts, ctx]);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-neutral-50 overflow-hidden">
      {/* Top Navbar */}
      <div className="h-14 bg-white border-b border-neutral-200 px-6 flex items-center justify-between shrink-0 shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 hover:bg-neutral-100 rounded-xl text-neutral-600 transition-colors"
            title="返回专家首页"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[16px] font-extrabold text-neutral-900 tracking-tight">
                {expert.name} · 工作台
              </h1>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[11px] font-bold rounded border border-emerald-200">
                按确认方案运行
              </span>
            </div>
            <p className="text-[11px] text-neutral-400">
              已挂载技能: {expert.availableSkills.map(s => s.name).join('、')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenRunLog}
            className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-[12px] font-bold rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Clock size={14} /> 运行依据与日志
          </button>

          <button
            onClick={() => setShowCollabPanel(!showCollabPanel)}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-bold border transition-colors flex items-center gap-1.5 ${
              showCollabPanel
                ? 'bg-neutral-900 text-white border-neutral-900'
                : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
            }`}
          >
            {showCollabPanel ? <PanelRightClose size={14} /> : <PanelRightOpen size={14} />}
            和专家讨论
          </button>
        </div>
      </div>

      {/* 3-Column Main Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Task History */}
        <div className="w-64 bg-white border-r border-neutral-200 flex flex-col shrink-0">
          <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
            <span className="text-[12px] font-extrabold text-neutral-500 uppercase tracking-wider">
              任务列表
            </span>
            <button
              onClick={() => {
                setViewState('empty');
                setTaskInput('');
              }}
              className="p-1 hover:bg-neutral-100 rounded text-neutral-600"
              title="新建任务"
            >
              <Plus size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
            <div
              onClick={() => setViewState('results')}
              className={`p-3 rounded-xl border text-[12px] cursor-pointer transition-all ${
                viewState === 'results' || viewState === 'understanding'
                  ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                  : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-700'
              }`}
            >
              <div className="font-extrabold truncate mb-1">幼猫换粮软便蓝海切入分析</div>
              <div
                className={`text-[10px] ${
                  viewState === 'results' || viewState === 'understanding'
                    ? 'text-neutral-400'
                    : 'text-neutral-400'
                }`}
              >
                10分钟前 · 2个假设
              </div>
            </div>

            <div className="p-3 rounded-xl border border-neutral-200 bg-neutral-50/50 text-[12px] text-neutral-500 hover:bg-neutral-100 cursor-pointer">
              <div className="font-bold truncate mb-1">老年犬软骨素人群挖掘</div>
              <div className="text-[10px] text-neutral-400">昨天 · 已写入验证计划</div>
            </div>
          </div>
        </div>

        {/* Middle Column: Main Canvas & Results */}
        <div className="flex-1 flex flex-col overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {/* Top Natural Language Task Input Box */}
          <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
            <div className="relative">
              <textarea
                value={taskInput}
                onChange={e => setTaskInput(e.target.value)}
                placeholder="告诉我你想研究、判断或完成什么……（例：分析换粮场景下的消费者疑虑，提炼蓝海切入机会）"
                className="w-full h-20 bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-[13px] text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:bg-white focus:border-neutral-400 transition-all resize-none"
              />
              <button
                onClick={handleTaskSubmit}
                className="absolute right-3 bottom-3 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-[12px] font-extrabold rounded-lg shadow-sm flex items-center gap-1.5 transition-all"
              >
                <Sparkles size={14} /> 提交分析
              </button>
            </div>

            {/* Context Quick Entry Tags */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold text-neutral-400">挂载上下文资料:</div>
              <div className="flex flex-wrap gap-2 text-[12px]">
                {[
                  '当前商家: 皇家宠物食品',
                  '当前项目: 幼猫换粮抗应激项目',
                  '历史项目: 2025天猫大促',
                  '账号资产: 门店KOS店长号(4个)',
                  '商家知识: 换粮问答手册',
                  '我的经验: 敏感肠道高留存策略'
                ].map((ctx, idx) => {
                  const isSel = selectedContexts.includes(ctx);
                  return (
                    <button
                      key={idx}
                      onClick={() => toggleContext(ctx)}
                      className={`px-2.5 py-1 rounded-lg border font-medium transition-all ${
                        isSel
                          ? 'bg-neutral-900 text-white border-neutral-900'
                          : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100'
                      }`}
                    >
                      {isSel && '✓ '}
                      {ctx}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* VIEW STATE: Task Understanding Card ("任务理解卡") */}
          {viewState === 'understanding' && (
            <div className="bg-white rounded-2xl border-2 border-primary-500 p-6 shadow-md space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary-50 text-primary-600 rounded-xl">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <h2 className="text-[16px] font-extrabold text-neutral-900">
                      专家任务理解卡
                    </h2>
                    <p className="text-[12px] text-neutral-500">
                      系统已根据您的自然语言与挂载上下文自动梳理边界，请核对后开始执行。
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-amber-50 text-amber-800 text-[12px] font-bold rounded-lg border border-amber-200">
                  等待人工确认
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-[13px]">
                <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100 space-y-1">
                  <div className="text-[11px] font-bold text-neutral-400">拟解决问题:</div>
                  <div className="font-bold text-neutral-900">{taskCard.problemToSolve}</div>
                </div>
                <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100 space-y-1">
                  <div className="text-[11px] font-bold text-neutral-400">当前范围与约束:</div>
                  <div className="font-bold text-neutral-900">{taskCard.currentScope}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-[13px]">
                <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100 space-y-2">
                  <div className="text-[11px] font-bold text-neutral-400">已获得资料:</div>
                  <ul className="space-y-1 font-medium text-neutral-700">
                    {taskCard.acquiredData.map((d, i) => (
                      <li key={i}>✓ {d}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100 space-y-2">
                  <div className="text-[11px] font-bold text-amber-700">还缺少的信息:</div>
                  <ul className="space-y-1 font-bold text-amber-900">
                    {taskCard.missingInfo.map((m, i) => (
                      <li key={i}>⚠ {m}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100 space-y-1 text-[13px]">
                <div className="text-[11px] font-bold text-neutral-400">人工确认点位置:</div>
                <div className="font-bold text-amber-800">{taskCard.manualConfirmLocation}</div>
              </div>

              {/* Task Understanding Card Bottom Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleConfirmUnderstanding}
                  className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-extrabold text-[13px] rounded-xl shadow-sm flex items-center gap-1.5"
                >
                  <CheckCircle2 size={16} /> 确认并开始执行
                </button>
                <button
                  onClick={() => setViewState('empty')}
                  className="px-4 py-2.5 bg-white border border-neutral-200 text-neutral-700 font-bold text-[13px] rounded-xl hover:bg-neutral-50"
                >
                  修改任务
                </button>
                <button
                  onClick={() => setShowCollabPanel(true)}
                  className="px-4 py-2.5 bg-white border border-neutral-200 text-amber-700 font-bold text-[13px] rounded-xl hover:bg-amber-50"
                >
                  先补资料
                </button>
              </div>
            </div>
          )}

          {/* VIEW STATE: Executing State */}
          {viewState === 'executing' && (
            <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center my-6 space-y-4">
              <RefreshCw size={36} className="mx-auto text-primary-600 animate-spin" />
              <h3 className="text-[16px] font-extrabold text-neutral-900">
                专家正在分析与提炼机会假设……
              </h3>
              <p className="text-[13px] text-neutral-500">
                依次调用技能: [蓝海机会假设生成] → [评论意图识别]...
              </p>
            </div>
          )}

          {/* VIEW STATE: Results State - Opportunity Hypotheses */}
          {viewState === 'results' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-[18px] font-extrabold text-neutral-900 tracking-tight">
                    蓝海机会假设清单 (基于真实运营事实与AI推断)
                  </h2>
                  <p className="text-[12px] text-neutral-500">
                    提示：请操盘手核对事实与推断依据后，点击“加入验证计划”写入项目中心。
                  </p>
                </div>
                <span className="text-[12px] font-bold text-neutral-500">
                  共输出 {hypotheses.length} 张假设卡
                </span>
              </div>

              {/* Opportunity Hypotheses Cards */}
              {hypotheses.map(hyp => (
                <div
                  key={hyp.id}
                  className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm space-y-6"
                >
                  {/* Title & Status */}
                  <div className="flex items-start justify-between border-b border-neutral-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 bg-primary-50 text-primary-700 font-extrabold text-[11px] rounded border border-primary-100">
                          机会假设
                        </span>
                        <h3 className="text-[17px] font-extrabold text-neutral-900">
                          {hyp.name}
                        </h3>
                      </div>
                      <p className="text-[13px] text-neutral-600">
                        <span className="font-bold text-neutral-500">用户问题:</span> {hyp.userProblem}
                      </p>
                    </div>

                    {/* Status Pill */}
                    <div>
                      {hyp.status === 'to_verify' && (
                        <span className="px-3 py-1 bg-amber-50 text-amber-800 text-[12px] font-bold rounded-lg border border-amber-200">
                          待验证
                        </span>
                      )}
                      {hyp.status === 'ai_inference' && (
                        <span className="px-3 py-1 bg-blue-50 text-blue-800 text-[12px] font-bold rounded-lg border border-blue-200">
                          AI 推断
                        </span>
                      )}
                      {hyp.status === 'confirmed_fact' && (
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-800 text-[12px] font-bold rounded-lg border border-emerald-200">
                          已确认事实
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Worth Reason */}
                  <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-100 text-[13px]">
                    <span className="font-extrabold text-neutral-900">为什么值得验证: </span>
                    <span className="text-neutral-700 font-medium">{hyp.worthReason}</span>
                  </div>

                  {/* Facts vs Inferences vs Hypotheses */}
                  <div className="grid grid-cols-3 gap-4 text-[12px]">
                    <div className="p-3.5 bg-emerald-50/50 border border-emerald-100 rounded-xl space-y-2">
                      <div className="font-extrabold text-emerald-900 flex items-center gap-1">
                        <CheckCircle2 size={14} className="text-emerald-600" /> 已确认事实 (Facts)
                      </div>
                      <ul className="space-y-1 text-emerald-950 font-medium">
                        {hyp.confirmedFacts.map((f, i) => (
                          <li key={i}>• {f}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3.5 bg-blue-50/50 border border-blue-100 rounded-xl space-y-2">
                      <div className="font-extrabold text-blue-900 flex items-center gap-1">
                        <Sparkles size={14} className="text-blue-600" /> AI 推断 (Inferences)
                      </div>
                      <ul className="space-y-1 text-blue-950 font-medium">
                        {hyp.aiInferences.map((inf, i) => (
                          <li key={i}>• {inf}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3.5 bg-amber-50/50 border border-amber-100 rounded-xl space-y-2">
                      <div className="font-extrabold text-amber-900 flex items-center gap-1">
                        <HelpCircle size={14} className="text-amber-600" /> 待验证假设 (Hypotheses)
                      </div>
                      <ul className="space-y-1 text-amber-950 font-medium">
                        {hyp.hypothesesToVerify.map((h, i) => (
                          <li key={i}>• {h}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Missing Data Warning */}
                  {hyp.missingData.length > 0 && (
                    <div className="p-3 bg-neutral-100 rounded-xl border border-neutral-200 text-[12px] flex items-center justify-between text-neutral-600">
                      <span className="font-bold">数据暂不可得: {hyp.missingData.join('、')}</span>
                      <span className="text-[11px] text-neutral-400">不影响首轮低成本测试</span>
                    </div>
                  )}

                  {/* Suggested Execution Specs */}
                  <div className="grid grid-cols-2 gap-4 text-[12px] bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                    <div>
                      <span className="font-bold text-neutral-500">建议内容方向:</span>{' '}
                      <span className="font-bold text-neutral-800">{hyp.suggestedContentDir}</span>
                    </div>
                    <div>
                      <span className="font-bold text-neutral-500">首轮验证样本:</span>{' '}
                      <span className="font-bold text-neutral-800">{hyp.sampleSize}</span>
                    </div>
                    <div>
                      <span className="font-bold text-neutral-500">观察周期:</span>{' '}
                      <span className="font-bold text-neutral-800">{hyp.observationPeriod}</span>
                    </div>
                    <div>
                      <span className="font-bold text-neutral-500">通过标准:</span>{' '}
                      <span className="font-bold text-emerald-700">{hyp.passCriteria}</span>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="pt-2 flex items-center justify-between gap-3 border-t border-neutral-100">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onOpenValidationPlan(hyp)}
                        className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-extrabold text-[13px] rounded-xl shadow-sm flex items-center gap-1.5"
                      >
                        <ShieldCheck size={14} /> 加入验证计划
                      </button>
                      <button
                        onClick={onOpenRunLog}
                        className="px-3.5 py-2 bg-white border border-neutral-200 text-neutral-700 font-bold text-[12px] rounded-xl hover:bg-neutral-50"
                      >
                        查看依据
                      </button>
                      <button
                        onClick={() => setShowCollabPanel(true)}
                        className="px-3.5 py-2 bg-white border border-neutral-200 text-neutral-700 font-bold text-[12px] rounded-xl hover:bg-neutral-50 flex items-center gap-1"
                      >
                        <MessageSquare size={13} /> 和专家讨论
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-[12px] text-neutral-500">
                      <button className="hover:text-neutral-900 font-bold">编辑</button>
                      <span>·</span>
                      <button className="hover:text-red-600 font-bold">暂不采用</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: AI Collaboration Panel (Collapsible) */}
        {showCollabPanel && (
          <div className="w-80 bg-white border-l border-neutral-200 flex flex-col shrink-0 animate-in slide-in-from-right duration-150">
            <div className="p-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
              <div className="flex items-center gap-2 font-extrabold text-[13px] text-neutral-900">
                <Bot size={16} className="text-primary-600" /> 和专家协作讨论
              </div>
              <button
                onClick={() => setShowCollabPanel(false)}
                className="p-1 hover:bg-neutral-100 rounded text-neutral-500"
              >
                <X size={16} />
              </button>
            </div>

            {/* Chat Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar text-[12px]">
              {collabMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-neutral-900 text-white rounded-br-xs'
                        : 'bg-neutral-100 text-neutral-800 rounded-bl-xs font-medium'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-neutral-400 mt-1 px-1">{msg.time}</span>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-3 border-t border-neutral-100 bg-white">
              <div className="relative">
                <input
                  type="text"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendChat()}
                  placeholder="补充关键事实或提问专家……"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-2 pl-3 pr-10 text-[12px] focus:outline-none focus:bg-white focus:border-neutral-400 transition-all"
                />
                <button
                  onClick={handleSendChat}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-primary-600 hover:text-primary-800"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { ExpertItem, SkillItem, ResultUsageType, AppScope } from './types';
import {
  X, Play, Shield, CheckCircle2, AlertTriangle, HelpCircle, ArrowRight,
  ChevronDown, ChevronUp, Layers, FileText, Database, Sparkles, RefreshCw, Plus, Eye, Send, Check
} from 'lucide-react';

interface WorkstationProps {
  expert: ExpertItem;
  onClose: () => void;
  onOpenScopeModal: (expert: ExpertItem) => void;
}

export const Workstation: React.FC<WorkstationProps> = ({
  expert,
  onClose,
  onOpenScopeModal
}) => {
  // Left Panel Task States
  const [taskGoal, setTaskGoal] = useState<string>(
    '在小红书针对新客痛点“幼猫换粮拉稀/软便”，挖掘低竞争高转化的蓝海切入机会，生成可验证的选题假设并制定测试策略。'
  );
  const [extraPrompt, setExtraPrompt] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [hasAnalyzed, setHasAnalyzed] = useState<boolean>(true);

  // Execution Summary Fold State (Requirement 7: collapsed by default)
  const [isSummaryExpanded, setIsSummaryExpanded] = useState<boolean>(false);

  // Usage Modal State (Requirement 7)
  const [showUsageModal, setShowUsageModal] = useState<boolean>(false);
  const [selectedUsage, setSelectedUsage] = useState<ResultUsageType>('project_strategy');
  const [showWritePreview, setShowWritePreview] = useState<boolean>(false);
  const [isResultAdopted, setIsResultAdopted] = useState<boolean>(false);

  // Run Analysis Simulation
  const handleRunAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setHasAnalyzed(true);
    }, 800);
  };

  const usageOptions: { id: ResultUsageType; label: string; desc: string }[] = [
    { id: 'project_strategy', label: '加入当前项目的策略依据', desc: '写入“幼猫换粮抗应激项目”的策略中心，作为后续KOC排期的输入' },
    { id: 'create_val_proj', label: '创建验证项目', desc: '开启独立验证小项目，安排第一波10篇KOC测试发文' },
    { id: 'execution_todo', label: '创建执行中心待办', desc: '向操盘手与KOC发文工单看板推送“素材与脚本撰写”待办' },
    { id: 'write_merchant_kb', label: '写入商家知识', desc: '沉淀为商家“皇家宠物食品”的长效答疑与违规红线知识库' },
    { id: 'save_to_experience', label: '保存到我的经验', desc: '存入个人的操盘手经验库，供未来其他商家复用' },
    { id: 'none', label: '暂不采用', desc: '仅在本次任务中留存结果，不做外部数据写入' }
  ];

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 p-6 flex flex-col space-y-4">
      {/* Top Header */}
      <div className="bg-neutral-800/90 border border-neutral-700/80 p-4 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-purple-900/50 text-purple-300 rounded-xl border border-purple-700/50">
            <Sparkles size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[18px] font-extrabold text-white">
                {expert.name} · 任务工作台
              </h1>
              <span className="px-2 py-0.5 bg-purple-950 text-purple-300 border border-purple-800 rounded text-[11px] font-extrabold">
                AI IDE 模式
              </span>
            </div>
            <p className="text-[12px] text-neutral-400 font-medium mt-0.5">
              由专家编排授权技能执行，全程保留人工确认节点。
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenScopeModal(expert)}
            className="px-3 py-1.5 bg-neutral-700 hover:bg-neutral-600 text-neutral-200 text-[12px] font-extrabold rounded-xl transition-all"
          >
            当前范围：{expert.appScope === 'merchant' ? '当前商家 (皇家宠物食品)' : '项目范围'}
          </button>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-700 rounded-xl transition-all"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Main Dual Column Layout (Requirement 7) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Task Control (5 Cols) */}
        <div className="lg:col-span-5 bg-neutral-800/60 border border-neutral-700/60 rounded-2xl p-5 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-700/80 pb-3">
              <h2 className="text-[15px] font-extrabold text-white flex items-center gap-2">
                <Shield size={16} className="text-purple-400" /> 任务控制区
              </h2>
              <span className="text-[11px] text-neutral-400">最小授权模式</span>
            </div>

            {/* 本次任务目标 */}
            <div className="space-y-1.5">
              <label className="text-[12px] font-extrabold text-neutral-300 block">本次任务目标：</label>
              <textarea
                rows={3}
                value={taskGoal}
                onChange={e => setTaskGoal(e.target.value)}
                className="w-full p-3 bg-neutral-900 border border-neutral-700 rounded-xl text-[12.5px] text-neutral-200 focus:outline-none focus:border-purple-500 font-medium"
              />
            </div>

            {/* 本次调用的技能 */}
            <div className="space-y-1.5">
              <label className="text-[12px] font-extrabold text-neutral-300 block">本次将调用的技能：</label>
              <div className="space-y-1.5">
                {expert.boundSkills?.map(sk => (
                  <div key={sk.id} className="p-2.5 bg-neutral-900/80 border border-neutral-700/60 rounded-xl flex items-center justify-between text-[12px]">
                    <span className="font-extrabold text-purple-300">{sk.name}</span>
                    <span className="text-[11px] text-neutral-400">{sk.oneSentenceDesc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 需要的输入资料 */}
            <div className="space-y-1.5">
              <label className="text-[12px] font-extrabold text-neutral-300 block">需要的输入资料：</label>
              <ul className="space-y-1 text-[12px] text-neutral-400 bg-neutral-900/50 p-3 rounded-xl border border-neutral-700/50">
                {expert.inputDocs?.map((doc, i) => (
                  <li key={i}>• {doc}</li>
                ))}
              </ul>
            </div>

            {/* 人工确认点 */}
            <div className="p-3 bg-amber-950/40 border border-amber-800/60 rounded-xl space-y-1 text-[12px]">
              <span className="font-extrabold text-amber-300 block">人工确认点：</span>
              <p className="text-amber-200/80">{expert.manualConfirmPoints?.join('； ') || '策略写入前需确认'}</p>
            </div>

            {/* 补充说明输入框 */}
            <div className="space-y-1.5">
              <label className="text-[12px] font-extrabold text-neutral-300 block">补充说明 (可选)：</label>
              <input
                type="text"
                placeholder="例如：重点对比换粮前7天的品牌益生菌搭配……"
                value={extraPrompt}
                onChange={e => setExtraPrompt(e.target.value)}
                className="w-full p-2.5 bg-neutral-900 border border-neutral-700 rounded-xl text-[12px] text-neutral-200 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* 运行分析按钮 */}
          <button
            onClick={handleRunAnalysis}
            disabled={isAnalyzing}
            className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-[13.5px] rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.99]"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                <span>分析执行中……</span>
              </>
            ) : (
              <>
                <Play size={16} />
                <span>运行分析</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Execution & Results (7 Cols) */}
        <div className="lg:col-span-7 bg-neutral-800/60 border border-neutral-700/60 rounded-2xl p-5 space-y-5 overflow-y-auto max-h-[80vh]">
          <div className="flex items-center justify-between border-b border-neutral-700/80 pb-3">
            <h2 className="text-[15px] font-extrabold text-white flex items-center gap-2">
              <Database size={16} className="text-emerald-400" /> 执行与结果区
            </h2>
            {isResultAdopted && (
              <span className="px-2.5 py-0.5 bg-emerald-900 text-emerald-300 border border-emerald-700 rounded text-[11px] font-extrabold flex items-center gap-1">
                <Check size={12} /> 结果已采用
              </span>
            )}
          </div>

          {/* 1. 任务理解 */}
          <div className="space-y-1.5 bg-neutral-900/60 p-4 rounded-xl border border-neutral-700/60">
            <span className="text-[12px] font-extrabold text-purple-300 block">1. 任务理解</span>
            <p className="text-[12.5px] text-neutral-300 leading-relaxed font-medium">
              专家已理解任务：在限定范围“皇家宠物食品”下，挖掘“幼猫换粮应激软便”的痛点原声。保持人工审阅，不直接自动开销。
            </p>
          </div>

          {/* 2. 已读取资料 */}
          <div className="space-y-1.5 bg-neutral-900/60 p-4 rounded-xl border border-neutral-700/60">
            <span className="text-[12px] font-extrabold text-blue-300 block">2. 已读取资料</span>
            <div className="flex flex-wrap gap-2 text-[11.5px]">
              <span className="px-2.5 py-1 bg-neutral-800 text-neutral-300 rounded-lg border border-neutral-700">
                📄 《皇家宠物食品换粮问答手册》
              </span>
              <span className="px-2.5 py-1 bg-neutral-800 text-neutral-300 rounded-lg border border-neutral-700">
                📊 近30天“换粮软便”搜索词大盘表
              </span>
              <span className="px-2.5 py-1 bg-neutral-800 text-neutral-300 rounded-lg border border-neutral-700">
                💬 120 条真实转化评论文本
              </span>
            </div>
          </div>

          {/* 3. 执行摘要 (Collapsed by default, Requirement 7) */}
          <div className="bg-neutral-900/60 rounded-xl border border-neutral-700/60 overflow-hidden">
            <button
              onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
              className="w-full p-3.5 flex items-center justify-between text-[12.5px] font-extrabold text-neutral-300 hover:bg-neutral-800/50 transition-all"
            >
              <span>3. 执行摘要：调用了 2 项技能，读取了 3 类资料，没有执行外部写入。</span>
              {isSummaryExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {isSummaryExpanded && (
              <div className="p-4 pt-1 border-t border-neutral-800 text-[12px] text-neutral-400 space-y-2 animate-in fade-in duration-150">
                <div className="flex items-center gap-2 text-emerald-400 font-extrabold">
                  <CheckCircle2 size={14} /> 技能“蓝海机会假设生成”已运行完成，提炼出 3 个候选假设。
                </div>
                <div className="flex items-center gap-2 text-emerald-400 font-extrabold">
                  <CheckCircle2 size={14} /> 技能“高意向评论与私域抽取”已运行完成，发现“软便问诊”强诉求。
                </div>
                <p className="text-[11.5px] text-neutral-500 pt-1">
                  注意：按规则仅展示技能级过程，隐藏底层数据库与API工具日志。
                </p>
              </div>
            )}
          </div>

          {/* 4. 结果必须区分 (Requirement 7) */}
          <div className="space-y-3 bg-neutral-900/80 p-4 rounded-xl border border-neutral-700/80">
            <span className="text-[13px] font-extrabold text-white block border-b border-neutral-800 pb-2">
              4. 结构化分析结果 (按事实/推断/缺口严格分类)
            </span>

            {/* 已确认事实 */}
            <div className="space-y-1">
              <span className="text-[11px] font-extrabold px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded">
                已确认事实 (Fact)
              </span>
              <ul className="text-[12px] text-neutral-300 space-y-1 pt-1 pl-1">
                <li>• 搜索词“换粮软便怎么办”近30天指数达到 18,400，月环比增长 45%</li>
                <li>• 当前商家主推SKU含有益生元与高消化率颗粒成分</li>
              </ul>
            </div>

            {/* 系统推断 */}
            <div className="space-y-1">
              <span className="text-[11px] font-extrabold px-2 py-0.5 bg-sky-950 text-sky-300 border border-sky-800 rounded">
                系统推断 (Inference)
              </span>
              <ul className="text-[12px] text-neutral-300 space-y-1 pt-1 pl-1">
                <li>• 养宠新手对传统“7天换粮规程”存在繁琐执行痛点，希望获得无缝不软便的干预解法</li>
                <li>• 以“换粮软便救星/不翻车换粮”为切入点，预计互动率提升 30% 以上</li>
              </ul>
            </div>

            {/* 尚缺信息 */}
            <div className="space-y-1">
              <span className="text-[11px] font-extrabold px-2 py-0.5 bg-amber-950 text-amber-300 border border-amber-800 rounded">
                尚缺信息 (Missing Info)
              </span>
              <p className="text-[12px] text-amber-200/80 pl-1">• 同行竞品“A品牌幼猫粮”在天猫的真实退款率数据</p>
            </div>

            {/* 建议验证动作 */}
            <div className="space-y-1">
              <span className="text-[11px] font-extrabold px-2 py-0.5 bg-purple-950 text-purple-300 border border-purple-800 rounded">
                建议验证动作 (Action)
              </span>
              <p className="text-[12px] text-purple-200/90 pl-1">• 安排第一波 10 篇 KOC 开展小规模测试发文，观察 14 天进店转化率</p>
            </div>
          </div>

          {/* Result Actions & Manual Decision Area (Requirement 7) */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-neutral-700/60">
            <div className="flex items-center gap-2">
              <button
                onClick={() => alert('允许修改假设：在左侧输入框补充新设定即可。')}
                className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[12px] font-bold rounded-lg border border-neutral-700"
              >
                修改假设
              </button>
              <button
                onClick={() => alert('补充资料：请上传新的商家Excel或图片。')}
                className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[12px] font-bold rounded-lg border border-neutral-700"
              >
                补充资料
              </button>
              <button
                onClick={handleRunAnalysis}
                className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[12px] font-bold rounded-lg border border-neutral-700"
              >
                重新运行
              </button>
            </div>

            <button
              onClick={() => setShowUsageModal(true)}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[13px] rounded-xl shadow-md flex items-center gap-1.5"
            >
              <CheckCircle2 size={16} /> 采用结果
            </button>
          </div>
        </div>
      </div>

      {/* Task Result Usage Selection Modal + Content Preview (Requirement 7 & 17) */}
      {showUsageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setShowUsageModal(false)} />
          <div className="relative w-full max-w-xl bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl p-6 z-10 space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-[16px] font-extrabold text-white">采用任务结果：选择用途与预览写入内容</h3>
              <button onClick={() => setShowUsageModal(false)} className="text-neutral-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            {/* Usage Selector */}
            <div className="space-y-2">
              <label className="text-[12px] font-extrabold text-neutral-300 block">请选择将此分析结果写入的位置：</label>
              <div className="space-y-2">
                {usageOptions.map(opt => (
                  <label
                    key={opt.id}
                    className={`flex items-start gap-3 p-3 rounded-xl border text-[12.5px] cursor-pointer transition-all ${
                      selectedUsage === opt.id
                        ? 'border-purple-500 bg-purple-950/30 text-white font-extrabold'
                        : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="usageOption"
                      checked={selectedUsage === opt.id}
                      onChange={() => setSelectedUsage(opt.id)}
                      className="mt-0.5 text-purple-600 focus:ring-purple-500"
                    />
                    <div>
                      <div className="text-neutral-200">{opt.label}</div>
                      <div className="text-[11px] text-neutral-500 font-normal mt-0.5">{opt.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Content Write Preview (Requirement 7: Must show preview before writing!) */}
            <div className="p-3.5 bg-neutral-950 rounded-xl border border-neutral-800 text-[12px] space-y-1.5">
              <span className="text-purple-300 font-extrabold block text-[11px]">即将写入的内容预览 (Preview):</span>
              <p className="text-neutral-300 font-medium">
                【策略假设】幼猫换粮软便抗应激切入点：以“7天无应激换粮法+益生元颗粒”为核心钩子，测试第一波 10 篇 KOC 发文，目标指标：互动率 &gt; 4.5%。
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-neutral-800">
              <button
                onClick={() => setShowUsageModal(false)}
                className="px-4 py-2 bg-neutral-800 text-neutral-300 text-[12px] font-bold rounded-xl"
              >
                取消
              </button>
              <button
                onClick={() => {
                  setIsResultAdopted(true);
                  setShowUsageModal(false);
                  alert(`已成功将结果采用为【${usageOptions.find(o => o.id === selectedUsage)?.label}】！`);
                }}
                className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white text-[12px] font-extrabold rounded-xl"
              >
                确认并写入
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

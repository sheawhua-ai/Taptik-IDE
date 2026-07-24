import React, { useState } from "react";
import {
  Sparkles, CheckCircle2, AlertTriangle, ArrowRight, X,
  Search, ExternalLink, HelpCircle, FileText, Send,
  Bookmark, ShieldAlert, Cpu, Eye, TrendingUp, Filter,
  Check, Layers, Award, BookOpen, RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface DecisionCard {
  id: string;
  category: "继续" | "调整" | "验证";
  conclusion: string;
  whyCare: string;
  evidenceSummary: string;
  alternativeExplanation: string;
  aiSuggestedAction: string;
  primaryButtonText: string;
  evidenceData: {
    sampleNotesCount: number;
    notesList: { title: string; publishTime: string; engagement: string; source: string }[];
    commentSamples: string[];
    materialSources: string[];
    confoundingFactors: string[];
  };
}

const INITIAL_DECISIONS: DecisionCard[] = [
  {
    id: "dec_01",
    category: "继续",
    conclusion: "保持当前【第一人称 KOS 店长粮种实拍 + 软便防范】内容方向",
    whyCare: "该方向连发 8 篇，平均收藏率比账号历史均值高出 68%，且引流私域意向比例极高。",
    evidenceSummary: "分析 12 篇笔记互动数据，挖掘出 42 条高意向咨询评论（询问软便换粮过渡比例）。",
    alternativeExplanation: "可能受 618 大促前夕养宠人群搜索量上升的大盘整体趋势影响。",
    aiSuggestedAction: "保持此模板打法，将生产权重提升至 60%，并保持周更频率。",
    primaryButtonText: "保持当前内容方向",
    evidenceData: {
      sampleNotesCount: 12,
      notesList: [
        { title: "幼犬换粮软便别慌！3天过渡法", publishTime: "2026-07-18", engagement: "赞 420 | 藏 180", source: "KOS店长号01" },
        { title: "店长实拍：小狗吃完不软便的秘诀", publishTime: "2026-07-15", engagement: "赞 310 | 藏 140", source: "KOS店长号02" }
      ],
      commentSamples: [
        "请问 3 个月金毛换这款粮需要几天过渡？",
        "我家之前吃其他的容易软便，这个真的管用吗？"
      ],
      materialSources: ["素材中心 Task_101 (室内瓷碗实拍)", "素材中心 Task_103 (颗粒特写)"],
      confoundingFactors: ["大促前夕泛宠物大盘检索量环比上升 12%"]
    }
  },
  {
    id: "dec_02",
    category: "调整",
    conclusion: "调整【纯白底产品展示】类封面，更换为【室内场景+狗狗进食实拍】",
    whyCare: "白底图封面 CTR 仅 3.2%，低于场景实拍封面的 8.7%，导致前 3 秒卡位流失严重。",
    evidenceSummary: "对比 15 组不同封面 AB 样本，真实场景实拍封面的长尾引流与互动效果显著更优。",
    alternativeExplanation: "白底图多用于投流信息流，在自然搜推流量池中缺乏抓人眼球的场景抓手。",
    aiSuggestedAction: "生成后续 10 篇封面的替换与补拍任务草案，降低纯白底图比例。",
    primaryButtonText: "生成调整草案",
    evidenceData: {
      sampleNotesCount: 15,
      notesList: [
        { title: "防软便粮开箱测评（白底封面）", publishTime: "2026-07-10", engagement: "赞 45 | 藏 12", source: "品牌官号" },
        { title: "金毛幼犬进食实拍（场景封面）", publishTime: "2026-07-12", engagement: "赞 520 | 藏 260", source: "KOS店长号" }
      ],
      commentSamples: [
        "这个碗好可爱，求链接！",
        "小狗吃的好香啊"
      ],
      materialSources: ["素材中心 Ast_01 (瓷碗实拍)", "素材中心 Ast_06 (白底封面)"],
      confoundingFactors: ["发布时间差 2 天，可能受周末流量波动影响"]
    }
  },
  {
    id: "dec_03",
    category: "验证",
    conclusion: "验证【幼犬离乳期痛点】在小红书母婴/宠粮交叉人群中的卡位潜力",
    whyCare: "评论区有 15% 提及'家里有宝宝同时养幼犬'，该细分痛点竞品尚未形成品牌垄断。",
    evidenceSummary: "分析评论区长尾词，发现在'双宠家庭/母婴宠'语境下消费者的互动与询问意愿强烈。",
    alternativeExplanation: "当前样本量仅 3 篇，尚无法完全排除偶然爆文因素。",
    aiSuggestedAction: "下发 3 篇对照测试笔记验证母婴宠人群点击转化率与爆文率。",
    primaryButtonText: "创建下轮验证",
    evidenceData: {
      sampleNotesCount: 3,
      notesList: [
        { title: "怀孕+养狗！宝宝和幼犬能吃同款低敏粮吗", publishTime: "2026-07-19", engagement: "赞 680 | 藏 310", source: "KOC达人号" }
      ],
      commentSamples: [
        "终于有讲双宠家庭的了！宝宝刚满月家里有金毛幼犬",
        "有没有不掉毛不拉稀的幼犬粮？"
      ],
      materialSources: ["素材中心 Task_102 (诊所人设)"],
      confoundingFactors: ["母婴交叉流量池竞品投放较少"]
    }
  }
];

export const ProjectReview: React.FC = () => {
  const [decisions, setDecisions] = useState<DecisionCard[]>(INITIAL_DECISIONS);
  const [activeScope, setActiveScope] = useState<string>("当前范围：过去30天｜自然流量｜全部账号｜包含历史项目");
  const [selectedEvidence, setSelectedEvidence] = useState<DecisionCard | null>(null);
  const [showDetailedDataModal, setShowDetailedDataModal] = useState<boolean>(false);
  const [showAdjustmentDraftModal, setShowAdjustmentDraftModal] = useState<boolean>(false);
  
  // Follow-up questions states
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);

  // Natural Language Discussion Input
  const [coWorkingInput, setCoWorkingInput] = useState<string>("");
  const [coWorkingLogs, setCoWorkingLogs] = useState<{ role: "user" | "ai"; text: string }[]>([]);

  // Knowledge Distillation
  const [distilledStatus, setDistilledStatus] = useState<"none" | "knowledge" | "skill">("none");

  // Handle follow-up question answer
  const handleAnswerQ1 = (ans: string) => {
    setQ1Answer(ans);
    if (ans === "否") {
      // Update decision card text with refined insight
      setDecisions(prev => prev.map(d => {
        if (d.id === "dec_01") {
          return {
            ...d,
            conclusion: "【完全纯自然流量验证】保持第一人称 KOS 店长粮种实拍 + 软便防范方向",
            whyCare: "排除了投流干扰因素，确认自然流量互动率高出均值 72%，证明内容卡位极精准！"
          };
        }
        return d;
      }));
    }
  };

  const handleAnswerQ2 = (ans: string) => {
    setQ2Answer(ans);
    if (ans === "是") {
      setDecisions(prev => prev.map(d => {
        if (d.id === "dec_02") {
          return {
            ...d,
            conclusion: "调整【纯白底产品展示】类封面 -> 统一换为【同批实拍干粮颗粒+狗狗进食】",
            whyCare: "证实同一次拍摄素材下，实拍图 CTR 为 8.7% 明显超越白底图 3.2%，消除光线拍摄环境干扰因素！"
          };
        }
        return d;
      }));
    }
  };

  // Submit co-working query
  const handleCoWorkingSubmit = () => {
    if (!coWorkingInput.trim()) return;
    const userText = coWorkingInput;
    setCoWorkingLogs(prev => [...prev, { role: "user", text: userText }]);
    setCoWorkingInput("");

    // Simulate AI scope and decision refinement
    setTimeout(() => {
      if (userText.includes("未投流")) {
        setActiveScope("当前范围：过去30天｜纯自然流量｜全部账号｜排除付费信息流");
        setCoWorkingLogs(prev => [...prev, {
          role: "ai",
          text: "已为您过滤掉包含付费信息流的 4 篇笔记。调整后自然流量下【实拍进食封面】的收藏转化优异程度依然显著，建议执行调整草案。"
        }]);
      } else if (userText.includes("A03")) {
        setActiveScope("当前范围：过去30天｜排除 A03 账号｜自然流量｜包含历史项目");
        setCoWorkingLogs(prev => [...prev, {
          role: "ai",
          text: "已剔除 A03 异常账号数据。分析发现其余 5 个 KOS 账号在该打法下的表现极其稳定。"
        }]);
      } else {
        setCoWorkingLogs(prev => [...prev, {
          role: "ai",
          text: `已为您更新分析上下文：“${userText}”。根据归因相关性分析，实拍真实场景素材与更高收藏表现呈现强正相关。`
        }]);
      }
    }, 400);
  };

  return (
    <div className="h-full flex flex-col bg-[#fafafa] text-neutral-900 overflow-hidden font-sans">
      
      {/* ========================================================= */}
      {/* HEADER: AI REVIEW TITLE & ACTIVE SCOPE                    */}
      {/* ========================================================= */}
      <div className="px-8 pt-5 pb-3 border-b border-neutral-200/80 bg-white shrink-0 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-[20px] font-bold text-neutral-900 tracking-tight">
              AI复盘
            </h1>
            <span className="text-[12px] text-neutral-500 font-normal">
              AI 持续分析运行项目、历史样本与互动归因，主持运营决策会。
            </span>
          </div>

          {/* Active Scope Small Indicator */}
          <div className="mt-2 text-[11px] font-mono font-medium text-neutral-500 bg-neutral-100 px-3 py-1 rounded-lg border border-neutral-200/60 inline-flex items-center gap-2">
            <Filter size={12} className="text-primary-600" />
            <span>{activeScope}</span>
          </div>
        </div>

        {/* Global Action Button */}
        <button
          onClick={() => setShowAdjustmentDraftModal(true)}
          className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-[13px] font-bold transition-all shadow-sm flex items-center gap-2"
        >
          <Sparkles size={15} />
          生成项目调整草案
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-8 py-5 space-y-6">
        
        {/* ========================================================= */}
        {/* AI OPENING STATEMENT BANNER                               */}
        {/* ========================================================= */}
        <div className="p-4 bg-white border border-neutral-200/90 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-neutral-900 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Cpu size={18} />
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-neutral-900 leading-snug">
                我已经分析了当前项目和历史记录，本轮只有 <strong className="text-primary-600 text-[17px]">3</strong> 件事值得你判断：
              </h2>
              <p className="text-[12px] text-neutral-500 mt-0.5">
                无需扫描繁杂报表，直接聚焦下轮关键决策。
              </p>
            </div>
          </div>

          <div className="text-[11px] text-neutral-400 font-medium shrink-0">
            自动排除无显著统计差异的 24 组例行数据
          </div>
        </div>

        {/* ========================================================= */}
        {/* MAX 3 DECISION CARDS (继续, 调整, 验证)                   */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {decisions.map(card => {
            let catBadge = "bg-emerald-50 text-emerald-800 border-emerald-200";
            if (card.category === "调整") catBadge = "bg-amber-50 text-amber-800 border-amber-200";
            else if (card.category === "验证") catBadge = "bg-blue-50 text-blue-800 border-blue-200";

            return (
              <div
                key={card.id}
                className="bg-white border border-neutral-200/90 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-neutral-300 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Category Header Badge */}
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 text-[11px] font-bold rounded-md border ${catBadge}`}>
                      【{card.category}】决策
                    </span>
                    <span className="text-[11px] text-neutral-400 font-mono">
                      {card.id}
                    </span>
                  </div>

                  {/* 结论 (Conclusion) */}
                  <h3 className="text-[15px] font-bold text-neutral-900 leading-snug">
                    {card.conclusion}
                  </h3>

                  {/* 为什么值得关注 */}
                  <div className="p-3 bg-neutral-50/80 rounded-xl border border-neutral-100 text-[12px] text-neutral-700 leading-relaxed">
                    <strong className="text-neutral-900 block mb-0.5">为什么值得关注：</strong>
                    {card.whyCare}
                  </div>

                  {/* 关键依据摘要 */}
                  <div className="text-[12px] text-neutral-600 leading-relaxed space-y-1">
                    <strong className="text-neutral-900 block">关键依据摘要：</strong>
                    <p>{card.evidenceSummary}</p>
                  </div>

                  {/* 可能存在的其他解释 */}
                  <div className="text-[11px] text-neutral-500 bg-neutral-50 p-2.5 rounded-lg border border-neutral-100 leading-relaxed">
                    <strong className="text-neutral-700 block mb-0.5">可能存在的其他解释：</strong>
                    {card.alternativeExplanation}
                  </div>

                  {/* AI 建议动作 */}
                  <div className="text-[12px] text-primary-900 font-bold bg-primary-50/60 p-2.5 rounded-xl border border-primary-100/80">
                    💡 AI建议：{card.aiSuggestedAction}
                  </div>
                </div>

                {/* Bottom One Primary Button & Auxiliary Links */}
                <div className="pt-3 border-t border-neutral-100 space-y-2">
                  <button
                    onClick={() => alert(`执行【${card.primaryButtonText}】动作！`)}
                    className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-[12px] font-bold transition-all shadow-sm text-center"
                  >
                    {card.primaryButtonText}
                  </button>

                  <div className="flex items-center justify-between text-[11px] px-1 pt-1">
                    <button
                      onClick={() => setSelectedEvidence(card)}
                      className="text-neutral-500 hover:text-neutral-900 font-bold flex items-center gap-1 transition-colors"
                    >
                      <Eye size={12} /> 查看依据
                    </button>

                    <button
                      onClick={() => {
                        setCoWorkingInput(`为什么关于【${card.conclusion}】结论是这样的？`);
                      }}
                      className="text-primary-600 hover:underline font-bold flex items-center gap-1"
                    >
                      <Sparkles size={12} /> 和AI讨论
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ========================================================= */}
        {/* AI PROACTIVE FOLLOW-UP QUESTIONS (AI主动追问)             */}
        {/* ========================================================= */}
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-[13px] font-bold text-neutral-900">
            <HelpCircle size={16} className="text-amber-600" />
            <span>AI 发现 2 处潜在干扰因素，回答后将直接精细化调整决策卡结论：</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[12px]">
            {/* Question 1 */}
            <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/80 space-y-2">
              <div className="font-bold text-neutral-800">
                1. 本轮 6 篇高收藏笔记是否进行了信息流投流（薯条/聚光）？
              </div>
              <div className="flex items-center gap-2">
                {["是", "否", "部分投流"].map(opt => (
                  <button
                    key={opt}
                    onClick={() => handleAnswerQ1(opt)}
                    className={`px-3 py-1 rounded-lg font-bold text-[11px] border transition-all ${
                      q1Answer === opt
                        ? "bg-neutral-900 text-white border-neutral-900 shadow-sm"
                        : "bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-100"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {q1Answer && (
                <div className="text-[11px] text-emerald-700 font-medium">
                  ✓ 已选择“{q1Answer}”，相关决策卡【继续】已更新排除投流干扰。
                </div>
              )}
            </div>

            {/* Question 2 */}
            <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/80 space-y-2">
              <div className="font-bold text-neutral-800">
                2. 第 3 批素材（实拍干粮颗粒）是否来自同一次拍摄？
              </div>
              <div className="flex items-center gap-2">
                {["是", "否"].map(opt => (
                  <button
                    key={opt}
                    onClick={() => handleAnswerQ2(opt)}
                    className={`px-3 py-1 rounded-lg font-bold text-[11px] border transition-all ${
                      q2Answer === opt
                        ? "bg-neutral-900 text-white border-neutral-900 shadow-sm"
                        : "bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-100"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {q2Answer && (
                <div className="text-[11px] text-emerald-700 font-medium">
                  ✓ 已选择“{q2Answer}”，相关决策卡【调整】已更新对照归因。
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* EXPERIENCE DISTILLATION BANNER (经验沉淀)                 */}
        {/* ========================================================= */}
        <div className="bg-primary-50/60 border border-primary-100 rounded-2xl p-4 flex items-center justify-between text-[12px]">
          <div className="flex items-center gap-2 text-primary-950 font-bold">
            <Award size={16} className="text-primary-600" />
            <span>💡 该结论已在 12 个样本中重复验证，是否保存为【商家知识】或蒸馏为【Skill】？</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setDistilledStatus("knowledge");
                alert("已保存为商家知识！可在【商家知识库】中查看与引用。");
              }}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all text-[11px] ${
                distilledStatus === "knowledge"
                  ? "bg-emerald-700 text-white"
                  : "bg-white text-neutral-800 border border-neutral-200 hover:bg-neutral-50"
              }`}
            >
              {distilledStatus === "knowledge" ? "✓ 已存商家知识" : "保存为商家知识"}
            </button>

            <button
              onClick={() => {
                setDistilledStatus("skill");
                alert("已蒸馏为 SOP Skill！后续项目创建时将自动注入此 SOP。");
              }}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all text-[11px] ${
                distilledStatus === "skill"
                  ? "bg-emerald-700 text-white"
                  : "bg-neutral-900 text-white hover:bg-neutral-800"
              }`}
            >
              {distilledStatus === "skill" ? "✓ 已蒸馏为 Skill" : "蒸馏为 Skill"}
            </button>
          </div>
        </div>

        {/* Chat log preview if user talked */}
        {coWorkingLogs.length > 0 && (
          <div className="bg-white border border-neutral-200 rounded-2xl p-4 space-y-2 text-[12px]">
            <div className="font-bold text-neutral-400 text-[10px] uppercase tracking-wider mb-1">
              自然语言协同讨论记录
            </div>
            {coWorkingLogs.map((log, i) => (
              <div key={i} className={`p-2.5 rounded-xl ${log.role === "user" ? "bg-neutral-100 text-neutral-800 ml-8 font-medium" : "bg-primary-50 text-primary-950 font-bold"}`}>
                <strong>{log.role === "user" ? "操盘手" : "AI复盘"}: </strong>{log.text}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* FIXED BOTTOM NATURAL LANGUAGE CO-WORKING INPUT BAR       */}
      {/* ========================================================= */}
      <div className="p-4 border-t border-neutral-200 bg-white shrink-0 space-y-2">
        {/* Quick Filter Tag Chips */}
        <div className="flex items-center gap-2 text-[11px] overflow-x-auto pb-1">
          <span className="text-neutral-400 font-bold shrink-0">快捷协同指令:</span>
          {[
            "只看未投流笔记", "排除A03账号", "只比较发布后7天", "不参考外部样本"
          ].map(chip => (
            <button
              key={chip}
              onClick={() => {
                setCoWorkingInput(chip);
              }}
              className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200/80 text-neutral-700 rounded-lg transition-colors font-medium shrink-0 border border-neutral-200/50"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input Field */}
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={coWorkingInput}
              onChange={e => setCoWorkingInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleCoWorkingSubmit()}
              placeholder="和 AI 讨论复盘逻辑，例如：为什么你认为是真实场景素材带来的？"
              className="w-full pl-4 pr-10 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-[13px] focus:outline-none focus:border-neutral-900 transition-colors"
            />
            <button
              onClick={handleCoWorkingSubmit}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg transition-colors"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* DRAWER: EVIDENCE DETAIL (查看依据)                        */}
      {/* ========================================================= */}
      <AnimatePresence>
        {selectedEvidence && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-end">
            <motion.div
              initial={{ x: 420 }}
              animate={{ x: 0 }}
              exit={{ x: 420 }}
              className="w-[420px] bg-white h-full p-6 flex flex-col justify-between shadow-2xl border-l border-neutral-200 overflow-y-auto"
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <h3 className="text-[15px] font-bold text-neutral-900 flex items-center gap-2">
                    <Eye size={16} className="text-primary-600" />
                    复盘依据抽屉：{selectedEvidence.category}决策
                  </h3>
                  <button
                    onClick={() => setSelectedEvidence(null)}
                    className="p-1 text-neutral-400 hover:text-neutral-700"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Sample Notes List */}
                <div className="space-y-2 text-[12px]">
                  <div className="font-bold text-neutral-900">
                    引入数据样本 ({selectedEvidence.evidenceData.sampleNotesCount} 篇笔记)：
                  </div>
                  <div className="space-y-1.5">
                    {selectedEvidence.evidenceData.notesList.map((nt, i) => (
                      <div key={i} className="p-3 bg-neutral-50 border border-neutral-200/80 rounded-xl space-y-1">
                        <div className="font-bold text-neutral-900">{nt.title}</div>
                        <div className="flex items-center justify-between text-[10px] text-neutral-500">
                          <span>{nt.source} ({nt.publishTime})</span>
                          <span className="font-bold text-primary-700">{nt.engagement}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Comment Text Samples */}
                <div className="space-y-2 text-[12px]">
                  <div className="font-bold text-neutral-900">用户真实评论采样：</div>
                  <div className="space-y-1">
                    {selectedEvidence.evidenceData.commentSamples.map((cm, i) => (
                      <div key={i} className="p-2.5 bg-neutral-50 rounded-xl text-neutral-700 border border-neutral-100 italic">
                        “{cm}”
                      </div>
                    ))}
                  </div>
                </div>

                {/* Material Sources */}
                <div className="space-y-2 text-[12px]">
                  <div className="font-bold text-neutral-900">关联素材资产来源：</div>
                  <div className="space-y-1">
                    {selectedEvidence.evidenceData.materialSources.map((ms, i) => (
                      <div key={i} className="p-2 bg-neutral-100 rounded-lg text-neutral-800 font-medium text-[11px]">
                        • {ms}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Confounding Factors */}
                <div className="space-y-2 text-[12px]">
                  <div className="font-bold text-neutral-900 text-amber-800">潜在混淆因素说明：</div>
                  <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px]">
                    {selectedEvidence.evidenceData.confoundingFactors.join("；")}
                  </div>
                </div>
              </div>

              {/* Bottom Deep Data Button */}
              <div className="pt-4 border-t border-neutral-100 mt-4">
                <button
                  onClick={() => setShowDetailedDataModal(true)}
                  className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-[12px] rounded-xl transition-colors shadow-sm"
                >
                  查看详细数据
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* MODAL: DETAILED DATA DRILL-DOWN                           */}
      {/* ========================================================= */}
      <AnimatePresence>
        {showDetailedDataModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-neutral-200 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <h3 className="text-[15px] font-bold text-neutral-900">详细互动与样本数据下钻</h3>
                <button onClick={() => setShowDetailedDataModal(false)}><X size={18} className="text-neutral-400" /></button>
              </div>

              <div className="space-y-3 text-[12px]">
                <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 grid grid-cols-3 gap-3 text-center">
                  <div>
                    <span className="text-neutral-400 block mb-1">总曝光样本</span>
                    <strong className="text-[16px] text-neutral-900">12.8w</strong>
                  </div>
                  <div>
                    <span className="text-neutral-400 block mb-1">互动总量</span>
                    <strong className="text-[16px] text-neutral-900">3,492 次</strong>
                  </div>
                  <div>
                    <span className="text-neutral-400 block mb-1">平均收藏率</span>
                    <strong className="text-[16px] text-emerald-600">8.4%</strong>
                  </div>
                </div>

                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 text-neutral-600">
                  数据来源说明：全部互动数据来自官方授权小红书数据 API 及实际线索转化表，严谨遵循平台隐私规范。
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setShowDetailedDataModal(false)}
                  className="px-5 py-2 bg-neutral-900 text-white text-[12px] font-bold rounded-xl"
                >
                  关闭
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* MODAL: PROJECT ADJUSTMENT DRAFT (项目调整草案)            */}
      {/* ========================================================= */}
      <AnimatePresence>
        {showAdjustmentDraftModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-neutral-200 space-y-4 max-h-[85vh] flex flex-col overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3 shrink-0">
                <h3 className="text-[16px] font-bold text-neutral-900 flex items-center gap-2">
                  <Sparkles size={16} className="text-primary-600" />
                  AI 生成的项目调整草案 (v2.0)
                </h3>
                <button onClick={() => setShowAdjustmentDraftModal(false)}><X size={18} className="text-neutral-400" /></button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 text-[12px] pr-1">
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                  <strong className="text-neutral-900 block mb-1">1. 建议保留的内容方向：</strong>
                  <p className="text-neutral-700">【第一人称 KOS 店长粮种实拍 + 软便防范】，生产权重提升至 60%。</p>
                </div>

                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                  <strong className="text-neutral-900 block mb-1">2. 建议调整/叫停的做法：</strong>
                  <p className="text-neutral-700">叫停【纯白底图展示封面】，后续 10 篇统一替换为实拍狗狗进食封面。</p>
                </div>

                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                  <strong className="text-neutral-900 block mb-1">3. 本轮下发验证假设：</strong>
                  <p className="text-neutral-700">验证【幼犬离乳期痛点】在母婴宠双重身份人群中的转化率（下发 3 篇对照）。</p>
                </div>

                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                  <strong className="text-neutral-900 block mb-1">4. 资源与素材需求缺口：</strong>
                  <p className="text-neutral-700">自动从【素材中心】申请下发 6 组捏碎颗粒特写与实拍进食素材任务。</p>
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between shrink-0">
                <button
                  onClick={() => setShowAdjustmentDraftModal(false)}
                  className="px-4 py-2 border border-neutral-200 text-neutral-600 rounded-xl text-[12px] font-bold"
                >
                  暂存为草稿
                </button>

                <button
                  onClick={() => {
                    alert("项目调整草案已通过！已更新项目计划并同步至【项目中心】。");
                    setShowAdjustmentDraftModal(false);
                  }}
                  className="px-6 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-[12px] font-bold transition-colors shadow-sm"
                >
                  确认发布新版本项目计划
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

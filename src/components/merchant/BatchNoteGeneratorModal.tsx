import React, { useState } from 'react';
import { 
  X, Sparkles, Check, ChevronRight, Edit2, Calendar, Users, 
  FileText, CheckCircle2, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProjectStore } from '../../context/ProjectContext';
import { Project } from '../../data/projectStore';

interface Props {
  project: Project;
  onClose: () => void;
}

export function BatchNoteGeneratorModal({ project, onClose }: Props) {
  const { batchGenerateProjectNotes } = useProjectStore();

  const planCount = (project as any).kocCount || 10;
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedNotes, setGeneratedNotes] = useState<Array<{
    title: string;
    accountType: "KOC" | "店长号/KOS" | "品牌主号";
    accountName: string;
    contentDirection: string;
    plannedDate: string;
    selected: boolean;
  }>>([]);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const isWedding = project.name.includes("婚宴") || project.name.includes("酒店");
      const isPet = project.name.includes("幼犬") || project.name.includes("宠");

      const baseDate = new Date();
      const newGenerated = Array.from({ length: planCount }).map((_, i) => {
        const isKos = i === 0;
        const isBrand = i === 1;
        const type: "KOC" | "店长号/KOS" | "品牌主号" = isKos ? "店长号/KOS" : isBrand ? "品牌主号" : "KOC";

        let title = "";
        let direction = "";

        if (isWedding) {
          const weddingTitles = [
            "【现场实拍】青岛超梦幻宴会厅试菜记录！菜品量大好看",
            "店长视角：备婚新人最关心的5个宴会厅细节与档期",
            "官方权威 | 2026青岛酒店婚宴最新档期与赠品政策",
            "备婚避坑！真实新人分享婚宴场地与试菜全过程",
            "婚礼策划师眼中的宝藏宴会厅，布场效果太惊艳了！",
            "青岛婚宴哪家强？试过这几个硬菜才知道真实口碑",
            "婚宴菜单名牌搭配指南，高性价比喜宴推荐",
            "准新人看过来！教你如何优雅地与宴会厅谈赠送项目",
            "梦幻试菜第一弹：主厨招牌菜细节测评",
            "宴会厅灯光与舞台效果实测，绝美现场出片"
          ];
          const weddingDirections = ["真实试菜测评", "店长专业答疑", "品牌档期发布", "备婚体验分享", "策划师案例", "菜品实拍", "菜单攻略", "避坑指南", "主厨推荐", "灯光实测"];
          title = weddingTitles[i % weddingTitles.length];
          direction = weddingDirections[i % weddingDirections.length];
        } else if (isPet) {
          const petTitles = [
            "幼犬换粮总是拉肚子？店长教你七日换粮法",
            "【官方科普】幼犬肠胃敏感期如何顺利换粮？",
            "我家金毛幼犬换粮体验，记录七天真实变化",
            "换粮避坑指南！终于不软便了",
            "新手养狗必看！换粮期怎么选高吸收配方",
            "幼犬第一口粮测评：适口性与便便健康观察",
            "不同犬种换粮注意事项，店长1v1专业指导",
            "铲屎官亲测：打卡14天养胃好粮效果"
          ];
          const petDirections = ["科学换粮科普", "品牌权威指南", "真实测评分享", "体验避坑指南", "干货选粮", "适口性打卡", "专业回复", "日常打卡"];
          title = petTitles[i % petTitles.length];
          direction = petDirections[i % petDirections.length];
        } else {
          title = `${project.name} - 体验官种草笔记 #${i + 1}`;
          direction = "产品真实测评与试用体验";
        }

        const plannedDate = new Date(baseDate.getTime() + (i * 2 + 1) * 24 * 3600 * 1000).toISOString().split('T')[0];

        return {
          title,
          accountType: type,
          accountName: type === "店长号/KOS" ? "店长号_旗舰店" : type === "品牌主号" ? "品牌官方账号" : `KOC体验官_${i + 1}`,
          contentDirection: direction,
          plannedDate,
          selected: true
        };
      });

      setGeneratedNotes(newGenerated);
      setIsGenerating(false);
    }, 1000);
  };

  const handleConfirm = () => {
    const selectedList = generatedNotes.filter(n => n.selected);
    if (selectedList.length === 0) return;

    batchGenerateProjectNotes(project.id, selectedList);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-btn-main/50 backdrop-blur-xs p-4 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="bg-surface-1 rounded-xl shadow-2xl border border-border-default w-full max-w-3xl overflow-hidden my-auto flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-border-default flex items-center justify-between shrink-0 bg-surface-1">
          <div>
            <h2 className="text-[17px] font-bold text-text-main flex items-center gap-2">
              <Sparkles size={20} className="text-amber-500" />
              批量根据项目方案生成笔记
            </h2>
            <p className="text-[12px] text-text-tertiary mt-0.5">
              基于项目目标“{project.goal.slice(0, 30)}...”和策略协议自动规划笔记排期。
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-text-tertiary hover:text-text-main hover:bg-hover-bg rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5 bg-surface-2">
          
          {/* Strategy Summary Banner */}
          <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-4 text-[12px] text-amber-900 space-y-1.5">
            <div className="font-bold text-[13px] text-amber-950 flex items-center gap-1.5">
              <Sparkles size={14} className="text-amber-600" />
              项目策略输入 (Strategy Protocol)
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1 text-amber-900/90">
              <div>• 核心问题：{project.strategyProtocol?.coreProblem || "解决用户缺乏信任与场景直观落地"}</div>
              <div>• 目标人群：{project.strategyProtocol?.targetAudience || "精准潜力意向客群"}</div>
              <div className="col-span-2">• 打法方案：{project.strategyProtocol?.solutionSummary || "KOC真实试用测评 + 店长专业答疑"}</div>
            </div>
          </div>

          {/* Config Controls */}
          {generatedNotes.length === 0 ? (
            <div className="bg-surface-1 rounded-xl border border-border-default/90 shadow-2xs p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-border-default pb-3">
                <h3 className="text-[14px] font-bold text-text-main">本轮项目方案配置</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                  来自本轮运营方案设定
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3.5 bg-page-bg rounded-xl border border-border-default space-y-1">
                  <span className="text-[11px] font-bold text-text-tertiary">
                    方案规划生成数量
                  </span>
                  <div className="text-[18px] font-extrabold text-text-main flex items-baseline gap-1">
                    <span>{planCount}</span>
                    <span className="text-[12px] font-bold text-text-tertiary">篇笔记</span>
                  </div>
                </div>

                <div className="p-3.5 bg-page-bg rounded-xl border border-border-default space-y-1">
                  <span className="text-[11px] font-bold text-text-tertiary">
                    角色矩阵分布
                  </span>
                  <div className="text-[12px] font-bold text-text-main pt-1">
                    1篇店长号/KOS + 1篇品牌主号 + {Math.max(0, planCount - 2)}篇KOC体验官
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full py-3 bg-btn-main hover:bg-btn-main-hover text-white rounded-xl text-[13px] font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles size={16} className="animate-spin text-amber-400" />
                      <span>正在分析项目方案并生成笔记排期...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} className="text-amber-400" />
                      <span>确认方案，一键生成 {planCount} 篇笔记排期</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* Generated Preview Table */
            <div className="bg-surface-1 rounded-xl border border-border-default/90 shadow-2xs overflow-hidden">
              <div className="p-4 border-b border-border-default flex items-center justify-between bg-page-bg">
                <span className="text-[13px] font-bold text-text-main">
                  AI 智能拆解生成结果 (已选中 {generatedNotes.filter(n => n.selected).length} 篇)
                </span>
                <button 
                  onClick={handleGenerate}
                  className="text-[12px] font-bold text-text-secondary hover:text-text-main flex items-center gap-1"
                >
                  <Sparkles size={13} />
                  <span>重新生成</span>
                </button>
              </div>

              <div className="divide-y divide-neutral-100 max-h-[360px] overflow-y-auto">
                {generatedNotes.map((note, idx) => (
                  <div 
                    key={idx}
                    className={`p-3.5 flex items-center justify-between gap-3 transition-colors ${
                      note.selected ? "bg-surface-1" : "bg-page-bg opacity-60"
                    }`}
                  >
                    <input 
                      type="checkbox"
                      checked={note.selected}
                      onChange={(e) => {
                        const updated = [...generatedNotes];
                        updated[idx].selected = e.target.checked;
                        setGeneratedNotes(updated);
                      }}
                      className="w-4 h-4 rounded text-text-main focus:ring-neutral-900 shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-bold text-text-main truncate">
                        {note.title}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-text-tertiary">
                        <span className={`px-2 py-0.5 rounded font-bold ${
                          note.accountType === "店长号/KOS" 
                            ? "bg-purple-50 text-purple-700 border border-purple-200"
                            : note.accountType === "品牌主号"
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        }`}>
                          {note.accountType}
                        </span>
                        <span>方向：{note.contentDirection}</span>
                        <span>账号：{note.accountName}</span>
                      </div>
                    </div>

                    <div className="text-[11px] font-bold text-text-secondary bg-hover-bg px-2.5 py-1 rounded-lg shrink-0">
                      {note.plannedDate}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border-default flex items-center justify-between bg-surface-1 shrink-0">
          <span className="text-[12px] text-text-tertiary">
            {generatedNotes.length > 0 ? "确认后将直接向项目添加所选笔记，并创建对应发布任务。" : "准备就绪后点击生成按钮。"}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-border-default rounded-xl text-[13px] font-bold text-text-secondary hover:bg-hover-bg transition-colors"
            >
              取消
            </button>
            {generatedNotes.length > 0 && (
              <button
                onClick={handleConfirm}
                className="px-6 py-2 bg-btn-main text-white rounded-xl text-[13px] font-bold hover:bg-btn-main-hover transition-colors shadow-xs"
              >
                确认导入 {generatedNotes.filter(n => n.selected).length} 篇笔记
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

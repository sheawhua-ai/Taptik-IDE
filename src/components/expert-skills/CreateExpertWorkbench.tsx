import React, { useState } from 'react';
import { ExpertItem, ProcessCategory, AppScope, SkillItem } from './types';
import {
  X, Sparkles, CheckCircle2, Bot, Wrench, Shield, ArrowRight,
  Plus, Trash2, Edit3, Terminal, AlertTriangle, RefreshCw, Layers
} from 'lucide-react';

interface CreateExpertWorkbenchProps {
  onClose: () => void;
  onExpertCreated: (newExpert: ExpertItem) => void;
}

export const CreateExpertWorkbench: React.FC<CreateExpertWorkbenchProps> = ({
  onClose,
  onExpertCreated
}) => {
  const [currentStage, setCurrentStage] = useState<1 | 2 | 3>(1);

  // Stage 1 Inputs
  const [naturalDescription, setNaturalDescription] = useState<string>(
    '我需要一个专注天猫小红书两端的“宠物食品合规与首图审查专家”，能检查图片文字违规（如绝对化用语、功效夸大）、匹配规则库，并在违规时生成修改建议。'
  );
  const [selectedDocs, setSelectedDocs] = useState<string[]>(['《天猫宠物行业违规词库2024.pdf》', '《皇家品牌红线指南.md》']);
  const [isGeneratingCharter, setIsGeneratingCharter] = useState<boolean>(false);

  // Stage 2 Charter States (AI Generated, User Editable)
  const [expertName, setExpertName] = useState<string>('宠物合规首图审核专家');
  const [expertMission, setExpertMission] = useState<string>('负责首图与详情页合规风险核查，防止因违规词或虚假宣传导致商品下架与罚款。');
  const [scenarioStage, setScenarioStage] = useState<ProcessCategory>('audit');
  const [whatItCanDo, setWhatItCanDo] = useState<string[]>([
    '批量识别图文中的“第一”、“全网最全”等绝对化用语',
    '核对品牌授权与特种功效宣称资质',
    '生成修正文案替换方案'
  ]);
  const [whatItWontDoAuto, setWhatItWontDoAuto] = useState<string[]>([
    '不会自动直接修改已发布的宝贝详情页',
    '不会自动向平台提交申诉表格'
  ]);
  const [manualConfirmPoints, setManualConfirmPoints] = useState<string[]>([
    '涉及高额罚款风险的疑难词汇判定',
    '确认替换文案后写入项目待办'
  ]);

  // Stage 3 Drill States
  const [drillInput, setDrillInput] = useState<string>('测试样例：包含“全网最火爆幼猫粮，7天彻底根治软便”字样的首图素材。');
  const [isDrilling, setIsDrilling] = useState<boolean>(false);
  const [drillPassed, setDrillPassed] = useState<boolean>(false);

  // Handle Stage 1 -> Stage 2
  const handleGenerateCharter = () => {
    setIsGeneratingCharter(true);
    setTimeout(() => {
      setIsGeneratingCharter(false);
      setCurrentStage(2);
    }, 800);
  };

  // Handle Stage 2 -> Stage 3
  const handleStartDrillStage = () => {
    setCurrentStage(3);
  };

  // Run Stage 3 Drill
  const handleRunDrill = () => {
    setIsDrilling(true);
    setTimeout(() => {
      setIsDrilling(false);
      setDrillPassed(true);
    }, 1000);
  };

  // Finish Stage 3 and save
  const handleCompleteAndEnable = () => {
    const newExpert: ExpertItem = {
      id: `exp_created_${Date.now()}`,
      name: expertName,
      mission: expertMission,
      description: expertMission,
      businessTask: '图片违规核查与合规建议生成',
      scenarioStage: scenarioStage,
      status: 'enabled',
      version: '1.0.0',
      updatedAt: '刚才',
      lastUsedTime: '无记录',
      lastRunResult: '演练通过，待首次运行',
      hasPendingConfirms: false,
      appScope: 'merchant',
      boundSkills: [
        {
          id: 'sk_bound_1',
          name: '首图敏感词核查',
          version: '1.0.0',
          updatedAt: '刚才',
          status: 'enabled',
          source: 'official',
          oneSentenceDesc: '精准核对违规词库与图文OCR结果',
          goal: '识别敏感词',
          processCategory: 'audit',
          inputFormat: ['图片URL', '商品标题'],
          outputFormat: ['违规风险列表'],
          applicableScenes: ['首图审核'],
          inapplicableScenes: ['语音提取'],
          preConditions: ['载入词库'],
          executionSteps: ['OCR分析', '核对词库'],
          risksAndLimits: ['依赖词库准确度'],
          failureHandling: '报错提示',
          manualConfirmPoints: ['疑难判定'],
          lastTestStatus: 'passed',
          lastVerifiedResult: '测试通过',
          usedByExpertsCount: 1,
          usedByProjectsCount: 1,
          usedByExperts: [{ id: 'exp_created', name: expertName }],
          usedByProjects: ['皇家宠物食品项目'],
          appScope: 'merchant',
          requiredPermissions: { readScope: ['图片'], writeScope: ['待办'], needsNetwork: false, willModifyData: false }
        }
      ],
      whatItCanDo: whatItCanDo,
      whatItWontDoAuto: whatItWontDoAuto,
      applicableScenes: ['首图审核', '详情页合规', '新品上架前核查'],
      inputDocs: ['商品图片', '资质证明'],
      outputResults: ['合规诊断报告', '修改建议列表'],
      manualConfirmPoints: manualConfirmPoints,
      failureAndMissingInfoHandling: '缺少资质文件时自动暂停并提示操盘手补充',
      runLogs: [],
      composition: {
        defaultSkills: [],
        optionalSkills: [],
        replacedSkills: [],
        manualConfirmPoints: manualConfirmPoints
      }
    };

    onExpertCreated(newExpert);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-neutral-900/50 backdrop-blur-xs" onClick={onClose} />

      {/* Main Modal */}
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-neutral-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-600/30 text-purple-300 rounded-xl border border-purple-500/30">
              <Bot size={20} />
            </div>
            <div>
              <h2 className="text-[17px] font-extrabold">新建专家工作台 (3 阶段流程)</h2>
              <p className="text-[11.5px] text-neutral-400">描述需求 → 生成专家契约 → 本地演练并启用</p>
            </div>
          </div>

          <button onClick={onClose} className="text-neutral-400 hover:text-white p-1">
            <X size={20} />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="bg-neutral-100 border-b border-neutral-200 p-3 px-6 flex items-center justify-between text-[12.5px] font-extrabold">
          <div className={`flex items-center gap-2 ${currentStage >= 1 ? 'text-purple-700' : 'text-neutral-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${currentStage >= 1 ? 'bg-purple-700 text-white' : 'bg-neutral-200 text-neutral-600'}`}>1</span>
            <span>描述专家需求</span>
          </div>
          <ArrowRight size={14} className="text-neutral-300" />
          <div className={`flex items-center gap-2 ${currentStage >= 2 ? 'text-purple-700' : 'text-neutral-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${currentStage >= 2 ? 'bg-purple-700 text-white' : 'bg-neutral-200 text-neutral-600'}`}>2</span>
            <span>确认专家契约</span>
          </div>
          <ArrowRight size={14} className="text-neutral-300" />
          <div className={`flex items-center gap-2 ${currentStage >= 3 ? 'text-purple-700' : 'text-neutral-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${currentStage >= 3 ? 'bg-purple-700 text-white' : 'bg-neutral-200 text-neutral-600'}`}>3</span>
            <span>本地演练与启用</span>
          </div>
        </div>

        {/* Stage Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5 text-[13px]">
          {/* STAGE 1 */}
          {currentStage === 1 && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="font-extrabold text-neutral-900 block">自然语言描述想要的专家能力：</label>
                <textarea
                  rows={4}
                  value={naturalDescription}
                  onChange={e => setNaturalDescription(e.target.value)}
                  className="w-full p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-[13px] text-neutral-900 focus:outline-none focus:border-purple-600 font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="font-extrabold text-neutral-900 block">导入参考资料 / 知识库 (可选)：</label>
                <div className="space-y-1.5">
                  {selectedDocs.map((doc, i) => (
                    <div key={i} className="p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl flex items-center justify-between text-[12px] font-bold text-neutral-700">
                      <span>📄 {doc}</span>
                      <button onClick={() => setSelectedDocs(selectedDocs.filter((_, idx) => idx !== i))} className="text-neutral-400 hover:text-rose-600">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STAGE 2 */}
          {currentStage === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-extrabold text-neutral-800 block mb-1">专家名称：</label>
                  <input
                    type="text"
                    value={expertName}
                    onChange={e => setExpertName(e.target.value)}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="font-extrabold text-neutral-800 block mb-1">所属流程阶段：</label>
                  <select
                    value={scenarioStage}
                    onChange={e => setScenarioStage(e.target.value as ProcessCategory)}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl font-bold"
                  >
                    <option value="audit">审核与合规</option>
                    <option value="content">选题与内容</option>
                    <option value="strategy">策略与项目策划</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-extrabold text-neutral-800 block mb-1">专家使命：</label>
                <textarea
                  rows={2}
                  value={expertMission}
                  onChange={e => setExpertMission(e.target.value)}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1.5">
                  <span className="font-extrabold text-emerald-900 block text-[12px]">可以完成什么：</span>
                  {whatItCanDo.map((item, i) => (
                    <div key={i} className="text-[12px] text-emerald-950 font-medium">• {item}</div>
                  ))}
                </div>

                <div className="p-3.5 bg-rose-50 rounded-xl border border-rose-200 space-y-1.5">
                  <span className="font-extrabold text-rose-900 block text-[12px]">不会自动做什么：</span>
                  {whatItWontDoAuto.map((item, i) => (
                    <div key={i} className="text-[12px] text-rose-950 font-medium">• {item}</div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STAGE 3 */}
          {currentStage === 3 && (
            <div className="space-y-4">
              <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 space-y-2">
                <span className="font-extrabold text-purple-900 block text-[13px]">演练输入样本：</span>
                <textarea
                  rows={3}
                  value={drillInput}
                  onChange={e => setDrillInput(e.target.value)}
                  className="w-full p-3 bg-white border border-purple-200 rounded-xl text-[12.5px] font-medium"
                />
              </div>

              <button
                onClick={handleRunDrill}
                disabled={isDrilling}
                className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-extrabold text-[13px] rounded-xl flex items-center justify-center gap-2"
              >
                {isDrilling ? <RefreshCw size={15} className="animate-spin" /> : <Terminal size={15} />}
                <span>{isDrilling ? '演练执行中...' : '运行本地演练'}</span>
              </button>

              {drillPassed && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2 text-[12.5px] animate-in fade-in duration-150">
                  <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-[14px]">
                    <CheckCircle2 size={18} className="text-emerald-600" />
                    <span>本地演练通过！专家理解一致且触发了设置的人工确认点。</span>
                  </div>
                  <p className="text-emerald-800 font-medium pl-6">
                    拟调用技能：“首图敏感词核查”；捕获敏感词“绝对”、“彻底根治”；暂停并提示“涉及高额罚款风险的疑难词汇判定”。
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between">
          <button
            onClick={() => {
              if (currentStage > 1) setCurrentStage((currentStage - 1) as any);
              else onClose();
            }}
            className="px-4 py-2 border border-neutral-300 text-neutral-700 text-[12.5px] font-bold rounded-xl"
          >
            {currentStage === 1 ? '取消' : '上一步'}
          </button>

          {currentStage === 1 && (
            <button
              onClick={handleGenerateCharter}
              disabled={isGeneratingCharter}
              className="px-6 py-2 bg-purple-700 hover:bg-purple-600 text-white text-[12.5px] font-extrabold rounded-xl flex items-center gap-1.5 shadow-2xs"
            >
              {isGeneratingCharter ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
              <span>生成专家方案</span>
            </button>
          )}

          {currentStage === 2 && (
            <button
              onClick={handleStartDrillStage}
              className="px-6 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-[12.5px] font-extrabold rounded-xl shadow-2xs"
            >
              进入本地演练
            </button>
          )}

          {currentStage === 3 && (
            <button
              onClick={handleCompleteAndEnable}
              disabled={!drillPassed}
              className={`px-6 py-2 text-white text-[12.5px] font-extrabold rounded-xl shadow-2xs ${
                drillPassed ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-neutral-300 cursor-not-allowed'
              }`}
            >
              完成演练并启用专家
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

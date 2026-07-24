import React, { useState } from 'react';
import { SkillItem, ProcessCategory, SkillSourceType } from './types';
import {
  X, Wrench, Sparkles, CheckCircle2, Terminal, RefreshCw, AlertTriangle, ArrowRight, Trash2, Wifi
} from 'lucide-react';

interface CreateSkillWorkbenchProps {
  onClose: () => void;
  onSkillCreated: (newSkill: SkillItem) => void;
}

export const CreateSkillWorkbench: React.FC<CreateSkillWorkbenchProps> = ({
  onClose,
  onSkillCreated
}) => {
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);

  // Source selection (Requirement 14)
  const [selectedSourceType, setSelectedSourceType] = useState<SkillSourceType>('mine');
  const [sourceInputText, setSourceInputText] = useState<string>(
    '把我们团队的《小红书违规红线审核手册.md》转化为技能：自动抽取文本或OCR图片中的隐喻违规词（如“神奇疗效”、“百分百包治”），输出格式为 JSON 风险清单。'
  );

  // Skill Contract Fields (Requirement 14)
  const [skillName, setSkillName] = useState<string>('小红书隐喻违规词提炼');
  const [goal, setGoal] = useState<string>('自动检测文本中的隐含违规语意与夸大宣传风险');
  const [oneSentenceDesc, setOneSentenceDesc] = useState<string>('提取图文隐喻违规词并输出JSON清单');
  const [processCategory, setProcessCategory] = useState<ProcessCategory>('audit');
  const [inputFormatText, setInputFormatText] = useState<string>('图文OCR字符串, 标题与文案文本');
  const [outputFormatText, setOutputFormatText] = useState<string>('JSON格式风险字段列表, 修改提示');
  const [preconditions, setPreconditions] = useState<string>('需载入合规词库规则');
  const [failureHandling, setFailureHandling] = useState<string>('无法读取文件时返回错误码并跳过');
  const [needsNetwork, setNeedsNetwork] = useState<boolean>(false);
  const [willModifyData, setWillModifyData] = useState<boolean>(false);

  // Local Test Cases (Requirement 14: Must run & pass at least 1 test)
  const [testInput, setTestInput] = useState<string>('文案样例：“我家猫咪吃了这款粮，拉稀彻底根治，神奇疗效看得见！”');
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testPassed, setTestPassed] = useState<boolean>(false);
  const [testOutputResult, setTestOutputResult] = useState<string>('');

  // Step 1 -> Step 2
  const handleParseContract = () => {
    setActiveStep(2);
  };

  // Step 2 -> Step 3
  const handleGoToTest = () => {
    setActiveStep(3);
  };

  // Step 3 Run Local Test
  const handleRunLocalTest = () => {
    setIsTesting(true);
    setTimeout(() => {
      setIsTesting(false);
      setTestPassed(true);
      setTestOutputResult(
        JSON.stringify({
          violations: [
            { term: '彻底根治', riskLevel: 'HIGH', rule: '禁止医疗断言' },
            { term: '神奇疗效', riskLevel: 'HIGH', rule: '夸大宣传' }
          ],
          suggestion: '替换为“帮助维持肠道健康”'
        }, null, 2)
      );
    }, 800);
  };

  // Step 3 Save & Enable
  const handleCompleteAndSave = () => {
    const newSkill: SkillItem = {
      id: `sk_created_${Date.now()}`,
      name: skillName,
      goal: goal,
      oneSentenceDesc: oneSentenceDesc,
      processCategory: processCategory,
      status: 'enabled',
      updatedAt: '刚才',
      version: '1.0.0',
      source: selectedSourceType,
      inputFormat: inputFormatText.split(',').map(s => s.trim()),
      outputFormat: outputFormatText.split(',').map(s => s.trim()),
      applicableScenes: ['文案审核', '首图违规抽查'],
      inapplicableScenes: ['视频原声剪辑'],
      preConditions: [preconditions || '无特殊限制'],
      executionSteps: ['提取文案', '匹配词库', '输出 JSON'],
      risksAndLimits: ['依赖词库更新周期'],
      failureHandling: failureHandling,
      manualConfirmPoints: ['疑难词汇二次核对'],
      lastTestStatus: 'passed',
      lastVerifiedResult: '测试通过：成功捕获高风险词“彻底根治”',
      usedByExpertsCount: 0,
      usedByProjectsCount: 0,
      usedByExperts: [],
      usedByProjects: [],
      appScope: 'merchant',
      requiredPermissions: {
        readScope: ['文本', '图片'],
        writeScope: ['临时结果'],
        needsNetwork: needsNetwork,
        willModifyData: willModifyData
      }
    };

    onSkillCreated(newSkill);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-neutral-900/50 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-neutral-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600/30 text-blue-300 rounded-xl border border-blue-500/30">
              <Wrench size={20} />
            </div>
            <div>
              <h2 className="text-[17px] font-extrabold">新建技能工作台 (契约 & 本地测试)</h2>
              <p className="text-[11.5px] text-neutral-400">导入/描述 → 生成技能契约 → 本地测试验证 → 启用</p>
            </div>
          </div>

          <button onClick={onClose} className="text-neutral-400 hover:text-white p-1">
            <X size={20} />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="bg-neutral-100 border-b border-neutral-200 p-3 px-6 flex items-center justify-between text-[12.5px] font-extrabold">
          <div className={`flex items-center gap-2 ${activeStep >= 1 ? 'text-blue-700' : 'text-neutral-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${activeStep >= 1 ? 'bg-blue-700 text-white' : 'bg-neutral-200 text-neutral-600'}`}>1</span>
            <span>选择来源与要求</span>
          </div>
          <ArrowRight size={14} className="text-neutral-300" />
          <div className={`flex items-center gap-2 ${activeStep >= 2 ? 'text-blue-700' : 'text-neutral-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${activeStep >= 2 ? 'bg-blue-700 text-white' : 'bg-neutral-200 text-neutral-600'}`}>2</span>
            <span>编辑技能契约</span>
          </div>
          <ArrowRight size={14} className="text-neutral-300" />
          <div className={`flex items-center gap-2 ${activeStep >= 3 ? 'text-blue-700' : 'text-neutral-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${activeStep >= 3 ? 'bg-blue-700 text-white' : 'bg-neutral-200 text-neutral-600'}`}>3</span>
            <span>运行本地测试并启用</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5 text-[13px]">
          {/* STEP 1 */}
          {activeStep === 1 && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="font-extrabold text-neutral-900 block">选择技能来源：</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setSelectedSourceType('mine')}
                    className={`p-3 rounded-xl border text-[12px] font-extrabold text-left ${selectedSourceType === 'mine' ? 'border-blue-600 bg-blue-50 text-blue-900' : 'border-neutral-200 text-neutral-700'}`}
                  >
                    自然语言描述 / 我创建
                  </button>
                  <button
                    onClick={() => setSelectedSourceType('from_exp')}
                    className={`p-3 rounded-xl border text-[12px] font-extrabold text-left ${selectedSourceType === 'from_exp' ? 'border-blue-600 bg-blue-50 text-blue-900' : 'border-neutral-200 text-neutral-700'}`}
                  >
                    从操盘手经验升级
                  </button>
                  <button
                    onClick={() => setSelectedSourceType('from_project')}
                    className={`p-3 rounded-xl border text-[12px] font-extrabold text-left ${selectedSourceType === 'from_project' ? 'border-blue-600 bg-blue-50 text-blue-900' : 'border-neutral-200 text-neutral-700'}`}
                  >
                    从项目流程沉淀
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-extrabold text-neutral-900 block">描述技能用途或粘贴 SOP/MD 内容：</label>
                <textarea
                  rows={4}
                  value={sourceInputText}
                  onChange={e => setSourceInputText(e.target.value)}
                  className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-[12.5px] font-medium"
                />
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {activeStep === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-extrabold text-neutral-800 block mb-1">技能名称：</label>
                  <input
                    type="text"
                    value={skillName}
                    onChange={e => setSkillName(e.target.value)}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="font-extrabold text-neutral-800 block mb-1">所属流程阶段：</label>
                  <select
                    value={processCategory}
                    onChange={e => setProcessCategory(e.target.value as ProcessCategory)}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl font-bold"
                  >
                    <option value="audit">审核与合规</option>
                    <option value="content">选题与内容</option>
                    <option value="research">市场与机会研究</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-extrabold text-neutral-800 block mb-1">技能目标 (Goal)：</label>
                <input
                  type="text"
                  value={goal}
                  onChange={e => setGoal(e.target.value)}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-extrabold text-neutral-800 block mb-1">输入要求 (逗号分隔)：</label>
                  <input
                    type="text"
                    value={inputFormatText}
                    onChange={e => setInputFormatText(e.target.value)}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="font-extrabold text-neutral-800 block mb-1">输出格式 (逗号分隔)：</label>
                  <input
                    type="text"
                    value={outputFormatText}
                    onChange={e => setOutputFormatText(e.target.value)}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/80 space-y-2">
                <span className="font-extrabold text-neutral-800 block text-[12px]">权限与数据边界设置：</span>
                <div className="flex items-center gap-6 text-[12px] font-extrabold text-neutral-700">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={needsNetwork}
                      onChange={e => setNeedsNetwork(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>允许连接外网 API</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={willModifyData}
                      onChange={e => setWillModifyData(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>允许修改业务数据</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {activeStep === 3 && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 space-y-2">
                <span className="font-extrabold text-blue-900 block text-[13px]">本地测试用例输入：</span>
                <textarea
                  rows={2}
                  value={testInput}
                  onChange={e => setTestInput(e.target.value)}
                  className="w-full p-3 bg-white border border-blue-200 rounded-xl text-[12.5px] font-medium"
                />
              </div>

              <button
                onClick={handleRunLocalTest}
                disabled={isTesting}
                className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-extrabold text-[13px] rounded-xl flex items-center justify-center gap-2"
              >
                {isTesting ? <RefreshCw size={15} className="animate-spin" /> : <Terminal size={15} />}
                <span>{isTesting ? '本地试用运行中...' : '运行本地测试 (必须完成 1 次)'}</span>
              </button>

              {testPassed && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2 animate-in fade-in duration-150">
                  <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-[14px]">
                    <CheckCircle2 size={18} className="text-emerald-600" />
                    <span>测试通过！已生成符合格式要求的结构化 JSON 清单。</span>
                  </div>
                  <pre className="p-3 bg-neutral-900 text-emerald-300 rounded-xl text-[11px] font-mono overflow-x-auto">
                    {testOutputResult}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between">
          <button
            onClick={() => {
              if (activeStep > 1) setActiveStep((activeStep - 1) as any);
              else onClose();
            }}
            className="px-4 py-2 border border-neutral-300 text-neutral-700 text-[12.5px] font-bold rounded-xl"
          >
            {activeStep === 1 ? '取消' : '上一步'}
          </button>

          {activeStep === 1 && (
            <button
              onClick={handleParseContract}
              className="px-6 py-2 bg-blue-700 hover:bg-blue-600 text-white text-[12.5px] font-extrabold rounded-xl shadow-2xs"
            >
              解析结构并生成契约
            </button>
          )}

          {activeStep === 2 && (
            <button
              onClick={handleGoToTest}
              className="px-6 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-[12.5px] font-extrabold rounded-xl shadow-2xs"
            >
              去运行本地测试
            </button>
          )}

          {activeStep === 3 && (
            <button
              onClick={handleCompleteAndSave}
              disabled={!testPassed}
              className={`px-6 py-2 text-white text-[12.5px] font-extrabold rounded-xl shadow-2xs ${
                testPassed ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-neutral-300 cursor-not-allowed'
              }`}
            >
              保存并启用技能
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

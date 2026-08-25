import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Plus, Settings2, Trash2, ArrowUp, ArrowDown, Sparkles, Check, 
  HelpCircle, RefreshCw, Layers, ArrowRight, Wand2, CornerDownRight,
  FileText
} from 'lucide-react';
import { useProjectStore } from '../../context/ProjectContext';
import { Note, Project } from '../../data/projectStore';
import { DEFAULT_QUESTIONNAIRE_QUESTIONS, QuestionnaireQuestion } from '../merchant/CreateProjectWorkstation';

interface ProjectQuestionnaireDrawerProps {
  project?: Project;
  contentPackage?: Note;
  onClose: () => void;
  onSaved?: (updatedQuestions: QuestionnaireQuestion[]) => void;
}

// Preset requirement templates for quick insertion
const PROMPT_PRESETS = [
  {
    label: "幼犬换粮消化",
    prompt: "针对3-6个月幼犬初次换粮软便问题，需要收集犬种月龄、换粮过渡天数、便便成型状态及适口性变化。"
  },
  {
    label: "敏肌面霜修护",
    prompt: "针对敏感肌面霜舒缓褪红，需要收集用户肤质、使用天数、泛红与刺痛改善程度、质地肤感及回购意向。"
  },
  {
    label: "餐饮到店试吃",
    prompt: "针对新店招牌菜品品尝，需要收集用餐人数、菜品口味咸淡、分量满意度、推荐菜品及综合服务评分。"
  },
  {
    label: "数码3C开箱",
    prompt: "针对降噪无线耳机开箱，需要收集使用场景、降噪深度体感、佩戴舒适时长、音质评价及续航满意度。"
  }
];

// Smart AI Parser for questionnaire generation
function parseRequirementsToQuestions(prompt: string): QuestionnaireQuestion[] {
  const p = prompt.trim().toLowerCase();
  
  if (p.includes("犬") || p.includes("狗") || p.includes("猫") || p.includes("宠") || p.includes("粮") || p.includes("软便")) {
    return [
      {
        id: `q_${Date.now()}_1`,
        title: "1. 您的宠物当前处于什么月龄阶段？",
        type: "单选",
        isRequired: true,
        options: ["幼宠阶段 (0-6个月)", "成宠阶段 (6-12个月)", "成年阶段 (1岁以上)"]
      },
      {
        id: `q_${Date.now()}_2`,
        title: "2. 换粮过渡期已持续多少天？",
        type: "单选",
        isRequired: true,
        options: ["1-3天 (刚开始换粮)", "4-7天 (混合过渡中)", "7天以上 (已完全换粮)"]
      },
      {
        id: `q_${Date.now()}_3`,
        title: "3. 换粮期间排便与肠胃状态观察？",
        type: "多选",
        isRequired: true,
        options: ["便便成型无软便", "偶有软便但很快恢复", "无呕吐挑食现象", "便臭明显改善", "食欲明显增加"]
      },
      {
        id: `q_${Date.now()}_4`,
        title: "4. 宠物对本款产品的适口性与喜爱度？",
        type: "单选",
        isRequired: true,
        options: ["非常爱吃，主动秒光", "正常进食，适口性好", "需要拌粮才吃", "不太适应"]
      },
    ];
  }

  if (p.includes("肌") || p.includes("霜") || p.includes("护肤") || p.includes("美妆") || p.includes("泛红") || p.includes("舒缓")) {
    return [
      {
        id: `q_${Date.now()}_1`,
        title: "1. 您的主要肤质类型是什么？",
        type: "单选",
        isRequired: true,
        options: ["敏感干皮", "敏感油皮/混油", "中性及其他肤质"]
      },
      {
        id: `q_${Date.now()}_2`,
        title: "2. 体验本产品的主要护肤诉求？",
        type: "多选",
        isRequired: true,
        options: ["舒缓泛红刺痛", "修护屏障受损", "补水保湿锁水", "换季维稳抗敏"]
      },
      {
        id: `q_${Date.now()}_3`,
        title: "3. 连续使用后最明显的改善体感？",
        type: "多选",
        isRequired: true,
        options: ["泛红明显消退", "刺痛紧绷感缓解", "皮肤水润细腻", "上妆更服帖不卡粉", "无明显改善"]
      },
      {
        id: `q_${Date.now()}_4`,
        title: "4. 产品质地与吸收肤感评价？",
        type: "单选",
        isRequired: true,
        options: ["清爽好吸收不黏腻", "滋润度适中肤感舒适", "偏厚重需乳化", "容易搓条"]
      }
    ];
  }

  if (p.includes("餐") || p.includes("吃") || p.includes("店") || p.includes("菜") || p.includes("味") || p.includes("食")) {
    return [
      {
        id: `q_${Date.now()}_1`,
        title: "1. 本次到店用餐的人数？",
        type: "单选",
        isRequired: true,
        options: ["单人简餐", "2-3人朋友/情侣", "4人及以上家庭聚餐/团建"]
      },
      {
        id: `q_${Date.now()}_2`,
        title: "2. 您最满意的招牌菜品或风味？",
        type: "多选",
        isRequired: true,
        options: ["主打招牌菜", "特色小吃/点心", "时令汤饮/饮品", "菜品分量充足"]
      },
      {
        id: `q_${Date.now()}_3`,
        title: "3. 对菜品整体口味咸淡与出餐速度的评价？",
        type: "单选",
        isRequired: true,
        options: ["咸淡适中出餐快", "口味偏重/偏辣", "口味偏清淡", "上菜稍慢"]
      },
      {
        id: `q_${Date.now()}_4`,
        title: "4. 餐厅环境与服务体验如何？",
        type: "单选",
        isRequired: false,
        options: ["环境整洁服务热情", "一般达标", "有待提升"]
      }
    ];
  }

  if (p.includes("耳机") || p.includes("数码") || p.includes("3c") || p.includes("音质") || p.includes("降噪")) {
    return [
      {
        id: `q_${Date.now()}_1`,
        title: "1. 您最常用的使用场景是什么？",
        type: "多选",
        isRequired: true,
        options: ["通勤地铁/公交", "办公室/自习室", "运动健身", "居家影音娱乐"]
      },
      {
        id: `q_${Date.now()}_2`,
        title: "2. 深度降噪与环境音透传体验？",
        type: "单选",
        isRequired: true,
        options: ["降噪效果惊艳，低频过滤彻底", "降噪良好满足日常需求", "有轻微耳压感", "降噪效果一般"]
      },
      {
        id: `q_${Date.now()}_3`,
        title: "3. 单次连续佩戴舒适时长？",
        type: "单选",
        isRequired: true,
        options: ["3小时以上无压迫感", "1-2小时舒适", "佩戴久了容易胀痛"]
      },
      {
        id: `q_${Date.now()}_4`,
        title: "4. 整体音质与通话清晰度表现？",
        type: "多选",
        isRequired: true,
        options: ["人声清晰透亮", "低音澎湃有弹性", "通话抗风噪好", "延迟低音画同步"]
      }
    ];
  }

  // Generic parsed template based on input
  return [
    {
      id: `q_${Date.now()}_1`,
      title: `1. 您目前所处的使用阶段或主要场景？`,
      type: "单选",
      isRequired: true,
      options: ["初次体验 / 新尝试", "长期使用 / 常规用户", "正在对比其他品牌"]
    },
    {
      id: `q_${Date.now()}_2`,
      title: `2. 本次体验中您最关注的核心痛点与需求？`,
      type: "多选",
      isRequired: true,
      options: ["效果显著 / 快速见效", "安全无负担 / 配方温和", "性价比高 / 实用耐用", "操作简便 / 省时省力"]
    },
    {
      id: `q_${Date.now()}_3`,
      title: `3. 实际使用后的核心事实与感受反馈？`,
      type: "多选",
      isRequired: true,
      options: ["达到并超出预期", "体验平稳符合描述", "部分细节仍有优化空间", "整体非常满意"]
    },
    {
      id: `q_${Date.now()}_4`,
      title: `4. 后续是否愿意继续使用或推荐？`,
      type: "单选",
      isRequired: false,
      options: ["愿意持续回购", "推荐给身边朋友", "保持观望"]
    }
  ];
}

export function ProjectQuestionnaireDrawer({ 
  project: propProject, 
  contentPackage,
  onClose, 
  onSaved 
}: ProjectQuestionnaireDrawerProps) {
  const { currentProject, updateLandingPageSettings, updateContentPackageFeedback } = useProjectStore();
  const activeProject = propProject || currentProject;

  const packageFeedbackQuestions: QuestionnaireQuestion[] = (contentPackage?.packageSpec?.feedbackQuestions || []).map((question, index) => ({
    id: question.id,
    title: `${index + 1}. ${question.prompt}`,
    type: "单选",
    isRequired: true,
    options: question.options
  }));
  const initialQuestions: QuestionnaireQuestion[] = packageFeedbackQuestions.length > 0
    ? packageFeedbackQuestions
    : activeProject?.landingPageSettings?.questionnaireQuestions && 
    activeProject.landingPageSettings.questionnaireQuestions.length > 0
      ? activeProject.landingPageSettings.questionnaireQuestions
      : DEFAULT_QUESTIONNAIRE_QUESTIONS;

  const [questions, setQuestions] = useState<QuestionnaireQuestion[]>(
    JSON.parse(JSON.stringify(initialQuestions))
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  // AI Generation State
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [aiRequirement, setAiRequirement] = useState("");
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiGeneratedQuestions, setAiGeneratedQuestions] = useState<QuestionnaireQuestion[] | null>(null);

  const handleAddQuestion = () => {
    if (questions.length >= 4) return;
    const newId = `q_${Date.now()}`;
    const newQ: QuestionnaireQuestion = {
      id: newId,
      title: `${questions.length + 1}. 新增体验反馈问题`,
      type: "单选",
      isRequired: true,
      options: ["选项 A", "选项 B", "选项 C"]
    };
    setQuestions([...questions, newQ]);
  };

  const handleRemoveQuestion = (id: string) => {
    if (questions.length <= 1) {
      alert("体验反馈至少需要保留 1 道题目");
      return;
    }
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleMoveQuestion = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === questions.length - 1) return;
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const newArr = [...questions];
    const temp = newArr[index];
    newArr[index] = newArr[targetIdx];
    newArr[targetIdx] = temp;
    setQuestions(newArr);
  };

  const handleUpdateField = (id: string, field: keyof QuestionnaireQuestion, value: any) => {
    setQuestions(questions.map(q => {
      if (q.id === id) {
        if (field === 'type') {
          if ((value === '单选' || value === '多选') && (!q.options || q.options.length === 0)) {
            return { ...q, type: value, options: ["选项 1", "选项 2", "选项 3"] };
          }
        }
        return { ...q, [field]: value };
      }
      return q;
    }));
  };

  const handleAddOption = (qId: string) => {
    setQuestions(questions.map(q => {
      if (q.id === qId) {
        const opts = q.options ? [...q.options] : [];
        opts.push(`新选项 ${opts.length + 1}`);
        return { ...q, options: opts };
      }
      return q;
    }));
  };

  const handleUpdateOption = (qId: string, optIdx: number, val: string) => {
    setQuestions(questions.map(q => {
      if (q.id === qId && q.options) {
        const opts = [...q.options];
        opts[optIdx] = val;
        return { ...q, options: opts };
      }
      return q;
    }));
  };

  const handleRemoveOption = (qId: string, optIdx: number) => {
    setQuestions(questions.map(q => {
      if (q.id === qId && q.options) {
        if (q.options.length <= 2) {
          alert("单选/多选题至少保留 2 个选项");
          return q;
        }
        const opts = q.options.filter((_, i) => i !== optIdx);
        return { ...q, options: opts };
      }
      return q;
    }));
  };

  // AI Parse & Generate
  const handleAiParse = () => {
    if (!aiRequirement.trim()) return;
    setIsAiGenerating(true);
    setTimeout(() => {
      const generated = parseRequirementsToQuestions(aiRequirement);
      setAiGeneratedQuestions(generated);
      setIsAiGenerating(false);
    }, 450);
  };

  const handleApplyAiReplace = () => {
    if (aiGeneratedQuestions && aiGeneratedQuestions.length > 0) {
      setQuestions(aiGeneratedQuestions);
      setAiGeneratedQuestions(null);
      setShowAiPanel(false);
    }
  };

  const handleApplyAiAppend = () => {
    if (aiGeneratedQuestions && aiGeneratedQuestions.length > 0) {
      const appended = [
        ...questions,
        ...aiGeneratedQuestions.map((q, idx) => ({
          ...q,
          id: `q_app_${Date.now()}_${idx}`,
          title: `${questions.length + idx + 1}. ${q.title.replace(/^\d+\.\s*/, '')}`
        }))
      ];
      setQuestions(appended);
      setAiGeneratedQuestions(null);
      setShowAiPanel(false);
    }
  };

  const handleSave = () => {
    if (contentPackage) {
      updateContentPackageFeedback(contentPackage.id, questions);
    } else if (activeProject) {
      updateLandingPageSettings(activeProject.id, {
        ...(activeProject.landingPageSettings || { loginMode: "无需登录", bannerUrl: "" }),
        hasQuestionnaire: true,
        questionnaireQuestions: questions
      });
    }
    if (onSaved) {
      onSaved(questions);
    }
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[150] flex justify-end">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-btn-main/40 backdrop-blur-xs"
          onClick={onClose}
        />
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="relative w-full max-w-[640px] bg-surface-1 h-full shadow-2xl flex flex-col z-10"
        >
          {/* Header */}
          <div className="p-5 border-b border-border-default bg-surface-1 flex items-center justify-between shrink-0">
            <div>
              <div className="flex items-center gap-2">
                <Settings2 size={18} className="text-text-main" />
                <h3 className="text-[16px] font-semibold text-text-main">内容包体验反馈配置</h3>
                <span className="text-[11.5px] font-normal px-2 py-0.5 rounded bg-surface-subtle border border-border-default text-text-secondary">
                  共 {questions.length} 道题目
                </span>
              </div>
              <p className="text-[12px] text-text-tertiary mt-1">
                领取后约 10 秒完成；反馈与当前内容包及方案版本绑定，只影响该消费者生成的笔记。
              </p>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 text-text-tertiary hover:text-text-main rounded-lg hover:bg-hover-bg transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* AI Generator Banner / Collapsible Panel */}
          <div className="border-b border-border-default bg-surface-subtle/80 p-4 shrink-0 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-surface-1 border border-border-default flex items-center justify-center text-text-main">
                  <Sparkles size={14} />
                </div>
                <div>
                  <span className="text-[13px] font-semibold text-text-main">AI 生成体验反馈项</span>
                  <span className="text-[11.5px] text-text-tertiary ml-2">建议 3 题，全部使用一键选择</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowAiPanel(!showAiPanel);
                  if (!showAiPanel && !aiRequirement) {
                    setAiRequirement(PROMPT_PRESETS[0].prompt);
                  }
                }}
                className="px-3 py-1.5 bg-surface-1 hover:bg-hover-bg border border-border-default text-text-main text-[12px] font-medium rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Wand2 size={13} className="text-text-secondary" />
                <span>{showAiPanel ? "收起生成器" : "展开 AI 生成"}</span>
              </button>
            </div>

            {/* AI Generator Expanded Panel */}
            {showAiPanel && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="pt-2 space-y-3"
              >
                {/* Prompt Presets */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] text-text-tertiary">常用场景：</span>
                  {PROMPT_PRESETS.map((preset, pIdx) => (
                    <button
                      key={pIdx}
                      type="button"
                      onClick={() => setAiRequirement(preset.prompt)}
                      className="px-2.5 py-1 bg-surface-1 hover:bg-hover-bg border border-border-default text-text-secondary hover:text-text-main rounded-md text-[11.5px] font-normal transition-colors"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                {/* Requirement Textarea */}
                <div className="space-y-1.5">
                  <textarea
                    rows={3}
                    value={aiRequirement}
                    onChange={(e) => setAiRequirement(e.target.value)}
                    placeholder="请输入体验反馈需求，例如：针对幼犬换粮内容包，收集犬种月龄、换粮前困扰和实际变化..."
                    className="w-full px-3 py-2 bg-surface-1 border border-border-default rounded-lg text-[12.5px] text-text-main placeholder:text-text-tertiary outline-none focus:border-border-strong font-normal"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-text-tertiary">
                      AI 将分析行业痛点，提炼 4-5 道高质量客观选择题
                    </span>
                    <button
                      type="button"
                      disabled={isAiGenerating || !aiRequirement.trim()}
                      onClick={handleAiParse}
                      className="px-4 py-1.5 bg-btn-main hover:bg-btn-main-hover disabled:opacity-50 text-white text-[12px] font-medium rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      {isAiGenerating ? (
                        <>
                          <RefreshCw size={13} className="animate-spin" />
                          <span>正在智能解析...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles size={13} />
                          <span>解析生成题目</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* AI Generated Preview List */}
                {aiGeneratedQuestions && (
                  <div className="bg-surface-1 rounded-xl p-4 border border-border-default space-y-3">
                    <div className="flex items-center justify-between border-b border-border-default pb-2">
                      <div className="flex items-center gap-2">
                        <Check size={14} className="text-emerald-600" />
                        <span className="text-[12.5px] font-semibold text-text-main">
                          解析完成！已生成 {aiGeneratedQuestions.length} 道题目
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleApplyAiReplace}
                          className="px-3 py-1 bg-btn-main hover:bg-btn-main-hover text-white text-[11.5px] font-medium rounded-md transition-colors"
                        >
                          替换当前反馈项
                        </button>
                        <button
                          type="button"
                          onClick={handleApplyAiAppend}
                          className="px-3 py-1 bg-surface-subtle hover:bg-hover-bg border border-border-default text-text-main text-[11.5px] font-medium rounded-md transition-colors"
                        >
                          追加到末尾
                        </button>
                        <button
                          type="button"
                          onClick={() => setAiGeneratedQuestions(null)}
                          className="text-[11.5px] text-text-tertiary hover:text-text-main px-1.5"
                        >
                          放弃
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                      {aiGeneratedQuestions.map((q, idx) => (
                        <div key={idx} className="p-2.5 bg-surface-subtle rounded-lg border border-border-default text-[12px] space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-text-main">{q.title}</span>
                            <span className="text-[10.5px] text-text-tertiary">{q.type}题</span>
                          </div>
                          {q.options && (
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {q.options.map((opt, oIdx) => (
                                <span key={oIdx} className="px-2 py-0.5 bg-surface-1 border border-border-default rounded text-[11px] text-text-secondary">
                                  {opt}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>
          
          {/* Questions Editor Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-canvas">
            <div className="flex items-center justify-between pb-1">
              <div className="text-[12px] text-text-tertiary">
                体验反馈采用单选与多选格式，控制在 4 项以内，消费者约 10 秒即可完成。
              </div>
              <button
                type="button"
                onClick={handleAddQuestion}
                className="px-3 py-1.5 bg-surface-1 hover:bg-hover-bg border border-border-default text-text-main text-[12px] font-medium rounded-lg flex items-center gap-1 transition-colors shrink-0"
              >
                <Plus size={14} />
                <span>添加题目</span>
              </button>
            </div>

            <div className="space-y-3.5">
              {questions.map((q, idx) => (
                <div 
                  key={q.id} 
                  className="bg-surface-1 border border-border-default rounded-xl p-4 space-y-3 group hover:border-border-strong transition-colors"
                >
                  {/* Top Bar of question */}
                  <div className="flex items-center justify-between gap-2 border-b border-border-default pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[11.5px] font-medium px-2 py-0.5 bg-surface-subtle text-text-secondary rounded border border-border-default">
                        第 {idx + 1} 题
                      </span>
                      <select 
                        value={q.type}
                        onChange={(e) => handleUpdateField(q.id, 'type', e.target.value)}
                        className="text-[12px] font-medium px-2.5 py-1 border border-border-default rounded-md bg-surface-1 text-text-main outline-none cursor-pointer"
                      >
                        <option value="单选">单选题</option>
                        <option value="多选">多选题</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-1">
                      <button 
                        disabled={idx === 0}
                        onClick={() => handleMoveQuestion(idx, 'up')}
                        className="p-1 text-text-tertiary hover:text-text-main disabled:opacity-30 rounded hover:bg-hover-bg"
                        title="上移"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button 
                        disabled={idx === questions.length - 1}
                        onClick={() => handleMoveQuestion(idx, 'down')}
                        className="p-1 text-text-tertiary hover:text-text-main disabled:opacity-30 rounded hover:bg-hover-bg"
                        title="下移"
                      >
                        <ArrowDown size={14} />
                      </button>
                      <button 
                        onClick={() => handleRemoveQuestion(q.id)}
                        className="p-1 text-text-tertiary hover:text-danger rounded hover:bg-danger-light ml-1 transition-colors"
                        title="删除题目"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Title Input */}
                  <div>
                    <label className="block text-[11.5px] font-medium text-text-secondary mb-1">
                      题干描述与引导语
                    </label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 text-[12.5px] font-medium text-text-main border border-border-default rounded-lg outline-none focus:border-border-strong bg-surface-1"
                      value={q.title}
                      onChange={(e) => handleUpdateField(q.id, 'title', e.target.value)}
                      placeholder="输入题目描述，如：您的宠物目前处于什么阶段？"
                    />
                  </div>

                  {/* Options for single / multi choice */}
                  {(q.type === '单选' || q.type === '多选') && (
                    <div className="space-y-2 pt-1">
                      <label className="block text-[11.5px] font-medium text-text-secondary">
                        选项列表
                      </label>
                      <div className="space-y-1.5">
                        {(q.options || []).map((opt, oIdx) => (
                          <div key={oIdx} className="flex items-center gap-2">
                            <div className={`w-3.5 h-3.5 border border-border-strong shrink-0 ${q.type === '单选' ? 'rounded-full' : 'rounded-xs'}`} />
                            <input 
                              type="text"
                              className="flex-1 px-2.5 py-1 text-[12px] text-text-main bg-surface-subtle border border-border-default rounded-md outline-none focus:border-border-strong focus:bg-surface-1"
                              value={opt}
                              onChange={(e) => handleUpdateOption(q.id, oIdx, e.target.value)}
                              placeholder={`选项 ${oIdx + 1}`}
                            />
                            <button 
                              onClick={() => handleRemoveOption(q.id, oIdx)}
                              className="text-text-tertiary hover:text-danger p-1 rounded hover:bg-hover-bg transition-colors"
                              title="删除选项"
                            >
                              <X size={13} />
                            </button>
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAddOption(q.id)}
                        className="text-[12px] text-text-secondary hover:text-text-main font-medium flex items-center gap-1 mt-1 pt-1"
                      >
                        <Plus size={13} /> 添加选项
                      </button>
                    </div>
                  )}

                  {/* Footer Controls of Question */}
                  <div className="flex items-center justify-between pt-2 border-t border-border-default text-[12px]">
                    <label className="flex items-center gap-1.5 text-text-secondary cursor-pointer font-normal">
                      <input 
                        type="checkbox" 
                        checked={q.isRequired !== false}
                        onChange={(e) => handleUpdateField(q.id, 'isRequired', e.target.checked)}
                        className="rounded border-border-strong text-text-main focus:ring-0"
                      />
                      <span>必填题目</span>
                    </label>
                    <span className="text-[11px] text-text-tertiary">
                      {q.type === '多选' ? '多选题' : '单选题'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={handleAddQuestion}
              className="w-full py-3 bg-surface-1 border border-dashed border-border-default rounded-xl text-[12.5px] font-medium text-text-secondary hover:bg-hover-bg hover:text-text-main transition-colors flex items-center justify-center gap-1.5"
            >
              <Plus size={15} /> 增加一道问题
            </button>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border-default bg-surface-1 flex items-center justify-between shrink-0">
            <span className="text-[12px] text-text-tertiary">
              共 {questions.length} 道问题 · 保存后实时应用于项目落地页与笔记事实提取
            </span>
            <div className="flex items-center gap-2">
              <button 
                onClick={onClose}
                className="px-4 py-2 border border-border-default text-text-secondary text-[12.5px] font-medium rounded-lg hover:bg-hover-bg transition-colors"
              >
                取消
              </button>
              <button 
                onClick={handleSave}
                className="px-5 py-2 bg-btn-main text-white text-[12.5px] font-medium rounded-lg hover:bg-btn-main-hover transition-colors flex items-center gap-1.5"
              >
                {savedSuccess ? (
                  <>
                    <Check size={14} className="text-emerald-400" />
                    <span>已保存</span>
                  </>
                ) : (
                  <span>保存并应用反馈配置</span>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

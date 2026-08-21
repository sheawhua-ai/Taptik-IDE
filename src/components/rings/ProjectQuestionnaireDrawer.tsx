import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, GripVertical, Plus, Settings2, Trash2, Eye, Edit3, 
  CheckCircle2, ArrowUp, ArrowDown, UploadCloud, Sparkles, Check, HelpCircle
} from 'lucide-react';
import { useProjectStore } from '../../context/ProjectContext';
import { Project } from '../../data/projectStore';
import { DEFAULT_QUESTIONNAIRE_QUESTIONS, QuestionnaireQuestion } from '../merchant/CreateProjectWorkstation';

interface ProjectQuestionnaireDrawerProps {
  project?: Project;
  onClose: () => void;
  initialTab?: 'view' | 'edit';
  onSaved?: (updatedQuestions: QuestionnaireQuestion[]) => void;
}

export function ProjectQuestionnaireDrawer({ 
  project: propProject, 
  onClose, 
  initialTab = 'edit',
  onSaved 
}: ProjectQuestionnaireDrawerProps) {
  const { currentProject, updateLandingPageSettings } = useProjectStore();
  const activeProject = propProject || currentProject;

  const initialQuestions: QuestionnaireQuestion[] = 
    activeProject?.landingPageSettings?.questionnaireQuestions && 
    activeProject.landingPageSettings.questionnaireQuestions.length > 0
      ? activeProject.landingPageSettings.questionnaireQuestions
      : DEFAULT_QUESTIONNAIRE_QUESTIONS;

  const [activeTab, setActiveTab] = useState<'view' | 'edit'>(initialTab);
  const [questions, setQuestions] = useState<QuestionnaireQuestion[]>(
    JSON.parse(JSON.stringify(initialQuestions))
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleAddQuestion = () => {
    const newId = `q_${Date.now()}`;
    const newQ: QuestionnaireQuestion = {
      id: newId,
      title: `${questions.length + 1}. 新增体验调研问题`,
      type: "单选",
      isRequired: true,
      options: ["选项 A", "选项 B", "选项 C"]
    };
    setQuestions([...questions, newQ]);
  };

  const handleRemoveQuestion = (id: string) => {
    if (questions.length <= 1) {
      alert("问卷至少需要保留 1 道题目");
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
          // If switching to choice, ensure options exist
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

  const handleSave = () => {
    if (activeProject) {
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
    }, 600);
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
          className="relative w-full max-w-[620px] bg-surface-1 h-full shadow-2xl flex flex-col z-10"
        >
          {/* Header */}
          <div className="p-5 border-b border-border-default bg-page-bg flex items-center justify-between shrink-0">
            <div>
              <div className="flex items-center gap-2">
                <Settings2 size={18} className="text-text-main" />
                <h3 className="text-[16px] font-bold text-text-main">项目体验问卷配置</h3>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-neutral-200 text-text-secondary">
                  {activeProject?.name || "当前项目"}
                </span>
              </div>
              <p className="text-[12px] text-text-tertiary mt-1">
                面向体验官与消费者落地页的事实采集问卷，AI 将据此定向提炼回答并生成个性化真实笔记。
              </p>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 text-text-tertiary hover:text-text-main rounded-xl hover:bg-selected-bg transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Tab Controls */}
          <div className="px-6 pt-2.5 bg-page-bg/90 border-b border-border-default flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('edit')}
              className={`px-4 py-2 text-[13px] font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'edit'
                  ? "border-neutral-900 text-text-main"
                  : "border-transparent text-text-tertiary hover:text-text-main"
              }`}
            >
              <Edit3 size={15} />
              <span>编辑题目 ({questions.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('view')}
              className={`px-4 py-2 text-[13px] font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'view'
                  ? "border-neutral-900 text-text-main"
                  : "border-transparent text-text-tertiary hover:text-text-main"
              }`}
            >
              <Eye size={15} />
              <span>问卷填答模拟 (H5视角)</span>
            </button>
          </div>
          
          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-page-bg">
            {activeTab === 'edit' ? (
              /* EDIT MODE */
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-1">
                  <div className="text-[12px] text-text-tertiary">
                    问卷全量采用单选与多选选择题，便于体验官/客户 30 秒内快速决策，AI 定向提炼事实。
                  </div>
                  <button
                    onClick={handleAddQuestion}
                    className="px-3 py-1.5 bg-btn-main hover:bg-black text-white text-[12px] font-bold rounded-xl flex items-center gap-1 transition-colors shadow-2xs shrink-0"
                  >
                    <Plus size={14} />
                    <span>添加题目</span>
                  </button>
                </div>

                <div className="space-y-3.5">
                  {questions.map((q, idx) => (
                    <div 
                      key={q.id} 
                      className="bg-surface-1 border border-border-default/90 rounded-xl p-4 shadow-2xs space-y-3 group hover:border-neutral-300 transition-colors"
                    >
                      {/* Top Bar of question */}
                      <div className="flex items-center justify-between gap-2 border-b border-border-default pb-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-bold px-2 py-0.5 bg-hover-bg text-text-secondary rounded-md">
                            第 {idx + 1} 题
                          </span>
                          <select 
                            value={q.type}
                            onChange={(e) => handleUpdateField(q.id, 'type', e.target.value)}
                            className="text-[12px] font-bold px-2 py-0.5 border border-border-default rounded-md bg-page-bg text-text-main outline-none"
                          >
                            <option value="单选">单选题 (快速单选)</option>
                            <option value="多选">多选题 (快速多选)</option>
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
                        <label className="block text-[11px] font-bold text-text-tertiary mb-1">
                          题目标题与引导语
                        </label>
                        <input 
                          type="text" 
                          className="w-full px-3 py-2 text-[13px] font-bold text-text-main border border-border-default rounded-xl outline-none focus:border-neutral-400 bg-surface-1"
                          value={q.title}
                          onChange={(e) => handleUpdateField(q.id, 'title', e.target.value)}
                          placeholder="输入题目描述，如：您的宠物目前处于什么阶段？"
                        />
                      </div>

                      {/* Options for single / multi choice */}
                      {(q.type === '单选' || q.type === '多选') && (
                        <div className="space-y-2 pt-1">
                          <label className="block text-[11px] font-bold text-text-tertiary">
                            选项列表
                          </label>
                          <div className="space-y-1.5">
                            {(q.options || []).map((opt, oIdx) => (
                              <div key={oIdx} className="flex items-center gap-2">
                                <div className={`w-3.5 h-3.5 border border-neutral-300 shrink-0 ${q.type === '单选' ? 'rounded-full' : 'rounded-xs'}`} />
                                <input 
                                  type="text"
                                  className="flex-1 px-2.5 py-1 text-[12px] text-text-secondary bg-page-bg border border-border-default rounded-lg outline-none focus:border-neutral-400"
                                  value={opt}
                                  onChange={(e) => handleUpdateOption(q.id, oIdx, e.target.value)}
                                  placeholder={`选项 ${oIdx + 1}`}
                                />
                                <button 
                                  onClick={() => handleRemoveOption(q.id, oIdx)}
                                  className="text-text-tertiary hover:text-brand-logo p-1 rounded hover:bg-hover-bg transition-colors"
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
                            className="text-[12px] text-text-secondary hover:text-black font-bold flex items-center gap-1 mt-1 pt-1"
                          >
                            <Plus size={13} /> 添加选项
                          </button>
                        </div>
                      )}

                      {/* Footer Controls of Question */}
                      <div className="flex items-center justify-between pt-2 border-t border-border-default text-[12px]">
                        <label className="flex items-center gap-1.5 text-text-secondary cursor-pointer font-medium">
                          <input 
                            type="checkbox" 
                            checked={q.isRequired !== false}
                            onChange={(e) => handleUpdateField(q.id, 'isRequired', e.target.checked)}
                            className="rounded border-neutral-300 text-text-main focus:ring-0"
                          />
                          <span>必填项 (未填无法提交)</span>
                        </label>
                        <span className="text-[11px] text-text-tertiary">
                          {q.type === '多选' ? '多选选择题' : '单选选择题'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={handleAddQuestion}
                  className="w-full py-3.5 bg-surface-1 border border-dashed border-neutral-300 rounded-xl text-[13px] font-bold text-text-secondary hover:bg-hover-bg hover:text-text-main transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <Plus size={16} /> 增加一道问题
                </button>
              </div>
            ) : (
              /* VIEW MODE (Phone Simulation) */
              <div className="max-w-[400px] mx-auto bg-surface-1 p-5 rounded-2xl border border-border-default shadow-sm space-y-4">
                <div className="text-center pb-3 border-b border-border-default">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-hover-bg text-text-secondary">
                    体验官事实采集问卷
                  </span>
                  <h4 className="text-[15px] font-bold text-text-main mt-2">{activeProject?.name}</h4>
                  <p className="text-[11px] text-text-tertiary mt-1">请如实填写您的真实体验，AI 将为您生成专属笔记</p>
                </div>

                <div className="space-y-4">
                  {questions.map((q, idx) => (
                    <div key={q.id || idx} className="p-3.5 bg-page-bg rounded-xl border border-border-default/70 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[13px] font-bold text-text-main leading-snug">
                          {q.title}
                        </span>
                        {q.isRequired && (
                          <span className="text-[10px] font-bold text-brand-logo shrink-0">*必填</span>
                        )}
                      </div>

                      {/* Options Render */}
                      {(q.type === '单选' || q.type === '多选') && q.options && (
                        <div className="space-y-1.5 pt-1">
                          {q.options.map((opt, oIdx) => (
                            <div 
                              key={oIdx} 
                              className="px-3 py-2 bg-surface-1 rounded-lg border border-border-default text-[12px] text-text-secondary flex items-center gap-2"
                            >
                              <div className={`w-3 h-3 border border-neutral-300 ${q.type === '单选' ? 'rounded-full' : 'rounded-xs'}`} />
                              <span>{opt}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {q.type === '开放回答' && (
                        <div className="h-16 px-3 py-2 bg-surface-1 rounded-lg border border-border-default text-[12px] text-text-tertiary">
                          请在此输入您的真实使用感受与情况...
                        </div>
                      )}

                      {q.type === '图片/视频上传' && (
                        <div className="h-16 border-2 border-dashed border-border-default rounded-lg flex items-center justify-center text-[11px] text-text-tertiary gap-1 bg-surface-1">
                          <UploadCloud size={16} />
                          <span>点击上传体验照片</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border-default bg-surface-1 flex items-center justify-between shrink-0">
            <span className="text-[12px] text-text-tertiary">
              共 {questions.length} 道问题 · 保存后实时应用于项目 H5 落地页与专属笔记生成
            </span>
            <div className="flex items-center gap-2">
              <button 
                onClick={onClose}
                className="px-4 py-2 border border-border-default text-text-secondary text-[13px] font-bold rounded-xl hover:bg-page-bg transition-colors"
              >
                取消
              </button>
              <button 
                onClick={handleSave}
                className="px-5 py-2 bg-btn-main text-white text-[13px] font-bold rounded-xl hover:bg-btn-main-hover transition-colors flex items-center gap-1.5 shadow-xs"
              >
                {savedSuccess ? (
                  <>
                    <Check size={14} className="text-emerald-400" />
                    <span>已保存并同步</span>
                  </>
                ) : (
                  <span>保存并应用问卷</span>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

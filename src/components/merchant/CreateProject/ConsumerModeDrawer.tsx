import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, Check, Users, HelpCircle, Camera, Clock, Eye, Bell, Sparkles, BookOpen, ShieldCheck, Lock } from "lucide-react";
import { QuestionnaireQuestion, DEFAULT_QUESTIONNAIRE_QUESTIONS } from "../CreateProjectWorkstation";

export interface ConsumerKocConfig {
  recruitmentCount: number;
  packagesPerPerson: number; // 固定1个
  hasQuestionnaire: boolean;
  needPhotos: boolean;
  photoCountRange: string;
  claimValidityDays: number;
  observationDays: number;
  enableWechatNotice: boolean;
  questionnaireQuestions?: QuestionnaireQuestion[];
}

interface ConsumerModeDrawerProps {
  initialConfig: ConsumerKocConfig;
  onSave: (config: ConsumerKocConfig) => void;
  onClose: () => void;
}

export function ConsumerModeDrawer({
  initialConfig,
  onSave,
  onClose,
}: ConsumerModeDrawerProps) {
  const [config, setConfig] = useState<ConsumerKocConfig>({
    ...initialConfig,
    packagesPerPerson: 1, // 固定 1 个
    photoCountRange: initialConfig.photoCountRange || "2—4张现场照片",
    questionnaireQuestions: initialConfig.questionnaireQuestions || DEFAULT_QUESTIONNAIRE_QUESTIONS,
  });

  const [showQuestionsPreview, setShowQuestionsPreview] = useState(false);

  // Generate real-time summary
  const summaryText = `招募 ${config.recruitmentCount} 名消费者，每人领取 1 个内容包；${
    config.hasQuestionnaire ? "填写体验问卷后生成个性化笔记" : "采用标准预设模板"
  }；${
    config.needPhotos ? `需上传 ${config.photoCountRange}` : "无需现场照片"
  }。`;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-btn-main/40 backdrop-blur-xs z-50"
      />
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 220 }}
        className="fixed right-0 top-0 bottom-0 w-full max-w-[580px] bg-[#fafafa] shadow-2xl z-50 flex flex-col border-l border-border-default"
      >
        {/* Header */}
        <div className="p-5 border-b border-border-default bg-surface-1 flex justify-between items-center shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[16px] font-extrabold text-text-main">
                调整消费者KOC分发模式
              </h2>
              <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[13px] font-bold rounded-md">
                KOC真实体验内容包
              </span>
            </div>
            <p className="text-[13px] text-text-tertiary mt-0.5">
              设置体验官招募规模、问卷事实采集、拍摄要求与观察周期
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-text-tertiary hover:text-text-main rounded-xl hover:bg-hover-bg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Real-time Summary Card */}
        <div className="p-4 bg-emerald-50/70 border-b border-emerald-200/80 shrink-0">
          <div className="text-[13px] font-bold text-emerald-800 flex items-center gap-1.5 mb-1">
            <Sparkles size={14} className="text-emerald-600" />
            <span>当前消费者分发规则预览</span>
          </div>
          <p className="text-[13px] font-bold text-emerald-950 leading-relaxed">
            {summaryText}
          </p>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-[13px]">
          
          {/* 1. Recruitment Scale */}
          <div className="bg-surface-1 rounded-xl p-4 border border-border-default shadow-2xs space-y-3">
            <div className="font-bold text-text-main flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Users size={16} className="text-text-tertiary" />
                预计招募体验官/KOC人数
              </span>
              <span className="text-[13px] text-text-tertiary font-normal">生成对应数量内容包占位</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center border border-neutral-300 rounded-xl overflow-hidden bg-page-bg flex-1">
                <button
                  type="button"
                  onClick={() => setConfig(prev => ({ ...prev, recruitmentCount: Math.max(1, prev.recruitmentCount - 1) }))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-selected-bg font-bold text-text-secondary text-[16px] transition-colors"
                >-</button>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={config.recruitmentCount}
                  onChange={(e) => setConfig(prev => ({ ...prev, recruitmentCount: Math.max(1, parseInt(e.target.value) || 1) }))}
                  className="flex-1 text-center font-black text-[16px] text-text-main bg-transparent outline-none"
                />
                <button
                  type="button"
                  onClick={() => setConfig(prev => ({ ...prev, recruitmentCount: prev.recruitmentCount + 1 }))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-selected-bg font-bold text-text-secondary text-[16px] transition-colors"
                >+</button>
              </div>
              <span className="text-[13px] font-bold text-text-secondary">名体验官</span>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-1.5 pt-1">
              {[5, 10, 15, 20, 30].map(cnt => (
                <button
                  key={cnt}
                  type="button"
                  onClick={() => setConfig(prev => ({ ...prev, recruitmentCount: cnt }))}
                  className={`px-3 py-1 rounded-lg text-[13px] font-bold transition-all ${
                    config.recruitmentCount === cnt
                      ? "bg-btn-main text-white"
                      : "bg-hover-bg hover:bg-selected-bg text-text-secondary"
                  }`}
                >
                  {cnt}人
                </button>
              ))}
            </div>

            {/* Fixed 1 package notice */}
            <div className="p-3 bg-page-bg rounded-xl border border-border-default/80 flex items-center justify-between text-[13px]">
              <div className="flex items-center gap-2 text-text-secondary">
                <Lock size={14} className="text-text-tertiary" />
                <span>每人领取内容包数量</span>
              </div>
              <span className="font-bold text-text-main bg-surface-1 px-2.5 py-1 rounded-lg border border-border-default">
                固定 1 个 / 人 (防重复发布机制)
              </span>
            </div>
          </div>

          {/* 2. Questionnaire Toggle & Config */}
          <div className="bg-surface-1 rounded-xl p-4 border border-border-default shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-bold text-text-main flex items-center gap-2">
                  <HelpCircle size={16} className="text-text-tertiary" />
                  是否填写项目问卷
                </div>
                <div className="text-[13px] text-text-tertiary">
                  收集参与者真实换粮背景、排便前后对比及使用感受
                </div>
              </div>
              <input
                type="checkbox"
                checked={config.hasQuestionnaire}
                onChange={(e) => setConfig(prev => ({ ...prev, hasQuestionnaire: e.target.checked }))}
                className="w-5 h-5 accent-neutral-900 rounded cursor-pointer"
              />
            </div>

            {config.hasQuestionnaire && (
              <div className="p-3.5 bg-page-bg rounded-xl border border-border-default space-y-3 text-[13px]">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-text-main">
                    已包含 {config.questionnaireQuestions?.length || 4} 道结构化问卷题目
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowQuestionsPreview(!showQuestionsPreview)}
                    className="text-blue-600 hover:text-blue-800 font-bold hover:underline flex items-center gap-1"
                  >
                    <BookOpen size={13} />
                    {showQuestionsPreview ? "收起题目" : "查看问卷题目"}
                  </button>
                </div>

                {showQuestionsPreview && (
                  <div className="space-y-2 pt-2 border-t border-border-default/80">
                    {(config.questionnaireQuestions || DEFAULT_QUESTIONNAIRE_QUESTIONS).map((q, idx) => (
                      <div key={q.id} className="p-2 bg-surface-1 rounded-lg border border-border-default space-y-1">
                        <div className="font-bold text-text-main">
                          {idx + 1}. {q.title}
                        </div>
                        {q.options && (
                          <div className="text-[13px] text-text-tertiary pl-2">
                            选项：{q.options.join(" / ")}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="text-text-tertiary text-[13px] flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
                  <span>问卷与笔记包强绑定：填写后系统将自动基于问卷答案生成个性化体验笔记。</span>
                </div>
              </div>
            )}
          </div>

          {/* 3. Photo Requirements */}
          <div className="bg-surface-1 rounded-xl p-4 border border-border-default shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-bold text-text-main flex items-center gap-2">
                  <Camera size={16} className="text-text-tertiary" />
                  是否需要现场拍照
                </div>
                <div className="text-[13px] text-text-tertiary">
                  要求消费者上传真实拍摄的现场体验照片或宠物吃粮照片
                </div>
              </div>
              <input
                type="checkbox"
                checked={config.needPhotos}
                onChange={(e) => setConfig(prev => ({ ...prev, needPhotos: e.target.checked }))}
                className="w-5 h-5 accent-neutral-900 rounded cursor-pointer"
              />
            </div>

            {config.needPhotos && (
              <div className="p-3 bg-page-bg rounded-xl border border-border-default space-y-2 text-[13px]">
                <div className="font-bold text-text-main">拍照张数与要求：</div>
                <div className="flex flex-wrap gap-2">
                  {["2—4张现场照片", "3—6张高清实拍图", "1段开袋视频 + 2张照片"].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setConfig(prev => ({ ...prev, photoCountRange: opt }))}
                      className={`px-3 py-1.5 rounded-lg font-bold text-[13px] transition-all ${
                        config.photoCountRange === opt
                          ? "bg-btn-main text-white shadow-2xs"
                          : "bg-surface-1 border border-border-default text-text-secondary hover:bg-hover-bg"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 4. Validity & Observation Period */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface-1 rounded-xl p-4 border border-border-default shadow-2xs space-y-2">
              <div className="font-bold text-text-main flex items-center gap-1.5 text-[13px]">
                <Clock size={15} className="text-text-tertiary" />
                内容包领取有效期
              </div>
              <select
                value={config.claimValidityDays}
                onChange={(e) => setConfig(prev => ({ ...prev, claimValidityDays: parseInt(e.target.value) || 7 }))}
                className="w-full p-2 bg-page-bg border border-neutral-300 rounded-xl font-bold text-text-main outline-none text-[13px]"
              >
                <option value={3}>3 天 (超期自动释放)</option>
                <option value={5}>5 天</option>
                <option value={7}>7 天 (推荐)</option>
                <option value={14}>14 天</option>
              </select>
              <span className="text-[13px] text-text-tertiary block">逾期未领将自动回收入池</span>
            </div>

            <div className="bg-surface-1 rounded-xl p-4 border border-border-default shadow-2xs space-y-2">
              <div className="font-bold text-text-main flex items-center gap-1.5 text-[13px]">
                <Eye size={15} className="text-text-tertiary" />
                发布后观察周期
              </div>
              <select
                value={config.observationDays}
                onChange={(e) => setConfig(prev => ({ ...prev, observationDays: parseInt(e.target.value) || 7 }))}
                className="w-full p-2 bg-page-bg border border-neutral-300 rounded-xl font-bold text-text-main outline-none text-[13px]"
              >
                <option value={7}>7 天 (推荐)</option>
                <option value={14}>14 天</option>
                <option value={21}>21 天</option>
                <option value={30}>30 天</option>
              </select>
              <span className="text-[13px] text-text-tertiary block">用于数据回传与异常预警</span>
            </div>
          </div>

          {/* 5. WeChat Notice & Reward */}
          <div className="bg-surface-1 rounded-xl p-4 border border-border-default shadow-2xs flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-bold text-text-main flex items-center gap-2">
                <Bell size={16} className="text-text-tertiary" />
                启用服务号提醒与打卡激励
              </div>
              <div className="text-[13px] text-text-tertiary">
                通过微信服务号自动推送到期提醒、发文指导与核销奖励
              </div>
            </div>
            <input
              type="checkbox"
              checked={config.enableWechatNotice}
              onChange={(e) => setConfig(prev => ({ ...prev, enableWechatNotice: e.target.checked }))}
              className="w-5 h-5 accent-neutral-900 rounded cursor-pointer"
            />
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border-default bg-surface-1 flex items-center justify-end gap-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-text-secondary font-medium text-[13px] hover:bg-hover-bg rounded-xl transition-colors"
          >
            取消
          </button>
          <button
            type="button"
            onClick={() => {
              onSave(config);
              onClose();
            }}
            className="px-5 py-2 bg-btn-main hover:bg-btn-main-hover text-white font-bold text-[13px] rounded-xl transition-colors shadow-2xs flex items-center gap-1.5"
          >
            <Check size={15} /> 保存消费者分发模式
          </button>
        </div>
      </motion.div>
    </>
  );
}

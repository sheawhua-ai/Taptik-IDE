import React, { useState, useRef } from 'react';
import { 
  X, QrCode, Copy, Check, Download, ExternalLink, Image as ImageIcon, 
  UploadCloud, CheckCircle2, Smartphone, Eye, Edit3, Plus, Trash2, 
  HelpCircle, FileText, Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useProjectStore } from '../../context/ProjectContext';
import { Project } from '../../data/projectStore';
import { ConsumerLandingPageModal } from './ConsumerLandingPageModal';
import { DEFAULT_QUESTIONNAIRE_QUESTIONS } from './CreateProjectWorkstation';
import { ProjectQuestionnaireDrawer } from '../rings/ProjectQuestionnaireDrawer';

interface Props {
  project: Project;
  onClose: () => void;
}

export function LandingPageSettingsModal({ project, onClose }: Props) {
  const { updateLandingPageSettings } = useProjectStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentSettings = project.landingPageSettings || {
    loginMode: "无需登录",
    bannerUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop",
    hasQuestionnaire: true,
    questionnaireQuestions: DEFAULT_QUESTIONNAIRE_QUESTIONS
  };

  const [loginMode, setLoginMode] = useState<"无需登录" | "微信登录">(currentSettings.loginMode);
  const [hasQuestionnaire, setHasQuestionnaire] = useState<boolean>(currentSettings.hasQuestionnaire !== false);
  const [bannerUrl, setBannerUrl] = useState<string>(currentSettings.bannerUrl || "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop");
  
  const [questions, setQuestions] = useState<any[]>(
    currentSettings.questionnaireQuestions && currentSettings.questionnaireQuestions.length > 0
      ? currentSettings.questionnaireQuestions
      : DEFAULT_QUESTIONNAIRE_QUESTIONS
  );

  const [copiedUrl, setCopiedUrl] = useState(false);
  const [showConsumerPreview, setShowConsumerPreview] = useState(false);
  const [showQuestionnaireDrawer, setShowQuestionnaireDrawer] = useState(false);

  const landingPageUrl = `https://tap.topyuncang.com/land/p/${project.id}`;

  const presetBanners = [
    { name: "婚礼宴会", url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop" },
    { name: "宠物养护", url: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&auto=format&fit=crop" },
    { name: "美妆个护", url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop" },
    { name: "餐饮探店", url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop" }
  ];

  const handleCopy = () => {
    navigator.clipboard?.writeText(landingPageUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setBannerUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    updateLandingPageSettings(project.id, {
      loginMode,
      hasQuestionnaire,
      bannerUrl,
      questionnaireQuestions: questions
    });
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-btn-main/40 backdrop-blur-xs p-4 overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          className="bg-surface-1 rounded-xl shadow-xl border border-border-default w-full max-w-4xl overflow-hidden my-auto flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-border-default flex items-center justify-between shrink-0 bg-surface-1">
            <div>
              <h2 className="text-[16px] font-semibold text-text-main flex items-center gap-2">
                <QrCode size={18} className="text-text-secondary" />
                落地页推广设置
              </h2>
              <p className="text-[12px] text-text-tertiary mt-0.5">
                管理源分发平台的访客登录方式、海报与体验问卷；客户端不承载或修改公开落地页内容。
              </p>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 text-text-tertiary hover:text-text-main hover:bg-hover-bg rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 bg-canvas">
            
            {/* Left 2 Columns: Settings Controls */}
            <div className="md:col-span-2 space-y-5">

              {/* Card 0: Consumer Questionnaire */}
              <div className="bg-surface-1 rounded-xl border border-border-default p-5 space-y-3.5">
                <div>
                  <h3 className="text-[14px] font-semibold text-text-main">1. 消费者体验问卷设置</h3>
                  <p className="text-[12px] text-text-tertiary mt-0.5">
                    设置访客在落地页投稿前是否需要填写体验调研问卷（用于提炼真实事实即时生成笔记）。
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Option 1: 包含消费者问卷 */}
                  <div
                    onClick={() => setHasQuestionnaire(true)}
                    className={`p-3.5 rounded-lg border cursor-pointer transition-all flex flex-col justify-between ${
                      hasQuestionnaire
                        ? "border-text-main bg-surface-subtle"
                        : "border-border-default bg-surface-1 hover:border-border-strong"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[13px] font-semibold text-text-main">包含消费者问卷</span>
                      {hasQuestionnaire && (
                        <CheckCircle2 size={16} className="text-text-main" />
                      )}
                    </div>
                    <p className="text-[12px] text-text-secondary leading-relaxed">
                      访客投稿前先回答几道简易体验问卷，AI 提取事实后自动即时生成笔记。
                    </p>
                  </div>

                  {/* Option 2: 不使用问卷 */}
                  <div
                    onClick={() => setHasQuestionnaire(false)}
                    className={`p-3.5 rounded-lg border cursor-pointer transition-all flex flex-col justify-between ${
                      !hasQuestionnaire
                        ? "border-text-main bg-surface-subtle"
                        : "border-border-default bg-surface-1 hover:border-border-strong"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[13px] font-semibold text-text-main">不使用问卷（直接投稿）</span>
                      {!hasQuestionnaire && (
                        <CheckCircle2 size={16} className="text-text-main" />
                      )}
                    </div>
                    <p className="text-[12px] text-text-secondary leading-relaxed">
                      访客跳过问卷环节，直接输入标题、心得并上传体验照片与视频。
                    </p>
                  </div>
                </div>

                {/* View & Edit Questionnaire Actions if enabled */}
                {hasQuestionnaire && (
                  <div className="pt-3 border-t border-border-default flex items-center justify-between gap-3 bg-surface-subtle p-3 rounded-lg border border-border-default">
                    <div className="flex items-center gap-2">
                      <FileText size={15} className="text-text-secondary" />
                      <span className="text-[12px] font-medium text-text-main">
                        已启用问卷模式（当前配置 {questions.length} 道题目）
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowQuestionnaireDrawer(true)}
                      className="px-3.5 py-1.5 bg-surface-1 hover:bg-hover-bg border border-border-default text-text-main text-[12px] font-medium rounded-lg flex items-center gap-1.5 transition-colors"
                    >
                      <Edit3 size={13} className="text-text-secondary" />
                      <span>配置问卷题目与规则</span>
                    </button>
                  </div>
                )}
              </div>
              
              {/* Card 1: Guest Login Mode */}
              <div className="bg-surface-1 rounded-xl border border-border-default p-5 space-y-3.5">
                <div>
                  <h3 className="text-[14px] font-semibold text-text-main">2. 访客登录方式</h3>
                  <p className="text-[12px] text-text-tertiary mt-0.5">
                    设置访客进入源平台落地页后的身份验证方式。
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Option 1: 无需登录 */}
                  <div
                    onClick={() => setLoginMode("无需登录")}
                    className={`p-3.5 rounded-lg border cursor-pointer transition-all flex flex-col justify-between ${
                      loginMode === "无需登录"
                        ? "border-text-main bg-surface-subtle"
                        : "border-border-default bg-surface-1 hover:border-border-strong"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[13px] font-semibold text-text-main">无需登录</span>
                      {loginMode === "无需登录" && (
                        <CheckCircle2 size={16} className="text-text-main" />
                      )}
                    </div>
                    <p className="text-[12px] text-text-secondary leading-relaxed">
                      访客可直接进入投稿流程，无需执行登录或账号绑定。
                    </p>
                  </div>

                  {/* Option 2: 微信登录 */}
                  <div
                    onClick={() => setLoginMode("微信登录")}
                    className={`p-3.5 rounded-lg border cursor-pointer transition-all flex flex-col justify-between ${
                      loginMode === "微信登录"
                        ? "border-text-main bg-surface-subtle"
                        : "border-border-default bg-surface-1 hover:border-border-strong"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[13px] font-semibold text-text-main">微信登录</span>
                      {loginMode === "微信登录" && (
                        <CheckCircle2 size={16} className="text-text-main" />
                      )}
                    </div>
                    <p className="text-[12px] text-text-secondary leading-relaxed">
                      访客需先完成微信授权，发布后记录对应微信与联系人信息。
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 2: Landing Page Poster */}
              <div className="bg-surface-1 rounded-xl border border-border-default p-5 space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h3 className="text-[14px] font-semibold text-text-main">3. 落地页海报</h3>
                    <p className="text-[12px] text-text-tertiary mt-0.5">
                      展示在移动端落地页顶部，建议采用 9:16 比例视觉素材。
                    </p>
                  </div>

                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    accept="image/*" 
                    onChange={handleFileUpload} 
                    className="hidden" 
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-surface-subtle hover:bg-hover-bg border border-border-default text-text-main text-[12px] font-medium rounded-lg flex items-center gap-1.5 transition-colors shrink-0"
                  >
                    <UploadCloud size={14} className="text-text-secondary" />
                    <span>上传自定义图片</span>
                  </button>
                </div>

                <div className="flex items-start gap-4">
                  {/* Poster Preview */}
                  <div className="relative aspect-[9/16] w-28 bg-surface-subtle rounded-lg overflow-hidden border border-border-default group shrink-0">
                    <img src={bannerUrl} alt="Poster" className="w-full h-full object-cover" />
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 bg-btn-main/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 cursor-pointer p-2 text-center text-white text-[11px]"
                    >
                      <UploadCloud size={18} />
                      <span>更换海报</span>
                    </div>
                  </div>

                  {/* Preset Banner Selector */}
                  <div className="flex-1 space-y-2">
                    <label className="block text-[11.5px] font-medium text-text-secondary">
                      或选用官方预设风格海报：
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {presetBanners.map((p, idx) => (
                        <div
                          key={idx}
                          onClick={() => setBannerUrl(p.url)}
                          className={`relative aspect-[9/16] rounded-md overflow-hidden border cursor-pointer transition-all ${
                            bannerUrl === p.url ? "border-text-main ring-1 ring-text-main" : "border-border-default opacity-70 hover:opacity-100"
                          }`}
                        >
                          <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
                          <span className="absolute bottom-0 inset-x-0 bg-btn-main/80 text-white text-[9.5px] text-center py-0.5 font-normal">
                            {p.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Landing Page QR Code & Link Card */}
            <div className="bg-surface-1 rounded-xl border border-border-default p-5 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[14px] font-semibold text-text-main">源平台落地页</h3>
                  <span className="px-2 py-0.5 bg-surface-subtle border border-border-default text-text-secondary rounded text-[11px] font-normal">
                    已生成
                  </span>
                </div>

                <div className="text-[12.5px] font-medium text-text-main line-clamp-2 mb-4">
                  {project.name}
                </div>

                {/* QR Code Container */}
                <div className="bg-surface-subtle rounded-lg p-4 border border-border-default text-center flex flex-col items-center">
                  <div className="w-36 h-36 bg-surface-1 rounded-lg p-2.5 border border-border-default mb-3 flex items-center justify-center">
                    <svg className="w-full h-full text-text-main" viewBox="0 0 100 100" fill="currentColor">
                      <path d="M0,0 H35 V35 H0 Z M5,5 V30 H30 V5 Z M10,10 H25 V25 H10 Z" />
                      <path d="M65,0 H100 V35 H65 Z M70,5 V30 H95 V5 Z M75,10 H90 V25 H75 Z" />
                      <path d="M0,65 H35 V100 H0 Z M5,70 V95 H30 V70 Z M10,75 H25 V90 H10 Z" />
                      <rect x="40" y="5" width="8" height="8" />
                      <rect x="52" y="5" width="8" height="8" />
                      <rect x="40" y="20" width="16" height="8" />
                      <rect x="40" y="35" width="8" height="15" />
                      <rect x="52" y="40" width="8" height="8" />
                      <rect x="15" y="45" width="20" height="8" />
                      <rect x="65" y="45" width="30" height="8" />
                      <rect x="45" y="60" width="10" height="20" />
                      <rect x="60" y="60" width="15" height="10" />
                      <rect x="80" y="60" width="15" height="15" />
                      <rect x="60" y="75" width="10" height="20" />
                      <rect x="75" y="80" width="20" height="15" />
                    </svg>
                  </div>

                  <div className="w-full flex items-center justify-between gap-1.5 bg-surface-1 border border-border-default rounded-md px-2.5 py-1.5 mb-2 text-[11px] font-mono text-text-secondary">
                    <span className="truncate">{landingPageUrl}</span>
                    <button 
                      onClick={handleCopy}
                      className="text-text-tertiary hover:text-text-main shrink-0"
                    >
                      {copiedUrl ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                    </button>
                  </div>

                  <button
                    onClick={handleCopy}
                    className="w-full py-2 bg-surface-1 hover:bg-hover-bg border border-border-default text-text-main rounded-md text-[12px] font-medium transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Download size={14} className="text-text-secondary" />
                    <span>下载二维码</span>
                  </button>
                </div>
              </div>

              {/* Preview Consumer Landing Page Button */}
              <div className="pt-3 border-t border-border-default">
                <button
                  onClick={() => setShowConsumerPreview(true)}
                  className="w-full py-2 bg-surface-subtle hover:bg-hover-bg border border-border-default text-text-main font-medium rounded-lg text-[12px] transition-colors flex items-center justify-center gap-1.5"
                >
                  <Smartphone size={14} className="text-text-secondary" />
                  <span>预览消费者落地页</span>
                </button>
              </div>
            </div>

          </div>

          {/* Footer Bar */}
          <div className="px-6 py-4 border-t border-border-default flex items-center justify-between bg-surface-1 shrink-0">
            <span className="text-[12px] text-text-tertiary">
              设置完成后，扫描二维码即可实时预览并体验消费者视角投稿。
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-border-default rounded-lg text-[12.5px] font-medium text-text-secondary hover:bg-hover-bg transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2 bg-btn-main text-white rounded-lg text-[12.5px] font-medium hover:bg-btn-main-hover transition-colors"
              >
                保存设置
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Unified Project Questionnaire Drawer */}
      {showQuestionnaireDrawer && (
        <ProjectQuestionnaireDrawer
          project={{
            ...project,
            landingPageSettings: {
              ...currentSettings,
              loginMode,
              bannerUrl,
              hasQuestionnaire,
              questionnaireQuestions: questions
            }
          }}
          onSaved={(newQuestions) => {
            setQuestions(newQuestions);
          }}
          onClose={() => setShowQuestionnaireDrawer(false)}
        />
      )}

      {/* Consumer Landing Page Mobile Simulator */}
      {showConsumerPreview && (
        <ConsumerLandingPageModal
          project={{
            ...project,
            landingPageSettings: {
              loginMode,
              bannerUrl,
              hasQuestionnaire,
              questionnaireQuestions: questions
            }
          }}
          onClose={() => setShowConsumerPreview(false)}
        />
      )}
    </>
  );
}

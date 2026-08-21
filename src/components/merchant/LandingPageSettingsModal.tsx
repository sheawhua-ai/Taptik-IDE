import React, { useState, useRef } from 'react';
import { 
  X, QrCode, Copy, Check, Download, ExternalLink, Image as ImageIcon, 
  UploadCloud, ShieldCheck, CheckCircle2, Sparkles, Smartphone,
  Eye, Edit3, Plus, Trash2, HelpCircle, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
  
  // Unified Questionnaire Drawer
  const [showQuestionnaireDrawer, setShowQuestionnaireDrawer] = useState(false);
  const [questionnaireDrawerTab, setQuestionnaireDrawerTab] = useState<'view' | 'edit'>('edit');

  const landingPageUrl = `https://tap.topyuncang.com/land/p/${project.id}`;

  const presetBanners = [
    { name: "婚礼宴会风", url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop" },
    { name: "宠物养护风", url: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&auto=format&fit=crop" },
    { name: "美妆护肤风", url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop" },
    { name: "餐饮试吃风", url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop" }
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

  const openQuestionnaireModal = (tab: 'view' | 'edit') => {
    setQuestionnaireDrawerTab(tab);
    setShowQuestionnaireDrawer(true);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-btn-main/50 backdrop-blur-xs p-4 overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="bg-surface-1 rounded-xl shadow-2xl border border-border-default w-full max-w-4xl overflow-hidden my-auto flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-border-default flex items-center justify-between shrink-0 bg-surface-1">
            <div>
              <h2 className="text-[17px] font-bold text-text-main flex items-center gap-2">
                <QrCode size={20} className="text-text-secondary" />
                落地页设置
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
          <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 bg-surface-2">
            
            {/* Left 2 Columns: Settings Controls */}
            <div className="md:col-span-2 space-y-6">

              {/* Card 0: Consumer Questionnaire */}
              <div className="bg-surface-1 rounded-xl border border-border-default/90 shadow-2xs p-5">
                <div className="mb-3">
                  <h3 className="text-[14px] font-bold text-text-main">消费者问卷设置</h3>
                  <p className="text-[12px] text-text-tertiary mt-0.5">
                    设置访客在落地页投稿前是否需要填写体验调研问卷（用于提取事实定向生成个性化笔记）。
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  {/* Option 1: 包含消费者问卷 */}
                  <div
                    onClick={() => setHasQuestionnaire(true)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                      hasQuestionnaire
                        ? "border-neutral-900 bg-btn-main/5 shadow-2xs"
                        : "border-border-default bg-surface-1 hover:border-neutral-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[13px] font-bold text-text-main">包含消费者问卷</span>
                      {hasQuestionnaire && (
                        <CheckCircle2 size={16} className="text-text-main" />
                      )}
                    </div>
                    <p className="text-[12px] text-text-tertiary leading-relaxed">
                      访客投稿前需先回答几道简易体验问卷，AI提取事实后自动即时生成笔记。
                    </p>
                  </div>

                  {/* Option 2: 不使用问卷 */}
                  <div
                    onClick={() => setHasQuestionnaire(false)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                      !hasQuestionnaire
                        ? "border-neutral-900 bg-btn-main/5 shadow-2xs"
                        : "border-border-default bg-surface-1 hover:border-neutral-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[13px] font-bold text-text-main">不使用问卷（直接投稿）</span>
                      {!hasQuestionnaire && (
                        <CheckCircle2 size={16} className="text-text-main" />
                      )}
                    </div>
                    <p className="text-[12px] text-text-tertiary leading-relaxed">
                      访客跳过问卷环节，直接填写标题、心得并上传照片与视频素材。
                    </p>
                  </div>
                </div>

                {/* View & Edit Questionnaire Actions if enabled */}
                {hasQuestionnaire && (
                  <div className="mt-4 pt-4 border-t border-border-default flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-page-bg/80 p-3.5 rounded-xl border border-border-default/80">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[12px] font-bold text-text-main">
                        已开启问卷模式（共 {questions.length} 个问卷问题）
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => openQuestionnaireModal('view')}
                        className="px-3.5 py-1.5 bg-surface-1 border border-border-default hover:bg-hover-bg text-text-main text-[12px] font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
                      >
                        <Eye size={14} className="text-text-secondary" />
                        <span>查看问卷</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => openQuestionnaireModal('edit')}
                        className="px-3.5 py-1.5 bg-btn-main hover:bg-black text-white text-[12px] font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
                      >
                        <Edit3 size={14} />
                        <span>编辑问卷</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Card 1: Guest Login Mode */}
              <div className="bg-surface-1 rounded-xl border border-border-default/90 shadow-2xs p-5">
                <div className="mb-3">
                  <h3 className="text-[14px] font-bold text-text-main">访客登录方式</h3>
                  <p className="text-[12px] text-text-tertiary mt-0.5">
                    设置访客进入源平台落地页后的身份验证方式。
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  {/* Option 1: 无需登录 */}
                  <div
                    onClick={() => setLoginMode("无需登录")}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                      loginMode === "无需登录"
                        ? "border-neutral-900 bg-btn-main/5 shadow-2xs"
                        : "border-border-default bg-surface-1 hover:border-neutral-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[13px] font-bold text-text-main">无需登录</span>
                      {loginMode === "无需登录" && (
                        <CheckCircle2 size={16} className="text-text-main" />
                      )}
                    </div>
                    <p className="text-[12px] text-text-tertiary leading-relaxed">
                      访客可直接进入投稿流程，无需执行登录。
                    </p>
                  </div>

                  {/* Option 2: 微信登录 */}
                  <div
                    onClick={() => setLoginMode("微信登录")}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                      loginMode === "微信登录"
                        ? "border-neutral-900 bg-btn-main/5 shadow-2xs"
                        : "border-border-default bg-surface-1 hover:border-neutral-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[13px] font-bold text-text-main">微信登录</span>
                      {loginMode === "微信登录" && (
                        <CheckCircle2 size={16} className="text-text-main" />
                      )}
                    </div>
                    <p className="text-[12px] text-text-tertiary leading-relaxed">
                      访客需先完成微信授权，发布后记录对应微信信息。
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 2: Landing Page Poster */}
              <div className="bg-surface-1 rounded-xl border border-border-default/90 shadow-2xs p-5">
                <div className="mb-4 flex items-center justify-between gap-2">
                  <div>
                    <h3 className="text-[14px] font-bold text-text-main">落地页海报</h3>
                    <p className="text-[12px] text-text-tertiary mt-0.5">
                      展示在落地页，建议采用手机一屏尺寸（750 × 1334 px 或 9:16比例）。
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
                    className="px-3.5 py-1.5 bg-btn-main hover:bg-black text-white text-[12px] font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs shrink-0"
                  >
                    <UploadCloud size={15} />
                    <span>上传图片</span>
                  </button>
                </div>

                {/* Mobile Screen Ratio Preview Box */}
                <div className="relative aspect-[9/16] max-w-[200px] mx-auto bg-hover-bg rounded-xl overflow-hidden border border-border-default group mb-4 shadow-sm">
                  <img src={bannerUrl} alt="Poster" className="w-full h-full object-cover" />
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-btn-main/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 cursor-pointer p-4 text-center"
                  >
                    <UploadCloud size={24} className="text-white" />
                    <span className="px-3 py-1 bg-surface-1 text-text-main rounded-lg text-[11px] font-bold shadow-xs">
                      点击更换海报 (9:16)
                    </span>
                  </div>
                </div>

                {/* Preset Banner Selector */}
                <div>
                  <label className="block text-[11px] font-bold text-text-tertiary mb-2">
                    或选择预设海报模板
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {presetBanners.map((p, idx) => (
                      <div
                        key={idx}
                        onClick={() => setBannerUrl(p.url)}
                        className={`relative aspect-[9/16] rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                          bannerUrl === p.url ? "border-neutral-900 ring-2 ring-neutral-900/10" : "border-border-default opacity-70 hover:opacity-100"
                        }`}
                      >
                        <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
                        <span className="absolute bottom-0 inset-x-0 bg-btn-main/70 text-white text-[9px] text-center py-0.5 font-medium">
                          {p.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Landing Page QR Code & Link Card */}
            <div className="bg-surface-1 rounded-xl border border-border-default/90 shadow-2xs p-5 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[14px] font-bold text-text-main">源平台落地页</h3>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px] font-bold">
                    已生成
                  </span>
                </div>

                <div className="text-[12px] font-bold text-text-main line-clamp-2 mb-4">
                  {project.name}
                </div>

                {/* QR Code Container */}
                <div className="bg-page-bg rounded-xl p-4 border border-border-default/80 text-center flex flex-col items-center">
                  <div className="w-36 h-36 bg-surface-1 rounded-xl p-2.5 border border-border-default shadow-2xs mb-3 flex items-center justify-center">
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

                  <div className="w-full flex items-center justify-between gap-1.5 bg-surface-1 border border-border-default rounded-xl px-2.5 py-1.5 mb-2 text-[11px] font-mono text-text-secondary">
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
                    className="w-full py-2 bg-btn-main text-white rounded-xl text-[12px] font-bold hover:bg-btn-main-hover transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <Download size={14} />
                    <span>下载二维码</span>
                  </button>
                </div>
              </div>

              {/* Preview Consumer Landing Page Button */}
              <div className="pt-4 border-t border-border-default space-y-2">
                <button
                  onClick={() => setShowConsumerPreview(true)}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-[12px] transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <Smartphone size={15} />
                  <span>预览/测试消费者落地页</span>
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
                className="px-4 py-2 border border-border-default rounded-xl text-[13px] font-bold text-text-secondary hover:bg-hover-bg transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-btn-main text-white rounded-xl text-[13px] font-bold hover:bg-btn-main-hover transition-colors shadow-xs"
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
          initialTab={questionnaireDrawerTab}
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


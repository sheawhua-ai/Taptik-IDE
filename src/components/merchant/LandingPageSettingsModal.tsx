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
  
  // Questionnaire View / Edit Modal
  const [showQuestionnaireModal, setShowQuestionnaireModal] = useState(false);
  const [questionnaireActiveTab, setQuestionnaireActiveTab] = useState<'view' | 'edit'>('view');
  const [editingQuestions, setEditingQuestions] = useState<any[]>(questions);

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
    setEditingQuestions(JSON.parse(JSON.stringify(questions)));
    setQuestionnaireActiveTab(tab);
    setShowQuestionnaireModal(true);
  };

  const saveQuestionnaireEdits = () => {
    setQuestions(editingQuestions);
    setShowQuestionnaireModal(false);
  };

  const addQuestion = () => {
    const newId = `q_${Date.now()}`;
    setEditingQuestions([
      ...editingQuestions,
      {
        id: newId,
        title: `${editingQuestions.length + 1}. 新增加体验问题`,
        type: "开放回答",
        isRequired: true
      }
    ]);
  };

  const removeQuestion = (id: string) => {
    setEditingQuestions(editingQuestions.filter(q => q.id !== id));
  };

  const updateQuestionField = (id: string, field: string, value: any) => {
    setEditingQuestions(editingQuestions.map(q => {
      if (q.id === id) {
        return { ...q, [field]: value };
      }
      return q;
    }));
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/50 backdrop-blur-xs p-4 overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="bg-white rounded-2xl shadow-2xl border border-neutral-200 w-full max-w-4xl overflow-hidden my-auto flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between shrink-0 bg-white">
            <div>
              <h2 className="text-[17px] font-bold text-neutral-900 flex items-center gap-2">
                <QrCode size={20} className="text-neutral-700" />
                落地页设置
              </h2>
              <p className="text-[12px] text-neutral-500 mt-0.5">
                管理源分发平台的访客登录方式、海报与体验问卷；客户端不承载或修改公开落地页内容。
              </p>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 bg-neutral-50/40">
            
            {/* Left 2 Columns: Settings Controls */}
            <div className="md:col-span-2 space-y-6">

              {/* Card 0: Consumer Questionnaire */}
              <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-2xs p-5">
                <div className="mb-3">
                  <h3 className="text-[14px] font-bold text-neutral-900">消费者问卷设置</h3>
                  <p className="text-[12px] text-neutral-500 mt-0.5">
                    设置访客在落地页投稿前是否需要填写体验调研问卷（用于提取事实定向生成个性化笔记）。
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  {/* Option 1: 包含消费者问卷 */}
                  <div
                    onClick={() => setHasQuestionnaire(true)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                      hasQuestionnaire
                        ? "border-neutral-900 bg-neutral-900/5 shadow-2xs"
                        : "border-neutral-200 bg-white hover:border-neutral-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[13px] font-bold text-neutral-900">包含消费者问卷</span>
                      {hasQuestionnaire && (
                        <CheckCircle2 size={16} className="text-neutral-900" />
                      )}
                    </div>
                    <p className="text-[12px] text-neutral-500 leading-relaxed">
                      访客投稿前需先回答几道简易体验问卷，AI提取事实后自动即时生成笔记。
                    </p>
                  </div>

                  {/* Option 2: 不使用问卷 */}
                  <div
                    onClick={() => setHasQuestionnaire(false)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                      !hasQuestionnaire
                        ? "border-neutral-900 bg-neutral-900/5 shadow-2xs"
                        : "border-neutral-200 bg-white hover:border-neutral-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[13px] font-bold text-neutral-900">不使用问卷（直接投稿）</span>
                      {!hasQuestionnaire && (
                        <CheckCircle2 size={16} className="text-neutral-900" />
                      )}
                    </div>
                    <p className="text-[12px] text-neutral-500 leading-relaxed">
                      访客跳过问卷环节，直接填写标题、心得并上传照片与视频素材。
                    </p>
                  </div>
                </div>

                {/* View & Edit Questionnaire Actions if enabled */}
                {hasQuestionnaire && (
                  <div className="mt-4 pt-4 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-50/80 p-3.5 rounded-xl border border-neutral-200/80">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[12px] font-bold text-neutral-800">
                        已开启问卷模式（共 {questions.length} 个问卷问题）
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => openQuestionnaireModal('view')}
                        className="px-3.5 py-1.5 bg-white border border-neutral-200 hover:bg-neutral-100 text-neutral-800 text-[12px] font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
                      >
                        <Eye size={14} className="text-neutral-600" />
                        <span>查看问卷</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => openQuestionnaireModal('edit')}
                        className="px-3.5 py-1.5 bg-neutral-900 hover:bg-black text-white text-[12px] font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
                      >
                        <Edit3 size={14} />
                        <span>编辑问卷</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Card 1: Guest Login Mode */}
              <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-2xs p-5">
                <div className="mb-3">
                  <h3 className="text-[14px] font-bold text-neutral-900">访客登录方式</h3>
                  <p className="text-[12px] text-neutral-500 mt-0.5">
                    设置访客进入源平台落地页后的身份验证方式。
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  {/* Option 1: 无需登录 */}
                  <div
                    onClick={() => setLoginMode("无需登录")}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                      loginMode === "无需登录"
                        ? "border-neutral-900 bg-neutral-900/5 shadow-2xs"
                        : "border-neutral-200 bg-white hover:border-neutral-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[13px] font-bold text-neutral-900">无需登录</span>
                      {loginMode === "无需登录" && (
                        <CheckCircle2 size={16} className="text-neutral-900" />
                      )}
                    </div>
                    <p className="text-[12px] text-neutral-500 leading-relaxed">
                      访客可直接进入投稿流程，无需执行登录。
                    </p>
                  </div>

                  {/* Option 2: 微信登录 */}
                  <div
                    onClick={() => setLoginMode("微信登录")}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                      loginMode === "微信登录"
                        ? "border-neutral-900 bg-neutral-900/5 shadow-2xs"
                        : "border-neutral-200 bg-white hover:border-neutral-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[13px] font-bold text-neutral-900">微信登录</span>
                      {loginMode === "微信登录" && (
                        <CheckCircle2 size={16} className="text-neutral-900" />
                      )}
                    </div>
                    <p className="text-[12px] text-neutral-500 leading-relaxed">
                      访客需先完成微信授权，发布后记录对应微信信息。
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 2: Landing Page Poster */}
              <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-2xs p-5">
                <div className="mb-4 flex items-center justify-between gap-2">
                  <div>
                    <h3 className="text-[14px] font-bold text-neutral-900">落地页海报</h3>
                    <p className="text-[12px] text-neutral-500 mt-0.5">
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
                    className="px-3.5 py-1.5 bg-neutral-900 hover:bg-black text-white text-[12px] font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs shrink-0"
                  >
                    <UploadCloud size={15} />
                    <span>上传图片</span>
                  </button>
                </div>

                {/* Mobile Screen Ratio Preview Box */}
                <div className="relative aspect-[9/16] max-w-[200px] mx-auto bg-neutral-100 rounded-2xl overflow-hidden border border-neutral-200 group mb-4 shadow-sm">
                  <img src={bannerUrl} alt="Poster" className="w-full h-full object-cover" />
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-neutral-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 cursor-pointer p-4 text-center"
                  >
                    <UploadCloud size={24} className="text-white" />
                    <span className="px-3 py-1 bg-white text-neutral-900 rounded-lg text-[11px] font-bold shadow-xs">
                      点击更换海报 (9:16)
                    </span>
                  </div>
                </div>

                {/* Preset Banner Selector */}
                <div>
                  <label className="block text-[11px] font-bold text-neutral-500 mb-2">
                    或选择预设海报模板
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {presetBanners.map((p, idx) => (
                      <div
                        key={idx}
                        onClick={() => setBannerUrl(p.url)}
                        className={`relative aspect-[9/16] rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                          bannerUrl === p.url ? "border-neutral-900 ring-2 ring-neutral-900/10" : "border-neutral-200 opacity-70 hover:opacity-100"
                        }`}
                      >
                        <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
                        <span className="absolute bottom-0 inset-x-0 bg-neutral-900/70 text-white text-[9px] text-center py-0.5 font-medium">
                          {p.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Landing Page QR Code & Link Card */}
            <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-2xs p-5 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[14px] font-bold text-neutral-900">源平台落地页</h3>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px] font-bold">
                    已生成
                  </span>
                </div>

                <div className="text-[12px] font-bold text-neutral-800 line-clamp-2 mb-4">
                  {project.name}
                </div>

                {/* QR Code Container */}
                <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200/80 text-center flex flex-col items-center">
                  <div className="w-36 h-36 bg-white rounded-xl p-2.5 border border-neutral-200 shadow-2xs mb-3 flex items-center justify-center">
                    <svg className="w-full h-full text-neutral-900" viewBox="0 0 100 100" fill="currentColor">
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

                  <div className="w-full flex items-center justify-between gap-1.5 bg-white border border-neutral-200 rounded-xl px-2.5 py-1.5 mb-2 text-[11px] font-mono text-neutral-600">
                    <span className="truncate">{landingPageUrl}</span>
                    <button 
                      onClick={handleCopy}
                      className="text-neutral-500 hover:text-neutral-900 shrink-0"
                    >
                      {copiedUrl ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                    </button>
                  </div>

                  <button
                    onClick={handleCopy}
                    className="w-full py-2 bg-neutral-900 text-white rounded-xl text-[12px] font-bold hover:bg-neutral-800 transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <Download size={14} />
                    <span>下载二维码</span>
                  </button>
                </div>
              </div>

              {/* Preview Consumer Landing Page Button */}
              <div className="pt-4 border-t border-neutral-100 space-y-2">
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
          <div className="px-6 py-4 border-t border-neutral-200 flex items-center justify-between bg-white shrink-0">
            <span className="text-[12px] text-neutral-500">
              设置完成后，扫描二维码即可实时预览并体验消费者视角投稿。
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-neutral-200 rounded-xl text-[13px] font-bold text-neutral-600 hover:bg-neutral-100 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-neutral-900 text-white rounded-xl text-[13px] font-bold hover:bg-neutral-800 transition-colors shadow-xs"
              >
                保存设置
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Questionnaire View / Edit Modal */}
      {showQuestionnaireModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-neutral-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-2xl border border-neutral-200 w-full max-w-2xl overflow-hidden flex flex-col my-auto max-h-[88vh]"
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between shrink-0 bg-white">
              <div>
                <h3 className="text-[16px] font-bold text-neutral-900 flex items-center gap-2">
                  <FileText size={18} className="text-neutral-700" />
                  消费者体验问卷 ({editingQuestions.length}题)
                </h3>
                <p className="text-[12px] text-neutral-500 mt-0.5">
                  面向落地页访客的事实采集问卷，AI将提取回答事实定向生成个性化表达
                </p>
              </div>
              <button 
                onClick={() => setShowQuestionnaireModal(false)}
                className="p-1.5 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Mode Switch Tabs */}
            <div className="px-6 pt-3 bg-neutral-50/80 border-b border-neutral-200 flex items-center gap-2 shrink-0">
              <button
                onClick={() => setQuestionnaireActiveTab('view')}
                className={`px-4 py-2 text-[13px] font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
                  questionnaireActiveTab === 'view'
                    ? "border-neutral-900 text-neutral-900"
                    : "border-transparent text-neutral-500 hover:text-neutral-800"
                }`}
              >
                <Eye size={15} />
                <span>查看问卷 (模拟填报视角)</span>
              </button>
              <button
                onClick={() => setQuestionnaireActiveTab('edit')}
                className={`px-4 py-2 text-[13px] font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
                  questionnaireActiveTab === 'edit'
                    ? "border-neutral-900 text-neutral-900"
                    : "border-transparent text-neutral-500 hover:text-neutral-800"
                }`}
              >
                <Edit3 size={15} />
                <span>编辑问卷题目</span>
              </button>
            </div>

            {/* Tab Content Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4 bg-neutral-50/40">
              {questionnaireActiveTab === 'view' ? (
                /* VIEW MODE: Phone fill preview */
                <div className="space-y-4 max-w-md mx-auto bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs">
                  <div className="text-center pb-3 border-b border-neutral-100">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      体验官事实采集表
                    </span>
                    <h4 className="text-[14px] font-bold text-neutral-900 mt-2">{project.name}</h4>
                  </div>

                  {editingQuestions.map((q, idx) => (
                    <div key={q.id || idx} className="p-3.5 bg-neutral-50/80 rounded-xl border border-neutral-200/70 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[13px] font-bold text-neutral-900 leading-snug">
                          {q.title}
                        </span>
                        <div className="flex items-center gap-1 shrink-0">
                          {q.isRequired ? (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 bg-rose-50 text-rose-600 rounded">
                              必填
                            </span>
                          ) : (
                            <span className="text-[10px] font-medium px-1.5 py-0.5 bg-neutral-100 text-neutral-500 rounded">
                              选填
                            </span>
                          )}
                          <span className="text-[10px] bg-white border border-neutral-200 text-neutral-600 px-1.5 py-0.5 rounded">
                            {q.type}
                          </span>
                        </div>
                      </div>

                      {/* Mock Input Placeholder */}
                      <div className="pt-1">
                        {q.type.includes("图片") ? (
                          <div className="h-16 border-2 border-dashed border-neutral-200 rounded-lg flex items-center justify-center text-[11px] text-neutral-400 gap-1 bg-white">
                            <UploadCloud size={16} />
                            <span>上传图片/视频凭证</span>
                          </div>
                        ) : (
                          <div className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-[12px] text-neutral-400">
                            请填写或勾选你的真实体验...
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* EDIT MODE: Add/Edit/Delete Questions */
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                    <span className="text-[12px] font-bold text-neutral-600">题目列表及配置</span>
                    <button
                      onClick={addQuestion}
                      className="px-3 py-1.5 bg-neutral-900 hover:bg-black text-white text-[12px] font-bold rounded-xl flex items-center gap-1 transition-colors shadow-2xs"
                    >
                      <Plus size={14} />
                      <span>添加题目</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {editingQuestions.map((q, idx) => (
                      <div key={q.id || idx} className="p-4 bg-white rounded-xl border border-neutral-200 shadow-2xs space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[12px] font-bold text-neutral-400">问题 {idx + 1}</span>
                          <button
                            onClick={() => removeQuestion(q.id)}
                            className="p-1 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                            title="删除此题"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>

                        <div>
                          <input
                            type="text"
                            value={q.title}
                            onChange={(e) => updateQuestionField(q.id, 'title', e.target.value)}
                            className="w-full px-3 py-1.5 border border-neutral-200 rounded-lg text-[13px] font-bold text-neutral-900 outline-none focus:border-neutral-400"
                            placeholder="输入问题名称..."
                          />
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-neutral-100">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold text-neutral-500">题型：</span>
                            <select
                              value={q.type}
                              onChange={(e) => updateQuestionField(q.id, 'type', e.target.value)}
                              className="px-2.5 py-1 border border-neutral-200 rounded-lg text-[12px] font-medium outline-none bg-neutral-50"
                            >
                              <option value="单选＋补充说明">单选＋补充说明</option>
                              <option value="多选＋开放回答">多选＋开放回答</option>
                              <option value="开放回答">开放回答</option>
                              <option value="图片/视频上传">图片/视频上传</option>
                            </select>
                          </div>

                          <label className="flex items-center gap-1.5 cursor-pointer text-[12px] font-bold text-neutral-700">
                            <input
                              type="checkbox"
                              checked={q.isRequired}
                              onChange={(e) => updateQuestionField(q.id, 'isRequired', e.target.checked)}
                              className="rounded border-neutral-300 text-neutral-900 focus:ring-0"
                            />
                            <span>必填项</span>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-neutral-200 flex items-center justify-between bg-white shrink-0">
              <span className="text-[12px] text-neutral-500">
                修改完成后点击“保存问卷”即可生效
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowQuestionnaireModal(false)}
                  className="px-4 py-2 border border-neutral-200 rounded-xl text-[13px] font-bold text-neutral-600 hover:bg-neutral-100 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={saveQuestionnaireEdits}
                  className="px-5 py-2 bg-neutral-900 text-white rounded-xl text-[13px] font-bold hover:bg-neutral-800 transition-colors shadow-xs"
                >
                  保存问卷
                </button>
              </div>
            </div>
          </motion.div>
        </div>
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


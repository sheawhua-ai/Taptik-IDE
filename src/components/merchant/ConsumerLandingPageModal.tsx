import React, { useState } from 'react';
import { 
  X, Smartphone, QrCode, CheckCircle2, Upload, Image as ImageIcon, 
  Sparkles, ShieldCheck, Heart, Send, ExternalLink, Copy, Check, MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProjectStore } from '../../context/ProjectContext';
import { Project } from '../../data/projectStore';

interface Props {
  project: Project;
  onClose: () => void;
}

export function ConsumerLandingPageModal({ project, onClose }: Props) {
  const { addConsumerSubmission } = useProjectStore();
  const settings = project.landingPageSettings || {
    loginMode: "无需登录",
    posterTitle: `${project.name} - 体验官内容投稿`,
    bannerUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop"
  };

  const [isWechatLoggedIn, setIsWechatLoggedIn] = useState(settings.loginMode === "无需登录");
  const [nickname, setNickname] = useState('');
  const [contentType, setContentType] = useState('体验笔记与试用心得');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [contact, setContact] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop"
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const landingPageUrl = `https://tap.topyuncang.com/land/p/${project.id}`;

  const sampleBanners = [
    "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=800&auto=format&fit=crop"
  ];

  const handleCopyUrl = () => {
    navigator.clipboard?.writeText(landingPageUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      addConsumerSubmission(project.id, {
        nickname: nickname || "扫码体验官",
        contentType,
        title,
        body,
        images: selectedImages,
        contact
      });
      setIsSubmitting(false);
      setSubmittedSuccess(true);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl border border-neutral-200 w-full max-w-4xl overflow-hidden flex flex-col md:flex-row my-auto max-h-[92vh]"
      >
        {/* Left Side: QR Code & Operator Control Summary */}
        <div className="w-full md:w-80 bg-neutral-900 text-white p-6 flex flex-col justify-between shrink-0 border-r border-neutral-800">
          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase flex items-center gap-1.5">
                <Smartphone size={14} className="text-emerald-400" />
                消费者扫码落地页
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                实时模拟
              </span>
            </div>

            <h2 className="text-[17px] font-bold text-white mb-2 leading-snug">
              {project.name}
            </h2>
            <p className="text-[12px] text-neutral-400 leading-relaxed mb-6">
              消费者扫码后直接打开此落地页，按照配置的验证方式提交体验笔记或活动图文素材。
            </p>

            {/* QR Code Canvas Mock */}
            <div className="bg-white rounded-2xl p-4 text-center mb-6 shadow-inner text-neutral-900 flex flex-col items-center">
              <div className="w-40 h-40 bg-neutral-100 rounded-xl p-2 flex items-center justify-center border border-neutral-200 mb-3 relative group">
                {/* SVG QR Code Pattern */}
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
                <div className="absolute inset-0 bg-neutral-900/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-[10px] font-bold bg-white text-neutral-900 px-2 py-1 rounded shadow-xs">Scan to test</span>
                </div>
              </div>
              
              <div className="text-[11px] font-mono text-neutral-500 truncate w-full mb-2">
                {landingPageUrl}
              </div>

              <button 
                onClick={handleCopyUrl}
                className="w-full py-2 bg-neutral-100 hover:bg-neutral-200 rounded-xl text-[12px] font-bold text-neutral-800 transition-colors flex items-center justify-center gap-1.5"
              >
                {copiedUrl ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                <span>{copiedUrl ? "已复制链接" : "复制落地页链接"}</span>
              </button>
            </div>

            <div className="space-y-2 text-[12px]">
              <div className="flex justify-between text-neutral-400">
                <span>登录方式：</span>
                <span className="text-white font-medium">{settings.loginMode}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>关联项目：</span>
                <span className="text-emerald-400 font-medium truncate max-w-[140px]">{project.name}</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-neutral-800 mt-6">
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl text-[13px] font-medium transition-colors"
            >
              关闭预览
            </button>
          </div>
        </div>

        {/* Right Side: Simulated Phone Screen Container */}
        <div className="flex-1 bg-neutral-100 p-4 md:p-8 flex items-center justify-center overflow-y-auto">
          {/* Phone Frame */}
          <div className="w-full max-w-[375px] bg-white rounded-[36px] shadow-2xl border-[6px] border-neutral-900 overflow-hidden flex flex-col relative min-h-[640px] max-h-[720px] my-auto">
            
            {/* Phone Status Bar */}
            <div className="bg-neutral-900 text-white px-6 py-1.5 flex justify-between items-center text-[10px] shrink-0 font-mono">
              <span>9:41</span>
              <div className="w-16 h-3 bg-neutral-800 rounded-full mx-auto my-0.5" />
              <span>5G 100%</span>
            </div>

            {/* App Header Bar */}
            <div className="bg-white border-b border-neutral-100 px-4 py-2.5 flex items-center justify-between shrink-0 shadow-2xs z-10">
              <span className="text-[13px] font-bold text-neutral-900 truncate max-w-[220px]">
                {settings.posterTitle || project.name}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-600 border border-rose-200">
                品牌官方招募
              </span>
            </div>

            {/* Phone Screen Scroll Area */}
            <div className="flex-1 overflow-y-auto bg-neutral-50/50 pb-8 text-neutral-900">
              
              {/* Top Banner Poster */}
              <div className="relative h-44 w-full bg-neutral-800 overflow-hidden group">
                <img 
                  src={settings.bannerUrl || sampleBanners[0]} 
                  alt="Poster Banner" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/20 to-transparent flex flex-col justify-end p-4">
                  <h3 className="text-white text-[15px] font-bold leading-snug drop-shadow-sm">
                    {project.name}
                  </h3>
                  <p className="text-neutral-200 text-[11px] mt-1 line-clamp-2 leading-tight opacity-90">
                    {project.goal}
                  </p>
                </div>
              </div>

              {/* WeChat Authorization Banner if Login Required */}
              {!isWechatLoggedIn ? (
                <div className="p-6 m-4 bg-white rounded-2xl border border-neutral-200/80 shadow-sm text-center space-y-4">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-2xs">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h4 className="text-[15px] font-bold text-neutral-900">需要先微信授权登录</h4>
                    <p className="text-[12px] text-neutral-500 mt-1">
                      为确保活动真实性，请先完成微信授权后再提交您的内容与体验图文。
                    </p>
                  </div>

                  <button
                    onClick={() => setIsWechatLoggedIn(true)}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-[13px] transition-colors shadow-xs flex items-center justify-center gap-2"
                  >
                    <MessageSquare size={16} />
                    <span>微信一键授权登录</span>
                  </button>
                </div>
              ) : submittedSuccess ? (
                /* Success Feedback Screen */
                <div className="p-6 m-4 bg-white rounded-2xl border border-emerald-200 shadow-sm text-center space-y-4 my-8">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 size={32} />
                  </div>
                  <div>
                    <h4 className="text-[16px] font-bold text-neutral-900">投稿提交成功！</h4>
                    <p className="text-[12px] text-neutral-500 mt-1">
                      您的内容已自动回传入库，操盘手团队将尽快完成审查与任务确认。
                    </p>
                  </div>

                  <div className="p-3 bg-neutral-50 rounded-xl text-left text-[11px] text-neutral-600 space-y-1 border border-neutral-200/80">
                    <div>• 投稿标题：<span className="font-bold text-neutral-900">{title}</span></div>
                    <div>• 参与人员：<span className="font-bold text-neutral-900">{nickname || "扫码体验官"}</span></div>
                    <div>• 提交类型：<span className="font-bold text-neutral-900">{contentType}</span></div>
                  </div>

                  <button
                    onClick={() => {
                      setSubmittedSuccess(false);
                      setTitle('');
                      setBody('');
                    }}
                    className="w-full py-2.5 bg-neutral-900 text-white rounded-xl text-[12px] font-bold hover:bg-neutral-800 transition-colors"
                  >
                    继续提交下一条
                  </button>
                </div>
              ) : (
                /* Submission Form Screen */
                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                  <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-3.5">
                    <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                      <span className="text-[13px] font-bold text-neutral-900 flex items-center gap-1.5">
                        <Sparkles size={14} className="text-amber-500" />
                        提交体验作品 / 图文素材
                      </span>
                      <span className="text-[11px] text-emerald-600 font-medium">已连接操盘中心</span>
                    </div>

                    {/* Nickname / Account */}
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-600 mb-1">
                        体验官昵称 / 微信名 <span className="text-rose-500">*</span>
                      </label>
                      <input 
                        type="text" 
                        required
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        placeholder="例如：备婚新娘小甜 / 策划师李同"
                        className="w-full px-3 py-2 border border-neutral-200 rounded-xl text-[12px] outline-none focus:border-neutral-400 bg-neutral-50/50"
                      />
                    </div>

                    {/* Content Type */}
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-600 mb-1">
                        提交内容类型
                      </label>
                      <select
                        value={contentType}
                        onChange={(e) => setContentType(e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-200 rounded-xl text-[12px] outline-none focus:border-neutral-400 bg-neutral-50/50"
                      >
                        <option value="体验笔记与试用心得">体验笔记与试用心得</option>
                        <option value="现场实拍图片与视频">现场实拍图片与视频</option>
                        <option value="试菜与菜品评价">试菜与菜品评价</option>
                        <option value="场地布置与档期反馈">场地布置与档期反馈</option>
                      </select>
                    </div>

                    {/* Note Title */}
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-600 mb-1">
                        作品标题 / 笔记主题 <span className="text-rose-500">*</span>
                      </label>
                      <input 
                        type="text" 
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="例如：青岛酒店超梦幻婚宴宴会厅试菜记录！"
                        className="w-full px-3 py-2 border border-neutral-200 rounded-xl text-[12px] outline-none focus:border-neutral-400 bg-neutral-50/50"
                      />
                    </div>

                    {/* Note Body */}
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-600 mb-1">
                        详细文字心得 / 内容说明
                      </label>
                      <textarea
                        rows={3}
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        placeholder="写下您的真实体验过程、场地亮点或改善建议..."
                        className="w-full px-3 py-2 border border-neutral-200 rounded-xl text-[12px] outline-none focus:border-neutral-400 bg-neutral-50/50 resize-none"
                      />
                    </div>

                    {/* Photo Upload Area */}
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-600 mb-1">
                        现场图片 / 素材照片
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {selectedImages.map((img, idx) => (
                          <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-neutral-200 group">
                            <img src={img} alt="Uploaded" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => setSelectedImages(prev => prev.filter((_, i) => i !== idx))}
                              className="absolute top-1 right-1 p-1 bg-neutral-900/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={10} />
                            </button>
                          </div>
                        ))}

                        {selectedImages.length < 6 && (
                          <button
                            type="button"
                            onClick={() => setSelectedImages(prev => [
                              ...prev,
                              sampleBanners[prev.length % sampleBanners.length]
                            ])}
                            className="aspect-square rounded-xl border-2 border-dashed border-neutral-200 flex flex-col items-center justify-center text-neutral-400 hover:border-neutral-400 hover:text-neutral-600 bg-neutral-50/50 transition-colors"
                          >
                            <Upload size={16} />
                            <span className="text-[10px] mt-1 font-medium">添加照片</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting || !title.trim()}
                      className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40 text-white rounded-xl text-[13px] font-bold transition-all shadow-xs flex items-center justify-center gap-2 mt-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Sparkles size={15} className="animate-spin text-neutral-300" />
                          <span>正在提交回传...</span>
                        </>
                      ) : (
                        <>
                          <span>提交体验投稿</span>
                          <Send size={14} />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Bottom Bar inside Phone */}
            <div className="bg-white border-t border-neutral-100 p-2 text-center text-[10px] text-neutral-400 shrink-0">
              由 源平台 · 智能内容服务技术支持
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

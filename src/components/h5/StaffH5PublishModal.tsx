import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  X, Smartphone, Copy, Check, ExternalLink, 
  Sparkles, CheckCircle2, AlertCircle, ArrowRight, Download, RefreshCw
} from "lucide-react";
import { Note } from "../../data/projectStore";

interface StaffH5PublishModalProps {
  note?: Note | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export function StaffH5PublishModal({ note, onClose, onSuccess }: StaffH5PublishModalProps) {
  const [copiedTitle, setCopiedTitle] = useState(false);
  const [copiedBody, setCopiedBody] = useState(false);
  const [savedImages, setSavedImages] = useState(false);
  const [publishState, setPublishState] = useState<"prepare" | "app_opened" | "detecting" | "recognized">("prepare");

  const title = note?.title || "幼犬换粮总软便？宠物店长教你3步过渡避坑指南";
  const body = note?.body || `很多新手家长在幼犬3-6个月换粮期，常常遇到软便拉稀的问题。\n\n其实幼犬肠胃娇嫩，换粮最忌讳直接一刀切！\n\n📌 建议遵循【7日渐进换粮法】：\nDay 1-2：旧粮 80% + 新粮 20%\nDay 3-4：旧粮 50% + 新粮 50%\nDay 5-6：旧粮 20% + 新粮 80%\nDay 7+：完全过渡为新粮\n\n✨ 核心划重点：搭配活性益生菌配方，有助于平稳建立肠道菌群。如果狗狗有挑食问题，可以温水微泡激发肉香。\n\n#幼犬换粮 #新手养狗避坑 #狗狗软便 #宠物店长科普 #特唯普宠粮`;

  const images = [
    "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=600&auto=format&fit=crop",
  ];

  const handleCopyTitle = () => {
    navigator.clipboard.writeText(title);
    setCopiedTitle(true);
    setTimeout(() => setCopiedTitle(false), 2000);
  };

  const handleCopyBody = () => {
    navigator.clipboard.writeText(body);
    setCopiedBody(true);
    setTimeout(() => setCopiedBody(false), 2000);
  };

  const handleSaveImages = () => {
    setSavedImages(true);
    setTimeout(() => setSavedImages(false), 2500);
  };

  const handleOpenXiaohongshu = () => {
    setPublishState("app_opened");
    setTimeout(() => {
      setPublishState("detecting");
      setTimeout(() => {
        setPublishState("recognized");
      }, 3000);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative flex bg-transparent max-h-[92vh] w-full max-w-[820px] z-10"
      >
        {/* Left Side: Desktop Guidance */}
        <div className="hidden md:flex flex-col w-[380px] bg-white rounded-l-3xl p-7 border-r border-neutral-200 justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Smartphone size={22} className="text-neutral-900" />
              <h3 className="text-[18px] font-extrabold text-neutral-900">
                员工 / KOS 定向发布
              </h3>
            </div>
            
            <p className="text-[13px] text-neutral-600 leading-relaxed">
              这是员工在手机端接收到的定向发布任务 H5 界面。支持标题与正文独立复制、图片顺序明确展示，发布后无需员工回传链接。
            </p>

            <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-2.5 text-[12.5px]">
              <div className="font-bold text-neutral-900">执行流程规范：</div>
              <div className="space-y-1.5 text-neutral-600">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-neutral-900 text-white text-[10px] flex items-center justify-center font-bold">1</span>
                  <span>核对发布账号与计划时间</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-neutral-900 text-white text-[10px] flex items-center justify-center font-bold">2</span>
                  <span>分别复制标题与正文</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-neutral-900 text-white text-[10px] flex items-center justify-center font-bold">3</span>
                  <span>保存规范顺序图片</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-neutral-900 text-white text-[10px] flex items-center justify-center font-bold">4</span>
                  <span>在小红书App发布，系统自动识别</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 bg-neutral-100 text-neutral-700 font-bold rounded-xl hover:bg-neutral-200 transition-colors text-[13px]"
          >
            关闭模拟器
          </button>
        </div>

        {/* Right Side: Mobile Screen Mockup */}
        <div className="flex-1 flex flex-col items-center bg-neutral-100/90 p-4 md:rounded-r-3xl rounded-3xl relative overflow-hidden backdrop-blur-sm shadow-2xl">
          <div className="w-[360px] h-[680px] bg-white rounded-[38px] shadow-2xl border-[10px] border-neutral-900 overflow-hidden relative flex flex-col">
            
            {/* Status bar */}
            <div className="h-6 w-full bg-white flex justify-between items-center px-6 text-[11px] font-bold text-neutral-900 shrink-0">
              <span>09:41</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px]">5G</span>
                <div className="w-4 h-2.5 bg-neutral-900 rounded-[2px]" />
              </div>
            </div>

            {/* Mobile Header */}
            <div className="px-4 py-3 bg-white border-b border-neutral-100 flex items-center justify-between shrink-0">
              <div>
                <div className="text-[14px] font-extrabold text-neutral-900">
                  小红书发布任务
                </div>
                <div className="text-[11px] text-neutral-500">
                  执行账号: {note?.account || "特唯普宠物官方旗舰店"}
                </div>
              </div>
              <span className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded text-[11px] font-bold">
                今日待发布
              </span>
            </div>

            {/* Mobile Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-[13px]">
              
              {/* Task info banner */}
              <div className="bg-neutral-50 p-3 rounded-2xl border border-neutral-200 space-y-1.5">
                <div className="flex justify-between text-[11.5px] text-neutral-500">
                  <span>排期时间: {note?.plannedDate || "今日 18:00"}</span>
                  <span className="text-emerald-700 font-bold">已就绪</span>
                </div>
                <div className="text-[11px] text-neutral-400">
                  请在手机端复制内容与保存图片后，进入小红书完成发布。
                </div>
              </div>

              {/* Title Section */}
              <div className="bg-white rounded-2xl p-3.5 border border-neutral-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-bold text-neutral-700">1. 笔记标题</span>
                  <button
                    onClick={handleCopyTitle}
                    className={`px-3 py-1 rounded-lg text-[11.5px] font-bold transition-colors flex items-center gap-1 ${
                      copiedTitle ? "bg-emerald-600 text-white" : "bg-neutral-900 text-white hover:bg-neutral-800"
                    }`}
                  >
                    {copiedTitle ? <><Check size={12} /> 已复制</> : <><Copy size={12} /> 复制标题</>}
                  </button>
                </div>
                <div className="p-2.5 bg-neutral-50 rounded-xl text-[12.5px] font-bold text-neutral-900 border border-neutral-100">
                  {title}
                </div>
              </div>

              {/* Body Section */}
              <div className="bg-white rounded-2xl p-3.5 border border-neutral-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-bold text-neutral-700">2. 笔记正文与标签</span>
                  <button
                    onClick={handleCopyBody}
                    className={`px-3 py-1 rounded-lg text-[11.5px] font-bold transition-colors flex items-center gap-1 ${
                      copiedBody ? "bg-emerald-600 text-white" : "bg-neutral-900 text-white hover:bg-neutral-800"
                    }`}
                  >
                    {copiedBody ? <><Check size={12} /> 已复制</> : <><Copy size={12} /> 复制正文</>}
                  </button>
                </div>
                <div className="p-2.5 bg-neutral-50 rounded-xl text-[11.5px] text-neutral-800 leading-relaxed border border-neutral-100 max-h-36 overflow-y-auto whitespace-pre-line">
                  {body}
                </div>
              </div>

              {/* Images Section */}
              <div className="bg-white rounded-2xl p-3.5 border border-neutral-200 shadow-2xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-bold text-neutral-700">3. 配图 ({images.length}张)</span>
                  <button
                    onClick={handleSaveImages}
                    className="px-3 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-[11.5px] font-bold transition-colors flex items-center gap-1"
                  >
                    {savedImages ? <><Check size={12} /> 已批量保存</> : <><Download size={12} /> 一键存图</>}
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-neutral-200 bg-neutral-100">
                      <img src={img} alt="pic" className="w-full h-full object-cover" />
                      <div className="absolute top-1 left-1 bg-neutral-900/80 text-white text-[9px] font-bold px-1.5 py-0.2 rounded">
                        P{idx + 1}{idx === 0 ? " 封面" : ""}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status & Open App */}
              {publishState === "prepare" && (
                <button
                  onClick={handleOpenXiaohongshu}
                  className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold text-[14px] rounded-2xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                >
                  <ExternalLink size={16} /> 打开小红书 App 发布
                </button>
              )}

              {publishState === "app_opened" && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-center space-y-1">
                  <div className="font-bold text-amber-900 text-[12.5px]">已唤起小红书 App</div>
                  <div className="text-[11px] text-amber-700">请在小红书中粘贴内容并发布，完成后系统自动识别。</div>
                </div>
              )}

              {publishState === "detecting" && (
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl text-center space-y-2">
                  <RefreshCw size={20} className="text-purple-600 animate-spin mx-auto" />
                  <div className="font-bold text-purple-900 text-[13px]">正在自动识别小红书发布状态...</div>
                  <div className="text-[11px] text-purple-600">系统自动匹配账号最新发布笔记，无需手动回传链接</div>
                </div>
              )}

              {publishState === "recognized" && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                  <CheckCircle2 size={24} className="text-emerald-600 mx-auto" />
                  <div className="font-bold text-emerald-900 text-[14px]">已成功识别笔记！</div>
                  <div className="text-[11.5px] text-emerald-700">
                    笔记ID: 64f89a1c... 已自动关联并进入 14 天观察周期
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

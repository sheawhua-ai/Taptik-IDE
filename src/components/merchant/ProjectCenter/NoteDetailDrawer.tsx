import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, ExternalLink, FileText, Image as ImageIcon, Calendar, Tag, History, 
  CheckCircle2, AlertTriangle, Send, Copy, Camera, Check, Edit3, Save, Sparkles, QrCode, ArrowRight 
} from "lucide-react";
import { Note } from "../../../data/projectStore";
import { useProjectStore } from "../../../context/ProjectContext";
import { KOCQuestionnaireModal } from "../KOCQuestionnaireModal";

interface NoteDetailDrawerProps {
  note: Note | null;
  projectId?: string;
  onClose: () => void;
  onActionClick?: (note: Note) => void;
  onOpenInExecutionCenter?: (note: Note) => void;
}

export function NoteDetailDrawer({ note, projectId, onClose, onActionClick, onOpenInExecutionCenter }: NoteDetailDrawerProps) {
  const { updateNoteStatus, clearNoteIssue, currentProject } = useProjectStore();
  const [activeTab, setActiveTab] = useState<"内容" | "素材" | "发布" | "观察">("内容");
  
  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(note?.title || "");
  const [editType, setEditType] = useState<"KOC" | "店长号/KOS" | "品牌主号">(note?.type || "KOC");
  const [editDirection, setEditDirection] = useState(note?.contentDirection || "");
  const [editBody, setEditBody] = useState(note?.contentPackage?.body || note?.body || "");
  const [editParticipant, setEditParticipant] = useState(note?.participant || "张店长");
  const [showToast, setShowToast] = useState<string | null>(null);
  const [showQuestionnaireModal, setShowQuestionnaireModal] = useState(false);

  // Dispatch task state
  const [shootingTaskDispatched, setShootingTaskDispatched] = useState(false);
  const [publishTaskDispatched, setPublishTaskDispatched] = useState(false);
  const [contentConfirmed, setContentConfirmed] = useState(note?.contentStatus === "已确认");

  // Fake state for copy actions
  const [copiedTitle, setCopiedTitle] = useState(false);
  const [copiedBody, setCopiedBody] = useState(false);

  if (!note) return null;

  const handleCopy = (type: 'title' | 'body') => {
    if (type === 'title') { setCopiedTitle(true); setTimeout(() => setCopiedTitle(false), 2000); }
    if (type === 'body') { setCopiedBody(true); setTimeout(() => setCopiedBody(false), 2000); }
  };

  const handleSaveEdit = () => {
    const pId = projectId || currentProject?.id || "p1";
    updateNoteStatus(pId, note.id, {
      title: editTitle,
      type: editType,
      contentDirection: editDirection,
      body: editBody,
      participant: editParticipant
    });
    setIsEditing(false);
    setShowToast("笔记内容已修改成功");
    setTimeout(() => setShowToast(null), 3000);
  };

  const handleDispatchShootingTask = () => {
    setShootingTaskDispatched(true);
    setShowToast("已成功向门店下发拍摄任务");
    setTimeout(() => setShowToast(null), 3000);
  };

  const handleConfirmContent = () => {
    setContentConfirmed(true);
    const pId = projectId || currentProject?.id || "p1";
    clearNoteIssue(pId, note.id);
    updateNoteStatus(pId, note.id, { contentStatus: "已确认" });
    setShowToast("内容方案与审查意见已确认通过");
    setTimeout(() => setShowToast(null), 3000);
  };

  const handleDispatchPublishTask = () => {
    setPublishTaskDispatched(true);
    const pId = projectId || currentProject?.id || "p1";
    updateNoteStatus(pId, note.id, { publishStatus: "待发布" });
    setShowToast("发布任务已成功派发至目标账号");
    setTimeout(() => setShowToast(null), 3000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-neutral-900/20 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Drawer content */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          className="w-[620px] bg-white h-full shadow-2xl flex flex-col relative z-10"
        >
          {/* Notification Toast */}
          {showToast && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-4 left-6 right-16 z-30 bg-emerald-700 text-white text-[13px] font-bold px-4 py-2.5 rounded-xl shadow-lg flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>{showToast}</span>
              </div>
              <button onClick={() => setShowToast(null)} className="text-emerald-200 hover:text-white"><X size={14}/></button>
            </motion.div>
          )}

          {/* Header */}
          <div className="p-6 border-b border-[#EAECF0] flex flex-col gap-4 bg-[#F7F8FA] shrink-0">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                {isEditing ? (
                  <input 
                    type="text" 
                    value={editTitle} 
                    onChange={e => setEditTitle(e.target.value)}
                    className="w-full font-bold text-[18px] text-[#111827] bg-white px-3 py-1.5 border border-[#EAECF0] rounded-xl outline-none focus:border-primary-500"
                    placeholder="请输入笔记标题..."
                  />
                ) : (
                  <h2 className="text-[18px] font-bold text-[#111827] leading-snug">{editTitle || note.title || "未命名笔记"}</h2>
                )}

                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  {isEditing ? (
                    <>
                      <select 
                        value={editType}
                        onChange={e => setEditType(e.target.value as any)}
                        className="text-[12px] bg-white px-2 py-1 border border-[#EAECF0] rounded-md outline-none"
                      >
                        <option value="KOC">KOC</option>
                        <option value="店长号/KOS">店长号/KOS</option>
                        <option value="品牌主号">品牌主号</option>
                      </select>
                      <input 
                        type="text"
                        value={editParticipant}
                        onChange={e => setEditParticipant(e.target.value)}
                        placeholder="负责人/店长"
                        className="text-[12px] bg-white px-2 py-1 border border-[#EAECF0] rounded-md outline-none w-24"
                      />
                    </>
                  ) : (
                    <>
                      <span className="text-[12px] text-[#667085] bg-white px-2 py-0.5 border border-[#EAECF0] rounded-md font-medium">{editType}</span>
                      <span className="text-[12px] text-[#667085] bg-white px-2 py-0.5 border border-[#EAECF0] rounded-md font-medium">
                        {note.publishStatus === '未安排' ? (contentConfirmed ? "内容已确认" : note.contentStatus) : note.publishStatus}
                      </span>
                      <span className="text-[12px] text-[#667085]">参与者：{editParticipant}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {isEditing ? (
                  <button 
                    onClick={handleSaveEdit} 
                    className="px-3 py-1.5 bg-primary-600 text-white font-bold text-[13px] rounded-xl hover:bg-primary-700 flex items-center gap-1 shadow-sm"
                  >
                    <Save size={14} /> 保存修改
                  </button>
                ) : (
                  <button 
                    onClick={() => setIsEditing(true)} 
                    className="px-3 py-1.5 border border-[#EAECF0] bg-white hover:bg-neutral-50 text-[#111827] font-medium text-[13px] rounded-xl flex items-center gap-1"
                  >
                    <Edit3 size={14} /> 编辑
                  </button>
                )}
                <button onClick={onClose} className="p-2 text-neutral-400 hover:text-[#111827] rounded-lg hover:bg-neutral-200 transition-colors">
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="flex gap-4 border-b border-[#EAECF0] mt-2">
              {(["内容", "素材", "发布", "观察"] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 text-[13px] font-medium relative ${activeTab === tab ? "text-primary-600 font-bold" : "text-[#667085] hover:text-[#111827]"}`}
                >
                  {tab}
                  {activeTab === tab && <motion.div layoutId="drawerTabIndicator" className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {activeTab === "内容" && (
              <div className="space-y-6">
                {note.isNotePackage && (
                  <div className="bg-primary-50/70 border border-primary-200 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 bg-primary-600 text-white font-bold text-[11px] rounded-lg">📦 笔记包占位</span>
                        <span className="text-[13px] font-bold text-primary-900">
                          问卷状态：{note.packageSpec?.questionnaireStatus === "已填写" ? "已提交回传" : "待KOC/KOS填写问卷"}
                        </span>
                      </div>
                      {note.packageSpec?.questionnaireStatus !== "已填写" && (
                        <button
                          onClick={() => setShowQuestionnaireModal(true)}
                          className="px-3 py-1.5 bg-primary-600 text-white text-[12px] font-bold rounded-xl hover:bg-primary-700 flex items-center gap-1 shadow-xs"
                        >
                          <Sparkles size={14} /> 填写问卷即时生成笔记
                        </button>
                      )}
                    </div>
                    
                    <div className="text-[12px] text-primary-900 space-y-1 bg-white/60 p-3 rounded-xl border border-primary-100">
                      <div className="font-bold flex items-center gap-1"><FileText size={13}/> 规定要怎么写：</div>
                      <div className="text-[#344054]">{note.packageSpec?.guidelines || "按照写作框架提供真实体验与避坑建议。"}</div>
                    </div>

                    <div className="text-[12px] text-primary-900 space-y-1 bg-white/60 p-3 rounded-xl border border-primary-100">
                      <div className="font-bold flex items-center gap-1"><Camera size={13}/> 素材按任务拍摄：</div>
                      <div className="text-[#344054]">{note.packageSpec?.materialTaskReqs || "按下发拍摄任务拍摄1条视频及2张图片。"}</div>
                    </div>
                  </div>
                )}

                <div>
                  <div className="text-[13px] text-[#667085] mb-1 font-medium">内容方向</div>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={editDirection} 
                      onChange={e => setEditDirection(e.target.value)}
                      className="w-full px-3 py-1.5 text-[13px] bg-white border border-[#EAECF0] rounded-xl outline-none focus:border-primary-500"
                      placeholder="如：真实试菜体验、科普答疑等"
                    />
                  ) : (
                    <div className="text-[13px] text-[#111827] font-medium">{editDirection || note.contentDirection || "常规种草内容"}</div>
                  )}
                </div>
                
                <div>
                  <div className="text-[13px] text-[#667085] mb-2 flex justify-between items-center">
                    <span className="font-medium">正文内容</span>
                    <button onClick={() => handleCopy('body')} className="text-primary-600 hover:text-primary-700 flex items-center gap-1 text-[12px]">
                      {copiedBody ? <Check size={14}/> : <Copy size={14}/>} {copiedBody ? "已复制" : "复制"}
                    </button>
                  </div>

                  {isEditing ? (
                    <textarea 
                      rows={8}
                      value={editBody}
                      onChange={e => setEditBody(e.target.value)}
                      className="w-full p-4 bg-white text-[13px] text-[#111827] leading-relaxed border border-[#EAECF0] rounded-xl outline-none focus:border-primary-500 resize-none"
                      placeholder="输入正文内容..."
                    />
                  ) : (
                    <div className="bg-[#F7F8FA] p-4 rounded-xl text-[13px] text-[#111827] leading-relaxed whitespace-pre-wrap border border-[#EAECF0]">
                      {note.publishStatus === "已发布" ? (
                        <div className="text-center py-4">
                          <div className="w-16 h-16 bg-neutral-100 rounded-xl mx-auto mb-2 flex items-center justify-center">
                            <Check size={24} className="text-emerald-500" />
                          </div>
                          <div className="text-[#111827] font-bold mb-1">线上快照已存档</div>
                          <a href={note.publishLink || "#"} target="_blank" className="text-primary-600 hover:underline text-[12px] flex items-center justify-center gap-1">
                            点击查看小红书原文 <ExternalLink size={12}/>
                          </a>
                        </div>
                      ) : (editBody || note.contentPackage?.body || "内容正在生成或暂无内容...")}
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white border border-[#EAECF0] rounded-xl">
                    <div className="text-[13px] font-bold text-[#111827] mb-2">商家知识库引用</div>
                    <div className="text-[12px] text-[#667085] space-y-1">
                      <div>· 幼犬换粮七日法则</div>
                      <div>· 敏感肠胃益生菌组合推荐</div>
                    </div>
                  </div>
                  <div className="p-4 bg-white border border-[#EAECF0] rounded-xl">
                    <div className="text-[13px] font-bold text-[#111827] mb-2">事实依据</div>
                    <div className="text-[12px] text-[#667085] space-y-1">
                      <div>· 2024用户满意度调研数据</div>
                      <div>· 换粮成功率95%以上</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                  <div className="text-[13px] font-bold text-blue-900 mb-2 flex items-center gap-1.5">
                    <Sparkles size={16} className="text-blue-600" /> AI 检查与合规优化
                  </div>
                  <div className="text-[12px] text-blue-800 mb-2">
                    已检查：品牌结构完整度、口语化表达改写、首图标题优化、高风险词排查
                  </div>
                  {!contentConfirmed && note.contentStatus === "待确认" && (
                    <div className="mt-3 p-3 bg-white rounded-lg border border-blue-100 flex items-start gap-2">
                      <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="text-[13px] font-bold text-[#111827]">“七日换粮法”表述需要确认</div>
                        <div className="text-[12px] text-[#667085] mt-1">该表达可能被理解为固定周期承诺，AI建议改为“建议逐步过渡”。</div>
                        <button 
                          onClick={handleConfirmContent}
                          className="mt-2 px-4 py-1.5 bg-primary-600 text-white text-[12px] font-bold rounded-lg hover:bg-primary-700 transition-colors"
                        >
                          确认并修正内容
                        </button>
                      </div>
                    </div>
                  )}
                  {contentConfirmed && (
                    <div className="mt-2 text-[12px] text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 size={14} /> 内容与风险审核已通过
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "素材" && (
              <div className="space-y-6">
                <div className="text-[13px] text-[#667085] bg-[#F7F8FA] p-3 rounded-xl border border-[#EAECF0]">
                  AI已自动匹配当前项目及商家可复用素材池。
                </div>
                
                <div>
                  <h4 className="text-[14px] font-bold text-[#111827] mb-3">推荐匹配</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border border-[#EAECF0] rounded-xl p-3 bg-white">
                      <div className="aspect-square bg-neutral-100 rounded-lg mb-2 flex items-center justify-center border border-dashed border-neutral-300">
                        <ImageIcon size={28} className="text-neutral-400"/>
                      </div>
                      <div className="text-[12px] text-[#111827] font-bold">产品正面特写图</div>
                      <div className="text-[11px] text-[#667085] mt-1">推荐：产品清晰，适合作为配图2。</div>
                    </div>
                    <div className="border border-[#EAECF0] rounded-xl p-3 bg-white">
                      <div className="aspect-square bg-neutral-100 rounded-lg mb-2 flex items-center justify-center border border-dashed border-neutral-300">
                        <Camera size={28} className="text-neutral-400"/>
                      </div>
                      <div className="text-[12px] text-[#111827] font-bold">门店实拍与展示墙</div>
                      <div className="text-[11px] text-[#667085] mt-1">推荐：提升真实可信度。</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-[14px] font-bold text-[#111827] mb-3">素材下发与补拍任务</h4>
                  {shootingTaskDispatched ? (
                    <div className="p-4 border border-emerald-200 bg-emerald-50 rounded-xl flex items-center justify-between">
                      <div>
                        <div className="text-[13px] font-bold text-emerald-900 flex items-center gap-1.5">
                          <CheckCircle2 size={16} className="text-emerald-600" /> 拍摄任务已派发给【{editParticipant}】
                        </div>
                        <div className="text-[12px] text-emerald-700 mt-1">门店店长已在企微收到提醒，上传后自动完成素材匹配。</div>
                      </div>
                      <span className="text-[12px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-lg">推进中</span>
                    </div>
                  ) : (
                    <div className="p-4 border border-amber-200 bg-amber-50 rounded-xl space-y-3">
                      <div className="text-[13px] font-bold text-amber-900 mb-1">素材缺口项：</div>
                      <div className="text-[13px] text-amber-800">· 包含产品使用细节图、门店真实试用场景图</div>
                      <button 
                        onClick={handleDispatchShootingTask}
                        className="px-4 py-2 bg-primary-600 text-white text-[13px] font-bold rounded-xl hover:bg-primary-700 transition-colors shadow-sm flex items-center gap-1.5"
                      >
                        <Send size={14} /> 向门店下发拍摄任务
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "发布" && (
              <div className="space-y-6">
                <div className="text-[14px] font-bold text-[#111827]">发布流程与任务指派 ({editType})</div>
                
                {editType === "店长号/KOS" ? (
                  <div className="space-y-4">
                    <div className="text-[13px] text-[#667085] space-y-2">
                      <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> 内容方案已确认</div>
                      <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> 配图素材就绪</div>
                      <div className="flex items-center gap-2 font-bold text-[#111827]">
                        <div className="w-4 h-4 rounded-full border-2 border-primary-600 bg-primary-50 flex items-center justify-center text-[10px]">3</div>
                        生成员工定向任务
                      </div>
                      <div className="flex items-center gap-2 pl-6 text-[12px]">员工在企微/飞书收到提醒，点击复制标题与正文</div>
                      <div className="flex items-center gap-2 pl-6 text-[12px]">一键带入首图并跳转小红书发布</div>
                      <div className="flex items-center gap-2 pl-6 text-[12px]">发布后系统自动无感识别</div>
                    </div>

                    <div className="p-4 bg-[#F7F8FA] border border-[#EAECF0] rounded-xl flex items-center justify-between">
                      <div>
                        <div className="text-[13px] font-bold text-[#111827]">KOS 员工发布任务</div>
                        <div className="text-[12px] text-[#667085] mt-1">关联责任人：{editParticipant}</div>
                      </div>
                      {publishTaskDispatched ? (
                        <span className="text-[12px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                          已下发企微任务
                        </span>
                      ) : (
                        <button 
                          onClick={handleDispatchPublishTask}
                          className="px-4 py-2 bg-primary-600 text-white text-[13px] font-bold rounded-xl hover:bg-primary-700 transition-colors shadow-sm flex items-center gap-1.5"
                        >
                          <Send size={14} /> 一键派发发布任务
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-[13px] text-[#667085] space-y-2">
                      <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> 生成消费者二维码/H5</div>
                      <div className="flex items-center gap-2 font-bold text-[#111827]"><div className="w-4 h-4 rounded-full border-2 border-primary-600" /> 扫码进入独立H5界面</div>
                      <div className="flex items-center gap-2 pl-6 text-[12px]">分别一键复制标题、正文及素材包</div>
                      <div className="flex items-center gap-2 pl-6 text-[12px]">跳转小红书客户端发布</div>
                      <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full border-2 border-neutral-300" /> 等待系统识别与数据统计</div>
                    </div>
                    <div className="p-4 border border-[#EAECF0] rounded-xl flex items-center justify-between bg-white shadow-sm">
                      <div>
                        <div className="text-[13px] font-bold text-[#111827]">消费者/KOC发布入口</div>
                        <div className="text-[12px] text-[#667085] mt-1">扫码或转发链接开始发布流程</div>
                      </div>
                      <button className="px-4 py-2 bg-primary-600 text-white text-[13px] font-bold rounded-xl hover:bg-primary-700 transition-colors flex items-center gap-1.5">
                        <QrCode size={14} /> 查看发布二维码
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="p-4 bg-neutral-50 rounded-xl border border-[#EAECF0]">
                  <div className="text-[13px] font-bold text-[#111827] mb-1">自动识别状态说明</div>
                  <div className="text-[12px] text-[#667085]">
                    发布完成后无需手动回传链接，系统将自动识别笔记ID、发布账号及上线时间。若出现识别异常，可在列表或执行中心一键修正。
                  </div>
                </div>
              </div>
            )}

            {activeTab === "观察" && (
              <div className="space-y-6">
                <div className="bg-[#F7F8FA] rounded-xl p-4 border border-[#EAECF0]">
                  <div className="text-[14px] font-bold text-[#111827] mb-3">
                    当前状态：{note.publishStatus === '已发布' ? "观察中" : "待发布观察"}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-[12px] text-[#667085] mb-1">已观察时间</div>
                      <div className="text-[13px] text-[#111827] font-medium">{note.publishStatus === '已发布' ? "18小时" : "0小时"}</div>
                    </div>
                    <div>
                      <div className="text-[12px] text-[#667085] mb-1">下次数据更新</div>
                      <div className="text-[13px] text-[#111827] font-medium">{note.publishStatus === '已发布' ? "6小时后" : "发布后触发"}</div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-[12px] text-[#667085] mb-1">观察策略周期</div>
                      <div className="text-[13px] text-[#111827] font-medium">默认 7 天（可随时在项目设置中微调）</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-[14px] font-bold text-[#111827] mb-3">检查点记录 (7天周期)</h4>
                  <div className="relative pl-4 space-y-6 before:absolute before:inset-y-0 before:left-[7px] before:w-[2px] before:bg-[#EAECF0]">
                    <div className="relative">
                      <div className="absolute w-4 h-4 bg-emerald-500 rounded-full -left-[11px] top-1 border-4 border-white" />
                      <div className="pl-4">
                        <div className="text-[13px] font-bold text-[#111827]">发布成功及首次识别</div>
                        <div className="text-[12px] text-[#667085] mt-1">{note.publishStatus === '已发布' ? "已完成" : "等待发布"}</div>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="absolute w-4 h-4 bg-primary-600 rounded-full -left-[11px] top-1 border-4 border-white" />
                      <div className="pl-4">
                        <div className="text-[13px] font-bold text-[#111827]">24小时检查点</div>
                        <div className="text-[12px] text-[#667085] mt-1">等待数据回传...</div>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="absolute w-4 h-4 bg-[#EAECF0] rounded-full -left-[11px] top-1 border-4 border-white" />
                      <div className="pl-4">
                        <div className="text-[13px] font-bold text-neutral-400">3天检查点</div>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="absolute w-4 h-4 bg-[#EAECF0] rounded-full -left-[11px] top-1 border-4 border-white" />
                      <div className="pl-4">
                        <div className="text-[13px] font-bold text-neutral-400">7天检查点</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white border border-[#EAECF0] rounded-xl text-[12px] text-[#667085]">
                  <span className="font-bold text-[#111827]">异常监控中：</span>
                  系统正在持续监控笔记可访问性、账号匹配度及数据更新状态，如有异常将自动推送到执行中心。
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {showQuestionnaireModal && (
        <KOCQuestionnaireModal
          note={note}
          onClose={() => setShowQuestionnaireModal(false)}
        />
      )}
    </AnimatePresence>
  );
}

import React, { useState } from 'react';
import { 
  Camera, Users, FileImage, AlertOctagon, X, Search, Filter,
  ChevronRight, CheckCircle2, Clock, AlertTriangle, PlayCircle,
  User, Image as ImageIcon, Copy, Download, RefreshCw, Send, 
  Check, AlertCircle, Plus, Info, Settings, Trash2, ArrowRight, 
  FolderOpen, Server, ChevronDown, MapPin, Tag, Smartphone, Eye, EyeOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onClose: () => void;
  initialTab?: string;
}

export function ShootingAndUploadWorkbench({ onClose, initialTab = 'employee' }: Props) {
  const [activeTab, setActiveTab] = useState(initialTab);
  
  // ================= 员工拍摄 (Employee Shooting) States =================
  const [expandedEmployeeGroups, setExpandedEmployeeGroups] = useState<string[]>(['g1']);
  const [activeEmployeeGroup, setActiveEmployeeGroup] = useState<string>('g1');
  const [employeeStatus, setEmployeeStatus] = useState<'未派发' | '拍摄中' | '有回传' | '有缺口' | '全部已齐'>('未派发');
  const [employeeRightPanel, setEmployeeRightPanel] = useState<'default' | 'adjust'>('default');
  const [magnifiedImage, setMagnifiedImage] = useState<string | null>(null);
  const [showOriginalImage, setShowOriginalImage] = useState(false);

  // ================= 消费者体验 (Consumer Experience) States =================
  const [expandedActivities, setExpandedActivities] = useState<string[]>(['a1']);
  const [activeActivity, setActiveActivity] = useState<string>('a1');
  const [activeParticipant, setActiveParticipant] = useState<string | null>(null);
  const [consumerRightPanel, setConsumerRightPanel] = useState<'default' | 'adjust'>('default');

  const tabs = [
    { id: 'employee', name: '员工拍摄' },
    { id: 'consumer', name: '消费者体验' },
    { id: 'progress', name: '素材进度' },
    { id: 'exception', name: '异常处理' }
  ];

  // ================= 员工拍摄 Mock Data =================
  const employeeGroups = [
    {
      id: 'g1', project: '双11大促', name: '门店喂食场景 · 6 篇', executor: '张三', 
      noteCount: 6, readyCount: 2, blocker: '猫咪不配合', status: '未派发',
      notes: [
        { id: 'n1', title: '探店首发优惠', account: '小红书-A', reqCount: 3, status: '未派发' },
        { id: 'n2', title: '双11囤货指南', account: '小红书-B', reqCount: 2, status: '未派发' }
      ]
    },
    {
      id: 'g2', project: '双11大促', name: '户外互动场景 · 4 篇', executor: '李四', 
      noteCount: 4, readyCount: 4, blocker: '无', status: '全部已齐',
      notes: [
        { id: 'n3', title: '周末带狗子出游', account: '小红书-C', reqCount: 4, status: '已齐' }
      ]
    }
  ];

  const toggleEmployeeGroup = (id: string) => {
    setExpandedEmployeeGroups(prev => prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]);
  };

  // ================= 消费者体验 Mock Data =================
  const consumerActivities = [
    {
      id: 'a1', project: '春季上新体验', name: '新品试吃官', 
      quota: 100, claimed: 85, surveyCompleted: 80, qualified: 60, published: 45,
      participants: [
        { id: 'p1', name: '用户A (领取后未填问卷)', status: '需介入', exceptionType: 'no_survey' },
        { id: 'p2', name: '用户B (连续三次图片不合格)', status: '需介入', exceptionType: 'bad_image' }
      ]
    }
  ];

  const toggleActivity = (id: string) => {
    setExpandedActivities(prev => prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-neutral-100 flex flex-col h-screen overflow-hidden">
      <div className="w-full bg-white h-full flex flex-col shadow-2xl animate-in fade-in duration-300">
        
        {/* ================= Header ================= */}
        <div className="px-6 py-4 border-b border-neutral-200 flex justify-between items-center bg-white shrink-0">
          <div className="flex items-center gap-6">
            <h2 className="text-[18px] font-bold text-neutral-900 flex items-center gap-2">
              <Camera className="text-emerald-600" size={20} />
              素材与回传
            </h2>
            <div className="flex space-x-1 bg-neutral-100 p-1 rounded-lg">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setEmployeeRightPanel('default');
                    setConsumerRightPanel('default');
                  }}
                  className={`px-4 py-1.5 rounded-md text-[13px] font-bold transition-colors ${
                    activeTab === tab.id ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </div>
          </div>
                    <div className="flex items-center gap-4">
            <button className="text-neutral-500 hover:text-neutral-900 p-2 rounded-full hover:bg-neutral-100 transition-colors flex items-center justify-center">
              <RefreshCw size={18} />
            </button>
            <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-full text-neutral-500">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* ================= Body ================= */}
        <div className="flex-1 overflow-hidden flex bg-neutral-50">
          
          {/* ================= Employee Workbench ================= */}
          {activeTab === 'employee' && (
            <>
              {/* Left Column: 拍摄任务组 */}
              <div className="w-[320px] bg-white border-r border-neutral-200 flex flex-col shrink-0">
                <div className="p-4 border-b border-neutral-100 font-bold text-[14px] text-neutral-800 flex items-center justify-between">
                  <span>拍摄任务组</span>
                  <Filter size={14} className="text-neutral-400" />
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3">
                  {employeeGroups.map(group => (
                    <div key={group.id} className="border border-neutral-200 rounded-xl overflow-hidden bg-white">
                      <div 
                        className={`p-3 cursor-pointer hover:bg-neutral-50 transition-colors ${activeEmployeeGroup === group.id ? 'bg-primary-50/50' : ''}`}
                        onClick={() => {
                          setActiveEmployeeGroup(group.id);
                          setEmployeeStatus(group.status as any);
                          setEmployeeRightPanel('default');
                        }}
                      >
                        <div className="text-[11px] text-primary-600 font-bold mb-1">{group.project}</div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-[13px] font-bold text-neutral-800 flex items-center gap-1.5">
                            <button onClick={(e) => { e.stopPropagation(); toggleEmployeeGroup(group.id); }}>
                              <ChevronRight size={14} className={`text-neutral-400 transition-transform ${expandedEmployeeGroups.includes(group.id) ? 'rotate-90' : ''}`} />
                            </button>
                            {group.name}
                          </div>
                        </div>
                        <div className="text-[12px] text-neutral-500 space-y-1">
                          <div className="flex justify-between"><span>执行人: {group.executor}</span><span>笔记: {group.readyCount}/{group.noteCount}齐</span></div>
                          {group.blocker !== '无' && (
                            <div className="text-rose-600 flex items-center gap-1 bg-rose-50 px-1.5 py-0.5 rounded w-fit">
                              <AlertCircle size={10} /> 卡点: {group.blocker}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {expandedEmployeeGroups.includes(group.id) && (
                        <div className="bg-neutral-50 border-t border-neutral-100 p-2 space-y-1">
                          {group.notes.map(note => (
                            <div key={note.id} className="bg-white p-2 rounded-lg border border-neutral-100 shadow-sm flex items-center justify-between">
                              <div className="truncate pr-2">
                                <div className="text-[12px] font-bold text-neutral-800 truncate">{note.title}</div>
                                <div className="text-[11px] text-neutral-500 flex items-center gap-2 mt-0.5">
                                  <span className="flex items-center gap-0.5"><User size={10}/> {note.account}</span>
                                  <span className="flex items-center gap-0.5"><ImageIcon size={10}/> {note.reqCount}素材</span>
                                </div>
                              </div>
                              <div className={`shrink-0 text-[11px] font-bold px-1.5 py-0.5 rounded ${
                                note.status === '未派发' ? 'bg-neutral-100 text-neutral-600' :
                                note.status === '已齐' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
                              }`}>
                                {note.status}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Middle Column: 当前拍摄组 */}
              <div className="flex-1 flex flex-col min-w-0 bg-[#f8f9fa] relative">
                <div className="p-5 border-b border-neutral-200 bg-white shrink-0 shadow-sm z-10">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-[18px] font-bold text-neutral-900 mb-1">门店喂食场景</h3>
                      <div className="flex items-center gap-4 text-[13px] text-neutral-500">
                        <span className="flex items-center gap-1"><MapPin size={14}/> 太阳宫门店</span>
                        <span className="flex items-center gap-1"><User size={14}/> 张三</span>
                        <span className="flex items-center gap-1"><Clock size={14}/> 截止: 今天 18:00</span>
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-primary-50 text-primary-700 rounded-lg text-[13px] font-bold border border-primary-100">
                      状态: {employeeStatus}
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-5 custom-scrollbar relative">
                  {magnifiedImage ? (
                    <div className="absolute inset-0 bg-neutral-900/90 z-50 flex flex-col">
                      <div className="p-4 flex justify-between items-center text-white">
                        <span className="text-[14px] font-bold">查看图片</span>
                        <button onClick={() => setMagnifiedImage(null)} className="p-2 hover:bg-white/10 rounded-full"><X size={20}/></button>
                      </div>
                      <div className="flex-1 flex items-center justify-center p-4">
                        <div className="w-full max-w-2xl aspect-video bg-neutral-800 rounded-lg flex items-center justify-center text-neutral-500">
                          [大图展示区 - {magnifiedImage}]
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-[14px] font-bold text-neutral-800 mb-3 flex items-center gap-2">
                          <Camera size={16} className="text-neutral-500"/> 本次到这个场景需要拍什么 (AI 合并排序)
                        </h4>
                        <div className="space-y-3">
                          {[1, 2].map(idx => (
                            <div key={idx} className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded text-[11px] font-bold">关联笔记 {idx}</span>
                                <span className="text-[13px] font-bold text-neutral-800">素材位：首图特写</span>
                              </div>
                              <div className="text-[13px] text-neutral-600 mb-2">
                                <span className="font-bold">画面要求:</span> 猫咪低头吃罐头，背景稍微虚化，突出罐头包装。
                              </div>
                              <div className="flex items-start gap-4 mt-3">
                                <div className="w-24 h-24 bg-neutral-100 rounded-lg border border-neutral-200 flex items-center justify-center text-[11px] text-neutral-400">参考图</div>
                                <div className="flex-1 bg-rose-50 text-rose-700 p-2 rounded-lg text-[12px]">
                                  <span className="font-bold flex items-center gap-1 mb-1"><AlertTriangle size={12}/> 不可出现:</span>
                                  竞品包装、员工手部过多遮挡、杂乱背景。
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {employeeStatus !== '未派发' && (
                        <div>
                          <h4 className="text-[14px] font-bold text-neutral-800 mb-3 flex items-center gap-2 mt-8">
                            <ImageIcon size={16} className="text-neutral-500"/> 已回传图片
                          </h4>
                          <div className="grid grid-cols-3 gap-3">
                            <div 
                              className="aspect-square bg-neutral-200 rounded-xl relative cursor-pointer overflow-hidden border-2 border-emerald-500"
                              onClick={() => setMagnifiedImage('img1.jpg')}
                            >
                              <div className="absolute top-2 left-2 bg-emerald-500 text-white text-[11px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 shadow-sm">
                                <CheckCircle2 size={12}/> 可用
                              </div>
                              <div className="absolute bottom-2 right-2 bg-neutral-900/70 text-white text-[11px] px-1.5 py-0.5 rounded backdrop-blur-sm">
                                隐私已处理
                              </div>
                            </div>
                            <div 
                              className="aspect-square bg-neutral-200 rounded-xl relative cursor-pointer overflow-hidden border-2 border-rose-500"
                              onClick={() => setMagnifiedImage('img2.jpg')}
                            >
                              <div className="absolute top-2 left-2 bg-rose-500 text-white text-[11px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 shadow-sm">
                                <AlertCircle size={12}/> 需补拍
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: AI 检查与派发 / 调整面板 */}
              <div className="w-[340px] bg-white border-l border-neutral-200 flex flex-col shrink-0">
                {employeeRightPanel === 'adjust' ? (
                  <div className="flex-1 flex flex-col h-full animate-in slide-in-from-right-4">
                    <div className="p-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50">
                      <h3 className="font-bold text-[15px] text-neutral-900">调整拍摄要求</h3>
                      <button onClick={() => setEmployeeRightPanel('default')} className="text-neutral-400 hover:text-neutral-600"><X size={16}/></button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 text-[13px]">
                      <div>
                        <label className="block text-neutral-700 font-bold mb-1">素材位 1 画面要求</label>
                        <textarea className="w-full p-2 border border-neutral-200 rounded-lg resize-none h-20 outline-none focus:border-primary-500" defaultValue="猫咪低头吃罐头，背景稍微虚化，突出罐头包装。"></textarea>
                      </div>
                      <div>
                        <label className="block text-neutral-700 font-bold mb-1">禁拍项</label>
                        <textarea className="w-full p-2 border border-neutral-200 rounded-lg resize-none h-16 outline-none focus:border-rose-500 text-rose-700 bg-rose-50/50" defaultValue="竞品包装、员工手部过多遮挡、杂乱背景。"></textarea>
                      </div>
                      <div>
                        <label className="block text-neutral-700 font-bold mb-2">更新范围</label>
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="updateScope" defaultChecked className="accent-primary-600" />
                            <span>仅更新未开始的任务</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="updateScope" className="accent-primary-600" />
                            <span>同时通知正在拍摄的员工 (重新派发)</span>
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border-t border-neutral-100 bg-white">
                      <button className="w-full py-2 bg-neutral-900 text-white font-bold rounded-lg hover:bg-neutral-800 transition-colors" onClick={() => setEmployeeRightPanel('default')}>保存调整</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="p-4 border-b border-neutral-100 bg-neutral-50">
                      <h3 className="font-bold text-[15px] text-neutral-900 flex items-center gap-2">
                        <Tag size={16} className="text-primary-600"/>
                        {employeeStatus === '未派发' ? 'AI 拍摄清单检查' : 'AI 回传质检'}
                      </h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
                      {employeeStatus === '未派发' ? (
                        <div className="space-y-4">
                          <div className="bg-blue-50 text-blue-800 p-3 rounded-lg text-[13px]">
                            <span className="font-bold block mb-1">AI 检查结果</span>
                            清单已合并 2 篇笔记的需求，发现 1 处参考图风格冲突，建议调整后再派发。
                          </div>
                          <button 
                            className="w-full py-2 bg-white border border-neutral-200 text-neutral-700 font-bold rounded-lg hover:bg-neutral-50 transition-colors text-[13px]"
                            onClick={() => setEmployeeRightPanel('adjust')}
                          >
                            调整拍摄要求
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="bg-white border border-neutral-200 rounded-xl p-3 shadow-sm">
                            <div className="text-[13px] font-bold text-neutral-800 border-b border-neutral-100 pb-2 mb-2">图片1 质检 (不合格原因)</div>
                            <div className="space-y-2 text-[12px]">
                              <div className="flex justify-between items-center text-rose-600">
                                <span className="font-bold">构图</span>
                                <span>主体过小，背景杂乱</span>
                              </div>
                              <div className="flex justify-between items-center text-neutral-600">
                                <span>清晰度</span>
                                <span className="text-emerald-600"><CheckCircle2 size={14}/></span>
                              </div>
                            </div>
                          </div>
                          <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200">
                            <div className="text-[12px] font-bold text-neutral-700 mb-2 flex items-center justify-between">
                              隐私保护状态
                              <button onClick={() => setShowOriginalImage(!showOriginalImage)} className="text-primary-600 hover:text-primary-700 flex items-center gap-1">
                                {showOriginalImage ? <EyeOff size={12}/> : <Eye size={12}/>}
                                {showOriginalImage ? '隐藏原图' : '查看原图'}
                              </button>
                            </div>
                            <div className="text-[12px] text-neutral-500">检测到人脸、车牌，已自动模糊处理。如需微调可用画笔圈选。</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </>
          )}

          {/* ================= Consumer Workbench ================= */}
          {activeTab === 'consumer' && (
            <>
              {/* Left Column: 体验活动与参与者 */}
              <div className="w-[320px] bg-white border-r border-neutral-200 flex flex-col shrink-0">
                <div className="p-4 border-b border-neutral-100 font-bold text-[14px] text-neutral-800">体验活动与异常处理</div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3">
                  {consumerActivities.map(activity => (
                    <div key={activity.id} className="border border-neutral-200 rounded-xl overflow-hidden bg-white">
                      <div 
                        className={`p-3 cursor-pointer hover:bg-neutral-50 transition-colors ${activeActivity === activity.id && activeParticipant === null ? 'bg-primary-50/50' : ''}`}
                        onClick={() => {
                          setActiveActivity(activity.id);
                          setActiveParticipant(null);
                          setConsumerRightPanel('default');
                        }}
                      >
                        <div className="text-[11px] text-primary-600 font-bold mb-1">{activity.project}</div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-[13px] font-bold text-neutral-800 flex items-center gap-1.5">
                            <button onClick={(e) => { e.stopPropagation(); toggleActivity(activity.id); }}>
                              <ChevronRight size={14} className={`text-neutral-400 transition-transform ${expandedActivities.includes(activity.id) ? 'rotate-90' : ''}`} />
                            </button>
                            {activity.name}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-y-1 text-[11px] text-neutral-500">
                          <div>计划: {activity.quota}</div>
                          <div>已领: {activity.claimed}</div>
                          <div>问卷: {activity.surveyCompleted}</div>
                          <div>合格: {activity.qualified}</div>
                        </div>
                      </div>
                      
                      {expandedActivities.includes(activity.id) && (
                        <div className="bg-rose-50/30 border-t border-neutral-100 p-2 space-y-1">
                          <div className="text-[11px] font-bold text-rose-700 px-1 mb-1">仅显示异常需介入的参与者：</div>
                          {activity.participants.map(p => (
                            <div 
                              key={p.id} 
                              className={`p-2 rounded-lg border cursor-pointer transition-colors flex items-center justify-between ${
                                activeParticipant === p.id ? 'bg-white border-primary-300 shadow-sm' : 'bg-white border-neutral-100 hover:border-neutral-200'
                              }`}
                              onClick={() => {
                                setActiveActivity(activity.id);
                                setActiveParticipant(p.id);
                                setConsumerRightPanel('default');
                              }}
                            >
                              <div className="text-[12px] text-neutral-700 truncate pr-2 flex items-center gap-1.5">
                                <AlertCircle size={12} className="text-rose-500 shrink-0"/> {p.name}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Middle Column: 当前活动漏斗或参与者现场 */}
              <div className="flex-1 flex flex-col min-w-0 bg-[#f8f9fa] relative">
                {!activeParticipant ? (
                  // Activity Level Middle Column
                  <div className="p-6 h-full overflow-y-auto">
                    <h3 className="text-[20px] font-bold text-neutral-900 mb-6 flex items-center gap-2">
                      <Smartphone className="text-primary-600"/> 新品试吃官 - 漏斗与配置
                    </h3>
                    
                    <div className="grid grid-cols-6 gap-2 mb-8">
                      {[
                        { label: '名额', val: 100 }, { label: '领取', val: 85 }, 
                        { label: '问卷', val: 80 }, { label: '正文生成', val: 78 },
                        { label: '图片合格', val: 60 }, { label: '已发布', val: 45 }
                      ].map((step, i) => (
                        <div key={i} className="bg-white border border-neutral-200 rounded-lg p-3 text-center shadow-sm relative">
                          {i < 5 && <ArrowRight size={14} className="absolute -right-3 top-1/2 -translate-y-1/2 text-neutral-300 z-10 bg-[#f8f9fa]"/>}
                          <div className="text-[18px] font-bold text-neutral-800">{step.val}</div>
                          <div className="text-[11px] text-neutral-500">{step.label}</div>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
                        <h4 className="font-bold text-[14px] mb-4">消费者入口 H5 预览</h4>
                        <div className="aspect-[9/16] bg-neutral-100 rounded-lg border border-neutral-200 mx-auto w-48 flex items-center justify-center text-neutral-400 text-[12px]">H5 预览区</div>
                      </div>
                      <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm space-y-4">
                        <div>
                          <div className="font-bold text-[13px] text-neutral-700 mb-1">动态问题</div>
                          <div className="text-[12px] text-neutral-600 bg-neutral-50 p-2 rounded">宠物猫的品种？几岁了？最喜欢什么口味？</div>
                        </div>
                        <div>
                          <div className="font-bold text-[13px] text-neutral-700 mb-1">领取规则</div>
                          <div className="text-[12px] text-neutral-600 bg-neutral-50 p-2 rounded">需要 50 粉丝以上小红书账号...</div>
                        </div>
                        <div className="pt-4 border-t border-neutral-100 flex justify-center">
                          <div className="w-24 h-24 bg-neutral-100 rounded flex items-center justify-center text-neutral-400 text-[11px]">入口二维码</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Participant Level Middle Column
                  <div className="p-6 h-full overflow-y-auto">
                    <h3 className="text-[18px] font-bold text-neutral-900 mb-2">用户B - 异常处理现场</h3>
                    <div className="text-[13px] text-neutral-500 flex items-center gap-4 mb-6">
                      <span>唯一笔记 ID: N-88392</span>
                      <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded font-bold">异常: 连续三次图片不合格</span>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm">
                        <h4 className="font-bold text-[13px] text-neutral-800 mb-2">问卷摘要</h4>
                        <div className="text-[12px] text-neutral-600">英短，2岁，最爱鸡肉味。毛发偏干。</div>
                      </div>
                      <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm">
                        <h4 className="font-bold text-[13px] text-neutral-800 mb-2">AI 生成正文 (供消费者参考)</h4>
                        <div className="text-[12px] text-neutral-600 bg-neutral-50 p-2 rounded max-h-24 overflow-y-auto">
                          #春季上新 #猫咪试吃
                          我家2岁的英短主子最近毛发有点干，听说这款新品特别好...
                        </div>
                      </div>
                      <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm">
                        <h4 className="font-bold text-[13px] text-neutral-800 mb-3">三次质检记录</h4>
                        <div className="flex gap-4">
                          {[1, 2, 3].map(attempt => (
                            <div key={attempt} className="flex-1 bg-rose-50 border border-rose-100 rounded-lg p-2 text-center text-[12px]">
                              <div className="font-bold text-rose-800 mb-1">第 {attempt} 次上传</div>
                              <div className="text-rose-600">光线极暗，看不清产品</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: AI 判断与处理 / 调整面板 */}
              <div className="w-[340px] bg-white border-l border-neutral-200 flex flex-col shrink-0">
                {consumerRightPanel === 'adjust' ? (
                  <div className="flex-1 flex flex-col h-full animate-in slide-in-from-right-4">
                    <div className="p-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50">
                      <h3 className="font-bold text-[15px] text-neutral-900">调整活动规则</h3>
                      <button onClick={() => setConsumerRightPanel('default')} className="text-neutral-400 hover:text-neutral-600"><X size={16}/></button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 text-[13px]">
                      <div className="bg-amber-50 text-amber-800 p-2 rounded text-[12px] flex gap-1">
                        <Info size={14} className="shrink-0 mt-0.5"/> 计划参与人数与计划笔记数保持一致，不可独立修改。
                      </div>
                      <div>
                        <label className="block text-neutral-700 font-bold mb-1">动态问题</label>
                        <textarea className="w-full p-2 border border-neutral-200 rounded-lg resize-none h-12 outline-none focus:border-primary-500" defaultValue="宠物猫的品种？几岁了？"></textarea>
                      </div>
                      <div>
                        <label className="block text-neutral-700 font-bold mb-1">领取规则</label>
                        <textarea className="w-full p-2 border border-neutral-200 rounded-lg resize-none h-12 outline-none focus:border-primary-500" defaultValue="需要 50 粉丝以上小红书账号"></textarea>
                      </div>
                      <div>
                        <label className="block text-neutral-700 font-bold mb-1">排他规则</label>
                        <textarea className="w-full p-2 border border-neutral-200 rounded-lg resize-none h-12 outline-none focus:border-primary-500" defaultValue="不可与其他竞品活动同时参加"></textarea>
                      </div>
                      <div>
                        <label className="block text-neutral-700 font-bold mb-1">消费者看到的说明</label>
                        <textarea className="w-full p-2 border border-neutral-200 rounded-lg resize-none h-12 outline-none focus:border-primary-500" defaultValue="欢迎参加新品试吃！请在收到产品后3天内完成拍摄。"></textarea>
                      </div>
                      <div>
                        <label className="block text-neutral-700 font-bold mb-1">有效期</label>
                        <input type="text" className="w-full p-2 border border-neutral-200 rounded-lg outline-none" defaultValue="2026-08-01 23:59"/>
                      </div>
                    </div>
                    <div className="p-4 border-t border-neutral-100 bg-white">
                      <button className="w-full py-2 bg-neutral-900 text-white font-bold rounded-lg hover:bg-neutral-800 transition-colors" onClick={() => setConsumerRightPanel('default')}>保存调整</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="p-4 border-b border-neutral-100 bg-neutral-50">
                      <h3 className="font-bold text-[15px] text-neutral-900 flex items-center gap-2">
                        <Tag size={16} className="text-primary-600"/>
                        {!activeParticipant ? 'AI 活动健康度评估' : 'AI 异常处理建议'}
                      </h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
                      {!activeParticipant ? (
                        <div className="space-y-4">
                          <div className="bg-white border border-neutral-200 p-3 rounded-xl shadow-sm text-[13px]">
                            <div className="font-bold text-neutral-800 mb-2">流失环节分析</div>
                            <div className="text-rose-600 mb-2">正文生成 -&gt; 图片合格环节流失率达 23% (18人)。</div>
                            <div className="text-neutral-600">建议：检查拍摄要求是否过于严苛，或参考图不够清晰。普通合格图片系统已自动入库。</div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="bg-rose-50 border border-rose-100 p-3 rounded-xl text-[13px]">
                            <div className="font-bold text-rose-800 mb-1">卡住原因</div>
                            <div className="text-rose-700">消费者多次拍摄未能达到清晰度和主体占比要求。</div>
                            <div className="font-bold text-rose-800 mt-3 mb-1">AI 建议</div>
                            <div className="text-rose-700">发送具体示例图对比，并重新开放1次上传权限。如果产品已拆封体验完毕，也可选择终止本次领取。</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </>
          )}

          {/* ================= Progress Tab ================= */}
          {activeTab === 'progress' && (
            <div className="flex-1 overflow-y-auto p-8 bg-neutral-50 custom-scrollbar">
              <div className="max-w-6xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-[20px] font-bold text-neutral-900">素材进度大盘</h3>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-[13px] font-bold text-neutral-700 flex items-center gap-1.5"><Filter size={14}/> 筛选</button>
                    <button className="px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-[13px] font-bold text-neutral-700 flex items-center gap-1.5"><Download size={14}/> 导出报表</button>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { label: '总素材需求', val: '320', sub: '篇笔记', color: 'text-neutral-800' },
                    { label: '已分配 / 拍摄中', val: '145', sub: '占 45%', color: 'text-blue-600' },
                    { label: '待审核 (AI/人工)', val: '86', sub: '占 27%', color: 'text-amber-600' },
                    { label: '已完成 (入库)', val: '89', sub: '占 28%', color: 'text-emerald-600' }
                  ].map((stat, i) => (
                    <div key={i} className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm">
                      <div className="text-[13px] text-neutral-500 mb-2">{stat.label}</div>
                      <div className={`text-[28px] font-bold ${stat.color} mb-1`}>{stat.val}</div>
                      <div className="text-[12px] text-neutral-400">{stat.sub}</div>
                    </div>
                  ))}
                </div>

                <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="p-4 border-b border-neutral-100 font-bold text-[14px] text-neutral-800 bg-neutral-50">按项目查看进度</div>
                  <div className="divide-y divide-neutral-100">
                    {[
                      { name: '双11大促 (员工拍摄)', total: 120, done: 60, wait: 20, shooting: 40 },
                      { name: '春季新品体验 (消费者)', total: 100, done: 20, wait: 60, shooting: 20 },
                      { name: '日常种草铺量', total: 100, done: 9, wait: 6, shooting: 85 }
                    ].map((item, i) => (
                      <div key={i} className="p-4 flex items-center gap-6 hover:bg-neutral-50 transition-colors">
                        <div className="w-[200px] shrink-0 font-bold text-[14px] text-neutral-800">{item.name}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden flex">
                              <div style={{width: `${(item.done/item.total)*100}%`}} className="h-full bg-emerald-500"></div>
                              <div style={{width: `${(item.wait/item.total)*100}%`}} className="h-full bg-amber-400"></div>
                              <div style={{width: `${(item.shooting/item.total)*100}%`}} className="h-full bg-blue-500"></div>
                            </div>
                            <span className="text-[12px] font-bold text-neutral-700 w-12 text-right">{Math.round((item.done/item.total)*100)}%</span>
                          </div>
                          <div className="flex gap-4 text-[11px] text-neutral-500">
                            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> 已齐 {item.done}</span>
                            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span> 待审 {item.wait}</span>
                            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> 拍摄中 {item.shooting}</span>
                          </div>
                        </div>
                        <div className="w-[100px] shrink-0 flex justify-end">
                          <button className="text-[12px] text-primary-600 font-bold hover:text-primary-700">查看详情</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= Exception Tab ================= */}
          {activeTab === 'exception' && (
            <div className="flex-1 overflow-y-auto p-8 bg-neutral-50 custom-scrollbar">
              <div className="max-w-5xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-[20px] font-bold text-neutral-900">全局异常处理</h3>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-[13px] font-bold text-neutral-700 flex items-center gap-1.5">未处理 (5)</button>
                    <button className="px-3 py-1.5 bg-neutral-100 text-neutral-500 rounded-lg text-[13px] font-bold flex items-center gap-1.5">已忽略</button>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { type: 'timeout', title: '员工拍摄超时', desc: '张三 (双11大促 - 门店喂食场景) 超时 2 小时未回传。', project: '双11大促' },
                    { type: 'quality', title: '消费者反复不合格', desc: '用户B (春季新品体验) 连续3次回传图片均被AI判为模糊。', project: '春季上新体验' },
                    { type: 'ai', title: 'AI 识别冲突', desc: '系统自动合并拍摄需求时发现2篇笔记的参考风格截然相反。', project: '日常种草' },
                    { type: 'timeout', title: '体验领取停滞', desc: '用户A 领取名额后超过 48 小时未填写调查问卷。', project: '春季上新体验' },
                  ].map((exc, i) => (
                    <div key={i} className="bg-white border border-neutral-200 rounded-xl p-5 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
                      <div className={`p-2 rounded-lg shrink-0 ${exc.type === 'timeout' ? 'bg-amber-50 text-amber-600' : exc.type === 'quality' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'}`}>
                        <AlertOctagon size={20} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-[15px] font-bold text-neutral-900">{exc.title}</h4>
                          <span className="px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded text-[11px] font-medium">{exc.project}</span>
                        </div>
                        <p className="text-[13px] text-neutral-600 mb-3">{exc.desc}</p>
                        <div className="flex items-center gap-2">
                          <button className="px-4 py-1.5 bg-neutral-900 text-white rounded-lg text-[12px] font-bold hover:bg-neutral-800 transition-colors">立即处理</button>
                          <button className="px-4 py-1.5 bg-white border border-neutral-200 text-neutral-700 rounded-lg text-[12px] font-bold hover:bg-neutral-50 transition-colors">通知负责人</button>
                          <button className="px-4 py-1.5 text-neutral-400 hover:text-neutral-600 text-[12px] font-bold transition-colors">忽略</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ================= Bottom Fixed Action Bar ================= */}
        {activeTab === 'employee' && (
          <div className="h-16 bg-white border-t border-neutral-200 flex items-center justify-between px-6 shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-20">
            <div className="text-[13px] text-neutral-500">当前任务状态: <span className="font-bold text-neutral-800">{employeeStatus}</span></div>
            <div className="flex gap-3">
              {employeeStatus === '未派发' && (
                <button className="px-6 py-2 bg-neutral-900 text-white rounded-xl text-[13px] font-bold hover:bg-neutral-800 transition-colors">确认并派发，看下一组</button>
              )}
              {employeeStatus === '拍摄中' && (
                <>
                  <button className="px-4 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-xl text-[13px] font-bold hover:bg-neutral-50 transition-colors">延长截止时间</button>
                  <button className="px-6 py-2 bg-neutral-900 text-white rounded-xl text-[13px] font-bold hover:bg-neutral-800 transition-colors">发送提醒</button>
                </>
              )}
              {employeeStatus === '有回传' && (
                <button className="px-6 py-2 bg-neutral-900 text-white rounded-xl text-[13px] font-bold hover:bg-neutral-800 transition-colors">采用可用素材并看下一组</button>
              )}
              {employeeStatus === '有缺口' && (
                <button className="px-6 py-2 bg-rose-600 text-white rounded-xl text-[13px] font-bold hover:bg-rose-700 transition-colors">确认补拍说明并发送</button>
              )}
              {employeeStatus === '全部已齐' && (
                <button className="px-6 py-2 bg-emerald-600 text-white rounded-xl text-[13px] font-bold hover:bg-emerald-700 transition-colors">进入笔记发布准备</button>
              )}
            </div>
          </div>
        )}

        {activeTab === 'consumer' && (
          <div className="h-16 bg-white border-t border-neutral-200 flex items-center justify-between px-6 shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-20">
            {!activeParticipant ? (
              <>
                <div className="text-[13px] text-neutral-500">活动层级操作</div>
                <div className="flex gap-3">
                  <button onClick={() => setConsumerRightPanel('adjust')} className="px-4 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-xl text-[13px] font-bold hover:bg-neutral-50 transition-colors">调整活动</button>
                  <button className="px-4 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-xl text-[13px] font-bold hover:bg-neutral-50 transition-colors">预览消费者 H5</button>
                  <button className="px-6 py-2 bg-neutral-900 text-white rounded-xl text-[13px] font-bold hover:bg-neutral-800 transition-colors">复制领取入口</button>
                </div>
              </>
            ) : (
              <>
                <div className="text-[13px] text-neutral-500">
                  <button onClick={() => setActiveParticipant(null)} className="flex items-center gap-1 hover:text-neutral-800 transition-colors">
                    <ChevronDown size={14} className="rotate-90"/> 返回活动进度
                  </button>
                </div>
                <div className="flex gap-3">
                  <button className="px-4 py-2 bg-white border border-neutral-200 text-rose-600 rounded-xl text-[13px] font-bold hover:bg-rose-50 transition-colors">终止本次领取</button>
                  <button className="px-4 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-xl text-[13px] font-bold hover:bg-neutral-50 transition-colors">重新开放一次上传</button>
                  <button className="px-6 py-2 bg-neutral-900 text-white rounded-xl text-[13px] font-bold hover:bg-neutral-800 transition-colors">发送具体补拍说明</button>
                </div>
              </>
            )}
          </div>
        )}

        {/* ================= 底部轻量状态条：服务器临时素材 ================= */}
        <div className="h-10 bg-neutral-900 text-neutral-300 text-[12px] flex items-center justify-between px-6 shrink-0 z-30 relative">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 font-bold text-white"><Server size={14} className="text-neutral-400" /> 服务器临时素材</span>
            <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> 占用量: 1.2GB / 5GB</span>
            <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> 下次清理: 3天后</span>
            <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> 已标记保留: 24 张</span>
          </div>
          <button className="hover:text-white transition-colors flex items-center gap-1.5 bg-neutral-800 px-3 py-1 rounded">
            <FolderOpen size={14} />
            查看并选择保存
          </button>
        </div>

      </div>
    </div>
  );
}

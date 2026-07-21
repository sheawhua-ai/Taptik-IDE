import React, { useState } from 'react';
import { 
  Activity, ArrowUp, ArrowUpRight, MessageSquare, Target, 
  LineChart, Sparkles, Plus, Clock, RefreshCw, Zap,
  X, BarChart2, Layers, CreditCard, Workflow, Search, Compass, 
  ArrowRight, ShieldAlert, AlertTriangle, FileText, CheckCircle, Database, ChevronRight, Eye, UserPlus, Bookmark, Send, ChevronDown, Image
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DataCenterProps {
  dataSubNav: string;
  setDataSubNav: (val: any) => void;
  setActiveNav: (nav: string) => void;
}

export const DataCenter: React.FC<DataCenterProps> = ({ dataSubNav, setDataSubNav, setActiveNav }) => {
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [selectedDashboard, setSelectedDashboard] = useState<any | null>(null);
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState('全部');
  const [tempAnalysisQuery, setTempAnalysisQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [attributionTab, setAttributionTab] = useState('发现结论');
  const [attributionFilter, setAttributionFilter] = useState('全部笔记');
  const [actionConfirmPopup, setActionConfirmPopup] = useState<{title: string, action: string} | null>(null);

  // Scheduled Reports State
  const [selectedReportTab, setSelectedReportTab] = useState('项目复盘');
  const [isGenerateReportOpen, setIsGenerateReportOpen] = useState(false);
  const [isEvidenceDrawerOpen, setIsEvidenceDrawerOpen] = useState(false);
  const [isExperienceDrawerOpen, setIsExperienceDrawerOpen] = useState(false);
  const [isReportEditorOpen, setIsReportEditorOpen] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState<any | null>(null);
  const [selectedExperience, setSelectedExperience] = useState<any | null>(null);

  const renderReportDrawers = () => {
    return (
      <>
        {/* 生成报告抽屉 */}
        <AnimatePresence>
          {isGenerateReportOpen && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25, ease: 'easeOut' }}
              className="absolute inset-y-0 right-0 w-[500px] bg-white border-l border-neutral-200 shadow-2xl z-20 flex flex-col"
            >
              <div className="h-16 flex items-center justify-between px-6 border-b border-neutral-100 shrink-0 bg-neutral-900 text-white">
                <h3 className="font-semibold text-[15px]">生成复盘报告</h3>
                <button onClick={() => setIsGenerateReportOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors">
                  <X size={18} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div>
                  <div className="text-[13px] font-bold text-neutral-900 mb-2">报告类型</div>
                  <div className="grid grid-cols-3 gap-2">
                    {['项目复盘', '客户汇报', '投流复盘'].map((type, i) => (
                      <button key={i} className={`py-2 text-[12px] font-bold rounded-lg border ${i === 0 ? 'bg-primary-50 border-primary-200 text-primary-700' : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'}`}>
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-[13px] font-bold text-neutral-900 mb-2">复盘范围</div>
                  <div className="grid grid-cols-2 gap-2">
                    {['Q2 幼犬粮推新项目', '全商家大盘', '指定账号矩阵', '指定内容批次'].map((scope, i) => (
                      <button key={i} className={`py-2 text-[12px] font-bold rounded-lg border ${i === 0 ? 'bg-primary-50 border-primary-200 text-primary-700' : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'}`}>
                        {scope}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-[13px] font-bold text-neutral-900 mb-2">面向对象</div>
                  <div className="grid grid-cols-3 gap-2">
                    {['内部团队', '客户方', '个人复盘'].map((target, i) => (
                      <button key={i} className={`py-2 text-[12px] font-bold rounded-lg border ${i === 0 ? 'bg-primary-50 border-primary-200 text-primary-700' : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'}`}>
                        {target}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-[13px] font-bold text-neutral-900 mb-2">报告重点</div>
                  <div className="grid grid-cols-2 gap-2">
                    {['效果与结论', '问题与改进', '下一步执行建议', '投流策略调优'].map((focus, i) => (
                      <button key={i} className={`py-2 text-[12px] font-bold rounded-lg border ${i === 0 || i === 2 ? 'bg-primary-50 border-primary-200 text-primary-700' : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'}`}>
                        {focus}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-[13px] font-bold text-neutral-900 mb-2">数据口径</div>
                  <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100 space-y-3">
                    <label className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked className="rounded border-neutral-300 text-primary-600 focus:ring-primary-600" />
                      <span className="text-[13px] text-neutral-700">小红书自然流笔记（已接入）</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked className="rounded border-neutral-300 text-primary-600 focus:ring-primary-600" />
                      <span className="text-[13px] text-neutral-700">手动回传私信线索（含手工单）</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked className="rounded border-neutral-300 text-primary-600 focus:ring-primary-600" />
                      <span className="text-[13px] text-neutral-700">聚光投流消耗数据（已接入）</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" className="rounded border-neutral-300 text-primary-600 focus:ring-primary-600" />
                      <span className="text-[13px] text-neutral-400">低置信推断数据（展示可能不准的推测）</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-neutral-100 shrink-0 flex gap-3">
                <button 
                  onClick={() => setIsGenerateReportOpen(false)}
                  className="flex-1 py-3 bg-white border border-neutral-200 text-neutral-700 rounded-xl text-[13px] font-bold hover:bg-neutral-50 transition-colors"
                >
                  取消
                </button>
                <button 
                  onClick={() => setIsGenerateReportOpen(false)}
                  className="flex-[2] py-3 bg-primary-600 text-white rounded-xl text-[13px] font-bold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 shadow-md shadow-primary-600/20"
                >
                  <Sparkles size={16} /> 开始生成
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 证据下钻抽屉 */}
        <AnimatePresence>
          {isEvidenceDrawerOpen && selectedEvidence && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25, ease: 'easeOut' }}
              className="absolute inset-y-0 right-0 w-[500px] bg-white border-l border-neutral-200 shadow-2xl z-20 flex flex-col"
            >
              <div className="h-16 flex items-center justify-between px-6 border-b border-neutral-100 shrink-0 bg-neutral-900 text-white">
                <h3 className="font-semibold text-[15px]">报告证据链</h3>
                <button onClick={() => setIsEvidenceDrawerOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors">
                  <X size={18} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-neutral-50/50">
                <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm">
                  <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-2">{selectedEvidence.group}</div>
                  <h4 className="text-[16px] font-bold text-neutral-900 mb-4">{selectedEvidence.metric}：<span className="text-primary-600">{selectedEvidence.value}</span></h4>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-100">
                    <div>
                      <div className="text-[11px] text-neutral-400 mb-1">数据来源</div>
                      <div className="text-[13px] font-bold text-neutral-700">小红书自然流、投流报表</div>
                    </div>
                    <div>
                      <div className="text-[11px] text-neutral-400 mb-1">置信度</div>
                      <div className="text-[13px] font-bold text-neutral-900">极高（100% 接入真实数据）</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-[14px] font-bold text-neutral-900 mb-4 flex items-center justify-between">
                    <span>相关笔记 {selectedEvidence.evidence}</span>
                    <button className="text-[12px] text-primary-600 font-bold hover:text-primary-700 bg-primary-50 px-3 py-1.5 rounded-lg transition-colors">
                      查看全部明细
                    </button>
                  </h4>
                  <div className="space-y-3">
                    {[
                      { title: '换粮拉稀？你可能做错了这三步', account: '养宠日记', type: '自然流', stat: '转化率 4.5%' },
                      { title: '幼犬刚到家，第一口粮怎么选', account: '新手铲屎官', type: '投流', stat: '线索成本 ￥32' },
                      { title: '软便克星，这三款平价粮绝了', account: '宠物大百科', type: '自然流', stat: '转化率 3.8%' }
                    ].map((note, i) => (
                      <div key={i} className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm flex items-center justify-between gap-4 cursor-pointer hover:border-primary-300 transition-colors">
                        <div className="overflow-hidden">
                          <div className="text-[13px] font-bold text-neutral-900 truncate mb-1">{note.title}</div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-neutral-500">{note.account}</span>
                            <span className="text-[10px] font-bold text-primary-600 bg-primary-50 px-1.5 py-0.5 rounded">{note.type}</span>
                          </div>
                        </div>
                        <div className="text-[12px] font-bold text-neutral-700 bg-neutral-100 px-2 py-1 rounded shrink-0">
                          {note.stat}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="p-4 border-t border-neutral-100 shrink-0 bg-white grid grid-cols-2 gap-3">
                <button className="py-2.5 bg-white border border-neutral-200 text-neutral-900 rounded-xl text-[13px] font-bold hover:bg-neutral-50 transition-colors shadow-sm">
                  转成机会事件
                </button>
                <button className="py-2.5 bg-white border border-neutral-200 text-neutral-900 rounded-xl text-[13px] font-bold hover:bg-neutral-50 transition-colors shadow-sm">
                  提炼为经验
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 经验沉淀抽屉 */}
        <AnimatePresence>
          {isExperienceDrawerOpen && selectedExperience && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25, ease: 'easeOut' }}
              className="absolute inset-y-0 right-0 w-[500px] bg-white border-l border-neutral-200 shadow-2xl z-20 flex flex-col"
            >
              <div className="h-16 flex items-center justify-between px-6 border-b border-neutral-100 shrink-0 bg-neutral-900 text-white">
                <h3 className="font-semibold text-[15px]">确认沉淀经验</h3>
                <button onClick={() => setIsExperienceDrawerOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors">
                  <X size={18} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-neutral-50/50">
                <div>
                  <div className="text-[13px] font-bold text-neutral-900 mb-2">经验内容</div>
                  <textarea 
                    className="w-full h-24 p-4 bg-white border border-neutral-200 rounded-xl text-[14px] text-neutral-700 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all resize-none shadow-sm"
                    defaultValue={selectedExperience.title}
                  />
                </div>

                <div>
                  <div className="text-[13px] font-bold text-neutral-900 mb-3">沉淀位置建议</div>
                  <div className="space-y-3">
                    {[
                      { title: '商家记忆 (Q2幼犬项目)', desc: '仅该商家可见，影响该商家的全局策略', checked: false },
                      { title: '团队公共经验库', desc: '全团队可见，作为通用行业打法积累', checked: false },
                      { title: '内容 Skill (内容方向生成器)', desc: '下次执行类似项目时，系统将自动调用此规则', checked: true }
                    ].map((dest, i) => (
                      <label key={i} className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${dest.checked ? 'bg-primary-50/50 border-primary-200' : 'bg-white border-neutral-200 hover:bg-neutral-50'}`}>
                        <input type="checkbox" defaultChecked={dest.checked} className="mt-0.5 rounded border-neutral-300 text-primary-600 focus:ring-primary-600" />
                        <div>
                          <div className={`text-[13px] font-bold mb-0.5 ${dest.checked ? 'text-primary-900' : 'text-neutral-900'}`}>{dest.title}</div>
                          <div className={`text-[12px] ${dest.checked ? 'text-primary-600/80' : 'text-neutral-500'}`}>{dest.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="p-4 border-t border-neutral-100 shrink-0 bg-white grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setIsExperienceDrawerOpen(false)}
                  className="py-3 bg-white border border-neutral-200 text-neutral-700 rounded-xl text-[13px] font-bold hover:bg-neutral-50 transition-colors shadow-sm"
                >
                  仅保存报告
                </button>
                <button 
                  onClick={() => setIsExperienceDrawerOpen(false)}
                  className="py-3 bg-primary-600 text-white rounded-xl text-[13px] font-bold hover:bg-primary-700 transition-colors shadow-md shadow-primary-600/20"
                >
                  确认沉淀
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* 报告编辑抽屉 */}
        <AnimatePresence>
          {isReportEditorOpen && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25, ease: 'easeOut' }}
              className="absolute inset-y-0 right-0 w-[600px] bg-white border-l border-neutral-200 shadow-2xl z-20 flex flex-col"
            >
              <div className="h-16 flex items-center justify-between px-6 border-b border-neutral-100 shrink-0 bg-neutral-900 text-white">
                <h3 className="font-semibold text-[15px]">编辑复盘报告 (客户版)</h3>
                <button onClick={() => setIsReportEditorOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors">
                  <X size={18} />
                </button>
              </div>
              
              <div className="p-4 border-b border-neutral-100 bg-neutral-50/50 flex gap-2 overflow-x-auto custom-scrollbar shrink-0">
                <button className="px-4 py-2 bg-primary-50 text-primary-700 border border-primary-200 rounded-lg text-[13px] font-bold flex items-center gap-2 whitespace-nowrap">
                  <Sparkles size={14} /> 智能改写客户口吻
                </button>
                <button className="px-4 py-2 bg-white text-neutral-700 border border-neutral-200 rounded-lg text-[13px] font-medium whitespace-nowrap hover:bg-neutral-50">
                  隐藏低置信数据
                </button>
                <button className="px-4 py-2 bg-white text-neutral-700 border border-neutral-200 rounded-lg text-[13px] font-medium whitespace-nowrap hover:bg-neutral-50">
                  隐藏内部问题
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 bg-neutral-50/30">
                <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm p-8 space-y-6">
                  <div className="text-center pb-6 border-b border-neutral-100">
                    <h2 className="text-xl font-bold text-neutral-900 mb-2">Q2 幼犬粮推新项目汇报</h2>
                    <p className="text-[13px] text-neutral-500">向品牌方汇报周期效果</p>
                  </div>
                  
                  <div>
                    <h4 className="text-[14px] font-bold text-neutral-900 mb-2">核心结论</h4>
                    <textarea 
                      className="w-full h-24 p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-[13px] text-neutral-700 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 resize-none"
                      defaultValue="本期项目超额完成目标，曝光量超出预期 20%，CPA 降低 15%。核心增量来自于“软便避坑”选题与“素人开箱”素材的组合打法。"
                    />
                  </div>

                  <div>
                    <h4 className="text-[14px] font-bold text-neutral-900 mb-2">亮点数据</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 border border-neutral-200 rounded-xl bg-neutral-50">
                        <span className="text-[13px] text-neutral-700">总产出线索: 2,450</span>
                        <input type="checkbox" defaultChecked className="rounded border-neutral-300 text-primary-600 focus:ring-primary-600" />
                      </div>
                      <div className="flex items-center justify-between p-3 border border-neutral-200 rounded-xl bg-neutral-50">
                        <span className="text-[13px] text-neutral-700">幼犬软便选题转化率: 3.2% (+15%)</span>
                        <input type="checkbox" defaultChecked className="rounded border-neutral-300 text-primary-600 focus:ring-primary-600" />
                      </div>
                      <div className="flex items-center justify-between p-3 border border-neutral-200 rounded-xl bg-neutral-50">
                        <span className="text-[13px] text-neutral-700">素人号互动成本: ￥2.4 (-20%)</span>
                        <input type="checkbox" defaultChecked className="rounded border-neutral-300 text-primary-600 focus:ring-primary-600" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[14px] font-bold text-neutral-900 mb-2">内部待解决问题 (当前已隐藏)</h4>
                    <div className="p-3 border border-dashed border-primary-200 rounded-xl bg-primary-50/50 text-[13px] text-primary-700/60 line-through">
                      达人响应慢，导致发布节奏断档。
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[14px] font-bold text-neutral-900 mb-2">下一步计划</h4>
                    <textarea 
                      className="w-full h-24 p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-[13px] text-neutral-700 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 resize-none"
                      defaultValue="1. 增加素人号投放比例，优化投放结构。\n2. 将“软便避坑”选题横向拓展至“泪痕”、“黑下巴”等健康方向。\n3. 加快优质内容的产出节奏。"
                    />
                  </div>
                </div>
              </div>
              
              <div className="p-4 border-t border-neutral-100 shrink-0 bg-white flex gap-3">
                <button 
                  onClick={() => setIsReportEditorOpen(false)}
                  className="flex-1 py-3 bg-white border border-neutral-200 text-neutral-900 rounded-xl text-[13px] font-bold hover:bg-neutral-50 transition-colors shadow-sm"
                >
                  取消
                </button>
                <button className="flex-1 py-3 bg-white border border-neutral-200 text-neutral-900 rounded-xl text-[13px] font-bold hover:bg-neutral-50 transition-colors shadow-sm">
                  复制文本
                </button>
                <button className="flex-1 py-3 bg-primary-600 text-white rounded-xl text-[13px] font-bold hover:bg-primary-700 transition-colors shadow-sm">
                  同步到飞书
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  };

  const renderDrawer = () => {
    if (!selectedItem) return null;
    return (
      <AnimatePresence>
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'tween', duration: 0.25, ease: 'easeOut' }}
          className="absolute inset-y-0 right-0 w-[400px] bg-white border-l border-neutral-200 shadow-2xl z-50 flex flex-col"
        >
          <div className="h-16 flex items-center justify-between px-6 border-b border-neutral-100 shrink-0 bg-neutral-900 text-white">
            <h3 className="font-semibold text-[15px]">洞察与动作</h3>
            <button onClick={() => setSelectedItem(null)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <X size={18} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            <div>
              <h2 className="text-xl font-bold text-neutral-900 mb-2">{selectedItem.title}</h2>
              <div className="inline-flex px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider items-center gap-1.5 bg-primary-50 text-primary-700">
                <Sparkles size={14} />
                系统判断
              </div>
            </div>
            
            <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-100 space-y-4">
              <div>
                <h4 className="text-[12px] font-bold text-neutral-900 mb-1 uppercase tracking-widest">系统诊断结论</h4>
                <p className="text-[14px] text-neutral-600 leading-relaxed">{selectedItem.aiJudgment || '数据表现优异，建议继续保持当前策略并适度放量。'}</p>
              </div>
              <div className="pt-4 border-t border-neutral-200">
                <h4 className="text-[12px] font-bold text-neutral-900 mb-1 uppercase tracking-widest">证据支撑</h4>
                <p className="text-[14px] text-neutral-600 leading-relaxed">{selectedItem.evidence || '基于近 7 天 12 篇笔记的综合表现计算得出。'}</p>
              </div>
            </div>

            <div>
              <h4 className="text-[12px] font-bold text-neutral-400 mb-3 uppercase tracking-widest">影响对象</h4>
              <div className="flex flex-wrap items-center gap-2">
                {(selectedItem.impacts || ['全局项目策略', 'A01 测试号', '科普类内容包']).map((imp: string, i: number) => (
                  <span key={i} className="px-3 py-1.5 bg-neutral-100 text-neutral-700 text-[13px] rounded-lg border border-neutral-200 font-medium">
                    {imp}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-neutral-50/80 rounded-2xl p-5 border border-neutral-100">
              <h4 className="text-[12px] font-bold text-neutral-900 mb-2 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles size={14} className="text-primary-500" /> 建议动作
              </h4>
              <p className="text-[14px] text-neutral-900 font-medium leading-relaxed">{selectedItem.aiSuggestion || '将此组合沉淀为标准打法，并在下一轮项目中复用。'}</p>
            </div>
          </div>

          <div className="p-6 border-t border-neutral-100 bg-white space-y-3">
            <button 
              onClick={() => {
                const item = selectedItem;
                setSelectedItem(null);
                window.dispatchEvent(
                  new CustomEvent("start-ai-action", {
                    detail: { 
                      task: {
                        id: 'data_insight_' + Date.now(),
                        title: item.title,
                        aiActionText: item.actionText || '执行建议动作',
                        context: item.aiSuggestion || '无具体建议',
                      }
                    }
                  })
                );
              }}
              className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-[14px] font-bold shadow-md transition-colors flex items-center justify-center gap-2"
            >
              {selectedItem.actionText || '执行建议动作'} <ArrowRight size={16} />
            </button>
            <div className="text-center text-[11px] text-neutral-400 font-medium pb-2">
              执行后流向：{selectedItem.flowTo || '策略知识库'}
            </div>
            
            <div className="relative mt-4">
              <input
                type="text"
                placeholder="告诉系统 你的判断，例如：这几篇不是内容问题..."
                className="w-full pl-4 pr-10 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-[12px] placeholder:text-neutral-400 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/10 transition-all"
              />
              <button className="absolute right-2 top-1/2 -tranneutral-y-1/2 w-7 h-7 bg-neutral-900 text-white rounded-lg flex items-center justify-center hover:bg-neutral-800 transition-colors">
                <ArrowUp size={14} />
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white overflow-hidden relative">
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-neutral-50/30 relative">
        {dataSubNav === 'dashboards' && !selectedDashboard && !tempAnalysisQuery && (
          <div className="p-8 space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-xl font-semibold text-neutral-900 tracking-tight mb-1">数据工作区</h3>
                <p className="text-[13px] text-neutral-400">问一次数据，有价值就固化成长期监控看板</p>
              </div>
            </div>

            <div className="bg-neutral-900 text-white rounded-[32px] p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl shrink-0">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
                  <Sparkles size={24} className="text-primary-300" />
                </div>
                <div>
                  <h3 className="text-[12px] text-white/50 font-bold uppercase tracking-widest mb-1.5">系统洞察</h3>
                  <p className="text-[16px] leading-relaxed">
                    本周私信增长主要来自“幼犬软便避坑”，但 A03 账号连续 3 天互动异常。
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="px-6 py-3 bg-white border border-neutral-200 text-neutral-900 rounded-xl text-[13px] font-bold hover:bg-neutral-100 transition-colors shadow-sm shrink-0 whitespace-nowrap">
                  查看证据
                </button>
                <button className="px-6 py-3 bg-white text-neutral-900 rounded-xl text-[13px] font-bold hover:bg-neutral-100 transition-colors shadow-sm shrink-0 whitespace-nowrap">
                  转成机会
                </button>
              </div>
            </div>

            <div className="relative shrink-0">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchInput.trim()) {
                    setTempAnalysisQuery(searchInput);
                  }
                }}
                placeholder="问数据，例如：本周哪些内容方向带来私信最多？排除投流，只看自然流。"
                className="w-full pl-5 pr-14 py-4 bg-white border border-neutral-200 rounded-2xl text-[14px] placeholder:text-neutral-400 focus:outline-none focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/10 transition-all shadow-sm"
              />
              <button 
                onClick={() => {
                  if (searchInput.trim()) {
                    setTempAnalysisQuery(searchInput);
                  }
                }}
                className="absolute right-3 top-1/2 -tranneutral-y-1/2 w-10 h-10 bg-neutral-900 text-white rounded-xl flex items-center justify-center hover:bg-neutral-800 transition-colors shadow-sm"
              >
                <Search size={18} />
              </button>
            </div>

            <div className="flex gap-2 border-b border-neutral-200 pb-4 overflow-x-auto custom-scrollbar shrink-0">
              {['全部', '增长监控', '内容表现', '账号健康', '素材效果', '投流表现', '转化线索', '团队共享'].map((tab, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveWorkspaceTab(tab)}
                  className={`px-4 py-2 rounded-lg text-[13px] font-medium whitespace-nowrap transition-colors ${activeWorkspaceTab === tab ? 'bg-white shadow-sm border border-neutral-200 text-neutral-900' : 'text-neutral-500 hover:text-neutral-900 hover:bg-white/50'}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-10">
              {[
                { name: '内容方向私信转化', question: '哪些内容方向带来私信最多？', anomaly: '幼犬软便避坑贡献 65% 私信', scope: '本周｜自然流｜排除投流', source: '系统创建', tab: '内容表现' },
                { name: '全局盘子健康度', question: '整体曝光、互动、转化及异常指标？', anomaly: 'A03 账号连续 3 天互动异常', scope: '近7天｜全部账号', source: '系统', tab: '增长监控' },
                { name: '素材 ROI 分析', question: '哪类素材带来的线索成本最低？', anomaly: '真实喂食封面效果最佳', scope: '本月｜含投流', source: '系统', tab: '素材效果' },
                { name: '投流消耗监控', question: '各计划投产比与起量情况？', anomaly: '无异常', scope: '今日｜所有计划', source: '团队共享', tab: '投流表现' },
                { name: '账号互动异常', question: '哪些账号互动率低于大盘均值？', anomaly: 'A03 互动率下降 40%', scope: '本周｜矩阵号', source: '系统', tab: '账号健康' },
                { name: '线索成本飙升预警', question: '转化线索成本是否超过警戒线？', anomaly: 'CPA 涨幅超过 20%', scope: '本周｜含投流', source: '系统', tab: '转化线索' }
              ].filter(b => activeWorkspaceTab === '全部' || b.tab === activeWorkspaceTab).map((board, i) => (
                <div 
                  key={i} 
                  onClick={() => setSelectedDashboard(board)}
                  className="bg-white border border-neutral-200 rounded-[24px] p-6 shadow-sm flex flex-col justify-between hover:border-primary-300 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="text-[16px] font-bold text-neutral-900">{board.name}</h4>
                  </div>
                  <div className="space-y-3 mb-6">
                    <div>
                      <div className="text-[11px] text-neutral-400 mb-1">问题</div>
                      <div className="text-[13px] text-neutral-700 font-medium">{board.question}</div>
                    </div>
                    <div>
                      <div className="text-[11px] text-neutral-400 mb-1">最近结论</div>
                      <div className={`text-[13px] font-bold ${board.anomaly === '无异常' ? 'text-neutral-500' : 'text-primary-600'}`}>{board.anomaly}</div>
                    </div>
                    <div>
                      <div className="text-[11px] text-neutral-400 mb-1">范围</div>
                      <div className="text-[12px] text-neutral-500">{board.scope}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                    <span className="text-[11px] font-medium px-2 py-1 bg-neutral-50 rounded text-neutral-500">{board.source}</span>
                    <span className="text-[11px] text-neutral-400">10 分钟前更新</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {dataSubNav === 'dashboards' && !selectedDashboard && tempAnalysisQuery && (
          <div className="p-8 space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <button onClick={() => { setTempAnalysisQuery(''); setSearchInput(''); }} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-neutral-100 text-neutral-500 transition-colors">
                  <ChevronRight size={20} className="rotate-180" />
                </button>
                <div>
                  <h3 className="text-xl font-semibold text-neutral-900 tracking-tight mb-1">临时分析：{tempAnalysisQuery}</h3>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-5 py-2 bg-neutral-900 text-white text-[13px] font-bold rounded-xl shadow-sm hover:bg-neutral-800 transition-colors">
                  保存为看板
                </button>
                <button className="px-5 py-2 bg-white border border-neutral-200 text-neutral-700 text-[13px] font-bold rounded-xl shadow-sm hover:bg-neutral-50 transition-colors">
                  转成机会
                </button>
                <button className="px-5 py-2 bg-white border border-neutral-200 text-neutral-700 text-[13px] font-bold rounded-xl shadow-sm hover:bg-neutral-50 transition-colors">
                  修改口径
                </button>
              </div>
            </div>

            <div className="bg-primary-50/50 border border-primary-100 rounded-2xl p-6 shrink-0 flex flex-col gap-5">
              <div className="flex items-start gap-3">
                <Sparkles size={20} className="text-primary-500 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-[14px] font-bold text-primary-900 mb-1">系统结论</h5>
                  <p className="text-[14px] text-primary-800/80 leading-relaxed">
                    本周私信主要由 <span className="font-bold">幼犬软便避坑</span> 贡献（65%）。由于排除了投流影响，该方向的自然流转化效率远超大盘，建议立即将该方向加入重点追投资源。
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-5 border-t border-primary-100/50">
                <div>
                  <div className="text-[11px] text-primary-400 mb-1">数据口径</div>
                  <div className="text-[13px] text-primary-900 font-bold">本周｜自然流｜排除投流</div>
                </div>
                <div>
                  <div className="text-[11px] text-primary-400 mb-1">建议动作</div>
                  <div className="text-[13px] text-primary-900 font-bold">加大该方向内容排期，复刻优质素材</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6 relative pb-10">
              <div className="grid grid-cols-2 gap-6 min-h-[300px]">
                <div className="border border-neutral-100 rounded-2xl p-5 bg-white shadow-sm flex flex-col">
                  <h5 className="text-[13px] font-bold text-neutral-900 mb-4">内容方向私信贡献占比</h5>
                  <div className="flex-1 flex flex-col gap-3 justify-center">
                    {[
                      { name: '幼犬软便避坑', count: 142, width: '100%' },
                      { name: '平价烘焙横评', count: 56, width: '40%' },
                      { name: '挑食矫正', count: 28, width: '20%' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 text-[12px]">
                        <span className="w-24 truncate text-neutral-600">{item.name}</span>
                        <div className="flex-1 h-3 bg-neutral-100 rounded-full overflow-hidden">
                          <div className="h-full bg-primary-400 rounded-full" style={{ width: item.width }}></div>
                        </div>
                        <span className="font-bold text-neutral-900 w-8">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="border border-neutral-100 rounded-2xl p-5 bg-white shadow-sm flex flex-col">
                  <h5 className="text-[13px] font-bold text-neutral-900 mb-4">明细数据</h5>
                  <div className="flex-1 overflow-y-auto space-y-2">
                    {[
                      { title: '换粮拉稀？你可能做错了这三步', account: '养宠日记', msg: 45 },
                      { title: '幼犬刚到家，第一口粮怎么选', account: '新手铲屎官', msg: 32 },
                      { title: '软便克星，这三款平价粮绝了', account: '宠物大百科', msg: 28 },
                    ].map((note, i) => (
                      <div key={i} className="flex items-center justify-between p-2.5 bg-neutral-50 rounded-lg border border-neutral-100">
                        <div className="overflow-hidden mr-2">
                          <div className="text-[12px] font-bold text-neutral-900 truncate">{note.title}</div>
                          <div className="text-[10px] text-neutral-400">{note.account}</div>
                        </div>
                        <span className="text-[11px] font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded shrink-0">{note.msg} 条</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="relative mt-4 sticky bottom-0 bg-white pt-4 pb-2">
                <input
                  type="text"
                  placeholder="继续追问，例如：对比上周数据有何变化？"
                  className="w-full pl-5 pr-14 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl text-[13px] placeholder:text-neutral-400 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/10 transition-all shadow-sm"
                />
                <button className="absolute right-3 top-1/2 -tranneutral-y-1/2 mt-1 w-9 h-9 bg-neutral-900 text-white rounded-xl flex items-center justify-center hover:bg-neutral-800 transition-colors shadow-sm">
                  <ArrowUp size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {dataSubNav === 'dashboards' && selectedDashboard && (
          <div className="p-8 space-y-8 animate-in slide-in-from-right-4 duration-500">
            <div className="flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <button onClick={() => setSelectedDashboard(null)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-neutral-100 text-neutral-500 transition-colors">
                  <ChevronRight size={20} className="rotate-180" />
                </button>
                <div>
                  <h3 className="text-xl font-semibold text-neutral-900 tracking-tight mb-1">{selectedDashboard.name}</h3>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-5 py-2 bg-white border border-neutral-200 text-neutral-700 text-[13px] font-bold rounded-xl shadow-sm hover:bg-neutral-50 transition-colors">
                  修改口径
                </button>
                <button className="px-5 py-2 bg-white border border-neutral-200 text-neutral-700 text-[13px] font-bold rounded-xl shadow-sm hover:bg-neutral-50 transition-colors">
                  转成机会
                </button>
                <button className="px-5 py-2 bg-white border border-neutral-200 text-neutral-700 text-[13px] font-bold rounded-xl shadow-sm hover:bg-neutral-50 transition-colors">
                  生成复盘
                </button>
                <button className="px-5 py-2 bg-white border border-neutral-200 text-neutral-700 text-[13px] font-bold rounded-xl shadow-sm hover:bg-neutral-50 transition-colors">
                  共享给团队
                </button>
              </div>
            </div>

            <div className="bg-primary-50/50 border border-primary-100 rounded-2xl p-6 shrink-0 flex flex-col gap-5">
              <div className="flex items-start gap-3">
                <Sparkles size={20} className="text-primary-500 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-[14px] font-bold text-primary-900 mb-1">系统结论</h5>
                  <p className="text-[14px] text-primary-800/80 leading-relaxed">
                    {selectedDashboard.anomaly === '无异常' 
                      ? '当前各项指标表现平稳，没有发现明显的波动。' 
                      : `${selectedDashboard.name}：${selectedDashboard.anomaly}，且 CVR（曝光-私信）远高于平均。建议立即将该方向加入重点追投资源。`}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-5 border-t border-primary-100/50">
                <div>
                  <div className="text-[11px] text-primary-400 mb-1">口径说明</div>
                  <div className="text-[13px] text-primary-900 font-bold">{selectedDashboard.scope || '全部数据'}</div>
                </div>
                <div>
                  <div className="text-[11px] text-primary-400 mb-1">关键变化</div>
                  <div className="text-[13px] text-primary-900 font-bold">相关指标较上期提升 15%</div>
                </div>
                <div>
                  <div className="text-[11px] text-primary-400 mb-1">异常项</div>
                  <div className="text-[13px] text-primary-900 font-bold">{selectedDashboard.anomaly}</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6 relative pb-10">
              <div className="grid grid-cols-2 gap-6 min-h-[300px]">
                <div className="border border-neutral-100 rounded-2xl p-5 bg-white shadow-sm flex flex-col">
                  <h5 className="text-[13px] font-bold text-neutral-900 mb-4">关键指标细分</h5>
                  <div className="flex-1 flex flex-col gap-3 justify-center">
                    {[
                      { name: '类目A', count: 142, width: '100%' },
                      { name: '类目B', count: 56, width: '40%' },
                      { name: '类目C', count: 28, width: '20%' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 text-[12px]">
                        <span className="w-24 truncate text-neutral-600">{item.name}</span>
                        <div className="flex-1 h-3 bg-neutral-100 rounded-full overflow-hidden">
                          <div className="h-full bg-primary-400 rounded-full" style={{ width: item.width }}></div>
                        </div>
                        <span className="font-bold text-neutral-900 w-8">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="border border-neutral-100 rounded-2xl p-5 bg-white shadow-sm flex flex-col">
                  <h5 className="text-[13px] font-bold text-neutral-900 mb-4">高私信笔记列表</h5>
                  <div className="flex-1 overflow-y-auto space-y-2">
                    {[
                      { title: '换粮拉稀？你可能做错了这三步', account: '养宠日记', msg: 45 },
                      { title: '幼犬刚到家，第一口粮怎么选', account: '新手铲屎官', msg: 32 },
                      { title: '软便克星，这三款平价粮绝了', account: '宠物大百科', msg: 28 },
                    ].map((note, i) => (
                      <div key={i} className="flex items-center justify-between p-2.5 bg-neutral-50 rounded-lg border border-neutral-100">
                        <div className="overflow-hidden mr-2">
                          <div className="text-[12px] font-bold text-neutral-900 truncate">{note.title}</div>
                          <div className="text-[10px] text-neutral-400">{note.account}</div>
                        </div>
                        <span className="text-[11px] font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded shrink-0">{note.msg} 条</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="relative mt-4 sticky bottom-0 bg-white pt-4 pb-2">
                <input
                  type="text"
                  placeholder="排除投流内容，只看自然流。"
                  className="w-full pl-5 pr-14 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl text-[13px] placeholder:text-neutral-400 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/10 transition-all shadow-sm"
                />
                <button className="absolute right-3 top-1/2 -tranneutral-y-1/2 mt-1 w-9 h-9 bg-neutral-900 text-white rounded-xl flex items-center justify-center hover:bg-neutral-800 transition-colors shadow-sm">
                  <ArrowUp size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

                {dataSubNav === 'roi_attribution' && (
          <div className="p-8 space-y-8 animate-in fade-in duration-500 flex flex-col h-full overflow-hidden">
            <div className="flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-[20px] font-bold text-neutral-900">复盘归因</h3>
                <p className="text-[13px] text-neutral-400 mt-1">智能分析数据，发现执行结与策略偏差</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pb-10">
              <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                {[
                  {
                    conclusion: '素人口吻比官方口吻转化率高 30%',
                    basis: '2 篇素人笔记带来 15 条私信，3 篇官方笔记仅 2 条',
                    scope: '当前项目 5 篇相关笔记',
                    confidence: '高 (92%)',
                    impact: '建议后续该品类取消官方口吻发布，全量采用素人体验测评口吻。'
                  },
                  {
                    conclusion: '“真实喂食”场景图比“棚拍白底图”点击率高 40%',
                    basis: 'A/B 测试显示，场景图 CTR 8.5%，白底图 CTR 4.1%',
                    scope: '最近 12 篇带图笔记',
                    confidence: '极高 (98%)',
                    impact: '影响素材产出标准：后续所有视觉均需带入真实生活场景。'
                  },
                  {
                    conclusion: '周末晚 8-10 点发布互动量翻倍',
                    basis: '历史数据：周末晚间平均互动 120，其他时段平均 45',
                    scope: '过去 30 天全部 45 篇笔记',
                    confidence: '中 (75%)',
                    impact: '可优化发布排期池，将核心转化笔记集中在周末晚间。'
                  }
                ].map((card, i) => (
                  <div key={i} className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm break-inside-avoid">
                    <div className="flex items-start gap-3 mb-4">
                      <Sparkles size={18} className="text-primary-500 shrink-0 mt-0.5" />
                      <h4 className="text-[15px] font-bold text-neutral-900">{card.conclusion}</h4>
                    </div>
                    <div className="space-y-3 mb-6">
                      <div className="text-[12px]">
                        <span className="text-neutral-500 block mb-1">数据依据</span>
                        <span className="font-medium text-neutral-900">{card.basis}</span>
                      </div>
                      <div className="text-[12px]">
                        <span className="text-neutral-500 block mb-1">样本覆盖范围</span>
                        <span className="font-medium text-neutral-900">{card.scope}</span>
                      </div>
                      <div className="text-[12px]">
                        <span className="text-neutral-500 block mb-1">AI 置信度</span>
                        <span className="font-bold text-primary-600">{card.confidence}</span>
                      </div>
                      <div className="text-[12px] bg-primary-50 p-3 rounded-xl border border-primary-100/50">
                        <span className="text-primary-800 font-bold block mb-1">对当前打法影响</span>
                        <span className="text-primary-700 leading-relaxed">{card.impact}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button onClick={() => setActionConfirmPopup({title: card.conclusion, action: '立即处理'})} className="w-full py-2 bg-neutral-900 text-white rounded-xl text-[12px] font-bold hover:bg-neutral-800 transition-colors">立即处理</button>
                      <button onClick={() => setActionConfirmPopup({title: card.conclusion, action: '下轮验证'})} className="w-full py-2 bg-white border border-neutral-200 text-neutral-700 rounded-xl text-[12px] font-bold hover:bg-neutral-50 transition-colors">下轮验证</button>
                      <button className="w-full py-2 text-neutral-500 hover:bg-neutral-50 rounded-xl text-[12px] font-bold transition-colors">保留观察</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <AnimatePresence>
              {actionConfirmPopup && (
                <div className="fixed inset-0 z-[200] bg-neutral-900/40 backdrop-blur-sm flex items-center justify-center">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-3xl shadow-2xl p-6 w-[400px]"
                  >
                    <h3 className="text-[16px] font-bold text-neutral-900 mb-2">{actionConfirmPopup.action}已确认</h3>
                    <p className="text-[13px] text-neutral-500 mb-6">对于「{actionConfirmPopup.title}」的结论，您希望如何沉淀该经验？</p>
                    <div className="space-y-2">
                      <button onClick={() => setActionConfirmPopup(null)} className="w-full text-left px-4 py-3 bg-neutral-50 hover:bg-primary-50 hover:text-primary-700 border border-neutral-200 hover:border-primary-200 rounded-xl text-[13px] font-bold transition-colors">更新商家记忆</button>
                      <button onClick={() => setActionConfirmPopup(null)} className="w-full text-left px-4 py-3 bg-neutral-50 hover:bg-primary-50 hover:text-primary-700 border border-neutral-200 hover:border-primary-200 rounded-xl text-[13px] font-bold transition-colors">提炼为我的运营方法</button>
                      <button onClick={() => setActionConfirmPopup(null)} className="w-full text-left px-4 py-3 bg-neutral-50 hover:bg-primary-50 hover:text-primary-700 border border-neutral-200 hover:border-primary-200 rounded-xl text-[13px] font-bold transition-colors">加入下轮项目建议</button>
                    </div>
                    <button onClick={() => setActionConfirmPopup(null)} className="mt-4 w-full py-2 text-[12px] text-neutral-400 hover:text-neutral-600">暂不处理</button>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}
        {dataSubNav === 'scheduled' && (
          <div className="p-8 space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-neutral-900 tracking-tight mb-1">复盘报告</h3>
                <p className="text-[13px] text-neutral-400">自动生成给团队/客户看的运营复盘，同时沉淀经验</p>
              </div>
              <button 
                onClick={() => setIsGenerateReportOpen(true)}
                className="px-5 py-2.5 bg-neutral-900 text-white rounded-xl text-[13px] font-bold shadow-sm hover:bg-neutral-800 transition-colors flex items-center gap-2"
              >
                <Plus size={16} /> 生成报告
              </button>
            </div>

            <div className="flex gap-2 border-b border-neutral-200 pb-4 overflow-x-auto custom-scrollbar">
              {['项目复盘', '周报', '月报', '客户汇报', '投流复盘', '内容复盘'].map((tab, i) => (
                <button 
                  key={i} 
                  onClick={() => setSelectedReportTab(tab)}
                  className={`px-4 py-2 rounded-lg text-[13px] font-medium whitespace-nowrap transition-colors ${selectedReportTab === tab ? 'bg-white shadow-sm border border-neutral-200 text-neutral-900' : 'text-neutral-500 hover:text-neutral-900 hover:bg-white/50'}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {selectedReportTab === '项目复盘' ? (
              <div className="bg-white border border-neutral-200 rounded-[32px] p-10 shadow-sm space-y-10 relative overflow-hidden">
                {/* 1. 报告范围与口径 */}
              <div className="pb-8 border-b border-neutral-100 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900 mb-4">Q2 幼犬粮推新项目复盘</h2>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-neutral-500">
                    <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-neutral-300"></span> 范围：Q2 幼犬粮推新项目</div>
                    <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-neutral-300"></span> 周期：2024-05-12 至 2024-06-12</div>
                    <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-primary-400"></span> 数据：小红书笔记 + 手动回传私信 + 投流消耗</div>
                    <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-primary-400"></span> 未接入：企微成交、订单复购</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[12px] text-neutral-400 mb-1">面向对象</div>
                  <div className="text-[13px] font-bold text-neutral-700 bg-neutral-100 px-3 py-1 rounded-lg">内部团队</div>
                </div>
              </div>
              
              {/* 2. 系统总结 */}
              <div className="bg-primary-50/50 border border-primary-100 rounded-2xl p-6 relative">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Sparkles size={64} className="text-primary-900" />
                </div>
                <h4 className="text-[15px] font-bold text-primary-900 mb-5 flex items-center gap-2"><Sparkles size={18} className="text-primary-500"/> 核心结论</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                  <div className="space-y-2">
                    <div className="text-[12px] font-bold text-primary-400 uppercase tracking-wider">结果</div>
                    <div className="text-[14px] text-primary-900 font-medium">曝光超预期 20%，CPA 降低 15%。</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-[12px] font-bold text-primary-400 uppercase tracking-wider">有效动作</div>
                    <div className="text-[14px] text-primary-900 font-medium">素人口吻 + 真实喂食素材组合表现最好。</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-[12px] font-bold text-primary-500 uppercase tracking-wider">主要问题</div>
                    <div className="text-[14px] text-primary-900 font-medium bg-primary-50 p-2 rounded border border-primary-100">达人响应慢，导致发布节奏断档。</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-[12px] font-bold text-neutral-900 uppercase tracking-wider">下一步</div>
                    <div className="text-[14px] text-neutral-900 font-medium bg-neutral-100 p-2 rounded border border-neutral-200">提高素人内容比例，提前派发素材任务。</div>
                  </div>
                </div>
              </div>
                
              {/* 3. 关键数据 */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-[16px] font-bold text-neutral-900">关键数据支撑</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { group: '内容表现', metric: '幼犬软便选题转化率', value: '3.2%', change: '+15%', evidence: '涉及 12 篇笔记' },
                    { group: '素材表现', metric: '真实喂食封面点击率', value: '12.5%', change: '+4.1%', evidence: '涉及 45 个素材' },
                    { group: '账号表现', metric: '素人号互动成本', value: '￥2.4', change: '-20%', evidence: '涉及 8 个账号' },
                    { group: '投流表现', metric: '大字报首图线索成本', value: '￥45', change: '-12%', evidence: '涉及 15 个计划' },
                    { group: '进度异常', metric: '尾部达人延期率', value: '45%', change: '高风险', evidence: '涉及 24 个任务' }
                  ].map((data, i) => (
                    <div key={i} className="p-5 border border-neutral-200 rounded-2xl bg-white hover:border-primary-300 transition-colors shadow-sm flex flex-col justify-between">
                      <div className="mb-4">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[11px] font-bold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded uppercase">{data.group}</span>
                          <span className={`text-[12px] font-bold ${(data.change.includes('+') || data.change.includes('-')) && !data.change.includes('高') ? 'text-neutral-900' : 'text-primary-600'}`}>{data.change}</span>
                        </div>
                        <div className="text-[13px] text-neutral-600 mb-1">{data.metric}</div>
                        <div className="text-[20px] font-bold text-neutral-900">{data.value}</div>
                      </div>
                      <button 
                        onClick={() => { setSelectedEvidence(data); setIsEvidenceDrawerOpen(true); }}
                        className="text-[12px] text-primary-600 font-bold hover:text-primary-700 flex items-center justify-between bg-primary-50/50 p-2 rounded-lg transition-colors w-full"
                      >
                        {data.evidence} <ChevronRight size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. 经验沉淀 */}
              <div>
                <h4 className="text-[16px] font-bold text-neutral-900 mb-4">待确认经验</h4>
                <div className="space-y-3">
                  {[
                    { title: '素人口吻 + 真实喂食素材适合幼犬换粮自然流', dest: '内容 Skill' },
                    { title: '达人响应慢会影响发布节奏，需提前预留 3 天 buffer', dest: '协同规则' }
                  ].map((exp, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white border border-neutral-200 rounded-xl shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                          <Database size={16} />
                        </div>
                        <div>
                          <div className="text-[14px] font-bold text-neutral-900 mb-1">{exp.title}</div>
                          <div className="flex items-center gap-2 text-[11px] text-neutral-500">
                            建议沉淀至：<span className="font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded">{exp.dest}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button 
                          onClick={() => { setSelectedExperience(exp); setIsExperienceDrawerOpen(true); }}
                          className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-[12px] font-bold hover:bg-neutral-800 transition-colors"
                        >
                          确认沉淀
                        </button>
                        <button className="px-4 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-lg text-[12px] font-bold hover:bg-neutral-50 transition-colors">
                          修改
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. 下一步动作 */}
              <div>
                <h4 className="text-[16px] font-bold text-neutral-900 mb-4">生成下一步动作</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { action: '追加一轮内容', dest: '项目与内容', navKey: 'strategy' },
                    { action: '派发素材任务', dest: '协同任务', navKey: 'execution' },
                    { action: '调整账号承接', dest: '账号与发布', navKey: 'publishing' },
                    { action: '更新内容规则', dest: '知识与记忆', navKey: 'memory' }
                  ].map((action, i) => (
                    <button 
                      key={i} 
                      onClick={() => setActiveNav(action.navKey)}
                      className="p-4 border border-neutral-200 rounded-xl bg-white hover:border-primary-300 hover:shadow-md transition-all group flex flex-col text-left"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center group-hover:bg-primary-100 transition-colors text-neutral-500 group-hover:text-primary-600">
                          <ArrowUp size={14} className="rotate-45" />
                        </div>
                      </div>
                      <div className="text-[14px] font-bold text-neutral-900 mb-1">{action.action}</div>
                      <div className="text-[11px] text-neutral-400">流向 <span className="font-medium text-neutral-600">{action.dest}</span></div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-8 border-t border-neutral-100 flex flex-wrap gap-4 justify-between items-center">
                <div className="text-[13px] text-neutral-400">
                  报告状态：草稿
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setIsReportEditorOpen(true)}
                    className="px-5 py-2 bg-white border border-neutral-200 text-neutral-900 rounded-xl text-[13px] font-bold shadow-sm hover:bg-neutral-50 transition-colors flex items-center gap-2"
                  >
                    <Database size={16} /> 编辑并导出
                  </button>
                  <button className="px-5 py-2 bg-primary-50 border border-primary-200 text-primary-700 rounded-xl text-[13px] font-bold shadow-sm hover:bg-primary-100 transition-colors">
                    同步飞书文档
                  </button>
                </div>
              </div>
            </div>
            ) : (
              <div className="bg-white border border-neutral-200 rounded-[32px] p-10 shadow-sm flex flex-col items-center justify-center min-h-[400px] text-center">
                <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4 text-neutral-400">
                  <FileText size={24} />
                </div>
                <h3 className="text-[16px] font-bold text-neutral-900 mb-2">当前未生成该类型的报告</h3>
                <p className="text-[13px] text-neutral-500 mb-6">点击上方“生成报告”按钮，可以按需生成{selectedReportTab}</p>
                <button 
                  onClick={() => setIsGenerateReportOpen(true)}
                  className="px-5 py-2.5 bg-neutral-900 text-white rounded-xl text-[13px] font-bold shadow-sm hover:bg-neutral-800 transition-colors flex items-center gap-2"
                >
                  <Plus size={16} /> 立即生成
                </button>
              </div>
            )}
          </div>
        )}

        {dataSubNav === 'blueocean' && (
          <div className="p-8 space-y-8 animate-in fade-in duration-500">
            <div className="bg-primary-50 border border-primary-100 text-primary-900 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
              <div className="flex items-start gap-3">
                <Sparkles size={20} className="text-primary-500 shrink-0 mt-0.5" />
                <p className="text-[14px] leading-relaxed font-medium">
                  当前发现 3 个可测方向，其中<span className="font-bold text-primary-700">「幼犬软便避坑」</span>搜索竞争低、评论需求高，适合自然流测试。
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: '幼犬软便避坑', heat: '中', comp: '低', hits: '8 篇', gap: '真实经验类不足', match: '高', risk: '医疗化表达' },
                { title: '平价烘焙猫粮对比', heat: '高', comp: '中', hits: '12 篇', gap: '成分横向测评缺乏', match: '中', risk: '竞品拉踩风险' },
                { title: '老龄犬关节养护', heat: '低', comp: '极低', hits: '2 篇', gap: '日常护理场景空白', match: '中', risk: '受众过窄' }
              ].map((card, i) => (
                <div key={i} className="bg-white border border-neutral-200 rounded-[32px] p-8 shadow-sm flex flex-col">
                  <h4 className="text-xl font-bold text-neutral-900 mb-6">{card.title}</h4>
                  <div className="space-y-4 mb-8 flex-1">
                    <div className="flex justify-between items-center text-[13px]">
                      <span className="text-neutral-400">搜索热度</span>
                      <span className="font-bold text-neutral-900">{card.heat}</span>
                    </div>
                    <div className="flex justify-between items-center text-[13px]">
                      <span className="text-neutral-400">竞争强度</span>
                      <span className="font-bold text-neutral-900">{card.comp}</span>
                    </div>
                    <div className="flex justify-between items-center text-[13px]">
                      <span className="text-neutral-400">低粉爆款</span>
                      <span className="font-bold text-neutral-900">{card.hits}</span>
                    </div>
                    <div className="flex justify-between items-center text-[13px]">
                      <span className="text-neutral-400">未满足需求</span>
                      <span className="font-bold text-neutral-900 truncate max-w-[120px]" title={card.gap}>{card.gap}</span>
                    </div>
                    <div className="flex justify-between items-center text-[13px]">
                      <span className="text-neutral-400">商家匹配度</span>
                      <span className="font-bold text-primary-600">{card.match}</span>
                    </div>
                    <div className="flex justify-between items-center text-[13px] pt-3 border-t border-neutral-100">
                      <span className="text-neutral-400">风险点</span>
                      <span className="font-bold text-primary-600">{card.risk}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => setSelectedItem({
                        title: `蓝海立项: ${card.title}`,
                        aiJudgment: '蓝海潜力极高，建议快速跟进占据心智。',
                        evidence: `搜索热度${card.heat}，竞争强度${card.comp}，目前低粉爆款已有${card.hits}。`,
                        aiSuggestion: '围绕“真实经验类不足”的痛点，铺设首批测试内容。',
                        actionText: '生成操盘建议',
                        flowTo: '操盘建议'
                      })}
                      className="w-full py-3 bg-neutral-900 text-white text-[13px] font-bold rounded-xl shadow-sm hover:bg-neutral-800"
                    >
                      生成操盘建议
                    </button>
                    <div className="flex gap-2">
                      <button className="flex-1 py-2.5 bg-white border border-neutral-200 text-neutral-700 text-[12px] font-bold rounded-xl shadow-sm hover:bg-neutral-50">加入内容战役</button>
                      <button className="flex-1 py-2.5 bg-white border border-neutral-200 text-neutral-700 text-[12px] font-bold rounded-xl shadow-sm hover:bg-neutral-50">继续监控</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
      {renderReportDrawers()}
      {renderDrawer()}
    </div>
  );
};

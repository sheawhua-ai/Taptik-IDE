import React, { useState } from 'react';
import { 
  Video, Eye, Send, Image as ImageIcon, X, ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProjectStore } from '../../context/ProjectContext';
import { Project } from '../../data/projectStore';
import { DispatchMaterialTaskModal } from './DispatchMaterialTaskModal';

interface Props {
  project: Project;
  onNavigateToMaterials?: () => void;
}

export function ProjectMaterialsTab({ project, onNavigateToMaterials }: Props) {
  const { unifiedState } = useProjectStore();
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [previewAssetUrl, setPreviewAssetUrl] = useState<string | null>(null);

  // Filter project-level requirements and tasks
  const projectReqs = unifiedState.materialRequirements.filter(
    mr => mr.projectId === project.id || project.notes.some(n => n.id === mr.noteSlotId)
  );

  const projectMaterialTasks = unifiedState.materialTasks.filter(
    mt => projectReqs.some(req => req.id === mt.requirementId)
  );

  // Demo fallback material scenarios if empty
  const defaultScenarios = [
    {
      id: 'sc1',
      title: '场景一：幼犬换粮实拍与肠胃适应便便对比',
      reqs: '需提供幼犬进食高品质粮高清特写、7天换粮便便颜色状态对比图及产品与宠物合影',
      assignedTo: '员工a, 卡卡',
      associatedNotes: ['幼犬换粮避坑指南', '我家金毛换粮7天打卡笔记包'],
      status: '执行中',
      progress: '2/3 已回传',
      assetsCount: 2,
      assets: [
        { id: 'a1', url: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=600&auto=format&fit=crop', type: 'image', title: '幼犬进食大头照' },
        { id: 'a2', url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&auto=format&fit=crop', type: 'image', title: '换粮第3天精神状态实拍' }
      ]
    },
    {
      id: 'sc2',
      title: '场景二：店长专业推荐与线下门店养护陈列',
      reqs: '需要店长出镜讲解视频（15s）、门店幼犬粮特写展架及体验装发放场景',
      assignedTo: '张店长',
      associatedNotes: ['【官方科普】幼犬肠胃敏感期如何顺利换粮？', '门店领试用装福利'],
      status: '待验收',
      progress: '1/1 已回传',
      assetsCount: 1,
      assets: [
        { id: 'a3', url: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=600&auto=format&fit=crop', type: 'image', title: '店长货架前出镜实拍' }
      ]
    },
    {
      id: 'sc3',
      title: '场景三：试用装包裹签收与小红书打卡凭证',
      reqs: '体验官快递包裹开箱特写 + 小红书表单填写截图凭证',
      assignedTo: '员工b',
      associatedNotes: ['【KOC问卷笔记包】新手换粮防软便打卡'],
      status: '已验收',
      progress: '2/2 已完成',
      assetsCount: 2,
      assets: [
        { id: 'a4', url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop', type: 'image', title: '试用装体验包拆箱图' }
      ]
    }
  ];

  // Demo asset library
  const defaultAssetLibrary = [
    {
      id: 'al1',
      title: '幼犬吃粮高清大头照',
      category: 'image',
      url: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=600&auto=format&fit=crop',
      aiStatus: 'AI预检通过',
      uploader: '员工a',
      time: '10分钟前',
      noteRef: '幼犬换粮避坑指南'
    },
    {
      id: 'al2',
      title: '金毛第3天换粮便便与产品合影',
      category: 'image',
      url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&auto=format&fit=crop',
      aiStatus: 'AI预检通过',
      uploader: '卡卡',
      time: '1小时前',
      noteRef: '金毛换粮7天打卡笔记包'
    },
    {
      id: 'al3',
      title: '店长出镜讲解15s高清视频帧',
      category: 'video',
      url: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=600&auto=format&fit=crop',
      aiStatus: 'AI预检通过',
      uploader: '张店长',
      time: '3小时前',
      noteRef: '【官方科普】幼犬肠胃敏感期'
    },
    {
      id: 'al4',
      title: '试用装开箱体验特写',
      category: 'image',
      url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop',
      aiStatus: 'AI预检通过',
      uploader: '员工b',
      time: '昨天',
      noteRef: '【KOC问卷笔记包】软便打卡'
    },
    {
      id: 'al5',
      title: '宠物品类核心成分授权认证卡',
      category: 'image',
      url: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600&auto=format&fit=crop',
      aiStatus: '通用素材',
      uploader: '商家自行上传',
      time: '2天前',
      noteRef: '通用项目素材'
    }
  ];

  return (
    <div className="space-y-6">
      {/* 1. 全局下发素材入口 Banner */}
      <div className="bg-surface-1 rounded-xl p-6 border border-border-default shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-[16px] font-bold text-text-main">素材与场景任务管理</h2>
          </div>
          <p className="text-[13px] text-text-secondary mt-1">
            支持提前下发素材收集任务安排拍摄（无需预先创建笔记），后续可随时将收集素材应用至项目笔记与场景中
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setShowDispatchModal(true)}
            className="px-5 py-2.5 bg-[#D93850] hover:bg-[#c22e44] text-white rounded-xl text-[13px] font-bold flex items-center gap-2 transition-all shadow-xs"
          >
            <Send size={15} />
            下发计划素材收集任务
          </button>
        </div>
      </div>

      {/* 2. 板块一：场景素材任务 (基于多个笔记合并) */}
      <div className="bg-surface-1 rounded-xl p-6 border border-border-default space-y-5">
        <div className="flex items-center justify-between border-b border-border-default pb-4">
          <div>
            <h3 className="text-[15px] font-bold text-text-main">场景素材任务列表</h3>
            <p className="text-[12px] text-text-secondary mt-0.5">多篇笔记拍摄要求合并下发，指定员工负责跟进归集</p>
          </div>
          <span className="text-[12px] text-text-secondary">共 {defaultScenarios.length} 个任务场景</span>
        </div>

        <div className="space-y-4">
          {defaultScenarios.map((scenario) => (
            <div 
              key={scenario.id} 
              className="p-5 bg-[#F7F8FA] rounded-xl border border-border-default hover:border-neutral-300 transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[14px] text-text-main">{scenario.title}</span>
                  <span className={`px-2.5 py-0.5 text-[11px] font-bold rounded-md ${
                    scenario.status === '已验收' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : scenario.status === '待验收'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {scenario.status} ({scenario.progress})
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button 
                    onClick={() => setShowDispatchModal(true)}
                    className="px-3 py-1.5 bg-surface-1 border border-border-default hover:bg-page-bg text-[12px] font-bold text-[#344054] rounded-xl transition-colors"
                  >
                    调整要求 / 重新派发
                  </button>
                </div>
              </div>

              {/* Requirements & Assignee */}
              <div className="text-[13px] text-[#344054] bg-surface-1 p-3 rounded-xl border border-border-default">
                <div className="font-bold text-text-main mb-1">要求说明：</div>
                <div>{scenario.reqs}</div>
              </div>

              {/* Associated Notes Tags */}
              <div className="flex flex-wrap items-center gap-2 text-[12px]">
                <span className="text-text-secondary font-medium">关联笔记:</span>
                {scenario.associatedNotes.map((noteTitle, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-surface-1 border border-border-default text-text-main rounded-lg font-medium">
                    📄 {noteTitle}
                  </span>
                ))}
                <span className="text-text-secondary ml-auto font-medium">
                  执行人: <span className="text-text-main font-bold">{scenario.assignedTo}</span>
                </span>
              </div>

              {/* Uploaded assets preview thumbnails */}
              {scenario.assets.length > 0 && (
                <div className="pt-2 flex items-center gap-3">
                  <span className="text-[12px] text-text-secondary">已提交素材:</span>
                  <div className="flex items-center gap-2">
                    {scenario.assets.map((asset) => (
                      <div 
                        key={asset.id} 
                        onClick={() => setPreviewAssetUrl(asset.url)}
                        className="group relative w-12 h-12 rounded-lg overflow-hidden border border-border-default cursor-pointer hover:border-rose-400"
                      >
                        <img src={asset.url} alt={asset.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <Eye size={12} className="text-white" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 3. 板块二：项目素材库 */}
      <div className="bg-surface-1 rounded-xl p-6 border border-border-default space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border-default pb-4">
          <div>
            <h3 className="text-[15px] font-bold text-text-main">项目素材库</h3>
            <p className="text-[12px] text-text-secondary mt-0.5">收录并展示本项目已采集回传的高清图像与视频文件（上传、审核及分类编排请前往素材中心）</p>
          </div>

          {/* Jump to Material Center Action */}
          <button
            onClick={onNavigateToMaterials}
            className="px-4 py-2 bg-[#F7F8FA] hover:bg-hover-bg border border-border-default text-[#344054] rounded-xl text-[12px] font-bold flex items-center gap-1.5 transition-all shadow-2xs shrink-0"
          >
            <span>前往素材中心处理</span>
            <ExternalLink size={13} className="text-text-secondary" />
          </button>
        </div>

        {/* Asset Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {defaultAssetLibrary.map((asset) => (
            <div 
              key={asset.id} 
              className="bg-[#F7F8FA] rounded-xl border border-border-default overflow-hidden group hover:shadow-md transition-all flex flex-col"
            >
              <div 
                onClick={() => setPreviewAssetUrl(asset.url)}
                className="relative h-40 bg-hover-bg overflow-hidden cursor-pointer"
              >
                <img 
                  src={asset.url} 
                  alt={asset.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 text-white text-[10px] font-bold rounded-md backdrop-blur-xs flex items-center gap-1">
                  {asset.category === 'video' ? <Video size={10} /> : <ImageIcon size={10} />}
                  {asset.category === 'video' ? '视频' : '照片'}
                </span>
                
                <span className="absolute top-2 right-2 px-2 py-0.5 bg-emerald-500 text-white text-[10px] font-bold rounded-md shadow-xs">
                  {asset.aiStatus}
                </span>

                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <span className="p-2 bg-surface-1 rounded-full text-text-main shadow-md">
                    <Eye size={16} />
                  </span>
                </div>
              </div>

              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[13px] font-bold text-text-main truncate mb-1">
                    {asset.title}
                  </div>
                  <div className="text-[11px] text-text-secondary truncate">
                    关联: {asset.noteRef}
                  </div>
                </div>

                <div className="pt-3 mt-2 border-t border-border-default/80 flex items-center justify-between text-[11px] text-text-secondary">
                  <span>上传人: {asset.uploader}</span>
                  <span>{asset.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dispatch Modal */}
      {showDispatchModal && (
        <DispatchMaterialTaskModal
          project={project}
          onClose={() => setShowDispatchModal(false)}
        />
      )}

      {/* Image Preview Modal */}
      <AnimatePresence>
        {previewAssetUrl && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-3xl max-h-[85vh] bg-btn-main rounded-xl overflow-hidden shadow-2xl flex flex-col"
            >
              <button 
                onClick={() => setPreviewAssetUrl(null)}
                className="absolute top-4 right-4 p-2 text-white/80 hover:text-white bg-black/40 hover:bg-black/60 rounded-full transition-colors z-10"
              >
                <X size={20} />
              </button>
              <img src={previewAssetUrl} alt="素材大图" className="w-full h-full object-contain max-h-[80vh]" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

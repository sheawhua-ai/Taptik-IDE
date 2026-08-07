import { MaterialAsset, CollectionTask, NoteDraftRequirement } from './types';

export const INITIAL_ASSETS: MaterialAsset[] = [
  {
    id: 'mat_01',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&auto=format&fit=crop&q=80',
    aiOneLineUnderstanding: '棕色幼犬穿黄色卫衣坐在纯蓝背景前，画面主体突出、光线通透干净，适合作为萌宠日常。',
    recommendationUse: '萌宠日常体验、首图。',
    suitableForCover: 'suitable',
    coverReason: '主体突出，纯蓝背景留白充足，非常适合添加标题。',
    status: 'available',
    sourceType: 'clerk',
    uploader: '张店长',
    uploadTime: '2026-08-01 14:20',
    sourceProject: '幼犬换粮避坑',
    sourceTask: '门店实拍',
    authStatus: 'verified',
    fileInfo: {
      resolution: '3024x4032',
      format: 'JPEG',
      size: '3.4 MB',
      aspectRatio: '3:4'
    },
    usageRecords: [],
    fullAiAnalysis: {
      subject: '棕色幼犬',
      product: '无',
      scene: '纯蓝色背景',
      composition: '中央重点构图',
      lightingColor: '高显色柔光灯棚光'
    }
  },
  {
    id: 'mat_02',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600&auto=format&fit=crop&q=80',
    aiOneLineUnderstanding: '金毛幼犬在木地板上进食，旁边放着品牌宠粮包装，主体明确。',
    recommendationUse: '换粮日记、干粮对比测评。',
    suitableForCover: 'optimized_suitable',
    coverReason: '主体明确，但作为3:4封面需要裁剪两侧。',
    status: 'available',
    sourceType: 'clerk',
    uploader: '张店长',
    uploadTime: '2026-08-01 14:35',
    authStatus: 'verified',
    fileInfo: {
      resolution: '3840x2160',
      format: 'JPEG',
      size: '4.1 MB',
      aspectRatio: '16:9'
    },
    usageRecords: [],
    fullAiAnalysis: {
      subject: '金毛幼犬与宠粮',
      product: '极宠家·幼犬敏感肠胃呵护粮',
      scene: '家庭木地板',
      composition: '斜角透视构图',
      lightingColor: '暖白光'
    }
  },
  {
    id: 'mat_03',
    type: 'video',
    url: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=600&auto=format&fit=crop&q=80',
    duration: '00:15',
    aiOneLineUnderstanding: '倒宠粮颗粒入陶瓷碗的高清动态特写，展示真实成分。',
    recommendationUse: '产品做工证明、开箱转场。',
    suitableForCover: 'unrecommended',
    coverReason: '视频特写，无明确视觉焦点。',
    status: 'used',
    sourceType: 'operator',
    uploader: '林运营',
    uploadTime: '2026-07-29 11:15',
    linkedNoteId: 'note_01',
    linkedNoteTitle: '亲测3大网红狗粮！',
    authStatus: 'verified',
    fileInfo: {
      resolution: '1080x1920',
      format: 'MP4',
      size: '18.6 MB',
      aspectRatio: '9:16'
    },
    usageRecords: [
      {
        id: 'rec_01',
        noteTitle: '亲测3大网红狗粮！',
        project: 'KOS店长号首推',
        publishTime: '2026-07-30 10:00',
        status: 'used',
        operator: '林运营',
        positionLabel: '正文第2张'
      }
    ],
    fullAiAnalysis: {
      subject: '不锈钢勺与宠粮',
      product: '冻干三文鱼犬粮',
      scene: '纯白背景',
      composition: '微距特写',
      lightingColor: '亮白光'
    }
  },
  {
    id: 'mat_06',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&auto=format&fit=crop&q=80',
    aiOneLineUnderstanding: '微调版本：移除杂物，替换清爽背景，萌犬神态保留。',
    recommendationUse: '换粮日记精修封面。',
    suitableForCover: 'suitable',
    coverReason: '背景干净，留白合理，无杂物。',
    status: 'pending',
    sourceType: 'ai_optimized',
    uploader: '林运营 (AI生成)',
    uploadTime: '2026-08-02 09:30',
    authStatus: 'verified',
    fileInfo: {
      resolution: '3000x4000',
      format: 'JPEG',
      size: '3.1 MB',
      aspectRatio: '3:4'
    },
    usageRecords: [],
    derivationInfo: {
      parentId: 'mat_04',
      parentName: '小型犬在阳台日光下欢快奔跑',
      familyId: 'fam_01',
      modificationType: '更换背景 & 去除杂物',
      createdBy: '林运营'
    },
    fullAiAnalysis: {
      subject: '小型犬',
      product: '无',
      scene: '浅色墙面',
      composition: '中心对称',
      lightingColor: '高亮日系通透风'
    }
  }
];

export const INITIAL_COLLECTION_TASKS: CollectionTask[] = [
  {
    id: 'task_01',
    status: 'collecting',
    projectName: '幼犬换粮避坑搜索卡位',
    taskName: 'K11门店宠粮到店实拍',
    targetNoteTitle: '幼犬换粮攻略',
    executor: '张店长',
    deadline: '2026-08-05 20:00',
    completedCount: 2,
    totalCount: 4,
    shootGoal: '收集幼犬和宠粮包装同时出现的高清场景图。',
    shotsList: [
      {
        id: 'sh_101',
        shotName: '幼犬正坐萌宠特写',
        requirementDesc: '画面干净无杂物，适合首图。',
        status: 'completed',
        assetId: 'mat_01'
      },
      {
        id: 'sh_102',
        shotName: '进食合影',
        requirementDesc: '宠物吃粮，正前方摆放产品。',
        status: 'completed',
        assetId: 'mat_02'
      },
      {
        id: 'sh_103',
        shotName: '成分背标特写',
        requirementDesc: '聚焦文字无反光。',
        status: 'rejected',
        rejectReason: '反光严重无法识别OCR。'
      },
      {
        id: 'sh_104',
        shotName: '换粮日历展示',
        requirementDesc: '展示换粮进度记录条。',
        status: 'pending'
      }
    ]
  },
  {
    id: 'task_02',
    status: 'draft',
    projectName: '新品首发',
    taskName: '消费者体验图',
    targetNoteTitle: '换粮第3天真实记录',
    executor: '未分配',
    deadline: '2026-08-10 18:00',
    completedCount: 0,
    totalCount: 2,
    shootGoal: '收集真实家居环境下的喂食图。',
    shotsList: [
      {
        id: 'sh_201',
        shotName: '狗狗期待的眼神',
        requirementDesc: '在饭盆前的期待神态。',
        status: 'pending'
      },
      {
        id: 'sh_202',
        shotName: '空盘证明',
        requirementDesc: '吃完后干净的碗。',
        status: 'pending'
      }
    ]
  }
];

export const MOCK_NOTE_DRAFT: NoteDraftRequirement = {
  id: 'draft_01',
  noteTitle: '幼犬换粮软便别慌！3天过度法',
  projectName: '幼犬换粮避坑搜索卡位',
  draftSummary: '针对新手宠主换粮常见的肠胃敏感，整理了循序渐进的3天换粮过度比例指南。',
  imagePositions: [
    {
      posIndex: 1,
      posType: 'cover',
      label: '首图：幼犬和产品',
      requirementDesc: '包含萌犬与极宠家包装正面，画面明亮。',
      status: 'missing',
      matchedAssetId: 'mat_02'
    },
    {
      posIndex: 2,
      posType: 'body_1',
      label: '颗粒特写',
      requirementDesc: '展示无油光质感。',
      status: 'missing',
      matchedAssetId: 'mat_03'
    },
    {
      posIndex: 3,
      posType: 'body_other',
      label: '成分指标特写',
      requirementDesc: '清晰呈现前5项蛋白含量。',
      status: 'missing'
    }
  ]
};

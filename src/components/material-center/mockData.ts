import { MaterialAsset } from './types';

export const INITIAL_ASSETS: MaterialAsset[] = [
  {
    id: 'MAT-2026-001',
    name: '幼犬软便救急粮-正视透视首图',
    url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&auto=format&fit=crop&q=80',
    aspectRatio: '3:4',
    fileType: 'image',
    fileSize: '3.4 MB',
    resolution: '3024x4032',

    category: 'publish_material',
    status: 'used',
    materialUse: 'cover',
    sourceType: 'task_upload',
    sourceLabel: '任务上传 (门店实拍)',

    uploader: '张店长 (K11旗舰店)',
    uploadTime: '2026-08-10 14:20',
    sourceProject: '幼犬换粮软便卡位项目',

    tags: ['幼犬', '换粮软便', '主粮首图', '浅蓝场景'],
    vectorDescription: '阳光通透背景下近距离拍摄的幼犬正视宠粮画面，突出颗粒感与真实适口性，适合小红书科普类封面图',

    usageRelation: {
      noteId: 'NOTE-801',
      noteTitle: '幼犬换粮总是软便？3招教你安全避坑',
      projectId: 'p1',
      projectName: '幼犬换粮软便卡位项目',
      accountName: '极宠家·KOS张店长',
      publishDate: '2026-08-12',
      usageState: 'used'
    },

    performance: {
      hasBackendData: true,
      performanceType: 'owned_account_creator_api',
      creatorBackend: {
        exposure: 28400,
        reads: 3820,
        interactions: 485,
        coverClickRate: 4.8,
        originalMetricName: '小红书创作者后台-封面点击率',
        dataSource: '小红书创作者API',
        lastSyncTime: '2026-08-21 02:00',
        dataCoverageStatus: '100% 全量同步',
        accountMedianComparison: {
          accountName: '极宠家·KOS张店长',
          topic: '幼犬科普',
          medianClickRate: 3.2,
          comparisonLabel: '高于该账号近30天相近主题中位数 (+1.6%)'
        }
      }
    },

    acceptance: {
      aiRecognition: {
        tag: '智能特征识别',
        status: 'passed',
        subject: '棕色幼犬',
        product: '极宠家·幼犬肠胃呵护粮',
        scene: '室内清爽浅蓝背景',
        composition: '中央重点构图',
        lightingColor: '高显色柔光棚光'
      },
      manualAcceptance: {
        operatorName: '林运营',
        time: '2026-08-10 16:00',
        passed: true,
        comment: '主体清晰，光线通透，符合品牌规范'
      }
    }
  },

  {
    id: 'MAT-2026-002',
    name: 'KOC体验官实拍-金毛开箱进食',
    url: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600&auto=format&fit=crop&q=80',
    aspectRatio: '3:4',
    fileType: 'image',
    fileSize: '4.1 MB',
    resolution: '3024x4032',

    category: 'publish_material',
    status: 'reserved',
    materialUse: 'real_shot',
    sourceType: 'task_upload',
    sourceLabel: '任务上传 (KOC体验官)',

    uploader: 'KOC-小红薯momo',
    uploadTime: '2026-08-18 11:30',
    sourceProject: '猫粮肠胃敏感科普项目',

    tags: ['KOC实拍', '金毛开箱', '真实进食', '生活感'],
    vectorDescription: '温暖木地板场景下金毛幼犬开箱欢快进食特写，视角自然亲切，突出真实生活气息',

    usageRelation: {
      noteId: 'DRAFT-902',
      noteTitle: '猫咪肠胃敏感怎么选粮？看这一篇就够了',
      projectId: 'p2',
      projectName: '猫粮肠胃敏感科普项目',
      accountName: 'KOC-小红薯momo',
      usageState: 'reserved',
      reservationTime: '2026-08-19 15:00'
    },

    performance: {
      hasBackendData: false,
      performanceType: 'koc_public_captured',
      kocMetrics: {
        noBackendDataNotice: '无后台点击数据',
        adoptionStatus: '已预留给草稿笔记 DRAFT-902',
        manualAcceptanceResult: '操盘手验收合格 (画质清晰，包装无反光)',
        aiPrecheckResult: '自动客观校验通过 (分辨率3024x4032, 色彩自然)',
        publicNoteLink: 'https://www.xiaohongshu.com/explore/demo-koc-note',
        publicInteractions: {
          likes: 320,
          collects: 142,
          comments: 28
        },
        operatorRating: 4.9
      }
    },

    acceptance: {
      aiRecognition: {
        tag: '智能特征识别',
        status: 'passed',
        subject: '金毛幼犬进食',
        product: '极宠家·敏感肠胃粮',
        scene: '家庭木地板场景',
        composition: '俯角45度',
        lightingColor: '暖白光'
      },
      manualAcceptance: {
        operatorName: '林运营',
        time: '2026-08-18 14:00',
        passed: true,
        comment: '真实生活场景感强，已预留给KOC发布计划'
      }
    }
  },

  {
    id: 'MAT-2026-005',
    name: '操盘手棚拍-极宠家产品净质特写',
    url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&auto=format&fit=crop&q=80',
    aspectRatio: '3:4',
    fileType: 'image',
    fileSize: '2.8 MB',
    resolution: '3000x4000',

    category: 'publish_material',
    status: 'available',
    materialUse: 'cover',
    sourceType: 'merchant',
    sourceLabel: '操盘手上传',

    uploader: '林运营 (操盘手)',
    uploadTime: '2026-08-15 10:30',
    sourceProject: '幼犬换粮软便卡位项目',

    tags: ['操盘手棚拍', '高清大图', '可作首图', '粮粒细节'],
    vectorDescription: '日系温馨阳光木质桌面上主粮包装与散落粮粒清爽摆拍，保留顶部充足留白，高点击率通用首图',

    usageRelation: undefined,

    performance: {
      hasBackendData: false,
      performanceType: 'none'
    },

    acceptance: {
      aiRecognition: {
        tag: '智能特征识别',
        status: 'passed',
        subject: '主粮特写',
        product: '极宠家·肠胃呵护粮',
        scene: '阳光日系场景',
        composition: '三分法留白构图',
        lightingColor: '暖白日照光'
      },
      manualAcceptance: {
        operatorName: '林运营',
        time: '2026-08-15 11:00',
        passed: true,
        comment: '效果优良，随时可预留分配给新笔记'
      }
    }
  },

  {
    id: 'MAT-BASE-001',
    name: '极宠家·官方品牌Logo (透明矢量PNG)',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    aspectRatio: '1:1',
    fileType: 'image',
    fileSize: '512 KB',
    resolution: '2000x2000',

    category: 'base_component',
    status: 'available',
    materialUse: 'component_logo',
    sourceType: 'merchant',
    sourceLabel: '操盘手上传 (品牌规范)',

    uploader: '品牌设计部',
    uploadTime: '2026-06-01 09:00',

    tags: ['品牌Logo', '矢量透明', '通用水印', 'VI规范'],
    vectorDescription: '高清白色透明通道品牌Logo矢量贴图，用于笔记图片或视频角标水印挂载',

    performance: {
      hasBackendData: false,
      performanceType: 'none'
    },

    acceptance: {
      aiRecognition: {
        tag: '智能特征识别',
        status: 'passed',
        subject: '品牌标志',
        product: '极宠家品牌VI',
        scene: '透明通道',
        composition: '矢量居中',
        lightingColor: '无'
      }
    }
  },

  {
    id: 'MAT-BASE-002',
    name: '幼犬肠胃粮 3D产品透视抠图',
    url: 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?w=600&auto=format&fit=crop&q=80',
    aspectRatio: '1:1',
    fileType: 'image',
    fileSize: '1.8 MB',
    resolution: '2400x2400',

    category: 'base_component',
    status: 'available',
    materialUse: 'component_cutout',
    sourceType: 'merchant',
    sourceLabel: '操盘手上传',

    uploader: '产品研发部',
    uploadTime: '2026-07-01 10:00',
    sourceProject: '幼犬换粮软便卡位项目',

    tags: ['3D抠图', '透明底图', '主粮单品', '设计元件'],
    vectorDescription: '3D渲染无背景高精度主粮包装袋抠图，边缘洁净，方便快速拼贴叠加到不同背景或笔记海报中',

    performance: {
      hasBackendData: false,
      performanceType: 'none'
    },

    acceptance: {
      aiRecognition: {
        tag: '智能特征识别',
        status: 'passed',
        subject: '宠粮包装袋3D抠图',
        product: '极宠家·幼犬肠胃粮',
        scene: '无背景 (透明通道)',
        composition: '正视微侧30度',
        lightingColor: '标准无影棚光'
      }
    }
  },

  {
    id: 'MAT-BASE-003',
    name: '品牌统一色彩规范 - 暖粉/品牌红色板',
    url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80',
    aspectRatio: '16:9',
    fileType: 'image',
    fileSize: '240 KB',
    resolution: '1920x1080',

    category: 'base_component',
    status: 'available',
    materialUse: 'component_swatch',
    sourceType: 'merchant',
    sourceLabel: '操盘手上传',

    uploader: '品牌设计部',
    uploadTime: '2026-06-01 09:00',

    tags: ['品牌色板', '视觉规范', '标准色号'],
    vectorDescription: '极宠家统一视觉VI标准色板，包含品牌红与辅助暖灰色号代码与搭配示例',

    performance: {
      hasBackendData: false,
      performanceType: 'none'
    },

    acceptance: {
      aiRecognition: {
        tag: '智能特征识别',
        status: 'passed',
        subject: '色彩面板',
        product: '色板',
        scene: '设计规范',
        composition: '色块网格',
        lightingColor: '无'
      }
    }
  },

  {
    id: 'MAT-2026-003',
    name: 'KOS店长门前迎宾实拍视频',
    url: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=600&auto=format&fit=crop&q=80',
    aspectRatio: '9:16',
    fileType: 'video',
    fileSize: '18.6 MB',
    resolution: '1080x1920',

    category: 'publish_material',
    status: 'used',
    materialUse: 'finished_video',
    sourceType: 'task_upload',
    sourceLabel: '任务上传 (门店实拍)',

    uploader: '李店长 (线下门店)',
    uploadTime: '2026-07-28 16:00',
    sourceProject: '线下门店KOS到店引流项目',

    tags: ['店长迎宾', '门店到店', '短视频', '真实探店'],
    vectorDescription: '9:16竖屏高清探店视频，呈现KOS店长在门店入口热情迎宾及店内互动过程，真实接地气',

    usageRelation: {
      noteId: 'NOTE-301',
      noteTitle: '线下试吃领好礼，宠物店日常打卡',
      projectId: 'p3',
      projectName: '线下门店KOS到店引流项目',
      accountName: '极宠家·KOS李店长',
      publishDate: '2026-08-01',
      usageState: 'used'
    },

    performance: {
      hasBackendData: true,
      performanceType: 'owned_account_creator_api',
      creatorBackend: {
        exposure: 15600,
        reads: 2100,
        interactions: 310,
        coverClickRate: 3.9,
        originalMetricName: '小红书创作者后台-封面点击率',
        dataSource: '小红书创作者API',
        lastSyncTime: '2026-08-21 02:00',
        dataCoverageStatus: '100% 全量同步',
        accountMedianComparison: {
          accountName: '极宠家·KOS李店长',
          topic: '门店打卡',
          medianClickRate: 3.5,
          comparisonLabel: '略高于同账号同主题中位数 (+0.4%)'
        }
      }
    },

    acceptance: {
      aiRecognition: {
        tag: '智能特征识别',
        status: 'passed',
        subject: '店长迎宾与店内互动',
        product: '试吃体验包',
        scene: '门店入口',
        composition: '竖屏单人',
        lightingColor: '室内明亮店铺光'
      }
    }
  },

  {
    id: 'MAT-2026-PENDING-01',
    name: '最新回传-体验官宠物倒粮倾泻画面',
    url: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=600&auto=format&fit=crop&q=80',
    aspectRatio: '3:4',
    fileType: 'image',
    fileSize: '3.9 MB',
    resolution: '3024x4032',

    category: 'publish_material',
    status: 'pending_acceptance',
    materialUse: 'real_shot',
    sourceType: 'task_upload',
    sourceLabel: '任务上传 (KOC回传)',

    uploader: 'KOC-阿柴的日常',
    uploadTime: '2026-08-20 22:15',
    sourceProject: '幼犬换粮软便卡位项目',

    tags: ['倒粮动态', '柴犬进食', '待确认', '细节实拍'],
    vectorDescription: '柴犬在碗边期待倾倒宠粮的特写画面，主粮颗粒呈动态倾泻状态，画面生动有吸引力',

    performance: {
      hasBackendData: false,
      performanceType: 'koc_public_captured',
      kocMetrics: {
        noBackendDataNotice: '无后台点击数据',
        adoptionStatus: '待操盘手人工验收',
        manualAcceptanceResult: '待操盘手确认 (照片分辨率合格)',
        aiPrecheckResult: '智能客观校验完成: 检测到局部遮挡，需要确认包装字样'
      }
    },

    acceptance: {
      aiRecognition: {
        tag: '智能特征识别',
        status: 'pending_confirmation',
        confidenceNotice: '提示：检测到包材局部遮挡与角落环境光较暗，待操盘手人工确认',
        subject: '柴犬与粮碗',
        product: '极宠家·幼犬粮',
        scene: '家庭客厅',
        composition: '侧视近景',
        lightingColor: '偏暗室内自然光'
      }
    }
  },

  {
    id: 'MAT-2026-ARCHIVE-01',
    name: '旧版包装袋直拍 (2025年已停产款)',
    url: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=600&auto=format&fit=crop&q=80',
    aspectRatio: '1:1',
    fileType: 'image',
    fileSize: '2.1 MB',
    resolution: '2000x2000',

    category: 'publish_material',
    status: 'archived',
    materialUse: 'real_shot',
    sourceType: 'merchant',
    sourceLabel: '操盘手归档',

    uploader: '旧版资产库',
    uploadTime: '2025-10-12 11:00',

    tags: ['老款停产', '历史归档', '旧包装'],
    vectorDescription: '已停产老款宠粮包装白底直拍图，已归档保存',

    performance: {
      hasBackendData: false,
      performanceType: 'none'
    },

    acceptance: {
      aiRecognition: {
        tag: '智能特征识别',
        status: 'passed',
        subject: '旧版包装',
        product: '老款粮',
        scene: '白底',
        composition: '居中',
        lightingColor: '白光'
      }
    }
  }
];

export const MOCK_PROJECT_OPTIONS = [
  '幼犬换粮软便卡位项目',
  '猫粮肠胃敏感科普项目',
  '线下门店KOS到店引流项目'
];

export const INITIAL_COLLECTION_TASKS = [
  {
    id: 'task_01',
    status: 'collecting',
    projectName: '幼犬换粮软便卡位项目',
    taskName: 'K11门店宠粮到店实拍',
    targetNoteTitle: '幼犬换粮攻略',
    executor: '张店长',
    deadline: '2026-08-25 20:00',
    completedCount: 2,
    totalCount: 4,
    shootGoal: '拍摄门店到店场景与主粮实物图',
    needsReshootCount: 0,
    shotsList: [
      { id: 'shot_1', shotName: '主粮正面近景', requirementDesc: '清晰展现包装袋成分说明', status: 'completed' }
    ]
  }
];


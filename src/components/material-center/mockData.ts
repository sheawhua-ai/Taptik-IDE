import { MaterialAsset, CollectionTask, NoteDraftRequirement } from './types';

export const INITIAL_ASSETS: MaterialAsset[] = [
  {
    id: 'mat_01',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&auto=format&fit=crop&q=80',
    oneSentenceUnderstanding: '棕色幼犬穿黄色卫衣坐在纯蓝背景前，画面主体突出、光线通透干净，适合作为萌宠日常或幼犬换粮体验类首图，但画面中没有出现品牌产品包装正面。',
    recommendationUse: '萌宠日常体验、幼犬食品体验首图、问答类笔记引导首图。',
    drawback: '未出现产品包装正面，做纯商品转化首图时需搭配嵌入商品贴图或配合实拍正文。',
    status: 'available',
    merchant: '极宠家旗舰店（上海总部）',
    sourceProject: '幼犬换粮避坑搜索卡位',
    sourceTask: 'K11门店宠粮到店开箱试喂实拍',
    shotName: 'S01-幼犬正坐萌宠特写',
    store: '上海静安K11旗舰店',
    executor: '张店长（KOS骨干）',
    uploadTime: '2026-08-01 14:20',
    fileInfo: {
      resolution: '3024x4032',
      format: 'JPEG',
      size: '3.4 MB',
      aspectRatio: '3:4'
    },
    understandingHistory: [
      {
        id: 'uh_01',
        version: 1,
        text: '棕色幼犬穿黄色卫衣坐在纯蓝背景前，画面主体突出、光线通透干净，适合作为萌宠日常或幼犬换粮体验类首图，但画面中没有出现品牌产品包装正面。',
        updatedBy: 'AI视觉引擎 (初始解析)',
        updatedAt: '2026-08-01 14:21'
      }
    ],
    usageRecords: [],
    fullAiAnalysis: {
      subject: '棕色幼犬（大约3-4个月大，穿着黄色绒面卫衣）',
      product: '无产品实物出镜',
      scene: '室内纯蓝色摄影幕布背景',
      action: '乖巧端正坐在地上，平视镜头微斜头',
      composition: '中央重点构图，竖屏对称比分',
      lightingColor: '高显色柔光灯棚光，黄色与亮蓝对冲色系'
    }
  },
  {
    id: 'mat_02',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600&auto=format&fit=crop&q=80',
    oneSentenceUnderstanding: '金色金毛幼犬在木地板上低头进食，旁边平放品牌幼犬敏感呵护粮全方位包装及试喂记录尺，主体明确、具备权威场景感，极度适配幼犬换粮攻略或测评长文图。',
    recommendationUse: '幼犬敏感肠胃换粮日记、干粮颗粒对比测评、3天过度换粮法正文配图。',
    drawback: '顶端存在部分留白，若用作小红书3:4首图建议做轻微上下裁剪。',
    status: 'available',
    merchant: '极宠家旗舰店（上海总部）',
    sourceProject: '幼犬换粮避坑搜索卡位',
    sourceTask: 'K11门店宠粮到店开箱试喂实拍',
    shotName: 'S02-进食和实物包装合影',
    store: '上海静安K11旗舰店',
    executor: '张店长（KOS骨干）',
    uploadTime: '2026-08-01 14:35',
    fileInfo: {
      resolution: '3840x2160',
      format: 'JPEG',
      size: '4.1 MB',
      aspectRatio: '16:9'
    },
    understandingHistory: [
      {
        id: 'uh_02_1',
        version: 1,
        text: '金色金毛幼犬在木地板上低头进食，旁边平放品牌幼犬敏感呵护粮全方位包装及试喂记录尺，主体明确、具备权威场景感，极度适配幼犬换粮攻略或测评长文图。',
        updatedBy: 'AI视觉引擎 (初始解析)',
        updatedAt: '2026-08-01 14:36'
      }
    ],
    usageRecords: [],
    fullAiAnalysis: {
      subject: '3月龄金毛幼犬与宠粮双重主体',
      product: '极宠家·幼犬敏感肠胃呵护粮2kg正装',
      scene: '家庭木地板实景与温馨光线',
      action: '真实专注低头食用干粮，颗粒展现完整',
      composition: '斜角透视构图，包材与宠物左右呼应',
      lightingColor: '暖白光，呈现真实自然色彩',
      ocrText: '极宠家 SUPER DOG / 幼犬呵护粮 / 37%生骨肉'
    }
  },
  {
    id: 'mat_03',
    type: 'video',
    url: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=600&auto=format&fit=crop&q=80',
    duration: '00:15',
    oneSentenceUnderstanding: '店员第一视角倾倒宠粮颗粒入陶瓷碗的高清动态实拍，可清晰看见肉质冻干颗粒和无油无粉尘质感，是展示原料真实性与清爽脆度的首选素材。',
    recommendationUse: '产品做工与成分真实性证明、开箱初体验视频转场、细节说服力挂载。',
    drawback: '视频未出现宠物舔食镜头，需与喂食镜头组合编辑。',
    status: 'in_use',
    merchant: '极宠家旗舰店（上海总部）',
    sourceProject: 'KOS店长号第一人称开箱SOP',
    sourceTask: '到店客户盲测与颗粒解析视频组',
    shotName: 'S03-近景倒粮颗粒动态特写',
    store: '杭州万象城体验店',
    executor: '李顾问（宠育专家）',
    uploadTime: '2026-07-29 11:15',
    fileInfo: {
      resolution: '1080x1920',
      format: 'MP4',
      size: '18.6 MB',
      aspectRatio: '9:16'
    },
    understandingHistory: [
      {
        id: 'uh_03',
        version: 1,
        text: '店员第一视角倾倒宠粮颗粒入陶瓷碗的高清动态实拍，可清晰看见肉质冻干颗粒和无油无粉尘质感，是展示原料真实性与清爽脆度的首选素材。',
        updatedBy: 'AI视觉引擎 (初始解析)',
        updatedAt: '2026-07-29 11:16'
      }
    ],
    usageRecords: [
      {
        id: 'rec_01',
        noteTitle: '亲测3大网红狗粮！为啥我家狗喝水少了不黑下巴？',
        project: 'KOS店长号第一人称开箱SOP',
        strategy: '第三期软文种草打法',
        account: '极宠家-李店长日常',
        publishTime: '占用中（待发布）',
        status: 'using',
        operator: '林运营（小红书操盘手）'
      }
    ],
    fullAiAnalysis: {
      subject: '不锈钢勺与冻干宠粮颗粒',
      product: '冻干三文鱼颗粒款犬粮',
      scene: '纯白实验式检测台背景',
      action: '手持勺子缓慢倾倒，展现酥脆声与散落状态',
      composition: '微距中心特写，9:16竖版呈现',
      lightingColor: '高亮白光，凸显无油光清爽质感'
    }
  },
  {
    id: 'mat_04',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&auto=format&fit=crop&q=80',
    oneSentenceUnderstanding: '小型犬在阳台日光下欢快奔跑并回头微笑，构图生动自由，适用于品牌情绪表达和换粮后活力无限的情感引流笔记封面，无产品植入。',
    recommendationUse: '养狗幸福感共鸣首图、活泼拉风萌宠故事帖封面。',
    drawback: '纯自然抓拍，无商业产品出现，需依靠标题文字或角标做种草转化。',
    status: 'used',
    merchant: '极宠家旗舰店（上海总部）',
    sourceProject: '线下门店高频实操实拍',
    sourceTask: '夏季宠友周末到店体验社群招募',
    shotName: 'S04-户外阳光跑动微笑',
    store: '北京朝阳大悦城体验空间',
    executor: '王摄师（全职视觉）',
    uploadTime: '2026-07-25 16:00',
    fileInfo: {
      resolution: '4000x3000',
      format: 'JPEG',
      size: '5.2 MB',
      aspectRatio: '4:3'
    },
    understandingHistory: [
      {
        id: 'uh_04',
        version: 1,
        text: '小型犬在阳台日光下欢快奔跑并回头微笑，构图生动自由，适用于品牌情绪表达和换粮后活力无限的情感引流笔记封面，无产品植入。',
        updatedBy: 'AI视觉引擎 (初始解析)',
        updatedAt: '2026-07-25 16:01'
      }
    ],
    usageRecords: [
      {
        id: 'rec_02',
        noteTitle: '换粮第10天！这毛色和活力是真的没话说…',
        project: '幼犬换粮避坑搜索卡位',
        strategy: '真实用户口碑发声系列',
        account: '豆豆饲养记（企业矩阵号）',
        publishTime: '2026-07-28 10:30',
        status: 'published',
        performanceData: '互动率高出类目平均值42%，收藏量超1200+，点击率11.4%',
        operator: '林运营（小红书操盘手）'
      }
    ],
    fullAiAnalysis: {
      subject: '柯基与金毛串串小型犬',
      product: '无产品实物出镜',
      scene: '阳光露台和绿色植被背景',
      action: '奔跑中回头咧嘴微笑，耳朵随风飘动',
      composition: '三分法运动构图，画面呼吸感强',
      lightingColor: '午后逆光轮廓光，暖金色调'
    }
  },
  {
    id: 'mat_05',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80',
    oneSentenceUnderstanding: '比格犬趴在整箱极宠家犬粮快递外包前，眼神认真且充满好奇，场景极为自然，可同时胜任买家晒单和开箱测评类文章配图。',
    recommendationUse: '真实买家秀日常分享、到货开箱第一眼心得、多口味对比评测。',
    drawback: '背景略显生活杂乱，商业精修质感稍弱，但真实可信度极高。',
    status: 'available',
    merchant: '极宠家旗舰店（上海总部）',
    sourceProject: '幼犬换粮避坑搜索卡位',
    sourceTask: 'K11门店宠粮到店开箱试喂实拍',
    shotName: 'S05-到货成箱拆箱和宠物互动',
    store: '上海静安K11旗舰店',
    executor: '张店长（KOS骨干）',
    uploadTime: '2026-08-01 15:10',
    fileInfo: {
      resolution: '3024x4032',
      format: 'JPEG',
      size: '3.8 MB',
      aspectRatio: '3:4'
    },
    understandingHistory: [
      {
        id: 'uh_05',
        version: 1,
        text: '比格犬趴在整箱极宠家犬粮快递外包前，眼神认真且充满好奇，场景极为自然，可同时胜任买家晒单和开箱测评类文章配图。',
        updatedBy: 'AI视觉引擎 (初始解析)',
        updatedAt: '2026-08-01 15:11'
      }
    ],
    usageRecords: [],
    fullAiAnalysis: {
      subject: '比格犬与整件包裹箱',
      product: '极宠家定制瓦楞牛皮纸外箱',
      scene: '温馨家居客厅地毯',
      action: '侧卧靠箱抬眸，专注看向镜面对面',
      composition: '中央饱满构图，近景抓拍',
      lightingColor: '室内自然射灯柔和偏暖色系'
    }
  },
  {
    id: 'mat_06',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&auto=format&fit=crop&q=80',
    oneSentenceUnderstanding: '基于优秀原素材（微调版本）：AI自动移除了右侧多余杂物，替换为清爽原木窗台背景，保留高互动表现力的萌犬神态，色彩更加亮眼纯净。',
    recommendationUse: '高爆款潜力复用首图、幼犬换粮搜索精细化封面图。',
    drawback: '由AI背景延伸和边缘处理，在200%放大下局部绒毛存在轻微柔化处理痕迹。',
    status: 'available',
    merchant: '极宠家旗舰店（上海总部）',
    sourceProject: '幼犬换粮避坑搜索卡位',
    sourceTask: '爆款素材微调衍生流水线',
    shotName: 'S06-阳光萌犬AI精修版',
    store: '上海静安K11旗舰店',
    executor: 'AI素材引擎（微调自动生成）',
    uploadTime: '2026-08-02 09:30',
    fileInfo: {
      resolution: '3000x4000',
      format: 'JPEG',
      size: '3.1 MB',
      aspectRatio: '3:4'
    },
    understandingHistory: [
      {
        id: 'uh_06',
        version: 1,
        text: '基于优秀原素材（微调版本）：AI自动移除了右侧多余杂物，替换为清爽原木窗台背景，保留高互动表现力的萌犬神态，色彩更加亮眼纯净。',
        updatedBy: 'AI视觉引擎 (衍生版解析)',
        updatedAt: '2026-08-02 09:31'
      }
    ],
    usageRecords: [],
    derivationInfo: {
      parentId: 'mat_04',
      parentName: '小型犬在阳台日光下欢快奔跑并回头微笑',
      familyId: 'fam_2026_04',
      modificationType: '更换背景 & 去除环境杂乱信息',
      createdBy: '林运营（触发微调）',
      createdAt: '2026-08-02 09:30',
      originNoteTitle: '换粮第10天！这毛色和活力是真的没话说…',
      originPerformance: '互动率高出类目平均值42%，收藏量超1200+'
    },
    fullAiAnalysis: {
      subject: '柯基金毛串串（微调精修轮廓）',
      product: '无实物植入',
      scene: '日系原木质感窗边浅色墙面',
      action: '回头咧嘴笑，高动态定格',
      composition: '中心对称裁剪为3:4比例',
      lightingColor: '高亮日系通透风，明度提升8%'
    }
  }
];

export const INITIAL_COLLECTION_TASKS: CollectionTask[] = [
  {
    id: 'task_01',
    projectName: '幼犬换粮避坑搜索卡位',
    taskName: 'K11门店宠粮到店开箱试喂实拍',
    store: '上海静安K11旗舰店',
    executor: '张店长（KOS骨干）',
    deadline: '2026-08-05 20:00',
    completedCount: 6,
    totalCount: 8,
    needsReshootCount: 1,
    blockPoint: 'S03镜头的包装背面成分表近距离反光，被AI自动驳回需重新补拍',
    shootGoal: '收集不少于8组幼犬和宠粮包装同时出现的高清场景图与喂食视频，作为搜索卡位软文主力配图。',
    shotsList: [
      {
        id: 'sh_101',
        shotCode: 'S01',
        shotName: '幼犬正坐萌宠特写',
        requirementDesc: '画面干净，无杂物，展现宠物灵动可爱的神态，为首图做强力吸引。',
        status: 'completed',
        assetId: 'mat_01'
      },
      {
        id: 'sh_102',
        shotCode: 'S02',
        shotName: '进食和实物包装合影',
        requirementDesc: '宠物正在吃粮，正前方摆放极宠家产品包装正面，Logo清晰可见。',
        status: 'completed',
        assetId: 'mat_02'
      },
      {
        id: 'sh_103',
        shotCode: 'S03',
        shotName: '包装背面成分营养标签近距拍摄',
        requirementDesc: '聚焦文字，无反光，可清晰看清前5大原料百分比。',
        status: 'rejected',
        rejectReason: '光线反射严重覆盖文字，AI OCR解析失败，不满足阅读清晰度要求。'
      },
      {
        id: 'sh_104',
        shotCode: 'S04',
        shotName: '便便形态或换粮日历表展示',
        requirementDesc: '侧面展示换粮第3天成型状态或每日换粮进度记录条。',
        status: 'pending'
      }
    ],
    uploadLogs: [
      {
        id: 'log_1',
        time: '2026-08-01 14:20',
        executor: '张店长',
        result: 'pass',
        detail: 'AI检查通过：画质清晰(3024x4032)，主体完整，已自动生成一句话理解并写入商家素材池。'
      },
      {
        id: 'log_2',
        time: '2026-08-01 14:35',
        executor: '张店长',
        result: 'pass',
        detail: 'AI检查通过：成功识别宠物与商品包装正面，构图规范。'
      },
      {
        id: 'log_3',
        time: '2026-08-01 14:50',
        executor: '张店长',
        result: 'reject',
        detail: 'AI检查不通过：包装背面反光导致文字无法阅读，存在强反光死角。'
      }
    ],
    rejectedRecords: [
      {
        id: 'rej_1',
        shotName: 'S03-包装背面成分营养标签近距拍摄',
        reason: '产品包装背面在灯光下产生剧烈反光，右侧成分百分比字迹过亮无法看清，建议调整光源45度角拍摄。',
        rejectedAt: '2026-08-01 14:50'
      }
    ]
  },
  {
    id: 'task_02',
    projectName: 'KOS店长号第一人称开箱SOP',
    taskName: '到店客户盲测与颗粒解析视频组',
    store: '杭州万象城体验店',
    executor: '李顾问（宠育专家）',
    deadline: '2026-08-06 18:00',
    completedCount: 5,
    totalCount: 5,
    needsReshootCount: 0,
    shootGoal: '从店员专家视角进行盲测解析，突出颗粒干燥度和冻干颗粒占率，增加信服力。',
    shotsList: [
      {
        id: 'sh_201',
        shotCode: 'S01',
        shotName: '近景倒粮颗粒动态特写',
        requirementDesc: '使用高帧率拍摄倒粮声与冻干散开细节。',
        status: 'completed',
        assetId: 'mat_03'
      }
    ],
    uploadLogs: [
      {
        id: 'log_201',
        time: '2026-07-29 11:15',
        executor: '李顾问',
        result: 'pass',
        detail: 'AI视频逐帧分析通过：画面无抖动，白平衡精准，声音清脆无噪音。'
      }
    ],
    rejectedRecords: []
  }
];

export const MOCK_NOTE_DRAFT: NoteDraftRequirement = {
  id: 'draft_202608',
  noteTitle: '幼犬换粮软便别慌！3天过度法+真实试吃日记',
  projectName: '幼犬换粮避坑搜索卡位',
  draftSummary: '针对新手宠主换粮常见的肠胃敏感、便便稀软、不适应问题，整理了循序渐进的3天换粮过度比例指南，并以亲测幼犬开箱体验呈现真实说服力。',
  imagePositions: [
    {
      posIndex: 1,
      label: '首图：幼犬和产品同时出现、画面干净',
      requirementDesc: '同时包含灵动萌犬与极宠家产品包装正面，干净明亮，高视力抓取，绝无模糊或竞品。',
      matchedLevel: 'recommend',
      matchedAssetId: 'mat_02',
      reason: '金色幼犬正在进食，前景平放极宠家产品包装正面，画面主体清晰、具有强烈场景真实感，极度适配首图，且目前状态可用。',
      drawbackNote: '当前分辨率比例为16:9，推荐作为小红书竖图首图发布前自动裁剪两侧或顶部。'
    },
    {
      posIndex: 2,
      label: '第2张：新旧粮颗粒对比特写',
      requirementDesc: '展现无油光、非膨化无粉尘颗粒质感或倒粮动态细节。',
      matchedLevel: 'recommend',
      matchedAssetId: 'mat_03',
      reason: '店员第一视角倾倒宠粮颗粒实拍视频，可以完整展现清爽非油腻状态和冻干颗比，极具信服力。',
      drawbackNote: '该素材目前处于“使用中”（关联：亲测3大网红狗粮），如果直接占用可能需调整另外篇目的选图。'
    },
    {
      posIndex: 3,
      label: '第3张：狗狗专注吃光或开箱期待眼神',
      requirementDesc: '展示幼犬进食完毕满意抬头或期待拆箱的萌态，强化情绪认可。',
      matchedLevel: 'other',
      matchedAssetId: 'mat_01',
      reason: '棕色幼犬坐姿端正可爱，表情极为活泼吸引，但画面未能呈现包装正面，需依靠图内文字排版进行辅助说明。',
      drawbackNote: '做部分核心需求取舍（无产品出镜），适合排在正文第3张配图位置。'
    },
    {
      posIndex: 4,
      label: '第4张：营养成分指标与授权质检编号特写',
      requirementDesc: '清晰呈现包装背面或第三方检测报告核心前5项蛋白含量字样。',
      matchedLevel: 'none',
      reason: '当前没有满足“成分指标特写＋文字阅读清晰度通过”的可用素材，原S03镜头由于严重反光已被AI退回。',
      drawbackNote: '建议对【K11门店宠粮到店开箱试喂实拍】任务发起补拍。'
    }
  ]
};

import { LibraryMaterialItem } from './types';

export const MOCK_LIBRARY_MATERIALS: LibraryMaterialItem[] = [
  {
    id: 'mat-1',
    title: '幼犬粮标准货架陈列与价签实拍',
    category: '门店实拍',
    url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&auto=format&fit=crop',
    source: '素材中心',
    matchScore: 98,
    tags: ['门店实拍', '货架陈列', '店长背书', '清晰价签'],
    dimensions: '2400 × 1800 px',
    isRecommendedCover: true
  },
  {
    id: 'mat-2',
    title: '幼犬进食盆特写（自然光食欲抓拍）',
    category: '使用场景',
    url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&auto=format&fit=crop',
    source: '素材中心',
    matchScore: 95,
    tags: ['幼犬进食', '食欲抓拍', '温水泡粮', '场景实测'],
    dimensions: '2400 × 1800 px',
    isRecommendedCover: true
  },
  {
    id: 'mat-3',
    title: '新旧粮颗粒对比（手持量杯参照）',
    category: '产品特写',
    url: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=800&auto=format&fit=crop',
    source: '素材中心',
    matchScore: 92,
    tags: ['颗粒对比', '手持实测', '7日过渡', '细节质感'],
    dimensions: '2160 × 1620 px',
    isRecommendedCover: false
  },
  {
    id: 'mat-4',
    title: '幼犬七天换粮比例对照指南图',
    category: '设计海报',
    url: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=800&auto=format&fit=crop',
    source: '知识库',
    matchScore: 89,
    tags: ['干货科普', '过渡比例', '图解指南', '收藏向'],
    dimensions: '1920 × 1440 px',
    isRecommendedCover: false
  },
  {
    id: 'mat-5',
    title: '益生菌多联活菌检测报告与资质凭证',
    category: '证书资质',
    url: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800&auto=format&fit=crop',
    source: '知识库',
    matchScore: 86,
    tags: ['检测报告', '多联活菌', '合规背书', '第三方认证'],
    dimensions: '2048 × 1536 px',
    isRecommendedCover: false
  },
  {
    id: 'mat-6',
    title: '金毛幼犬健康便便打卡对比图',
    category: '使用场景',
    url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&auto=format&fit=crop',
    source: '历史笔记',
    matchScore: 84,
    tags: ['KOC实录', '便便打卡', '7日成型', '真实口碑'],
    dimensions: '1920 × 1440 px',
    isRecommendedCover: false
  },
  {
    id: 'mat-7',
    title: '五星级海景宴会厅270度落地窗实拍',
    category: '门店实拍',
    url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&auto=format&fit=crop',
    source: '素材中心',
    matchScore: 96,
    tags: ['海景宴会厅', '浮山湾采光', '一线海景', '婚宴实地'],
    dimensions: '2560 × 1440 px',
    isRecommendedCover: true
  },
  {
    id: 'mat-8',
    title: '招牌葱烧海参高光暖光特写',
    category: '产品特写',
    url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop',
    source: '素材中心',
    matchScore: 94,
    tags: ['招牌主菜', '葱烧海参', '软糯色泽', '试菜测评'],
    dimensions: '2400 × 1800 px',
    isRecommendedCover: true
  }
];

export const MOCK_STAFF_MEMBERS = [
  { id: 'staff_zhang', name: '张店长 (陆家嘴店)', role: '门店KOS / 货架实拍', countPending: 2 },
  { id: 'staff_li', name: '李店长 (静安店)', role: '门店KOS / 备用执行', countPending: 1 },
  { id: 'staff_wang', name: '小红薯_汪汪队', role: 'KOC体验官 / 幼犬喂食实拍', countPending: 1 },
  { id: 'staff_qing', name: '试菜体验官_晴晴', role: 'KOC体验官 / 婚宴试菜实测', countPending: 2 },
  { id: 'staff_design', name: '设计组-小陈', role: '视觉设计 / 封面海报制作', countPending: 3 },
  { id: 'staff_all', name: '全体员工公开认领', role: '任务池广播', countPending: 0 }
];

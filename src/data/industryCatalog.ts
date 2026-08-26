export interface IndustryTertiaryOption {
  id: string;
  name: string;
}

export interface IndustrySecondaryOption {
  id: string;
  name: string;
  children: IndustryTertiaryOption[];
}

export interface IndustryPrimaryOption {
  id: string;
  name: string;
  children: IndustrySecondaryOption[];
}

export interface MerchantIndustryProfile {
  primaryId: string;
  primaryName: string;
  secondaryIds: string[];
  secondaryNames: string[];
  tertiaryIds: string[];
  tertiaryNames: string[];
}

export interface IndustryDefaults {
  workflowName: string;
  workflowSteps: string[];
  planTemplates: string[];
  contentTemplates: string[];
  accountRoles: string[];
}

export const INDUSTRY_CATALOG: IndustryPrimaryOption[] = [
  {
    id: "pet",
    name: "宠物",
    children: [
      { id: "pet_food", name: "宠物食品", children: [{ id: "dog_food", name: "犬粮" }, { id: "cat_food", name: "猫粮" }, { id: "pet_snack", name: "冻干/零食" }, { id: "sensitive_stomach", name: "肠胃敏感" }] },
      { id: "pet_supplies", name: "宠物用品", children: [{ id: "pet_cleaning", name: "清洁护理" }, { id: "smart_pet", name: "智能用品" }, { id: "pet_travel", name: "出行用品" }] },
      { id: "pet_service", name: "宠物服务", children: [{ id: "pet_hospital", name: "宠物医院" }, { id: "pet_grooming", name: "洗护美容" }, { id: "pet_training", name: "寄养训练" }] }
    ]
  },
  {
    id: "beauty",
    name: "美妆个护",
    children: [
      { id: "skincare", name: "护肤", children: [{ id: "sensitive_skin", name: "敏感肌" }, { id: "anti_aging", name: "抗老" }, { id: "acne_skin", name: "痘肌" }] },
      { id: "makeup", name: "彩妆", children: [{ id: "base_makeup", name: "底妆" }, { id: "lip_makeup", name: "唇妆" }, { id: "eye_makeup", name: "眼妆" }] },
      { id: "personal_care", name: "洗护", children: [{ id: "hair_care", name: "洗发护发" }, { id: "body_care", name: "身体护理" }, { id: "fragrance", name: "香氛" }] }
    ]
  },
  {
    id: "food_local",
    name: "餐饮与本地生活",
    children: [
      { id: "restaurant", name: "正餐", children: [{ id: "wedding_banquet", name: "婚宴" }, { id: "chinese_food", name: "中餐" }, { id: "western_food", name: "西餐" }] },
      { id: "drinks_dessert", name: "饮品甜品", children: [{ id: "coffee", name: "咖啡" }, { id: "tea_drink", name: "茶饮" }, { id: "bakery", name: "烘焙" }] },
      { id: "local_service", name: "到店服务", children: [{ id: "store_visit", name: "探店种草" }, { id: "group_buy", name: "团购转化" }, { id: "membership", name: "会员增长" }] }
    ]
  },
  {
    id: "maternal_baby",
    name: "母婴",
    children: [
      { id: "baby_food", name: "婴童食品", children: [{ id: "milk_powder", name: "奶粉" }, { id: "complementary_food", name: "辅食" }, { id: "nutrition", name: "营养品" }] },
      { id: "baby_supplies", name: "母婴用品", children: [{ id: "diaper", name: "纸尿裤" }, { id: "feeding", name: "喂养用品" }, { id: "baby_cleaning", name: "洗护清洁" }] },
      { id: "parenting_service", name: "母婴服务", children: [{ id: "postpartum", name: "产后护理" }, { id: "early_education", name: "早教" }, { id: "family_photo", name: "亲子摄影" }] }
    ]
  },
  {
    id: "home",
    name: "家居家装",
    children: [
      { id: "furniture", name: "家具软装", children: [{ id: "whole_house", name: "全屋定制" }, { id: "sofa_bed", name: "沙发床垫" }, { id: "home_textile", name: "家纺" }] },
      { id: "appliance", name: "家电", children: [{ id: "kitchen_appliance", name: "厨电" }, { id: "cleaning_appliance", name: "清洁电器" }, { id: "smart_home", name: "智能家居" }] },
      { id: "renovation", name: "装修服务", children: [{ id: "design", name: "空间设计" }, { id: "construction", name: "施工" }, { id: "building_material", name: "建材" }] }
    ]
  }
];

const DEFAULTS_BY_PRIMARY: Record<string, IndustryDefaults> = {
  pet: {
    workflowName: "宠物行业信任种草流程",
    workflowSteps: ["痛点与搜索机会", "真实体验内容", "专业解释补强", "素材与体验反馈", "矩阵发布", "搜索收录与咨询复盘"],
    planTemplates: ["新品冷启动", "核心痛点搜索卡位", "KOC真实体验测评"],
    contentTemplates: ["七日体验记录", "专业成分解读", "常见问题避坑"],
    accountRoles: ["品牌主号", "店长号/KOS", "消费者KOC"]
  },
  beauty: {
    workflowName: "美妆功效证据种草流程",
    workflowSteps: ["人群与肤质细分", "功效表达校验", "试用素材生产", "达人/用户发布", "搜索与互动观察", "功效内容复盘"],
    planTemplates: ["新品试用起盘", "功效词搜索卡位", "肤质人群内容矩阵"],
    contentTemplates: ["阶段使用记录", "成分与肤质科普", "妆效对比"],
    accountRoles: ["品牌主号", "柜姐/KOS", "试用用户KOC"]
  },
  food_local: {
    workflowName: "本地到店决策流程",
    workflowSteps: ["本地需求洞察", "场景卖点设计", "到店体验素材", "探店内容发布", "搜索/团购承接", "到店与咨询复盘"],
    planTemplates: ["门店冷启动", "节庆节点运营", "本地搜索卡位"],
    contentTemplates: ["真实探店动线", "招牌产品体验", "价格与预订攻略"],
    accountRoles: ["品牌门店号", "店长/KOS", "到店体验KOC"]
  },
  maternal_baby: {
    workflowName: "母婴信任决策流程",
    workflowSteps: ["阶段与人群识别", "安全合规校验", "真实使用反馈", "专业知识补强", "内容分发", "咨询与口碑复盘"],
    planTemplates: ["新品体验计划", "成长阶段内容矩阵", "核心问题搜索卡位"],
    contentTemplates: ["阶段使用日记", "成分安全科普", "新手问题清单"],
    accountRoles: ["品牌主号", "顾问/KOS", "宝妈KOC"]
  },
  home: {
    workflowName: "家居决策周期运营流程",
    workflowSteps: ["户型与预算洞察", "方案案例内容", "到店/量房线索", "施工与效果素材", "矩阵发布", "线索质量复盘"],
    planTemplates: ["门店获客", "样板案例矩阵", "装修节点搜索卡位"],
    contentTemplates: ["真实改造案例", "预算避坑", "材料工艺解析"],
    accountRoles: ["品牌主号", "设计师/KOS", "业主KOC"]
  }
};

export function buildIndustryProfile(primaryId: string, secondaryIds: string[], tertiaryIds: string[]): MerchantIndustryProfile | null {
  const primary = INDUSTRY_CATALOG.find(item => item.id === primaryId);
  if (!primary) return null;
  const secondary = primary.children.filter(item => secondaryIds.includes(item.id));
  const tertiary = primary.children.flatMap(item => item.children).filter(item => tertiaryIds.includes(item.id));
  return {
    primaryId: primary.id,
    primaryName: primary.name,
    secondaryIds: secondary.map(item => item.id),
    secondaryNames: secondary.map(item => item.name),
    tertiaryIds: tertiary.map(item => item.id),
    tertiaryNames: tertiary.map(item => item.name)
  };
}

export function getIndustryDefaults(primaryId: string): IndustryDefaults {
  return DEFAULTS_BY_PRIMARY[primaryId] || DEFAULTS_BY_PRIMARY.pet;
}

export type MerchantCompletenessAction = "edit" | "knowledge";

export interface MerchantCompletenessItem {
  id: "basic" | "industry" | "category" | "owner" | "knowledge";
  label: string;
  description: string;
  complete: boolean;
  weight: number;
  action: MerchantCompletenessAction;
}

const hasValues = (value: unknown) => Array.isArray(value) && value.some(Boolean);

export function getMerchantCompletenessItems(merchant: any): MerchantCompletenessItem[] {
  const hasIndustry = Boolean(
    merchant?.industryProfile?.primaryId
    || merchant?.industry
    || hasValues(merchant?.tags),
  );
  const hasOwner = Boolean(
    (merchant?.username || merchant?.owner?.username)
    && (merchant?.phone || merchant?.owner?.phone),
  );
  const hasCategory = Boolean(
    hasValues(merchant?.industryProfile?.secondaryIds)
    || hasValues(merchant?.industryProfile?.tertiaryIds)
    || (merchant?.tags || []).some((tag: string, index: number) => (
      index > 0 && !["待启动", "高优", "历史项目"].includes(tag)
    )),
  );
  const hasKnowledge = Boolean(
    hasValues(merchant?.knowledge)
    || hasValues(merchant?.fileTree)
    || hasValues(merchant?.linkedKnowledge),
  );

  return [
    {
      id: "basic",
      label: "基础档案",
      description: merchant?.name ? `商家名称：${merchant.name}` : "缺少商家名称",
      complete: Boolean(merchant?.name),
      weight: 20,
      action: "edit",
    },
    {
      id: "industry",
      label: "行业信息",
      description: hasIndustry ? "已设置一级行业及可用的细分行业" : "缺少一级行业，无法匹配行业起盘方案",
      complete: hasIndustry,
      weight: 20,
      action: "edit",
    },
    {
      id: "category",
      label: "细分品类",
      description: hasCategory ? "已设置二级或三级细分品类" : "需要补充细分品类，提高行业模板匹配精度",
      complete: hasCategory,
      weight: 20,
      action: "edit",
    },
    {
      id: "owner",
      label: "负责人信息",
      description: hasOwner ? "负责人用户名与联系电话已填写" : "需要补充负责人用户名和联系电话",
      complete: hasOwner,
      weight: 20,
      action: "edit",
    },
    {
      id: "knowledge",
      label: "本地知识资料",
      description: hasKnowledge ? "已链接可供 TAPTIK 调用的本地资料" : "尚未链接产品资料、FAQ、品牌表达或审核约束",
      complete: hasKnowledge,
      weight: 20,
      action: "knowledge",
    },
  ];
}

export function getMerchantCompleteness(merchant: any) {
  return getMerchantCompletenessItems(merchant).reduce(
    (total, item) => total + (item.complete ? item.weight : 0),
    0,
  );
}

export const MATERIAL_USE_LABELS: Record<string, string> = {
  cover: '封面图',
  body_image: '笔记配图',
  real_shot: '实拍照片',
  component_cutout: '透明底产品图',
  component_logo: '品牌 Logo',
  component_packaging: '包装细节图',
  component_swatch: '品牌色彩参考'
};

export const MATERIAL_CATEGORY_LABELS: Record<string, string> = {
  base_component: '基础图片素材',
  publish_material: '发布用图片',
  derived_material: 'AI 处理后的新图片'
};

export const getMaterialUseLabel = (value: string) => MATERIAL_USE_LABELS[value] ?? '其他图片';

export const getMaterialCategoryLabel = (value: string) => MATERIAL_CATEGORY_LABELS[value] ?? '其他图片';

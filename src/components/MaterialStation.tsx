import React from 'react';
import { MaterialCenterMain } from './material-center/MaterialCenterMain';

interface MaterialStationProps {
  activeProject?: any;
}

/**
 * 按照《TapTik AI素材中心重构指令 V3》要求重构的“AI协同素材中心”
 * 核心职责：
 * 1. 承接各项目下发的素材收集任务；
 * 2. 将通过AI处理的素材沉淀到商家级素材池；
 * 3. 允许素材跨项目使用；
 * 4. 支持自然语言查找和理解素材；
 * 5. 在笔记草稿生成后，由笔记需求自动扫描素材中心；
 * 6. 追踪素材的占用、发布和效果；
 * 7. 对表现较好的已使用素材发起微调复用；
 * 8. 将新的衍生版本重新放入可用素材池。
 */
export const MaterialStation: React.FC<MaterialStationProps> = ({ activeProject }) => {
  return <MaterialCenterMain activeProject={activeProject} />;
};

export default MaterialStation;

const fs = require('fs');
const code = fs.readFileSync('src/components/material-center/MaterialCenterMain.tsx', 'utf-8');

const newCode = code.replace(
  /\/\/ 卡片选择 \/ 预占事件[\s\S]*?(?=\s+return \()/g,
  `// 卡片选择 / 预占事件
  const handleSelectAsset = (asset: MaterialAsset) => {
    const targetTitle =
      activeProject?.name || '幼犬换粮攻略种草日记';
    const updatedAsset: MaterialAsset = {
      ...asset,
      status: 'reserved',
      linkedNoteTitle: targetTitle,
      usageRecords: [
        {
          id: \`rec_\${Date.now()}\`,
          noteTitle: targetTitle,
          project: asset.sourceProject || '默认项目',
          publishTime: '预占中（待发布）',
          status: 'reserved',
          operator: '当前操盘手'
        },
        ...asset.usageRecords
      ]
    };

    setAssets((prev) => prev.map((a) => (a.id === asset.id ? updatedAsset : a)));
    alert(
      \`已将该素材预占给笔记【\${targetTitle}】。其他未发布笔记默认不可选择此素材。\`
    );
  };

  // 微调生成衍生版本逻辑 (Section 11)
  const handleConfirmDerive = async (
    parentAsset: MaterialAsset,
    modType: string
  ): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const derivativeUnderstanding = \`基于优秀已使用爆款制作的衍生版：进行了【\${modType}】。画面保留高表现力核心特征，色彩通透清晰，可作为新的可用素材进行跨项目分发。\`;

    const newDerivative: MaterialAsset = {
      id: \`mat_der_\${Date.now().toString().slice(-4)}\`,
      type: parentAsset.type,
      url: parentAsset.url,
      aiOneLineUnderstanding: derivativeUnderstanding,
      recommendationUse: parentAsset.recommendationUse,
      suitableForCover: 'optimized_suitable',
      coverReason: 'AI优化后主体更清晰，背景更干净，适合作为封面使用。',
      status: 'available',
      sourceType: 'ai_optimized',
      sourceProject: parentAsset.sourceProject,
      sourceTask: (parentAsset.sourceTask || '') + ' (衍生微调流水线)',
      uploader: 'AI素材引擎',
      uploadTime: new Date().toISOString().replace('T', ' ').slice(0, 16),
      authStatus: 'verified',
      fileInfo: parentAsset.fileInfo,
      usageRecords: [],
      derivationInfo: {
        parentId: parentAsset.id,
        parentName: parentAsset.aiOneLineUnderstanding.slice(0, 18) + '...',
        familyId:
          parentAsset.derivationInfo?.familyId ||
          \`fam_\${parentAsset.id.slice(-4)}\`,
        modificationType: modType,
        createdBy: '主操盘手 (激活微调)',
        createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
      },
      fullAiAnalysis: {
        ...parentAsset.fullAiAnalysis,
        subject: \`\${parentAsset.fullAiAnalysis.subject} (微调衍生版)\`
      }
    };

    setAssets((prev) => [newDerivative, ...prev]);
    alert(
      \`衍生版本已完成 AI 画面理解、向量表征与检索索引更新！\\n现已放入商家“可用”素材池，可直接跨项目调用。\`
    );
  };

  // 补充上传成功写入
  const handleSuccessUpload = (newAsset: MaterialAsset) => {
    setAssets((prev) => [newAsset, ...prev]);
    setShowUploadModal(false);
  };

  // 导入历史素材处理 (兼容主页右上角“更多 - 导入历史素材” Section 4.1)
  const handleImportHistory = () => {
    const historicalAsset: MaterialAsset = {
      id: \`mat_hist_\${Date.now().toString().slice(-4)}\`,
      type: 'image',
      url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&auto=format&fit=crop&q=80',
      aiOneLineUnderstanding:
        '品牌早期沉淀的线下到店实拍场景，包含萌犬日常及宠物主亲密喂食画面，自然真实，无显式广告文案。',
      recommendationUse: '通用到店体验、品牌可信度故事图',
      suitableForCover: 'suitable',
      coverReason: '真实场景，自然光线。',
      status: 'available',
      sourceType: 'other',
      sourceProject: '2025年到店体验计划 (历史导入)',
      sourceTask: '历史图库全量迁移',
      uploader: '历史图库管理员',
      uploadTime: '2025-11-15 10:00',
      authStatus: 'verified',
      fileInfo: {
        resolution: '2048x1536',
        format: 'JPEG',
        size: '1.8 MB',
        aspectRatio: '4:3'
      },
      usageRecords: [],
      fullAiAnalysis: {
        subject: '历史到店萌犬相册图',
        product: '极宠家早期试喂礼盒',
        scene: '线下门店体验区',
        composition: '自然实拍构图',
        lightingColor: '暖色温馨氛围光'
      }
    };

    setAssets((prev) => [historicalAsset, ...prev]);
    alert(
      \`已导入 1 张历史图库素材，AI引擎已为其生成统一【一句话理解】与语义检索向量，并统一标记为“来源：历史导入”。\`
    );
  };
`
);

fs.writeFileSync('src/components/material-center/MaterialCenterMain.tsx', newCode);

    );
  };

  // 微调生成衍生版本逻辑 (Section 11)
  const handleConfirmDerive = async (
    parentAsset: MaterialAsset,
    modType: string
  ): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const derivativeUnderstanding = `基于优秀已使用爆款【${
      parentAsset.shotName
    }】制作的衍生版：进行了【${modType}】。画面保留高表现力核心特征，色彩通透清晰，可作为新的可用素材进行跨项目分发。`;

    const newDerivative: MaterialAsset = {
      id: `mat_der_${Date.now().toString().slice(-4)}`,
      type: parentAsset.type,
      url: parentAsset.url,
      oneSentenceUnderstanding: derivativeUnderstanding,
      recommendationUse: parentAsset.recommendationUse,
      drawback: '由AI微调生成，具备原素材爆款基因',
      status: 'available',
      merchant: parentAsset.merchant,
      sourceProject: parentAsset.sourceProject,
      sourceTask: parentAsset.sourceTask + ' (衍生微调流水线)',
      shotName: parentAsset.shotName + '·衍生版',
      store: parentAsset.store,
      executor: 'AI素材引擎（微调复用生成）',
      uploadTime: new Date().toISOString().replace('T', ' ').slice(0, 16),
      fileInfo: parentAsset.fileInfo,
      understandingHistory: [
        {
          id: `uh_der_${Date.now()}`,
          version: 1,
          text: derivativeUnderstanding,
          updatedBy: 'AI视觉引擎 (衍生版多模态理解)',
          updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
        }
      ],
      usageRecords: [],
      derivationInfo: {
        parentId: parentAsset.id,
        parentName: parentAsset.oneSentenceUnderstanding.slice(0, 18) + '...',
        familyId:
          parentAsset.derivationInfo?.familyId ||
          `fam_${parentAsset.id.slice(-4)}`,
        modificationType: modType,
        createdBy: '主操盘手 (激活微调)',
        createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        originNoteTitle:
          parentAsset.usageRecords[0]?.noteTitle || '换粮避坑口碑笔记',
        originPerformance:
          parentAsset.usageRecords[0]?.performanceData ||
          '收藏率与互动明显高出类目平均值42%'
      },
      fullAiAnalysis: {
        ...parentAsset.fullAiAnalysis,
        subject: `${parentAsset.fullAiAnalysis.subject} (微调衍生版)`
      }
    };

    setAssets((prev) => [newDerivative, ...prev]);
    alert(
      `衍生版本已完成 AI 画面理解、向量表征与检索索引更新！\n现已放入商家“可用”素材池，可直接跨项目调用。`
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
      id: `mat_hist_${Date.now().toString().slice(-4)}`,
      type: 'image',
      url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&auto=format&fit=crop&q=80',
      oneSentenceUnderstanding:
        '品牌早期沉淀的线下到店实拍场景，包含萌犬日常及宠物主亲密喂食画面，自然真实，无显式广告文案。',
      recommendationUse: '通用到店体验、品牌可信度故事图',
      drawback: '历史图库分辨率稍逊于新拍机型',
      status: 'available',
      merchant: '极宠家旗舰店（上海总部）',
      sourceProject: '2025年到店体验计划 (历史导入)',
      sourceTask: '历史图库全量迁移',
      shotName: '历史档案-真实到店喂养',
      store: '上海总部样板间',
      executor: '历史图库管理员',
      uploadTime: '2025-11-15 10:00',
      isHistoricalImport: true,
      fileInfo: {
        resolution: '2048x1536',
        format: 'JPEG',
        size: '1.8 MB',
        aspectRatio: '4:3'
      },
      understandingHistory: [
        {
          id: `uh_hist_${Date.now()}`,
          version: 1,
          text: '品牌早期沉淀的线下到店实拍场景，包含萌犬日常及宠物主亲密喂食画面，自然真实，无显式广告文案。',
          updatedBy: 'AI视觉引擎 (历史图全量多模态转译)',
          updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
        }
      ],
      usageRecords: [],
      fullAiAnalysis: {
        subject: '历史到店萌犬相册图',
        product: '极宠家早期试喂礼盒',
        scene: '线下门店体验区',
        action: '自然到店互动',
        composition: '自然实拍构图',
        lightingColor: '暖色温馨氛围光'
      }
    };

    setAssets((prev) => [historicalAsset, ...prev]);
    alert(
      `已导入 1 张历史图库素材，AI引擎已为其生成统一【一句话理解】与语义检索向量，并统一标记为“来源：历史导入”。`
    );
  };

  return (
    <div className="w-full min-h-full bg-neutral-50/60 p-5 md:p-8 space-y-6 max-w-7xl mx-auto pb-20">
      {/* 跨一级页签切换栏：素材 / 拍摄任务 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-2 rounded-2xl border border-neutral-200 shadow-2xs">
        <div className="flex items-center gap-1.5 p-1 bg-neutral-100/80 rounded-xl">
          <button
            type="button"

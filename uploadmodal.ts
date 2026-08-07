          understandingHistory: [
            {
              id: `uh_${Date.now()}`,
              version: 1,
              text: understanding,
              updatedBy: 'AI视觉引擎 (自动生成)',
              updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
            }
          ],
          usageRecords: [],
          fullAiAnalysis: {
            subject: `${selectedShot.shotName} 主体`,
            product: '极宠家·敏感肠胃呵护粮',
            scene: selectedTask.store,
            action: '自然到店拍摄与宠物互动',
            composition: '标准3:4小红书竖图比例',
            lightingColor: '高显色自然光'
          }
        };

        setTimeout(() => {
          onSuccessUpload(newAsset);
        }, 800);
      } else {
        // AI 检查不通过 (Section 7.3)
        setInspectStatus('reject');
        setRejectReasons([
          '1. 产品包装正面不完整，难以识别产品标识；',
          '2. 局部发生高亮反光，文字内容可读性低于阈值；',
          '3. 构图偏离分镜说明要求，与已有图库存在较高相似重复率。'
        ]);
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-60 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-neutral-900 text-white">
          <div className="flex items-center gap-2.5">

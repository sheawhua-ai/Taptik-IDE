const fs = require('fs');
const code = fs.readFileSync('src/components/material-center/UploadModal.tsx', 'utf-8');

const newCode = code.replace(
  /const newAsset: MaterialAsset = \{[\s\S]*?fullAiAnalysis: \{[\s\S]*?\}[\s\S]*?\};/g,
  `const newAsset: MaterialAsset = {
          id: \`mat_new_\${Date.now().toString().slice(-4)}\`,
          type: 'image',
          url: mediaUrl,
          aiOneLineUnderstanding: understanding,
          recommendationUse: '自动推荐用途（测试）',
          suitableForCover: 'neutral',
          status: 'pending',
          sourceType: 'task',
          sourceProject: selectedTask.projectName,
          sourceTask: selectedTask.taskName,
          uploader: selectedTask.executor,
          uploadTime: new Date().toISOString().replace('T', ' ').slice(0, 16),
          authStatus: 'pending',
          fileInfo: {
            resolution: '1080x1440',
            format: 'JPEG',
            size: '1.2 MB',
            aspectRatio: '3:4'
          },
          usageRecords: [],
          fullAiAnalysis: {
            subject: \`\${selectedShot.shotName} 主体\`,
            product: '极宠家·敏感肠胃呵护粮',
            scene: selectedTask.store,
            composition: '标准3:4小红书竖图比例',
            lightingColor: '高显色自然光'
          }
        };`
);

fs.writeFileSync('src/components/material-center/UploadModal.tsx', newCode);

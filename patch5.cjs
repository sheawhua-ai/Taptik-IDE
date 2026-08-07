const fs = require('fs');

let uploadCode = fs.readFileSync('src/components/material-center/UploadModal.tsx', 'utf-8');
uploadCode = uploadCode.replace("suitableForCover: 'suitable',", "suitableForCover: 'suitable',\n          coverReason: 'AI 检查通过，等待审核。',");
fs.writeFileSync('src/components/material-center/UploadModal.tsx', uploadCode);

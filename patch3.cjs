const fs = require('fs');

// Fix UploadModal.tsx
let uploadCode = fs.readFileSync('src/components/material-center/UploadModal.tsx', 'utf-8');
uploadCode = uploadCode.replace("suitableForCover: 'neutral'", "suitableForCover: 'unknown'");
uploadCode = uploadCode.replace("sourceType: 'task'", "sourceType: 'user_upload'");
fs.writeFileSync('src/components/material-center/UploadModal.tsx', uploadCode);

// Fix MaterialCenterMain.tsx
let mainCode = fs.readFileSync('src/components/material-center/MaterialCenterMain.tsx', 'utf-8');
mainCode = mainCode.replace(/availableStores=\{availableStores\}\s*/g, '');
fs.writeFileSync('src/components/material-center/MaterialCenterMain.tsx', mainCode);

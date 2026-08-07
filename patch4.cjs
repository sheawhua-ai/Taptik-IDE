const fs = require('fs');

// Fix UploadModal.tsx
let uploadCode = fs.readFileSync('src/components/material-center/UploadModal.tsx', 'utf-8');
uploadCode = uploadCode.replace("suitableForCover: 'unknown'", "suitableForCover: 'suitable'");
uploadCode = uploadCode.replace("sourceType: 'user_upload'", "sourceType: 'operator'");
fs.writeFileSync('src/components/material-center/UploadModal.tsx', uploadCode);

const fs = require('fs');
const file = 'src/pages/MerchantMatrix.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('UploadCloud')) {
  // It doesn't include UploadCloud in the import
}
content = content.replace(/User, Clock} from 'lucide-react';/, "User, Clock, UploadCloud, Users} from 'lucide-react';");
fs.writeFileSync(file, content);

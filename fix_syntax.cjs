const fs = require('fs');
const file = 'src/pages/MerchantMatrix.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace('               </div>               </div>\n             </motion.div>', '               </div>\n             </motion.div>');

fs.writeFileSync(file, content);

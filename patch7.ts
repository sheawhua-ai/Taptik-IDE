import fs from 'fs';

let code = fs.readFileSync('src/pages/MerchantMatrix.tsx', 'utf8');

// Fix the `</>;`
code = code.replace(/<\/>;\n \}/g, '</> );\n  }');

// Fix the extra `</div>`
code = code.replace(/<\/div>\n  <\/div>\n  <\/div>\n  <\/motion\.div>/g, '</div>\n  </div>\n  </motion.div>');

fs.writeFileSync('src/pages/MerchantMatrix.tsx', code);

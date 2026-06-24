import fs from 'fs';
let content = fs.readFileSync('src/pages/MerchantMatrix.tsx', 'utf8');

const str = `        </div>
      </div>
      </div>
    </div>
  );
}`;

const newStr = `        </div>
      </div>
  );
}`;

content = content.replace(str, newStr);

fs.writeFileSync('src/pages/MerchantMatrix.tsx', content);
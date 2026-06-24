import fs from 'fs';

let content = fs.readFileSync('src/pages/MerchantMatrix.tsx', 'utf8');

// 1. Update NoteDraft Interface
const noteDraftRegex = /interface NoteDraft \{\n  id: string;\n  title: string;\n  content: string;\n  imageType: 'official' \| 'real_shoot' \| 'pending';\n  status: 'drafting' \| 'review' \| 'dispatched' \| 'scheduled' \| 'published';\n  selected\?: boolean;\n\}/;

const newNoteDraft = `interface NoteDraft {
  id: string;
  title: string;
  content: string;
  score?: number;
  targetViews?: number;
  targetInteractions?: number;
  imageType: 'official' | 'real_shoot' | 'pending';
  status: 'drafting' | 'review' | 'dispatched' | 'scheduled' | 'published';
  selected?: boolean;
  kocWeChat?: string;
  kocXhs?: string;
}`;

content = content.replace(noteDraftRegex, newNoteDraft);

// 2. Update generateMocks
const generateMocksRegex = /setDrafts\(\[\n        \{ id: '1'.*? \},\n        \{ id: '2'.*? \}\n      \]\);/;

const newGenerateMocks = `setDrafts([
        { id: '1', title: '防晒测评第1篇：户外暴晒', content: '作为一个每天通勤的打工人...', score: 92, imageType: 'pending', targetViews: 5000, targetInteractions: 120, status: 'review' },
        { id: '2', title: '防晒单品：带妆不补涂', content: '妆后补防晒真的是个技术活...', score: 85, imageType: 'pending', targetViews: 3000, targetInteractions: 80, status: 'drafting' },
        { id: '3', title: '绝美出街防晒穿搭', content: '今天分享防晒又轻薄的搭配...', score: 95, imageType: 'real_shoot', targetViews: 8000, targetInteractions: 200, status: 'published', kocWeChat: 'wx123_summer', kocXhs: '夏日小甜甜' },
        { id: '4', title: '防晒红黑榜：看看你中招没', content: '总结了几款踩雷和真香的防晒产品。', score: 88, imageType: 'real_shoot', targetViews: 6000, targetInteractions: 150, status: 'scheduled', kocWeChat: 'beauty_koc_01', kocXhs: '护肤野生专家' }
      ]);`;

content = content.replace(generateMocksRegex, newGenerateMocks);

fs.writeFileSync('src/pages/MerchantMatrix.tsx', content);

console.log("Patched NoteDraft and Mocks");

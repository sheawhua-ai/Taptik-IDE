import fs from 'fs';

// 1. Fix App.tsx icons
let appContent = fs.readFileSync('src/App.tsx', 'utf8');

// The icons in PROJECT_TABS are:
// { id: "strategy", name: "选题与策略", icon: Compass },
// { id: "matrix", name: "项目与内容", icon: LayoutGrid },
// { id: "content", name: "账号与分发", icon: Sparkles }, -> Share2
// { id: "interaction", name: "舆情预警与工单", icon: MessageSquare },
// { id: "metrics", name: "深度数据看板", icon: BarChart2 },

appContent = appContent.replace(
  /{ id: "content", name: "账号与分发", icon: Sparkles }/g,
  '{ id: "content", name: "账号与分发", icon: Share2 }'
);
if (!appContent.includes('import {') || !appContent.includes('Share2')) {
  // ensure Share2 is imported
  appContent = appContent.replace('Sparkles,', 'Sparkles, Share2,');
}

fs.writeFileSync('src/App.tsx', appContent);

// 2. Fix MerchantMatrix.tsx header
let matrixContent = fs.readFileSync('src/pages/MerchantMatrix.tsx', 'utf8');

const regexOldHeader = /<h2 className="text-2xl font-semibold text-neutral-900 tracking-tight">项目与内容<\/h2>\s*<p className="text-neutral-500 mt-1">管理日常拉新内容的生成与素材采集任务<\/p>/gs;

const newHeader = `<div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-neutral-900 text-white rounded-2xl flex items-center justify-center shadow-lg">
              <LayoutGrid size={24} />
            </div>
            <div>
              <h2 className="text-[17px] font-semibold text-neutral-900 tracking-tight">项目与内容</h2>
              <p className="text-[11px] text-neutral-400 mt-0.5">管理日常拉新内容的生成与素材采集流水线</p>
            </div>
          </div>`;

matrixContent = matrixContent.replace(
  /<div className="flex items-center justify-between mb-8">/, 
  `<div className="h-20 border-b border-neutral-100 px-8 flex items-center justify-between shrink-0 bg-white z-10 sticky top-0">`
);

matrixContent = matrixContent.replace(
  /<div>\s*<h2 className="text-2xl font-semibold text-neutral-900 tracking-tight">项目与内容<\/h2>\s*<p className="text-neutral-500 mt-1">管理日常拉新内容的生成与素材采集任务<\/p>\s*<\/div>/,
  newHeader
);

fs.writeFileSync('src/pages/MerchantMatrix.tsx', matrixContent);

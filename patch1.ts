import fs from 'fs';

let code = fs.readFileSync('src/pages/MerchantMatrix.tsx', 'utf8');

// 1. Add targetGroup to MOCK_PROJECTS
const MOCK_PROJECTS_REGEX = /const MOCK_PROJECTS = \[\s*\{\s*id: 'p1'[\s\S]*?\s*\};/;
const NEW_MOCK_PROJECTS = `const MOCK_PROJECTS = [
  { 
  id: 'p1', 
  name: '蕉下 - 夏日防晒种草季', 
  status: '任务进行中',
  progress: 65,
  targetCount: 100,
  recoveredMaterial: 55,
  generatedNotes: 45,
  publishedNotes: 12,
  targetGroup: 'internal'
  },
  { 
  id: 'p2', 
  name: '发小发 - 素人测评寄样派发', 
  status: '筹备中',
  progress: 10,
  targetCount: 50,
  recoveredMaterial: 5,
  generatedNotes: 50,
  publishedNotes: 0,
  targetGroup: 'external'
  }
  ];`;
code = code.replace(MOCK_PROJECTS_REGEX, NEW_MOCK_PROJECTS);

// 2. Add specific targetGroup options to Create Project
const CREATE_PROJECT_REGEX = /<h3 className="text-\[14px\] font-semibold text-neutral-900 uppercase tracking-widest flex items-center gap-2">\s*<Target size=\{18\} className="text-neutral-400"\s*\/> 1. 运营项目立项\s*<\/h3>\s*<div className="grid grid-cols-1 gap-5">/;

const CREATE_PROJECT_WITH_TYPE = `<h3 className="text-[14px] font-semibold text-neutral-900 uppercase tracking-widest flex items-center gap-2">
 <Target size={18} className="text-neutral-400" /> 1. 运营项目立项
 </h3>
 <div className="grid grid-cols-1 gap-5">
 <div className="space-y-2">
 <label className="text-[11px] text-neutral-400 uppercase">发布矩阵类型</label>
 <div className="grid grid-cols-2 gap-3">
   <div className="border-2 border-primary-500 bg-primary-50 rounded-xl p-3 flex items-start gap-3 cursor-pointer">
     <div className="w-5 h-5 rounded-full border-4 border-primary-500 bg-white shrink-0 mt-0.5"></div>
     <div>
       <div className="text-[13px] font-semibold text-neutral-900">内部团队执行项目</div>
       <div className="text-[11px] text-neutral-500 mt-1">自动合并相同拍照需求，通过企微分配给组织内员工</div>
     </div>
   </div>
   <div className="border border-neutral-200 bg-white hover:border-primary-200 rounded-xl p-3 flex items-start gap-3 cursor-pointer">
     <div className="w-5 h-5 rounded-full border border-neutral-300 bg-white shrink-0 mt-0.5 relative"><div className="absolute inset-1 rounded-full bg-transparent hover:bg-neutral-100"></div></div>
     <div>
       <div className="text-[13px] font-semibold text-neutral-900">外部素人KOC分发</div>
       <div className="text-[11px] text-neutral-500 mt-1">按单篇笔记拆解需求，扫码领取，素材自动进入审核发布流</div>
     </div>
   </div>
 </div>
 </div>`;

code = code.replace(CREATE_PROJECT_REGEX, CREATE_PROJECT_WITH_TYPE);
fs.writeFileSync('src/pages/MerchantMatrix.tsx', code);

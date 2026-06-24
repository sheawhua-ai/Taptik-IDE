import fs from 'fs';

let content = fs.readFileSync('src/pages/MerchantMatrix.tsx', 'utf8');

const regex = /<RefreshCw size=\{14\}\/> 推送至任务大厅/;

content = content.replace(regex, `<RefreshCw size={14}/> 推送至任务大厅
                  <div className="absolute top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-900 text-white text-[11px] px-3 py-2 rounded-lg pointer-events-none w-max z-50 whitespace-pre-line shadow-xl">
                    用来做什么用？\n此操作将笔记的【拍摄图文要求】和【配文脚本】推送给外部接单平台上大量KOC（素人）浏览。\n素人抢单后，按照要求拍图、上传、审核并在自己的账号发布。
                  </div>`);

if(!content.includes('用来做什么用？')) {
  // It might need "group" on the button
  content = content.replace(/className="w-full py-2.5 border border-primary-200/, 'className="relative group w-full py-2.5 border border-primary-200');
  content = content.replace(regex, `<RefreshCw size={14}/> 推送至任务大厅
                  <div className="absolute top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-900 text-white text-[11px] px-4 py-2 rounded-lg pointer-events-none w-[200px] text-left z-[100] whitespace-pre-line shadow-xl">
                    推送至任务大厅，用来做什么用？\n此功能将这篇笔记的拍摄要求推送至接单库。待素人认领执行后发到各自的账号上。
                  </div>`);
}

fs.writeFileSync('src/pages/MerchantMatrix.tsx', content);

console.log("Patched Hint tooltip");

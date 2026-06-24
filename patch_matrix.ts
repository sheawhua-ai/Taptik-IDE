import fs from 'fs';

let content = fs.readFileSync('src/pages/MerchantMatrix.tsx', 'utf8');

content = content.replace(
  /<div className="w-full h-full overflow-y-auto bg-white custom-scrollbar pb-24">/,
  `<div className="w-full h-full flex flex-col overflow-hidden">
        <div className="h-20 border-b border-neutral-100 flex items-center justify-between px-8 bg-white shrink-0 z-10 w-full mb-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-neutral-900 text-white rounded-2xl flex items-center justify-center shadow-lg">
              <LayoutGrid size={24} />
            </div>
            <div>
              <h2 className="text-[17px] font-semibold text-neutral-900 tracking-tight">项目与内容</h2>
              <p className="text-[11px] text-neutral-400 mt-0.5">管理拉新内容的生成、素材采集任务与审批流水线</p>
            </div>
          </div>
          <button 
           onClick={() => setIsCreatingProject(true)}
           className="px-5 py-2.5 bg-neutral-900 text-white rounded-[14px] text-[13px] font-medium flex items-center gap-2 shadow-lg hover:bg-neutral-800 active:scale-95 transition-all tooltip" title="创建拉新内容项目与通告计划"
          >
           <Plus size={16} /> 创建新项目
          </button>
        </div>
        <div className="flex-1 w-full overflow-y-auto bg-neutral-50/50 custom-scrollbar pb-24">`
);

content = content.replace(
  /<div className="space-y-1">\s*<h2 className="text-2xl font-semibold text-neutral-900 tracking-tight">项目与内容<\/h2>\s*<p className="text-\[13px\] text-neutral-400 ">跟踪小红书运营项目的全链路进展、日历排期，并在项目中指派任务进行内容的批量成稿<\/p>\s*<\/div>/,
  ''
);

// close div
content = content.replace(
  `          ))}
        </div>
      </div>
    </div>
  );
}`,
  `          ))}
        </div>
      </div>
      </div>
    </div>
  );
}`
);

fs.writeFileSync('src/pages/MerchantMatrix.tsx', content);


#!/bin/bash
# Remove 观察窗口 and 结果指标 section, rephrase 核心假设
sed -i 's/<div className="text-\[12px\] text-neutral-500 mb-2 font-bold">核心假设<\/div>/<div className="text-[12px] text-neutral-500 mb-2 font-bold">预期执行效果<\/div>/g' src/components/merchant/CreateProjectWorkstation.tsx

# Delete the results metric section (lines 253 to 283)
sed -i '253,283d' src/components/merchant/CreateProjectWorkstation.tsx

# Change col-span-2 to col-span-5 for the textareas section
sed -i 's/<div className="col-span-2 bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">/<div className="col-span-5 bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm grid grid-cols-2 gap-6">/g' src/components/merchant/CreateProjectWorkstation.tsx

# Make textareas side-by-side
sed -i 's/<div className="h-px bg-neutral-100 my-4" \/>/<\/div>\n              <div>/g' src/components/merchant/CreateProjectWorkstation.tsx
sed -i 's/<div className="text-\[12px\] text-neutral-500 mb-2 font-bold">当前问题/<div className="text-[12px] text-neutral-500 mb-2 font-bold">当前面临的问题/g' src/components/merchant/CreateProjectWorkstation.tsx
sed -i 's/本轮要验证什么/本次项目目标/g' src/components/merchant/CreateProjectWorkstation.tsx


#!/bin/bash
# Remove 计划发布窗口 and change 招募窗口 to 执行时间
sed -i 's/<span className="text-\[13px\] text-neutral-500">招募窗口<\/span>/<span className="text-[13px] text-neutral-500">执行时间<\/span>/g' src/components/merchant/CreateProjectWorkstation.tsx
sed -i 's/<input type="text" value={draft.koc.recruitDates}/<input type="date" value={draft.koc.recruitDates}/g' src/components/merchant/CreateProjectWorkstation.tsx

# Delete 计划发布窗口
sed -i '/<span className="text-\[13px\] text-neutral-500">计划发布窗口<\/span>/,+3d' src/components/merchant/CreateProjectWorkstation.tsx


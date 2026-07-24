#!/bin/bash
# Remove 发布方式 from KOS table
sed -i 's/<th className="font-medium pb-2 pr-4">发布方式<\/th>//g' src/components/merchant/CreateProjectWorkstation.tsx
sed -i '/<select value={k.publishType}/,+3d' src/components/merchant/CreateProjectWorkstation.tsx
sed -i '/<td className="py-3 pr-4">/!b;n;/<select value={k.direction}/!b;i \                         <td className="py-3 pr-4">' src/components/merchant/CreateProjectWorkstation.tsx
# Wait, this might be tricky, it's safer to use a more targeted replacement.

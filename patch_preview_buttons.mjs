import fs from 'fs';

let content = fs.readFileSync('src/components/rings/ExecutionPreview.tsx', 'utf-8');

// Replace static buttons with dynamic selected state classes
content = content.replace(
  /<button className="px-3 py-1.5 bg-neutral-900 text-white text-\[12px\] font-medium rounded-lg">保持<\/button>\n\s*<button className="px-3 py-1.5 bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50 text-\[12px\] font-medium rounded-lg">换一个方向<\/button>/g,
  `{[
                  { label: "保持", val: "幼犬换粮避坑" },
                  { label: "换一个方向", val: "other" }
                ].map(opt => (
                  <button 
                    key={opt.label}
                    onClick={() => setConfirmDirection(opt.val)}
                    className={\`px-3 py-1.5 text-[12px] font-medium rounded-lg transition-colors \${confirmDirection === opt.val ? 'bg-neutral-900 text-white shadow-sm' : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'}\`}
                  >
                    {opt.label}
                  </button>
                ))}`
);

content = content.replace(
  /<button className="px-3 py-1.5 bg-neutral-900 text-white text-\[12px\] font-medium rounded-lg">保持<\/button>\n\s*<button className="px-3 py-1.5 bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50 text-\[12px\] font-medium rounded-lg">调整<\/button>/g,
  `{[
                  { label: "保持", val: "素人 8 / 专业 4" },
                  { label: "调整", val: "adjust" }
                ].map(opt => (
                  <button 
                    key={opt.label}
                    onClick={() => setConfirmGroup(opt.val)}
                    className={\`px-3 py-1.5 text-[12px] font-medium rounded-lg transition-colors \${confirmGroup === opt.val ? 'bg-neutral-900 text-white shadow-sm' : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'}\`}
                  >
                    {opt.label}
                  </button>
                ))}`
);

content = content.replace(
  /<button className="px-3 py-1.5 bg-neutral-900 text-white text-\[12px\] font-medium rounded-lg">保持<\/button>\n\s*<button className="px-3 py-1.5 bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50 text-\[12px\] font-medium rounded-lg">仅用自有号<\/button>\n\s*<button className="px-3 py-1.5 bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50 text-\[12px\] font-medium rounded-lg">不启用外部池<\/button>/g,
  `{[
                  { label: "保持", val: "自有号定向承接 + 外部随机领取池" },
                  { label: "仅用自有号", val: "only-own" },
                  { label: "不启用外部池", val: "no-external" }
                ].map(opt => (
                  <button 
                    key={opt.label}
                    onClick={() => setConfirmDist(opt.val)}
                    className={\`px-3 py-1.5 text-[12px] font-medium rounded-lg transition-colors \${confirmDist === opt.val ? 'bg-neutral-900 text-white shadow-sm' : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'}\`}
                  >
                    {opt.label}
                  </button>
                ))}`
);

content = content.replace(
  /<button className="px-3 py-1.5 bg-neutral-900 text-white text-\[12px\] font-medium rounded-lg">保持<\/button>\n\s*<button className="px-3 py-1.5 bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50 text-\[12px\] font-medium rounded-lg">不同步飞书<\/button>\n\s*<button className="px-3 py-1.5 bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50 text-\[12px\] font-medium rounded-lg">只生成不入队<\/button>/g,
  `{[
                  { label: "保持", val: "进入待审核队列，并同步飞书项目群" },
                  { label: "不同步飞书", val: "no-feishu" },
                  { label: "只生成不入队", val: "only-gen" }
                ].map(opt => (
                  <button 
                    key={opt.label}
                    onClick={() => setConfirmSync(opt.val)}
                    className={\`px-3 py-1.5 text-[12px] font-medium rounded-lg transition-colors \${confirmSync === opt.val ? 'bg-neutral-900 text-white shadow-sm' : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'}\`}
                  >
                    {opt.label}
                  </button>
                ))}`
);

fs.writeFileSync('src/components/rings/ExecutionPreview.tsx', content);

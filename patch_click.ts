import fs from 'fs';
let content = fs.readFileSync('src/pages/MerchantMatrix.tsx', 'utf8');

const regex = /<div \s*key=\{draft\.id\} \s*onClick=\{\(\) => setReviewingDraft\(draft\)\}\s*className="bg-white rounded-\[16px\] border-2 transition-all cursor-pointer relative flex flex-col h-\[320px\] border-neutral-200 hover:border-primary-500\/50 hover:shadow-lg overflow-hidden group"\s*>/;

const newText = `<div 
 key={draft.id} 
 onClick={() => draft.status !== 'published' && setReviewingDraft(draft)}
 className={\`bg-white rounded-[16px] border-2 transition-all relative flex flex-col h-[320px] overflow-hidden group \${draft.status === 'published' ? 'border-neutral-200 cursor-default opacity-90' : 'cursor-pointer border-neutral-200 hover:border-primary-500/50 hover:shadow-lg'}\`}
 >`;

content = content.replace(regex, newText);

fs.writeFileSync('src/pages/MerchantMatrix.tsx', content);

import fs from 'fs';

let content = fs.readFileSync('src/components/merchant/MerchantProfileDrawer.tsx', 'utf-8');

// 1. Remove custom SVGs
content = content.replace(/\/\/ Minimalist Custom SVGs[\s\S]*?interface MerchantProfileDrawerProps/, `import { X, Store, Target, CheckCircle2, Bell, Plus, BookOpen, UserPlus, Send, Users, FileText, Lightbulb } from 'lucide-react';\n\ninterface MerchantProfileDrawerProps`);

// 2. Replace SVG tags
content = content.replace(/<IconClose \/>/g, '<X size={20} />');
content = content.replace(/<IconStore \/>/g, '<Store size={24} />');
content = content.replace(/<IconGoal \/>/g, '<Target size={14} />');
content = content.replace(/<IconCheck \/>/g, '<CheckCircle2 size={14} />');
content = content.replace(/<IconBell \/>/g, '<Bell size={14} />');
content = content.replace(/<IconPlus \/>/g, '<Plus size={14} />');
content = content.replace(/<IconBook \/>/g, '<BookOpen size={14} />');
content = content.replace(/<IconUserPlus \/>/g, '<UserPlus size={14} />');
content = content.replace(/<IconSend \/>/g, '<Send size={14} />');
content = content.replace(/<IconUsers \/>/g, '<Users size={16} />');
content = content.replace(/<IconDocument \/>/g, '<FileText size={16} />');
content = content.replace(/<IconIdea \/>/g, '<Lightbulb size={14} />');

// 3. Add border-radius to containers
content = content.replace(/className="bg-neutral-50 p-4 border border-neutral-200"/g, 'className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200"');
content = content.replace(/className="flex items-center gap-1.5 text-neutral-900 font-medium border border-neutral-200 px-2 py-1 bg-neutral-50"/g, 'className="flex items-center gap-1.5 text-neutral-900 font-medium border border-neutral-200 rounded-lg px-2.5 py-1.5 bg-neutral-50"');

content = content.replace(/className="bg-white border border-neutral-200 p-5 group"/g, 'className="bg-white rounded-2xl border border-neutral-200 p-5 group"');
content = content.replace(/className="bg-white p-6 border border-neutral-200"/g, 'className="bg-white rounded-2xl p-6 border border-neutral-200"');
content = content.replace(/className="bg-neutral-50 p-6 border border-neutral-200 opacity-80 hover:opacity-100 transition-opacity"/g, 'className="bg-neutral-50 rounded-2xl p-6 border border-neutral-200 opacity-80 hover:opacity-100 transition-opacity"');

// 4. Buttons rounded
content = content.replace(/rounded-md/g, 'rounded-xl');
content = content.replace(/className="w-12 h-12 bg-neutral-900 text-white flex items-center justify-center"/g, 'className="w-12 h-12 bg-neutral-900 rounded-2xl shadow-sm text-white flex items-center justify-center"');
content = content.replace(/border-neutral-200 text-neutral-600 text-\[11px\]/g, 'border-neutral-200 rounded-lg text-neutral-600 text-[11px]');
content = content.replace(/className="bg-neutral-50 p-3 mb-4 text-\[13px\] text-neutral-700 border border-neutral-200"/g, 'className="bg-neutral-50 rounded-xl p-3 mb-4 text-[13px] text-neutral-700 border border-neutral-200"');

content = content.replace(/className="flex-1 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-\[13px\]/g, 'className="flex-1 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-[13px]');
content = content.replace(/className="flex-1 py-2 bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-900 text-\[13px\]/g, 'className="flex-1 py-2 rounded-xl bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-900 text-[13px]');
content = content.replace(/className="flex-1 py-2 bg-white border border-neutral-900 text-neutral-900 hover:bg-neutral-50 text-\[13px\]/g, 'className="flex-1 py-2 rounded-xl bg-white border border-neutral-900 text-neutral-900 hover:bg-neutral-50 text-[13px]');

fs.writeFileSync('src/components/merchant/MerchantProfileDrawer.tsx', content);

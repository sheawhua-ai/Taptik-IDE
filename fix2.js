const fs = require('fs');
const file = 'src/components/rings/Strategy.tsx';
let content = fs.readFileSync(file, 'utf8');

// replace indigo with rose everywhere (if any left) or ensure we replace the colors requested.
// The prompt says "玫红色作为主色，替换掉本页面中的蓝色". "玫红色" is rose. 
content = content.replace(/indigo/g, 'rose');

// State additions:
const stateInjection = `const [selectedSkill, setSelectedSkill] = useState('美妆搜索种草打法');
  const [showSkillOverviewDrawer, setShowSkillOverviewDrawer] = useState(false);
  const [previewSkill, setPreviewSkill] = useState<{name: string, tag: string, desc: string} | null>(null);
  
  const [selectedTarget, setSelectedTarget] = useState('搜索卡位');
  const [selectedAction, setSelectedAction] = useState('领取换粮表');
  
  const [formValues, setFormValues] = useState({
    percent1: 70, percent2: 30, amount: 12, days: 7, a01: 3, a02: 3, a05: 2, koc: 4
  });
  
  const handleTargetChange = (t: string) => {
    setSelectedTarget(t);
    if (t === '搜索卡位') setFormValues({percent1: 70, percent2: 30, amount: 12, days: 7, a01: 3, a02: 3, a05: 2, koc: 4});
    else if (t === '爆文起量') setFormValues({percent1: 40, percent2: 60, amount: 20, days: 14, a01: 5, a02: 5, a05: 5, koc: 5});
    else if (t === '线索转化') setFormValues({percent1: 20, percent2: 80, amount: 10, days: 7, a01: 2, a02: 2, a05: 4, koc: 2});
    else if (t === '账号养成') setFormValues({percent1: 50, percent2: 50, amount: 15, days: 30, a01: 5, a02: 5, a05: 5, koc: 0});
  };
`;

content = content.replace(/const \[selectedSkill.*?\] = useState.*?;/, '');
content = content.replace(/const \[showSkillOverviewDrawer.*?\] = useState.*?;/, '');
content = content.replace(/const \[previewSkill.*?\] = useState.*?;/, '');

content = content.replace(/const \[showSkillPanel, setShowSkillPanel\] = useState\(false\);/, `const [showSkillPanel, setShowSkillPanel] = useState(false);\n  ${stateInjection}`);

// target template binding
content = content.replace(
  /\{?\['搜索卡位', '爆文起量', '线索转化', '账号养成'\]\.map\(t => \([\s\S]*?\)\)}?/g,
  `{['搜索卡位', '爆文起量', '线索转化', '账号养成'].map(t => (
                        <button key={t} onClick={() => handleTargetChange(t)} className={\`py-2 px-3 text-[13px] font-medium rounded-lg border text-center transition-colors \${t === selectedTarget ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'}\`}>
                          {t}
                        </button>
                      ))}`
);

// inputs binding
content = content.replace(
  /defaultValue=\{70\}/g,
  `value={formValues.percent1} onChange={e => setFormValues({...formValues, percent1: parseInt(e.target.value)||0})}`
);
content = content.replace(
  /defaultValue=\{30\}/g,
  `value={formValues.percent2} onChange={e => setFormValues({...formValues, percent2: parseInt(e.target.value)||0})}`
);
content = content.replace(
  /defaultValue=\{12\}/g,
  `value={formValues.amount} onChange={e => setFormValues({...formValues, amount: parseInt(e.target.value)||0})}`
);
content = content.replace(
  /defaultValue=\{7\}/g,
  `value={formValues.days} onChange={e => setFormValues({...formValues, days: parseInt(e.target.value)||0})}`
);
content = content.replace(
  /defaultValue=\{3\}/,
  `value={formValues.a01} onChange={e => setFormValues({...formValues, a01: parseInt(e.target.value)||0})}`
);
content = content.replace(
  /defaultValue=\{3\}/,
  `value={formValues.a02} onChange={e => setFormValues({...formValues, a02: parseInt(e.target.value)||0})}`
);
content = content.replace(
  /defaultValue=\{2\}/g,
  `value={formValues.a05} onChange={e => setFormValues({...formValues, a05: parseInt(e.target.value)||0})}`
);
content = content.replace(
  /defaultValue=\{4\}/g,
  `value={formValues.koc} onChange={e => setFormValues({...formValues, koc: parseInt(e.target.value)||0})}`
);

// remove inner spin button class
content = content.replace(/type="number"/g, 'type="number" className="[&::-webkit-inner-spin-button]:appearance-none "');


// actions binding
content = content.replace(
  /\{?\['领取换粮表', '进群交流', '加企微顾问', '预约咨询'\]\.map\(t => \([\s\S]*?\)\)}?/g,
  `{['领取换粮表', '进群交流', '加企微顾问', '预约咨询'].map(t => (
                        <button key={t} onClick={() => setSelectedAction(t)} className={\`py-2 px-3 text-[13px] font-medium rounded-lg border text-center transition-colors \${t === selectedAction ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'}\`}>
                          {t}
                        </button>
                      ))}`
);

// handle the navigation buttons in result
content = content.replace(
  /<button className="px-6 py-3\.5 bg-neutral-900 text-white rounded-xl text-\[14px\] font-bold hover:bg-neutral-800 transition-colors shadow-lg active:scale-95 flex items-center gap-2">[\s\S]*?<\/button>/,
  `<button onClick={() => window.dispatchEvent(new CustomEvent('nav-to-tab', { detail: { tab: 'matrix' } }))} className="px-6 py-3.5 bg-neutral-900 text-white rounded-xl text-[14px] font-bold hover:bg-neutral-800 transition-colors shadow-lg active:scale-95 flex items-center gap-2">进入商家运营流 <ArrowRight size={16} /></button>`
);

content = content.replace(
  /<button className="px-5 py-3\.5 bg-white border border-neutral-200 text-neutral-700 rounded-xl text-\[14px\] font-bold hover:bg-neutral-50 transition-colors">\s*先处理内容确认\s*<\/button>/,
  `<button onClick={() => window.dispatchEvent(new CustomEvent('nav-to-tab', { detail: { tab: 'interaction' } }))} className="px-5 py-3.5 bg-white border border-neutral-200 text-neutral-700 rounded-xl text-[14px] font-bold hover:bg-neutral-50 transition-colors">先处理内容确认</button>`
);

content = content.replace(
  /<button className="px-5 py-3\.5 bg-white border border-neutral-200 text-neutral-700 rounded-xl text-\[14px\] font-bold hover:bg-neutral-50 transition-colors">\s*先补齐素材\s*<\/button>/,
  `<button onClick={() => window.dispatchEvent(new CustomEvent('nav-to-tab', { detail: { tab: 'interaction' } }))} className="px-5 py-3.5 bg-white border border-neutral-200 text-neutral-700 rounded-xl text-[14px] font-bold hover:bg-neutral-50 transition-colors">先补齐素材</button>`
);

fs.writeFileSync(file, content);
console.log('done');

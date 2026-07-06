const fs = require('fs');
const file = 'src/components/rings/Strategy.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/indigo/g, 'rose');

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

content = content.replace(/const \[selectedSkill.*?\] = useState.*?;/s, '');
content = content.replace(/const \[showSkillOverviewDrawer.*?\] = useState.*?;/s, '');
content = content.replace(/const \[previewSkill.*?\] = useState.*?;/s, '');

content = content.replace(/const \[showSkillPanel, setShowSkillPanel\] = useState\(false\);/, `const [showSkillPanel, setShowSkillPanel] = useState(false);\n  ${stateInjection}`);

content = content.replace(
  /\{\['搜索卡位', '爆文起量', '线索转化', '账号养成'\]\.map\(t => \([\s\S]*?\)\)\}/g,
  `{['搜索卡位', '爆文起量', '线索转化', '账号养成'].map(t => (
                        <button key={t} onClick={() => handleTargetChange(t)} className={\`py-2 px-3 text-[13px] font-medium rounded-lg border text-center transition-colors \${t === selectedTarget ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'}\`}>
                          {t}
                        </button>
                      ))}`
);

content = content.replace(
  /<input type="number" defaultValue=\{70\}/g,
  `<input type="number" value={formValues.percent1} onChange={e => setFormValues({...formValues, percent1: parseInt(e.target.value)||0})}`
);
content = content.replace(
  /<input type="number" defaultValue=\{30\}/g,
  `<input type="number" value={formValues.percent2} onChange={e => setFormValues({...formValues, percent2: parseInt(e.target.value)||0})}`
);
content = content.replace(
  /<input type="number" defaultValue=\{12\}/g,
  `<input type="number" value={formValues.amount} onChange={e => setFormValues({...formValues, amount: parseInt(e.target.value)||0})}`
);
content = content.replace(
  /<input type="number" defaultValue=\{7\}/g,
  `<input type="number" value={formValues.days} onChange={e => setFormValues({...formValues, days: parseInt(e.target.value)||0})}`
);
content = content.replace(
  /<input type="number" defaultValue=\{3\}/,
  `<input type="number" value={formValues.a01} onChange={e => setFormValues({...formValues, a01: parseInt(e.target.value)||0})}`
);
content = content.replace(
  /<input type="number" defaultValue=\{3\}/,
  `<input type="number" value={formValues.a02} onChange={e => setFormValues({...formValues, a02: parseInt(e.target.value)||0})}`
);
content = content.replace(
  /<input type="number" defaultValue=\{2\}/g,
  `<input type="number" value={formValues.a05} onChange={e => setFormValues({...formValues, a05: parseInt(e.target.value)||0})}`
);
content = content.replace(
  /<input type="number" defaultValue=\{4\}/g,
  `<input type="number" value={formValues.koc} onChange={e => setFormValues({...formValues, koc: parseInt(e.target.value)||0})}`
);

content = content.replace(/ className="w-full bg-neutral-50 /g, ' className="[&::-webkit-inner-spin-button]:appearance-none w-full bg-neutral-50 ');
content = content.replace(/ className="w-full bg-white /g, ' className="[&::-webkit-inner-spin-button]:appearance-none w-full bg-white ');

content = content.replace(
  /\{\['领取换粮表', '进群交流', '加企微顾问', '预约咨询'\]\.map\(t => \([\s\S]*?\)\)\}/g,
  `{['领取换粮表', '进群交流', '加企微顾问', '预约咨询'].map(t => (
                        <button key={t} onClick={() => setSelectedAction(t)} className={\`py-2 px-3 text-[13px] font-medium rounded-lg border text-center transition-colors \${t === selectedAction ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'}\`}>
                          {t}
                        </button>
                      ))}`
);

// Navigation buttons from ExecutionResult (which is likely where these buttons are, or in Strategy itself?)
// Wait, the result is in ExecutionResult.tsx! Let's check!
fs.writeFileSync(file, content);
console.log('Strategy done');

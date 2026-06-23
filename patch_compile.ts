import fs from 'fs';

let code = fs.readFileSync('src/pages/MerchantMatrix.tsx', 'utf8');

const missingGenerateMocks = `
  const generateMocks = () => {
    setTimeout(() => {
      setDrafts([
        { id: '1', title: '防晒测评第1篇：户外暴晒', content: '作为一个每天通勤的打工人...', score: 92, imageType: 'pending', targetViews: 5000, targetInteractions: 120, status: 'scheduled' },
        { id: '2', title: '防晒单品：带妆不补涂', content: '妆后补防晒真的是个技术活...', score: 85, imageType: 'pending', targetViews: 3000, targetInteractions: 80, status: 'scheduled' }
      ]);
    }, 600);
  };
`;

code = code.replace(/const handleAutoGroupDispatch = \(\) => {/, missingGenerateMocks + '\n  const handleAutoGroupDispatch = () => {');

// Fix setTasks
code = code.replace(/setTasks\(\[\.\.\.tasks,/g, '// setTasks([...tasks,');

fs.writeFileSync('src/pages/MerchantMatrix.tsx', code);

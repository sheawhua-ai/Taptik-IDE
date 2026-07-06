const fs = require('fs');
const file = 'src/pages/MerchantMatrix.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetStr = `  const handleNodeClick = (node: any) => {
    if (node.type === 'warning') {
      setActiveDrawer(node.id === 'interaction' ? 'interaction' : 'materials');
    } else if (node.type === 'success') {
      if (node.id === 'content') {
        setActiveDrawer('content_detail');
        return;
      } else if (node.id === 'publish') {
        setActiveDrawer('publish');
        return;
      }
      window.dispatchEvent(new CustomEvent('nav-to-tab', { detail: { tab: node.tab } }));
    }
  };`;

const newStr = `  const handleNodeClick = (node: any) => {
    if (node.id === 'content') {
      setActiveDrawer('content_detail');
      return;
    }
    if (node.id === 'publish') {
      setActiveDrawer('publish');
      return;
    }
    if (node.type === 'warning') {
      setActiveDrawer(node.id === 'interaction' ? 'interaction' : 'materials');
    } else if (node.type === 'success') {
      window.dispatchEvent(new CustomEvent('nav-to-tab', { detail: { tab: node.tab } }));
    }
  };`;

content = content.replace(targetStr, newStr);

// Also remove cursor-not-allowed
content = content.replace(
  "node.type === 'warning' ? 'border-amber-500 text-amber-600 ring-4 ring-amber-500/10 cursor-pointer' : \n                            'border-neutral-200 text-neutral-300 cursor-not-allowed'",
  "node.type === 'warning' ? 'border-amber-500 text-amber-600 ring-4 ring-amber-500/10 cursor-pointer' : \n                            'border-neutral-200 text-neutral-300 cursor-pointer hover:border-neutral-300 hover:text-neutral-500'"
);

fs.writeFileSync(file, content);
console.log("Success clickable");

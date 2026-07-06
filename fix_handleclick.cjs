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
      }
      window.dispatchEvent(new CustomEvent('nav-to-tab', { detail: { tab: node.tab } }));
    }
  };`;

const newStr = `  const handleNodeClick = (node: any) => {
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

if (content.includes(targetStr)) {
  content = content.replace(targetStr, newStr);
  fs.writeFileSync(file, content);
  console.log("Success fixed handleclick");
} else {
  console.log("Not found target");
}

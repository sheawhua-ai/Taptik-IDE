const fs = require('fs');
const file = 'src/pages/MerchantMatrix.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldHandler = `  const handleNodeClick = (node: any) => {
    if (node.id === 'channels') {
      setActiveDrawer('channels_detail');
      return;
    }
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

const newHandler = `  const handleNodeClick = (node: any) => {
    if (node.id === 'channels') {
      setActiveDrawer('channels_detail');
      return;
    }
    if (node.id === 'content') {
      setActiveDrawer('content_detail');
      return;
    }
    if (node.id === 'publish') {
      setActiveDrawer('publish');
      return;
    }
    if (node.id === 'interaction' && node.type === 'warning') {
      setActiveDrawer('interaction');
      return;
    }
    if (node.type === 'warning' || node.type === 'success') {
      window.dispatchEvent(new CustomEvent('nav-to-tab', { detail: { tab: node.tab } }));
    }
  };`;

if(content.includes(oldHandler)){
  content = content.replace(oldHandler, newHandler);
  fs.writeFileSync(file, content);
  console.log("Success fix click handler");
} else {
  console.log("Could not find handler");
}


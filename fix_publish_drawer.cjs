const fs = require('fs');
const file = 'src/pages/MerchantMatrix.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "{ id: 'publish', name: '发布执行', status: '待排期', type: 'pending', tab: 'content', actionDesc: '发布包详情与分发' }",
  "{ id: 'publish', name: '发布执行', status: '待排期', type: 'pending', tab: 'publish', actionDesc: '发布包详情与分发' }"
);
content = content.replace(
  "{ id: 'publish', name: '发布执行', status: '已发42', type: 'success', tab: 'content', actionDesc: '发布包详情与分发' }",
  "{ id: 'publish', name: '发布执行', status: '已发42', type: 'success', tab: 'publish', actionDesc: '发布包详情与分发' }"
);

// add 'publish' to activeDrawer type
content = content.replace(
  "const [activeDrawer, setActiveDrawer] = useState<'add_batch' | 'materials' | 'interaction' | 'content_detail' | null>(null);",
  "const [activeDrawer, setActiveDrawer] = useState<'add_batch' | 'materials' | 'interaction' | 'content_detail' | 'publish' | null>(null);"
);

// We also need to map the handleNodeClick behavior
const oldHandleClick = `  const handleNodeClick = (tab: string) => {
    if (tab === 'strategy') {
      onProjectSelect(selectedProject);
    } else if (tab === 'matrix') {
      setActiveDrawer('materials');
    } else if (tab === 'content') {
      setActiveDrawer('content_detail');
    } else if (tab === 'interaction') {
      setActiveDrawer('interaction');
    }
  };`;

const newHandleClick = `  const handleNodeClick = (tab: string) => {
    if (tab === 'strategy') {
      onProjectSelect(selectedProject);
    } else if (tab === 'matrix') {
      setActiveDrawer('materials');
    } else if (tab === 'content') {
      setActiveDrawer('content_detail');
    } else if (tab === 'interaction') {
      setActiveDrawer('interaction');
    } else if (tab === 'publish') {
      setActiveDrawer('publish');
    }
  };`;

if (content.includes(oldHandleClick)) {
    content = content.replace(oldHandleClick, newHandleClick);
}

fs.writeFileSync(file, content);
console.log("Replaced handle click");

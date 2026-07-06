const fs = require('fs');
const file = 'src/pages/MerchantMatrix.tsx';
let content = fs.readFileSync(file, 'utf8');

// Import
content = content.replace(
  /import \{ PublishDrawer \} from '\.\.\/components\/rings\/PublishDrawer';/,
  "import { PublishDrawer } from '../components/rings/PublishDrawer';\nimport { ChannelsDrawer } from '../components/rings/ChannelsDrawer';"
);

// State
content = content.replace(
  /const \[activeDrawer, setActiveDrawer\] = useState\<'add_batch' \| 'materials' \| 'interaction' \| 'content_detail' \| 'publish' \| null\>\(null\);/,
  "const [activeDrawer, setActiveDrawer] = useState<'add_batch' | 'materials' | 'interaction' | 'content_detail' | 'publish' | 'channels_detail' | null>(null);"
);

// Click handler
const oldHandler = `  const handleNodeClick = (node: any) => {
    if (node.id === 'content') {
      setActiveDrawer('content_detail');
      return;
    }
    if (node.id === 'publish') {
      setActiveDrawer('publish');
      return;
    }`;
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
    }`;
content = content.replace(oldHandler, newHandler);

// Swap content and material nodes
content = content.replace(
  /\{ id: 'material', name: '素材\/体验', status: '缺8', type: 'warning', tab: 'matrix', actionDesc: '素材与体验进度' \}, \n\s*\{ id: 'content', name: '内容确认', status: '待确认', type: 'pending', tab: 'content', actionDesc: '按通道查看与确认' \},/,
  `{ id: 'content', name: '内容确认', status: '待确认', type: 'pending', tab: 'content', actionDesc: '按通道查看与确认' },
      { id: 'material', name: '素材/体验', status: '缺8', type: 'warning', tab: 'interaction', actionDesc: '素材与体验进度' },`
);

content = content.replace(
  /\{ id: 'material', name: '素材\/体验', status: '全齐', type: 'success', tab: 'matrix', actionDesc: '素材齐备' \}, \n\s*\{ id: 'content', name: '内容确认', status: '已确认', type: 'success', tab: 'content', actionDesc: '按通道查看与确认' \},/,
  `{ id: 'content', name: '内容确认', status: '已确认', type: 'success', tab: 'content', actionDesc: '按通道查看与确认' },
      { id: 'material', name: '素材/体验', status: '全齐', type: 'success', tab: 'interaction', actionDesc: '素材齐备' },`
);

// Add to Drawers
content = content.replace(
  /\{activeDrawer === 'content_detail' && <ContentDetailDrawer onClose=\{\(\) => setActiveDrawer\(null\)\} \/>\}/,
  "{activeDrawer === 'channels_detail' && <ChannelsDrawer onClose={() => setActiveDrawer(null)} />}\n        {activeDrawer === 'content_detail' && <ContentDetailDrawer onClose={() => setActiveDrawer(null)} />}"
);

fs.writeFileSync(file, content);
console.log("Success fix matrix nodes");

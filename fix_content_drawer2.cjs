const fs = require('fs');
const file = 'src/components/rings/ContentDetailDrawer.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /const \[selectedContent, setSelectedContent\] = useState<typeof MOCK_CONTENT\[0\] \| null>\(null\);/,
  "const [selectedContent, setSelectedContent] = useState<typeof MOCK_CONTENT[0] | null>(null);\n  const [isEditing, setIsEditing] = useState(false);\n  const [editContent, setEditContent] = useState('');\n  const [aiPrompt, setAiPrompt] = useState('');\n  const [isAiRewriting, setIsAiRewriting] = useState(false);\n"
);

fs.writeFileSync(file, content);
console.log("Success fix content drawer 2");

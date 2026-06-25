import fs from 'fs';

let content = fs.readFileSync('src/components/Workbench.tsx', 'utf-8');

content = content.replace(
  "import React, { useState, useEffect } from 'react';",
  "import React, { useState, useEffect, useRef } from 'react';"
);

content = content.replace(
  "const [query, setQuery] = useState('');",
  `const [query, setQuery] = useState('');
  const [selectedShortcut, setSelectedShortcut] = useState<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      // Max height approx half page (e.g. 300px)
      textareaRef.current.style.height = Math.min(scrollHeight, 300) + 'px';
    }
  }, [query, selectedShortcut]);
`
);

const SHORTCUTS = `
const QUICK_SHORTCUTS = [
  { id: '1', name: '文档处理', action: '帮我总结和处理这份文档。' },
  { id: '2', name: '金融服务', action: '提供金融分析和建议。' },
  { id: '3', name: '高考我帮你', action: '解答高考相关问题并提供志愿建议。' },
  { id: '4', name: '数据分析及可视化', action: '帮我分析这些数据并生成可视化图表。' },
  { id: '5', name: '深度研究', action: '对这个主题进行深入的学术和市场研究。' }
];
`;

content = content.replace(
  "export const Workbench: React.FC<WorkbenchProps> = ({",
  SHORTCUTS + "\nexport const Workbench: React.FC<WorkbenchProps> = ({"
);

fs.writeFileSync('src/components/Workbench.tsx', content);

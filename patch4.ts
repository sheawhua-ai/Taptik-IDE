import fs from 'fs';

let code = fs.readFileSync('src/pages/MerchantMatrix.tsx', 'utf8');

const handlerCode = `const handleFieldFocus = (fieldName: string, content?: string) => {
    window.dispatchEvent(new CustomEvent('open-expert', {
      detail: { 
        expert: '内容修改', 
        context: content ? \`准备修改\${fieldName}：\${content}\` : \`准备修改\${fieldName}...\` 
      }
    }));
  };`;

code = code.replace('const [taskCount, setTaskCount] = useState(10);', 'const [taskCount, setTaskCount] = useState(10);\n  ' + handlerCode);

fs.writeFileSync('src/pages/MerchantMatrix.tsx', code);

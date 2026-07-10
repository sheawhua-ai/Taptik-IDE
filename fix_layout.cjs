const fs = require('fs');
let code = fs.readFileSync('src/components/rings/InteractionWorkbench.tsx', 'utf8');

code = code.replace(
  "export function InteractionWorkbench() {",
  "export function InteractionWorkbench({ task, onClose }: { task?: any, onClose?: () => void }) {"
);

code = code.replace(
  '<div className="flex flex-col h-[calc(100vh-64px)] bg-neutral-100 overflow-hidden">',
  '<div className="fixed inset-0 z-[100] bg-neutral-100 flex flex-col h-screen overflow-hidden">'
);

const topNavOriginal = `      {/* Top Navigation */}
      <div className="bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-6">`;

const topNavFixed = `      {/* Top Navigation */}
      <div className="bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-6">
          <button onClick={onClose} className="text-neutral-500 hover:text-neutral-900 mr-2 flex items-center gap-2">
            <X size={20} />
            <h2 className="text-[16px] font-bold text-neutral-900">互动承接</h2>
          </button>
          <div className="h-4 w-px bg-neutral-200 mx-2"></div>`;

code = code.replace(topNavOriginal, topNavFixed);

fs.writeFileSync('src/components/rings/InteractionWorkbench.tsx', code);

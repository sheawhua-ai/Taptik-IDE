const fs = require('fs');
let content = fs.readFileSync('src/components/merchant/CreateProjectWorkstation.tsx', 'utf8');

const missingComponents = `
function AvailableScopeDrawer({ onClose }: any) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-neutral-900/20 backdrop-blur-sm" onClick={onClose} />
      <div className="w-[500px] bg-white h-full shadow-2xl flex flex-col relative z-10">
        <div className="p-6 border-b border-neutral-200 flex justify-between items-center bg-white">
          <h2 className="text-[18px] font-bold text-neutral-900">查看参考范围</h2>
          <button onClick={onClose} className="p-2 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
           <div className="bg-primary-50 text-primary-700 px-4 py-3 rounded-xl text-[13px] font-bold border border-primary-100">
             本次参考了12条商家事实、2个相似项目、3条复盘结论和4项账号资源。
           </div>
        </div>
      </div>
    </div>
  )
}

function MaterialDrawer({ onClose }: any) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-neutral-900/20 backdrop-blur-sm" onClick={onClose} />
      <div className="w-[500px] bg-white h-full shadow-2xl flex flex-col relative z-10">
        <div className="p-6 border-b border-neutral-200 flex justify-between items-center bg-white">
          <h2 className="text-[18px] font-bold text-neutral-900">补充本次资料</h2>
          <button onClick={onClose} className="p-2 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <button className="flex flex-col items-center justify-center p-6 bg-white border border-neutral-200 border-dashed rounded-xl hover:border-primary-400 hover:bg-primary-50 transition-colors">
               <span className="text-[13px] font-bold text-neutral-700">上传文件</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function EmployeeDrawer({ onClose }: any) {
  return null;
}

function OtherPlansDrawer({ onClose }: any) {
  return null;
}

function KOCConfigDrawer({ type, onClose }: any) {
  return null;
}
`;

fs.appendFileSync('src/components/merchant/CreateProjectWorkstation.tsx', missingComponents);

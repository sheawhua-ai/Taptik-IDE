import fs from 'fs';

let content = fs.readFileSync('src/components/merchant/ProjectCenter.tsx', 'utf-8');

const modalsCode = `
      {showLinkMethodModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="font-bold text-[16px] mb-4">账号与发布安排</h3>
            <div className="space-y-4 mb-6">
               <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                  <div className="text-[12px] text-neutral-500 mb-1">目标账号</div>
                  <div className="text-[14px] font-bold text-neutral-900">小红书-店长A号</div>
                  <div className="text-[12px] text-neutral-500 mt-2 mb-1">账号角色</div>
                  <div className="text-[13px] font-medium text-neutral-800">主理人 / 专家人设</div>
               </div>
               
               <div>
                 <label className="text-[12px] font-bold text-neutral-700 block mb-1.5">实际发布人</label>
                 <select className="w-full p-2.5 bg-white border border-neutral-200 rounded-xl text-[13px] outline-none focus:border-primary-500">
                   <option>王美丽 (员工)</option>
                   <option>张操盘 (操盘手)</option>
                 </select>
               </div>

               <div>
                 <label className="text-[12px] font-bold text-neutral-700 block mb-1.5">发布方式</label>
                 <select className="w-full p-2.5 bg-white border border-neutral-200 rounded-xl text-[13px] outline-none focus:border-primary-500">
                   <option>员工手机人工发布</option>
                   <option>操盘手人工发布</option>
                   <option>已接入的合法自动发布</option>
                 </select>
               </div>
               
               <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
                 <div className="text-[12px] font-bold text-blue-900 mb-1">当前可触达状态：在线</div>
                 <div className="text-[11px] text-blue-800">任务链接将自动推送到员工客户端。</div>
               </div>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowLinkMethodModal(false)} className="px-4 py-2 border border-neutral-200 rounded-xl text-[12px] font-bold">取消</button>
              <button onClick={() => {
                alert("已确认发布安排");
                setShowLinkMethodModal(false);
              }} className="px-4 py-2 bg-neutral-900 text-white rounded-xl text-[12px] font-bold">确认配置</button>
            </div>
          </div>
        </div>
      )}
`;

content = content.replace('{/* Modals */}', '{/* Modals */}\n' + modalsCode);
fs.writeFileSync('src/components/merchant/ProjectCenter.tsx', content);

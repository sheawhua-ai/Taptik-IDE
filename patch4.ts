import fs from 'fs';

let code = fs.readFileSync('src/pages/MerchantMatrix.tsx', 'utf8');

const qrModalRegex = /\{showQrModal !== null && \([\s\S]*?\}\)/;

const replacement = `{showQrModal !== null && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl w-full max-w-sm overflow-hidden flex flex-col shadow-2xl">
              <div className="p-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50">
                <h3 className="font-medium text-neutral-900 border-l-4 border-primary-500 pl-2">项目专属 KOC 认领平台</h3>
                <button onClick={() => setShowQrModal(null)} className="p-1 hover:bg-neutral-200 rounded text-neutral-400"><X size={18} /></button>
              </div>
              <div className="p-6 flex flex-col items-center">
                <div className="w-48 h-48 bg-neutral-100 rounded-xl mb-4 flex items-center justify-center border-2 border-dashed border-neutral-200">
                  <QrCode size={100} className="text-neutral-400" />
                </div>
                <p className="text-[13px] text-neutral-500 text-center mb-4 leading-relaxed">让素人和 KOC 扫码进入专属接单大厅<br/>自主领取此项目内的单篇笔记任务，<br/>并支持直接回传相关素材供 AI 校验发文</p>
                <div className="flex w-full gap-2">
                  <div className="flex-1 bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-[12px] text-neutral-500 flex items-center overflow-hidden">
                    <span className="truncate">https://ai.work/koc-hub/{activeProject}</span>
                  </div>
                  <button onClick={() => {
                    setToastMessage("KOC 认领链接已复制，可群发至达人通告群");
                    setShowQrModal(null);
                    setTimeout(() => setToastMessage(""), 2000);
                  }} className="px-3 py-2 bg-primary-50 text-primary-600 rounded-lg shrink-0 flex items-center gap-1 hover:bg-primary-100 transition-colors tooltip" title="复制">
                    <Copy size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}`;

code = code.replace(qrModalRegex, replacement);

// The subagent chat module was explicitly mentioned to be unnecessary here. So how do we remove it?
// "素材任务这个模块，看上去不需要聊天式的subagent"
// Subagent is rendered next to the tasks / notes. Let's look at it.
// Right: AI Subagent & Status

const subagentRegex = /\{!\* Right: AI Subagent & Status \*!\}([\s\S]*)<div className="w-full xl:w-\[460px\][\s\S]*?<SubagentChat[\s\S]*?<\/div>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;
// Actually I don't want to use extreme regexes. I will modify patch4.ts to safely remove the sidebar entirely or only keep "Status Config".

// Let's first make sure the qr modal patch evaluates
fs.writeFileSync('src/pages/MerchantMatrix.tsx', code);

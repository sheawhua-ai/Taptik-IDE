const fs = require('fs');
let code = fs.readFileSync('src/components/rings/ShootingAndUploadWorkbench.tsx', 'utf8');

const oldConsumerCreateView = `function ConsumerCreateView({ onBack, onDone }: { onBack: () => void, onDone: () => void }) {
  return (
    <div className="h-full flex flex-col bg-white p-8">
      <button onClick={onBack} className="text-[13px] text-neutral-500 mb-4 self-start flex items-center gap-1"><X size={14}/> 取消</button>
      <h2 className="text-[20px] font-bold text-neutral-900 mb-6">生成体验领取入口</h2>
      <div className="flex-1 overflow-y-auto">
         <p className="text-[13px] text-neutral-500">采用三步确认 (原型省略详细表单)</p>
         {/* Steps placeholder */}
      </div>
    </div>
  );
}`;

const newConsumerCreateView = `function ConsumerCreateView({ onBack, onDone }: { onBack: () => void, onDone: () => void }) {
  const [step, setStep] = useState(1);
  
  return (
    <div className="h-full flex flex-col bg-neutral-50">
      <div className="p-6 bg-white border-b border-neutral-200 shrink-0">
        <button onClick={onBack} className="text-[13px] text-neutral-500 mb-4 self-start flex items-center gap-1 hover:text-neutral-900"><X size={14}/> 取消生成</button>
        <div className="flex justify-between items-center">
          <h2 className="text-[20px] font-bold text-neutral-900">生成体验领取入口</h2>
          <div className="flex items-center gap-2">
             <div className={\`flex items-center justify-center w-6 h-6 rounded-full text-[12px] font-bold \${step >= 1 ? 'bg-neutral-900 text-white' : 'bg-neutral-200 text-neutral-500'}\`}>1</div>
             <div className={\`w-8 h-0.5 \${step >= 2 ? 'bg-neutral-900' : 'bg-neutral-200'}\`}></div>
             <div className={\`flex items-center justify-center w-6 h-6 rounded-full text-[12px] font-bold \${step >= 2 ? 'bg-neutral-900 text-white' : 'bg-neutral-200 text-neutral-500'}\`}>2</div>
             <div className={\`w-8 h-0.5 \${step >= 3 ? 'bg-neutral-900' : 'bg-neutral-200'}\`}></div>
             <div className={\`flex items-center justify-center w-6 h-6 rounded-full text-[12px] font-bold \${step >= 3 ? 'bg-neutral-900 text-white' : 'bg-neutral-200 text-neutral-500'}\`}>3</div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 flex justify-center">
        <div className="w-[600px] space-y-6">
          {step === 1 && (
            <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm animate-in fade-in slide-in-from-bottom-2">
              <h3 className="text-[16px] font-bold text-neutral-900 mb-4 border-b border-neutral-100 pb-2">第一步：确认体验任务</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] font-bold text-neutral-700 mb-1">所属项目</label>
                    <div className="p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-[13px] text-neutral-600">幼犬换粮搜索卡位</div>
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-neutral-700 mb-1">产品/服务</label>
                    <div className="p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-[13px] text-neutral-600">幼犬专属粮 1.5kg</div>
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-neutral-700 mb-1">名额</label>
                    <input type="number" defaultValue="30" className="w-full p-2.5 border border-neutral-200 rounded-lg text-[13px] focus:outline-none focus:border-neutral-400" />
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-neutral-700 mb-1">有效期</label>
                    <input type="date" className="w-full p-2.5 border border-neutral-200 rounded-lg text-[13px] focus:outline-none focus:border-neutral-400" />
                  </div>
                </div>
                
                <div className="pt-4 border-t border-neutral-100">
                  <h4 className="text-[13px] font-bold text-neutral-900 mb-3">领取限制</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-[13px] text-neutral-700"><input type="checkbox" defaultChecked className="rounded" /> 本入口每人限领一次</label>
                    <label className="flex items-center gap-2 text-[13px] text-neutral-700"><input type="checkbox" className="rounded" /> 允许参与其他同产品活动</label>
                    <label className="flex items-center gap-2 text-[13px] text-neutral-700"><input type="checkbox" defaultChecked className="rounded" /> 同产品活动排他</label>
                  </div>
                  <div className="text-[11px] text-neutral-400 mt-2">限制只对当前领取入口生效。运营可以为不同私域群建立不同入口。</div>
                </div>
                
                <div className="flex gap-2 justify-end pt-4">
                  <button className="px-4 py-2 bg-neutral-100 text-neutral-600 rounded-lg text-[13px] font-bold">调整任务说明</button>
                  <button onClick={() => setStep(2)} className="px-6 py-2 bg-neutral-900 text-white rounded-lg text-[13px] font-bold hover:bg-neutral-800">下一步</button>
                </div>
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm animate-in fade-in slide-in-from-bottom-2">
              <h3 className="text-[16px] font-bold text-neutral-900 mb-4 border-b border-neutral-100 pb-2">第二步：确认内容边界</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-[13px] font-bold text-neutral-700 mb-2">问卷将询问的真实信息</h4>
                  <div className="bg-neutral-50 p-3 rounded-lg text-[13px] text-neutral-600 border border-neutral-200">狗狗年龄、品种、过去换粮是否软便、首次试吃反馈</div>
                </div>
                <div>
                  <h4 className="text-[13px] font-bold text-neutral-700 mb-2">内容包的表达方向</h4>
                  <div className="bg-neutral-50 p-3 rounded-lg text-[13px] text-neutral-600 border border-neutral-200">真实分享幼犬换粮经验，强调七日换粮法和适口性。</div>
                </div>
                <div>
                  <h4 className="text-[13px] font-bold text-neutral-700 mb-2">不允许出现的承诺</h4>
                  <div className="bg-rose-50 p-3 rounded-lg text-[13px] text-rose-700 border border-rose-100">"绝对不软便"、"兽医推荐"、"治愈玻璃胃"</div>
                </div>
                <div>
                  <h4 className="text-[13px] font-bold text-neutral-700 mb-2">固定拍摄主题</h4>
                  <div className="bg-neutral-50 p-3 rounded-lg text-[13px] text-neutral-600 border border-neutral-200">狗狗与包装同框、真实进食抓拍、颗粒对比</div>
                </div>
                
                <div className="flex gap-2 justify-end pt-4">
                  <button onClick={() => setStep(1)} className="px-4 py-2 bg-white border border-neutral-200 text-neutral-600 rounded-lg text-[13px] font-bold">上一步</button>
                  <button className="px-4 py-2 bg-neutral-100 text-neutral-600 rounded-lg text-[13px] font-bold">调整问卷</button>
                  <button className="px-4 py-2 bg-neutral-100 text-neutral-600 rounded-lg text-[13px] font-bold">调整内容边界</button>
                  <button onClick={() => setStep(3)} className="px-6 py-2 bg-neutral-900 text-white rounded-lg text-[13px] font-bold hover:bg-neutral-800">下一步</button>
                </div>
              </div>
            </div>
          )}
          
          {step === 3 && (
            <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm animate-in fade-in slide-in-from-bottom-2">
              <h3 className="text-[16px] font-bold text-neutral-900 mb-4 border-b border-neutral-100 pb-2">第三步：生成入口</h3>
              <div className="flex flex-col items-center justify-center py-6">
                <div className="w-40 h-40 bg-neutral-100 border border-neutral-200 rounded-xl mb-4 flex items-center justify-center text-neutral-400">
                  [二维码占位]
                </div>
                <div className="bg-neutral-50 px-4 py-2 rounded-lg border border-neutral-200 text-[13px] font-mono text-neutral-600 flex items-center gap-2 mb-6">
                  https://app.example.com/join/a8b9c0
                  <button className="text-primary-600 hover:text-primary-700"><Copy size={14}/></button>
                </div>
                
                <div className="w-full bg-blue-50 p-4 rounded-lg border border-blue-100 text-[12px] text-blue-800 space-y-1 mb-6">
                  <div><span className="font-bold">剩余名额:</span> 30 / 30</div>
                  <div><span className="font-bold">每人领取次数:</span> 1 次</div>
                  <div><span className="font-bold">排他规则:</span> 限制参与其他同产品活动</div>
                </div>
                
                <div className="flex gap-3 w-full">
                  <button className="flex-1 py-2.5 bg-white border border-neutral-200 text-neutral-700 rounded-lg text-[13px] font-bold hover:bg-neutral-50 flex items-center justify-center gap-2"><Download size={16}/> 下载二维码</button>
                  <button className="flex-1 py-2.5 bg-white border border-neutral-200 text-neutral-700 rounded-lg text-[13px] font-bold hover:bg-neutral-50 flex items-center justify-center gap-2"><PlayCircle size={16}/> 预览H5</button>
                  <button onClick={onDone} className="flex-1 py-2.5 bg-emerald-600 text-white rounded-lg text-[13px] font-bold hover:bg-emerald-700 shadow flex items-center justify-center gap-2"><Check size={16}/> 开放领取</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}`;

code = code.replace(oldConsumerCreateView, newConsumerCreateView);

fs.writeFileSync('src/components/rings/ShootingAndUploadWorkbench.tsx', code);

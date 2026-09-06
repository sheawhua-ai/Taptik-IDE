import re

with open("src/components/merchant/CreateProject/Builders/CoreProblemBuilder.tsx", "r") as f:
    code = f.read()

new_fallback = """      {/* Fallback Entry points */}
      <div className="border-t border-border-default bg-surface-subtle px-4 py-2 flex items-center gap-4 text-[12px]">
        <span className="text-text-tertiary">没找到合适的？</span>
        <button onClick={() => { setStep(4); }} className="text-text-secondary hover:text-text-main font-medium underline underline-offset-2">自己写</button>
      </div>
      
      {step === 4 && (
        <div className="p-4 border-t border-border-default bg-surface-1">
          <textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} placeholder="手动输入核心问题..." className="w-full rounded-xl border border-border-default px-3.5 py-2.5 text-[13px] leading-6 outline-none focus:border-neutral-500 resize-none mb-2" />
          <div className="flex justify-end"><button onClick={() => setIsOpen(false)} className="px-4 py-1.5 rounded-lg bg-neutral-900 text-white text-[12px] font-medium">完成编辑</button></div>
        </div>
      )}
    </div>"""

code = re.sub(r'      \{\/\* Fallback Entry points \*\/\}[\s\S]*?<\/div>\n    <\/div>', new_fallback, code)

with open("src/components/merchant/CreateProject/Builders/CoreProblemBuilder.tsx", "w") as f:
    f.write(code)


import re

with open("src/components/merchant/CreateProject/Builders/CoreProblemBuilder.tsx", "r") as f:
    code = f.read()

code = code.replace("import { Bot, Sparkles, Edit2 } from 'lucide-react';", "import { Bot, Sparkles, Edit2, X } from 'lucide-react';")

header_old = """      <div className="flex items-center justify-between border-b border-border-default bg-surface-subtle px-4 py-2.5">
        <h3 className="text-[13px] font-semibold text-text-main flex items-center gap-1.5"><Sparkles size={14} className="text-brand-logo" />核心问题诊断</h3>
      </div>"""

header_new = """      <div className="flex items-center justify-between border-b border-border-default bg-surface-subtle px-4 py-2.5">
        <h3 className="text-[13px] font-semibold text-text-main flex items-center gap-1.5"><Sparkles size={14} className="text-brand-logo" />核心问题诊断</h3>
        <button onClick={() => { onStructuredValueChange(undefined); onChange(''); setIsManual(false); }} className="text-text-tertiary hover:text-text-main"><X size={15} /></button>
      </div>"""

code = code.replace(header_old, header_new)

with open("src/components/merchant/CreateProject/Builders/CoreProblemBuilder.tsx", "w") as f:
    f.write(code)


with open("src/components/rings/ContentReviewWorkbench.tsx", "r") as f:
    content = f.read()

import re

# Add state variable
content = content.replace("const [showBatchConfirm, setShowBatchConfirm] = useState(false);", 
"const [showBatchConfirm, setShowBatchConfirm] = useState(false);\n  const [taskStatusView, setTaskStatusView] = useState<'quick' | 'action' | 'wait'>('action');")

# Replace Top Bar
old_top_bar = """        <div className="flex items-center gap-4 text-[13px]">
            <div onClick={() => setShowBatchConfirm(true)} className="flex items-center gap-1.5 cursor-pointer hover:bg-neutral-50 px-2 py-1 rounded">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-neutral-600">可批量确认 <strong className="text-neutral-900">8</strong></span>
            </div>
            <div onClick={() => setShowBatchConfirm(false)} className="flex items-center gap-1.5 cursor-pointer hover:bg-neutral-50 px-2 py-1 rounded">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span className="text-neutral-600">需逐篇审核 <strong className="text-neutral-900">3</strong></span>
            </div>
            <div className="flex items-center gap-1.5 cursor-pointer hover:bg-neutral-50 px-2 py-1 rounded">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              <span className="text-neutral-600">事实待核实 <strong className="text-neutral-900">1</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-neutral-400">
              <span className="w-2 h-2 rounded-full bg-neutral-300"></span>
              <span>缺账号角色 0</span>
            </div>
          </div>"""

new_top_bar = """        <div className="flex items-center gap-2 text-[13px]">
            <div onClick={() => { setTaskStatusView('quick'); setShowBatchConfirm(true); }} className={`flex items-center gap-1.5 cursor-pointer px-3 py-1.5 rounded-lg border transition-colors ${taskStatusView === 'quick' ? 'bg-emerald-50 border-emerald-200 text-emerald-700 font-bold' : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'}`}>
              <span className={`w-2 h-2 rounded-full ${taskStatusView === 'quick' ? 'bg-emerald-500' : 'bg-neutral-300'}`}></span>
              <span>快速确认 (8)</span>
            </div>
            <div onClick={() => { setTaskStatusView('action'); setShowBatchConfirm(false); }} className={`flex items-center gap-1.5 cursor-pointer px-3 py-1.5 rounded-lg border transition-colors ${taskStatusView === 'action' ? 'bg-rose-50 border-rose-200 text-rose-700 font-bold' : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'}`}>
              <span className={`w-2 h-2 rounded-full ${taskStatusView === 'action' ? 'bg-rose-500' : 'bg-neutral-300'}`}></span>
              <span>需要处理 (4)</span>
            </div>
            <div onClick={() => setTaskStatusView('wait')} className={`flex items-center gap-1.5 cursor-pointer px-3 py-1.5 rounded-lg border transition-colors ${taskStatusView === 'wait' ? 'bg-amber-50 border-amber-200 text-amber-700 font-bold' : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'}`}>
              <span className={`w-2 h-2 rounded-full ${taskStatusView === 'wait' ? 'bg-amber-500' : 'bg-neutral-300'}`}></span>
              <span>等待推进 (6)</span>
            </div>
          </div>"""

content = content.replace(old_top_bar, new_top_bar)

with open("src/components/rings/ContentReviewWorkbench.tsx", "w") as f:
    f.write(content)

with open("src/components/rings/ShootingAndUploadWorkbench.tsx", "r") as f:
    content = f.read()

content = content.replace("const [activeConsumerView, setActiveConsumerView] = useState('list'); // list, create, progress, image_detail", 
"const [activeConsumerView, setActiveConsumerView] = useState('list'); // list, create, progress, image_detail\n  const [taskStatusView, setTaskStatusView] = useState<'quick' | 'action' | 'wait'>('action');")

old_metrics = """              <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded text-[12px] font-bold border border-emerald-200 cursor-pointer hover:bg-emerald-100 transition-colors">快速确认 (4)</span>
              <span className="px-2 py-1 bg-rose-50 text-rose-700 rounded text-[12px] font-bold border border-rose-200 cursor-pointer hover:bg-rose-100 transition-colors">需要处理 (12)</span>
              <span className="px-2 py-1 bg-amber-50 text-amber-700 rounded text-[12px] font-bold border border-amber-200 cursor-pointer hover:bg-amber-100 transition-colors">等待推进 (5)</span>"""

new_metrics = """              <span onClick={() => setTaskStatusView('quick')} className={`px-2 py-1 rounded text-[12px] font-bold border cursor-pointer transition-colors ${taskStatusView === 'quick' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'}`}>快速确认 (4)</span>
              <span onClick={() => setTaskStatusView('action')} className={`px-2 py-1 rounded text-[12px] font-bold border cursor-pointer transition-colors ${taskStatusView === 'action' ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'}`}>需要处理 (12)</span>
              <span onClick={() => setTaskStatusView('wait')} className={`px-2 py-1 rounded text-[12px] font-bold border cursor-pointer transition-colors ${taskStatusView === 'wait' ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'}`}>等待推进 (5)</span>"""

content = content.replace(old_metrics, new_metrics)

with open("src/components/rings/ShootingAndUploadWorkbench.tsx", "w") as f:
    f.write(content)

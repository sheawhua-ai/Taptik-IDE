with open("src/components/rings/InteractionWorkbench.tsx", "r") as f:
    content = f.read()

content = content.replace("export function InteractionWorkbench({ onClose }: { onClose: () => void }) {\n  const [activeTab, setActiveTab] = useState<'intent' | 'exception' | 'risk'>('intent');",
"export function InteractionWorkbench({ onClose }: { onClose: () => void }) {\n  const [activeTab, setActiveTab] = useState<'intent' | 'exception' | 'risk'>('intent');\n  const [taskStatusView, setTaskStatusView] = useState<'quick' | 'action' | 'wait'>('action');")


old_metrics = """            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[12px] font-bold border border-emerald-200 cursor-pointer hover:bg-emerald-100 transition-colors">快速确认 (12)</span>
              <span className="px-2 py-1 bg-rose-50 text-rose-700 rounded-lg text-[12px] font-bold border border-rose-200 cursor-pointer hover:bg-rose-100 transition-colors">需要处理 (6)</span>
              <span className="px-2 py-1 bg-amber-50 text-amber-700 rounded-lg text-[12px] font-bold border border-amber-200 cursor-pointer hover:bg-amber-100 transition-colors">等待推进 (2)</span>
            </div>"""

new_metrics = """            <div className="flex items-center gap-2">
              <span onClick={() => setTaskStatusView('quick')} className={`px-2 py-1 rounded-lg text-[12px] font-bold border cursor-pointer transition-colors ${taskStatusView === 'quick' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'}`}>快速确认 (12)</span>
              <span onClick={() => setTaskStatusView('action')} className={`px-2 py-1 rounded-lg text-[12px] font-bold border cursor-pointer transition-colors ${taskStatusView === 'action' ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'}`}>需要处理 (6)</span>
              <span onClick={() => setTaskStatusView('wait')} className={`px-2 py-1 rounded-lg text-[12px] font-bold border cursor-pointer transition-colors ${taskStatusView === 'wait' ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'}`}>等待推进 (2)</span>
            </div>"""

content = content.replace(old_metrics, new_metrics)

with open("src/components/rings/InteractionWorkbench.tsx", "w") as f:
    f.write(content)

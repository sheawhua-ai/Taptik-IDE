import re

with open("src/components/material-center/MaterialCenterV2.tsx", "r") as f:
    code = f.read()

# Original mapping:
# {smartClusters.map(cluster => <button key={cluster.id} type="button" onClick={() => { setActiveTag(`ai:${cluster.id}`); setShowSmartClusters(false); }} className="flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-hover-bg"><div className="flex -space-x-2">{cluster.samples.map(asset => <img key={asset.id} src={asset.url} alt="" className="h-8 w-8 rounded-md border-2 border-white object-cover" />)}</div><div className="min-w-0 flex-1"><div className="flex items-center justify-between"><span className="text-[13px] font-medium text-text-main">{cluster.label}</span><span className="text-[13px] text-text-tertiary">{cluster.count}项</span></div><p className="mt-0.5 truncate text-[13px] text-text-tertiary">{cluster.description}</p></div></button>)}

new_mapping = r"""{smartClusters.map(cluster => <button key={cluster.id} type="button" onClick={() => { setActiveTag(`ai:${cluster.id}`); setShowSmartClusters(false); }} className="flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-hover-bg"><div className="min-w-0 flex-1"><div className="flex items-center justify-between"><span className="text-[13px] font-medium text-text-main">{cluster.label}</span><span className="text-[13px] text-text-tertiary">{cluster.count}项</span></div><p className="mt-0.5 truncate text-[13px] text-text-tertiary">{cluster.description}</p></div></button>)}"""

code = re.sub(r'\{smartClusters\.map\(cluster => <button key=\{cluster\.id\} .*?<\/button>\)\}', new_mapping, code)

with open("src/components/material-center/MaterialCenterV2.tsx", "w") as f:
    f.write(code)

print("Smart clusters updated")

import re

with open("src/components/material-center/MaterialCenterV2.tsx", "r") as f:
    code = f.read()

count_replacement = """
  const counts = useMemo(() => ({
    available: imageAssets.filter(asset => asset.status === 'available' && !optimizationIds.has(asset.id)).length,
    backup: imageAssets.filter(asset => asset.status === 'pending_acceptance').length,
    reserved: imageAssets.filter(asset => asset.status === 'reserved').length,
    optimize: imageAssets.filter(asset => optimizationIds.has(asset.id) && asset.status !== 'archived').length,
    used: imageAssets.filter(asset => asset.status === 'used').length,
    archived: imageAssets.filter(asset => asset.status === 'archived').length
  }), [imageAssets, optimizationIds]);
"""
code = re.sub(r'  const counts = useMemo\(\(\) => \(\{[\s\S]*?\}\), \[imageAssets, optimizationIds\]\);', count_replacement.strip(), code)

filter_replacement = """
      if (activeView === 'available' && (asset.status !== 'available' || optimizationIds.has(asset.id))) return false;
      if (activeView === 'backup' && asset.status !== 'pending_acceptance') return false;
      if (activeView === 'reserved' && asset.status !== 'reserved') return false;
"""
code = re.sub(
    r'      if \(activeView === \'available\' && \(asset\.status !== \'available\' \|\| optimizationIds\.has\(asset\.id\)\)\) return false;\n      if \(activeView === \'reserved\' && asset\.status !== \'reserved\'\) return false;',
    filter_replacement.strip(),
    code
)

with open("src/components/material-center/MaterialCenterV2.tsx", "w") as f:
    f.write(code)

print("Backup logic added")

import re

with open("src/components/material-center/MaterialAssetCardV2.tsx", "r") as f:
    code = f.read()

prop_pattern = r'  onOpenDetail: \(asset: MaterialAsset\) => void;\n\}'
code = re.sub(prop_pattern, '  onOpenDetail: (asset: MaterialAsset) => void;\n  ctr?: string;\n  optimizationStrategy?: string;\n}', code)

with open("src/components/material-center/MaterialAssetCardV2.tsx", "w") as f:
    f.write(code)

print("Fixed")

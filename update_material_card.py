import re

with open("src/components/material-center/MaterialAssetCardV2.tsx", "r") as f:
    code = f.read()

# Add ctr and optimizationStrategy to Props
prop_pattern = r'  onOpenDetail: \(asset: MaterialAsset\) => void;\n\}'
code = re.sub(prop_pattern, '  onOpenDetail: (asset: MaterialAsset) => void;\n  ctr?: string;\n  optimizationStrategy?: string;\n}', code)

# Add to the function signature
func_pattern = r'  onToggleSelect,\n  onOpenDetail\n\}\) => \{'
code = re.sub(func_pattern, '  onToggleSelect,\n  onOpenDetail,\n  ctr,\n  optimizationStrategy\n}) => {', code)

# Look for `mode === 'optimize'` rendering part
# We will inject the CTR and strategy display somewhere. Let's see how the card is structured.

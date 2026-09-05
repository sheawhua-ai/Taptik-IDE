import re

with open("src/components/material-center/MaterialAssetCardV2.tsx", "r") as f:
    code = f.read()

# Add ctr and optimizationStrategy to the destructured arguments
code = code.replace(
"""  onToggleSelect,
  onOpenDetail
}) => {""",
"""  onToggleSelect,
  onOpenDetail,
  ctr,
  optimizationStrategy
}) => {"""
)

with open("src/components/material-center/MaterialAssetCardV2.tsx", "w") as f:
    f.write(code)

print("Card props fixed")

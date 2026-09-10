import re

with open("src/components/merchant/AccountAssetsV2.tsx", "r") as f:
    code = f.read()

code = re.sub(
    r'\{viewMode === "accounts" && \(\s*<div className="mb-4 grid grid-cols-4 divide-x divide-border-default rounded-xl border border-border-default bg-surface-subtle">.*?</div>\s*\)\}',
    '',
    code,
    flags=re.DOTALL
)

with open("src/components/merchant/AccountAssetsV2.tsx", "w") as f:
    f.write(code)

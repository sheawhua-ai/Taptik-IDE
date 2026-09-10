import re
with open("src/components/merchant/AccountAssetsV2.tsx", "r") as f:
    code = f.read()

# Header padding
code = code.replace(
    'className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-border-default bg-surface px-6 py-2.5"',
    'className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-border-default bg-surface px-6 py-2"'
)

# Search input padding
code = code.replace(
    'className="w-full rounded-lg border border-border-default bg-surface pl-8 pr-3 py-2 text-[13px] outline-none focus:border-border-strong"',
    'className="w-full rounded-lg border border-border-default bg-surface pl-8 pr-3 py-1.5 text-[13px] outline-none focus:border-border-strong"'
)

# Join account button
code = code.replace(
    'className="flex items-center gap-1.5 rounded-lg border border-border-default bg-surface px-3.5 py-2 text-[13px] font-medium text-text-primary hover:bg-surface-hover"',
    'className="flex items-center gap-1.5 rounded-lg border border-border-default bg-surface px-3 py-1.5 text-[13px] font-medium text-text-primary hover:bg-surface-hover"'
)

# Add employee button
code = code.replace(
    'className="flex items-center gap-1.5 rounded-lg bg-action-primary px-3.5 py-2 text-[13px] font-semibold text-white hover:bg-action-primary-hover"',
    'className="flex items-center gap-1.5 rounded-lg bg-action-primary px-3 py-1.5 text-[13px] font-semibold text-white hover:bg-action-primary-hover"'
)

with open("src/components/merchant/AccountAssetsV2.tsx", "w") as f:
    f.write(code)

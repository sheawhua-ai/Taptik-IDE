with open("src/components/merchant/ProjectCenter.tsx", "r") as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "{/* DRAWERS & MODALS" in line:
        lines.insert(i - 1, "        )}\n")
        break

with open("src/components/merchant/ProjectCenter.tsx", "w") as f:
    f.writelines(lines)

with open("src/components/merchant/ReviewCenter/ReviewWorkbench.tsx", "r") as f:
    lines = f.readlines()

new_lines = []
for i, line in enumerate(lines):
    if i == 275 or i == 276:
        continue # skip the broken lines
    new_lines.append(line)

with open("src/components/merchant/ReviewCenter/ReviewWorkbench.tsx", "w") as f:
    f.writelines(new_lines)

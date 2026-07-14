with open("src/components/rings/InteractionWorkbench.tsx", "r") as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if line.startswith("function InterceptTab() {"):
        # The line before `function InterceptTab() {` is probably empty or `}`
        # The line before that should be `  );`
        idx = i
        break

while not lines[idx].strip().startswith(");"):
    idx -= 1

# Insert `    </div>` right before `  );`
lines.insert(idx, "    </div>\n")

with open("src/components/rings/InteractionWorkbench.tsx", "w") as f:
    f.writelines(lines)

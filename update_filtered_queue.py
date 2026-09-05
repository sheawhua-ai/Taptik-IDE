import re

with open("src/components/merchant/ExecutionCenter/OperatorTaskWorkbench.tsx", "r") as f:
    code = f.read()

new_filtered_queue = """  const filteredQueue = queue.filter(item => {
    const query = queueQuery.trim().toLowerCase();
    return !query || [item.noteTitle, item.targetAccount, item.projectName]
      .filter(Boolean)
      .some(value => value!.toLowerCase().includes(query));
  }).sort((a, b) => {
    const score = (label: string | undefined) => {
      if (label === '已逾期') return 4;
      if (label === '今日到期') return 3;
      if (label === '即将到期') return 2;
      return 1;
    };
    return score(b.deadlineLabel) - score(a.deadlineLabel);
  });"""

code = re.sub(r'  const filteredQueue = queue\.filter\(item => \{[\s\S]*?\}\);', new_filtered_queue, code)

with open("src/components/merchant/ExecutionCenter/OperatorTaskWorkbench.tsx", "w") as f:
    f.write(code)

print("Updated filteredQueue")

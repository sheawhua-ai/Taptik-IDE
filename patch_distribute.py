import re

with open("src/components/merchant/CreateProject/StructuredPlanCreationFlow.tsx", "r") as f:
    code = f.read()

new_distribute = """function distributeCount<T extends { noteCount: number; id?: string; name?: string; roleInProject?: string; contentDirection?: string; frequency?: string; timeWindow?: string }>(accounts: T[], count: number): T[] {
  if (count === 0) {
    if (accounts.length === 1 && accounts[0].id === 'placeholder') return [];
    return accounts.map(a => ({ ...a, noteCount: 0 }));
  }
  let targetAccounts = accounts;
  if (targetAccounts.length === 0) {
    targetAccounts = [{
      id: 'placeholder',
      name: '待分配账号',
      roleInProject: '待定',
      contentDirection: '',
      frequency: '单次',
      timeWindow: '待定',
      noteCount: 0
    } as any];
  }
  const safeCount = Math.max(0, count);
  const base = Math.floor(safeCount / targetAccounts.length);
  const remainder = safeCount % targetAccounts.length;
  return targetAccounts.map((account, index) => ({
    ...account,
    noteCount: base + (index < remainder ? 1 : 0),
  }));
}"""

# Need to replace the whole function
code = re.sub(r'function distributeCount.*?\}\n\nfunction updateTotal', new_distribute + '\n\nfunction updateTotal', code, flags=re.DOTALL)

with open("src/components/merchant/CreateProject/StructuredPlanCreationFlow.tsx", "w") as f:
    f.write(code)

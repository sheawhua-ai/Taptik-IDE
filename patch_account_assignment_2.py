import re

with open("src/components/merchant/CreateProject/StructuredPlanCreationFlow.tsx", "r") as f:
    code = f.read()

# Add getCycleDays
func_code = """function getCycleDays(start: string, end: string) {
  if (!start || !end) return 1;
  return Math.max(1, Math.ceil((Date.parse(end) - Date.parse(start)) / 86400000));
}"""
code = code.replace("function getRoleCounts(draft: StrategyDraftData) {", func_code + "\n\nfunction getRoleCounts(draft: StrategyDraftData) {")

# Add cycleDays effect and expandedRole state
state_code = """  const [formNotice, setFormNotice] = useState('');
  const [expandedRole, setExpandedRole] = useState<string | null>(null);

  const cycleDays = getCycleDays(draft.startDate, draft.endDate);

  useEffect(() => {
    setDraft(curr => {
      let changed = false;
      const newBrand = curr.accountAndContentAssignment.brandAccounts.map(a => {
        if (a.noteCount !== cycleDays) { changed = true; return { ...a, noteCount: cycleDays }; }
        return a;
      });
      const newKos = curr.accountAndContentAssignment.kosAccounts.map(a => {
        if (a.noteCount !== cycleDays) { changed = true; return { ...a, noteCount: cycleDays }; }
        return a;
      });
      if (changed) {
        return updateTotal({
          ...curr,
          accountAndContentAssignment: {
            ...curr.accountAndContentAssignment,
            brandAccounts: newBrand,
            kosAccounts: newKos
          }
        });
      }
      return curr;
    });
  }, [cycleDays]);"""

code = code.replace("  const [formNotice, setFormNotice] = useState('');", state_code)

with open("src/components/merchant/CreateProject/StructuredPlanCreationFlow.tsx", "w") as f:
    f.write(code)

import re

with open("src/components/merchant/CreateProject/StructuredPlanCreationFlow.tsx", "r") as f:
    code = f.read()

# Replace applyAccountPreset
old_preset = """  const applyAccountPreset = (preset: AccountPreset) => {
    const currentTotal = counts.total > 0 ? counts.total : 20;
    const allocation = preset === 'all-koc'
      ? { brand: 0, kos: 0, koc: currentTotal }
      : preset === 'koc-first'
        ? { brand: Math.min(2, currentTotal), kos: Math.min(3, Math.max(0, currentTotal - 2)), koc: Math.max(0, currentTotal - 5) }
        : preset === 'owned-first'
          ? { brand: Math.ceil(currentTotal * 0.35), kos: Math.ceil(currentTotal * 0.4), koc: Math.max(0, currentTotal - Math.ceil(currentTotal * 0.35) - Math.ceil(currentTotal * 0.4)) }
          : { brand: 2, kos: 5, koc: Math.max(0, currentTotal - 7) };

    setDraft((current) => updateTotal({
      ...current,
      accountAndContentAssignment: {
        ...current.accountAndContentAssignment,
        brandAccounts: distributeCount(current.accountAndContentAssignment.brandAccounts, allocation.brand),
        kosAccounts: distributeCount(current.accountAndContentAssignment.kosAccounts, allocation.kos),
        kocParticipants: {
          ...current.accountAndContentAssignment.kocParticipants,
          enabled: allocation.koc > 0,
          recruitmentCount: allocation.koc,
        },
      },
    }));
  };"""

new_preset = """  const applyAccountPreset = (preset: AccountPreset) => {
    // Determine number of accounts (not notes) to pick based on preset
    const allocation = preset === 'all-koc'
      ? { brand: 0, kos: 0, koc: 10 }
      : preset === 'koc-first'
        ? { brand: 1, kos: 1, koc: 8 }
        : preset === 'owned-first'
          ? { brand: 2, kos: 3, koc: 0 }
          : { brand: 1, kos: 2, koc: 5 };

    setDraft((current) => updateTotal({
      ...current,
      accountAndContentAssignment: {
        ...current.accountAndContentAssignment,
        brandAccounts: AVAILABLE_ACCOUNTS.brand.slice(0, allocation.brand).map(a => ({
          id: a.id, name: a.name, roleInProject: '品牌发布', contentDirection: '', frequency: '1天1篇', timeWindow: '任意', noteCount: cycleDays
        })),
        kosAccounts: AVAILABLE_ACCOUNTS.kos.slice(0, allocation.kos).map(a => ({
          id: a.id, name: a.name, roleInProject: '员工发布', contentDirection: '', frequency: '1天1篇', timeWindow: '任意', noteCount: cycleDays
        })),
        kocParticipants: {
          ...current.accountAndContentAssignment.kocParticipants,
          enabled: allocation.koc > 0,
          recruitmentCount: allocation.koc,
        },
      },
    }));
  };"""

code = code.replace(old_preset, new_preset)

with open("src/components/merchant/CreateProject/StructuredPlanCreationFlow.tsx", "w") as f:
    f.write(code)

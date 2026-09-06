import re

with open("src/components/merchant/CreateProject/StructuredPlanCreationFlow.tsx", "r") as f:
    code = f.read()


old_set_draft = """const isBrand = item.role === 'brand';
                                          const list = isBrand ? curr.accountAndContentAssignment.brandAccounts : curr.accountAndContentAssignment.kosAccounts;
                                          const nextList = isSelected 
                                            ? list.filter(a => a.id !== acc.id)
                                            : [...list, { id: acc.id, name: acc.name, roleInProject: isBrand ? '品牌发布' : '员工发布', contentDirection: '', frequency: '1天1篇', timeWindow: '任意', noteCount: cycleDays }];
                                            
                                          return updateTotal({
                                            ...curr,
                                            accountAndContentAssignment: {
                                              ...curr.accountAndContentAssignment,
                                              ...(isBrand ? { brandAccounts: nextList } : { kosAccounts: nextList })
                                            }
                                          });"""

new_set_draft = """const roleKey = item.role === 'brand' ? 'brandAccounts' : (item.role === 'kos' ? 'kosAccounts' : 'kocAccounts');
                                          const list = (curr.accountAndContentAssignment as any)[roleKey] || [];
                                          const nextList = isSelected 
                                            ? list.filter((a: any) => a.id !== acc.id)
                                            : [...list, { id: acc.id, name: acc.name, roleInProject: item.label, contentDirection: '', frequency: '1天1篇', timeWindow: '任意', noteCount: cycleDays }];
                                            
                                          return updateTotal({
                                            ...curr,
                                            accountAndContentAssignment: {
                                              ...curr.accountAndContentAssignment,
                                              [roleKey]: nextList
                                            }
                                          });"""

code = code.replace(old_set_draft, new_set_draft)

# Also fix the validation since we removed `problemToSolve` and `contentLogic` from being required to create
val_old = """if (!draft.projectName.trim() || !draft.promotionTarget.targetName.trim() || !draft.coreStrategy.problemToSolve.trim() || !draft.promotionTarget.targetAudience.trim() || !draft.coreStrategy.contentLogic.trim()) {
      setFormError('请先完成方案名称、主推产品、核心问题、目标人群和内容方法。');"""
val_new = """if (!draft.projectName.trim() || !draft.promotionTarget.targetName.trim() || !draft.promotionTarget.targetAudience.trim()) {
      setFormError('请先完成方案名称、主推产品和目标人群。');"""
code = code.replace(val_old, val_new)

with open("src/components/merchant/CreateProject/StructuredPlanCreationFlow.tsx", "w") as f:
    f.write(code)

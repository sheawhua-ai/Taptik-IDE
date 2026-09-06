import re

with open("src/components/merchant/CreateProject/StructuredPlanCreationFlow.tsx", "r") as f:
    code = f.read()

# Replace the divide-y section
old_ui = r'<div className="divide-y divide-border-default rounded-xl border border-border-default">[\s\S]*?<\/div>\n                    <label className="flex items-start gap-3 rounded-xl border border-border-default p-4 cursor-pointer">'

new_ui = """<div className="divide-y divide-border-default rounded-xl border border-border-default">
                      {[{ role: 'brand' as const, label: '品牌主号', accounts: draft.accountAndContentAssignment.brandAccounts }, { role: 'kos' as const, label: '员工号 / KOS', accounts: draft.accountAndContentAssignment.kosAccounts }].map((item) => (
                        <div key={item.role} className="px-4 py-3.5">
                          <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpandedRole(expandedRole === item.role ? null : item.role)}>
                            <div>
                              <div className="text-[13px] font-semibold">{item.label}</div>
                              <div className="text-[12px] text-text-tertiary mt-0.5">
                                {item.accounts.length > 0 
                                  ? `已选 ${item.accounts.length} 个账号，每日1篇，共 ${item.accounts.length * cycleDays} 篇`
                                  : '未分配账号'}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-text-secondary">
                              <span className="text-[12px] hover:text-text-main underline">选择账号</span>
                            </div>
                          </div>
                          {expandedRole === item.role && (
                            <div className="mt-3 p-3 bg-surface-subtle border border-border-default rounded-lg">
                              <div className="flex flex-wrap gap-2">
                                {AVAILABLE_ACCOUNTS[item.role].map(acc => {
                                  const isSelected = item.accounts.some(a => a.id === acc.id);
                                  return (
                                    <button 
                                      key={acc.id} 
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setDraft(curr => {
                                          const isBrand = item.role === 'brand';
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
                                          });
                                        })
                                      }}
                                      className={`px-3 py-1.5 text-[12px] rounded-md border flex items-center gap-1.5 transition-colors ${isSelected ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-surface-1 border-border-default text-text-secondary hover:bg-surface-subtle'}`}
                                    >
                                      {isSelected && <Check size={12} />}
                                      {acc.name}
                                    </button>
                                  )
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                      <div className="flex items-center justify-between px-4 py-3.5">
                        <div>
                          <div className="text-[13px] font-semibold">KOC体验官</div>
                          <div className="text-[12px] text-text-tertiary mt-0.5">需要招募的KOC人数 (每人1篇)</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button type="button" onClick={() => updateRoleCount('koc', counts.koc - 1)} className="w-8 h-8 rounded-lg border border-border-default">−</button>
                          <input type="number" min={0} value={counts.koc} onChange={(event) => updateRoleCount('koc', Number(event.target.value))} className="w-14 h-8 text-center rounded-lg border border-border-default text-[13px]" />
                          <button type="button" onClick={() => updateRoleCount('koc', counts.koc + 1)} className="w-8 h-8 rounded-lg border border-border-default">＋</button>
                        </div>
                      </div>
                    </div>
                    <label className="flex items-start gap-3 rounded-xl border border-border-default p-4 cursor-pointer">"""

code = re.sub(old_ui, new_ui, code)

with open("src/components/merchant/CreateProject/StructuredPlanCreationFlow.tsx", "w") as f:
    f.write(code)

import re

with open("src/components/merchant/CreateProject/StructuredPlanCreationFlow.tsx", "r") as f:
    code = f.read()

# 1. Remove KOC from the .map array
old_map = "{[{ role: 'brand' as const, label: '品牌主号', accounts: draft.accountAndContentAssignment.brandAccounts }, { role: 'kos' as const, label: '员工号 / KOS', accounts: draft.accountAndContentAssignment.kosAccounts }, { role: 'koc' as const, label: 'KOC体验官', accounts: (draft.accountAndContentAssignment as any).kocAccounts || [] }].map((item) => ("
new_map = "{[{ role: 'brand' as const, label: '品牌主号', accounts: draft.accountAndContentAssignment.brandAccounts }, { role: 'kos' as const, label: '员工号 / KOS', accounts: draft.accountAndContentAssignment.kosAccounts }].map((item) => ("
code = code.replace(old_map, new_map)

# 2. Add KOC UI after the .map loop finishes.
# The map loop finishes exactly at `))}</div>` (need to check the exact ending). Let's see the end of the map.
# Looking at the code:
#                                 </select>
#                               </div>
#                             </div>
#                           )}
#                         </div>
#                       ))}

old_loop_end = """                              </div>
                            </div>
                          )}
                        </div>
                      ))}"""

new_loop_end = """                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                      <div className="px-4 py-3.5 flex items-center justify-between">
                        <div>
                          <div className="text-[13px] font-semibold">KOC体验官 (招募人数 = 笔记数)</div>
                          <div className="text-[12px] text-text-tertiary mt-0.5">本周期共发布 {draft.accountAndContentAssignment.kocParticipants.recruitmentCount || 0} 篇笔记</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <input 
                            type="number" 
                            min="0"
                            placeholder="输入招募人数" 
                            value={draft.accountAndContentAssignment.kocParticipants.recruitmentCount || ''} 
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 0;
                              setDraft(curr => updateTotal({
                                ...curr,
                                accountAndContentAssignment: {
                                  ...curr.accountAndContentAssignment,
                                  kocParticipants: {
                                    ...curr.accountAndContentAssignment.kocParticipants,
                                    enabled: val > 0,
                                    recruitmentCount: val
                                  }
                                }
                              }));
                            }}
                            className="w-24 h-8 text-center rounded-lg border border-border-default text-[13px] outline-none" 
                          />
                        </div>
                      </div>"""

code = code.replace(old_loop_end, new_loop_end)


with open("src/components/merchant/CreateProject/StructuredPlanCreationFlow.tsx", "w") as f:
    f.write(code)

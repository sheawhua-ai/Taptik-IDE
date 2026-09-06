import re

with open("src/components/merchant/CreateProject/StructuredPlanCreationFlow.tsx", "r") as f:
    code = f.read()

# Make KOC behave like Brand and KOS for account selection
koc_mock = """const AVAILABLE_ACCOUNTS = {
  brand: ["""
koc_mock_replacement = """const AVAILABLE_ACCOUNTS = {
  koc: [
    { id: 'koc-1', name: 'KOC-小红书达人-布丁' },
    { id: 'koc-2', name: 'KOC-宠物医生-王大夫' },
    { id: 'koc-3', name: 'KOC-多猫家庭-喵喵' },
    { id: 'koc-4', name: 'KOC-繁育人-张哥' }
  ],
  brand: ["""
code = code.replace(koc_mock, koc_mock_replacement)

# Remove the old manual KOC counter component from the mapping list
koc_counter_regex = r'<div className="flex items-center justify-between px-4 py-3\.5">.*?</div>\s*</div>\s*</div>'
code = re.sub(koc_counter_regex, '</div>', code, flags=re.DOTALL)

# Add KOC to the roles array
old_roles = """{ role: 'brand' as const, label: '品牌主号', accounts: draft.accountAndContentAssignment.brandAccounts }, { role: 'kos' as const, label: '员工号 / KOS', accounts: draft.accountAndContentAssignment.kosAccounts }"""
new_roles = """{ role: 'brand' as const, label: '品牌主号', accounts: draft.accountAndContentAssignment.brandAccounts }, { role: 'kos' as const, label: '员工号 / KOS', accounts: draft.accountAndContentAssignment.kosAccounts }, { role: 'koc' as const, label: 'KOC体验官', accounts: (draft.accountAndContentAssignment as any).kocAccounts || [] }"""
code = code.replace(old_roles, new_roles)

# Update state update logic for koc
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

# Update the display string for each role
old_display = """{item.accounts.length > 0 
                                  ? `已选 ${item.accounts.length} 个账号，每日1篇，共 ${item.accounts.length * cycleDays} 篇`
                                  : '未分配账号'}"""
new_display = """{item.accounts.length > 0 
                                  ? `已选 ${item.accounts.length} 个账号`
                                  : '未分配账号'}"""
code = code.replace(old_display, new_display)

# Update the account expansion view to include "内容模板"
old_expand = """{expandedRole === item.role && (
                            <div className="mt-3 p-3 bg-surface-subtle border border-border-default rounded-lg">
                              <div className="flex flex-wrap gap-2">
                                {AVAILABLE_ACCOUNTS[item.role].map(acc => {"""
new_expand = """{expandedRole === item.role && (
                            <div className="mt-3 p-3 bg-surface-subtle border border-border-default rounded-lg">
                              <div className="text-[12px] font-semibold text-text-secondary mb-2">选择参与账号</div>
                              <div className="flex flex-wrap gap-2 mb-4">
                                {AVAILABLE_ACCOUNTS[item.role].map(acc => {"""
code = code.replace(old_expand, new_expand)

old_acc_map = """{acc.name}
                                    </button>
                                  )
                                })}
                              </div>
                            </div>
                          )}"""
new_acc_map = """{acc.name}
                                    </button>
                                  )
                                })}
                              </div>
                              <div className="pt-3 border-t border-border-default">
                                <div className="text-[12px] font-semibold text-text-secondary mb-2 flex items-center justify-between">
                                  <span>选择内容模板 (可选)</span>
                                </div>
                                <select className="w-full bg-surface-1 border border-border-default rounded-lg px-2 py-1.5 text-[12px] outline-none text-text-main">
                                  <option value="">不使用预设模板 (由AI自动决策)</option>
                                  <option value="template-1">模板：科普评测风 (适合成分党)</option>
                                  <option value="template-2">模板：开箱体验风 (适合新手)</option>
                                  <option value="template-3">模板：剧情反转风 (适合泛流量)</option>
                                </select>
                              </div>
                            </div>
                          )}"""
code = code.replace(old_acc_map, new_acc_map)

with open("src/components/merchant/CreateProject/StructuredPlanCreationFlow.tsx", "w") as f:
    f.write(code)

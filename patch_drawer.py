import re

with open("src/components/knowledge/CategorySettingsDrawer.tsx", "r") as f:
    code = f.read()

# 1. Remove disabled={activeCategory.isDefault} and the Lock icon
code = code.replace('{activeCategory.isDefault ? <Lock className="h-3.5 w-3.5 text-text-tertiary" /> : null}', '')
code = code.replace('disabled={activeCategory.isDefault}', '')
code = code.replace('disabled:cursor-not-allowed disabled:bg-hover-bg disabled:text-text-tertiary ', '')

# 2. Fix the select options text (remove the sliced description)
old_option = """                      <option key={option.value} value={option.value}>
                        {option.label} （{option.description.slice(0, 24)}...）
                      </option>"""
new_option = """                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>"""
code = code.replace(old_option, new_option)

# 3. Remove "用途与收录说明" entirely
old_purpose_block = """                <div>
                  <label className="mb-3 block text-sm font-semibold text-text-main">用途与收录说明</label>
                  <div className="space-y-3 rounded-xl border border-border-default bg-surface-1 p-4">
                    {([
                      { key: 'stores', label: '这个区块存' },
                      { key: 'usedFor', label: '用于' },
                      { key: 'excludes', label: '不收' }
                    ] as const).map(row => (
                      <label key={row.key} className="flex items-center gap-3 text-sm text-text-secondary">
                        <span className="w-20 shrink-0">{row.label}</span>
                        <input
                          value={activeCategory.purpose[row.key]}
                          onChange={(event) => updateActiveCategory({ purpose: { ...activeCategory.purpose, [row.key]: event.target.value } })}
                          placeholder={PURPOSE_PLACEHOLDERS[normalizeKnowledgeFormat(activeCategory.primaryFormat)]?.[row.key] || ''}
                          className="min-w-0 flex-1 border-0 border-b border-border-default bg-transparent px-1 py-1.5 text-sm text-text-main outline-none focus:border-neutral-700"
                        />
                      </label>
                    ))}
                    <p className="pl-[92px] text-[12px] leading-5 text-text-tertiary">这一行帮 AI 判断内容该去别的区块，写清楚能少串块</p>
                  </div>
                </div>"""
code = code.replace(old_purpose_block, '')

with open("src/components/knowledge/CategorySettingsDrawer.tsx", "w") as f:
    f.write(code)

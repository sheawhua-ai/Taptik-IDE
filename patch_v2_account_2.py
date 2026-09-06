import re

with open("src/components/merchant/AccountAssetsV2.tsx", "r") as f:
    code = f.read()

old_block = """                          <ConfigField label="人设指令（Prompt）" hint="用于AI生成笔记时参考">
                            <textarea value={selected.persona} onChange={event => updateAccount(selected.id, { persona: event.target.value })} placeholder="输入该账号的语气、身份背景、常见口头禅等要求..." className="min-h-[100px] w-full rounded-lg border border-border-default bg-surface p-3 text-[13px] leading-relaxed outline-none" />
                          </ConfigField>
                        </div>
                      </div>"""

new_block = """                          <ConfigField label="人设指令（Prompt）" hint="用于AI生成笔记时参考">
                            <textarea value={selected.persona} onChange={event => updateAccount(selected.id, { persona: event.target.value })} placeholder="输入该账号的语气、身份背景、常见口头禅等要求..." className="min-h-[100px] w-full rounded-lg border border-border-default bg-surface p-3 text-[13px] leading-relaxed outline-none" />
                          </ConfigField>
                          
                          <div className="pt-2">
                            <span className="flex items-center justify-between gap-2 text-[13px] font-medium text-text-secondary mb-2">
                              <span>适合的内容模板 (可多选)</span>
                              <span className="font-normal text-text-tertiary">来自商家知识库 - 内容与图文</span>
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {['沉浸式开箱体验', '痛点解答科普风', '干货测评红黑榜', '剧情反转种草'].map(tmpl => {
                                const selectedTemplates = (selected as any).contentTemplates || [];
                                const isSelected = selectedTemplates.includes(tmpl);
                                return (
                                  <button
                                    key={tmpl}
                                    onClick={() => {
                                      const nextTemplates = isSelected 
                                        ? selectedTemplates.filter((t: string) => t !== tmpl) 
                                        : [...selectedTemplates, tmpl];
                                      updateAccount(selected.id, { contentTemplates: nextTemplates } as any);
                                    }}
                                    className={`px-3 py-1.5 text-[12px] rounded-lg border transition-colors ${isSelected ? 'bg-neutral-900 border-neutral-900 text-white' : 'bg-surface border-border-default text-text-secondary hover:bg-surface-subtle'}`}
                                  >
                                    {tmpl}
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                        </div>
                      </div>"""

code = code.replace(old_block, new_block)

with open("src/components/merchant/AccountAssetsV2.tsx", "w") as f:
    f.write(code)

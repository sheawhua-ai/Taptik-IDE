import re

with open("src/components/merchant/AccountAssetsV2.tsx", "r") as f:
    code = f.read()

# I need to add state for content templates in AccountProfile if it doesn't exist,
# but since it's a mock, I can just add a UI section inside the detailTab === "config" section

new_config_section = """                      <div className="rounded-xl border border-border-default bg-surface p-5 mt-6">
                        <h4 className="text-[14px] font-semibold text-text-primary">人设与内容边界</h4>
                        <div className="mt-4 space-y-4">
                          <ConfigField label="角色与定位" hint="例如：官方通告、育宠知识、客服答疑">
                            <input value={selected.persona || ""} onChange={event => updateAccount(selected.id, { persona: event.target.value })} placeholder="输入账号人设" className="w-full rounded-lg border border-border-default bg-surface px-3 py-2 text-[13px] outline-none" />
                          </ConfigField>
                          
                          <div className="pt-2">
                            <span className="flex items-center justify-between gap-2 text-[13px] font-medium text-text-secondary mb-2">
                              <span>适合的内容模板 (可多选)</span>
                              <span className="font-normal text-text-tertiary">来自商家知识库 - 内容与图文</span>
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {['沉浸式开箱体验', '痛点解答科普风', '干货测评红黑榜', '剧情反转种草'].map(tmpl => {
                                // Since we don't have a template array in the profile yet, mock selection logic or add it
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

# Find where to inject. There's a </div> closing the first ConfigField block around 533 probably. Let's do a precise string replacement.

old_block = """                      <div className="rounded-xl border border-border-default bg-surface p-5">
                        <h4 className="text-[14px] font-semibold text-text-primary">内容与发布规则</h4>
                        <div className="mt-4 space-y-4">
                          <ConfigField label="账号人设角色" hint="指导 AI 在生成文案和沟通时的语气身份">
                            <input value={selected.persona || ""} onChange={event => updateAccount(selected.id, { persona: event.target.value })} className="w-full rounded-lg border border-border-default bg-surface px-3 py-2 text-[13px] outline-none" />
                          </ConfigField>
                          <ConfigField label="发布指令" hint="提示 AI 如何将内容下发给该账号负责员工">
                            <textarea rows={3} value={selected.publishInstruction || ""} onChange={event => updateAccount(selected.id, { publishInstruction: event.target.value })} className="w-full rounded-lg border border-border-default bg-surface px-3 py-2 text-[13px] leading-5 outline-none resize-none" />
                          </ConfigField>
                        </div>
                      </div>"""

# Need to grep exactly what is there. Let's do that first.

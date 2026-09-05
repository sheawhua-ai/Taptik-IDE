import re

with open("src/components/merchant/ExecutionCenter/MaterialBatchReviewWorkbench.tsx", "r") as f:
    code = f.read()

new_render_list = """            ) : (
              <div className="space-y-6">
                <div className="grid gap-3 xl:grid-cols-2">
                  {reviewItems.filter(item => item.asset).map(item => {
                    const draft = decisions[item.key] ?? getInitialDecision(item.subItem, item.asset);
                    const uploaded = item.asset;
                    const selected = selectedKeys.has(item.key);
                    const aiPassed = isTechnicalCheckPassed(uploaded);
                    return (
                      <article
                        key={item.key}
                        className={`rounded-xl border bg-surface-1 p-3 transition-colors ${selected ? 'border-neutral-900 ring-1 ring-neutral-900' : draft.decision === '已通过' ? 'border-emerald-200 ring-1 ring-emerald-100' : 'border-border-default hover:border-border-strong'}`}
                        style={{ contentVisibility: 'auto', containIntrinsicSize: '190px' }}
                      >
                        <div className="flex gap-3">
                          <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-lg bg-surface-subtle">
                            {uploaded ? (
                              <button type="button" onClick={() => setPreviewItemKey(item.key)} aria-label={`预览${item.subItem.requirement}`} className="group h-full w-full">
                                <img src={uploaded.url} alt={item.subItem.requirement} className="h-full w-full object-cover" />
                                <span className="absolute bottom-2 right-2 flex h-6 w-6 items-center justify-center rounded-md bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"><Eye size={12} /></span>
                              </button>
                            ) : null}
                            {uploaded ? (
                              <button
                                type="button"
                                onClick={() => toggleSelected(item.key)}
                                aria-label={`${selected ? '取消选择' : '选择'}${item.subItem.requirement}${item.assetIndex > 0 ? `第${item.assetIndex + 1}张` : ''}`}
                                aria-pressed={selected}
                                className={`absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-md border shadow-sm ${selected ? 'border-neutral-950 bg-neutral-950 text-white' : 'border-white bg-white/95 text-transparent hover:text-text-tertiary'}`}
                              ><Check size={13} /></button>
                            ) : null}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className={`rounded-md px-2 py-1 text-[13px] ${uploaded ? aiPassed ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800' : 'bg-surface-subtle text-text-tertiary'}`}>{uploaded ? aiPassed ? '技术预检通过' : '技术预检异常' : '必拍素材待回传'}</span>
                              {item.assetIndex > 0 ? <span className="text-[12px] text-text-tertiary">第 {item.assetIndex + 1} 张</span> : null}
                              <span className="ml-auto text-[13px] text-text-tertiary">{uploaded?.resolution || '待回传'}</span>
                            </div>
                            <h3 className="mt-2 line-clamp-2 text-[13px] font-semibold leading-5 text-text-main">{item.subItem.requirement}</h3>
                            <details className="mt-1 text-[13px] text-text-tertiary">
                              <summary className="cursor-pointer select-none">预检详情</summary>
                              <p className="mt-1 leading-4">{item.subItem.autoCheckResult}</p>
                            </details>
                            {uploaded ? (
                              <div className="mt-2 flex flex-wrap gap-2">
                                <button
                                  type="button"
                                  aria-pressed={draft.decision === '已通过'}
                                  aria-label={draft.decision === '已通过' ? `取消验收通过：${item.subItem.requirement}` : `验收通过：${item.subItem.requirement}`}
                                  onClick={() => toggleAccepted(item.key)}
                                  className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[13px] font-medium ${draft.decision === '已通过' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' : 'border border-border-default text-text-secondary'}`}
                                >{draft.decision === '已通过' ? <><CheckCircle2 size={12} />已通过 <span className="ml-1 text-emerald-600/70">取消</span></> : '验收通过'}</button>
                                <button type="button" onClick={() => openSingleReshoot(item.key)} className={`rounded-lg px-2.5 py-1.5 text-[13px] font-medium ${draft.decision === '需补拍' ? 'bg-rose-50 text-rose-700 ring-1 ring-rose-200' : 'border border-border-default text-text-secondary'}`}>要求重拍</button>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
                
                {reviewItems.some(item => !item.asset) && (
                  <div className="mx-auto max-w-2xl rounded-2xl border border-border-default bg-surface-1 p-6 shadow-sm">
                    <div className="flex items-start gap-4">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                        <Clock3 size={20} />
                      </span>
                      <div>
                        <h3 className="text-[16px] font-semibold text-text-main">未完成的素材指令</h3>
                        <p className="mt-1 text-[13px] leading-6 text-text-secondary">以下要求尚未收到回传素材，可以催促执行人补充。</p>
                      </div>
                    </div>
                    <div className="mt-5 space-y-2">
                      {reviewItems.filter(item => !item.asset).map((item, index) => (
                        <div key={item.key} className="flex gap-3 rounded-xl bg-surface-subtle p-3 text-[13px]">
                          <span className="text-text-tertiary">{index + 1}</span>
                          <span className="flex-1 text-text-main">{item.subItem.requirement}</span>
                          <span className="shrink-0 text-text-tertiary">待回传</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-5 flex justify-end border-t border-border-default pt-4">
                      <button type="button" onClick={remindExecutor} className="flex items-center gap-1.5 rounded-lg bg-neutral-950 px-4 py-2 text-[13px] font-semibold text-white">
                        <BellRing size={13} />催促补充
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}"""

code = re.sub(r'            \) : <div className="grid gap-3 xl:grid-cols-2">.*?            \)}', new_render_list, code, flags=re.DOTALL)

with open("src/components/merchant/ExecutionCenter/MaterialBatchReviewWorkbench.tsx", "w") as f:
    f.write(code)

print("Updated review list")

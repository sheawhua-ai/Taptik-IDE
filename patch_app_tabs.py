import re

with open("src/App.tsx", "r") as f:
    code = f.read()

old_right = '''              {canOpenLaunchGuide && workflowTab === "projects" ? (
                <button
                  type="button"
                  onClick={() => {
                    setWorkflowTab("projects");
                    setLaunchGuidePreviewMerchantId(activeProjectId);
                  }}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[13px] font-medium transition-colors ${
                    hasIndustryLaunchGuide
                      ? "border-neutral-900 bg-neutral-900 text-white"
                      : "border-border-default bg-surface-1 text-text-secondary hover:bg-hover-bg hover:text-text-main"
                  }`}
                >
                  <BookOpen size={14} />首轮起盘指南
                </button>
              ) : null}
            </div>'''

new_right = '''              <div className="flex items-center gap-3">
                {canOpenLaunchGuide && workflowTab === "projects" ? (
                  <button
                    type="button"
                    onClick={() => {
                      setWorkflowTab("projects");
                      setLaunchGuidePreviewMerchantId(activeProjectId);
                    }}
                    className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[13px] font-medium transition-colors ${
                      hasIndustryLaunchGuide
                        ? "border-neutral-900 bg-neutral-900 text-white"
                        : "border-border-default bg-surface-1 text-text-secondary hover:bg-hover-bg hover:text-text-main"
                    }`}
                  >
                    <BookOpen size={14} />首轮起盘指南
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => setIsMerchantProfileOpen(true)}
                  className="p-1.5 rounded-lg text-text-tertiary hover:text-text-main hover:bg-surface-hover transition-colors flex items-center gap-1"
                  title="商家画像"
                >
                  <FileUser size={16} />
                  <span className="text-[13px]">商家画像</span>
                </button>
              </div>
            </div>'''

code = code.replace(old_right, new_right)

with open("src/App.tsx", "w") as f:
    f.write(code)

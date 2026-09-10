import re

with open("src/components/merchant/AccountAssetsV2.tsx", "r") as f:
    code = f.read()

old_header = '''      <div className="border-b border-border-default bg-surface px-6 pt-4">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setViewMode("accounts")}
                  className={`text-[20px] font-semibold transition-colors ${viewMode === "accounts" ? "text-text-primary" : "text-text-tertiary hover:text-text-secondary"}`}
                >
                  账号资产
                </button>
                <button
                  onClick={() => setViewMode("employees")}
                  className={`text-[20px] font-semibold transition-colors ${viewMode === "employees" ? "text-text-primary" : "text-text-tertiary hover:text-text-secondary"}`}
                >
                  商家员工
                </button>
              </div>
              
            </div>
            
          </div>
          {viewMode === "accounts" ? (
            <button onClick={() => { setAuthorizationStep("login"); setShowAddModal(true); }} className="flex items-center gap-1.5 rounded-lg bg-action-primary px-3.5 py-2 text-[13px] font-semibold text-white hover:bg-action-primary-hover">
              <Plus size={15} />加入账号
            </button>
          ) : (
            <button onClick={() => setAddEmployeeTrigger(prev => prev + 1)} className="flex items-center gap-1.5 rounded-lg bg-action-primary px-3.5 py-2 text-[13px] font-semibold text-white hover:bg-action-primary-hover">
              <Plus size={15} />添加员工
            </button>
          )}
        </div>
        
      </div>'''

new_header = '''      <div className="border-b border-border-default bg-surface-1 px-6 py-2.5 flex items-center justify-between shrink-0">
        <nav className="flex items-center gap-0.5 rounded-lg bg-surface-subtle p-0.5" aria-label="资产类型">
          <button
            onClick={() => setViewMode("accounts")}
            className={`rounded-md px-2.5 py-1.5 text-[13px] font-medium transition-colors ${viewMode === "accounts" ? 'bg-neutral-950 text-white shadow-sm' : 'text-text-secondary hover:bg-surface-1 hover:text-text-main'}`}
          >
            账号资产
          </button>
          <button
            onClick={() => setViewMode("employees")}
            className={`rounded-md px-2.5 py-1.5 text-[13px] font-medium transition-colors ${viewMode === "employees" ? 'bg-neutral-950 text-white shadow-sm' : 'text-text-secondary hover:bg-surface-1 hover:text-text-main'}`}
          >
            商家员工
          </button>
        </nav>
        {viewMode === "accounts" ? (
          <button onClick={() => { setAuthorizationStep("login"); setShowAddModal(true); }} className="flex items-center gap-1.5 rounded-lg bg-action-primary px-3.5 py-1.5 text-[13px] font-semibold text-white hover:bg-action-primary-hover">
            <Plus size={15} />加入账号
          </button>
        ) : (
          <button onClick={() => setAddEmployeeTrigger(prev => prev + 1)} className="flex items-center gap-1.5 rounded-lg bg-action-primary px-3.5 py-1.5 text-[13px] font-semibold text-white hover:bg-action-primary-hover">
            <Plus size={15} />添加员工
          </button>
        )}
      </div>'''

if old_header in code:
    code = code.replace(old_header, new_header)

with open("src/components/merchant/AccountAssetsV2.tsx", "w") as f:
    f.write(code)

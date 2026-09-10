import re
with open("src/components/merchant/ReviewCenter/ReviewTaskList.tsx", "r") as f:
    code = f.read()

# Replace the filters section
old_filters = '''        {/* Status Filter Pills */}
        <div className="flex gap-1 pt-0.5">
          {["全部", "分析中", "已完成", "数据不足"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              title={st === "数据不足" ? "关键数据缺失或授权中断，无法形成可靠结论时认定" : undefined}
              className={`px-2 py-1 text-[13px] rounded-md font-medium transition-colors ${
                statusFilter === st
                  ? "bg-btn-main text-white"
                  : "bg-surface-subtle text-text-secondary hover:bg-hover-bg border border-border-default"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Scope Filter Sub-row */}
        <div className="flex items-center justify-between text-[13px] text-text-tertiary pt-0.5">
          <div className="flex gap-1.5">
            {["全部范围", "单方案", "多方案"].map((sc) => {
              const active = (sc === "全部范围" && scopeFilter === "全部") || scopeFilter === sc;
              return (
                <button
                  key={sc}
                  onClick={() => setScopeFilter(sc === "全部范围" ? "全部" : sc)}
                  className={`hover:text-text-main transition-colors ${active ? "text-text-main font-semibold underline underline-offset-4" : "text-text-tertiary"}`}
                >
                  {sc}
                </button>
              );
            })}
          </div>
          <span className="text-[13px] text-text-disabled">共 {filteredTasks.length} 项</span>
        </div>'''

new_filters = '''        {/* Filters */}
        <div className="flex flex-col gap-2 pt-0.5">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex gap-1">
              {["全部", "分析中", "已完成"].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2 py-1 text-[13px] rounded-md font-medium transition-colors ${
                    statusFilter === st
                      ? "bg-btn-main text-white"
                      : "bg-surface-subtle text-text-secondary hover:bg-hover-bg border border-border-default"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
            
            <div className="w-px h-4 bg-border-default mx-1"></div>
            
            <select 
              value={scopeFilter}
              onChange={(e) => setScopeFilter(e.target.value)}
              className="bg-transparent text-[13px] text-text-secondary hover:text-text-main font-medium outline-none cursor-pointer"
            >
              <option value="全部">全部范围</option>
              <option value="单方案">单方案</option>
              <option value="多方案">多方案</option>
            </select>
          </div>
          <div className="text-[12px] text-text-tertiary text-right">共 {filteredTasks.length} 项</div>
        </div>'''

code = code.replace(old_filters, new_filters)

with open("src/components/merchant/ReviewCenter/ReviewTaskList.tsx", "w") as f:
    f.write(code)

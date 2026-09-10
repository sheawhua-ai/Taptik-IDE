import re

with open("src/components/merchant/AccountAssetsV2.tsx", "r") as f:
    code = f.read()

# Add addEmployeeTrigger state
code = code.replace(
    'const [viewMode, setViewMode] = useState<"accounts" | "employees">("accounts");',
    'const [viewMode, setViewMode] = useState<"accounts" | "employees">("accounts");\n  const [addEmployeeTrigger, setAddEmployeeTrigger] = useState(0);'
)

# Pass it to EmployeeManagement
code = code.replace(
    '<EmployeeManagement />',
    '<EmployeeManagement addTrigger={addEmployeeTrigger} />'
)

# Update header buttons
old_header_btns = '''          {viewMode === "accounts" && (
            <button onClick={() => { setAuthorizationStep("login"); setShowAddModal(true); }} className="flex items-center gap-1.5 rounded-lg bg-action-primary px-3.5 py-2 text-[13px] font-semibold text-white hover:bg-action-primary-hover">
              <Plus size={15} />加入账号
            </button>
          )}'''

new_header_btns = '''          {viewMode === "accounts" ? (
            <button onClick={() => { setAuthorizationStep("login"); setShowAddModal(true); }} className="flex items-center gap-1.5 rounded-lg bg-action-primary px-3.5 py-2 text-[13px] font-semibold text-white hover:bg-action-primary-hover">
              <Plus size={15} />加入账号
            </button>
          ) : (
            <button onClick={() => setAddEmployeeTrigger(prev => prev + 1)} className="flex items-center gap-1.5 rounded-lg bg-action-primary px-3.5 py-2 text-[13px] font-semibold text-white hover:bg-action-primary-hover">
              <Plus size={15} />添加员工
            </button>
          )}'''

code = code.replace(old_header_btns, new_header_btns)

with open("src/components/merchant/AccountAssetsV2.tsx", "w") as f:
    f.write(code)

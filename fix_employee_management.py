import re

with open("src/components/merchant/EmployeeManagement.tsx", "r") as f:
    code = f.read()

# Replace showQrModal with bindingEmployee
code = code.replace("const [showQrModal, setShowQrModal] = useState(false);", """const [bindingEmployee, setBindingEmployee] = useState<Employee | null>(null);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://tap.taptik.cn/employee-bind?token=b1b15aeb086a49ef8f61c`);
    setCopyFeedback("链接已复制");
    setTimeout(() => setCopyFeedback(null), 2000);
  };""")

# Remove QR Code button
qr_button_regex = r'<button\s*onClick=\{\(\) => setShowQrModal\(true\)\}.*?</button>'
code = re.sub(qr_button_regex, '', code, flags=re.DOTALL)

# Add Generate Link button for unbound employees
# The original code has:
# <div className="mt-auto pt-4 border-t border-border-default flex items-center justify-between">
#   <div className="flex items-center gap-1.5">
#     ...
#   </div>
#   {emp.bindDate && (
#     <span className="text-[11px] text-text-tertiary">绑定于 {emp.bindDate}</span>
#   )}
# </div>

footer_pattern = r'<div className="mt-auto pt-4 border-t border-border-default flex items-center justify-between">\s*<div className="flex items-center gap-1.5">.*?</div>\s*(\{emp\.bindDate && \(\s*<span.*?</span>\s*\)\})\s*</div>'

def replace_footer(match):
    original = match.group(0)
    return """<div className="mt-auto pt-4 border-t border-border-default flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {emp.status === "已绑定" ? (
                    <CheckCircle2 size={14} className="text-green-500" />
                  ) : (
                    <AlertTriangle size={14} className="text-orange-400" />
                  )}
                  <span className={`text-[12px] ${emp.status === "已绑定" ? "text-green-600" : "text-orange-500"}`}>
                    {emp.status}
                  </span>
                </div>
                {emp.status === "未绑定" ? (
                  <button onClick={() => setBindingEmployee(emp)} className="text-[12px] font-medium text-action-primary hover:text-action-primary-hover">
                    发送绑定链接
                  </button>
                ) : (
                  emp.bindDate && <span className="text-[11px] text-text-tertiary">绑定于 {emp.bindDate}</span>
                )}
              </div>"""

code = re.sub(footer_pattern, replace_footer, code, flags=re.DOTALL)

# Replace QR Modal with Link Modal
qr_modal_regex = r'\{\/\* QR Code Modal \*\/\}.*?\{showQrModal && \(.*?\}\)'
link_modal = """{/* Binding Link Modal */}
      {bindingEmployee && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setBindingEmployee(null)}>
          <div className="w-[480px] rounded-2xl bg-surface-1 shadow-2xl animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-border-default px-6 py-4">
              <h2 className="text-[16px] font-semibold text-text-main">员工微信绑定链接</h2>
              <button onClick={() => setBindingEmployee(null)} className="p-1.5 text-text-tertiary hover:bg-hover-bg rounded-lg">
                <X size={17} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-[13px] text-text-tertiary mb-5">
                将链接发给员工，在微信中打开并授权。
              </p>
              
              <div className="mb-5 flex items-start gap-2 rounded-xl bg-surface-subtle p-3">
                <MessageSquare size={16} className="mt-0.5 shrink-0 text-text-secondary" />
                <p className="text-[13px] text-text-secondary">每次重新生成都会使之前的链接失效，请发送最新链接。</p>
              </div>

              <div className="flex items-center gap-2 mb-6">
                <div className="flex-1 truncate rounded-lg border border-border-default bg-white px-3 py-2.5 text-[13px] font-mono text-text-secondary">
                  https://tap.taptik.cn/employee-bind?token=b1b15aeb086a49ef8f61c
                </div>
                <button
                  onClick={handleCopyLink}
                  className="flex shrink-0 items-center gap-1.5 rounded-lg bg-neutral-900 px-4 py-2.5 text-[13px] font-medium text-white hover:bg-neutral-800"
                >
                  <Copy size={14} />
                  复制
                </button>
              </div>

              <p className="text-[12px] text-text-tertiary">
                绑定成功后，员工可以接收素材任务通知并通过页面上传素材。
              </p>
            </div>
          </div>
        </div>
      )}
      
      {copyFeedback && (
        <div className="fixed bottom-6 left-1/2 z-[110] -translate-x-1/2 rounded-lg bg-neutral-900 px-4 py-2 text-[13px] text-white shadow-lg animate-in slide-in-from-bottom-5">
          {copyFeedback}
        </div>
      )}
"""

code = re.sub(qr_modal_regex, link_modal, code, flags=re.DOTALL)

# Add imports for MessageSquare and Copy if needed
if "MessageSquare" not in code:
    code = code.replace("import { Search, Plus, QrCode, Edit3, X, CheckCircle2, AlertTriangle } from 'lucide-react';", "import { Search, Plus, QrCode, Edit3, X, CheckCircle2, AlertTriangle, MessageSquare, Copy } from 'lucide-react';")


with open("src/components/merchant/EmployeeManagement.tsx", "w") as f:
    f.write(code)

print("EmployeeManagement done")

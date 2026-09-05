with open("src/components/merchant/EmployeeManagement.tsx", "r") as f:
    lines = f.readlines()

# Find "{/* QR Code Modal */}"
start_idx = -1
for i, line in enumerate(lines):
    if "{/* QR Code Modal */}" in line:
        start_idx = i
        break

if start_idx != -1:
    lines = lines[:start_idx]
    
    link_modal = """      {/* Binding Link Modal */}
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
    </div>
  );
}
"""
    lines.append(link_modal)
    
    with open("src/components/merchant/EmployeeManagement.tsx", "w") as f:
        f.writelines(lines)
    print("Fixed.")

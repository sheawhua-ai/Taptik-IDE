import React, { useState } from "react";
import { Plus, Search, Tag, Smartphone, UserRound, CheckCircle2, AlertTriangle, QrCode, X, Edit3, Save, MessageSquare, Copy } from "lucide-react";

export interface Employee {
  id: string;
  name: string;
  phone: string;
  status: "未绑定" | "已绑定";
  tags: string[]; // e.g. "市场部", "店长", "门店导购"
  bindDate?: string;
  avatarUrl: string;
}

const MOCK_EMPLOYEES: Employee[] = [
  {
    id: "emp-1",
    name: "李静",
    phone: "13800000001",
    status: "已绑定",
    tags: ["市场部", "主理人"],
    bindDate: "2026-08-01",
    avatarUrl: "https://i.pravatar.cc/150?u=emp1",
  },
  {
    id: "emp-2",
    name: "王强",
    phone: "13900000002",
    status: "已绑定",
    tags: ["陆家嘴店", "店长"],
    bindDate: "2026-08-15",
    avatarUrl: "https://i.pravatar.cc/150?u=emp2",
  },
  {
    id: "emp-3",
    name: "赵美丽",
    phone: "13700000003",
    status: "未绑定",
    tags: ["新天地店", "导购"],
    avatarUrl: "https://i.pravatar.cc/150?u=emp3",
  },
];

export function EmployeeManagement() {
  const [employees, setEmployees] = useState<Employee[]>(MOCK_EMPLOYEES);
  const [search, setSearch] = useState("");
  const [bindingEmployee, setBindingEmployee] = useState<Employee | null>(null);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://tap.taptik.cn/employee-bind?token=b1b15aeb086a49ef8f61c`);
    setCopyFeedback("链接已复制");
    setTimeout(() => setCopyFeedback(null), 2000);
  };
  const [selectedEmpForEdit, setSelectedEmpForEdit] = useState<Employee | null>(null);

  // Edit states
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editTags, setEditTags] = useState("");

  const filtered = employees.filter((emp) =>
    emp.name.includes(search) || emp.phone.includes(search) || emp.tags.some(t => t.includes(search))
  );

  const handleOpenEdit = (emp: Employee) => {
    setSelectedEmpForEdit(emp);
    setEditName(emp.name);
    setEditPhone(emp.phone);
    setEditTags(emp.tags.join("、"));
  };

  const handleSaveEdit = () => {
    if (!selectedEmpForEdit) return;
    const tagsArray = editTags.split(/[,、]/).map(t => t.trim()).filter(Boolean);
    setEmployees(prev => prev.map(e => {
      if (e.id === selectedEmpForEdit.id) {
        return {
          ...e,
          name: editName,
          phone: editPhone,
          tags: tagsArray,
        };
      }
      return e;
    }));
    setSelectedEmpForEdit(null);
  };

  const handleAddEmployee = () => {
    const newEmp: Employee = {
      id: `emp-${Date.now()}`,
      name: "新员工",
      phone: "",
      status: "未绑定",
      tags: [],
      avatarUrl: `https://i.pravatar.cc/150?u=${Date.now()}`,
    };
    setEmployees([newEmp, ...employees]);
    handleOpenEdit(newEmp);
  };

  return (
    <div className="flex flex-col h-full bg-canvas">
      {/* Search and Actions */}
      <div className="flex items-center justify-between py-4 px-6 border-b border-border-default bg-surface">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={16} />
            <input
              type="text"
              placeholder="搜索员工姓名、手机号或标签..."
              className="w-80 pl-9 pr-4 py-2 text-[13px] rounded-lg border border-border-default bg-surface-subtle focus:outline-none focus:border-neutral-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          
          <button
            onClick={handleAddEmployee}
            className="flex items-center gap-1.5 rounded-lg bg-action-primary px-3.5 py-2 text-[13px] font-semibold text-white hover:bg-action-primary-hover"
          >
            <Plus size={15} />
            添加员工
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((emp) => (
            <div key={emp.id} className="rounded-xl border border-border-default bg-surface-1 p-5 flex flex-col hover:border-neutral-300 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <img src={emp.avatarUrl} alt={emp.name} className="w-12 h-12 rounded-full border border-border-default object-cover" />
                  <div>
                    <h3 className="text-[15px] font-semibold text-text-main">{emp.name}</h3>
                    <p className="text-[12px] text-text-tertiary font-mono mt-0.5">{emp.phone || '未填写手机号'}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleOpenEdit(emp)}
                  className="p-1.5 text-text-tertiary hover:text-text-main hover:bg-surface-subtle rounded-md"
                >
                  <Edit3 size={15} />
                </button>
              </div>

              <div className="mb-4">
                {emp.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {emp.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-600 text-[11px] font-medium border border-neutral-200">
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-[12px] text-text-tertiary italic">暂无标签</span>
                )}
              </div>

              <div className="mt-auto pt-4 border-t border-border-default flex items-center justify-between">
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
              </div>
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="py-20 text-center text-text-tertiary text-[14px]">
            未找到相关员工记录
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {selectedEmpForEdit && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-[420px] rounded-2xl bg-surface-1 p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[18px] font-semibold">编辑员工信息</h2>
              <button onClick={() => setSelectedEmpForEdit(null)} className="p-1.5 text-text-tertiary hover:bg-hover-bg rounded-lg">
                <X size={18} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-text-secondary mb-1">员工姓名</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full rounded-xl border border-border-default px-3 py-2 text-[14px] focus:outline-none focus:border-neutral-500"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-text-secondary mb-1">手机号码</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full rounded-xl border border-border-default px-3 py-2 text-[14px] focus:outline-none focus:border-neutral-500"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-text-secondary mb-1">所属标签（用逗号分隔）</label>
                <input
                  type="text"
                  value={editTags}
                  onChange={(e) => setEditTags(e.target.value)}
                  placeholder="例如：市场部,店长"
                  className="w-full rounded-xl border border-border-default px-3 py-2 text-[14px] focus:outline-none focus:border-neutral-500"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button
                onClick={() => setSelectedEmpForEdit(null)}
                className="rounded-xl px-4 py-2 text-[13px] font-medium text-text-secondary hover:bg-hover-bg"
              >
                取消
              </button>
              <button
                onClick={handleSaveEdit}
                className="rounded-xl bg-neutral-900 px-5 py-2 text-[13px] font-medium text-white hover:bg-neutral-800"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Binding Link Modal */}
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

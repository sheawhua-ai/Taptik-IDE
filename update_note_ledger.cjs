const fs = require('fs');

let code = fs.readFileSync('src/components/merchant/ProjectCenter/NoteLedger.tsx', 'utf8');

// 1. Update mock data
code = code.replace(
  "const notes = [\n    { id: \"n1\", pack: \"幼犬换粮体验包 v1\", account: \"小红薯582\", type: \"KOC\", date: \"2024-03-05\", assetStatus: \"已验收\", contentStatus: \"待审核\", publishStatus: \"待下发\", dataStatus: \"-\", error: \"待审核\", pic: \"张三\" },\n    { id: \"n2\", pack: \"幼犬换粮体验包 v1\", account: \"待参与者领取\", type: \"KOC\", date: \"2024-03-06\", assetStatus: \"-\", contentStatus: \"-\", publishStatus: \"-\", dataStatus: \"-\", error: \"\", pic: \"-\" },\n    { id: \"n3\", pack: \"官方宣发包\", account: \"店长号A\", type: \"品牌号\", date: \"2024-03-05\", assetStatus: \"无需\", contentStatus: \"已生成\", publishStatus: \"已发布\", dataStatus: \"观察中\", error: \"\", pic: \"李四\" },\n  ];",
  `const notes = [
    { id: "n1", pack: "消费者体验招募内容包", account: "小红薯_抹茶狗", type: "消费者/KOC", date: "-", status: "照片检查中", assignee: "待填写问卷", error: "", pic: "-", isConsumer: true },
    { id: "n2", pack: "消费者体验招募内容包", account: "待匹配消费者", type: "消费者/KOC", date: "-", status: "待领取", assignee: "等待消费者领取后生成个性化笔记", error: "", pic: "-", isConsumer: true },
    { id: "n3", pack: "官方宣发包", account: "小红书-宠粮精选店长", type: "自有账号", date: "2026-08-15", status: "已完成", assignee: "已生成并发布", error: "", pic: "运营-王强", isConsumer: false },
  ];`
);

// 2. Update Table Headers
code = code.replace(
  `              <tr className="bg-neutral-50 border-b border-neutral-200 text-[12px] text-neutral-500">
                <th className="p-4 font-medium">账号/参与者</th>
                <th className="p-4 font-medium">类型</th>
                <th className="p-4 font-medium">计划日期</th>
                <th className="p-4 font-medium">状态</th>
                <th className="p-4 font-medium">异常</th>
                <th className="p-4 font-medium">负责人</th>
              </tr>`,
  `              <tr className="bg-neutral-50 border-b border-neutral-200 text-[12px] text-neutral-500">
                <th className="p-4 font-medium">内容包名称 / 占位情况</th>
                <th className="p-4 font-medium">类型</th>
                <th className="p-4 font-medium">当前状态</th>
                <th className="p-4 font-medium">当前说明</th>
                <th className="p-4 font-medium">异常/卡点</th>
                <th className="p-4 font-medium">操作</th>
              </tr>`
);

// 3. Update Table Body
code = code.replace(
  `              {notes.map((n, i) => (
                <tr key={i} onClick={() => setActiveNote(n)} className="border-b border-neutral-100 hover:bg-neutral-50 cursor-pointer transition-colors text-[13px]">
                  <td className="p-4">
                    <div className="font-bold text-neutral-900">{n.account}</div>
                    <div className="text-[11px] text-neutral-500 mt-1">{n.pack}</div>
                  </td>
                  <td className="p-4 text-neutral-600">{n.type}</td>
                  <td className="p-4 font-medium">{n.date}</td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="w-12 text-[11px] text-neutral-400">素材</span>
                        <span className={\`text-[11px] px-2 py-0.5 rounded \${n.assetStatus === '已验收' ? 'bg-emerald-100 text-emerald-700' : 'bg-neutral-100 text-neutral-600'}\`}>{n.assetStatus}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-12 text-[11px] text-neutral-400">内容</span>
                        <span className={\`text-[11px] px-2 py-0.5 rounded \${n.contentStatus === '已生成' ? 'bg-emerald-100 text-emerald-700' : n.contentStatus === '待审核' ? 'bg-amber-100 text-amber-700' : 'bg-neutral-100 text-neutral-600'}\`}>{n.contentStatus}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-12 text-[11px] text-neutral-400">发布</span>
                        <span className={\`text-[11px] px-2 py-0.5 rounded \${n.publishStatus === '已发布' ? 'bg-emerald-100 text-emerald-700' : 'bg-neutral-100 text-neutral-600'}\`}>{n.publishStatus}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    {n.error ? <span className="text-red-500 font-bold">{n.error}</span> : <span className="text-neutral-400">-</span>}
                  </td>
                  <td className="p-4 text-neutral-600">{n.pic}</td>
                </tr>
              ))}`,
  `              {notes.map((n, i) => {
                const getStatusStyle = (status) => {
                  if (status === '待领取') return 'bg-neutral-100 text-neutral-600 border border-neutral-200';
                  if (status === '照片检查中' || status === 'AI 生成中' || status === '待确认笔记' || status === '待拍照片') return 'bg-amber-50 text-amber-700 border border-amber-200';
                  if (status === '已完成' || status === '观察中') return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
                  return 'bg-neutral-100 text-neutral-600 border border-neutral-200';
                };
                return (
                <tr key={i} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors text-[13px]">
                  <td className="p-4">
                    <div className="font-bold text-neutral-900">{n.pack}</div>
                    <div className="text-[11.5px] text-neutral-500 mt-1.5 flex items-center gap-1.5">
                      <span className="shrink-0">{n.isConsumer && n.status === '待领取' ? '未关联' : '已领取:'}</span>
                      <span className="font-medium text-neutral-700 truncate max-w-[120px]">{n.account}</span>
                    </div>
                  </td>
                  <td className="p-4 text-neutral-600 font-medium">
                    {n.type}
                  </td>
                  <td className="p-4">
                    <span className={\`px-2.5 py-1 rounded-lg text-[11.5px] font-bold \${getStatusStyle(n.status)}\`}>
                      {n.status}
                    </span>
                  </td>
                  <td className="p-4 text-[12px] text-neutral-600 max-w-[200px]">
                    {n.assignee}
                  </td>
                  <td className="p-4">
                    {n.error ? <span className="text-rose-600 font-bold bg-rose-50 px-2 py-1 rounded border border-rose-200">{n.error}</span> : <span className="text-neutral-400">-</span>}
                  </td>
                  <td className="p-4">
                    <button onClick={() => setActiveNote(n)} className="px-3.5 py-1.5 bg-white border border-neutral-200 rounded-xl text-[12px] font-bold text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 shadow-2xs transition-all">
                      查看要求
                    </button>
                  </td>
                </tr>
              )})}
`
);

fs.writeFileSync('src/components/merchant/ProjectCenter/NoteLedger.tsx', code);
console.log('Update NoteLedger complete!');

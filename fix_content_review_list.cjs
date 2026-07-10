const fs = require('fs');
let code = fs.readFileSync('src/components/rings/ContentReviewWorkbench.tsx', 'utf8');

const leftListOld = `        {/* Left Column: Note List */}
        <div className="w-[300px] bg-white border-r border-neutral-200 flex flex-col shrink-0 overflow-hidden">
          <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
            <h3 className="text-[13px] font-bold text-neutral-900">待审核列表</h3>
            <span className="text-[12px] text-neutral-500">按项目分组</span>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            
            {/* Project Group */}
            <div>
              <div className="flex items-center justify-between text-[13px] font-bold text-neutral-900 mb-2 px-2 cursor-pointer hover:bg-neutral-50 rounded py-1">
                <div className="flex items-center gap-1">
                  <ChevronRight size={14} className="text-neutral-400 rotate-90" />
                  幼犬换粮避坑搜索卡位
                </div>
                <span className="text-neutral-400">8</span>
              </div>
              
              <div className="pl-6 pr-2 space-y-3">
                {/* Account Type Group */}
                <div>
                   <div className="text-[11px] font-bold text-neutral-500 mb-2 mt-1">KOS员工号 (3)</div>
                   <div className="space-y-1.5">
                     {notes.filter(n => n.accountType === 'KOS员工号').map(n => (
                       <div 
                         key={n.id}
                         onClick={() => setActiveNoteId(n.id)}
                         className={\`p-3 rounded-xl border cursor-pointer transition-colors \${
                           activeNoteId === n.id 
                             ? 'bg-primary-50 border-primary-200 shadow-sm' 
                             : 'bg-white border-neutral-100 hover:border-neutral-200 hover:bg-neutral-50'
                         }\`}
                       >
                         <div className="text-[13px] font-bold text-neutral-900 mb-1 truncate">{n.title}</div>
                         <div className="text-[11px] text-neutral-500 mb-2 flex items-center gap-1">
                           <User size={12}/> {n.accountName}
                         </div>
                         <div className="flex items-center gap-2">
                           <span className={\`px-1.5 py-0.5 rounded text-[10px] font-bold border \${n.status === '可确认' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}\`}>
                             {n.status}
                           </span>
                           <span className="text-[11px] text-neutral-500 truncate">{n.mainIssue}</span>
                         </div>
                       </div>
                     ))}
                   </div>
                </div>
                
                {/* Brand Account Group */}
                <div>
                   <div className="text-[11px] font-bold text-neutral-500 mb-2 mt-3">品牌主账号 (2)</div>
                   <div className="space-y-1.5">
                     {notes.filter(n => n.accountType === '品牌主账号').map(n => (
                       <div 
                         key={n.id}
                         onClick={() => setActiveNoteId(n.id)}
                         className={\`p-3 rounded-xl border cursor-pointer transition-colors \${
                           activeNoteId === n.id 
                             ? 'bg-primary-50 border-primary-200 shadow-sm' 
                             : 'bg-white border-neutral-100 hover:border-neutral-200 hover:bg-neutral-50'
                         }\`}
                       >
                         <div className="text-[13px] font-bold text-neutral-900 mb-1 truncate">{n.title}</div>
                         <div className="text-[11px] text-neutral-500 mb-2 flex items-center gap-1">
                           <User size={12}/> {n.accountName}
                         </div>
                         <div className="flex items-center gap-2">
                           <span className={\`px-1.5 py-0.5 rounded text-[10px] font-bold border \${n.status === '可确认' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}\`}>
                             {n.status}
                           </span>
                           <span className="text-[11px] text-neutral-500 truncate">{n.mainIssue}</span>
                         </div>
                       </div>
                     ))}
                   </div>
                </div>
              </div>
            </div>

            {/* Another Project Group Placeholder */}
            <div>
              <div className="flex items-center justify-between text-[13px] font-bold text-neutral-900 mb-2 px-2 cursor-pointer hover:bg-neutral-50 rounded py-1">
                <div className="flex items-center gap-1">
                  <ChevronRight size={14} className="text-neutral-400" />
                  日常种草A组
                </div>
                <span className="text-neutral-400">4</span>
              </div>
            </div>
          </div>
        </div>`;

const leftListNew = `        {/* Left Column: Note List */}
        <div className="w-[300px] bg-white border-r border-neutral-200 flex flex-col shrink-0 overflow-hidden">
          <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
            <h3 className="text-[13px] font-bold text-neutral-900">待审核列表</h3>
            <span className="text-[12px] text-neutral-500">按项目分组</span>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            
            {/* Project Group */}
            <div>
              <div className="flex items-center justify-between text-[13px] font-bold text-neutral-900 mb-2 px-2 cursor-pointer hover:bg-neutral-50 rounded py-1">
                <div className="flex items-center gap-1">
                  <ChevronRight size={14} className="text-neutral-400 rotate-90" />
                  幼犬换粮避坑搜索卡位
                </div>
                <span className="text-neutral-400">{notes.filter(n => !n.isReviewed).length}</span>
              </div>
              
              <div className="pl-6 pr-2 space-y-3">
                {/* Account Type Group */}
                {notes.filter(n => !n.isReviewed && n.accountType === 'KOS员工号').length > 0 && (
                  <div>
                     <div className="text-[11px] font-bold text-neutral-500 mb-2 mt-1">KOS员工号</div>
                     <div className="space-y-1.5">
                       {notes.filter(n => !n.isReviewed && n.accountType === 'KOS员工号').map(n => (
                         <div 
                           key={n.id}
                           onClick={() => setActiveNoteId(n.id)}
                           className={\`p-3 rounded-xl border cursor-pointer transition-colors \${
                             activeNoteId === n.id 
                               ? 'bg-primary-50 border-primary-200 shadow-sm' 
                               : 'bg-white border-neutral-100 hover:border-neutral-200 hover:bg-neutral-50'
                           }\`}
                         >
                           <div className="text-[13px] font-bold text-neutral-900 mb-1 truncate">{n.title}</div>
                           <div className="text-[11px] text-neutral-500 mb-2 flex items-center gap-1">
                             <User size={12}/> {n.accountName}
                           </div>
                           <div className="flex items-center gap-2">
                             <span className={\`px-1.5 py-0.5 rounded text-[10px] font-bold border \${n.status === '可确认' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}\`}>
                               {n.status}
                             </span>
                             <span className="text-[11px] text-neutral-500 truncate">{n.mainIssue}</span>
                           </div>
                         </div>
                       ))}
                     </div>
                  </div>
                )}
                
                {/* Brand Account Group */}
                {notes.filter(n => !n.isReviewed && n.accountType === '品牌主账号').length > 0 && (
                  <div>
                     <div className="text-[11px] font-bold text-neutral-500 mb-2 mt-3">品牌主账号</div>
                     <div className="space-y-1.5">
                       {notes.filter(n => !n.isReviewed && n.accountType === '品牌主账号').map(n => (
                         <div 
                           key={n.id}
                           onClick={() => setActiveNoteId(n.id)}
                           className={\`p-3 rounded-xl border cursor-pointer transition-colors \${
                             activeNoteId === n.id 
                               ? 'bg-primary-50 border-primary-200 shadow-sm' 
                               : 'bg-white border-neutral-100 hover:border-neutral-200 hover:bg-neutral-50'
                           }\`}
                         >
                           <div className="text-[13px] font-bold text-neutral-900 mb-1 truncate">{n.title}</div>
                           <div className="text-[11px] text-neutral-500 mb-2 flex items-center gap-1">
                             <User size={12}/> {n.accountName}
                           </div>
                           <div className="flex items-center gap-2">
                             <span className={\`px-1.5 py-0.5 rounded text-[10px] font-bold border \${n.status === '可确认' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}\`}>
                               {n.status}
                             </span>
                             <span className="text-[11px] text-neutral-500 truncate">{n.mainIssue}</span>
                           </div>
                         </div>
                       ))}
                     </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Reviewed Notes Group */}
            {notes.filter(n => n.isReviewed).length > 0 && (
              <div>
                <div onClick={() => setShowReviewed(!showReviewed)} className="flex items-center justify-between text-[13px] font-bold text-neutral-500 mb-2 px-2 cursor-pointer hover:bg-neutral-50 rounded py-1 border-t border-neutral-100 mt-4 pt-4">
                  <div className="flex items-center gap-1">
                    <ChevronRight size={14} className={\`text-neutral-400 transition-transform \${showReviewed ? 'rotate-90' : ''}\`} />
                    已审核 (待发布)
                  </div>
                  <span className="text-neutral-400">{notes.filter(n => n.isReviewed).length}</span>
                </div>
                {showReviewed && (
                  <div className="pl-6 pr-2 space-y-1.5">
                     {notes.filter(n => n.isReviewed).map(n => (
                       <div 
                         key={n.id}
                         onClick={() => setActiveNoteId(n.id)}
                         className={\`p-3 rounded-xl border cursor-pointer transition-colors \${
                           activeNoteId === n.id 
                             ? 'bg-primary-50 border-primary-200 shadow-sm' 
                             : 'bg-white border-neutral-100 hover:border-neutral-200 hover:bg-neutral-50'
                         }\`}
                       >
                         <div className="text-[13px] font-bold text-neutral-900 mb-1 truncate">{n.title}</div>
                         <div className="text-[11px] text-neutral-500 flex items-center gap-1">
                           <User size={12}/> {n.accountName}
                         </div>
                       </div>
                     ))}
                  </div>
                )}
              </div>
            )}
            
          </div>
        </div>`;

code = code.replace(leftListOld, leftListNew);
fs.writeFileSync('src/components/rings/ContentReviewWorkbench.tsx', code);

sed -i '755,781c\
      {showProjectSettings && (\
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">\
          <div className="absolute inset-0 bg-neutral-900/20" onClick={() => setShowProjectSettings(false)} />\
          <div className="relative bg-white rounded-2xl w-full max-w-[560px] shadow-xl overflow-hidden">\
            <div className="p-6 border-b border-[#EAECF0] flex justify-between items-center">\
              <h2 className="text-[16px] font-bold text-[#111827]">项目设置</h2>\
              <button onClick={() => setShowProjectSettings(false)} className="text-neutral-400 hover:text-[#667085]"><X size={18}/></button>\
            </div>\
            <div className="p-6 space-y-6">\
              <div>\
                <label className="block text-[13px] font-bold text-[#111827] mb-2">项目名称</label>\
                <input type="text" defaultValue={currentProject.name} className="w-full px-3 py-2 border border-[#EAECF0] rounded-xl text-[14px]" />\
              </div>\
              <div>\
                <label className="block text-[13px] font-bold text-[#111827] mb-2">项目周期</label>\
                <div className="flex items-center gap-2">\
                  <input type="date" defaultValue={currentProject.startDate} className="flex-1 px-3 py-2 border border-[#EAECF0] rounded-xl text-[14px]" />\
                  <span className="text-neutral-400 text-[13px]">至</span>\
                  <input type="date" defaultValue={currentProject.endDate} className="flex-1 px-3 py-2 border border-[#EAECF0] rounded-xl text-[14px]" />\
                </div>\
              </div>\
              <div>\
                <label className="block text-[13px] font-bold text-[#111827] mb-2">项目状态</label>\
                <select className="w-full px-3 py-2 border border-[#EAECF0] rounded-xl text-[14px] bg-white outline-none">\
                  <option>进行中</option>\
                  <option>准备中</option>\
                  <option>已结束</option>\
                </select>\
              </div>\
              <div>\
                <label className="block text-[13px] font-bold text-[#111827] mb-2">默认观察周期</label>\
                <div className="flex gap-3">\
                  <label className="flex items-center gap-2 cursor-pointer">\
                    <input type="radio" name="obs_period" className="accent-primary-600 w-4 h-4" /> <span className="text-[13px] text-[#111827]">24小时</span>\
                  </label>\
                  <label className="flex items-center gap-2 cursor-pointer">\
                    <input type="radio" name="obs_period" className="accent-primary-600 w-4 h-4" /> <span className="text-[13px] text-[#111827]">3天</span>\
                  </label>\
                  <label className="flex items-center gap-2 cursor-pointer">\
                    <input type="radio" name="obs_period" className="accent-primary-600 w-4 h-4" defaultChecked /> <span className="text-[13px] text-[#111827]">7天</span>\
                  </label>\
                </div>\
                <p className="text-[12px] text-[#667085] mt-2">项目内新建笔记默认使用该观察周期，单篇笔记可以在发布前覆盖。</p>\
              </div>\
              <div className="pt-2 flex justify-end gap-3">\
                <button onClick={() => setShowProjectSettings(false)} className="px-4 py-2 border border-[#EAECF0] bg-white text-[#111827] font-medium text-[13px] rounded-xl hover:bg-neutral-50 transition-colors">取消</button>\
                <button onClick={() => setShowProjectSettings(false)} className="px-4 py-2 bg-primary-600 text-white font-bold text-[13px] rounded-xl hover:bg-primary-700 transition-colors">保存设置</button>\
              </div>\
            </div>\
          </div>\
        </div>\
      )}\
' src/components/merchant/ProjectCenter.tsx

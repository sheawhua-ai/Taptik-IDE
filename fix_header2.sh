sed -i '196,220c\
      {/* RIGHT: Main Content */}\
      <div className="flex-1 flex flex-col min-w-0 bg-[#F7F8FA]">\
        {/* Header */}\
        <div className="bg-white border-b border-[#EAECF0] shrink-0 px-6 py-4 flex items-center justify-between">\
          <div className="flex items-center gap-4">\
            {!isSidebarOpen && (\
              <button \
                onClick={() => setIsSidebarOpen(true)}\
                title="展开项目列表"\
                className="w-8 h-8 flex items-center justify-center border border-[#EAECF0] rounded-xl text-[#667085] hover:text-[#111827] hover:bg-neutral-50 transition-colors"\
              >\
                <PanelLeftOpen size={16} />\
              </button>\
            )}\
            <div>\
              <div className="flex items-center gap-3 mb-1">\
                <h1 className="text-[18px] font-bold text-[#111827]">{currentProject.name}</h1>\
                <span className="text-[12px] text-[#667085] bg-neutral-100 px-2 py-0.5 rounded-md">{currentProject.status}</span>\
                <span className="text-[12px] text-[#667085] flex items-center gap-1.5"><Calendar size={12} /> {currentProject.startDate} 至 {currentProject.endDate}</span>\
              </div>\
              <div className="text-[13px] text-[#667085]">\
                {currentProject.description || "验证真实换粮体验与店长专业解释能否提高有效咨询"}\
              </div>\
            </div>\
          </div>\
' src/components/merchant/ProjectCenter.tsx

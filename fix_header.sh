sed -i '204,218c\
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
' src/components/merchant/ProjectCenter.tsx

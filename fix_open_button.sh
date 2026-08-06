sed -i '123c\
                  <button onClick={() => setIsSidebarOpen(false)} title="收起项目列表" className="w-7 h-7 rounded-xl hover:bg-neutral-100 flex items-center justify-center text-[#667085] ">\
' src/components/merchant/ProjectCenter.tsx

sed -i '205,210c\
            {!isSidebarOpen && (\
              <button \
                onClick={() => setIsSidebarOpen(true)}\
                title="展开项目列表"\
                className="w-8 h-8 flex items-center justify-center border border-[#EAECF0] rounded-xl text-[#667085] hover:text-[#111827] hover:bg-neutral-50 transition-colors"\
              >\
                <PanelLeftOpen size={16} />\
              </button>\
            )}\
' src/components/merchant/ProjectCenter.tsx

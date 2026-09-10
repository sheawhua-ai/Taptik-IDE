import re

def add_hide_and_button(filepath, title_match_str, open_btn_code):
    with open(filepath, "r") as f:
        text = f.read()
    
    text = text.replace('isCollapsible={false}', 'isCollapsible={false} hideWhenClosed={true}')
    text = text.replace(title_match_str, f'{open_btn_code}\n{title_match_str}')
    
    # Check imports
    if 'PanelLeftOpen' not in text:
        text = text.replace('PanelLeftClose,', 'PanelLeftClose, PanelLeftOpen,')
        if 'PanelLeftOpen' not in text:
            text = text.replace('PanelLeftClose', 'PanelLeftClose, PanelLeftOpen')
    
    with open(filepath, "w") as f:
        f.write(text)

# 1. ReviewWorkbench - empty state
with open("src/components/merchant/ReviewCenter/ReviewWorkbench.tsx", "r") as f:
    rw = f.read()
rw = rw.replace('isCollapsible={false}', 'isCollapsible={false} hideWhenClosed={true}')
rw = rw.replace(
    '<h2 className="text-[16px] font-semibold text-text-main">复盘报告</h2>',
    '{!isSidebarOpen && <button onClick={() => setIsSidebarOpen(true)} className="mr-3 p-1.5 rounded-lg text-text-tertiary hover:bg-hover-bg hover:text-text-main transition-colors" title="展开侧边栏"><PanelLeftOpen size={18} /></button>}\n          <h2 className="text-[16px] font-semibold text-text-main">复盘报告</h2>'
)

# 2. ReviewWorkbench - populated state header
# Where is it?

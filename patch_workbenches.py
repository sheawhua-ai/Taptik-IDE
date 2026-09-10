import re

def patch_file(filepath, state_name="isSidebarOpen"):
    with open(filepath, "r") as f:
        text = f.read()
    
    # Add state
    if f"const [{state_name}" not in text:
        text = text.replace(
            "const [queueQuery, setQueueQuery] = useState('');",
            f"const [{state_name}, set{state_name.capitalize()}] = useState(true);\n  const [queueQuery, setQueueQuery] = useState('');"
        )
        text = text.replace(
            "const [searchQuery, setSearchQuery] = useState('');",
            f"const [{state_name}, set{state_name.capitalize()}] = useState(true);\n  const [searchQuery, setSearchQuery] = useState('');"
        )
        
    # Update ResizableSidebar
    text = text.replace(
        '<ResizableSidebar side="left" defaultWidth={320}',
        f'<ResizableSidebar side="left" defaultWidth={{320}} isOpen={{{state_name}}} onOpenChange={{set{state_name.capitalize()}}} isCollapsible={{false}}'
    )
    
    # Replace header to include the button
    # Pattern: <div className="workspace-sidebar-header ... py-3 pl-3 pr-12">\n            <div className="relative">
    # Note: earlier we replaced pr-12 back to p-3 in ReviewTaskList. Here we also need to fix it.
    header_pattern = re.compile(r'<div className="workspace-sidebar-header[^"]*py-3 pl-3 pr-12">\s*<div className="relative">')
    
    def repl(m):
        return f"""<div className="workspace-sidebar-header border-b border-border-default p-3">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">"""
              
    text = re.sub(header_pattern, repl, text)
    
    # Now fix the closing of <div className="relative"> ... </div>
    # We need to add the button after it.
    # It usually ends with `</input>\n            </div>\n          </div>` or similar
    
    # Let's just do a string replacement for the exact search block
    text = text.replace(
        'transition-colors" />\n            </div>\n          </div>',
        f'transition-colors" />\n              </div>\n              <button onClick={{() => set{state_name.capitalize()}(false)}} title="收起侧边栏" className="w-7 h-7 shrink-0 rounded-lg hover:bg-hover-bg flex items-center justify-center text-text-secondary"><PanelLeftClose size={{16}} /></button>\n            </div>\n          </div>'
    )
    
    text = text.replace(
        'transition-colors"\n              />\n            </div>\n          </div>',
        f'transition-colors"\n              />\n              </div>\n              <button onClick={{() => set{state_name.capitalize()}(false)}} title="收起侧边栏" className="w-7 h-7 shrink-0 rounded-lg hover:bg-hover-bg flex items-center justify-center text-text-secondary"><PanelLeftClose size={{16}} /></button>\n            </div>\n          </div>'
    )
    
    with open(filepath, "w") as f:
        f.write(text)

patch_file("src/components/merchant/ExecutionCenter/OperatorTaskWorkbench.tsx")
patch_file("src/components/merchant/ExecutionCenter/MaterialBatchReviewWorkbench.tsx")

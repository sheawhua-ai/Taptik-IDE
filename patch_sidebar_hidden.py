with open("src/components/merchant/ResizableSidebar.tsx", "r") as f:
    text = f.read()

text = text.replace(
    "isCollapsible?: boolean;",
    "isCollapsible?: boolean;\n  hideWhenClosed?: boolean;"
)

text = text.replace(
    "  onOpenChange\n}: ResizableSidebarProps) {",
    "  onOpenChange,\n  hideWhenClosed = false\n}: ResizableSidebarProps) {"
)

text = text.replace(
    "  if (!isOpen) {\n    return (\n      <div className={`shrink-0 flex items-start p-2 ${side === 'left' ? 'border-r' : 'border-l'} ${borderClass} bg-surface`}>",
    "  if (!isOpen) {\n    if (hideWhenClosed) return null;\n    return (\n      <div className={`shrink-0 flex items-start p-2 ${side === 'left' ? 'border-r' : 'border-l'} ${borderClass} bg-surface`}>"
)

with open("src/components/merchant/ResizableSidebar.tsx", "w") as f:
    f.write(text)

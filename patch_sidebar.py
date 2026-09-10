with open("src/components/merchant/ResizableSidebar.tsx", "r") as f:
    text = f.read()

text = text.replace(
    "isCollapsible?: boolean;",
    "isCollapsible?: boolean;\n  isOpen?: boolean;\n  onOpenChange?: (open: boolean) => void;"
)

text = text.replace(
    "  isCollapsible = true\n}: ResizableSidebarProps) {",
    "  isCollapsible = true,\n  isOpen: controlledIsOpen,\n  onOpenChange\n}: ResizableSidebarProps) {"
)

text = text.replace(
    "  const [isOpen, setIsOpen] = useState(true);",
    "  const [internalIsOpen, setInternalIsOpen] = useState(true);\n  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;\n  const setIsOpen = (val: boolean) => {\n    if (controlledIsOpen === undefined) setInternalIsOpen(val);\n    if (onOpenChange) onOpenChange(val);\n  };"
)

with open("src/components/merchant/ResizableSidebar.tsx", "w") as f:
    f.write(text)

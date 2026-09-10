with open("src/components/merchant/ReviewCenter/ReviewWorkbench.tsx", "r") as f:
    text = f.read()

text = text.replace(
    "const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);",
    "const [isSidebarOpen, setIsSidebarOpen] = useState(true);\n  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);"
)

text = text.replace(
    '<ResizableSidebar side="left" defaultWidth={320}>',
    '<ResizableSidebar side="left" defaultWidth={320} isOpen={isSidebarOpen} onOpenChange={setIsSidebarOpen} isCollapsible={false}>'
)

# We need to pass onCloseSidebar={() => setIsSidebarOpen(false)} to ReviewTaskList
text = text.replace(
    'onCloseSidebar={() => {}}',
    'onCloseSidebar={() => setIsSidebarOpen(false)}'
)

# Also we need to add the open button when it's closed! Wait, if ResizableSidebar is closed, 
# it already renders its own open button!
# Let's check ResizableSidebar.tsx:
# if (!isOpen) return <button onClick={() => setIsOpen(true)}>...</button>
# So it DOES render the open button on the left edge automatically!

with open("src/components/merchant/ReviewCenter/ReviewWorkbench.tsx", "w") as f:
    f.write(text)

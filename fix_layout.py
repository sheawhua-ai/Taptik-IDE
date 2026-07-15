import re

with open('src/components/rings/ShootingAndUploadWorkbench.tsx', 'r') as f:
    content = f.read()

replacement = """    <div className="fixed inset-0 z-[100] bg-neutral-100 flex flex-col h-screen overflow-hidden">
      <div className="w-full bg-white h-full flex flex-col shadow-2xl animate-in fade-in duration-300">"""

old_block = r"""    <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-50 flex justify-end">\s*<div className="w-\[1280px\] bg-white h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">"""

content = re.sub(old_block, replacement, content, flags=re.DOTALL)

with open('src/components/rings/ShootingAndUploadWorkbench.tsx', 'w') as f:
    f.write(content)

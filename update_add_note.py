import re

with open("src/components/merchant/ProjectCenter.tsx", "r") as f:
    code = f.read()

pattern_excel = r'\s*<button \s*onClick=\{\(\) => \{ setShowImportSelect\(false\); setShowAddNoteModal\("file"\); \}\}[\s\S]*?<\/button>'
code = re.sub(pattern_excel, '', code)

with open("src/components/merchant/ProjectCenter.tsx", "w") as f:
    f.write(code)

print("Removed excel import from ProjectCenter")

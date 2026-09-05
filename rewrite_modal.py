import re

with open("src/components/merchant/AddSingleNoteModal.tsx", "r") as f:
    code = f.read()

# Add new icons to import
new_icons = "Search, Upload, Bold, Italic, Type, List, ListOrdered, Undo, Redo, ChevronDown, Eye, Minimize2, Trash2"
code = re.sub(r'import \{\n', f'import {{\n  {new_icons},\n', code)

with open("src/components/merchant/AddSingleNoteModal.tsx", "w") as f:
    f.write(code)


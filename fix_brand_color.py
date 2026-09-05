import re

with open("src/components/merchant/AddSingleNoteModal.tsx", "r") as f:
    code = f.read()

code = code.replace('brand-primary-hover', 'brand-strong')
code = code.replace('brand-primary', 'brand-logo')

with open("src/components/merchant/AddSingleNoteModal.tsx", "w") as f:
    f.write(code)


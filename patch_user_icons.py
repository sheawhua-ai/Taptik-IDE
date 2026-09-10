import re

with open("src/App.tsx", "r") as f:
    code = f.read()

# Remove the icons section
code = re.sub(
    r'<div className="hidden xl:flex items-center gap-1 shrink-0">\s*<button\s*className="text-text-tertiary hover:text-text-main p-1\.5 rounded-md relative"\s*onClick=\{\(e\) => \{\s*e\.stopPropagation\(\);\s*\}\}\s*>\s*<div className="absolute top-1\.5 right-1\.5 w-1\.5 h-1\.5 bg-btn-main rounded-full border border-white" />\s*<Bell size=\{16\} />\s*</button>\s*<button\s*className="text-text-tertiary hover:text-text-main p-1\.5 rounded-md"\s*onClick=\{\(e\) => \{\s*e\.stopPropagation\(\);\s*\}\}\s*>\s*<Link2 size=\{16\} />\s*</button>\s*</div>',
    r'',
    code
)

with open("src/App.tsx", "w") as f:
    f.write(code)

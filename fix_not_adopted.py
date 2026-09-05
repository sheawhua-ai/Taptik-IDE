import re

with open("src/components/merchant/ExecutionCenter/MaterialBatchReviewWorkbench.tsx", "r") as f:
    code = f.read()

# Remove line 578: {!item.subItem.isRequired ? <button ...>不采用</button> : null}
code = re.sub(r'(\s*)\{!item\.subItem\.isRequired \? <button[^>]*>.*?不采用<\/button> : null\}', '', code)

# Remove line 595: <span ...>不采用 {counts.unused}</span>
code = re.sub(r'(\s*)<span[^>]*><CircleSlash2[^>]*/>不采用 \{counts\.unused\}</span>', '', code)

# Remove line 643: <div ...>不采用</div></div>
code = re.sub(r'(\s*)<div className="rounded-xl bg-surface-subtle p-3 text-center"><div className="text-\[20px\] font-semibold text-text-main">\{counts\.unused\}<\/div><div className="mt-1 text-\[12px\] text-text-secondary">不采用<\/div><\/div>', '', code)

# Change grid-cols-3 to grid-cols-2 in the parent div
code = re.sub(r'grid-cols-3( gap-2")', r'grid-cols-2\1', code)

with open("src/components/merchant/ExecutionCenter/MaterialBatchReviewWorkbench.tsx", "w") as f:
    f.write(code)

print("Not adopted buttons and text removed")

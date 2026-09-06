import re

with open("src/components/merchant/CreateProject/StructuredPlanCreationFlow.tsx", "r") as f:
    code = f.read()

# Replace the grid wrapper
old_wrapper = '<div className="mx-auto grid max-w-[1320px] gap-5 lg:grid-cols-[minmax(0,1fr)_330px]">'
new_wrapper = '<div className="mx-auto max-w-[800px] gap-5">'
code = code.replace(old_wrapper, new_wrapper)

# Remove aside
# Using regex to remove from <aside> to </aside>
code = re.sub(r'<aside className="space-y-4">[\s\S]*?</aside>', '', code)

with open("src/components/merchant/CreateProject/StructuredPlanCreationFlow.tsx", "w") as f:
    f.write(code)

print("Layout patched")

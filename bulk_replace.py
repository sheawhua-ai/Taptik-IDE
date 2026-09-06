import os
import glob

def replace_in_file(filepath, old_str, new_str):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    if old_str in content:
        content = content.replace(old_str, new_str)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

count = 0
for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith(('.ts', '.tsx', '.json')):
            filepath = os.path.join(root, file)
            if replace_in_file(filepath, '店长号', '员工号'):
                count += 1
            # Also replace 员工号/KOS to just 员工号/KOS if needed but it's covered by 店长号->员工号

print(f"Replaced in {count} files")

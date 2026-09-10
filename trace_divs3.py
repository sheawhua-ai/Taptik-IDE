import re

with open("src/components/merchant/ProjectCenter.tsx", "r") as f:
    text = f.read()

text_clean = re.sub(r'{\s*/\*.*?\*/\s*}', '', text)

stack = []
for i, line in enumerate(text_clean.split("\n")):
    line_num = i + 1
    for m in re.finditer(r'<(/?)div[^>]*>', line):
        is_close = m.group(1) == '/'
        if not is_close:
            stack.append(line_num)
        else:
            if stack:
                start = stack.pop()
                if line_num >= 1135 and line_num <= 1138:
                    print(f"Line {line_num} closing div opened at line {start}")

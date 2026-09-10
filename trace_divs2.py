import re

with open("src/components/merchant/ProjectCenter.tsx", "r") as f:
    text = f.read()

# Remove JSX comments
text = re.sub(r'{\s*/\*.*?\*/\s*}', '', text, flags=re.DOTALL)
lines = text.split("\n")

stack = []
for i, line in enumerate(lines):
    line_num = i + 1
    # find all opening and closing divs
    for m in re.finditer(r'<(/?)div[^>]*>', line):
        is_close = m.group(1) == '/'
        if not is_close:
            stack.append(line_num)
        else:
            if stack:
                start = stack.pop()
                if line_num >= 1132 and line_num <= 1137:
                    print(f"Line {line_num} closing div opened at line {start}")
            else:
                pass

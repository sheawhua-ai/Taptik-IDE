import re

with open("src/components/merchant/ProjectCenter.tsx", "r") as f:
    text = f.read()
lines = text.split("\n")

def check_structure():
    stack = []
    for i, line in enumerate(lines):
        line_num = i + 1
        # skip comments for simplicity, but wait, JSX comments are inline.
        # let's just do a simple regex on the line.
        cleaned = re.sub(r'{\s*/\*.*?\*/\s*}', '', line)
        for m in re.finditer(r'<(/?)div[^>]*>', cleaned):
            is_close = m.group(1) == '/'
            if not is_close:
                stack.append(line_num)
            else:
                if stack:
                    start = stack.pop()
                    if start == 432: # Root div
                        print(f"Root div closed at line {line_num}")
                else:
                    print(f"Extra closing div at line {line_num}")

check_structure()

import re

with open("src/components/merchant/ProjectCenter.tsx", "r") as f:
    text = f.read()

line_starts = [0] + [m.end() for m in re.finditer(r'\n', text)]
def get_line(idx):
    import bisect
    return bisect.bisect_right(line_starts, idx)

def replacer(m):
    return re.sub(r'[^\n]', ' ', m.group(0))

text_clean = re.sub(r'{\s*/\*.*?\*/\s*}', replacer, text)

stack = []
for match in re.finditer(r'<(/?)div[^>]*>', text_clean):
    if match.group(1) == '/':
        if stack:
            stack.pop()
        else:
            print(f"Extra </div> at {get_line(match.start())}")
    else:
        if not match.group(0).endswith('/>'):
            stack.append(get_line(match.start()))

print(f"Unclosed divs: {len(stack)}")
for s in stack:
    print(f"  Line {s}")

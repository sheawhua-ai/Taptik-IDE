import re

with open("src/components/merchant/ProjectCenter.tsx", "r") as f:
    text = f.read()

line_starts = [0] + [m.end() for m in re.finditer(r'\n', text)]

def get_line(idx):
    import bisect
    return bisect.bisect_right(line_starts, idx)

# strip jsx comments by replacing them with same number of spaces/newlines
def replacer(m):
    return re.sub(r'[^\n]', ' ', m.group(0))

text_clean = re.sub(r'{\s*/\*.*?\*/\s*}', replacer, text)

stack = []
tokens = re.finditer(r'<(/?)div[^>]*>', text_clean)
for match in tokens:
    is_close = match.group(1) == '/'
    tag = match.group(0)
    if not is_close:
        if tag.endswith('/>'):
            continue
        stack.append((get_line(match.start()), tag))
    else:
        if stack:
            start = stack.pop()
            l_num = get_line(match.start())
            if l_num >= 1130 and l_num <= 1145:
                print(f"Line {l_num} closes div from line {start[0]}")

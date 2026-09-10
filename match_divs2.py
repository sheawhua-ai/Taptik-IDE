import re

with open("src/components/merchant/ProjectCenter.tsx", "r") as f:
    text = f.read()

# Strip all JSX comments to avoid matching commented divs
text = re.sub(r'{\s*/\*.*?\*/\s*}', '', text, flags=re.DOTALL)

def find_mismatch(text):
    stack = []
    # Find all <div...> and </div> and <AnimatePresence> and <motion.div> and their closing tags
    tokens = re.finditer(r'</?(?:div|AnimatePresence|motion\.div|button|span|h3|h4|h5|p|section)[^>]*>', text)
    
    line_starts = [0] + [m.end() for m in re.finditer(r'\n', text)]
    
    def get_line(idx):
        import bisect
        return bisect.bisect_right(line_starts, idx)

    for match in tokens:
        tag = match.group(0)
        is_close = tag.startswith('</')
        tag_name = tag.split(' ')[0].strip('<>').strip('/').split('\n')[0]
        
        if not is_close:
            # Check if self-closing
            if tag.endswith('/>'):
                continue
            stack.append((tag_name, match.start(), match.end(), match.group(0)))
        else:
            if not stack:
                print(f"Error: unmatched closing tag {tag} at line {get_line(match.start())}")
                # break
            else:
                last_tag = stack.pop()
                if last_tag[0] != tag_name:
                    print(f"Error: expected </{last_tag[0]}> (from line {get_line(last_tag[1])}) but found {tag} at line {get_line(match.start())}")
                    # Don't pop it permanently, put it back and ignore the rogue closing tag
                    stack.append(last_tag)

    print(f"Left in stack: {len(stack)}")
    for item in stack:
        print(f"Unclosed: <{item[0]}> (opened at line {get_line(item[1])})")

find_mismatch(text)

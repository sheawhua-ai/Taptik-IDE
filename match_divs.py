import re

with open("src/components/merchant/ProjectCenter.tsx", "r") as f:
    text = f.read()

# Strip all JSX comments to avoid matching commented divs
text = re.sub(r'{\s*/\*.*?\*/\s*}', '', text, flags=re.DOTALL)

def find_mismatch(text):
    stack = []
    # Find all <div...> and </div> and <AnimatePresence> and <motion.div> and their closing tags
    tokens = re.finditer(r'</?(?:div|AnimatePresence|motion\.div)[^>]*>', text)
    for match in tokens:
        tag = match.group(0)
        is_close = tag.startswith('</')
        tag_name = tag.split(' ')[0].strip('<>').strip('/')
        
        if not is_close:
            # Check if self-closing
            if tag.endswith('/>'):
                continue
            stack.append((tag_name, match.start(), match.end(), match.group(0)))
        else:
            if not stack:
                print(f"Error: unmatched closing tag {tag} at index {match.start()}")
                # break
            else:
                last_tag = stack.pop()
                if last_tag[0] != tag_name:
                    print(f"Error: expected </{last_tag[0]}> but found {tag} at index {match.start()}")
                    # break

    print(f"Left in stack: {len(stack)}")
    for item in stack:
        print(f"Unclosed: {item[3]} at {item[1]}")

find_mismatch(text)

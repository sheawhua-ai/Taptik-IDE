import re

with open("src/components/merchant/ProjectCenter.tsx", "r") as f:
    text = f.read()

def count_tags(text):
    divs_open = len(re.findall(r'<div', text))
    divs_close = len(re.findall(r'</div', text))
    print(f"<div>: {divs_open}, </div>: {divs_close}")
    
    braces_open = text.count('{')
    braces_close = text.count('}')
    print(f"{{: {braces_open}, }}: {braces_close}")
    
    parens_open = text.count('(')
    parens_close = text.count(')')
    print(f"(: {parens_open}, ): {parens_close}")

count_tags(text)

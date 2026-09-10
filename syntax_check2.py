import re

with open("src/components/merchant/ProjectCenter.tsx", "r") as f:
    text = f.read()

def count_tags(text, tag):
    open_tag = len(re.findall(f'<{tag}[^>]*>', text))
    close_tag = len(re.findall(f'</{tag}>', text))
    print(f"<{tag}>: {open_tag}, </{tag}>: {close_tag}")

count_tags(text, "div")
count_tags(text, "span")
count_tags(text, "button")
count_tags(text, "h3")
count_tags(text, "h4")
count_tags(text, "h5")
count_tags(text, "p")

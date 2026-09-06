with open("src/components/merchant/CreateProject/Builders/ContentMethodBuilder.tsx", "r") as f:
    code = f.read()

# I removed the opening div of the text area but not the text area and the closing div.
# We want to remove the text area ENTIRELY as requested.
import re
code = re.sub(r'<textarea[\s\S]*?\/>\n      <\/div>\n', '', code)

with open("src/components/merchant/CreateProject/Builders/ContentMethodBuilder.tsx", "w") as f:
    f.write(code)

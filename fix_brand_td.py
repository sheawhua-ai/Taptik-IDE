import re
with open('src/components/merchant/CreateProjectWorkstation.tsx', 'r') as f:
    content = f.read()

pattern = r'<td className="py-3 pr-4">\s*<select value=\{b\.publishType\}.*?</select>\s*</td>'
content = re.sub(pattern, '', content, flags=re.DOTALL)

with open('src/components/merchant/CreateProjectWorkstation.tsx', 'w') as f:
    f.write(content)

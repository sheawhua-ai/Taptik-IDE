import re
with open('src/components/merchant/CreateProjectWorkstation.tsx', 'r') as f:
    content = f.read()

content = re.sub(r'type="date"([^>]*?)className="w-20', r'type="date"\1className="w-32', content)
content = re.sub(r'type="date"([^>]*?)className="w-24', r'type="date"\1className="w-32', content)

with open('src/components/merchant/CreateProjectWorkstation.tsx', 'w') as f:
    f.write(content)

import re

with open('src/components/merchant/CreateProjectWorkstation.tsx', 'r') as f:
    content = f.read()

# KOS section cleanup
# Replace k.date text input with date input and rename header to 执行时间
content = content.replace('<th className="font-medium pb-2 pr-4">日期</th>', '<th className="font-medium pb-2 pr-4">执行时间</th>')
content = content.replace('<input type="text" value={k.date}', '<input type="date" value={k.date}')

# Clean up messed up KOS td
bad_tds = """                         <td className="py-3 pr-4">
                         </td>
                         <td className="py-3 pr-4">
                         <td className="py-3 pr-4">"""
content = content.replace(bad_tds, '                         <td className="py-3 pr-4">')

# Brand section cleanup
content = content.replace('<th className="font-medium pb-2 pr-4">时间</th>', '<th className="font-medium pb-2 pr-4">执行时间</th>')
content = content.replace('<input type="text" value={b.time}', '<input type="date" value={b.time}')

# Remove 发布方式 from Brand table header
content = content.replace('<th className="font-medium pb-2 pr-4">发布方式</th>', '')

# Remove b.publishType td
brand_td_regex = r'<td className="py-3 pr-4">\s*<select value={b\.publishType}[^>]+>\s*<option>[^<]+</option>\s*<option>[^<]+</option>\s*</select>\s*</td>'
content = re.sub(brand_td_regex, '', content, flags=re.MULTILINE)

with open('src/components/merchant/CreateProjectWorkstation.tsx', 'w') as f:
    f.write(content)

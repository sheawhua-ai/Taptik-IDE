import re

with open("src/components/merchant/ExecutionCenter/mockData.ts", "r") as f:
    code = f.read()

# KOC
code = code.replace("name: '体验官-元气小草莓', claimTime: '2天前 (09-02)'", "name: '体验官-元气小草莓', claimTime: '2天前 (09-02)', wechat: 'koc_strawberry_01'")
code = code.replace("name: '体验官-半糖去冰', claimTime: '3天前 (09-01)'", "name: '体验官-半糖去冰', claimTime: '3天前 (09-01)', wechat: 'half_sugar_02'")

# Employee/Brand
code = code.replace("name: '新媒体-小美', assignedTime: '1天前 (09-03)'", "name: '新媒体-小美', assignedTime: '1天前 (09-03)', wechat: 'xiaomei_work'")
code = code.replace("name: '运营-张三', assignedTime: '2天前 (09-02)'", "name: '运营-张三', assignedTime: '2天前 (09-02)', wechat: 'zhangsan_op'")

# KOS
code = code.replace("name: '静安店李店长', claimTime: '08-28'", "name: '静安店李店长', claimTime: '08-28', wechat: 'store_lee_jingan'")
code = code.replace("name: '环球港店导购-晓红', claimTime: '1天前 (09-03)'", "name: '环球港店导购-晓红', claimTime: '1天前 (09-03)', wechat: 'guide_xiaohong'")


with open("src/components/merchant/ExecutionCenter/mockData.ts", "w") as f:
    f.write(code)

print("Patched mock assignee data")

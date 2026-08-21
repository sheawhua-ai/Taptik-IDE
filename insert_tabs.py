import re

with open('src/components/merchant/ProjectCenter.tsx', 'r') as f:
    content = f.read()

# Insert placeholders for '任务' and '落地页设置' tabs before '分发与数据'
target = r'{activeTab === "分发与数据" && \('

new_tabs = """
            {activeTab === "任务" && (
              <div className="flex items-center justify-center h-64 text-text-tertiary text-[14px]">任务列表开发中...</div>
            )}
            {activeTab === "落地页设置" && (
              <div className="flex items-center justify-center h-64 text-text-tertiary text-[14px]">落地页设置开发中...</div>
            )}

            {activeTab === "分发与数据" && (
"""

content = re.sub(target, new_tabs.strip(), content)

with open('src/components/merchant/ProjectCenter.tsx', 'w') as f:
    f.write(content)

import re

with open("src/components/merchant/ExecutionCenter/TaskDetailView.tsx", "r") as f:
    code = f.read()

# 1. Update confirmation button text
code = code.replace("<span>确认笔记并进入素材待办</span>", "<span>确认笔记</span>")

# 2. Update confirmation text
old_text = "确认定稿将自动锁定文案与素材，并转入<strong>素材待办与发布核销</strong>流转。"
new_text = "确认定稿将自动锁定文案与素材，后续可进行内容分发。"
code = code.replace(old_text, new_text)

# 3. Remove save draft and view next buttons
# Find the div containing the buttons
buttons_pattern = r'        <div className="flex items-center gap-2\.5">\s*<button.*?保存草稿\s*</button>\s*(\{onNextTask && \(\s*<button.*?查看下一项.*?</button>\s*\)\})?\s*</div>'
code = re.sub(buttons_pattern, '', code, flags=re.DOTALL)

with open("src/components/merchant/ExecutionCenter/TaskDetailView.tsx", "w") as f:
    f.write(code)

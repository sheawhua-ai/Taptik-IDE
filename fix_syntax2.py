import re

with open("src/components/merchant/ExecutionCenter/OperatorTaskWorkbench.tsx", "r") as f:
    code = f.read()

# Replace the mangled part between line 55 and line 68
code = re.sub(
    r'return \[\'再次通知执行人\', \'释放额度并重新开放领取\', \'更换执行人\', \'本轮不再继续\'\];\n\}\} className="rounded-lg bg-surface-subtle border border-border-default px-2.5 py-1.5 text-\[13px\]">添加</button>\n          </div>\n        </div>\n      </div>\n      <PrimaryAction\n        label="确认内容并继续"\n        hint="确认后重新检查素材完整度；素材齐全才会进入待发笔记池。"\n        disabled=\{!draftTitle.trim\(\) \|\| !draftBody.trim\(\) \|\| tags.length === 0\}\n        onClick=\{.*?\}\n      />\n    </div>\n  \);',
    r"return ['再次通知执行人', '释放额度并重新开放领取', '更换执行人', '本轮不再继续'];\n}",
    code,
    flags=re.DOTALL
)

with open("src/components/merchant/ExecutionCenter/OperatorTaskWorkbench.tsx", "w") as f:
    f.write(code)

print("Fixed syntax 2")

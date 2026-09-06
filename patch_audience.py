import re

with open("src/components/merchant/CreateProject/Builders/TargetAudienceBuilder.tsx", "r") as f:
    code = f.read()

# Replace the "从知识库快选" block
old_block = """        <div className="flex items-center gap-2 mb-2">
          <Database size={14} className="text-brand-logo" />
          <span className="text-[13px] font-medium text-text-main">从知识库快选 (常客画像)</span>
        </div>"""

new_block = """        {KNOWLEDGE_BASE_AUDIENCES.length === 0 && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[13px] font-medium text-text-secondary">商家知识库人群画像不足</span>
          </div>
        )}"""

code = code.replace(old_block, new_block)

with open("src/components/merchant/CreateProject/Builders/TargetAudienceBuilder.tsx", "w") as f:
    f.write(code)

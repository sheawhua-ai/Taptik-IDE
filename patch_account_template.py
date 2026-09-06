import re

with open("src/components/merchant/AccountAssetsV2.tsx", "r") as f:
    code = f.read()

old_block = """                          <div className="pt-2">
                            <span className="flex items-center justify-between gap-2 text-[13px] font-medium text-text-secondary mb-2">
                              <span>适合的内容模板 (可多选)</span>
                              <span className="font-normal text-text-tertiary">来自商家知识库 - 内容与图文</span>
                            </span>"""

new_block = """                          <div className="pt-3 border-t border-border-default mt-2">
                            <div className="mb-2">
                              <span className="flex items-center justify-between gap-2 text-[13px] font-semibold text-text-main">
                                <span>圈定可用内容模板 (Agent 路由边界)</span>
                                <span className="font-normal text-[12px] text-text-tertiary">来自商家知识库 - 内容与图文</span>
                              </span>
                              <p className="text-[12px] text-text-tertiary mt-1">勾选后，AI 在生成方案和创作内容时，将仅在该账号被允许的模板池内自主决策或供人工下发。</p>
                            </div>"""

code = code.replace(old_block, new_block)

with open("src/components/merchant/AccountAssetsV2.tsx", "w") as f:
    f.write(code)

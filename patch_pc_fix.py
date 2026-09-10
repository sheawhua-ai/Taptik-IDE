import re

with open("src/components/merchant/ProjectCenter.tsx", "r") as f:
    code = f.read()

code = code.replace(
    """      <div className="h-full flex-1 overflow-y-auto bg-page-bg">
        <div className="max-w-[1100px] mx-auto p-6 space-y-5">""",
    """      <div className="h-full flex-1 overflow-y-auto bg-page-bg">
        {currentProject ? (
          <div className="max-w-[1100px] mx-auto p-6 space-y-5">"""
)

with open("src/components/merchant/ProjectCenter.tsx", "w") as f:
    f.write(code)

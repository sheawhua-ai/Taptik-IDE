import re

with open("src/components/merchant/ProjectCenter.tsx", "r") as f:
    code = f.read()

code = code.replace(
    """      {/* ======================================================== */}
      {/* DRAWERS & MODALS                                         */}""",
    """</div></div></div></div></div></div></div></div>
      {/* ======================================================== */}
      {/* DRAWERS & MODALS                                         */}"""
)

with open("src/components/merchant/ProjectCenter.tsx", "w") as f:
    f.write(code)

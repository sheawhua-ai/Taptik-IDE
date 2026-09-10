import re

with open("src/components/merchant/ProjectCenter.tsx", "r") as f:
    code = f.read()

code = code.replace(
    '</div>\n      </div>\n\n      {/* Main View Area */}',
    '</div>\n\n      {/* Main View Area */}'
)

with open("src/components/merchant/ProjectCenter.tsx", "w") as f:
    f.write(code)

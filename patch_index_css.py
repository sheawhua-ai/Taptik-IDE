import re
with open("src/index.css", "r") as f:
    code = f.read()

tokens = """
:root {
  --taptik-type-page-size: 20px;
  --taptik-type-page-line: 28px;
  --taptik-type-section-size: 16px;
  --taptik-type-section-line: 24px;
  --taptik-type-item-size: 14px;
  --taptik-type-item-line: 22px;
  --taptik-type-body-size: 14px;
  --taptik-type-body-line: 22px;
  --taptik-type-ui-size: 13px;
  --taptik-type-ui-line: 20px;
  --taptik-type-meta-size: 12px;
  --taptik-type-meta-line: 18px;
  --taptik-type-caption-size: 11px;
  --taptik-type-caption-line: 16px;
  --taptik-type-code-size: 13px;
  --taptik-type-code-line: 20px;
  
  --taptik-weight-regular: 400;
  --taptik-weight-medium: 500;
  --taptik-weight-semibold: 600;
}
"""

if "--taptik-type-page-size" not in code:
    code = code.replace("@tailwind utilities;", "@tailwind utilities;\n" + tokens)
    with open("src/index.css", "w") as f:
        f.write(code)

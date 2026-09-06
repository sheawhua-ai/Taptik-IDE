import re

with open("src/components/merchant/CreateProject/StructuredPlanCreationFlow.tsx", "r") as f:
    code = f.read()

regex = r'\{\/\* 商家全局画像/核心问题 \*\/.*?<\/div>'
code = re.sub(regex, '', code, flags=re.DOTALL)

# Also remove ContentMethodBuilder as requested in Point 3
code = code.replace("import { ContentMethodBuilder } from './Builders/ContentMethodBuilder';", "")
method_regex = r'<ContentMethodBuilder.*?/>'
code = re.sub(method_regex, '', code, flags=re.DOTALL)

with open("src/components/merchant/CreateProject/StructuredPlanCreationFlow.tsx", "w") as f:
    f.write(code)

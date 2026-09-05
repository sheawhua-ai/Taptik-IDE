import re

with open("src/components/settings/MerchantManagement.tsx", "r") as f:
    code = f.read()

func_pattern = r'const copyFollowLink = async \(\) => \{.*?setCopied\(false\), 2000\);\n\s*\} catch \(err\) \{.*?\n\s*\}\n\s*\};\n'
code = re.sub(func_pattern, '', code, flags=re.DOTALL)

with open("src/components/settings/MerchantManagement.tsx", "w") as f:
    f.write(code)
print("Removed copyFollowLink")

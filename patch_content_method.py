import re

with open("src/components/merchant/CreateProject/Builders/ContentMethodBuilder.tsx", "r") as f:
    code = f.read()

# Remove the textarea section
code = re.sub(r'      <div>\n        <div className="text-\[12px\] text-text-tertiary mb-1\.5 flex justify-between items-center">[\s\S]*?</div>', '', code)

with open("src/components/merchant/CreateProject/Builders/ContentMethodBuilder.tsx", "w") as f:
    f.write(code)

print("Content method textarea removed")

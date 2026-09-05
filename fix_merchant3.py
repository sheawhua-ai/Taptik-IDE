with open("src/components/settings/MerchantManagement.tsx", "r") as f:
    lines = f.readlines()

new_lines = []
in_copy_link = False
for line in lines:
    if "const copyFollowLink = async () => {" in line:
        in_copy_link = True
        continue
    if in_copy_link and "};" in line:
        in_copy_link = False
        continue
    if in_copy_link:
        continue
    new_lines.append(line)

with open("src/components/settings/MerchantManagement.tsx", "w") as f:
    f.writelines(new_lines)
print("done")

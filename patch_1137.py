with open("src/components/merchant/ProjectCenter.tsx", "r") as f:
    lines = f.readlines()

# delete line 1137 (0-indexed 1136)
if "</div>" in lines[1136]:
    del lines[1136]

with open("src/components/merchant/ProjectCenter.tsx", "w") as f:
    f.writelines(lines)

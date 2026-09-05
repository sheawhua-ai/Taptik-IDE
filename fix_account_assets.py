with open("src/components/merchant/AccountAssetsV2.tsx", "r") as f:
    code = f.read()

code = code.replace("员工扫码绑定后", "员工点击链接绑定后")

with open("src/components/merchant/AccountAssetsV2.tsx", "w") as f:
    f.write(code)
print("AccountAssetsV2 updated")

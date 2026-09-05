import re

with open("src/components/settings/MerchantManagement.tsx", "r") as f:
    code = f.read()

code = code.replace("const [qrMerchant, setQrMerchant] = useState<any | null>(null);", "")
code = re.sub(r'\{!\s*isArchived\s*\?\s*<button.*?onClick=\{\(\)\s*=>\s*setQrMerchant.*?员工二维码\s*</button>\s*:\s*null\}', '', code)

# Remove the qrMerchant modal rendering at the bottom
qr_modal_pattern = r'\{qrMerchant \? \(.*?\)\s*:\s*null\}'
code = re.sub(qr_modal_pattern, '', code, flags=re.DOTALL)

with open("src/components/settings/MerchantManagement.tsx", "w") as f:
    f.write(code)

print("MerchantManagement done")

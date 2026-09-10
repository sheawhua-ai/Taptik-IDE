import re

with open("src/App.tsx", "r") as f:
    code = f.read()

# Add import
code = code.replace(
    'import { MerchantMemoryHeader } from "./components/MerchantMemoryHeader";',
    'import { MerchantProfileDrawer } from "./components/merchant/MerchantProfileDrawer";\nimport { FileUser } from "lucide-react";'
)

# Add state
code = code.replace(
    '  const [isMerchantManagementOpen, setIsMerchantManagementOpen] = useState(false);',
    '  const [isMerchantManagementOpen, setIsMerchantManagementOpen] = useState(false);\n  const [isMerchantProfileOpen, setIsMerchantProfileOpen] = useState(false);'
)

# Replace MerchantMemoryHeader with nothing, but add Drawer
old_header = '''            {/* 商家记忆固定区域 */}
            <MerchantMemoryHeader
              hasData={hasData}
              onboardingData={onboardingData}
              activeProjectId={activeProjectId}
              projectName={activeProject?.name || "未知项目"}
              industryLabel={[
                activeIndustryProfile?.primaryName,
                ...(activeIndustryProfile?.secondaryNames || []),
                ...(activeIndustryProfile?.tertiaryNames || []),
              ].filter(Boolean).join(" · ")}
              setWorkflowTab={setWorkflowTab}
            />'''

new_header = '''            <MerchantProfileDrawer
              isOpen={isMerchantProfileOpen}
              onClose={() => setIsMerchantProfileOpen(false)}
              projectName={activeProject?.name || "未知项目"}
              onboardingData={onboardingData}
            />'''

code = code.replace(old_header, new_header)

with open("src/App.tsx", "w") as f:
    f.write(code)

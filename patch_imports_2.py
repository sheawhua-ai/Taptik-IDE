import re

with open("src/components/merchant/CreateProject/StructuredPlanCreationFlow.tsx", "r") as f:
    code = f.read()

code = code.replace("import { Database, TargetAudienceBuilder } from './Builders/TargetAudienceBuilder';", "import { TargetAudienceBuilder } from './Builders/TargetAudienceBuilder';")

# Add Database to the lucide-react block
code = code.replace("  Sparkles,", "  Database,\n  Sparkles,")

with open("src/components/merchant/CreateProject/StructuredPlanCreationFlow.tsx", "w") as f:
    f.write(code)

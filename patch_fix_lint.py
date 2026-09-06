import re

with open("src/components/merchant/CreateProject/StructuredPlanCreationFlow.tsx", "r") as f:
    code = f.read()

# Remove the faulty Database import (if it was added as Database from the Builder)
code = code.replace("import { Database, TargetAudienceBuilder } from './Builders/TargetAudienceBuilder';", "import { TargetAudienceBuilder } from './Builders/TargetAudienceBuilder';")

# Add Database to lucide-react import
if "Database," not in code and "Database" not in code.split("from 'lucide-react'")[0]:
    code = code.replace("import {", "import { Database,", 1)

with open("src/components/merchant/CreateProject/StructuredPlanCreationFlow.tsx", "w") as f:
    f.write(code)

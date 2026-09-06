with open("src/components/merchant/CreateProject/StructuredPlanCreationFlow.tsx", "r") as f:
    code = f.read()

code = code.replace("import React, { useState } from 'react';", "import React, { useState, useEffect } from 'react';")

accounts = """
const AVAILABLE_ACCOUNTS = {
  brand: [
    { id: 'brand_1', name: '品牌官方旗舰店' },
    { id: 'brand_2', name: '福利社' },
    { id: 'brand_3', name: '小助手' },
  ],
  kos: [
    { id: 'kos_1', name: '员工-小李' },
    { id: 'kos_2', name: '员工-王哥' },
    { id: 'kos_3', name: '员工-张姐' },
    { id: 'kos_4', name: '员工-赵赵' },
    { id: 'kos_5', name: '员工-孙二' },
  ]
};
"""

code = code.replace("export interface PlanCreationSettings {", accounts + "\nexport interface PlanCreationSettings {")

with open("src/components/merchant/CreateProject/StructuredPlanCreationFlow.tsx", "w") as f:
    f.write(code)

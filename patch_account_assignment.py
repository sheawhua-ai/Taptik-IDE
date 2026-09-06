import re

with open("src/components/merchant/CreateProject/StructuredPlanCreationFlow.tsx", "r") as f:
    code = f.read()

# Add AVAILABLE_ACCOUNTS and cycleDays hook

code = code.replace("import { BookOpen, Check, Target, Info, Sparkles, AlertCircle, Bot, ArrowRight, Lock } from 'lucide-react';", "import { BookOpen, Check, Target, Info, Sparkles, AlertCircle, Bot, ArrowRight, Lock, Users } from 'lucide-react';\n\nconst AVAILABLE_ACCOUNTS = {\n  brand: [\n    { id: 'brand_1', name: '品牌官方旗舰店' },\n    { id: 'brand_2', name: '福利社' },\n    { id: 'brand_3', name: '小助手' },\n  ],\n  kos: [\n    { id: 'kos_1', name: '员工-小李' },\n    { id: 'kos_2', name: '员工-王哥' },\n    { id: 'kos_3', name: '员工-张姐' },\n    { id: 'kos_4', name: '员工-赵赵' },\n    { id: 'kos_5', name: '员工-孙二' },\n  ]\n};")

with open("src/components/merchant/CreateProject/StructuredPlanCreationFlow.tsx", "w") as f:
    f.write(code)

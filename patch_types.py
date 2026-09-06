with open("src/components/merchant/CreateProject/types.ts", "r") as f:
    code = f.read()

code = code.replace("problemToSolve: string;", "problemToSolve: string;\n    core_problem_structured?: {\n      stage?: string;\n      symptom_tags?: string[];\n      barrier?: string;\n      consequence?: string;\n    };")
code = code.replace("contentLogic: string;", "contentLogic: string;\n    method_cards?: string[];")
code = code.replace("primaryBusinessGoal: string;", "primaryBusinessGoal: string;\n    primary_goal?: string;\n    target_keywords?: string[];\n    undertake_channels?: string[];")

with open("src/components/merchant/CreateProject/types.ts", "w") as f:
    f.write(code)

print("Patched types")

with open("src/components/merchant/CreateProject/StructuredPlanCreationFlow.tsx", "r") as f:
    code = f.read()

code = code.replace("    </div>\n  );\n}", "      ) : null}\n    </div>\n  );\n}")

with open("src/components/merchant/CreateProject/StructuredPlanCreationFlow.tsx", "w") as f:
    f.write(code)

print("Syntax fixed")

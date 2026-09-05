with open("src/components/merchant/ExecutionCenter/OperatorTaskWorkbench.tsx", "r") as f:
    content = f.read()

if "text-rose-800" in content:
    print("Found red alert box")
else:
    print("Red alert box NOT found")

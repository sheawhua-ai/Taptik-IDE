with open("src/components/merchant/ProjectCenter.tsx", "r") as f:
    code = f.read()

code = code.replace("</div></div></div></div></div></div></div></div></div>", "")
code = code.replace("</div></div></div></div></div></div></div></div>", "")

with open("src/components/merchant/ProjectCenter.tsx", "w") as f:
    f.write(code)

with open("src/components/merchant/ReviewCenter/ReviewWorkbench.tsx", "r") as f:
    text = f.read()

text = text.replace(
    '</span></div></div>            <div className="flex items-center gap-2">',
    '</span></div></div>            </div><div className="flex items-center gap-2">'
)

with open("src/components/merchant/ReviewCenter/ReviewWorkbench.tsx", "w") as f:
    f.write(text)

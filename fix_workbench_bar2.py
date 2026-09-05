import re

with open("src/components/Workbench.tsx", "r") as f:
    code = f.read()

# Let's revert the previous wrapper and re-apply correctly.
code = code.replace("{isProcessing && (\n            <>\n", "")
code = code.replace("            </>\n          )}\n        {/* RIGHT PANEL: 智能 Escort Engine or Brand Profile */}", "        {/* RIGHT PANEL: 智能 Escort Engine or Brand Profile */}")

# Now let's find the exact div to wrap.
# The Bottom Agent Workflow Bar starts with {/* === Bottom Agent Workflow Bar === */}
# and ends with the </div> that matches `<div className="shrink-0 border-t border-border-default bg-surface-1 shadow-[0_-8px_30px_rgba(0,0,0,0.04)] relative z-50">`

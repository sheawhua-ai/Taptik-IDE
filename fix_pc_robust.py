with open("src/components/merchant/ProjectCenter.tsx", "r") as f:
    lines = f.readlines()

target_idx = -1
for i, line in enumerate(lines):
    if "{/* DRAWERS & MODALS" in line:
        target_idx = i
        break

# The structure right above it:
# 1167:             )}
# 1168:         </div>
# 1169:       </div>
# 1170: 
# 1171: 
# 1172: 
# 1173:       {/* ======================================================== */}
# 1174:       {/* DRAWERS & MODALS                                         */}
if target_idx != -1:
    # insert `        )}\n` 4 lines above the target_idx (before the closing </div> of the layout)
    # wait, the exact lines:
    # `        </div>`
    # `      </div>`
    # Let's find the `      </div>` that closes the main content shell.
    for i in range(target_idx - 1, -1, -1):
        if "</div>" in lines[i]:
            # we found the last </div> before DRAWERS. This closes the max-w div probably.
            # wait, there are two </div> in a row.
            if "</div>" in lines[i-1]:
                # replace lines[i-1] with `          </div>\n        )}\n`
                lines[i-1] = "          </div>\n        )}\n"
                break

with open("src/components/merchant/ProjectCenter.tsx", "w") as f:
    f.writelines(lines)

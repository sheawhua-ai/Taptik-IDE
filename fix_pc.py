import re

with open("src/components/merchant/ProjectCenter.tsx", "r") as f:
    text = f.read()

# I will find `        )}\n      {/* ======================================================== */}`
# and remove the `        )}\n`
text = text.replace('        )}\n      {/* ======================================================== */}', '      {/* ======================================================== */}')

# Then find where it was supposed to go.
# The content block ends around line 1165.
# Let's search for the end of the `activeTab === "内容与素材"` block or something.
# We know the content block was:
# ```
#                  </div>
#                )}
#              </div>
#            )}
#        </div>
#      </div>
# ```
# Let's look for:
# `              </div>\n            )}\n        </div>\n      </div>\n      {/* ======================================================== */}`
target = """              </div>
            )}
        </div>
      </div>
      {/* ======================================================== */}"""
replacement = """              </div>
            )}
          </div>
        )}
      </div>
      {/* ======================================================== */}"""

text = text.replace(target, replacement)

with open("src/components/merchant/ProjectCenter.tsx", "w") as f:
    f.write(text)

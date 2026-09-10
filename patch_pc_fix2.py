import re

with open("src/components/merchant/ProjectCenter.tsx", "r") as f:
    code = f.read()

# Replace the block of divs
code = code.replace(
    """            )}
          </div>
        </div>
      </div></div></div></div></div></div></div></div></div>
      {/* ======================================================== */}""",
    """            )}
          </div>
        </div>
      {/* ======================================================== */}"""
)

# Also try without the 8 divs if the replace above fails
code = code.replace(
    """            )}
          </div>
        </div>
      </div>
      {/* ======================================================== */}""",
    """            )}
          </div>
        </div>
      {/* ======================================================== */}"""
)

with open("src/components/merchant/ProjectCenter.tsx", "w") as f:
    f.write(code)

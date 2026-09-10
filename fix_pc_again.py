with open("src/components/merchant/ProjectCenter.tsx", "r") as f:
    text = f.read()

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

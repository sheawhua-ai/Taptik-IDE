import re

with open("src/components/material-center/MaterialAssetCardV2.tsx", "r") as f:
    code = f.read()

# Update the render logic:
# if ctr is provided, we can show it instead of just dimensions.
# Or show a block with strategy.

replacement = """
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-1 text-[13px] font-semibold text-text-main">{asset.name}</h3>
            <p className="mt-1 line-clamp-1 text-[13px] text-text-tertiary">{asset.sourceProject ?? asset.sourceLabel}</p>
          </div>
          {ctr && (
            <div className="flex flex-col items-end shrink-0 bg-rose-50 border border-rose-100 rounded-md px-1.5 py-0.5">
              <span className="text-[11px] text-rose-500 font-medium">封面点击率</span>
              <span className="text-[13px] text-rose-600 font-bold">{ctr}</span>
            </div>
          )}
        </div>

        {optimizationStrategy ? (
          <div className="mt-2 text-[12px] leading-5 text-amber-700 bg-amber-50 rounded-lg p-2 border border-amber-100">
            {optimizationStrategy}
          </div>
        ) : (
          <div className="mt-2 flex min-h-5 items-center gap-1.5 text-[13px] text-text-tertiary">
            <span className="shrink-0">{asset.aspectRatio}</span>
            {primaryTag ? <><span>·</span><span className="truncate">{primaryTag.replace(/^AI · /, '')}</span></> : null}
          </div>
        )}
      </div>
    </article>
"""

# Replace from `<div className="p-3">` to `</article>`
pattern = r'      <div className="p-3">.*?<\/article>'
code = re.sub(pattern, replacement, code, flags=re.DOTALL)

# Let's fix the prop addition we made earlier.
# Wait, let's just make sure it's valid.

with open("src/components/material-center/MaterialAssetCardV2.tsx", "w") as f:
    f.write(code)

print("Updated MaterialAssetCardV2")

import re

with open("src/components/material-center/MaterialCenterV2.tsx", "r") as f:
    code = f.read()

# Replace OPTIMIZATION_HINTS
new_hints = """
const CTR_OPTIMIZATION_HINTS: Record<string, { ctr: string, strategy: string }> = {
  'MAT-2026-002': { ctr: '1.2%', strategy: '光线偏暖但对比度不足，点击率偏低。AI建议：提高主体对比度，并增加顶部安全区以适配更多排版。' },
  'MAT-2026-005': { ctr: '0.8%', strategy: '内容信息密集导致视觉杂乱，点击率极低。AI建议：裁切为3:4突出核心主体，去除周围多余干扰元素。' }
};
"""

code = re.sub(r'const OPTIMIZATION_HINTS: Record<string, string> = \{.*?^\};', new_hints, code, flags=re.DOTALL|re.MULTILINE)

# Update references to OPTIMIZATION_HINTS
code = code.replace('Object.keys(OPTIMIZATION_HINTS)', 'Object.keys(CTR_OPTIMIZATION_HINTS)')
code = code.replace('OPTIMIZATION_HINTS[asset.id]', 'CTR_OPTIMIZATION_HINTS[asset.id]?.strategy')

# Add ctr and optimizationStrategy props to MaterialAssetCardV2
card_pattern = r'<MaterialAssetCardV2([\s\S]*?onOpenDetail=\{setSelectedAssetForDetail\})'
new_card = r'<MaterialAssetCardV2\1\n                  ctr={CTR_OPTIMIZATION_HINTS[asset.id]?.ctr}\n                  optimizationStrategy={activeView === "optimize" ? CTR_OPTIMIZATION_HINTS[asset.id]?.strategy : undefined}'
code = re.sub(card_pattern, new_card, code)

# Update VIEW_CONFIG to include backup
view_config_pattern = r'const VIEW_CONFIG: Array<\{ id: Extract<CenterView, .*?>; label: string \}> = \[\n  \{ id: \'available\', label: \'可用素材\' \},\n  \{ id: \'reserved\', label: \'已占用\' \},\n  \{ id: \'optimize\', label: \'待优化\' \}\n\];'
new_view_config = """
const VIEW_CONFIG: Array<{ id: Extract<CenterView, 'available' | 'reserved' | 'optimize' | 'backup'>; label: string }> = [
  { id: 'available', label: '可用素材' },
  { id: 'backup', label: '备选素材' },
  { id: 'reserved', label: '已占用' },
  { id: 'optimize', label: '待优化' }
];
"""
code = re.sub(view_config_pattern, new_view_config, code)

# We need to add 'backup' to CenterView type. Wait, the type is exported from MaterialCenterV2.tsx? Let's check.

import re

with open("src/components/merchant/AccountAssetsV2.tsx", "r") as f:
    code = f.read()

# Change CollectionState type
code = re.sub(
    r'type CollectionState = "数据已更新" \| "正在采集" \| "部分数据缺失" \| "采集失败" \| "尚未采集";',
    r'type CollectionState = "数据已获取" | "采集失败";',
    code
)

# Change stateTone
code = re.sub(
    r'const stateTone: Record<CollectionState, string> = \{[^\}]+\};',
    r'''const stateTone: Record<CollectionState, string> = {
  "数据已获取": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "采集失败": "bg-rose-50 text-rose-700 border-rose-200",
};''',
    code
)

# Change mock data states
code = code.replace('"数据已更新"', '"数据已获取"')
code = code.replace('"部分数据缺失"', '"采集失败"')
code = code.replace('"正在采集"', '"数据已获取"')
code = code.replace('"尚未采集"', '"采集失败"')

# Change dropdown
code = code.replace(
    '<option value="all">全部采集状态</option>',
    '<option value="all">数据状态</option>'
)

with open("src/components/merchant/AccountAssetsV2.tsx", "w") as f:
    f.write(code)

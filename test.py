import re

with open("src/components/rings/Strategy.tsx", "r") as f:
    lines = f.readlines()

for i in range(639, 815):
    print(f"{i+1}\t{lines[i].strip()}")

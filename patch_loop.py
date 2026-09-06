import re

with open("src/components/merchant/CreateProject/Builders/TargetAudienceBuilder.tsx", "r") as f:
    code = f.read()

code = code.replace("export function TargetAudienceBuilder({ value, onChange, audienceTags = [], onAudienceTagsChange }: Props) {", "const EMPTY_TAGS: string[] = [];\nexport function TargetAudienceBuilder({ value, onChange, audienceTags = EMPTY_TAGS, onAudienceTagsChange }: Props) {")

with open("src/components/merchant/CreateProject/Builders/TargetAudienceBuilder.tsx", "w") as f:
    f.write(code)

with open("src/components/merchant/CreateProject/Builders/ContentMethodBuilder.tsx", "r") as f:
    code = f.read()

code = code.replace("export function ContentMethodBuilder({ primaryGoal, structuredProblem, value, onChange, methodCards = [], onMethodCardsChange }: Props) {", "const EMPTY_CARDS: string[] = [];\nexport function ContentMethodBuilder({ primaryGoal, structuredProblem, value, onChange, methodCards = EMPTY_CARDS, onMethodCardsChange }: Props) {")

with open("src/components/merchant/CreateProject/Builders/ContentMethodBuilder.tsx", "w") as f:
    f.write(code)

print("Infinite loop patched")

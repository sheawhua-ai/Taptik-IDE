lines = open("debug_review.txt").readlines()

with open("debug_review_part.txt", "w") as f:
    for i in range(275, 360):
        if i < len(lines):
            f.write(f"{i+1}: {lines[i]}")

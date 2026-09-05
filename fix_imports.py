with open("src/components/Workbench.tsx", "r") as f:
    content = f.read()

content = content.replace("} Triangle, Github, Hand, Terminal, Mic, AudioLines, ArrowUp, from 'lucide-react';", ", Triangle, Github, Hand, Terminal, Mic, AudioLines, ArrowUp } from 'lucide-react';")

with open("src/components/Workbench.tsx", "w") as f:
    f.write(content)

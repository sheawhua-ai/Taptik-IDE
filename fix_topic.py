import re

with open("src/components/merchant/AddSingleNoteModal.tsx", "r") as f:
    code = f.read()

code = code.replace("const [body, setBody] = useState('');", "const [body, setBody] = useState('');\n  const [topic, setTopic] = useState('');")
code = code.replace('id="manual-note-topic"\n                    type="text"', 'id="manual-note-topic"\n                    type="text"\n                    value={topic}\n                    onChange={(e) => setTopic(e.target.value)}')

with open("src/components/merchant/AddSingleNoteModal.tsx", "w") as f:
    f.write(code)


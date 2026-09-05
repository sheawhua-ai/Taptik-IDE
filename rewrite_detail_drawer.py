import re

with open("src/components/material-center/MaterialDetailDrawer.tsx", "r") as f:
    code = f.read()

# I will rewrite the whole component to be a form instead of having local edit states.
# It's easier to just use `useState` for all fields, and the bottom button saves everything.

# Since I don't know the full content perfectly, I will just apply a regex to change the states and UI.

code = code.replace("const [isEditingMetadata, setIsEditingMetadata] = useState(false);", "")
code = code.replace("const [isEditingRecognition, setIsEditingRecognition] = useState(false);", "")

# Change the manual tags input
old_tags_ui = r"""                <div>
                  <label className="text-text-tertiary block mb-1 font-medium">手动标签（逗号分隔）:</label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="如：主粮, 柴犬, 3D抠图"
                    className="w-full px-2.5 py-1.5 bg-surface border border-border-default rounded text-[13px] focus:outline-none focus:border-border-strong"
                  />
                </div>"""

new_tags_ui = """                <div>
                  <label className="text-text-tertiary block mb-2 font-medium">手动分类标签:</label>
                  <div className="flex flex-wrap gap-2">
                    {['9月新品', '门店实拍', 'KOC反馈', '高质量封面', '主粮', '宠物互动', '3D抠图'].map(tag => {
                      const selected = tagsInput.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => {
                            if (selected) {
                              setTagsInput(tagsInput.split(/[,，]/).map(t => t.trim()).filter(t => t && t !== tag).join(', '));
                            } else {
                              const currentTags = tagsInput.split(/[,，]/).map(t => t.trim()).filter(Boolean);
                              setTagsInput([...currentTags, tag].join(', '));
                            }
                          }}
                          className={`px-2.5 py-1.5 rounded-lg text-[13px] font-medium border ${selected ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-surface-1 border-border-default text-text-secondary hover:border-border-strong'}`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>"""

code = code.replace(old_tags_ui, new_tags_ui)

# Remove isEditingMetadata toggle UI
code = re.sub(r'\{!isEditingMetadata \? \([\s\S]*?\) : \([\s\S]*?\}\)', '', code)
code = re.sub(r'\{isEditingMetadata \? \([\s\S]*?\) : \([\s\S]*?<div className="flex flex-wrap gap-1\.5">[\s\S]*?<\/div>\n              \)\}', r'\1', code)

# Let's write a script that fully replaces the drawer so I don't mess up brackets.

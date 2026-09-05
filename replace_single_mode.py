import re

with open("src/components/merchant/AddSingleNoteModal.tsx", "r") as f:
    code = f.read()

# Add missing icons
for icon in ['Search', 'Upload', 'Bold', 'Italic', 'Type', 'List', 'ListOrdered', 'Undo', 'Redo', 'ChevronDown', 'Eye', 'Minimize2', 'Trash2']:
    if icon not in code:
        code = re.sub(r'import \{(.*?)\} from \'lucide-react\';', r'import {\1, ' + icon + '} from \'lucide-react\';', code)

# We need to change the header of the modal for `single` mode.
# Right now it's:
# <h2 className="text-[17px] font-bold text-text-main flex items-center gap-2">
#   {mode === "file" ? <FileSpreadsheet size={20} /> : mode === "feishu" ? <Link2 size={20} /> : <Plus size={20} />}
#   {modalCopy.title}
# </h2>
# <p className="text-[13px] text-text-tertiary mt-0.5">
#   {modalCopy.description}
# </p>
#
# But for single, the screenshot has no description and a different layout:
# <div className="text-[13px] text-text-tertiary">内容资产 · Note 1046</div>
# <h2 className="text-[20px] font-bold text-text-main mt-1">编辑笔记</h2>
# And on the right: <button>预览</button> <button>退出全屏</button> <button><X/></button>

# Let's replace the whole modal for single mode. Wait, if it's too different, maybe just change it conditionally inside the modal structure.

# Let's replace the `single` form structure:
# <form id="manual-note-form" onSubmit={handleSingleSubmit} className="grid lg:grid-cols-[minmax(0,1fr)_300px] bg-surface-1 min-h-[520px]">
# ...
# </form>

new_form = """
            <form id="manual-note-form" onSubmit={handleSingleSubmit} className="grid lg:grid-cols-[minmax(0,1fr)_360px] bg-surface-1 min-h-[520px]">
              <section className="p-6 lg:border-r border-border-default space-y-5">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="manual-note-title" className="text-[14px] font-bold text-text-main">
                      笔记标题
                    </label>
                  </div>
                  <input
                    id="manual-note-title"
                    type="text"
                    maxLength={40}
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (titleError) setTitleError('');
                    }}
                    placeholder="未命名笔记"
                    className={`w-full px-4 py-3 border rounded-xl text-[15px] font-medium outline-none bg-surface-1 transition-colors ${titleError ? "border-red-400 focus:border-red-500" : "border-border-default focus:border-neutral-500"}`}
                  />
                  {titleError ? (
                    <p id="manual-note-title-error" className="text-[13px] text-red-600 mt-1.5">{titleError}</p>
                  ) : null}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="manual-note-body" className="text-[14px] font-bold text-text-main">正文内容</label>
                  </div>
                  <div className="border border-border-default rounded-xl overflow-hidden focus-within:border-neutral-500 transition-colors">
                    <div className="flex items-center gap-4 px-4 py-2 border-b border-border-default bg-surface-1 text-text-secondary">
                      <button type="button" className="flex items-center gap-1 text-[13px] hover:text-text-main"><span className="font-medium">正文</span> <ChevronDown size={14}/></button>
                      <button type="button" className="hover:text-text-main"><Bold size={16}/></button>
                      <button type="button" className="hover:text-text-main"><Italic size={16}/></button>
                      <button type="button" className="flex items-center gap-1 hover:text-text-main"><Type size={16}/><ChevronDown size={14}/></button>
                      <button type="button" className="hover:text-text-main"><List size={16}/></button>
                      <button type="button" className="hover:text-text-main"><ListOrdered size={16}/></button>
                      <button type="button" className="hover:text-text-main"><Undo size={16}/></button>
                      <button type="button" className="hover:text-text-main"><Redo size={16}/></button>
                    </div>
                    <textarea
                      id="manual-note-body"
                      rows={12}
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      placeholder={'输入笔记正文，可使用标题、加粗、颜色和列表进行排版...'}
                      className="w-full min-h-[300px] px-4 py-4 text-[14px] leading-7 outline-none bg-surface-1 resize-none"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="manual-note-topic" className="text-[14px] font-bold text-text-main">话题</label>
                  </div>
                  <input
                    id="manual-note-topic"
                    type="text"
                    placeholder="#添加话题"
                    className="w-full px-4 py-3 border border-border-default rounded-xl text-[14px] outline-none focus:border-neutral-500 bg-surface-1 transition-colors"
                  />
                </div>
              </section>

              <aside className="p-4 bg-surface-1">
                <div className="border-[2px] border-brand-primary rounded-lg p-4 h-full flex flex-col relative">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[15px] font-bold text-text-main">笔记配图 <span className="text-brand-primary">0 张</span></h3>
                    <button type="button" className="flex items-center gap-1 text-[13px] text-brand-primary font-medium hover:text-brand-primary-hover transition-colors">
                      <Sparkles size={14} /> 一键配图
                    </button>
                  </div>

                  <div className="flex items-center bg-surface-subtle p-1 rounded-lg mb-4">
                    <button type="button" className="flex-1 py-1.5 text-[13px] font-medium bg-surface-1 text-text-main rounded-md shadow-sm">方案素材</button>
                    <button type="button" className="flex-1 py-1.5 text-[13px] font-medium text-text-secondary hover:text-text-main rounded-md">总素材库</button>
                  </div>

                  <div className="flex items-center gap-2 mb-8">
                    <div className="flex-1 relative">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                      <input type="text" placeholder="按标签搜索" className="w-full pl-9 pr-3 py-1.5 text-[13px] border border-border-default rounded-lg bg-surface-1 outline-none focus:border-neutral-500" />
                    </div>
                    <button type="button" className="flex items-center gap-1.5 text-[13px] text-brand-primary border border-brand-primary/20 bg-brand-primary/5 px-3 py-1.5 rounded-lg whitespace-nowrap">
                      <Upload size={14} /> 上传图片
                    </button>
                  </div>

                  <div className="flex-1 flex items-center justify-center text-[13px] text-text-tertiary pb-10">
                    没有符合条件的图片素材。
                  </div>
                </div>
              </aside>
            </form>
"""

code = re.sub(r'<form id="manual-note-form" onSubmit=\{handleSingleSubmit\} className="grid lg:grid-cols-\[minmax\(0,1fr\)_300px\] bg-surface-1 min-h-\[520px\]">.*?</form>', new_form, code, flags=re.DOTALL)

# Header adjustments
header_pattern = r'\{\/\* Header \*\/\}[\s\S]*?\{\/\* Entry Content \*\/\}'
new_header = """{/* Header */}
        <div className="px-6 py-4 border-b border-border-default flex items-center justify-between shrink-0 bg-surface-1">
          {mode === "single" ? (
            <div>
              <div className="text-[12px] text-text-tertiary mb-1">内容资产 · Note 1046</div>
              <h2 className="text-[20px] font-bold text-text-main">
                编辑笔记
              </h2>
            </div>
          ) : (
            <div>
              <h2 className="text-[17px] font-bold text-text-main flex items-center gap-2">
                {mode === "file" ? <FileSpreadsheet size={20} /> : mode === "feishu" ? <Link2 size={20} /> : <Plus size={20} />}
                {modalCopy.title}
              </h2>
              <p className="text-[13px] text-text-tertiary mt-0.5">
                {modalCopy.description}
              </p>
            </div>
          )}
          
          {mode === "single" ? (
            <div className="flex items-center gap-3">
              <button onClick={onClose} className="flex items-center gap-1.5 px-3 py-1.5 border border-border-default rounded-lg text-[13px] text-text-secondary hover:bg-surface-subtle transition-colors">
                <Eye size={14}/> 预览
              </button>
              <button onClick={onClose} className="flex items-center gap-1.5 px-3 py-1.5 border border-border-default rounded-lg text-[13px] text-text-secondary hover:bg-surface-subtle transition-colors">
                <Minimize2 size={14}/> 退出全屏
              </button>
              <button onClick={onClose} className="p-1.5 text-text-tertiary hover:bg-surface-subtle hover:text-text-main rounded-lg transition-colors">
                <X size={18} />
              </button>
            </div>
          ) : (
            <button onClick={onClose} className="p-2 text-text-tertiary hover:bg-surface-subtle hover:text-text-main rounded-lg transition-colors">
              <X size={20} />
            </button>
          )}
        </div>
        {/* Entry Content */}"""
code = re.sub(header_pattern, new_header, code)

# Footer adjustments for single mode
footer_pattern = r'\{\/\* Footer \*\/\}[\s\S]*?<\/motion\.div>'
new_footer = """{/* Footer */}
        <div className="px-6 py-4 border-t border-border-default flex items-center justify-between bg-surface-1 shrink-0">
          {mode === "single" ? (
            <button type="button" onClick={onClose} className="flex items-center gap-1.5 text-[13px] text-text-tertiary hover:text-red-500 transition-colors">
              <Trash2 size={16}/> 删除笔记
            </button>
          ) : (
            <span className="text-[13px] text-text-tertiary">
              {mode === "file"
                ? "上传后可先确认识别结果，再批量导入。"
                : mode === "feishu"
                ? "连接后可定时同步飞书中的笔记安排。"
                : "保存后，这篇笔记会直接加入当前方案。"}
            </span>
          )}
          
          {mode === "single" ? (
            <div className="flex items-center gap-6">
              <button
                type="button"
                onClick={onClose}
                className="text-[13px] text-text-secondary hover:text-text-main transition-colors"
              >
                取消
              </button>
              <button
                type="submit"
                form="manual-note-form"
                className="flex items-center gap-2 px-5 py-2 bg-brand-primary text-white rounded-lg text-[13px] font-medium hover:bg-brand-primary-hover transition-colors shadow-xs"
              >
                <img src="/icons/xiaohongshu-white.svg" className="w-3.5 h-3.5" alt="" onError={(e) => e.currentTarget.style.display = 'none'} />
                保存笔记
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-border-default rounded-xl text-[13px] font-bold text-text-secondary hover:bg-hover-bg transition-colors"
            >
              关闭
            </button>
          )}
        </div>
      </motion.div>"""
code = re.sub(footer_pattern, new_footer, code)

with open("src/components/merchant/AddSingleNoteModal.tsx", "w") as f:
    f.write(code)

print("AddSingleNoteModal updated")

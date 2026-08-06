sed -i 's/{note.content || "内容正在生成或暂无内容..."}/{note.publishStatus === "已发布" ? (\
                      <div className="text-center py-4">\
                        <div className="w-16 h-16 bg-neutral-100 rounded-xl mx-auto mb-2 flex items-center justify-center">\
                          <Check size={24} className="text-emerald-500" \/>\
                        <\/div>\
                        <div className="text-[#111827] font-bold mb-1">线上快照已存档<\/div>\
                        <a href={note.publishLink || "#"} target="_blank" className="text-primary-600 hover:underline text-[12px]">点击查看小红书原文<\/a>\
                      <\/div>\
                    ) : (note.content || "内容正在生成或暂无内容...")}/g' src/components/merchant/ProjectCenter/NoteDetailDrawer.tsx

const fs = require('fs');
let code = fs.readFileSync('src/components/Workbench.tsx', 'utf-8');

const replacementEnd = `            </div>
          </div>
        ) : null}
        
      </div>
    </div>
  );
};`;

if (!code.includes("activeTabId === 'workbench' ?")) {
  code = code.replace(
    "        {/* === Left Timeline (Conversation History) === */}",
    `        {activeTabId === 'workbench' ? (
          <>
            {/* === Left Timeline (Conversation History) === */}`
  );

  code = code.replace(
    /            <\/div>\n          <\/div>\n        \) : null\}\n      <\/div>\n    <\/div>\n  \);\n\};/,
    `            </div>
          </div>
        ) : null}
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-white text-neutral-400">
            <File size={48} className="mb-4 text-neutral-200" />
            <p className="text-[14px]">
              {openedTabs.find(t => t.id === activeTabId)?.name || '未找到文件'}
            </p>
            <p className="text-[12px] mt-2">（文件预览区域，可接入外部编辑器或表格组件）</p>
          </div>
        )}
      </div>
    </div>
  );
};`
  );

  fs.writeFileSync('src/components/Workbench.tsx', code);
}

const fs = require('fs');
let code = fs.readFileSync('src/components/Workbench.tsx', 'utf-8');

if (!code.includes("activeTabId === 'workbench' ?")) {
  code = code.replace(
    "        {/* === Left Timeline (Conversation History) === */}",
    `        {activeTabId === 'workbench' ? (
          <>
            {/* === Left Timeline (Conversation History) === */}`
  );

  const searchStr = `          </div>
        ) : null}
      </div>
    </div>
  );
};`;
  
  // Use regex to match the end correctly, ignoring whitespace variations
  code = code.replace(
    /        \) : null\}\s*<\/div>\s*<\/div>\s*\);\s*\};/,
    `        ) : null}
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

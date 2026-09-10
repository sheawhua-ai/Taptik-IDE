import re

with open("src/components/merchant/ExecutionCenter/TaskDetailView.tsx", "r") as f:
    code = f.read()

# Wrap Column 3
old_col3 = '''        {/* Column 3: Task-Specific AI Coordination Hub */}
        {isNoteWorkbench ? (
          <ContentAiHub
            task={task}'''

new_col3 = '''        {/* Column 3: Task-Specific AI Coordination Hub */}
        <ResizableSidebar side="right" defaultWidth={320} minWidth={280} maxWidth={500} borderClass="border-border-default">
          <div className="w-full h-full flex flex-col relative overflow-hidden bg-surface">
            {isNoteWorkbench ? (
              <ContentAiHub
                task={task}'''

code = code.replace(old_col3, new_col3)

old_end3 = '''            showToast={showToast}
          />
        )}
      </div>'''

new_end3 = '''            showToast={showToast}
          />
        )}
          </div>
        </ResizableSidebar>
      </div>'''

code = code.replace(old_end3, new_end3)

with open("src/components/merchant/ExecutionCenter/TaskDetailView.tsx", "w") as f:
    f.write(code)

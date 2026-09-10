import re
with open("src/components/merchant/ExecutionCenter/TaskDetailView.tsx", "r") as f:
    code = f.read()

code = code.replace(
    '''        ) : null}

      </div>

      {/* Reshoot Reason Input Modal */}''',
    '''        ) : null}
          </div>
        </ResizableSidebar>
      </div>

      {/* Reshoot Reason Input Modal */}'''
)

with open("src/components/merchant/ExecutionCenter/TaskDetailView.tsx", "w") as f:
    f.write(code)

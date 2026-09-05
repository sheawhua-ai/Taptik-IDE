import re

with open("src/components/merchant/ExecutionCenter/OperatorTaskWorkbench.tsx", "r") as f:
    code = f.read()

# Restore missing renderWorkbench and ManualPublishFlow
missing_components = """
function ManualPublishFlow({ task }: { task: ExecutionTask }) {
  const steps = ['内容就绪', '已通知', '已领取', '待发布', '已回传'];
  const currentIndex = task.returnedData?.publishUrl ? 4 : task.publishStage === '待发布' || task.anomalyType === 'publish_overdue' ? 3 : 2;
  return (
    <div className="mt-3 border-t border-border-default pt-3">
      <div className="flex flex-wrap items-center gap-2 text-[13px]" aria-label="人工发布流程">
        {steps.map((step, index) => (
          <React.Fragment key={step}>
            <span className={index === currentIndex ? 'font-semibold text-text-main' : index < currentIndex ? 'text-emerald-700' : 'text-text-tertiary'}>{step}</span>
            {index < steps.length - 1 ? <span className="h-px w-7 bg-border-strong" /> : null}
          </React.Fragment>
        ))}
      </div>
      <p className="mt-2 text-[13px] text-text-tertiary">系统只负责发送笔记包、提醒、换人、改期和回传核验，不会代替人工发布。</p>
    </div>
  );
}
"""

# Replace renderContentWorkbench with renderWorkbench since that's what it should be
code = code.replace("renderContentWorkbench", "renderWorkbench")

# Insert ManualPublishFlow before the component
code = re.sub(r'export function OperatorTaskWorkbench', missing_components + '\nexport function OperatorTaskWorkbench', code)

with open("src/components/merchant/ExecutionCenter/OperatorTaskWorkbench.tsx", "w") as f:
    f.write(code)

print("Fixed final issues")

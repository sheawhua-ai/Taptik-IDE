import re

with open("src/components/merchant/ExecutionCenter/OperatorTaskWorkbench.tsx", "r") as f:
    code = f.read()

# Fix the duplicated code block
fixed_get_anomaly_options = """function getAnomalyOptions(task: ExecutionTask) {
  if (task.anomalyType === 'claim_stalled') {
    return ['催办提醒', '释放额度并重新开放领取', '更换领取人'];
  }
  if (task.anomalyType === 'task_package_stalled') {
    return ['催拍照/催完成', '释放额度并重新开放领取', '更换领取人'];
  }
  if (task.anomalyType === 'publish_overdue') {
    return ['再次提醒', '更换发布人或账号', '调整发布时间', '本轮不再继续'];
  }
  if (task.anomalyType === 'executor_account_unavailable') {
    return ['更换发布人或账号', '等待账号恢复并调整排期', '重新发送登录与发布指引'];
  }
  if (task.anomalyType === 'data_sync_auth_expired') {
    return ['重新扫码授权', '仅保留本地记录'];
  }
  if (task.anomalyType === 'material_reshoot_overdue') {
    return ['再次通知执行人', '更换执行人', '调整补拍截止', '本轮不再继续'];
  }
  return ['再次通知执行人', '释放额度并重新开放领取', '更换执行人', '本轮不再继续'];
}"""

code = re.sub(r'function getAnomalyOptions.*?\}[\n\s]*\}', fixed_get_anomaly_options, code, flags=re.DOTALL)

with open("src/components/merchant/ExecutionCenter/OperatorTaskWorkbench.tsx", "w") as f:
    f.write(code)

print("Fixed syntax")

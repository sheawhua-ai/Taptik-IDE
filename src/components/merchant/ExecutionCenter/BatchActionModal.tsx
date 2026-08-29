import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, RefreshCw, Send, UserCheck, Calendar, ShieldAlert, AlertTriangle } from 'lucide-react';
import { ExecutionTask } from './types';

interface BatchActionModalProps {
  actionType: 'remind' | 'change_assignee' | 'extend_deadline' | 'cancel_task';
  selectedTasks: ExecutionTask[];
  onClose: () => void;
  onSuccess: (updatedTasks: ExecutionTask[]) => void;
}

export function BatchActionModal({ actionType, selectedTasks, onClose, onSuccess }: BatchActionModalProps) {
  const [newAssignee, setNewAssignee] = useState('操盘手');
  const [newDeadline, setNewDeadline] = useState('明天 18:00');
  const [remindMessage, setRemindMessage] = useState('您好，您认领的运营任务即将到达建议完成时间，请尽快推进并在小程序回传。');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultSummary, setResultSummary] = useState<{
    successCount: number;
    failCount: number;
    failedItems: Array<{ id: string; title: string; reason: string }>;
  } | null>(null);

  // Business filtering logic: only low-risk, editable tasks can receive batch actions
  const validTasks = selectedTasks.filter(t => {
    if (actionType === 'remind') {
      return t.status === '执行中' || (t.status === '待执行' && t.waitingRole === 'team');
    }
    if (actionType === 'change_assignee' || actionType === 'extend_deadline' || actionType === 'cancel_task') {
      return t.status !== '已完成' && t.status !== '已取消';
    }
    return t.status !== '已完成' && t.status !== '已取消';
  });

  const skippedTasks = selectedTasks.filter(t => !validTasks.some(v => v.id === t.id));

  // Projects involved
  const projectNames = Array.from(new Set(validTasks.map(t => t.projectName)));

  const getActionTitle = () => {
    switch (actionType) {
      case 'remind':
        return '批量发送催促提醒';
      case 'change_assignee':
        return '批量调整负责人 / 执行人';
      case 'extend_deadline':
        return '批量调整截止时间';
      case 'cancel_task':
        return '批量标记不再需要';
      default:
        return '批量操作';
    }
  };

  const handleExecute = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);

      const failed: Array<{ id: string; title: string; reason: string }> = [];
      const updated: ExecutionTask[] = [];

      validTasks.forEach(task => {
        if (task.status === '已取消') {
          failed.push({ id: task.id, title: task.title, reason: '任务已被提前取消，无法执行' });
        } else {
          const updatedTask = { ...task };
          if (actionType === 'remind') {
            updatedTask.timelineEvents = [
              ...task.timelineEvents,
              {
                id: `evt-${Date.now()}-${task.id}`,
                time: '刚刚',
                actor: '操盘手',
                action: `批量发送微信/短信催促提醒: ${remindMessage}`
              }
            ];
          } else if (actionType === 'change_assignee') {
            updatedTask.waitingParty = newAssignee;
            updatedTask.waitingRole = newAssignee.includes('操盘手') ? 'operator' : 'team';
            updatedTask.isMeWaiting = newAssignee.includes('操盘手');
            updatedTask.isTeamExecuting = !newAssignee.includes('操盘手');
            updatedTask.timelineEvents = [
              ...task.timelineEvents,
              {
                id: `evt-${Date.now()}-${task.id}`,
                time: '刚刚',
                actor: '操盘手',
                action: `批量调整负责人为【${newAssignee}】`
              }
            ];
          } else if (actionType === 'extend_deadline') {
            updatedTask.deadline = newDeadline;
            updatedTask.timelineEvents = [
              ...task.timelineEvents,
              {
                id: `evt-${Date.now()}-${task.id}`,
                time: '刚刚',
                actor: '操盘手',
                action: `批量调整截止时间为【${newDeadline}】`
              }
            ];
          } else if (actionType === 'cancel_task') {
            updatedTask.status = '已取消';
            updatedTask.isMeWaiting = false;
            updatedTask.isBlocked = false;
            updatedTask.timelineEvents = [
              ...task.timelineEvents,
              {
                id: `evt-${Date.now()}-${task.id}`,
                time: '刚刚',
                actor: '操盘手',
                action: `批量标记不再需要并取消任务`
              }
            ];
          }
          updated.push(updatedTask);
        }
      });

      setResultSummary({
        successCount: updated.length,
        failCount: failed.length,
        failedItems: failed
      });

      if (updated.length > 0) {
        onSuccess(updated);
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
      <div className="bg-surface border border-border-default rounded-xl shadow-dialog w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-border-default flex items-center justify-between bg-surface-subtle">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center border border-border-default text-text-primary">
              {actionType === 'remind' && <Send size={15} />}
              {actionType === 'change_assignee' && <UserCheck size={15} />}
              {actionType === 'extend_deadline' && <Calendar size={15} />}
              {actionType === 'cancel_task' && <AlertCircle size={15} />}
            </div>
            <div>
              <h3 className="text-[14px] font-semibold text-text-primary">{getActionTitle()}</h3>
              <p className="text-[13px] text-text-tertiary">已选择 {selectedTasks.length} 项可执行任务</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-[13px]">
          
          {/* Result summary banner */}
          {resultSummary ? (
            <div className="space-y-3">
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-[13px]">批量操作执行完毕</div>
                  <div className="text-[13px] text-emerald-800 mt-0.5">
                    成功更新 <strong>{resultSummary.successCount}</strong> 项任务
                    {resultSummary.failCount > 0 && `，跳过或失败 ${resultSummary.failCount} 项`}。
                  </div>
                </div>
              </div>

              {resultSummary.failedItems.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <div className="text-[13px] font-medium text-text-secondary">未成功项明细：</div>
                  {resultSummary.failedItems.map(item => (
                    <div key={item.id} className="p-2 bg-surface-subtle rounded text-[13px] border border-border-subtle flex justify-between">
                      <span className="text-text-primary truncate max-w-[240px]">{item.title}</span>
                      <span className="text-rose-600">{item.reason}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Task scope reminder */}
              <div className="p-3 bg-surface-subtle border border-border-subtle rounded-lg space-y-1.5">
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-text-secondary font-medium">覆盖方案：</span>
                  <span className="text-text-primary truncate max-w-[280px]">{projectNames.join('、') || '全部项目'}</span>
                </div>
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-text-secondary font-medium">有效执行项：</span>
                  <span className="text-emerald-700 font-semibold">{validTasks.length} 项</span>
                </div>
                {skippedTasks.length > 0 && (
                  <div className="flex items-center justify-between text-[13px] text-amber-700 pt-1 border-t border-border-subtle">
                    <span>已自动跳过不符合条件的项：</span>
                    <span>{skippedTasks.length} 项（已完成或状态不匹配）</span>
                  </div>
                )}
              </div>

              {/* Action Form */}
              {actionType === 'remind' && (
                <div className="space-y-2">
                  <label className="block text-[13px] font-medium text-text-primary">提醒通知文案：</label>
                  <textarea
                    rows={3}
                    value={remindMessage}
                    onChange={(e) => setRemindMessage(e.target.value)}
                    className="w-full px-3 py-2 text-[13px] bg-surface border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900"
                    placeholder="请输入微信或短信通知提醒内容..."
                  />
                  <div className="text-[13px] text-text-tertiary">
                    点击执行后，将通过企业微信/服务号向各执行人发送上述提醒，并在各任务记录中留痕。
                  </div>
                </div>
              )}

              {actionType === 'change_assignee' && (
                <div className="space-y-2">
                  <label className="block text-[13px] font-medium text-text-primary">重新指派给：</label>
                  <select
                    value={newAssignee}
                    onChange={(e) => setNewAssignee(e.target.value)}
                    className="w-full px-3 py-2 text-[13px] bg-surface border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900"
                  >
                    <option value="操盘手">操盘手（由我接管）</option>
                    <option value="张店长 (陆家嘴店)">张店长 (陆家嘴店)</option>
                    <option value="李店长 (静安店)">李店长 (静安店)</option>
                    <option value="备婚体验官_晴晴">备婚体验官_晴晴 (KOC)</option>
                    <option value="小红薯_汪汪队">小红薯_汪汪队 (KOC)</option>
                  </select>
                </div>
              )}

              {actionType === 'extend_deadline' && (
                <div className="space-y-2">
                  <label className="block text-[13px] font-medium text-text-primary">统一修改截止时间为：</label>
                  <input
                    type="text"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="w-full px-3 py-2 text-[13px] bg-surface border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900"
                    placeholder="例如：明天 18:00 或 2026-08-25 18:00"
                  />
                  <div className="text-[13px] text-text-tertiary">
                    执行后各任务的截止时间将同步刷新。
                  </div>
                </div>
              )}

              {actionType === 'cancel_task' && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-900 text-[13px] space-y-1">
                  <div className="font-semibold flex items-center gap-1">
                    <AlertTriangle size={14} className="text-rose-600" />
                    请确认是否取消这 {validTasks.length} 项任务？
                  </div>
                  <div>取消后任务将标记为“已取消”并移出待办，关联的后续发布步骤将终止。</div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-border-default bg-surface-subtle flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 text-[13px] font-medium text-text-secondary hover:text-text-primary hover:bg-surface-hover rounded-lg transition-colors"
          >
            {resultSummary ? '关闭' : '取消'}
          </button>

          {!resultSummary && (
            <button
              type="button"
              disabled={validTasks.length === 0 || isSubmitting}
              onClick={handleExecute}
              className={`px-4 py-1.5 rounded-lg text-[13px] font-semibold text-white transition-colors flex items-center gap-1.5 ${
                actionType === 'cancel_task'
                  ? 'bg-rose-600 hover:bg-rose-700 disabled:opacity-50'
                  : 'bg-action-primary hover:bg-action-primary-hover disabled:opacity-50'
              }`}
            >
              {isSubmitting && <RefreshCw size={13} className="animate-spin" />}
              <span>确认执行 ({validTasks.length}项)</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { 
  Workflow, ShieldCheck, Activity, Search, Share2, Brain, CheckCircle2, Pause, Play, Eye, AlertCircle, RefreshCcw, Check, X, Clock
} from 'lucide-react';

export const ExecutionCenter: React.FC = () => {
  const [isApprovalDrawerOpen, setIsApprovalDrawerOpen] = useState(false);

  const PLANS = [
    { 
      id: 0,
      title: '夏季大促爆文流水线', 
      status: '85%', 
      agent: '生产助手', 
      errorState: null,
      hitlState: 'awaiting',
      nodes: [
        { step: '01', title: '意图识别', status: 'completed' },
        { step: '02', title: '任务编排', status: 'completed' },
        { step: '03', title: '人工审核', status: 'hitl' },
        { step: '04', title: '自动分发', status: 'pending' },
      ]
    },
    { 
      id: 1,
      title: '竞品巡航与蓝海词探测', 
      status: '40%', 
      agent: '巡航助手', 
      errorState: 'API 限流',
      hitlState: null,
      nodes: [
        { step: '01', title: '全网扫描', status: 'completed' },
        { step: '02', title: '词云过滤', status: 'error' },
        { step: '03', title: '趋势分析', status: 'pending' },
        { step: '04', title: '报告输出', status: 'pending' },
      ]
    },
  ];

  return (
    <div className="flex flex-col h-full bg-neutral-50 overflow-hidden">
      <div className="h-16 border-b border-neutral-200 px-6 flex items-center justify-between bg-white shrink-0">
        <h2 className="text-[16px] font-bold text-neutral-900">协同任务</h2>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 bg-white border border-neutral-200 text-neutral-700 text-[13px] font-medium rounded-lg hover:bg-neutral-50 transition-colors flex items-center gap-1.5">
            <RefreshCcw size={14} /> 刷新
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* Active Tasks Table */}
        <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
            <h3 className="font-bold text-[13px] text-neutral-900">运行中的任务</h3>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="bg-neutral-50/50 border-b border-neutral-100 text-[12px] text-neutral-500 font-medium">
                <th className="px-4 py-2.5 w-[220px]">任务名称</th>
                <th className="px-4 py-2.5 w-[120px]">执行助手</th>
                <th className="px-4 py-2.5 w-[200px]">执行进度</th>
                <th className="px-4 py-2.5">当前状态</th>
                <th className="px-4 py-2.5 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-[12px]">
              {PLANS.map((plan, i) => (
                <tr key={i} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-neutral-900">{plan.title}</td>
                  <td className="px-4 py-3 text-neutral-600">{plan.agent}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 text-[12px]">
                      <span className="font-medium text-neutral-900">{plan.status}</span>
                      <span className="text-neutral-300">|</span>
                      <span className="text-neutral-500">
                        {plan.nodes.filter(n => n.status === 'completed').length} / {plan.nodes.length} 步
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {plan.errorState ? (
                      <span className="text-rose-600 flex items-center gap-1.5"><AlertCircle size={14}/> {plan.errorState}</span>
                    ) : plan.hitlState ? (
                      <span className="text-amber-600 flex items-center gap-1.5"><Pause size={14}/> 待人工确认</span>
                    ) : (
                      <span className="text-emerald-600 flex items-center gap-1.5"><Activity size={14} /> 正常运行中</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {plan.hitlState ? (
                      <button 
                        onClick={() => setIsApprovalDrawerOpen(true)}
                        className="px-3 py-1.5 bg-amber-50 text-amber-700 font-medium rounded-lg hover:bg-amber-100 transition-colors"
                      >
                        去审批
                      </button>
                    ) : plan.errorState ? (
                      <button className="px-3 py-1.5 bg-rose-50 text-rose-700 font-medium rounded-lg hover:bg-rose-100 transition-colors">
                        重试
                      </button>
                    ) : (
                      <button className="px-3 py-1.5 bg-white border border-neutral-200 text-neutral-600 font-medium rounded-lg hover:bg-neutral-50 transition-colors">
                        详情
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Task Logs */}
        <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-100 bg-neutral-50/50">
            <h3 className="font-bold text-[14px] text-neutral-900 flex items-center gap-2">
              <Clock size={16} className="text-neutral-500" /> 系统执行日志
            </h3>
          </div>
          <div className="p-5 space-y-4">
            {[
              { time: '14:23:05', msg: '文案 A/B 测试逻辑重排完毕', type: 'success' },
              { time: '13:50:12', msg: '开始执行: 夏季大促爆文生产', type: 'info' },
              { time: '13:12:44', msg: '蓝海词雷达扫描触发 API 限流 (重试中)', type: 'warning' },
              { time: '12:00:00', msg: '系统全节点健康度自检通过', type: 'success' },
            ].map((log, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="text-[12px] text-neutral-400 font-mono pt-0.5 w-16">{log.time}</div>
                <div className={`text-[13px] ${log.type === 'success' ? 'text-emerald-700' : log.type === 'warning' ? 'text-amber-700' : 'text-neutral-700'}`}>
                  {log.msg}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Approval Drawer */}
      {isApprovalDrawerOpen && (
        <>
          <div 
            onClick={() => setIsApprovalDrawerOpen(false)}
            className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-40"
          />
          <div className="fixed top-0 right-0 h-full w-[600px] bg-white shadow-2xl z-50 flex flex-col border-l border-neutral-200">
            <div className="px-6 py-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/50">
              <h3 className="text-[16px] font-bold text-neutral-900">任务人工审核</h3>
              <button onClick={() => setIsApprovalDrawerOpen(false)} className="text-neutral-400 hover:text-neutral-900 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle size={18} className="text-amber-600 mt-0.5" />
                <div>
                  <h4 className="text-[13px] font-bold text-amber-900 mb-1">等待审核: 夏季大促爆文文案初稿</h4>
                  <p className="text-[12px] text-amber-700/80">任务流已暂停，需人工确认生成内容后继续分发。</p>
                </div>
              </div>

              <div className="border border-neutral-200 rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between">
                  <span className="text-[13px] font-bold text-neutral-900">内容预览</span>
                  <div className="flex gap-2">
                    <span className="px-2 py-0.5 bg-white border border-neutral-200 text-neutral-600 text-[11px] rounded">小红书风格</span>
                  </div>
                </div>
                <div className="p-5 space-y-4">
                  <h5 className="text-[15px] font-bold text-neutral-900">标题：救命！这款宠物粮真的让挑嘴猫从此开启“炫饭”模式！😭🐾</h5>
                  <p className="text-[13px] text-neutral-600 leading-relaxed">
                    家人们谁懂啊！最近入手的这款「宠味巡航」定制粮真的绝了！之前试了好几个大牌，主子都爱答不理，这次竟然直接光盘！
                    颗粒大小适中，而且配方表很干净，没有任何乱七八糟的添加剂。最重要的是，我家主子吃了几天后，毛发都变得更亮了！
                  </p>
                  <div className="grid grid-cols-3 gap-3 h-32 mt-4">
                    <div className="bg-neutral-100 rounded-lg flex items-center justify-center text-neutral-400 text-[12px]">封面图 A</div>
                    <div className="bg-neutral-100 rounded-lg flex items-center justify-center text-neutral-400 text-[12px]">展示图 B</div>
                    <div className="bg-neutral-100 rounded-lg flex items-center justify-center text-neutral-400 text-[12px]">细节图 C</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-neutral-200 flex items-center gap-3 bg-white shrink-0">
              <button 
                onClick={() => {
                  setIsApprovalDrawerOpen(false);
                  window.dispatchEvent(
                    new CustomEvent("start-ai-action", {
                      detail: { 
                        task: {
                          id: 'hitl_1',
                          title: '打回重写文案',
                          aiActionText: '重新生成',
                          context: '这篇文案标题太夸张，口吻不够自然。请帮我打回重新调整。',
                        }
                      }
                    })
                  );
                }}
                className="flex-1 py-2.5 bg-white border border-neutral-200 text-neutral-700 rounded-lg text-[13px] font-bold hover:bg-neutral-50 transition-colors"
              >
                打回重写
              </button>
              <button 
                onClick={() => setIsApprovalDrawerOpen(false)}
                className="flex-1 py-2.5 bg-neutral-900 text-white rounded-lg text-[13px] font-bold hover:bg-neutral-800 transition-colors"
              >
                审核通过并发布
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

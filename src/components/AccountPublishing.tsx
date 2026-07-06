import React, { useState } from 'react';
import { 
  Users, AlertCircle, TrendingUp, Search, Filter,
  Smartphone, Bell, CheckCircle2, XCircle, Clock, 
  ArrowRight, ShieldAlert, Sparkles, Send, Box,
  Play, Pause, Settings, Info, QrCode, Plus
} from 'lucide-react';

export const AccountPublishing: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'assets' | 'dispatch'>('assets');
  const [isApplyPlanDrawerOpen, setIsApplyPlanDrawerOpen] = useState(false);
  const [isAccountDetailDrawerOpen, setIsAccountDetailDrawerOpen] = useState(false);
  const [isModifyScheduleModalOpen, setIsModifyScheduleModalOpen] = useState(false);
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);

  React.useEffect(() => {
    const handleOpen = () => {
      setActiveTab('dispatch');
      setIsModifyScheduleModalOpen(true);
    };
    const handleEditTask = (e: any) => {
      setEditingTask(e.detail);
      setIsEditTaskModalOpen(true);
    };
    window.addEventListener('open-modify-schedule', handleOpen);
    window.addEventListener('open-edit-publish-task', handleEditTask);
    return () => {
      window.removeEventListener('open-modify-schedule', handleOpen);
      window.removeEventListener('open-edit-publish-task', handleEditTask);
    };
  }, []);

  return (
    <div className="flex-1 flex flex-col h-full bg-neutral-50 overflow-hidden">
      {/* Top Header */}
      <div className="h-16 border-b border-neutral-200 bg-white px-8 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-6">
          <h2 className="text-[18px] font-semibold text-neutral-900 tracking-tight">账号与发布</h2>
          <div className="flex items-center bg-neutral-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('assets')}
              className={`px-4 py-1.5 text-[14px] font-medium rounded-md transition-all ${
                activeTab === 'assets' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              账号资产
            </button>
            <button
              onClick={() => setActiveTab('dispatch')}
              className={`px-4 py-1.5 text-[14px] font-medium rounded-md transition-all ${
                activeTab === 'dispatch' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              发布调度
            </button>
          </div>
        </div>
        <button
          onClick={() => setIsApplyPlanDrawerOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors text-[14px] font-medium"
        >
          <Sparkles size={16} />
          处理今日发布
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'assets' && <AccountAssetsView onOpenAccount={() => setIsAccountDetailDrawerOpen(true)} onAddAccount={() => setIsAddAccountModalOpen(true)} />}
        {activeTab === 'dispatch' && <PublishingDispatchView onOpenApplyPlan={() => setIsApplyPlanDrawerOpen(true)} />}
      </div>

      {/* Drawers */}
      {isApplyPlanDrawerOpen && (
        <ApplyPlanDrawer onClose={() => setIsApplyPlanDrawerOpen(false)} />
      )}
      {isAccountDetailDrawerOpen && (
        <AccountDetailDrawer onClose={() => setIsAccountDetailDrawerOpen(false)} />
      )}
      {isModifyScheduleModalOpen && (
        <ModifyScheduleModal onClose={() => setIsModifyScheduleModalOpen(false)} />
      )}
      {isEditTaskModalOpen && (
        <EditPublishTaskModal task={editingTask} onClose={() => setIsEditTaskModalOpen(false)} />
      )}
      {isAddAccountModalOpen && (
        <AddAccountModal onClose={() => setIsAddAccountModalOpen(false)} />
      )}
    </div>
  );
};

const AccountAssetsView = ({ onOpenAccount, onAddAccount }: { onOpenAccount: () => void, onAddAccount: () => void }) => {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 pb-20">
      {/* Daily Inspection */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-neutral-100 bg-neutral-50/50 flex items-center justify-between">
          <h3 className="font-bold text-[15px] text-neutral-900 flex items-center gap-2">
            <Sparkles size={16} className="text-emerald-500" />
            每日账号巡查建议
          </h3>
          <div className="text-[12px] text-neutral-500">
            当前共有 <span className="font-medium text-neutral-900">42</span> 个账号，今日 <span className="font-medium text-emerald-600">18</span> 个可发
          </div>
        </div>
        <div className="divide-y divide-neutral-100">
          <div className="p-4 flex items-center justify-between hover:bg-neutral-50 transition-colors">
            <div className="flex items-start gap-3">
              <div className="mt-0.5"><AlertCircle size={16} className="text-rose-500" /></div>
              <div>
                <div className="text-[13px] font-medium text-neutral-900 mb-1">
                  <span className="text-rose-600 font-bold mr-2">异常警告</span>
                  <span className="px-1.5 py-0.5 bg-neutral-100 rounded text-neutral-600 mr-2 text-[11px]">奈雪-区域福利官</span>
                  疑似遭遇流量限流
                </div>
                <div className="text-[12px] text-neutral-500">该账号近 3 篇笔记互动量断崖式下跌，系统已自动暂停后续自动排期。</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 bg-white border border-neutral-200 text-neutral-700 text-[12px] font-medium rounded-lg shadow-sm hover:bg-neutral-50 transition-colors">查看诊断建议</button>
            </div>
          </div>
          
          <div className="p-4 flex items-center justify-between hover:bg-neutral-50 transition-colors">
            <div className="flex items-start gap-3">
              <div className="mt-0.5"><TrendingUp size={16} className="text-orange-500" /></div>
              <div>
                <div className="text-[13px] font-medium text-neutral-900 mb-1">
                  <span className="text-orange-600 font-bold mr-2">投流机会</span>
                  <span className="px-1.5 py-0.5 bg-neutral-100 rounded text-neutral-600 mr-2 text-[11px]">A01 品牌号</span>
                  自然流内容表现好，适合小额薯条放大
                </div>
                <div className="text-[12px] text-neutral-500">近期笔记互动率达到 6.2%，建议投入 500 元薯条。</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 bg-white border border-neutral-200 text-neutral-700 text-[12px] font-medium rounded-lg shadow-sm hover:bg-neutral-50 transition-colors">一键复用排期</button>
              <button className="px-3 py-1.5 bg-orange-50 text-orange-600 text-[12px] font-medium rounded-lg shadow-sm hover:bg-orange-100 transition-colors">查看投流建议</button>
            </div>
          </div>
          
          <div className="p-4 flex items-center justify-between hover:bg-neutral-50 transition-colors">
            <div className="flex items-start gap-3">
              <div className="mt-0.5"><TrendingUp size={16} className="text-indigo-500" /></div>
              <div>
                <div className="text-[13px] font-medium text-neutral-900 mb-1">
                  <span className="text-indigo-600 font-bold mr-2">投流机会</span>
                  <span className="px-1.5 py-0.5 bg-neutral-100 rounded text-neutral-600 mr-2 text-[11px]">A05 科普号</span>
                  专业科普点击稳定，适合聚光测试
                </div>
                <div className="text-[12px] text-neutral-500">转化线索成本低于行业 20%，建议聚光放量。</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 bg-indigo-50 text-indigo-600 text-[12px] font-medium rounded-lg shadow-sm hover:bg-indigo-100 transition-colors">查看投流建议</button>
            </div>
          </div>
        </div>
      </div>

      {/* Account Groups */}
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-[16px] font-bold text-neutral-900">账号资产管理</h3>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input type="text" placeholder="搜索账号..." className="pl-9 pr-4 py-1.5 text-[13px] border border-neutral-200 rounded-lg focus:outline-none focus:border-indigo-500 w-64" />
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 border border-neutral-200 text-neutral-700 text-[13px] font-medium rounded-lg hover:bg-neutral-50 transition-colors">
              <Filter size={14} /> 筛选
            </button>
            <button onClick={onAddAccount} className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 text-white text-[13px] font-medium rounded-lg hover:bg-neutral-800 transition-colors">
              <Plus size={14} /> 添加账号
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-neutral-100 bg-neutral-50/50 text-[12px] font-medium text-neutral-500">
            <div className="col-span-3">账号信息</div>
            <div className="col-span-2">类型与定位</div>
            <div className="col-span-2">状态与资源</div>
            <div className="col-span-3">AI 建议</div>
            <div className="col-span-2 text-right">操作</div>
          </div>
          
          <div className="divide-y divide-neutral-100">
            {/* 官方号 */}
            <div className="bg-neutral-50/30 px-4 py-2 text-[12px] font-bold text-neutral-700 border-b border-neutral-100 flex items-center justify-between">
              <span>官方号</span>
              <span className="text-[11px] font-normal text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full">品牌自有，高权重</span>
            </div>
            <AccountListItem 
              name="奈雪的茶官方" 
              type="品牌官号" 
              position="品牌宣发/科普" 
              dailyAvailable="0/1"
              tags={["需人工发布", "强背书"]}
              health="normal"
              suggestion="建议每周 2-3 篇深度内容"
              onClick={onOpenAccount}
              onDelete={() => {}}
            />
            <AccountListItem 
              name="奈雪-区域福利官" 
              type="品牌矩阵号" 
              position="福利/种草" 
              dailyAvailable="2/3"
              tags={["适合自然流", "活动承接"]}
              health="normal"
              suggestion="适合承接福利抽奖活动"
              onClick={onOpenAccount}
              onDelete={() => {}}
            />

            {/* KOS */}
            <div className="bg-neutral-50/30 px-4 py-2 text-[12px] font-bold text-neutral-700 border-b border-neutral-100 mt-2 flex items-center justify-between">
              <span>员工 KOS</span>
              <span className="text-[11px] font-normal text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full">门店员工/区域号</span>
            </div>
            <AccountListItem 
              name="广州天河李店长" 
              type="店长号" 
              position="门店日常/探店" 
              dailyAvailable="1/1"
              adStatus="关"
              tags={["素人口吻", "高信任度"]}
              health="warning"
              suggestion="近3日未更新，建议派发探店内容"
              onClick={onOpenAccount}
              onDelete={() => {}}
            />

            {/* 真实客户池 */}
            <div className="bg-neutral-50/30 px-4 py-2 text-[12px] font-bold text-neutral-700 border-b border-neutral-100 mt-2 flex items-center justify-between">
              <span>真实客户池</span>
              <span className="text-[11px] font-normal text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">现场扫码授权后自动收录</span>
            </div>
            <AccountListItem 
              name="真实客户_0823" 
              type="真实客户快发" 
              position="探店/素人反馈" 
              dailyAvailable="1/1"
              tags={["真实消费", "强地域性"]}
              health="normal"
              suggestion="已完成到店打卡任务，可结算"
              onClick={onOpenAccount}
              onDelete={() => {}}
            />
            <AccountListItem 
              name="真实客户_0811" 
              type="真实客户快发" 
              position="素人反馈" 
              dailyAvailable="0/1"
              tags={["真实消费", "出图快"]}
              health="normal"
              suggestion="互动数据极好，建议邀约长期体验"
              onClick={onOpenAccount}
              onDelete={() => {}}
            />

            {/* 泛素人 */}
            <div className="bg-neutral-50/30 px-4 py-2 text-[12px] font-bold text-neutral-700 border-b border-neutral-100 mt-2 flex items-center justify-between">
              <span>泛素人 / 外包账号池</span>
              <span className="text-[11px] font-normal text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full">预设人设/第三方合作</span>
            </div>
            <AccountListItem 
              name="护肤小达人" 
              type="泛素人分发" 
              position="美妆/测评" 
              dailyAvailable="-"
              tags={["出图快", "互动率高"]}
              health="normal"
              suggestion="表现优异，建议加入白名单"
              onClick={onOpenAccount}
              onDelete={() => {}}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
const AccountListItem = ({ name, type, position, tags, health, suggestion, onClick, onDelete, dailyAvailable, adStatus }: any) => {
  return (
    <div className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-neutral-50 transition-colors group">
      <div className="col-span-3">
        <h4 className="text-[14px] font-medium text-neutral-900 flex items-center gap-2 mb-1.5">
          {name}
          {health === 'warning' && <AlertCircle size={14} className="text-amber-500" />}
        </h4>
        <div className="flex flex-wrap items-center gap-1.5">
          {tags.map((t: string) => (
            <span key={t} className={`px-1.5 py-0.5 text-[10px] rounded border whitespace-nowrap ${t.includes('限流') || t.includes('暂停') || t.includes('不建议') ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-neutral-100 text-neutral-600 border-neutral-200'}`}>
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="col-span-2">
        <div className="text-[13px] text-neutral-700 mb-1">{type}</div>
        <div className="text-[12px] text-neutral-500">{position}</div>
      </div>

      <div className="col-span-2">
        <div className="text-[12px] text-neutral-700 mb-1">今日可发：{dailyAvailable}</div>
        <div className="text-[12px] text-neutral-500">互动率：4.8% · 投流：{adStatus || '开'}</div>
      </div>

      <div className="col-span-3">
        <div className="text-[12px] text-indigo-900/80 bg-indigo-50/50 border border-indigo-100/50 rounded p-2 flex items-start gap-1.5">
          <Sparkles size={12} className="text-indigo-500 mt-0.5 shrink-0" />
          <span className="line-clamp-2" title={suggestion}>{suggestion}</span>
        </div>
      </div>

      <div className="col-span-2 flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={onClick} className="px-3 py-1.5 text-[12px] font-medium text-neutral-700 bg-white border border-neutral-200 hover:bg-neutral-50 rounded-lg transition-colors">
          详情
        </button>
        <button className="px-3 py-1.5 text-[12px] font-medium text-neutral-700 bg-white border border-neutral-200 hover:bg-neutral-50 rounded-lg transition-colors">
          排期
        </button>
        <button onClick={(e) => { e.stopPropagation(); onDelete?.(); }} className="p-1.5 text-rose-600 bg-white border border-rose-100 hover:bg-rose-50 rounded-lg transition-colors" title="移除账号">
          <XCircle size={14} />
        </button>
      </div>
    </div>
  );
};

const PublishingDispatchView = ({ onOpenApplyPlan }: { onOpenApplyPlan: () => void }) => {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 pb-20">
      {/* Top Judgment */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm flex items-start justify-between">
        <div>
          <div className="flex items-start gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles size={16} />
            </div>
            <div>
              <h3 className="text-[16px] font-medium text-neutral-900 leading-relaxed mb-2">
                今日建议发布 12 篇：4 篇自有号定向，3 篇员工 KOS，3 篇扫码即发布，2 篇达人合作内容暂缓。
              </h3>
              <ul className="space-y-1.5">
                <li className="text-[13px] text-neutral-600 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                  A01/A02 频率健康，适合自然流测试
                </li>
                <li className="text-[13px] text-neutral-600 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                  A05 适合承接专业科普
                </li>
                <li className="text-[13px] text-neutral-600 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-400"></div>
                  广州吃喝小分队疑似限流，建议暂停
                </li>
                <li className="text-[13px] text-neutral-600 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                  3 篇内容适合扫码发布包，便于快速铺量
                </li>
                <li className="text-[13px] text-neutral-600 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                  2 篇达人内容缺回传确认，建议暂缓
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 shrink-0 ml-8">
          <button onClick={onOpenApplyPlan} className="px-6 py-2.5 bg-neutral-900 text-white font-medium text-[14px] rounded-xl hover:bg-neutral-800 transition-colors shadow-sm whitespace-nowrap">
            应用今日发布方案
          </button>
          <button onClick={() => window.dispatchEvent(new CustomEvent('open-modify-schedule'))} className="px-6 py-2.5 bg-white border border-neutral-200 text-neutral-700 font-medium text-[14px] rounded-xl hover:bg-neutral-50 transition-colors whitespace-nowrap">
            调整发布排期
          </button>
        </div>
      </div>

      {/* Timeline Schedule */}
      <div>
        <h3 className="text-[16px] font-semibold text-neutral-900 mb-6 flex items-center gap-2">
          <Clock size={18} className="text-neutral-500" />
          今日发布计划
        </h3>
        
        <div className="space-y-6">
          {/* Time Window 1 */}
          <div className="flex gap-6">
            <div className="w-24 shrink-0 text-right">
              <div className="text-[14px] font-semibold text-neutral-900">10:00-12:00</div>
              <div className="text-[12px] text-neutral-500 mt-1">4 篇内容</div>
            </div>
            <div className="flex-1 space-y-3 border-l-2 border-neutral-100 pl-6 pb-6 relative">
              <div className="absolute w-3 h-3 bg-white border-2 border-primary-500 rounded-full -left-[7px] top-1"></div>
              
              <PublishTaskCard 
                title="夏季通勤防晒实测首篇" 
                account="奈雪-区域福利官 (自有定向)" 
                time="今天 11:30 前" 
                notice="企微已发" 
                status="待发文" 
                req="发布链接 + 截图" 
              />
              <PublishTaskCard 
                title="新品果茶用户盲测" 
                account="扫码发布池 (外部素人)" 
                time="今天 12:00 前" 
                notice="任务码已生成" 
                status="待扫码领取" 
                req="扫码发布即完成" 
              />
            </div>
          </div>

          {/* Time Window 2 */}
          <div className="flex gap-6">
            <div className="w-24 shrink-0 text-right">
              <div className="text-[14px] font-semibold text-neutral-900">18:00-21:00</div>
              <div className="text-[12px] text-neutral-500 mt-1">3 篇内容</div>
            </div>
            <div className="flex-1 space-y-3 border-l-2 border-neutral-100 pl-6 pb-6 relative">
              <div className="absolute w-3 h-3 bg-white border-2 border-neutral-300 rounded-full -left-[7px] top-1"></div>
              
              <PublishTaskCard 
                title="专业科普：配方解析" 
                account="A05 科普号" 
                time="今天 19:00 前" 
                notice="待通知" 
                status="待分配" 
                req="发布链接" 
              />
              <PublishTaskCard 
                title="门店探店体验分享" 
                account="李店长 KOS" 
                time="今天 20:00 前" 
                notice="企微已发" 
                status="已发文待回传" 
                req="数据截图" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PublishTaskCard = ({ title, account, time, notice, status, req }: any) => {
  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all flex items-center justify-between group">
      <div>
        <h4 className="text-[15px] font-medium text-neutral-900 mb-2">{title}</h4>
        <div className="flex items-center gap-4 text-[12px] text-neutral-500">
          <span className="flex items-center gap-1.5"><Users size={14} className="text-neutral-400" /> 分发给：<span className="text-neutral-700 font-medium">{account}</span></span>
          <span className="flex items-center gap-1.5"><Clock size={14} className="text-neutral-400" /> 时间窗：{time}</span>
          <span className="flex items-center gap-1.5"><Bell size={14} className="text-neutral-400" /> 通知：{notice}</span>
          <span className="flex items-center gap-1.5"><Box size={14} className="text-neutral-400" /> 状态：<span className={`font-medium ${status.includes('已发文') ? 'text-emerald-600' : 'text-primary-600'}`}>{status}</span></span>
        </div>
      </div>
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="px-3 py-1.5 bg-neutral-100 text-neutral-700 text-[12px] font-medium rounded-lg hover:bg-neutral-200 transition-colors">查看计划</button>
        {!status.includes('已发文') && (
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('open-edit-publish-task', { detail: { title, account, time, notice, status, req } }))}
            className="px-3 py-1.5 bg-neutral-100 text-neutral-700 text-[12px] font-medium rounded-lg hover:bg-neutral-200 transition-colors"
          >
            调整与提醒
          </button>
        )}
      </div>
    </div>
  );
};

const ApplyPlanDrawer = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-neutral-900/20 backdrop-blur-sm" onClick={onClose}></div>
      <div className="w-[480px] bg-white h-full shadow-2xl relative flex flex-col animate-in slide-in-from-right duration-300">
        <div className="h-16 px-6 border-b border-neutral-100 flex items-center justify-between bg-white shrink-0">
          <h2 className="text-[18px] font-semibold text-neutral-900">今日发布方案处理</h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-700 transition-colors">
            <XCircle size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-neutral-200 before:to-transparent">
            {/* Steps */}
            <PlanStep 
              num={1} title="异常改派" 
              desc="广州吃喝小分队疑似限流，其分配的 1 篇内容需改派。" 
              active 
            />
            <PlanStep 
              num={2} title="账号分配确认" 
              desc="4 篇自有号定向，3 篇员工 KOS 分配确认。" 
            />
            <PlanStep 
              num={3} title="生成扫码包" 
              desc="3 篇内容组装为二维码分发包。" 
            />
            <PlanStep 
              num={4} title="发送通知" 
              desc="通过企微向 5 位负责人发送发文提醒及素材包。" 
            />
            <PlanStep 
              num={5} title="检查待回传" 
              desc="核对昨日发布未回传链接的 2 篇内容并催办。" 
            />
          </div>
        </div>

        <div className="p-6 bg-neutral-50 border-t border-neutral-100 space-y-4 shrink-0">
          <div>
            <label className="text-[12px] font-medium text-neutral-700 mb-1.5 block">微调分发偏好 (可选)</label>
            <textarea 
              placeholder="例如：今天不要用达人号，只用自有号和员工号。" 
              className="w-full bg-white border border-neutral-200 rounded-xl p-3 text-[13px] outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 resize-none h-20"
            ></textarea>
          </div>
          <button className="w-full py-3 bg-neutral-900 text-white rounded-xl text-[14px] font-medium shadow-lg shadow-neutral-900/20 hover:bg-neutral-800 transition-colors">
            按建议处理
          </button>
          <button className="w-full py-3 bg-white text-neutral-700 border border-neutral-200 rounded-xl text-[14px] font-medium hover:bg-neutral-50 transition-colors">
            换方案
          </button>
        </div>
      </div>
    </div>
  );
};

const PlanStep = ({ num, title, desc, active }: any) => (
  <div className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active`}>
    <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${active ? 'bg-white border-primary-500 text-primary-600' : 'bg-neutral-100 border-white text-neutral-400'} shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 font-semibold text-[13px]`}>
      {num}
    </div>
    <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white border ${active ? 'border-primary-200 shadow-md' : 'border-neutral-100 shadow-sm'} p-4 rounded-xl`}>
      <h4 className={`text-[15px] font-semibold ${active ? 'text-neutral-900' : 'text-neutral-500'} mb-1`}>{title}</h4>
      <p className="text-[12px] text-neutral-500 leading-relaxed mb-3">{desc}</p>
      {active && (
        <button className="w-full py-2 bg-primary-50 text-primary-600 text-[13px] font-medium rounded-lg hover:bg-primary-100 transition-colors">
          立即执行
        </button>
      )}
    </div>
  </div>
);

const AccountDetailDrawer = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-neutral-900/20 backdrop-blur-sm" onClick={onClose}></div>
      <div className="w-[480px] bg-white h-full shadow-2xl relative flex flex-col animate-in slide-in-from-right duration-300">
        <div className="h-16 px-6 border-b border-neutral-100 flex items-center justify-between bg-white shrink-0">
          <h2 className="text-[18px] font-semibold text-neutral-900">账号资产明细</h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-700 transition-colors">
            <XCircle size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="text-center pb-6 border-b border-neutral-100">
            <div className="w-20 h-20 bg-neutral-100 rounded-full mx-auto mb-4 border-4 border-white shadow-md flex items-center justify-center">
              <Users size={32} className="text-neutral-400" />
            </div>
            <h3 className="text-[20px] font-semibold text-neutral-900">奈雪-区域福利官</h3>
            <p className="text-[13px] text-neutral-500 mt-1">品牌矩阵号 · 适合自然流</p>
          </div>

          <div className="space-y-4">
            <div className="bg-neutral-50 rounded-xl p-4">
              <h4 className="text-[13px] font-medium text-neutral-700 mb-3">核心定位</h4>
              <p className="text-[13px] text-neutral-900">福利/种草，适合发布门店活动、生活方式、轻种草内容。</p>
            </div>
            
            <div>
              <h4 className="text-[14px] font-medium text-neutral-900 mb-3">近 30 天表现</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="border border-neutral-200 rounded-xl p-3">
                  <div className="text-[11px] text-neutral-500 mb-1">发布频率</div>
                  <div className="text-[15px] font-semibold text-neutral-900">12 篇 / 周</div>
                </div>
                <div className="border border-neutral-200 rounded-xl p-3">
                  <div className="text-[11px] text-neutral-500 mb-1">平均互动率</div>
                  <div className="text-[15px] font-semibold text-neutral-900 text-emerald-600">4.8% <TrendingUp size={12} className="inline"/></div>
                </div>
                <div className="border border-neutral-200 rounded-xl p-3">
                  <div className="text-[11px] text-neutral-500 mb-1">异常信号</div>
                  <div className="text-[15px] font-semibold text-neutral-900">无</div>
                </div>
                <div className="border border-neutral-200 rounded-xl p-3">
                  <div className="text-[11px] text-neutral-500 mb-1">投流记录</div>
                  <div className="text-[15px] font-semibold text-neutral-900">小额薯条 3 次</div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-[14px] font-medium text-neutral-900 mb-3 flex items-center justify-between">
                当前待发任务
                <span className="text-[12px] font-normal text-primary-600 cursor-pointer">查看全部</span>
              </h4>
              <div className="space-y-2">
                <div className="p-3 border border-neutral-100 bg-white rounded-lg flex items-center justify-between">
                  <div>
                    <div className="text-[13px] font-medium text-neutral-900">夏季通勤防晒实测首篇</div>
                    <div className="text-[11px] text-neutral-500 mt-1">今天 11:30 前发布</div>
                  </div>
                  <span className="text-[11px] font-medium px-2 py-1 bg-amber-50 text-amber-600 rounded">待回传</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white border-t border-neutral-100 flex items-center gap-3 shrink-0">
          <button className="flex-1 py-2.5 bg-neutral-100 text-neutral-700 rounded-xl text-[14px] font-medium hover:bg-neutral-200 transition-colors">
            暂停承接
          </button>
          <button className="flex-1 py-2.5 bg-neutral-900 text-white rounded-xl text-[14px] font-medium hover:bg-neutral-800 transition-colors shadow-sm">
            调整内容定位
          </button>
        </div>
      </div>
    </div>
  );
};

const ModifyScheduleModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-neutral-200 overflow-hidden flex flex-col">
        <div className="p-5 flex justify-between items-center border-b border-neutral-100 bg-neutral-50/50">
          <h3 className="font-bold text-[16px] text-neutral-900 flex items-center gap-2">
            <Clock size={18} className="text-indigo-600" /> 调整账号发布排期
          </h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-900 transition-colors">
            <XCircle size={18} />
          </button>
        </div>
        <div className="p-6 space-y-5">
          <div className="bg-rose-50 border border-rose-100 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle size={18} className="text-rose-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[14px] font-bold text-rose-900">异常账号拦截</h4>
                <p className="text-[12px] text-rose-700 mt-1">「广州吃喝小分队」疑似限流，建议取消未来 3 天排期，转交其他账号。</p>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[13px] font-bold text-neutral-700 mb-2">修改当前策略</h4>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 border border-neutral-200 rounded-lg cursor-pointer hover:bg-neutral-50">
                <input type="radio" name="schedule" defaultChecked className="w-4 h-4 text-indigo-600 focus:ring-indigo-500" />
                <span className="text-[13px] text-neutral-700 font-medium">暂停发布，平移排期至 3 天后恢复</span>
              </label>
              <label className="flex items-center gap-3 p-3 border border-neutral-200 rounded-lg cursor-pointer hover:bg-neutral-50">
                <input type="radio" name="schedule" className="w-4 h-4 text-indigo-600 focus:ring-indigo-500" />
                <span className="text-[13px] text-neutral-700 font-medium">立即取消排期，重新派单给备选达人 (需人工审核)</span>
              </label>
              <label className="flex items-center gap-3 p-3 border border-neutral-200 rounded-lg cursor-pointer hover:bg-neutral-50">
                <input type="radio" name="schedule" className="w-4 h-4 text-indigo-600 focus:ring-indigo-500" />
                <span className="text-[13px] text-neutral-700 font-medium">继续强发测试 (不建议)</span>
              </label>
            </div>
          </div>
        </div>
        <div className="p-5 border-t border-neutral-100 bg-neutral-50/50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-[13px] font-bold text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors">
            取消
          </button>
          <button onClick={onClose} className="px-5 py-2 text-[13px] font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-all flex items-center gap-2">
            确认修改排期
          </button>
        </div>
      </div>
    </div>
  );
};

const EditPublishTaskModal = ({ task, onClose }: { task: any, onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-neutral-200 overflow-hidden flex flex-col">
        <div className="p-5 flex justify-between items-center border-b border-neutral-100 bg-neutral-50/50">
          <h3 className="font-bold text-[16px] text-neutral-900 flex items-center gap-2">
            <Settings size={18} className="text-neutral-600" /> 调整排期与提醒
          </h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-900 transition-colors">
            <XCircle size={18} />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-100">
            <h4 className="text-[14px] font-bold text-neutral-900 mb-1">{task?.title}</h4>
            <p className="text-[12px] text-neutral-500">当前分配：{task?.account}</p>
          </div>
          
          <div>
            <h4 className="text-[13px] font-bold text-neutral-700 mb-3">调整发布人</h4>
            <select className="w-full p-2.5 rounded-lg border border-neutral-200 text-[13px] text-neutral-900 focus:outline-none focus:border-indigo-500 bg-white">
              <option value="current">{task?.account}</option>
              <option value="kefu1">备选：小雅 (自有定向)</option>
              <option value="kefu2">备选：大潘 (KOS号)</option>
              <option value="pool">退回扫码发布池</option>
            </select>
          </div>

          <div>
            <h4 className="text-[13px] font-bold text-neutral-700 mb-3">设置发布时间窗</h4>
            <input type="text" defaultValue={task?.time} className="w-full p-2.5 rounded-lg border border-neutral-200 text-[13px] text-neutral-900 focus:outline-none focus:border-indigo-500" />
          </div>
          
          <div>
            <h4 className="text-[13px] font-bold text-neutral-700 mb-3">定时提醒 (人工扫码发布)</h4>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 border border-neutral-200 rounded-lg cursor-pointer hover:bg-neutral-50">
                <input type="radio" name="reminder" defaultChecked className="w-4 h-4 text-indigo-600 focus:ring-indigo-500" />
                <span className="text-[13px] text-neutral-700 font-medium">截止前 1 小时自动发送企微提醒</span>
              </label>
              <label className="flex items-center gap-3 p-3 border border-neutral-200 rounded-lg cursor-pointer hover:bg-neutral-50">
                <input type="radio" name="reminder" className="w-4 h-4 text-indigo-600 focus:ring-indigo-500" />
                <span className="text-[13px] text-neutral-700 font-medium">每天 10:00 统一提醒未发布的人员</span>
              </label>
              <label className="flex items-center gap-3 p-3 border border-neutral-200 rounded-lg cursor-pointer hover:bg-neutral-50">
                <input type="radio" name="reminder" className="w-4 h-4 text-indigo-600 focus:ring-indigo-500" />
                <span className="text-[13px] text-neutral-700 font-medium">不需要提醒</span>
              </label>
            </div>
          </div>
        </div>
        <div className="p-5 border-t border-neutral-100 bg-neutral-50/50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-[13px] font-bold text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors">
            取消
          </button>
          <button onClick={onClose} className="px-5 py-2 text-[13px] font-bold text-neutral-900 border border-neutral-200 bg-white hover:bg-neutral-50 rounded-lg transition-all">
            仅保存修改
          </button>
          <button onClick={onClose} className="px-5 py-2 text-[13px] font-bold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-all flex items-center gap-2">
            保存并再次通知
          </button>
        </div>
      </div>
    </div>
  );
};

const AddAccountModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-[600px] shadow-2xl border border-neutral-200 overflow-hidden flex flex-col">
        <div className="p-5 flex justify-between items-center border-b border-neutral-100 bg-neutral-50/50">
          <h3 className="font-bold text-[16px] text-neutral-900 flex items-center gap-2">
            <Plus size={18} className="text-neutral-600" /> 添加账号资产
          </h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-900 transition-colors">
            <XCircle size={18} />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-[13px] font-bold text-neutral-700 mb-2">所属平台</h4>
              <select className="w-full p-2.5 rounded-lg border border-neutral-200 text-[13px] text-neutral-900 focus:outline-none focus:border-indigo-500 bg-white">
                <option value="xiaohongshu">小红书</option>
                <option value="douyin">抖音</option>
                <option value="kuaishou">快手</option>
                <option value="shipinhao">视频号</option>
              </select>
            </div>
            <div>
              <h4 className="text-[13px] font-bold text-neutral-700 mb-2">账号来源类型</h4>
              <select className="w-full p-2.5 rounded-lg border border-neutral-200 text-[13px] text-neutral-900 focus:outline-none focus:border-indigo-500 bg-white">
                <option value="own">自有可控 (品牌/矩阵/店长号)</option>
                <option value="external">外部账号 (达人/KOC/探店)</option>
              </select>
            </div>
          </div>

          <div>
            <h4 className="text-[13px] font-bold text-neutral-700 mb-2">平台主页链接或小红书号</h4>
            <input type="text" placeholder="输入链接，系统将自动抓取基础信息" className="w-full p-2.5 rounded-lg border border-neutral-200 text-[13px] text-neutral-900 focus:outline-none focus:border-indigo-500" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-[13px] font-bold text-neutral-700 mb-2">人设定位</h4>
              <input type="text" placeholder="如：美妆评测、本地生活等" className="w-full p-2.5 rounded-lg border border-neutral-200 text-[13px] text-neutral-900 focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <h4 className="text-[13px] font-bold text-neutral-700 mb-2">每日安全发布配额</h4>
              <input type="number" defaultValue={2} className="w-full p-2.5 rounded-lg border border-neutral-200 text-[13px] text-neutral-900 focus:outline-none focus:border-indigo-500" />
            </div>
          </div>

          <div>
            <h4 className="text-[13px] font-bold text-neutral-700 mb-2">分配扫码执行人 (企微/个微)</h4>
            <select className="w-full p-2.5 rounded-lg border border-neutral-200 text-[13px] text-neutral-900 focus:outline-none focus:border-indigo-500 bg-white">
              <option value="none">-- 暂不分配，放入公共池 --</option>
              <option value="u1">李小雅 (区域经理)</option>
              <option value="u2">张大潘 (客服)</option>
            </select>
            <p className="text-[11px] text-neutral-500 mt-1.5">分配后，需要人工发帖的内容将通过企微自动派发给该员工。</p>
          </div>
        </div>

        <div className="p-5 border-t border-neutral-100 bg-neutral-50/50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-[13px] font-bold text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors">
            取消
          </button>
          <button onClick={onClose} className="px-5 py-2 text-[13px] font-bold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-all flex items-center gap-2">
            保存并开始监测
          </button>
        </div>
      </div>
    </div>
  );
};
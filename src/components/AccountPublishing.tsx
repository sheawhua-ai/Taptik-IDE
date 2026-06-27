import React, { useState } from 'react';
import { 
  Users, AlertCircle, TrendingUp, Search, Filter,
  Smartphone, Bell, CheckCircle2, XCircle, Clock, 
  ArrowRight, ShieldAlert, Sparkles, Send, Box,
  Play, Pause, Settings, Info, QrCode
} from 'lucide-react';

export const AccountPublishing: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'assets' | 'dispatch'>('assets');
  const [isApplyPlanDrawerOpen, setIsApplyPlanDrawerOpen] = useState(false);
  const [isAccountDetailDrawerOpen, setIsAccountDetailDrawerOpen] = useState(false);

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
        {activeTab === 'assets' && <AccountAssetsView onOpenAccount={() => setIsAccountDetailDrawerOpen(true)} />}
        {activeTab === 'dispatch' && <PublishingDispatchView onOpenApplyPlan={() => setIsApplyPlanDrawerOpen(true)} />}
      </div>

      {/* Drawers */}
      {isApplyPlanDrawerOpen && (
        <ApplyPlanDrawer onClose={() => setIsApplyPlanDrawerOpen(false)} />
      )}
      {isAccountDetailDrawerOpen && (
        <AccountDetailDrawer onClose={() => setIsAccountDetailDrawerOpen(false)} />
      )}
    </div>
  );
};

const AccountAssetsView = ({ onOpenAccount }: { onOpenAccount: () => void }) => {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 pb-20">
      {/* Overview & AI Insights */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-1">
            <Sparkles size={16} />
          </div>
          <div>
            <h3 className="text-[16px] font-medium text-neutral-900 leading-relaxed">
              当前商家共有 42 个账号资产，18 个账号今日可承接发布，1 个账号疑似限流，3 个账号适合投流放大。
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-6 gap-4">
          {[
            { label: '品牌/矩阵号', value: '8' },
            { label: '员工 KOS', value: '12' },
            { label: '达人/KOC', value: '6' },
            { label: '外部账号池', value: '16' },
            { label: '今日可发', value: '18', highlight: true },
            { label: '异常账号', value: '1', error: true },
          ].map((stat, i) => (
            <div key={i} className={`p-4 rounded-xl border ${stat.error ? 'border-rose-100 bg-rose-50/50' : 'border-neutral-100 bg-neutral-50/50'}`}>
              <div className="text-[12px] text-neutral-500 mb-1">{stat.label}</div>
              <div className={`text-[24px] font-semibold ${stat.error ? 'text-rose-600' : stat.highlight ? 'text-emerald-600' : 'text-neutral-900'}`}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 mt-6 pt-6 border-t border-neutral-100 justify-end">
          <button className="px-4 py-2 text-[14px] font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
            处理异常账号
          </button>
          <button className="px-4 py-2 text-[14px] font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
            查看投流建议
          </button>
        </div>
      </div>

      {/* Ad Opportunities */}
      <div>
        <h3 className="text-[15px] font-semibold text-neutral-900 mb-4 flex items-center gap-2">
          <TrendingUp size={16} className="text-orange-500" />
          投流机会
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-100/50 p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-[11px] font-medium rounded">A01 品牌号</span>
              <span className="text-[13px] text-orange-900 font-medium">适合小额薯条放大</span>
            </div>
            <p className="text-[12px] text-orange-800/80 mb-4 leading-relaxed">
              自然流内容表现好，互动率达到 6.2%，建议投入 500 元薯条。
            </p>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 bg-white text-orange-700 text-[12px] font-medium rounded-lg shadow-sm">查看建议</button>
              <button className="px-3 py-1.5 text-orange-700/70 hover:bg-white/50 text-[12px] font-medium rounded-lg transition-colors">忽略</button>
            </div>
          </div>
          <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-xl border border-indigo-100/50 p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[11px] font-medium rounded">A05 科普号</span>
              <span className="text-[13px] text-indigo-900 font-medium">适合聚光测试</span>
            </div>
            <p className="text-[12px] text-indigo-800/80 mb-4 leading-relaxed">
              专业科普点击稳定，转化线索成本低于行业 20%，建议聚光放量。
            </p>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 bg-white text-indigo-700 text-[12px] font-medium rounded-lg shadow-sm">查看建议</button>
              <button className="px-3 py-1.5 text-indigo-700/70 hover:bg-white/50 text-[12px] font-medium rounded-lg transition-colors">忽略</button>
            </div>
          </div>
        </div>
      </div>

      {/* Account Groups */}
      <div className="space-y-8">
        <div>
          <h3 className="text-[15px] font-semibold text-neutral-900 mb-4">自有可控账号</h3>
          <div className="grid grid-cols-2 gap-4">
            <AccountCard 
              name="奈雪-区域福利官" 
              type="品牌矩阵号" 
              position="福利/种草" 
              dailyAvailable="2/3"
              tags={["适合自然流", "适合活动承接"]}
              health="normal"
              suggestion="适合承接扫码发布包"
              onClick={onOpenAccount}
            />
            <AccountCard 
              name="奈雪的茶官方" 
              type="品牌官号" 
              position="品牌宣发" 
              dailyAvailable="0/1"
              adStatus="关"
              tags={["需人工发布", "适合专业科普"]}
              health="normal"
              suggestion="建议每周 2-3 篇深度内容"
              onClick={onOpenAccount}
            />
          </div>
        </div>
        
        <div>
          <h3 className="text-[15px] font-semibold text-neutral-900 mb-4">员工 KOS</h3>
          <div className="grid grid-cols-2 gap-4">
            <AccountCard 
              name="广州天河李店长" 
              type="店长号" 
              position="门店日常/探店" 
              dailyAvailable="1/1"
              adStatus="关"
              tags={["适合素人口吻", "适合自然流"]}
              health="warning"
              suggestion="近3日未更新，建议派发门店活动内容"
              onClick={onOpenAccount}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const AccountCard = ({ name, type, position, tags, health, suggestion, onClick, dailyAvailable, adStatus }: any) => {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-sm hover:shadow-md transition-shadow relative">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-[16px] font-medium text-neutral-900 flex items-center gap-2">
            {name}
            {health === 'warning' && <AlertCircle size={14} className="text-amber-500" />}
          </h4>
          <div className="text-[12px] text-neutral-500 mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>类型：{type}</span>
            <span className="w-1 h-1 rounded-full bg-neutral-300"></span>
            <span>定位：{position}</span>
            {dailyAvailable && (
              <>
                <span className="w-1 h-1 rounded-full bg-neutral-300"></span>
                <span>今日可发：{dailyAvailable}</span>
              </>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-1 items-end shrink-0">
          {tags.map((t: string) => (
            <span key={t} className={`px-2 py-0.5 text-[10px] rounded border whitespace-nowrap ${t.includes('限流') || t.includes('暂停') || t.includes('不建议') ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-neutral-100 text-neutral-600 border-neutral-200'}`}>
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 py-4 border-y border-neutral-100 mb-4">
        <div>
          <div className="text-[11px] text-neutral-400 mb-1">近 7 日发布</div>
          <div className="text-[14px] font-medium text-neutral-900">12</div>
        </div>
        <div>
          <div className="text-[11px] text-neutral-400 mb-1">互动率</div>
          <div className="text-[14px] font-medium text-neutral-900">4.8%</div>
        </div>
        <div>
          <div className="text-[11px] text-neutral-400 mb-1">投流状态</div>
          <div className="text-[14px] font-medium text-neutral-900">{adStatus || '开'}</div>
        </div>
        <div>
          <div className="text-[11px] text-neutral-400 mb-1">投流 ROI</div>
          <div className="text-[14px] font-medium text-neutral-900">1:3.2</div>
        </div>
      </div>

      <div className="bg-indigo-50/50 border border-indigo-100/50 rounded-lg p-3 flex items-start gap-2 mb-4">
        <Sparkles size={14} className="text-indigo-500 mt-0.5 shrink-0" />
        <p className="text-[12px] text-indigo-900/80 leading-relaxed">
          <strong>AI 建议：</strong> {suggestion}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={onClick} className="flex-1 py-1.5 text-[13px] font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors">
          账号详情
        </button>
        <button className="flex-1 py-1.5 text-[13px] font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors">
          查看待发
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
          <button className="px-6 py-2.5 bg-white border border-neutral-200 text-neutral-700 font-medium text-[14px] rounded-xl hover:bg-neutral-50 transition-colors whitespace-nowrap">
            调整分发偏好
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
          <span className="flex items-center gap-1.5"><Box size={14} className="text-neutral-400" /> 状态：<span className="text-primary-600 font-medium">{status}</span></span>
        </div>
      </div>
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="px-3 py-1.5 bg-neutral-100 text-neutral-700 text-[12px] font-medium rounded-lg hover:bg-neutral-200 transition-colors">查看包</button>
        <button className="px-3 py-1.5 bg-neutral-100 text-neutral-700 text-[12px] font-medium rounded-lg hover:bg-neutral-200 transition-colors">重新提醒</button>
        <button className="px-3 py-1.5 bg-neutral-900 text-white text-[12px] font-medium rounded-lg hover:bg-neutral-800 transition-colors">标记已发</button>
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

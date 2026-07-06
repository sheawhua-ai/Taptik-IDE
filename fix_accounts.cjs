const fs = require('fs');
const file = 'src/components/AccountPublishing.tsx';
let content = fs.readFileSync(file, 'utf8');

// The messed up part starts at Daily Inspection's divide-y.
// Let's find it. We know what the Daily Inspection looks like from our earlier dump.
// We can just find AccountAssetsView and replace the whole function.

const replacement = `const AccountAssetsView = ({ onOpenAccount, onAddAccount }: { onOpenAccount: () => void, onAddAccount: () => void }) => {
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
`;

const regex = /const AccountAssetsView = \(\{.*?\) => \{[\s\S]*?(?=const AccountListItem =)/;
content = content.replace(regex, replacement);

fs.writeFileSync(file, content);
console.log("Success fix accounts");

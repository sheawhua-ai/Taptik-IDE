import React, { useState } from 'react';
import { 
  Camera, Users, FileImage, AlertOctagon, X, Search, Filter, 
  ChevronRight, CheckCircle2, Clock, AlertCircle, PlayCircle, 
  User, Image as ImageIcon, Copy, Download, RefreshCw, Send, Check
} from 'lucide-react';

interface Props {
  onClose: () => void;
  initialTab?: string;
}

export function ShootingAndUploadWorkbench({ onClose, initialTab = 'employee' }: Props) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [activeEmployeeView, setActiveEmployeeView] = useState('list'); // list, confirm, dispatch, detail
  const [activeConsumerView, setActiveConsumerView] = useState('list'); // list, create, progress, image_detail
  const [activeExceptionView, setActiveExceptionView] = useState('list');

  const renderTopActions = () => {
    switch (activeTab) {
      case 'employee':
        return <button className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-[13px] font-bold hover:bg-neutral-800 transition-colors">确认并派发拍摄包</button>;
      case 'consumer':
        return <button className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-[13px] font-bold hover:bg-neutral-800 transition-colors" onClick={() => setActiveConsumerView('create')}>生成体验领取入口</button>;
      case 'progress':
        return null;
      case 'exception':
        return <button className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-[13px] font-bold hover:bg-neutral-800 transition-colors">处理下一项</button>;
    }
  };

  return (
    <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-50 flex justify-end">
      <div className="w-[1100px] bg-white h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="px-6 py-5 border-b border-neutral-200 flex justify-between items-center bg-white shrink-0">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-[18px] font-bold text-neutral-900">拍摄与回传</h2>
              <span className="px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded text-[12px] font-medium">当前18篇笔记需要素材</span>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[12px] font-medium border border-emerald-100">7篇素材已齐</span>
              <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[12px] font-medium border border-blue-100">6篇拍摄中</span>
              <span className="px-2 py-0.5 bg-rose-50 text-rose-600 rounded text-[12px] font-medium border border-rose-100">5篇仍有缺口</span>
              <span className="px-2 py-0.5 bg-amber-50 text-amber-600 rounded text-[12px] font-medium border border-amber-100">3项需要介入</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {renderTopActions()}
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 text-neutral-500 transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 border-b border-neutral-200 bg-neutral-50/50 flex gap-6 shrink-0">
          {[
            { id: 'employee', label: '员工拍摄', icon: Camera },
            { id: 'consumer', label: '消费者体验', icon: Users },
            { id: 'progress', label: '笔记素材进度', icon: FileImage },
            { id: 'exception', label: '异常处理', icon: AlertOctagon },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setActiveEmployeeView('list');
                setActiveConsumerView('list');
              }}
              className={`py-4 px-2 border-b-2 flex items-center gap-2 transition-colors ${activeTab === tab.id ? 'border-neutral-900 text-neutral-900 font-bold' : 'border-transparent text-neutral-500 hover:text-neutral-700'}`}
            >
              <tab.icon size={16} />
              <span className="text-[14px]">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden bg-neutral-50 relative">
          {activeTab === 'employee' && (
            <EmployeeTab activeView={activeEmployeeView} setView={setActiveEmployeeView} />
          )}
          {activeTab === 'consumer' && (
            <ConsumerTab activeView={activeConsumerView} setView={setActiveConsumerView} />
          )}
          {activeTab === 'progress' && (
            <ProgressTab />
          )}
          {activeTab === 'exception' && (
            <ExceptionTab />
          )}
        </div>
      </div>
    </div>
  );
}

function EmployeeTab({ activeView, setView }: { activeView: string, setView: (v: string) => void }) {
  if (activeView === 'confirm') return <ConfirmArrangementView onBack={() => setView('list')} onNext={() => setView('dispatch')} />;
  if (activeView === 'dispatch') return <DispatchTaskView onBack={() => setView('confirm')} onDone={() => setView('list')} />;
  if (activeView === 'detail') return <EmployeeDetailView onBack={() => setView('list')} />;

  return (
    <div className="h-full flex flex-col p-6 overflow-y-auto">
      <div className="flex items-center gap-4 mb-6">
        <div className="flex bg-white rounded-lg border border-neutral-200 p-1">
          {['待确认', '待派发', '未开始', '拍摄中', '等待补拍', '已完成', '有异常'].map(status => (
            <button key={status} className="px-4 py-1.5 text-[13px] rounded-md hover:bg-neutral-50 text-neutral-600">{status}</button>
          ))}
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-neutral-200">
          <Search size={14} className="text-neutral-400" />
          <input type="text" placeholder="搜索项目/地点/执行人..." className="text-[13px] outline-none w-48" />
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-[13px] text-neutral-600 hover:bg-neutral-50">
          <Filter size={14} /> 筛选
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Card 1 */}
        <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 bg-amber-50 text-amber-600 border border-amber-200 rounded text-[11px] font-bold">待确认</span>
                <h3 className="text-[15px] font-bold text-neutral-900">门店喂食场景</h3>
              </div>
              <div className="text-[12px] text-neutral-500 mt-2 flex items-center gap-3">
                <span className="flex items-center gap-1"><User size={13}/> 店长A</span>
                <span className="flex items-center gap-1"><Clock size={13}/> 截止: 7月12日 18:00</span>
              </div>
            </div>
          </div>
          
          <div className="bg-neutral-50 rounded-lg p-3 mb-4 space-y-1.5">
            <div className="text-[12px] text-neutral-600 flex justify-between"><span>涉及笔记:</span> <span className="font-bold text-neutral-900">6 篇</span></div>
            <div className="text-[12px] text-neutral-600 flex justify-between"><span>需要素材位:</span> <span className="font-bold text-neutral-900">12 个</span></div>
            <div className="text-[12px] text-neutral-600 flex justify-between"><span>当前进度:</span> <span className="text-neutral-900">已完成 8 / 缺 4</span></div>
            <div className="text-[12px] text-neutral-600 flex justify-between"><span>就绪笔记:</span> <span className="text-emerald-600 font-bold">3 篇</span></div>
          </div>

          <div className="flex gap-2">
            <button onClick={() => setView('confirm')} className="flex-1 py-2 bg-neutral-900 text-white rounded-lg text-[12px] font-bold hover:bg-neutral-800 transition-colors">确认拍摄安排</button>
            <button className="px-3 py-2 bg-white border border-neutral-200 text-neutral-600 rounded-lg text-[12px] font-bold hover:bg-neutral-50 transition-colors">拆分/调整</button>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-200 rounded text-[11px] font-bold">拍摄中</span>
                <h3 className="text-[15px] font-bold text-neutral-900">室外遛狗场景</h3>
              </div>
              <div className="text-[12px] text-neutral-500 mt-2 flex items-center gap-3">
                <span className="flex items-center gap-1"><User size={13}/> 员工B</span>
                <span className="flex items-center gap-1"><Clock size={13}/> 截止: 7月10日 20:00</span>
              </div>
            </div>
          </div>
          
          <div className="bg-neutral-50 rounded-lg p-3 mb-4 space-y-1.5">
            <div className="text-[12px] text-neutral-600 flex justify-between"><span>涉及笔记:</span> <span className="font-bold text-neutral-900">4 篇</span></div>
            <div className="text-[12px] text-neutral-600 flex justify-between"><span>需要素材位:</span> <span className="font-bold text-neutral-900">8 个</span></div>
            <div className="text-[12px] text-neutral-600 flex justify-between"><span>当前进度:</span> <span className="text-neutral-900">已完成 2 / 缺 6</span></div>
            <div className="text-[12px] text-neutral-600 flex justify-between"><span>就绪笔记:</span> <span className="text-neutral-400 font-bold">0 篇</span></div>
          </div>

          <div className="flex gap-2">
            <button onClick={() => setView('detail')} className="flex-1 py-2 bg-neutral-900 text-white rounded-lg text-[12px] font-bold hover:bg-neutral-800 transition-colors">查看进度</button>
            <button className="px-3 py-2 bg-white border border-neutral-200 text-neutral-600 rounded-lg text-[12px] font-bold hover:bg-neutral-50 transition-colors">提醒/延长时间</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConfirmArrangementView({ onBack, onNext }: { onBack: () => void, onNext: () => void }) {
  return (
    <div className="h-full flex flex-col bg-neutral-50">
      <div className="p-6 pb-0">
        <button onClick={onBack} className="flex items-center gap-1 text-[13px] text-neutral-500 hover:text-neutral-800 mb-4">
          <X size={14} /> 取消确认
        </button>
        <h2 className="text-[20px] font-bold text-neutral-900 mb-2">确认拍摄安排</h2>
        <p className="text-[13px] text-neutral-500">18个素材位已整理为4个场景拍摄包，涉及12篇笔记。</p>
        
        <div className="mt-4 p-3 bg-blue-50 text-blue-800 text-[12px] rounded-lg border border-blue-100 flex items-start gap-2">
          <AlertCircle size={14} className="shrink-0 mt-0.5" />
          <span>相同场景可以集中拍摄，但每张成片只分配给一篇笔记，请拍摄足够的角度、动作和构图变化。</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm">
          <div className="flex justify-between items-start mb-4 border-b border-neutral-100 pb-4">
            <div>
              <h3 className="text-[16px] font-bold text-neutral-900">门店喂食场景</h3>
              <div className="flex gap-4 mt-2 text-[13px] text-neutral-500">
                <span className="flex items-center gap-1"><X size={14}/> 地点: 门店体验区</span>
                <span className="flex items-center gap-1"><X size={14}/> 商品: 幼犬粮</span>
                <span className="flex items-center gap-1"><X size={14}/> 人物: 店员 + 幼犬</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[12px] text-neutral-500 mb-1">预计拍摄</div>
              <div className="text-[15px] font-bold text-neutral-900">15 分钟</div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-5">
            <div className="bg-neutral-50 p-3 rounded-lg text-center">
              <div className="text-[20px] font-bold text-neutral-900">6</div>
              <div className="text-[11px] text-neutral-500 mt-1">拍摄动作</div>
            </div>
            <div className="bg-neutral-50 p-3 rounded-lg text-center">
              <div className="text-[20px] font-bold text-neutral-900">12</div>
              <div className="text-[11px] text-neutral-500 mt-1">需要成片</div>
            </div>
            <div className="bg-neutral-50 p-3 rounded-lg text-center">
              <div className="text-[20px] font-bold text-primary-600">6</div>
              <div className="text-[11px] text-neutral-500 mt-1">支持笔记</div>
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={onNext} className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-[13px] font-bold hover:bg-neutral-800 transition-colors">确认并进入派发</button>
            <button className="px-4 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-lg text-[13px] font-bold hover:bg-neutral-50 transition-colors">拆分</button>
            <button className="px-4 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-lg text-[13px] font-bold hover:bg-neutral-50 transition-colors">调整场景</button>
          </div>
        </div>
      </div>
      
      <div className="p-4 border-t border-neutral-200 bg-white flex justify-between">
        <button className="px-4 py-2 text-neutral-600 text-[13px] font-bold hover:bg-neutral-50 rounded-lg">返回调整笔记</button>
        <button onClick={onNext} className="px-6 py-2 bg-primary-600 text-white text-[13px] font-bold rounded-lg hover:bg-primary-700 shadow-sm">一键确认全部</button>
      </div>
    </div>
  );
}

function DispatchTaskView({ onBack, onDone }: { onBack: () => void, onDone: () => void }) {
  return (
    <div className="h-full flex flex-col bg-neutral-50">
      <div className="p-6 pb-0">
        <button onClick={onBack} className="flex items-center gap-1 text-[13px] text-neutral-500 hover:text-neutral-800 mb-4">
          <X size={14} /> 返回
        </button>
        <h2 className="text-[20px] font-bold text-neutral-900 mb-6">派发拍摄任务：门店喂食场景</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6 pt-0 space-y-6">
        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm space-y-4">
          <div>
            <label className="block text-[12px] font-bold text-neutral-700 mb-1">执行人</label>
            <select className="w-full p-2.5 text-[13px] border border-neutral-200 rounded-lg outline-none focus:border-neutral-400">
              <option>店长 A</option>
              <option>员工 B</option>
            </select>
          </div>
          <div>
            <label className="block text-[12px] font-bold text-neutral-700 mb-1">拍摄地点</label>
            <input type="text" defaultValue="门店体验区" className="w-full p-2.5 text-[13px] border border-neutral-200 rounded-lg outline-none focus:border-neutral-400" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-bold text-neutral-700 mb-1">截止时间</label>
              <input type="datetime-local" defaultValue="2024-07-12T18:00" className="w-full p-2.5 text-[13px] border border-neutral-200 rounded-lg outline-none focus:border-neutral-400" />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-neutral-700 mb-1">预计时长</label>
              <input type="text" defaultValue="15分钟" disabled className="w-full p-2.5 text-[13px] bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-500" />
            </div>
          </div>
          <div className="border-t border-neutral-100 pt-4 mt-2">
            <div className="text-[13px] font-bold text-neutral-900 mb-3">规则设置</div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[13px] text-neutral-700">
                <input type="checkbox" defaultChecked className="rounded text-primary-600 focus:ring-primary-500" /> 允许从相册上传
              </label>
              <label className="flex items-center gap-2 text-[13px] text-neutral-700">
                <input type="checkbox" defaultChecked className="rounded text-primary-600 focus:ring-primary-500" /> 需要保留原图
              </label>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4 border-t border-neutral-200 bg-white flex justify-between items-center">
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-neutral-100 text-neutral-700 text-[13px] font-bold rounded-lg hover:bg-neutral-200 transition-colors">预览员工H5</button>
          <button className="px-4 py-2 bg-white border border-neutral-200 text-neutral-700 text-[13px] font-bold rounded-lg hover:bg-neutral-50 transition-colors">生成二维码</button>
        </div>
        <div className="flex gap-2">
          <button onClick={onDone} className="px-4 py-2 bg-white border border-neutral-200 text-neutral-700 text-[13px] font-bold rounded-lg hover:bg-neutral-50 transition-colors">暂不派发</button>
          <button onClick={onDone} className="px-6 py-2 bg-primary-600 text-white text-[13px] font-bold rounded-lg hover:bg-primary-700 shadow-sm flex items-center gap-2">
            <Send size={14} /> 发送任务
          </button>
        </div>
      </div>
    </div>
  );
}

function EmployeeDetailView({ onBack }: { onBack: () => void }) {
  return (
    <div className="h-full flex flex-col bg-neutral-50">
      <div className="px-6 py-4 bg-white border-b border-neutral-200 flex items-center gap-4 shrink-0">
        <button onClick={onBack} className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-neutral-100 text-neutral-500">
          <X size={16} />
        </button>
        <div>
          <h2 className="text-[16px] font-bold text-neutral-900">门店喂食场景</h2>
          <div className="text-[12px] text-neutral-500">执行人: 店长 A | 状态: 拍摄中</div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left: Actions */}
        <div className="w-[280px] bg-white border-r border-neutral-200 flex flex-col shrink-0 overflow-y-auto">
          <div className="p-4 border-b border-neutral-100 font-bold text-[13px] text-neutral-900 bg-neutral-50/50">拍摄动作</div>
          <div className="p-3 space-y-2">
            <div className="p-3 rounded-lg border border-primary-200 bg-primary-50 cursor-pointer">
              <div className="text-[13px] font-bold text-neutral-900 mb-1">1. 产品包装正面</div>
              <div className="text-[11px] text-neutral-500">需要 3 张 | 完成 3 张</div>
            </div>
            <div className="p-3 rounded-lg border border-neutral-100 bg-white hover:border-neutral-300 cursor-pointer">
              <div className="text-[13px] font-bold text-neutral-900 mb-1">2. 开袋与倒粮</div>
              <div className="text-[11px] text-neutral-500">需要 2 张 | 完成 1 张</div>
            </div>
            <div className="p-3 rounded-lg border border-neutral-100 bg-white hover:border-neutral-300 cursor-pointer">
              <div className="text-[13px] font-bold text-neutral-900 mb-1">3. 宠物闻粮</div>
              <div className="text-[11px] text-neutral-500">需要 2 张 | 完成 2 张</div>
            </div>
            <div className="p-3 rounded-lg border border-neutral-100 bg-white hover:border-neutral-300 cursor-pointer">
              <div className="text-[13px] font-bold text-neutral-900 mb-1">4. 真实进食</div>
              <div className="text-[11px] text-rose-500">需要 3 张 | 完成 1 张</div>
            </div>
            <div className="p-3 rounded-lg border border-neutral-100 bg-white hover:border-neutral-300 cursor-pointer opacity-60">
              <div className="text-[13px] font-bold text-neutral-900 mb-1">5. 产品与宠物同框</div>
              <div className="text-[11px] text-neutral-500">需要 2 张 | 未开始</div>
            </div>
          </div>
        </div>

        {/* Middle: Images */}
        <div className="flex-1 bg-neutral-50 flex flex-col min-w-0 overflow-y-auto p-6">
          <h3 className="text-[15px] font-bold text-neutral-900 mb-4">回传素材 - 产品包装正面</h3>
          <div className="grid grid-cols-2 gap-4">
            {/* Image Card */}
            <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm flex flex-col">
              <div className="h-40 bg-neutral-100 relative group">
                <div className="absolute inset-0 bg-neutral-900/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="px-3 py-1.5 bg-white rounded text-[12px] font-bold shadow">查看详情</button>
                </div>
                <div className="absolute top-2 left-2 px-2 py-1 bg-emerald-500 text-white text-[10px] font-bold rounded">已采用</div>
              </div>
              <div className="p-3 bg-white text-[12px]">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-neutral-500">适合: 首图</span>
                  <span className="text-neutral-900 font-bold">笔记 A</span>
                </div>
                <div className="text-neutral-400">隐私已处理</div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm flex flex-col">
              <div className="h-40 bg-neutral-100 relative group">
                 <div className="absolute top-2 left-2 px-2 py-1 bg-blue-500 text-white text-[10px] font-bold rounded">仅适合正文</div>
              </div>
              <div className="p-3 bg-white text-[12px]">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-neutral-500">当前分配: 正文配图</span>
                  <span className="text-neutral-900 font-bold">笔记 B</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl border border-rose-200 overflow-hidden shadow-sm flex flex-col ring-1 ring-rose-100">
              <div className="h-40 bg-neutral-100 relative group">
                 <div className="absolute top-2 left-2 px-2 py-1 bg-rose-500 text-white text-[10px] font-bold rounded">需要人工确认</div>
              </div>
              <div className="p-3 bg-white text-[12px]">
                <div className="text-rose-600 font-bold mb-1">图片模糊/疑似重复</div>
                <div className="flex gap-1 mt-2">
                  <button className="flex-1 py-1 bg-neutral-100 rounded hover:bg-neutral-200 font-bold">确认采用</button>
                  <button className="flex-1 py-1 bg-rose-50 text-rose-600 rounded hover:bg-rose-100 font-bold">要求补拍</button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-3">
            <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-[13px] font-bold text-amber-800 mb-1">仍需补拍 2 张</div>
              <div className="text-[12px] text-amber-700">当前动作的素材缺口，不合格图片不计入完成数。</div>
            </div>
          </div>
        </div>

        {/* Right: Progress */}
        <div className="w-[300px] bg-white border-l border-neutral-200 flex flex-col shrink-0 overflow-y-auto">
          <div className="p-4 border-b border-neutral-100 font-bold text-[13px] text-neutral-900 bg-neutral-50/50">笔记素材进度</div>
          <div className="p-4 space-y-4">
            <div className="bg-neutral-50 rounded-lg p-3 border border-neutral-100">
              <div className="text-[13px] font-bold text-neutral-900 mb-1">幼犬换粮误区</div>
              <div className="text-[11px] text-emerald-600 font-bold mb-2 flex items-center gap-1"><CheckCircle2 size={12}/> 素材已齐，可进入发布准备</div>
              <button className="w-full py-1.5 bg-white border border-neutral-200 rounded text-[11px] font-bold hover:bg-neutral-50">查看已就绪笔记</button>
            </div>
            
            <div className="bg-neutral-50 rounded-lg p-3 border border-neutral-100">
              <div className="text-[13px] font-bold text-neutral-900 mb-1">门店真实体验</div>
              <div className="text-[11px] text-rose-500 font-bold mb-2">缺1张包装正面图</div>
              <button className="w-full py-1.5 bg-white border border-neutral-200 rounded text-[11px] font-bold hover:bg-neutral-50">通知补拍缺口</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Consumer Tab Placeholders
function ConsumerTab({ activeView, setView }: { activeView: string, setView: (v: string) => void }) {
  if (activeView === 'create') return <ConsumerCreateView onBack={() => setView('list')} onDone={() => setView('list')} />;
  
  return (
    <div className="h-full flex flex-col p-6 overflow-y-auto">
      <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-sm mb-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-[15px] font-bold text-neutral-900">幼犬换粮真实体验</h3>
              <span className="px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-200 rounded text-[11px]">进行中</span>
            </div>
            <div className="text-[12px] text-neutral-500 mt-1">项目: 幼犬换粮搜索卡位 | 有效期至 7月20日</div>
          </div>
          <button className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-[12px] font-bold shadow-sm">查看参与进度</button>
        </div>
        
        <div className="grid grid-cols-6 gap-2">
          <div className="bg-neutral-50 p-3 rounded-lg text-center">
            <div className="text-[16px] font-bold text-neutral-900">30</div>
            <div className="text-[11px] text-neutral-500">名额</div>
          </div>
          <div className="bg-neutral-50 p-3 rounded-lg text-center">
            <div className="text-[16px] font-bold text-primary-600">18</div>
            <div className="text-[11px] text-neutral-500">已领取</div>
          </div>
          <div className="bg-neutral-50 p-3 rounded-lg text-center">
            <div className="text-[16px] font-bold text-neutral-900">16</div>
            <div className="text-[11px] text-neutral-500">问卷完成</div>
          </div>
          <div className="bg-neutral-50 p-3 rounded-lg text-center">
            <div className="text-[16px] font-bold text-neutral-900">11</div>
            <div className="text-[11px] text-neutral-500">素材完成</div>
          </div>
          <div className="bg-neutral-50 p-3 rounded-lg text-center">
            <div className="text-[16px] font-bold text-emerald-600">7</div>
            <div className="text-[11px] text-neutral-500">已发布</div>
          </div>
          <div className="bg-rose-50 p-3 rounded-lg text-center border border-rose-100">
            <div className="text-[16px] font-bold text-rose-600">3</div>
            <div className="text-[11px] text-rose-600">需要协助</div>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <h4 className="text-[14px] font-bold text-neutral-900 mb-4">服务器临时素材清理</h4>
        <div className="bg-white rounded-xl border border-neutral-200 p-5 flex items-center justify-between">
          <div>
            <div className="text-[13px] font-bold text-neutral-900 mb-1">3 组质量较好的体验图片将在 3 天后清理</div>
            <div className="text-[12px] text-neutral-500">当前临时占用 1.2GB，已保存到本地 45 组</div>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-lg text-[12px] font-bold hover:bg-neutral-50">查看并选择保存</button>
            <button className="px-4 py-2 bg-neutral-100 text-neutral-600 rounded-lg text-[12px] font-bold hover:bg-neutral-200">按计划清理</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConsumerCreateView({ onBack, onDone }: { onBack: () => void, onDone: () => void }) {
  const [step, setStep] = useState(1);
  
  return (
    <div className="h-full flex flex-col bg-neutral-50">
      <div className="p-6 bg-white border-b border-neutral-200 shrink-0">
        <button onClick={onBack} className="text-[13px] text-neutral-500 mb-4 self-start flex items-center gap-1 hover:text-neutral-900"><X size={14}/> 取消生成</button>
        <div className="flex justify-between items-center">
          <h2 className="text-[20px] font-bold text-neutral-900">生成体验领取入口</h2>
          <div className="flex items-center gap-2">
             <div className={`flex items-center justify-center w-6 h-6 rounded-full text-[12px] font-bold ${step >= 1 ? 'bg-neutral-900 text-white' : 'bg-neutral-200 text-neutral-500'}`}>1</div>
             <div className={`w-8 h-0.5 ${step >= 2 ? 'bg-neutral-900' : 'bg-neutral-200'}`}></div>
             <div className={`flex items-center justify-center w-6 h-6 rounded-full text-[12px] font-bold ${step >= 2 ? 'bg-neutral-900 text-white' : 'bg-neutral-200 text-neutral-500'}`}>2</div>
             <div className={`w-8 h-0.5 ${step >= 3 ? 'bg-neutral-900' : 'bg-neutral-200'}`}></div>
             <div className={`flex items-center justify-center w-6 h-6 rounded-full text-[12px] font-bold ${step >= 3 ? 'bg-neutral-900 text-white' : 'bg-neutral-200 text-neutral-500'}`}>3</div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 flex justify-center">
        <div className="w-[600px] space-y-6">
          {step === 1 && (
            <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm animate-in fade-in slide-in-from-bottom-2">
              <h3 className="text-[16px] font-bold text-neutral-900 mb-4 border-b border-neutral-100 pb-2">第一步：确认体验任务</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] font-bold text-neutral-700 mb-1">所属项目</label>
                    <div className="p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-[13px] text-neutral-600">幼犬换粮搜索卡位</div>
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-neutral-700 mb-1">产品/服务</label>
                    <div className="p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-[13px] text-neutral-600">幼犬专属粮 1.5kg</div>
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-neutral-700 mb-1">名额</label>
                    <input type="number" defaultValue="30" className="w-full p-2.5 border border-neutral-200 rounded-lg text-[13px] focus:outline-none focus:border-neutral-400" />
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-neutral-700 mb-1">有效期</label>
                    <input type="date" className="w-full p-2.5 border border-neutral-200 rounded-lg text-[13px] focus:outline-none focus:border-neutral-400" />
                  </div>
                </div>
                
                <div className="pt-4 border-t border-neutral-100">
                  <h4 className="text-[13px] font-bold text-neutral-900 mb-3">领取限制</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-[13px] text-neutral-700"><input type="checkbox" defaultChecked className="rounded" /> 本入口每人限领一次</label>
                    <label className="flex items-center gap-2 text-[13px] text-neutral-700"><input type="checkbox" className="rounded" /> 允许参与其他同产品活动</label>
                    <label className="flex items-center gap-2 text-[13px] text-neutral-700"><input type="checkbox" defaultChecked className="rounded" /> 同产品活动排他</label>
                  </div>
                  <div className="text-[11px] text-neutral-400 mt-2">限制只对当前领取入口生效。运营可以为不同私域群建立不同入口。</div>
                </div>
                
                <div className="flex gap-2 justify-end pt-4">
                  <button className="px-4 py-2 bg-neutral-100 text-neutral-600 rounded-lg text-[13px] font-bold">调整任务说明</button>
                  <button onClick={() => setStep(2)} className="px-6 py-2 bg-neutral-900 text-white rounded-lg text-[13px] font-bold hover:bg-neutral-800">下一步</button>
                </div>
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm animate-in fade-in slide-in-from-bottom-2">
              <h3 className="text-[16px] font-bold text-neutral-900 mb-4 border-b border-neutral-100 pb-2">第二步：确认内容边界</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-[13px] font-bold text-neutral-700 mb-2">问卷将询问的真实信息</h4>
                  <div className="bg-neutral-50 p-3 rounded-lg text-[13px] text-neutral-600 border border-neutral-200">狗狗年龄、品种、过去换粮是否软便、首次试吃反馈</div>
                </div>
                <div>
                  <h4 className="text-[13px] font-bold text-neutral-700 mb-2">内容包的表达方向</h4>
                  <div className="bg-neutral-50 p-3 rounded-lg text-[13px] text-neutral-600 border border-neutral-200">真实分享幼犬换粮经验，强调七日换粮法和适口性。</div>
                </div>
                <div>
                  <h4 className="text-[13px] font-bold text-neutral-700 mb-2">不允许出现的承诺</h4>
                  <div className="bg-rose-50 p-3 rounded-lg text-[13px] text-rose-700 border border-rose-100">"绝对不软便"、"兽医推荐"、"治愈玻璃胃"</div>
                </div>
                <div>
                  <h4 className="text-[13px] font-bold text-neutral-700 mb-2">固定拍摄主题</h4>
                  <div className="bg-neutral-50 p-3 rounded-lg text-[13px] text-neutral-600 border border-neutral-200">狗狗与包装同框、真实进食抓拍、颗粒对比</div>
                </div>
                
                <div className="flex gap-2 justify-end pt-4">
                  <button onClick={() => setStep(1)} className="px-4 py-2 bg-white border border-neutral-200 text-neutral-600 rounded-lg text-[13px] font-bold">上一步</button>
                  <button className="px-4 py-2 bg-neutral-100 text-neutral-600 rounded-lg text-[13px] font-bold">调整问卷</button>
                  <button className="px-4 py-2 bg-neutral-100 text-neutral-600 rounded-lg text-[13px] font-bold">调整内容边界</button>
                  <button onClick={() => setStep(3)} className="px-6 py-2 bg-neutral-900 text-white rounded-lg text-[13px] font-bold hover:bg-neutral-800">下一步</button>
                </div>
              </div>
            </div>
          )}
          
          {step === 3 && (
            <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm animate-in fade-in slide-in-from-bottom-2">
              <h3 className="text-[16px] font-bold text-neutral-900 mb-4 border-b border-neutral-100 pb-2">第三步：生成入口</h3>
              <div className="flex flex-col items-center justify-center py-6">
                <div className="w-40 h-40 bg-neutral-100 border border-neutral-200 rounded-xl mb-4 flex items-center justify-center text-neutral-400">
                  [二维码占位]
                </div>
                <div className="bg-neutral-50 px-4 py-2 rounded-lg border border-neutral-200 text-[13px] font-mono text-neutral-600 flex items-center gap-2 mb-6">
                  https://app.example.com/join/a8b9c0
                  <button className="text-primary-600 hover:text-primary-700"><Copy size={14}/></button>
                </div>
                
                <div className="w-full bg-blue-50 p-4 rounded-lg border border-blue-100 text-[12px] text-blue-800 space-y-1 mb-6">
                  <div><span className="font-bold">剩余名额:</span> 30 / 30</div>
                  <div><span className="font-bold">每人领取次数:</span> 1 次</div>
                  <div><span className="font-bold">排他规则:</span> 限制参与其他同产品活动</div>
                </div>
                
                <div className="flex gap-3 w-full">
                  <button className="flex-1 py-2.5 bg-white border border-neutral-200 text-neutral-700 rounded-lg text-[13px] font-bold hover:bg-neutral-50 flex items-center justify-center gap-2"><Download size={16}/> 下载二维码</button>
                  <button className="flex-1 py-2.5 bg-white border border-neutral-200 text-neutral-700 rounded-lg text-[13px] font-bold hover:bg-neutral-50 flex items-center justify-center gap-2"><PlayCircle size={16}/> 预览H5</button>
                  <button onClick={onDone} className="flex-1 py-2.5 bg-emerald-600 text-white rounded-lg text-[13px] font-bold hover:bg-emerald-700 shadow flex items-center justify-center gap-2"><Check size={16}/> 开放领取</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProgressTab() {
  return (
    <div className="h-full flex flex-col p-6 overflow-y-auto">
      <h3 className="text-[16px] font-bold text-neutral-900 mb-4">项目: 幼犬换粮搜索卡位</h3>
      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-[13px]">
          <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-bold">
            <tr>
              <th className="p-4">笔记</th>
              <th className="p-4">内容类型</th>
              <th className="p-4">进度</th>
              <th className="p-4">状态</th>
              <th className="p-4 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            <tr>
              <td className="p-4 font-bold text-neutral-900">幼犬换粮误区</td>
              <td className="p-4 text-neutral-600">干货科普</td>
              <td className="p-4 text-neutral-600">5/5 (必需)</td>
              <td className="p-4"><span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded font-bold">素材已齐</span></td>
              <td className="p-4 text-right">
                <button className="text-primary-600 font-bold hover:text-primary-700">进入发布准备</button>
              </td>
            </tr>
            <tr>
              <td className="p-4 font-bold text-neutral-900">门店真实体验</td>
              <td className="p-4 text-neutral-600">探店打卡</td>
              <td className="p-4 text-neutral-600">3/4 (必需)</td>
              <td className="p-4"><span className="text-blue-600 bg-blue-50 px-2 py-1 rounded font-bold">员工拍摄中</span></td>
              <td className="p-4 text-right">
                <button className="text-neutral-600 font-bold hover:text-neutral-900">查看拍摄任务</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ExceptionTab() {
  return (
    <div className="h-full flex flex-col p-6 overflow-y-auto">
      <div className="space-y-4">
        <div className="bg-white rounded-xl border border-rose-200 p-5 shadow-sm">
          <div className="flex justify-between items-start mb-3">
            <div>
              <span className="px-2 py-0.5 bg-rose-50 text-rose-600 border border-rose-200 rounded text-[11px] font-bold mb-2 inline-block">多次不合格</span>
              <h3 className="text-[15px] font-bold text-neutral-900">连续三次上传不合格</h3>
              <div className="text-[12px] text-neutral-500 mt-1">参与者: 微信用户_123 | 关联笔记: 幼犬换粮误区</div>
            </div>
            <button className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-[12px] font-bold">人工确认采用</button>
          </div>
          <div className="bg-neutral-50 p-3 rounded-lg text-[13px] text-neutral-700 border border-neutral-200">
            原因: 每次上传的图片都包含竞品包装，系统自动退回。
          </div>
        </div>
      </div>
    </div>
  );
}

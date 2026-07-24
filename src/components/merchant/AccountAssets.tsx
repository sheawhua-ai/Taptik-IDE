import React from "react";
import { Users, Plus, Edit2, Key, Activity } from "lucide-react";

export function AccountAssets() {
  return (
    <div className="flex-1 flex flex-col bg-[#fcfcfc] overflow-hidden">
      <div className="px-8 py-6 border-b border-neutral-200 shrink-0 bg-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-[20px] font-bold text-neutral-900">账号资产管理</h1>
            <p className="text-[13px] text-neutral-500 mt-1">长期保存项目沉淀、发布记录、账号资产与互动线索结果。卡点处理请前往执行中心。</p>
          </div>
          <button className="px-4 py-2 bg-neutral-900 text-white rounded-xl text-[13px] font-bold flex items-center gap-2 hover:bg-neutral-800 shadow-sm transition-all">
            <Plus size={16} /> 新增账号授权
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto space-y-10">
          
          {/* 自有及可调度账号 */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1.5 h-5 bg-[#e11d48] rounded-full"></div>
              <h2 className="text-[16px] font-bold text-neutral-900">自有及可调度账号</h2>
            </div>
            
            <div className="bg-white border border-neutral-100 rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-100 bg-neutral-50/50">
                    <th className="px-6 py-4 text-[13px] font-bold text-neutral-600 whitespace-nowrap">小红书昵称 / 状态</th>
                    <th className="px-6 py-4 text-[13px] font-bold text-neutral-600 whitespace-nowrap">账号类型</th>
                    <th className="px-6 py-4 text-[13px] font-bold text-neutral-600 whitespace-nowrap">关系 / 关联员工</th>
                    <th className="px-6 py-4 text-[13px] font-bold text-neutral-600 whitespace-nowrap">人设状态</th>
                    <th className="px-6 py-4 text-[13px] font-bold text-neutral-600 whitespace-nowrap">项目数 / 笔记数</th>
                    <th className="px-6 py-4 text-[13px] font-bold text-neutral-600 whitespace-nowrap text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  <tr className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center shrink-0 mt-0.5">
                           <Users size={14} className="text-neutral-500"/>
                        </div>
                        <div>
                          <div className="text-[14px] font-bold text-neutral-900 mb-1.5">小红书-A02</div>
                          <span className="inline-flex px-2 py-0.5 bg-amber-50 text-amber-600 border border-amber-100 text-[11px] font-bold rounded">待观察</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[13px] text-neutral-600">KOS</td>
                    <td className="px-6 py-4">
                      <div className="text-[13px] text-neutral-900 mb-0.5">员工</div>
                      <div className="text-[12px] text-neutral-400">张三</div>
                    </td>
                    <td className="px-6 py-4 text-[13px] text-neutral-600">成分党评测</td>
                    <td className="px-6 py-4">
                      <div className="text-[13px]"><span className="text-neutral-900">3</span> <span className="text-neutral-300 mx-1">/</span> <span className="text-emerald-500">45</span></div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="px-4 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 text-[12px] font-bold rounded-lg transition-colors">详情</button>
                    </td>
                  </tr>
                  <tr className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center shrink-0 mt-0.5">
                           <Users size={14} className="text-neutral-500"/>
                        </div>
                        <div>
                          <div className="text-[14px] font-bold text-neutral-900 mb-1.5">品牌官方账号</div>
                          <span className="inline-flex px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 text-[11px] font-bold rounded">正常</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[13px] text-neutral-600">专业号</td>
                    <td className="px-6 py-4">
                      <div className="text-[13px] text-neutral-900 mb-0.5">自有</div>
                      <div className="text-[12px] text-neutral-400">品牌组</div>
                    </td>
                    <td className="px-6 py-4 text-[13px] text-neutral-600">官方发布</td>
                    <td className="px-6 py-4">
                      <div className="text-[13px]"><span className="text-neutral-900">12</span> <span className="text-neutral-300 mx-1">/</span> <span className="text-emerald-500">128</span></div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="px-4 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 text-[12px] font-bold rounded-lg transition-colors">详情</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 外部合作账号 */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1.5 h-5 bg-[#e11d48] rounded-full"></div>
              <h2 className="text-[16px] font-bold text-neutral-900">外部合作账号</h2>
            </div>
            
            <div className="bg-white border border-neutral-100 rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-100 bg-neutral-50/50">
                    <th className="px-6 py-4 text-[13px] font-bold text-neutral-600 whitespace-nowrap">小红书昵称 / 状态</th>
                    <th className="px-6 py-4 text-[13px] font-bold text-neutral-600 whitespace-nowrap">账号类型</th>
                    <th className="px-6 py-4 text-[13px] font-bold text-neutral-600 whitespace-nowrap">关系 / 关联员工</th>
                    <th className="px-6 py-4 text-[13px] font-bold text-neutral-600 whitespace-nowrap">人设状态</th>
                    <th className="px-6 py-4 text-[13px] font-bold text-neutral-600 whitespace-nowrap">项目数 / 笔记数</th>
                    <th className="px-6 py-4 text-[13px] font-bold text-neutral-600 whitespace-nowrap text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                   <tr>
                     <td colSpan={6} className="px-6 py-12 text-center text-[13px] text-neutral-400">
                       暂无外部合作账号
                     </td>
                   </tr>
                </tbody>
              </table>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

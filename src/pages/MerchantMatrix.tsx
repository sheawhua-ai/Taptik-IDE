import React from 'react';

export default function MerchantMatrix() {
  return (
    <div className="px-8 py-8 space-y-8 max-w-[1600px] mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 text-zinc-500 text-xs mb-1">
            <span>商家列表</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-zinc-800 font-semibold">商家配置：极氪智慧出行</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900">极氪智慧出行 <span className="text-sm font-normal text-zinc-500 ml-2 tracking-normal">(ID: TENANT_0829)</span></h2>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white font-semibold rounded-xl text-sm transition-all active:scale-95 shadow-lg shadow-zinc-200">
            <span className="material-symbols-outlined text-sm">save</span> 保存全局配置
          </button>
        </div>
      </div>

      {/* 转化率监控 */}
      <div className="bg-white rounded-2xl p-6 border border-zinc-100 shadow-sm flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-zinc-800 mb-1">商家整体转化率监控</h3>
          <p className="text-xs text-zinc-500">实时监控该商家所有矩阵账号的线索转化效率</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">当前转化率</p>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-black text-zinc-900 tracking-tight">2.4%</span>
              <span className="text-xs font-bold text-red-500 mb-1 flex items-center bg-red-50 px-1.5 py-0.5 rounded"><span className="material-symbols-outlined text-[14px]">arrow_downward</span> 1.2%</span>
            </div>
          </div>
          <div className="w-[1px] h-10 bg-zinc-200"></div>
          <div className="max-w-xs">
            <div className="p-2.5 bg-red-50 rounded-lg border border-red-100 flex items-start gap-2">
              <span className="material-symbols-outlined text-red-500 text-[16px]">warning</span>
              <p className="text-[11px] text-red-700 font-medium leading-tight">转化率出现异常下降，建议检查右侧的“知识库精准度”或调整“AI 导购话术规范”。</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* 左侧：知识库与精准度 */}
        <section className="col-span-12 lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-zinc-100 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-base font-bold flex items-center gap-2 text-zinc-900">
                  <span className="material-symbols-outlined text-[#5157a7]" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
                  品牌专属知识库
                </h3>
                <p className="text-xs text-zinc-500 mt-1">上传品牌手册、活动话术，确保 AI 回复准确无误。</p>
              </div>
            </div>
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-100 text-red-600 flex items-center justify-center rounded-lg">
                    <span className="material-symbols-outlined text-lg">description</span>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-zinc-800">品牌调性手册.pdf</div>
                    <div className="text-[10px] text-zinc-500">2.4MB • 已学习</div>
                  </div>
                </div>
                <button className="text-zinc-400 hover:text-red-500 transition-colors"><span className="material-symbols-outlined text-sm">delete</span></button>
              </div>
              <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#e0e0ff] text-[#5157a7] flex items-center justify-center rounded-lg">
                    <span className="material-symbols-outlined text-lg">text_snippet</span>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-zinc-800">Q3活动话术补丁.txt</div>
                    <div className="text-[10px] text-zinc-500">42KB • 已学习</div>
                  </div>
                </div>
                <button className="text-zinc-400 hover:text-red-500 transition-colors"><span className="material-symbols-outlined text-sm">delete</span></button>
              </div>
            </div>
            <button className="w-full py-2.5 border-2 border-dashed border-zinc-200 text-zinc-600 rounded-xl text-xs font-bold hover:border-[#5157a7] hover:text-[#5157a7] transition-colors flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[16px]">upload_file</span> 上传新文档
            </button>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-zinc-100 shadow-sm">
            <h3 className="text-base font-bold flex items-center gap-2 text-zinc-900 mb-6">
              <span className="material-symbols-outlined text-emerald-600">tune</span>
              知识库精准度调节
            </h3>
            <div className="space-y-8">
              <div>
                <div className="flex justify-between text-xs mb-3">
                  <span className="font-bold text-zinc-700">内容匹配严格度</span>
                  <span className="font-mono text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">0.75</span>
                </div>
                <input type="range" min="0" max="1" step="0.01" defaultValue="0.75" className="w-full accent-emerald-600 h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer" />
                <div className="flex justify-between text-[10px] text-zinc-400 mt-2 font-medium">
                  <span>更宽泛 (易胡编乱造)</span>
                  <span>更严格 (易回答不知道)</span>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-xs mb-3">
                  <span className="font-bold text-zinc-700">单次参考资料数量</span>
                  <span className="font-mono text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">5</span>
                </div>
                <input type="range" min="1" max="20" step="1" defaultValue="5" className="w-full accent-emerald-600 h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer" />
              </div>
            </div>
          </div>
        </section>

        {/* 右侧：Prompt 与 账号池 */}
        <section className="col-span-12 lg:col-span-7 space-y-6">
          <div className="bg-zinc-900 rounded-2xl p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold flex items-center gap-2 text-white">
                <span className="material-symbols-outlined text-[#e0e0ff]">code_blocks</span> 
                AI 导购话术规范 (人设设定)
              </h3>
              <button className="text-xs text-[#e0e0ff] font-bold hover:underline flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">history</span> 历史版本</button>
            </div>
            <p className="text-xs text-zinc-400 mb-4">设定 AI 导购的性格、语气以及必须遵守的商业规则。</p>
            <textarea 
              className="w-full h-48 bg-zinc-950 text-zinc-200 text-sm p-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#5157a7] leading-relaxed resize-none border border-zinc-800"
              defaultValue={`你是一个专业的汽车销售顾问。
你的目标是解答客户疑问，并尽可能引导客户留下联系方式或预约试驾。
语气要求：专业、热情、不卑不亢。

【约束条件】
1. 绝对不能直接拒绝客户的寻车需求，如果没有现货，必须引导预定。
2. 回复字数控制在 100 字以内。
3. 必须使用 Emoji 增加亲和力。`}
            ></textarea>
            <div className="mt-4 flex justify-end gap-3">
              <button className="px-4 py-2 bg-zinc-800 text-zinc-300 text-xs font-bold rounded-lg hover:bg-zinc-700 active:scale-95 transition-all">运行测试</button>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-zinc-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-base font-bold text-zinc-900">分发账号池</h3>
                <p className="text-xs text-zinc-500 mt-1">管理该商家下所有用于自动发文的矩阵账号。</p>
              </div>
              <div className="flex gap-3">
                <div className="flex items-center gap-1.5 bg-zinc-50 p-1 rounded-full px-3 border border-zinc-100">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <span className="text-[10px] font-bold text-zinc-700">健康: 98</span>
                </div>
                <div className="flex items-center gap-1.5 bg-zinc-50 p-1 rounded-full px-3 border border-zinc-100">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  <span className="text-[10px] font-bold text-zinc-700">异常: 12</span>
                </div>
              </div>
            </div>
            <div className="overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-black text-zinc-400 uppercase tracking-widest border-b border-zinc-100">
                    <th className="pb-3">账号名称</th>
                    <th className="pb-3 text-center">状态</th>
                    <th className="pb-3">发文额度</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  <tr className="hover:bg-zinc-50 transition-colors">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-100 overflow-hidden">
                          <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8qQiLu2KHc0IkkPZ8WabC6pDRjLB18ydyqE5Hrnu7b07BXMyWmI5cvIeygy3j7v2JvtWso_JJc92m61IqKY9I-4IejCEyzvPhKqIwOFyik4eMkCdsZ28PPK_22sMIeZ1SUxxmGV_dhi_pbIphb8MtmgT2CSJVLMj-YSszvGNBd4I3ZQpes79IJR0jLotgBWhxCmEN0osfKg4ADsmYlJXRG84LJAs4QhecHwEPlZTlKQN8GGX4dyUGLfF4jW2m4VEGFhNp4TggCmc" alt="WeChat" referrerPolicy="no-referrer" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-zinc-800">极氪_视频号_01</div>
                          <div className="text-[10px] text-zinc-500">微信企业版</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold bg-green-50 text-green-700 border border-green-100">正常</span>
                    </td>
                    <td className="py-3">
                      <div className="w-32">
                        <div className="flex justify-between text-[9px] mb-1 font-bold text-zinc-600">
                          <span>42/100</span>
                        </div>
                        <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[#5157a7] rounded-full" style={{ width: '42%' }}></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr className="hover:bg-zinc-50 transition-colors">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-100 overflow-hidden">
                          <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAL2UfC3wPk-Z5S1XSwAeWKB2f1DMm9jOZN3vyC824NT-vudeVfrMVx700Ao0eSwsOAbkGghIrDc1lRz4hc9kEjhqSoIb9Xe67LOK6CWe8kE1nqQNpJjlt939SxD1DxB45vkq5R9Uu2OoJZlZgJbtJ6tDojFNK9c2jH71_3AfaC6vSQj6x4FGQ-bUNGFfg9gVO08rX4glquC2rhjZpLcAE1D_WKzDmJQjkRzz8I8NvbLdmUfL39Yg5QFsvWpz-9wwJoSsmfsS7ryJo" alt="Xiaohongshu" referrerPolicy="no-referrer" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-zinc-800">ZEEKR_小红书_KOL</div>
                          <div className="text-[10px] text-zinc-500">小红书</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold bg-red-50 text-red-700 border border-red-100">异常</span>
                    </td>
                    <td className="py-3">
                      <div className="w-32">
                        <div className="flex justify-between text-[9px] mb-1 font-bold text-zinc-400">
                          <span>0/50</span>
                        </div>
                        <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                          <div className="h-full bg-zinc-300 rounded-full" style={{ width: '0%' }}></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

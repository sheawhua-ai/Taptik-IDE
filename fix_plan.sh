sed -i '628,662c\
                <div className="space-y-4">\
                  <h3 className="text-[14px] font-bold text-[#111827] border-b border-[#EAECF0] pb-2">商业目标</h3>\
                  <div className="grid gap-4">\
                    <div>\
                      <div className="text-[12px] text-[#667085] mb-1">解决问题</div>\
                      <div className="text-[14px] text-[#111827] bg-neutral-50 p-3 rounded-xl border border-[#EAECF0]">用户对幼犬系列产品信任度不足，转化率低于同类竞品。</div>\
                    </div>\
                    <div>\
                      <div className="text-[12px] text-[#667085] mb-1">转化目标</div>\
                      <div className="text-[14px] text-[#111827] bg-neutral-50 p-3 rounded-xl border border-[#EAECF0]">提升单店新客转化率至8%</div>\
                    </div>\
                  </div>\
                </div>\
                <div className="space-y-4">\
                  <h3 className="text-[14px] font-bold text-[#111827] border-b border-[#EAECF0] pb-2">过程指标</h3>\
                  <div className="grid gap-4">\
                    <div>\
                      <div className="text-[12px] text-[#667085] mb-1">爆文率目标</div>\
                      <div className="text-[14px] text-[#111827] bg-neutral-50 p-3 rounded-xl border border-[#EAECF0]">大于 15%</div>\
                    </div>\
                  </div>\
                </div>\
                <div className="space-y-4">\
                  <h3 className="text-[14px] font-bold text-[#111827] border-b border-[#EAECF0] pb-2">成本约束与停止条件</h3>\
                  <div className="grid gap-4">\
                    <div>\
                      <div className="text-[12px] text-[#667085] mb-1">CPA (单次行动成本)</div>\
                      <div className="text-[14px] text-[#111827] bg-neutral-50 p-3 rounded-xl border border-[#EAECF0]">目标 &lt; 50元，熔断阈值 &gt; 100元</div>\
                    </div>\
                    <div>\
                      <div className="text-[12px] text-[#667085] mb-1">中止条件</div>\
                      <div className="text-[14px] text-[#111827] bg-neutral-50 p-3 rounded-xl border border-[#EAECF0]">连续两周无有效咨询，或CPA持续超标</div>\
                    </div>\
                  </div>\
' src/components/merchant/ProjectCenter.tsx

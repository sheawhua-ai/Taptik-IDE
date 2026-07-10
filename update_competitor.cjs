const fs = require('fs');
let code = fs.readFileSync('src/components/rings/InteractionWorkbench.tsx', 'utf8');

const oldQuote = `<div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm">
            <h3 className="text-[14px] font-bold text-neutral-900 mb-4">典型用户原话抓取</h3>
            <div className="space-y-3">
              <div className="text-[13px] text-neutral-600 p-3 bg-neutral-50 rounded-lg">“我家狗子三个月，吃之前的粮好好的，听客服说这款好就买了，结果换了三天拉了三天，都不敢喂了！”</div>
              <div className="text-[13px] text-neutral-600 p-3 bg-neutral-50 rounded-lg">“为什么没有人说这款粮有一股奇怪的腥味？狗狗闻了就跑。”</div>
            </div>`;

const newQuote = `<div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm">
            <h3 className="text-[14px] font-bold text-neutral-900 mb-4">典型用户原话抓取</h3>
            <div className="space-y-4">
              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[12px] font-bold text-neutral-900">旺财要乖乖</span>
                  <span className="text-[10px] text-neutral-400">评论于笔记: 《渴望幼犬粮实测，到底值不值得买？》 (竞品品牌: 渴望)</span>
                </div>
                <div className="text-[13px] text-neutral-700">“我家狗子三个月，吃之前的粮好好的，听客服说这款好就买了，结果换了三天拉了三天，都不敢喂了！”</div>
              </div>
              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[12px] font-bold text-neutral-900">爱拆家的二哈</span>
                  <span className="text-[10px] text-neutral-400">评论于笔记: 《爱肯拿双十一囤货指南》 (竞品品牌: 爱肯拿)</span>
                </div>
                <div className="text-[13px] text-neutral-700">“为什么没有人说这款粮有一股奇怪的腥味？狗狗闻了就跑。”</div>
              </div>
            </div>`;

code = code.replace(oldQuote, newQuote);
fs.writeFileSync('src/components/rings/InteractionWorkbench.tsx', code);

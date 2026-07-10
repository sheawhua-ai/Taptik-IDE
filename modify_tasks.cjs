const fs = require('fs');
let code = fs.readFileSync('src/components/rings/ExecutionResult.tsx', 'utf8');

const t5String = `{
    id: "t5", type: "回传验收", title: "店长 A 已回传 5 张场景图",
    projects: ["门店KOC矩阵"],
    accounts: ["门店A"],
    aiRecommendation: "建议 4 张可用，2 张需要重拍。",
    aiReasoning: "4 张构图光线符合要求，2 张轻微模糊不建议用于首图。",
    section: "等待中",
    mainAction: "采用可用素材"
  },`;

const newTasks = `{
    id: "shoot1", type: "拍摄安排待确认", title: "4个场景拍摄包待确认",
    projects: ["幼犬换粮搜索卡位"],
    aiRecommendation: "涉及12篇已审核笔记，共18个素材位",
    aiReasoning: "建议合并相同门店、商品和动作，减少重复布景",
    section: "优先处理",
    mainAction: "确认拍摄安排"
  },
  {
    id: "shoot2", type: "拍摄任务待派发", title: "门店喂食场景待派发",
    projects: ["门店KOC矩阵"],
    aiRecommendation: "需要完成6个拍摄动作，支持6篇笔记",
    aiReasoning: "尚未指定执行人",
    section: "连续处理",
    mainAction: "选择执行人并派发"
  },
  {
    id: "shoot3", type: "素材异常待处理", title: "3个素材位需要人工处理",
    projects: ["幼犬换粮搜索卡位"],
    aiRecommendation: "2项连续上传3次不合格，1项现场无法完成",
    aiReasoning: "需人工确认是否换用本地素材或放宽要求",
    section: "连续处理",
    mainAction: "处理异常"
  },
  {
    id: "shoot4", type: "消费者体验需要协助", title: "2位参与者需要协助",
    projects: ["幼犬换粮真实体验"],
    aiRecommendation: "1位认为图片判断有误，1位发布结果暂未识别",
    aiReasoning: "体验流程受阻，建议尽快协助",
    section: "连续处理",
    mainAction: "查看并处理"
  },
  {
    id: "shoot5", type: "笔记素材已齐", title: "7篇笔记素材已齐",
    projects: ["幼犬换粮搜索卡位"],
    aiRecommendation: "所需素材已全部到位，可进入发布准备",
    aiReasoning: "已完成审核与配图，即将排期发布",
    section: "等待中",
    mainAction: "查看就绪笔记"
  },`;

code = code.replace(t5String, newTasks);

fs.writeFileSync('src/components/rings/ExecutionResult.tsx', code);

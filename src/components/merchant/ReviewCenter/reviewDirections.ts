import type { ReviewDirectionId } from "./types";

export interface ReviewDirectionDefinition {
  id: ReviewDirectionId;
  title: string;
  question: string;
  description: string;
  output: string;
  items: string[];
}

export const REVIEW_DIRECTION_DEFINITIONS: ReviewDirectionDefinition[] = [
  {
    id: "search_note",
    title: "搜索与笔记洞察",
    question: "内容在小红书获得了怎样的分发、收录和搜索位置？",
    description: "判断关键词占位、笔记表现分层与流量生命周期。",
    output: "高价值关键词、代表笔记和下一轮搜索策略",
    items: ["关键词收录与排名变化", "高表现/正常/低表现笔记分层", "搜索与推荐流量差异", "笔记生命周期与异常波动"]
  },
  {
    id: "content_audience",
    title: "内容与人群分析",
    question: "哪些内容方法打动了哪些人，为什么？",
    description: "解释选题、标题、封面、正文、素材和账号角色的表现差异。",
    output: "可复制内容结构、高响应人群和账号分工建议",
    items: ["选题/标题/封面/正文归因", "内容类型与素材差异", "评论意图与用户痛点", "品牌号/KOS/KOC角色贡献"]
  },
  {
    id: "seeding_conversion",
    title: "种草及转化度量",
    question: "内容是否从普通互动走向了高意图行为和经营结果？",
    description: "判断收藏、评论、私信、咨询及后续转化链路。",
    output: "高种草效率笔记、有效咨询来源和转化断点",
    items: ["收藏/评论/分享等种草信号", "高意图评论与私信", "有效咨询来源笔记", "内容包、到店或成交链路"]
  }
];

export const ALL_REVIEW_DIRECTION_IDS = REVIEW_DIRECTION_DEFINITIONS.map(item => item.id);


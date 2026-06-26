import fs from 'fs';

let content = fs.readFileSync('src/components/rings/Strategy.tsx', 'utf-8');

// Add import
content = content.replace(
  /import \{ ExecutionPreview \} from "\.\/ExecutionPreview";/,
  `import { ExecutionPreview } from "./ExecutionPreview";\nimport { ExecutionResult } from "./ExecutionResult";`
);

// Replace the block
const generatingBlockStart = `              <div className="flex items-center justify-between mb-6">`;
const generatingBlockRegex = new RegExp(
  generatingBlockStart.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + 
  '[\\s\\S]*?' + 
  '进入账号排期与发布\\s*</button>\\s*</div>\\s*</div>\\s*\\)\\}'
);

content = content.replace(generatingBlockRegex,
`              {flowState === "generating" ? (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-[20px] font-semibold text-neutral-900 flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full border-2 border-primary-500 border-t-transparent animate-spin" />
                        AI 正在执行项目初始化...
                      </h3>
                    </div>
                  </div>
                  <div className="space-y-5">
                    <div className="h-2.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-500 transition-all duration-300"
                        style={{ width: \`\${generateProgress}%\` }}
                      />
                    </div>
                    <div className="text-[13px] text-neutral-500 font-mono space-y-2">
                      <div
                        className={
                          generateProgress > 0
                            ? "text-neutral-700"
                            : "text-neutral-300"
                        }
                      >
                        {generateProgress > 0 && "> "}正在分析 12
                        篇内容的阶段发布目标...
                      </div>
                      <div
                        className={
                          generateProgress > 20
                            ? "text-neutral-700"
                            : "text-neutral-300"
                        }
                      >
                        {generateProgress > 20 && "> "}
                        正在调用品牌知识库提取卖点与规避禁忌词...
                      </div>
                      <div
                        className={
                          generateProgress > 50
                            ? "text-neutral-700"
                            : "text-neutral-300"
                        }
                      >
                        {generateProgress > 50 && "> "}
                        正在生成第一批图文与视频分镜脚本...
                      </div>
                      <div
                        className={
                          generateProgress > 80
                            ? "text-neutral-700"
                            : "text-neutral-300"
                        }
                      >
                        {generateProgress > 80 && "> "}正在将草稿分配至
                        A01、A02、A05 账号排期队列...
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <ExecutionResult />
              )}`
);

fs.writeFileSync('src/components/rings/Strategy.tsx', content);

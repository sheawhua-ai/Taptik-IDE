import fs from 'fs';
let content = fs.readFileSync('src/components/merchant/ProjectCenter.tsx', 'utf-8');

// We need to add state for projectName and projectTarget
const stateTarget = `  const [createKbStatus, setCreateKbStatus] = useState<"idle" | "checking" | "missing" | "ok">("idle");`;
const stateReplacement = `  const [createKbStatus, setCreateKbStatus] = useState<"idle" | "checking" | "missing" | "ok">("idle");
  const [createProjectName, setCreateProjectName] = useState("幼犬换粮搜索卡位第三轮");
  const [createProjectTarget, setCreateProjectTarget] = useState("提升幼犬肠胃敏感人群的转化率");`;

content = content.replace(stateTarget, stateReplacement);

// Step 1: bind inputs
const inputNameTarget = `<input type="text" id="new-project-name" defaultValue="幼犬换粮搜索卡位第三轮" className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-[14px] outline-none focus:border-primary-500 shadow-sm" />`;
const inputNameReplacement = `<input type="text" id="new-project-name" value={createProjectName} onChange={e => setCreateProjectName(e.target.value)} className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-[14px] outline-none focus:border-primary-500 shadow-sm" />`;
content = content.replace(inputNameTarget, inputNameReplacement);

const inputTargetTarget = `<textarea id="new-project-target" rows={2} defaultValue="提升幼犬肠胃敏感人群的转化率" className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-[14px] outline-none focus:border-primary-500 shadow-sm resize-none"></textarea>`;
const inputTargetReplacement = `<textarea id="new-project-target" rows={2} value={createProjectTarget} onChange={e => setCreateProjectTarget(e.target.value)} className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-[14px] outline-none focus:border-primary-500 shadow-sm resize-none"></textarea>`;
content = content.replace(inputTargetTarget, inputTargetReplacement);

// Step 2: use state in creation
const createBtnTarget = `                      const name = (document.getElementById("new-project-name") as HTMLInputElement)?.value || "新营销项目";
                      const target = (document.getElementById("new-project-target") as HTMLTextAreaElement)?.value || "设定目标...";`;
const createBtnReplacement = `                      const name = createProjectName || "新营销项目";
                      const target = createProjectTarget || "设定目标...";`;
content = content.replace(createBtnTarget, createBtnReplacement);

fs.writeFileSync('src/components/merchant/ProjectCenter.tsx', content);

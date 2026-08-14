const fs = require('fs');

let code = fs.readFileSync('src/components/merchant/ProjectCenter.tsx', 'utf8');

// Remove the KOCQuestionnaireModal button from PC
const searchForFillBtn = `                            <div className="flex items-center gap-2 shrink-0">
                              {note.isNotePackage && note.packageSpec?.questionnaireStatus === "待填写" && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedPackageNoteForQuestionnaire(note);
                                  }}
                                  className="px-3.5 py-1.5 bg-primary-600 text-white hover:bg-primary-700 text-[12px] font-bold rounded-xl flex items-center gap-1 shadow-xs transition-colors"
                                >
                                  <Sparkles size={13} /> 填写问卷生成笔记
                                </button>
                              )}`;

const replaceWithFillBtn = `                            <div className="flex items-center gap-2 shrink-0">`;

code = code.replace(searchForFillBtn, replaceWithFillBtn);

// Also we need to add "项目问卷" button in the Project Overview (e.g., somewhere in the project summary section)
// Let's search for "项目概览" or similar.
const searchOverview = `<div className="text-[16px] font-bold text-[#111827] mb-4">执行目标与策略方案</div>`;
const replaceOverview = `<div className="flex items-center justify-between mb-4">
                        <div className="text-[16px] font-bold text-[#111827]">执行目标与策略方案</div>
                        <button 
                          onClick={() => setShowProjectQuestionnaire(true)}
                          className="px-3 py-1.5 bg-white border border-neutral-200 text-neutral-700 text-[12px] font-bold rounded-lg hover:bg-neutral-50 shadow-2xs flex items-center gap-1.5 transition-colors"
                        >
                          <FileText size={14} /> 项目问卷配置
                        </button>
                      </div>`;
code = code.replace(searchOverview, replaceOverview);

// Also need to remove the KOCQuestionnaireModal rendering at the bottom
const searchModalRender = `{/* KOC Questionnaire Modal for Note Package */}
      {selectedPackageNoteForQuestionnaire && (
        <KOCQuestionnaireModal
          note={selectedPackageNoteForQuestionnaire}
          onClose={() => setSelectedPackageNoteForQuestionnaire(null)}
        />
      )}`;
code = code.replace(searchModalRender, "");

// Need to add state for `showProjectQuestionnaire`
const stateSearch = `const [activeNoteDetail, setActiveNoteDetail] = useState<Note | null>(null);`;
const stateReplace = `const [activeNoteDetail, setActiveNoteDetail] = useState<Note | null>(null);
  const [showProjectQuestionnaire, setShowProjectQuestionnaire] = useState(false);`;
code = code.replace(stateSearch, stateReplace);

// Let's just output it to check if it's there
fs.writeFileSync('src/components/merchant/ProjectCenter.tsx', code);
console.log('ProjectCenter updated!');

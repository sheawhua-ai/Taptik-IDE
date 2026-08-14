const fs = require('fs');

let code = fs.readFileSync('src/components/merchant/ProjectCenter.tsx', 'utf8');

const importStatement = `import { NoteDetailDrawer } from "./ProjectCenter/NoteDetailDrawer";
import { ProjectQuestionnaireDrawer } from "../rings/ProjectQuestionnaireDrawer";`;

code = code.replace(`import { NoteDetailDrawer } from "./ProjectCenter/NoteDetailDrawer";`, importStatement);

const renderStatement = `      {/* Note Creation / Import Modals */}`;
const addDrawerRender = `      {/* Project Questionnaire Drawer */}
      {showProjectQuestionnaire && (
        <ProjectQuestionnaireDrawer onClose={() => setShowProjectQuestionnaire(false)} projectId={currentProject.id} />
      )}
      
      {/* Note Creation / Import Modals */}`;

code = code.replace(renderStatement, addDrawerRender);

fs.writeFileSync('src/components/merchant/ProjectCenter.tsx', code);
console.log('Added import!');

import fs from 'fs';
let code = fs.readFileSync('src/pages/MerchantMatrix.tsx', 'utf8');

// 1. Remove `activeBatch` state and related types/code
// Replace state vars:
code = code.replace(/const \[activeBatch, setActiveBatch\] = useState<BatchProject \| null>\(null\);/g, "");

// Modify handleAutoGroupDispatch to refer to activeProject
code = code.replace(/handleReviewBatch/g, "handleReviewProject");

// Update 'setActiveProject' calls in list to also call 'generateMocks'
const setActiveProjectRegex = /onClick=\{\(\) => setActiveProject\(project\.id\)\}/g;
code = code.replace(setActiveProjectRegex, "onClick={() => { setActiveProject(project.id); generateMocks(); }}");

// Update generateMocks to not take a batch
code = code.replace(/const generateMocks = \(batch: BatchProject\) => \{/g, "const generateMocks = () => {");
// Also remove batch param in call
code = code.replace(/generateMocks\(batch\);/g, "generateMocks();");

// In the main view:
// We change `{!activeBatch ? ( ... batches ) : ( ... drafts )}`
// Wait, I can just replace the whole main container logic where it renders `activeProject` view.
// In MerchantMatrix, if `activeProject` is true, it renders the detail view. 
// Old Code:
/*
      <div className="flex flex-col h-full bg-neutral-50/50 overflow-hidden">
        {/* Project Generation Header *\/}
        ...
        <div className="flex-1 flex overflow-hidden">
             {!activeBatch ? ( ...batches list... ) : ( ... drafts list... )}
*/

// Let's create a more targeted replacement. I'll read the file first to make a robust change.

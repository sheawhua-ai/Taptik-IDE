const fs = require('fs');
let code = fs.readFileSync('src/components/rings/ExecutionResult.tsx', 'utf8');

const importStatement = `import { InteractionWorkbench } from './InteractionWorkbench';`;
const newImport = `import { InteractionWorkbench } from './InteractionWorkbench';
import { ShootingAndUploadWorkbench } from './ShootingAndUploadWorkbench';`;
code = code.replace(importStatement, newImport);

const oldAnimate = `{selectedTask && selectedTask.type === '互动承接' && (
          <InteractionWorkbench task={selectedTask} onClose={() => setSelectedTask(null)} />
        )}`;

const shootingTypes = `['拍摄安排待确认', '拍摄任务待派发', '素材异常待处理', '消费者体验需要协助', '笔记素材已齐']`;

const newAnimate = `{selectedTask && selectedTask.type === '互动承接' && (
          <InteractionWorkbench task={selectedTask} onClose={() => setSelectedTask(null)} />
        )}
        {selectedTask && ${shootingTypes}.includes(selectedTask.type) && (
          <ShootingAndUploadWorkbench 
            initialTab={
              selectedTask.type === '消费者体验需要协助' ? 'consumer' :
              selectedTask.type === '笔记素材已齐' ? 'progress' :
              selectedTask.type === '素材异常待处理' ? 'exception' : 'employee'
            }
            onClose={() => setSelectedTask(null)} 
          />
        )}`;
code = code.replace(oldAnimate, newAnimate);

const oldFallback = `selectedTask.type !== '互动承接'`;
const newFallback = `selectedTask.type !== '互动承接' && !${shootingTypes}.includes(selectedTask.type)`;
code = code.replace(oldFallback, newFallback);

fs.writeFileSync('src/components/rings/ExecutionResult.tsx', code);

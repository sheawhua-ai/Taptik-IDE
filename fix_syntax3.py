import re

with open("src/components/merchant/ExecutionCenter/OperatorTaskWorkbench.tsx", "r") as f:
    code = f.read()

# I deleted OperatorTaskWorkbench component definition by mistake earlier.
# The code starts at line 58 with const renderMaterialSelection = () => (
# It should be:
# }
# export function OperatorTaskWorkbench({ task, categoryQueue, initialAction, onSelectTask, onBack, workspaceNavigation, onUpdateTask, onNextTask }: OperatorTaskWorkbenchProps) {
# ... followed by states.

new_component_start = """}

export function OperatorTaskWorkbench({
  task,
  categoryQueue,
  initialAction,
  onSelectTask,
  onBack,
  workspaceNavigation,
  onUpdateTask,
  onNextTask
}: OperatorTaskWorkbenchProps) {
  const [mode, setMode] = useState<WorkbenchMode>(() => getWorkbenchMode(task, initialAction));
  const [feedback, setFeedback] = useState('');
  
  // State for content edit
  const [draftTitle, setDraftTitle] = useState(task.draftTitle || '');
  const [draftBody, setDraftBody] = useState(task.draftBody || '');
  const [tags, setTags] = useState<string[]>(task.tags || []);
  
  // State for material selection
  const [libraryMaterials] = useState<LibraryMaterialItem[]>(getProjectLibraryMaterials());
  const [selectedMaterials, setSelectedMaterials] = useState<LibraryMaterialItem[]>(task.selectedMaterialAssets || []);
  
  // State for material tasks
  const [taskRequirement, setTaskRequirement] = useState(task.reasonForIntervention || '');
  const [assignee, setAssignee] = useState(MOCK_STAFF_MEMBERS[0].name);
  const [taskDeadline, setTaskDeadline] = useState('今天 18:00');
  
  // State for publish
  const [publishUrl, setPublishUrl] = useState(task.returnedData?.publishUrl || '');
  
  // State for anomalies
  const [resolution, setResolution] = useState(getAnomalyOptions(task)[0]);
  const [resolutionNote, setResolutionNote] = useState('');
  const [replacementPublisher, setReplacementPublisher] = useState('备用KOC_小丸子');
  
  // Sidebar logic
  const [queueQuery, setQueueQuery] = useState('');
  const [showContext, setShowContext] = useState(true);
  const [agentQuestion, setAgentQuestion] = useState('');
  const [agentAnswer, setAgentAnswer] = useState('');

  const isMaterialFollowUp = task.operatorCategory === 'material' && task.materialType !== 'matched_library_asset';
  
  const queue = useMemo(() => categoryQueue.filter(item => {
    if (initialAction === 'handle_publish_error' || task.operatorCategory === 'anomaly') {
      return item.isAnomaly;
    }
    return item.operatorCategory === task.operatorCategory;
  }), [categoryQueue, task.operatorCategory, initialAction, task.isAnomaly]);
  
  useEffect(() => {
    setMode(getWorkbenchMode(task, initialAction));
    setResolution(getAnomalyOptions(task)[0]);
    setResolutionNote('');
  }, [task, initialAction]);
"""

code = re.sub(r'\}\n\n  const renderMaterialSelection', new_component_start + '\n  const renderMaterialSelection', code)

with open("src/components/merchant/ExecutionCenter/OperatorTaskWorkbench.tsx", "w") as f:
    f.write(code)

print("Fixed component declaration")

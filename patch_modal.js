import fs from 'fs';
let content = fs.readFileSync('src/components/CreateProjectModal.tsx', 'utf-8');

content = content.replace(
  'interface CreateProjectModalProps { isOpen: boolean; onClose: () => void;}',
  'interface CreateProjectModalProps { isOpen: boolean; onClose: () => void; onCreate?: (type: "scratch" | "existing") => void; }'
);

content = content.replace(
  'export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose }) => {',
  'export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose, onCreate }) => {'
);

content = content.replace(
  '<button className="flex items-center gap-6 p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm hover:shadow-md hover:border-neutral-300 transition-all group text-left">',
  '<button onClick={() => onCreate && onCreate("scratch")} className="flex items-center gap-6 p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm hover:shadow-md hover:border-neutral-300 transition-all group text-left">'
);

content = content.replace(
  '<button className="flex items-center gap-6 p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm hover:shadow-md hover:border-neutral-300 transition-all group text-left">',
  '<button onClick={() => onCreate && onCreate("existing")} className="flex items-center gap-6 p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm hover:shadow-md hover:border-neutral-300 transition-all group text-left">'
);

fs.writeFileSync('src/components/CreateProjectModal.tsx', content);

import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');

content = content.replace(
  'const [isSwitchAccountModalOpen, setIsSwitchAccountModalOpen] = useState(false);',
  `const [isSwitchAccountModalOpen, setIsSwitchAccountModalOpen] = useState(false);
  const [activeProjectMenuId, setActiveProjectMenuId] = useState<string | null>(null);
  const [activeSessionMenuId, setActiveSessionMenuId] = useState<number | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.project-menu-container') && !target.closest('.project-menu-trigger')) {
        setActiveProjectMenuId(null);
      }
      if (!target.closest('.session-menu-container') && !target.closest('.session-menu-trigger')) {
        setActiveSessionMenuId(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);`
);

fs.writeFileSync('src/App.tsx', content);

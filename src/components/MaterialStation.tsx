import React from 'react';
import { MaterialCenterMain } from './material-center/MaterialCenterMain';

interface MaterialStationProps {
  activeProject?: any;
  onNavigateToExecution?: () => void;
}

export const MaterialStation: React.FC<MaterialStationProps> = ({
  activeProject,
  onNavigateToExecution
}) => {
  return (
    <MaterialCenterMain
      activeProject={activeProject}
      onNavigateToExecution={onNavigateToExecution}
    />
  );
};

export default MaterialStation;

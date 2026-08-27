import React from 'react';
import { MaterialCenterV2 } from './material-center/MaterialCenterV2';
import type { MaterialAsset } from './material-center/types';

interface MaterialStationProps {
  activeProject?: any;
  importedAssets?: MaterialAsset[];
}

export const MaterialStation: React.FC<MaterialStationProps> = ({
  activeProject,
  importedAssets
}) => {
  return (
    <MaterialCenterV2
      activeProject={activeProject}
      importedAssets={importedAssets}
    />
  );
};

export default MaterialStation;

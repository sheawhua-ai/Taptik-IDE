sed -i '/const \[activeTab/a \  const pipeline = currentProject ? calculateProjectPipeline(currentProject.notes) : null;' src/components/merchant/ProjectCenter.tsx

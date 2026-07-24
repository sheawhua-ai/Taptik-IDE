import fs from 'fs';
let content = fs.readFileSync('src/components/merchant/ProjectCenter.tsx', 'utf-8');

// The right drawer rendering starts with:
//         {/* RIGHT DRAWER */}
//         <AnimatePresence>
//           {drawerType && (
//             <motion.div

content = content.replace(
  '{drawerType && (',
  '{drawerType && drawerType !== "create_project" && ('
);

fs.writeFileSync('src/components/merchant/ProjectCenter.tsx', content);
console.log("Successfully fixed right drawer condition.");

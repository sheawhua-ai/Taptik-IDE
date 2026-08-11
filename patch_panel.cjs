const fs = require('fs');

let code = fs.readFileSync('src/components/ProjectFilePanel.tsx', 'utf-8');

code = code.replace(
  /setIsFloating\(window\.innerWidth < 1200\);/,
  "setIsFloating(window.innerWidth < 768);"
);

code = code.replace(
  /let newWidth = e\.clientX;[\s\S]*?if \(remainingSpace < 720 && !isFloating\) \{[\s\S]*?newWidth = window\.innerWidth - 80 - 720;\n      \}/,
  `let newWidth = e.clientX - 64;
      if (newWidth < 200) newWidth = 200;
      if (newWidth > 460) newWidth = 460;`
);

fs.writeFileSync('src/components/ProjectFilePanel.tsx', code);

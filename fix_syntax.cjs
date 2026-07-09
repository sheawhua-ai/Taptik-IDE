const fs = require('fs');
let code = fs.readFileSync('src/components/rings/ExecutionResult.tsx', 'utf8');

code = code.replace(`          </>
        )}
      </div>
      </AnimatePresence>`, `          </div>
        )}
      </AnimatePresence>`);

fs.writeFileSync('src/components/rings/ExecutionResult.tsx', code);

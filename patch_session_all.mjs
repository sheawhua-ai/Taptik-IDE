import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');

content = content.replace(
  `                        {i === 0 && (
                          <div className="shrink-0 opacity-0 group-hover/session:opacity-100 transition-opacity relative">`,
  `                          <div className="shrink-0 opacity-0 group-hover/session:opacity-100 transition-opacity relative">`
);

content = content.replace(
  `                              </div>
                            )}
                          </div>
                        )}`,
  `                              </div>
                            )}
                          </div>`
);

fs.writeFileSync('src/App.tsx', content);

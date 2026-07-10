const fs = require('fs');
let code = fs.readFileSync('src/components/rings/ExecutionResult.tsx', 'utf8');

const search = `                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>`;

const replace = `                      </div>
                    </div>
                  ))}
                </div>
                )}
              </div>
            );
          })}
        </div>
      </div>`;
      
code = code.replace(search, replace);
fs.writeFileSync('src/components/rings/ExecutionResult.tsx', code);
console.log('Fixed ending');

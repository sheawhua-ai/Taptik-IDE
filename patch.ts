import fs from 'fs';
let code = fs.readFileSync('src/components/ProjectSwitcherModal.tsx', 'utf-8');
const regex = /<span key={tag} className="text-\[10px\] px-1\.5 py-0\.5 bg-neutral-100 text-neutral-500 rounded truncate max-w-\[60px\]">\s*\{tag\}\s*<\/span>\s*\)\)}\s*<\/div>\s*<\/div>\s*<\/div>/g;
const match = code.match(regex);
if (match) {
  code = code.replace(match[0], match[0].replace('max-w-[60px]', 'max-w-[80px]').replace('</div>\n  </div>', '</div>' + '\n' +
  '  {(proj.targets || proj.knowledge) && (' + '\n' +
  '    <div className="flex flex-col gap-0.5 mt-1.5">' + '\n' +
  '      {proj.targets && (' + '\n' +
  '        <div className="flex items-center gap-1 text-[10px]">' + '\n' +
  '          <span className="text-neutral-400">当前运营目标：</span>' + '\n' +
  '          <div className="flex items-center gap-1 flex-wrap">' + '\n' +
  '            {proj.targets.map((t: string) => (' + '\n' +
  '              <span key={t} className="flex items-center gap-0.5 text-neutral-600">' + '\n' +
  '                {t} <CheckCircle2 size={10} className="text-emerald-500" />' + '\n' +
  '              </span>' + '\n' +
  '            ))}' + '\n' +
  '          </div>' + '\n' +
  '        </div>' + '\n' +
  '      )}' + '\n' +
  '      {proj.knowledge && (' + '\n' +
  '        <div className="flex items-center gap-1 text-[10px]">' + '\n' +
  '          <span className="text-neutral-400">知识库：</span>' + '\n' +
  '          <div className="flex items-center gap-1 flex-wrap">' + '\n' +
  '            {proj.knowledge.map((k: string) => (' + '\n' +
  '              <span key={k} className="flex items-center gap-0.5 text-neutral-600">' + '\n' +
  '                {k} <CheckCircle2 size={10} className="text-emerald-500" />' + '\n' +
  '              </span>' + '\n' +
  '            ))}' + '\n' +
  '          </div>' + '\n' +
  '        </div>' + '\n' +
  '      )}' + '\n' +
  '    </div>' + '\n' +
  '  )}\n  </div>'));
  fs.writeFileSync('src/components/ProjectSwitcherModal.tsx', code);
  console.log('Success');
} else {
  console.log('Not found');
}

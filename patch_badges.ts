import fs from 'fs';

let content = fs.readFileSync('src/pages/MerchantMatrix.tsx', 'utf8');

const badgesRegex = /<div className="absolute top-3 left-3 flex gap-1">[\s\S]*?待审核\n\s*<\/span>\n\s*\)}/g;

const newBadges = `<div className="absolute top-3 left-3 flex gap-1 flex-wrap pr-3">
                        {draft.status === 'scheduled' && (
                          <>
                            <span className="text-[10px] px-2 py-0.5 rounded tracking-widest bg-white/90 text-primary-600 shadow-sm flex items-center gap-1">
                              <CalendarClock size={10} /> 待发布
                            </span>
                            {draft.kocWeChat && (
                              <span className="text-[10px] px-2 py-0.5 rounded tracking-widest bg-white/90 text-indigo-600 shadow-sm flex items-center gap-1 whitespace-nowrap">
                                领单(wx): {draft.kocWeChat}
                              </span>
                            )}
                          </>
                        )}
                        {draft.status === 'dispatched' && (
                          <span className="text-[10px] px-2 py-0.5 rounded tracking-widest bg-white/90 text-amber-600 shadow-sm flex items-center gap-1">
                            <Camera size={10} /> 实拍中 (素材缺失)
                          </span>
                        )}
                        {draft.status === 'published' && (
                          <>
                            <span onClick={(e) => { e.stopPropagation(); window.open('https://xiaohongshu.com', '_blank'); }} className="text-[10px] px-2 py-0.5 rounded tracking-widest bg-success-50 text-success-600 shadow-sm flex items-center gap-1 hover:bg-success-600 hover:text-white transition-colors cursor-pointer">
                              <CheckCircle2 size={10} /> @{draft.kocXhs || '豆豆'} - 已发布 (查看)
                            </span>
                            {draft.kocWeChat && (
                              <span className="text-[10px] px-2 py-0.5 rounded tracking-widest bg-white/90 text-indigo-600 shadow-sm flex items-center gap-1 whitespace-nowrap">
                                领单(wx): {draft.kocWeChat}
                              </span>
                            )}
                          </>
                        )}
                        {draft.status === 'review' && (
                          <span className="text-[10px] px-2 py-0.5 rounded tracking-widest bg-white/90 text-neutral-600 shadow-sm flex items-center gap-1">
                            待审核
                          </span>
                        )}`;

content = content.replace(badgesRegex, newBadges);
if (!content.includes('领单(wx)')) {
    console.log("Could not find badges regex to replace");
} else {
    fs.writeFileSync('src/pages/MerchantMatrix.tsx', content);
    console.log("Patched Draft Badges");
}

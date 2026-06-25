import fs from 'fs';

let content = fs.readFileSync('src/components/Workbench.tsx', 'utf-8');

content = content.replace(
  "Copy, Settings, Palette, HelpCircle, ArrowUpCircle, LogOut, Bell, Link2, Gift, UserCircle, Database, ShieldCheck, Users, ShieldAlert, Paperclip",
  "Copy, Settings, Palette, HelpCircle, ArrowUpCircle, LogOut, Bell, Link2, Gift, UserCircle, Database, ShieldCheck, Users, ShieldAlert, Paperclip, ArrowDownRight, PieChart"
);

fs.writeFileSync('src/components/Workbench.tsx', content);

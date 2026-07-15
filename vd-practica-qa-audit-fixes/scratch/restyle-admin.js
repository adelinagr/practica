const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../components/admin');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx') && f !== 'admin-dashboard-client.tsx' && f !== 'admin-sidebar.tsx');

const replacements = [
  { search: /\bbg-white\b/g, replace: 'bg-white/5 backdrop-blur-md' },
  { search: /\bborder-slate-100\b/g, replace: 'border-white/10' },
  { search: /\bborder-slate-200\b/g, replace: 'border-white/10' },
  { search: /\bborder-slate-300\b/g, replace: 'border-white/20' },
  { search: /\bbg-slate-50\b/g, replace: 'bg-white/10' },
  { search: /\bbg-slate-100\b/g, replace: 'bg-white/10' },
  { search: /\btext-slate-900\b/g, replace: 'text-foreground' },
  { search: /\btext-slate-800\b/g, replace: 'text-foreground' },
  { search: /\btext-slate-700\b/g, replace: 'text-foreground' },
  { search: /\btext-slate-600\b/g, replace: 'text-muted-foreground' },
  { search: /\btext-slate-500\b/g, replace: 'text-muted-foreground' },
  { search: /\btext-slate-400\b/g, replace: 'text-muted-foreground/70' },
  { search: /\btext-slate-300\b/g, replace: 'text-muted-foreground/50' },
  { search: /\bbg-indigo-50\b/g, replace: 'bg-primary/20' },
  { search: /\bbg-indigo-100\b/g, replace: 'bg-primary/30' },
  { search: /\bbg-indigo-600\b/g, replace: 'bg-primary' },
  { search: /\bbg-indigo-700\b/g, replace: 'bg-primary/90' },
  { search: /\btext-indigo-500\b/g, replace: 'text-primary' },
  { search: /\btext-indigo-600\b/g, replace: 'text-primary' },
  { search: /\btext-indigo-700\b/g, replace: 'text-primary' },
  { search: /\bhover:bg-indigo-700\b/g, replace: 'hover:bg-primary/90' },
  { search: /\bhover:bg-indigo-600\b/g, replace: 'hover:bg-primary' },
  { search: /\bhover:bg-slate-50\b/g, replace: 'hover:bg-white/10' },
  { search: /\bhover:bg-slate-100\b/g, replace: 'hover:bg-white/10' },
  { search: /\bhover:text-slate-900\b/g, replace: 'hover:text-foreground' },
  { search: /\bhover:text-slate-800\b/g, replace: 'hover:text-foreground' },
  { search: /\bhover:text-slate-700\b/g, replace: 'hover:text-foreground' },
  { search: /\bhover:text-slate-600\b/g, replace: 'hover:text-muted-foreground' },
  { search: /\bring-slate-200\b/g, replace: 'ring-white/10' },
  { search: /\bring-indigo-600\b/g, replace: 'ring-primary' },
  { search: /\btext-indigo-400\b/g, replace: 'text-primary' },
  { search: /\bborder-indigo-600\b/g, replace: 'border-primary' },
  { search: /\bfrom-indigo-500\b/g, replace: 'from-primary' },
  { search: /\bto-indigo-600\b/g, replace: 'to-primary' },
  { search: /\bshadow-sm\b/g, replace: 'shadow-lg' }
];

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  for (const { search, replace } of replacements) {
    content = content.replace(search, replace);
  }
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file}`);
}

// Let's also process components/admin/settings if it exists and has tsx files
const settingsDir = path.join(dir, 'settings');
if (fs.existsSync(settingsDir)) {
  const settingsFiles = fs.readdirSync(settingsDir).filter(f => f.endsWith('.tsx'));
  for (const file of settingsFiles) {
    const filePath = path.join(settingsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    for (const { search, replace } of replacements) {
      content = content.replace(search, replace);
    }
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated settings/${file}`);
  }
}

const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      callback(path.join(dir, f));
    }
  });
}

const dir = path.join(__dirname, '../app/admin');

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

walkDir(dir, function(filePath) {
  if (filePath.endsWith('.tsx') && !filePath.includes('layout.tsx')) { // omit layout.tsx which we hand-modified
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    for (const { search, replace } of replacements) {
      content = content.replace(search, replace);
    }
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${path.relative(dir, filePath)}`);
    }
  }
});

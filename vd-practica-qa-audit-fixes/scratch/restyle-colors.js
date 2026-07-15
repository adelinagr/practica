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

const dirs = [
  path.join(__dirname, '../app/admin'),
  path.join(__dirname, '../components/admin')
];

const replacements = [
  { search: /\bborder-white\/10\b/g, replace: 'border-secondary/30' },
  { search: /\bborder-white\/20\b/g, replace: 'border-secondary/50' },
  { search: /\bbg-white\/5\b/g, replace: 'bg-secondary/10' },
  { search: /\bbg-white\/10\b/g, replace: 'bg-accent/20' },
  { search: /\bhover:bg-white\/10\b/g, replace: 'hover:bg-accent/30' },
  { search: /\bbg-black\/20\b/g, replace: 'bg-background/80' },
  { search: /\bring-white\/10\b/g, replace: 'ring-secondary/30' },
  { search: /\btext-muted-foreground\/70\b/g, replace: 'text-accent/80' },
  { search: /\btext-muted-foreground\/50\b/g, replace: 'text-accent/60' },
  { search: /\btext-muted-foreground\/30\b/g, replace: 'text-accent/40' },
  // Also fix some specific places like inputs
  { search: /\bfocus:border-indigo-400\b/g, replace: 'focus:border-primary' },
  { search: /\bfocus:ring-indigo-500\/15\b/g, replace: 'focus:ring-primary/20' },
  { search: /\bfocus:border-indigo-300\b/g, replace: 'focus:border-primary/80' }
];

dirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    walkDir(dir, function(filePath) {
      if (filePath.endsWith('.tsx') && !filePath.includes('layout.tsx')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let original = content;
        for (const { search, replace } of replacements) {
          content = content.replace(search, replace);
        }
        if (content !== original) {
          fs.writeFileSync(filePath, content, 'utf8');
          console.log(`Updated ${path.relative(path.join(__dirname, '..'), filePath)}`);
        }
      }
    });
  }
});

// For layout.tsx, I will apply it explicitly since it was skipped
const layoutPath = path.join(__dirname, '../app/admin/layout.tsx');
if (fs.existsSync(layoutPath)) {
  let content = fs.readFileSync(layoutPath, 'utf8');
  let original = content;
  for (const { search, replace } of replacements) {
    content = content.replace(search, replace);
  }
  if (content !== original) {
    fs.writeFileSync(layoutPath, content, 'utf8');
    console.log(`Updated app/admin/layout.tsx`);
  }
}

const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(fullPath));
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) { 
      results.push(fullPath);
    }
  });
  return results;
}

const files = walk(path.join(process.cwd(), 'components', 'admin'));
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Regex to match "bg-primary" followed by some classes, then "text-primary" or "text-foreground"
  // Or the other way around.
  // We use `\b` to avoid matching `bg-primary/20` or `text-primary-foreground`.
  // Wait, `bg-primary\b` matches `bg-primary`, but what if it's `bg-primary/20`? 
  // \b will match the slash. So we need `bg-primary(?!\/)`.
  
  let newContent = content
    .replace(/bg-primary(?!\/)\s+([^"']*?)\btext-primary(?!\-)/g, 'bg-primary $1text-primary-foreground')
    .replace(/bg-primary(?!\/)\s+([^"']*?)\btext-foreground/g, 'bg-primary $1text-primary-foreground')
    .replace(/\btext-primary(?!\-)\s+([^"']*?)\bbg-primary(?!\/)/g, 'text-primary-foreground $1bg-primary')
    .replace(/\btext-foreground\s+([^"']*?)\bbg-primary(?!\/)/g, 'text-primary-foreground $1bg-primary');
  
  if (content !== newContent) {
    fs.writeFileSync(file, newContent);
    console.log('Fixed', file);
  }
});

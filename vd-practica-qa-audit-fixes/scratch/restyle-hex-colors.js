const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
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
  path.join(__dirname, '../app'),
  path.join(__dirname, '../components')
];

const replacements = [
  { search: /#604D53/gi, replace: '#3D5D91' },
  { search: /#9DA3A4/gi, replace: '#5A86CB' },
  { search: /#D5C5C8/gi, replace: '#F2DCDB' },
  { search: /#DB7F8E/gi, replace: '#F2AEBC' },
  { search: /#FFDBDA/gi, replace: '#F2DCDB' },
  { search: /rgba\(\s*219\s*,\s*127\s*,\s*142/gi, replace: 'rgba(242, 174, 188' }
];

dirs.forEach(dir => {
  walkDir(dir, function(filePath) {
    if (filePath.endsWith('.tsx') || filePath.endsWith('.ts') || filePath.endsWith('.css')) {
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
});

const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Find patterns like hover:bg-black/[0.04] dark:bg-white/[0.04]
  // and replace with hover:bg-black/[0.04] dark:hover:bg-white/[0.04]
  const regex = /(hover:|focus:|group-hover:|sm:|md:|lg:)?(bg|border|text)-black\/([^\s]+)\s+dark:(bg|border|text)-white\/([^\s]+)/g;
  
  content = content.replace(regex, (match, modifier, type1, val1, type2, val2) => {
    if (!modifier) return match; // nothing to fix
    return `${modifier}${type1}-black/${val1} dark:${modifier}${type2}-white/${val2}`;
  });

  fs.writeFileSync(filePath, content, 'utf8');
}

function traverseDir(dir) {
  fs.readdirSync(dir).forEach(file => {
    let fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverseDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      processFile(fullPath);
    }
  });
}

traverseDir(path.join(__dirname, 'src'));
console.log("Modifiers fixed!");

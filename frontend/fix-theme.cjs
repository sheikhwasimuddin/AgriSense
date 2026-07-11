const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace bg-white/[0.0x] with bg-black/[0.0x] dark:bg-white/[0.0x]
  content = content.replace(/bg-white\/\[0\.0(\d+)\]/g, 'bg-black/[0.0$1] dark:bg-white/[0.0$1]');
  content = content.replace(/bg-white\/(\d+)/g, 'bg-black/$1 dark:bg-white/$1');

  // Replace border-white/[0.0x]
  content = content.replace(/border-white\/\[0\.0(\d+)\]/g, 'border-black/[0.1] dark:border-white/[0.0$1]');
  content = content.replace(/border-white\/(\d+)/g, 'border-black/$1 dark:border-white/$1');

  // Replace text-white/x with text-slate-900/x dark:text-white/x
  content = content.replace(/text-white\/(\d+)/g, 'text-slate-900/$1 dark:text-white/$1');

  // Specific text-white replacements that are not in buttons (buttons usually have bg-gradient, let's avoid replacing those easily, or just replace text-white with text-foreground dark:text-white)
  // Let's replace text-white to text-slate-900 dark:text-white ONLY when it's not preceded by text-
  // Actually, text-white inside `bg-gradient-to-r` or `bg-gradient-to-br from-emerald...` should remain white.
  // Instead of replacing `text-white` globally, let's leave `text-white` alone unless it's explicitly used for normal text. We will manually fix `Dashboard`, `Home`, etc. if needed, or rely on the script for the bulk.

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
console.log("Done updating theme classes!");

const fs = require('fs');
const path = require('path');

const replacements = [
  { regex: /bg-white/g, replacement: "bg-card" },
  { regex: /bg-slate-50\/50/g, replacement: "bg-muted/50" },
  { regex: /hover:bg-slate-50\/50/g, replacement: "hover:bg-muted/50" },
  { regex: /hover:bg-slate-50/g, replacement: "hover:bg-accent" },
  { regex: /bg-slate-50/g, replacement: "bg-muted" },
  { regex: /hover:bg-slate-100/g, replacement: "hover:bg-accent" },
  { regex: /bg-slate-100/g, replacement: "bg-secondary" },
  { regex: /hover:bg-slate-300/g, replacement: "hover:bg-secondary/80" },
  { regex: /bg-slate-200/g, replacement: "bg-secondary" },
  { regex: /bg-slate-300/g, replacement: "bg-secondary/80" },
  { regex: /hover:text-slate-900/g, replacement: "hover:text-foreground" },
  { regex: /hover:text-slate-600/g, replacement: "hover:text-muted-foreground" },
  { regex: /text-slate-900/g, replacement: "text-foreground" },
  { regex: /text-slate-800/g, replacement: "text-foreground/90" },
  { regex: /text-slate-700/g, replacement: "text-foreground" },
  { regex: /text-slate-600/g, replacement: "text-muted-foreground" },
  { regex: /text-slate-500/g, replacement: "text-muted-foreground" },
  { regex: /text-slate-400/g, replacement: "text-muted-foreground/80" },
  { regex: /text-slate-300/g, replacement: "text-muted-foreground/60" },
  { regex: /border-slate-200/g, replacement: "border-border" },
  { regex: /border-slate-100/g, replacement: "border-border" },
  { regex: /border-slate-300/g, replacement: "border-border/80" },
  { regex: /border-slate-[0-9]+/g, replacement: "border-border" },
  { regex: /shadow-slate-[0-9]+\/50/g, replacement: "shadow-none" },
  { regex: /text-slate-[0-9]+/g, replacement: "text-muted-foreground" },
  { regex: /bg-slate-[0-9]+/g, replacement: "bg-muted" },
];

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      for (const {regex, replacement} of replacements) {
        content = content.replace(regex, replacement);
      }
      
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log("Updated: " + fullPath);
      }
    }
  }
}

processDir('./src');
console.log("Done");

import fs from "fs";
import path from "path";

function searchDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      searchDir(fullPath);
    } else if (fullPath.endsWith(".js") || fullPath.endsWith(".ts")) {
      const content = fs.readFileSync(fullPath, "utf-8");
      if (content.includes("fetch =")) {
        let lines = content.split('\n');
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].includes("fetch =") && (lines[i].includes("global") || lines[i].includes("window"))) {
            console.log(fullPath + ":" + (i+1) + ": " + lines[i].trim());
          }
        }
      }
    }
  }
}

searchDir("node_modules");

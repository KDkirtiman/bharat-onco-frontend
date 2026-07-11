import fs from "node:fs";
import path from "node:path";
function walk(dir, cb) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, cb);
    else if (/\.tsx?$/.test(ent.name)) cb(p);
  }
}
walk("src/packages/bfd-patterns/src", (file) => {
  const src = fs.readFileSync(file, "utf8");
  const next = src.replace(/from 'bfd-core\/datapoints\/[^']+'/g, "from 'bfd-core'");
  if (next !== src) fs.writeFileSync(file, next);
});
console.log("done");

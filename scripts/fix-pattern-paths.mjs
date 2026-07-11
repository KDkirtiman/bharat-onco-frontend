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
  let s = fs.readFileSync(file, "utf8");
  const n = s
    .replace(/from '\.\.\/\.\.\/patterns\//g, "from '../patterns/")
    .replace(/from '\.\.\/lib\/invoiceTemplate'/g, "from '../../lib/invoiceTemplate'");
  if (n !== s) fs.writeFileSync(file, n);
});
console.log("fixed pattern paths");

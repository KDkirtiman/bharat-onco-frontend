import fs from "node:fs";
import path from "node:path";

// Keeps every publishable package on the same version as the root
// package.json, so a tag like v0.3.0 publishes bfd-icons@0.3.0,
// bfd-core@0.3.0, etc. all at once (lockstep monorepo versioning).
// Also pins internal "bfd-*" dependency ranges to that same version.

const ROOT = process.cwd();
const rootPkgPath = path.join(ROOT, "package.json");
const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, "utf8"));
const version = rootPkg.version;

const pkgDir = path.join(ROOT, "packages");
const names = fs.readdirSync(pkgDir).filter((n) => n.startsWith("bfd-"));

for (const name of names) {
  const pkgPath = path.join(pkgDir, name, "package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  pkg.version = version;
  for (const field of ["dependencies", "devDependencies", "peerDependencies"]) {
    if (!pkg[field]) continue;
    for (const dep of Object.keys(pkg[field])) {
      if (dep.startsWith("bfd-")) pkg[field][dep] = version;
    }
  }
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
  console.log(`synced ${name} -> ${version}`);
}

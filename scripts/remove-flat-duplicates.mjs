import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

function rmrf(target) {
  if (!fs.existsSync(target)) return;
  fs.rmSync(target, { recursive: true, force: true });
  console.log('removed:', path.relative(ROOT, target));
}

function removeFlatDuplicates(root) {
  if (!fs.existsSync(root)) return;

  function walk(dir) {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        walk(p);
        continue;
      }

      let name = null;
      if (/^[A-Z][A-Za-z0-9]+\.tsx$/.test(ent.name)) {
        name = ent.name.replace(/\.tsx$/, '');
      } else if (/^[A-Z][A-Za-z0-9]+\.stories\.tsx$/.test(ent.name)) {
        name = ent.name.replace(/\.stories\.tsx$/, '');
      }
      if (!name) continue;

      const folderFile = path.join(dir, name, ent.name);
      if (fs.existsSync(folderFile)) {
        fs.unlinkSync(p);
        console.log('removed duplicate:', path.relative(ROOT, p));
      }
    }
  }

  walk(root);
}

// Legacy folders (idempotent)
for (const dir of [
  'src/components',
  'src/patterns',
  'src/styles',
  'src/tokens',
  'src/datapoints',
  'src/foundations',
  'src/stories',
  'src/lib',
  'design-system',
  '.storybook',
]) {
  rmrf(path.join(ROOT, dir));
}

// Orphan shim file
rmrf(path.join(ROOT, 'src/shim-index.ts'));

// Flat duplicates in packages
removeFlatDuplicates(path.join(ROOT, 'src/packages/bfd-core/src/components'));
removeFlatDuplicates(path.join(ROOT, 'src/packages/bfd-patterns/src'));

const flatTable = path.join(ROOT, 'src/packages/bfd-tables/src/Table.tsx');
if (fs.existsSync(flatTable) && fs.existsSync(path.join(ROOT, 'src/packages/bfd-tables/src/Table/Table.tsx'))) {
  fs.unlinkSync(flatTable);
  console.log('removed duplicate:', path.relative(ROOT, flatTable));
}

console.log('cleanup done');

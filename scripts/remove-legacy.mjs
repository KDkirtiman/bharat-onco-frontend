import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

function rmrf(target) {
  if (!fs.existsSync(target)) return;
  fs.rmSync(target, { recursive: true, force: true });
  console.log('removed:', path.relative(ROOT, target));
}

/** Delete flat Component.tsx when Component/Component.tsx exists */
function removeFlatDuplicates(componentsRoot) {
  if (!fs.existsSync(componentsRoot)) return;

  function walk(dir) {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        walk(p);
        continue;
      }
      const m = ent.name.match(/^([A-Z][A-Za-z0-9]+)\.(tsx|stories\.tsx)$/);
      if (!m) continue;
      const name = m[1];
      const folderTsx = path.join(dir, name, `${name}.tsx`);
      if (fs.existsSync(folderTsx)) {
        fs.unlinkSync(p);
        console.log('removed duplicate:', path.relative(ROOT, p));
      }
    }
  }

  walk(componentsRoot);
}

// 1. Remove flat duplicates inside bfd packages
removeFlatDuplicates(path.join(ROOT, 'src/packages/bfd-core/src/components'));
removeFlatDuplicates(path.join(ROOT, 'src/packages/bfd-patterns/src'));
const flatTable = path.join(ROOT, 'src/packages/bfd-tables/src/Table.tsx');
if (fs.existsSync(flatTable) && fs.existsSync(path.join(ROOT, 'src/packages/bfd-tables/src/Table/Table.tsx'))) {
  fs.unlinkSync(flatTable);
  console.log('removed duplicate:', path.relative(ROOT, flatTable));
}

// 2. Remove legacy top-level src folders
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

// 3. Root index re-exports via shim (compat package entry)
fs.writeFileSync(
  path.join(ROOT, 'src/index.ts'),
  `import 'bfd-themes/register';

export * from 'bfd-core';
export * from 'bfd-patterns';
export * from 'bfd-tables';
export * from 'bfd-icons';
export * from 'bfd-themes';
`,
);

// 4. Update tsconfig.build.json — only build shim, not entire src tree
fs.writeFileSync(
  path.join(ROOT, 'tsconfig.build.json'),
  JSON.stringify(
    {
      compilerOptions: {
        target: 'ES2023',
        lib: ['ES2023', 'DOM', 'DOM.Iterable'],
        module: 'ESNext',
        moduleResolution: 'bundler',
        jsx: 'react-jsx',
        declaration: true,
        declarationMap: true,
        emitDeclarationOnly: true,
        outDir: './dist',
        rootDir: './src',
        skipLibCheck: true,
        strict: true,
        noUnusedLocals: false,
        noUnusedParameters: false,
        verbatimModuleSyntax: true,
        types: ['vite/client'],
      },
      include: ['src/shim.ts', 'src/register-shim.ts'],
      exclude: ['src/**/*.stories.tsx', 'src/packages/**', 'src/apps/**'],
    },
    null,
    2,
  ) + '\n',
);

console.log('legacy cleanup complete');

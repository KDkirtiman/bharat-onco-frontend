import fs from "node:fs";
import path from "node:path";
const ROOT = process.cwd();
function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

write("src/packages/bfd-themes/src/register.ts", "import './styles/index.css';\n");
write("src/packages/bfd-themes/src/index.ts", "export { bharatOncoPreset, default as tailwindPreset } from './tailwind-preset';\nexport * from './tokens';\n");

write("src/packages/bfd-themes/package.json", JSON.stringify({
  name: "bfd-themes", version: "0.2.0", type: "module",
  main: "./dist/index.js", types: "./dist/index.d.ts",
  sideEffects: ["*.css", "./dist/register.js"],
  exports: {
    ".": { types: "./dist/index.d.ts", import: "./dist/index.js" },
    "./register": { import: "./dist/register.js" },
    "./styles.css": "./dist/styles.css",
    "./tailwind": { types: "./dist/tailwind-preset.d.ts", import: "./dist/tailwind-preset.js" }
  },
  scripts: {
    build: "vite build && npm run build:css",
    "build:css": "npx @tailwindcss/cli -i ./src/styles/index.css -o ./dist/styles.css --minify"
  }
}, null, 2));

write("src/packages/bfd-icons/src/index.ts", "export * from 'lucide-react';\n");
write("src/packages/bfd-icons/package.json", JSON.stringify({
  name: "bfd-icons", version: "0.2.0", type: "module",
  main: "./dist/index.js", types: "./dist/index.d.ts",
  exports: { ".": { types: "./dist/index.d.ts", import: "./dist/index.js" } },
  scripts: { build: "vite build" },
  peerDependencies: { react: "^18 || ^19" },
  dependencies: { "lucide-react": "^0.487.0" }
}, null, 2));

write("src/packages/bfd-core/src/index.ts", `export * from './components/controls';
export type { SelectOption, SearchComboboxItem, FilterToggleOption } from './components/controls';
export * from './components/feedback';
export type { CalloutVariant } from './components/feedback';
export * from './components/data-display';
export * from './components/layout';
export type { SidebarNavItem, ModalSize } from './components/layout';
export { cn } from './lib/cn';
export { localToday, fmtDate, fmtDateShort, formatTime, calcAge } from './lib/formatters';
`);

write("src/packages/bfd-core/package.json", JSON.stringify({
  name: "bfd-core", version: "0.2.0", type: "module",
  main: "./dist/index.js", types: "./dist/index.d.ts",
  exports: { ".": { types: "./dist/index.d.ts", import: "./dist/index.js" } },
  scripts: { build: "vite build" },
  peerDependencies: { react: "^18 || ^19", "react-dom": "^18 || ^19" },
  dependencies: {
    "bfd-themes": "*", "bfd-icons": "*",
    "@radix-ui/react-dialog": "^1.1.6", "@radix-ui/react-label": "^2.1.2",
    "@radix-ui/react-popover": "^1.1.6", "@radix-ui/react-select": "^2.1.6",
    "@radix-ui/react-separator": "^1.1.2", "@radix-ui/react-slot": "^1.1.2",
    "@radix-ui/react-tooltip": "^1.1.8", "class-variance-authority": "^0.7.1",
    clsx: "^2.1.1", "date-fns": "^3.6.0", "react-day-picker": "^8.10.1", "tailwind-merge": "^3.2.0"
  }
}, null, 2));

const tableTsx = `import type { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react';
import { cn } from 'bfd-core';
export function Table({ className, ...rest }: HTMLAttributes<HTMLTableElement>) {
  return <table {...rest} className={cn('w-full text-sm border-collapse', className)} />;
}
export function TableHead({ className, ...rest }: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead {...rest} className={cn('bg-neutral-soft', className)} />;
}
export function TableBody(props: HTMLAttributes<HTMLTableSectionElement>) { return <tbody {...props} />; }
export function TableRow({ className, ...rest }: HTMLAttributes<HTMLTableRowElement>) {
  return <tr {...rest} className={cn('border-b border-border hover:bg-muted/30', className)} />;
}
export function Th({ className, ...rest }: ThHTMLAttributes<HTMLTableCellElement>) {
  return <th {...rest} className={cn('text-left text-caption font-semibold text-muted-foreground uppercase tracking-wide px-4 py-2', className)} />;
}
export function Td({ className, ...rest }: TdHTMLAttributes<HTMLTableCellElement>) {
  return <td {...rest} className={cn('px-4 py-2.5 text-foreground', className)} />;
}`;
write("src/packages/bfd-tables/src/Table.tsx", tableTsx);
write("src/packages/bfd-tables/src/index.ts", "export { Table, TableHead, TableBody, TableRow, Th, Td } from './Table';\n");
write("src/packages/bfd-tables/package.json", JSON.stringify({
  name: "bfd-tables", version: "0.2.0", type: "module",
  main: "./dist/index.js", types: "./dist/index.d.ts",
  exports: { ".": { types: "./dist/index.d.ts", import: "./dist/index.js" } },
  scripts: { build: "vite build" },
  peerDependencies: { react: "^18 || ^19" },
  dependencies: { "bfd-core": "*", "bfd-themes": "*" }
}, null, 2));

let pi = fs.readFileSync("src/packages/bfd-patterns/src/index.ts", "utf8");
pi = pi.replace(/\.\/components\/patient\//g, "./patient/");
pi = pi.replace(/from '\.\/components\/controls'/g, "from 'bfd-core'");
pi = pi.replace(/from '\.\/components\/feedback'/g, "from 'bfd-core'");
pi = pi.replace(/from '\.\/components\/data-display'/g, "from 'bfd-core'");
pi = pi.replace(/from '\.\/components\/layout'/g, "from 'bfd-core'");
pi = pi.replace(/from '\.\/lib\/cn'/g, "from 'bfd-core'");
pi = pi.replace(/from '\.\/lib\/formatters'/g, "from 'bfd-core'");
pi = pi.replace(/export \{ cn \} from 'bfd-core';\r?\n/, "");
pi = pi.replace(/export \{\r?\n  localToday,[\s\S]*?\} from 'bfd-core';\r?\n/, "");
pi = pi.replace(/\/\/ Tailwind preset[\s\S]*?\/\/ Design tokens[\s\S]*$/m, "");
fs.writeFileSync("src/packages/bfd-patterns/src/index.ts", pi);

write("src/packages/bfd-patterns/package.json", JSON.stringify({
  name: "bfd-patterns", version: "0.2.0", type: "module",
  main: "./dist/index.js", types: "./dist/index.d.ts",
  exports: { ".": { types: "./dist/index.d.ts", import: "./dist/index.js" } },
  scripts: { build: "vite build" },
  peerDependencies: { react: "^18 || ^19", "react-dom": "^18 || ^19" },
  dependencies: { "bfd-core": "*", "bfd-icons": "*", "bfd-themes": "*", "bfd-tables": "*" }
}, null, 2));

write("src/shim.ts", `import 'bfd-themes/register';
export * from 'bfd-core';
export * from 'bfd-patterns';
export * from 'bfd-tables';
export * from 'bfd-icons';
export * from 'bfd-themes';
`);

write("src/apps/storybook/package.json", JSON.stringify({
  name: "storybook", version: "0.0.0", private: true,
  scripts: { dev: "storybook dev -p 6006", storybook: "storybook dev -p 6006", "build-storybook": "storybook build" },
  dependencies: { "bfd-core": "*", "bfd-icons": "*", "bfd-patterns": "*", "bfd-tables": "*", "bfd-themes": "*" }
}, null, 2));

const rootPkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
rootPkg.private = true;
rootPkg.name = "bharat-onco-frontend-workspace";
rootPkg.workspaces = ["src/packages/*", "src/apps/*"];
rootPkg.scripts = {
  dev: "npm run storybook --workspace=storybook",
  build: "npm run build --workspaces --if-present",
  storybook: "npm run storybook --workspace=storybook",
  "build-storybook": "npm run build-storybook --workspace=storybook",
  lint: "eslint ."
};
fs.writeFileSync("package.json", JSON.stringify(rootPkg, null, 2));

const sbMainPath = "src/apps/storybook/.storybook/main.ts";
let sbMain = fs.readFileSync(sbMainPath, "utf8");
sbMain = sbMain.replace("stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)']",
`stories: [
    '../../packages/bfd-core/src/**/*.stories.@(ts|tsx)',
    '../../packages/bfd-patterns/src/**/*.stories.@(ts|tsx)',
    '../foundations/**/*.stories.@(ts|tsx)',
  ]`);
fs.writeFileSync(sbMainPath, sbMain);

write("src/apps/storybook/.storybook/preview.ts", `import type { Preview } from '@storybook/react';
import 'bfd-themes/register';
const preview: Preview = { parameters: { layout: 'padded' } };
export default preview;
`);

for (const f of ["src/apps/storybook/foundations/Colors.stories.tsx", "src/apps/storybook/foundations/Typography.stories.tsx"]) {
  if (!fs.existsSync(f)) continue;
  let c = fs.readFileSync(f, "utf8");
  c = c.replace(/from '\.\.\/\.\.\/tokens\//g, "from 'bfd-themes");
  c = c.replace(/from '\.\.\/tokens\//g, "from 'bfd-themes");
  fs.writeFileSync(f, c);
}

console.log("packages configured");

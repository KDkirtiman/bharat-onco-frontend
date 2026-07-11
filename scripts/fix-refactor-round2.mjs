import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const core = path.join(ROOT, 'src/packages/bfd-core/src/components');

function walk(dir, cb) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, cb);
    else cb(p);
  }
}

// Fix multiline broken string exports in .styles.ts
walk(path.join(ROOT, 'src/packages'), (file) => {
  if (!file.endsWith('.styles.ts')) return;
  let s = fs.readFileSync(file, 'utf8');
  const fixed = s.replace(
    /export const (style\d+) = '\n([\s\S]*?)';/g,
    (_, name, body) => `export const ${name} = '${body.replace(/\s+/g, ' ').trim()}';`,
  );
  if (fixed !== s) {
    fs.writeFileSync(file, fixed);
    console.log('fixed styles:', path.relative(ROOT, file));
  }
});

// Cross-folder import fixes within bfd-core
const replacements = [
  [path.join(core, 'layout/AppLayout/AppLayout.tsx'), [
    ["from './Header'", "from '../Header'"],
    ["from './Sidebar'", "from '../Sidebar'"],
    ["from 'bfd-core/datapoints/", "from '../../../datapoints/"],
  ]],
  [path.join(core, 'controls/SearchCombobox/SearchCombobox.tsx'), [
    ["from './TextField'", "from '../TextField'"],
    ["from '../feedback/EmptyState'", "from '../../feedback/EmptyState'"],
  ]],
  [path.join(core, 'controls/FormField/FormField.stories.tsx'), [
    ["from './TextField'", "from '../TextField'"],
  ]],
  [path.join(core, 'layout/Header/Header.tsx'), [
    ["from '../../assets/", "from '../../../assets/"],
    ["from 'bfd-core/datapoints/", "from '../../../datapoints/"],
  ]],
  [path.join(core, 'layout/Sidebar/Sidebar.tsx'), [
    ["from 'bfd-core/datapoints/", "from '../../../datapoints/"],
  ]],
  [path.join(core, 'layout/Modal/Modal.stories.tsx'), [
    ["from '../../controls/Button'", "from '../../controls/Button'"],
  ]],
];

for (const [file, reps] of replacements) {
  if (!fs.existsSync(file)) continue;
  let s = fs.readFileSync(file, 'utf8');
  let changed = false;
  for (const [a, b] of reps) {
    if (s.includes(a)) {
      s = s.replaceAll(a, b);
      changed = true;
    }
  }
  if (changed) fs.writeFileSync(file, s);
}

// Modal - move sizeClasses to styles
const modalDir = path.join(core, 'layout/Modal');
const modalStylesPath = path.join(modalDir, 'Modal.styles.ts');
let modalStyles = fs.readFileSync(modalStylesPath, 'utf8');
if (!modalStyles.includes('sizeClasses')) {
  modalStyles += `
export const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
} as const;

export type ModalSize = keyof typeof sizeClasses;
`;
  fs.writeFileSync(modalStylesPath, modalStyles);
}

let modalTsx = fs.readFileSync(path.join(modalDir, 'Modal.tsx'), 'utf8');
modalTsx = modalTsx.replace(/const sizeClasses = \{[\s\S]*?\} as const;\n\nexport type ModalSize = keyof typeof sizeClasses;\n\n/, '');
modalTsx = modalTsx.replace(/sizeClasses\[size\]/g, 'styles.sizeClasses[size]');
modalTsx = modalTsx.replace(/className=\{cn\(/g, 'className={styles.modalCn(');
if (!modalStyles.includes('modalCn')) {
  fs.appendFileSync(
    modalStylesPath,
    `
export function modalCn(...parts: (string | undefined | false)[]) {
  return cn(...parts);
}
`,
  );
}
modalTsx = modalTsx.replace(/export type ModalSize = keyof typeof sizeClasses;\n?/, 'export type { ModalSize } from \'./Modal.styles\';\n');
fs.writeFileSync(path.join(modalDir, 'Modal.tsx'), modalTsx);
fs.writeFileSync(
  path.join(modalDir, 'index.ts'),
  `export { Modal, ModalHeader, ModalBody, ModalFooter } from './Modal';\nexport type { ModalSize } from './Modal.styles';\n`,
);

// Fix bfd-patterns cross imports from patient to patterns
walk(path.join(ROOT, 'src/packages/bfd-patterns/src/patient'), (file) => {
  if (!file.endsWith('.tsx')) return;
  let s = fs.readFileSync(file, 'utf8');
  const n = s
    .replace(/from '\.\.\/patterns\/clinical\//g, "from '../../patterns/clinical/")
    .replace(/from '\.\.\/patterns\/billing\//g, "from '../../patterns/billing/")
    .replace(/from '\.\.\/patterns\/scheduling\//g, "from '../../patterns/scheduling/");
  if (n !== s) fs.writeFileSync(file, n);
});

// Update pattern domain barrels to folder exports
function updatePatternBarrel(dir, names) {
  const barrel = path.join(dir, 'index.ts');
  fs.writeFileSync(
    barrel,
    names.map((n) => `export { ${n} } from './${n}';`).join('\n') + '\n',
  );
}

updatePatternBarrel(path.join(ROOT, 'src/packages/bfd-patterns/src/patterns/billing'), [
  'GenerateInvoiceOverlay', 'GenerateFullInvoiceOverlay', 'ViewInvoiceOverlay',
]);
updatePatternBarrel(path.join(ROOT, 'src/packages/bfd-patterns/src/patterns/clinical'), [
  'PrescriptionViewerOverlay', 'PatientRegistrationOverlay', 'OncologistReferencePanel',
  'AddStagingOverlay', 'AddTreatmentPlanOverlay', 'AddToxicityOverlay', 'AddResponseAssessmentOverlay',
  'LogDeliveryOverlay', 'CycleDetailOverlay', 'PastVisitDetailOverlay', 'UploadDocumentOverlay',
  'DocumentViewerOverlay', 'AdverseEventLogOverlay',
]);
updatePatternBarrel(path.join(ROOT, 'src/packages/bfd-patterns/src/patterns/scheduling'), [
  'BookAppointmentOverlay', 'QuickScheduleOverlay', 'RescheduleOverlay', 'CancelOverlay',
  'ViewDetailsOverlay', 'ChairAssignmentOverlay', 'SendReminderOverlay', 'ReminderDetailsOverlay',
  'AppointmentCard', 'VisitAlertsCard',
]);

console.log('round 2 fixes done');

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const patientDir = path.join(ROOT, 'src/packages/bfd-patterns/src/patient');

const patientTabs = [
  'OverviewTab', 'PastVisitsTab', 'MedicalRecordsTab', 'CancerStagingTab',
  'TreatmentPlanTab', 'TreatmentDeliveryTab', 'ResponseAssessmentTab', 'ToxicityTab',
  'SurvivorshipTab', 'RecurrenceTab', 'PalliativeCareTab', 'BillingTab', 'ClinicVisitTab',
  'CostEstimationSubTab', 'PastInvoicesSubTab', 'InsuranceClaimsSubTab', 'PaymentDetailsSubTab',
  'PatientHeaderCard', 'PatientTabs',
];

function fixFile(file) {
  let s = fs.readFileSync(file, 'utf8');
  const orig = s;

  for (const tab of patientTabs) {
    s = s.replaceAll(`from './${tab}'`, `from '../${tab}'`);
  }

  s = s.replaceAll("from '../../lib/invoiceTemplate'", "from '../../../lib/invoiceTemplate'");
  s = s.replaceAll("from '../lib/invoiceTemplate'", "from '../../../lib/invoiceTemplate'");

  s = s.replaceAll("from '../../patterns/billing/", "from '../../patterns/billing/");
  s = s.replaceAll("from '../../patterns/clinical/", "from '../../patterns/clinical/");

  // PatientTabs overlay imports - already ../../patterns

  if (s !== orig) {
    fs.writeFileSync(file, s);
    console.log('fixed:', path.relative(ROOT, file));
  }
}

function walk(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p);
    else if (ent.name.endsWith('.tsx')) fixFile(p);
  }
}

walk(patientDir);
walk(path.join(ROOT, 'src/packages/bfd-patterns/src/patterns'));

// patient barrel index if exists
const patientIndex = path.join(patientDir, 'index.ts');
if (!fs.existsSync(patientIndex)) {
  const names = fs.readdirSync(patientDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
  fs.writeFileSync(patientIndex, names.map((n) => `export { ${n} } from './${n}';`).join('\n') + '\n');
}

console.log('patient imports fixed');

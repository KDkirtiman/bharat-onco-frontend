import { badge } from 'bfd-themes';

export interface CustomVitalEntry {
  name:  string;
  value: string;
  unit:  string;
}

export interface Vitals {
  id:           string;
  patientId:    string;
  visitId:      string;
  bp:           string;   // e.g. "128/82"
  heartRate:    number;   // bpm
  temperature:  number;   // °F
  bmi:          number;
  bsa:          number;   // m²
  spo2:         number;   // %
  height?:      number;   // cm
  weight?:      number;   // kg
  recordedAt:   string;   // ISO date
  customVitals?: CustomVitalEntry[];
}

export interface VisitPrescription {
  id:              string;
  medicineName:    string;
  dose:            string;
  strength?:       string;
  frequency:       string;
  duration:        string;
  numberOfDays?:   string;
  beforeAfterFood?: string;
  timeOfDay?:      string;
  instructions?:   string;
}

export interface VisitTestOrder {
  id:           string;
  category:     string;
  subcategory?: string;
  testName:     string;
  instructions?: string;
}

export interface VisitExamination {
  // General Examination — structured
  cachexia?:              string;
  pallor?:                string;
  icterus?:               string;
  cyanosis?:              string;
  clubbing?:              string;
  edema?:                 string;
  lymphadenopathy?:       string;
  lymphadenopathySite?:   string;
  dehydration?:           string;
  general?:               string;  // additional free-text notes

  // Site-Wise
  primarySite?:           string;
  lymphNodes?:            string;

  // Abdomen — structured
  abdomenDistension?:     string;
  abdomenTenderness?:     string;
  abdomenAscites?:        string;
  abdomenBowelSounds?:    string;
  abdomenSpleen?:         string;
  abdomenLump?:           string;
  abdomenConsistency?:    string;
  abdomen?:               string;  // free-text detail

  // Liver — structured
  hepatomegaly?:          string;
  liverConsistency?:      string;
  liverSurface?:          string;
  liver?:                 string;  // free-text detail

  // Lungs — structured
  airEntry?:              string;
  breathSounds?:          string;
  lungCrackles?:          string;
  pleuralEffusion?:       string;
  lungs?:                 string;  // free-text detail

  skin?:                  string;
  neurological?:          string;
  cardiac?:               string;
  oralCavity?:            string;
}

export const KARNOFSKY_LABELS: Record<number, string> = {
  100: 'Normal; no complaints; no evidence of disease',
  90:  'Normal activity; minor signs or symptoms of disease',
  80:  'Normal activity with effort; some signs/symptoms',
  70:  'Cares for self; unable to carry on normal activity or work',
  60:  'Occasional assistance; able to care for most personal needs',
  50:  'Requires considerable assistance and frequent medical care',
  40:  'Disabled; requires special care and assistance',
  30:  'Severely disabled; hospitalization indicated',
  20:  'Very sick; active supportive care necessary',
  10:  'Moribund; fatal processes progressing rapidly',
  0:   'Dead',
};

export type EcogScore = 0 | 1 | 2 | 3 | 4;

export const ECOG_LABELS: Record<EcogScore, string> = {
  0: 'Fully active; no restrictions',
  1: 'Restricted in strenuous activity; ambulatory, light work capable',
  2: 'Ambulatory and capable of self-care; unable to work; up >50% of waking hours',
  3: 'Capable of limited self-care; confined to bed/chair >50% of waking hours',
  4: 'Completely disabled; cannot self-care; confined to bed/chair',
};

export const ECOG_COLORS: Record<EcogScore, string> = {
  0: badge.success,
  1: badge.teal,
  2: badge.warning,
  3: badge.orange,
  4: badge.destructive,
};

import type { PatientPastHistory } from './patients';

export interface AdverseEvent {
  id:           string;
  patientId:    string;
  appointmentId: string;
  time:         string;
  description:  string;
  severity:     'mild' | 'moderate' | 'severe';
  actionTaken:  string;
}

export interface ChemoPreMed {
  id:         string;
  name:       string;
  dose:       string;
  route:      string;
  timeGiven:  string;
}

export interface ChemoPreChecklistLabs {
  cbc: {
    haemoglobin: string;
    totalWbc:    string;
    anc:         string;
    platelet:    string;
  };
  renal: {
    creatinine: string;
    eGFR:       string;
    urea:       string;
  };
  liver: {
    bilirubin: string;
    sgot:      string;
    sgpt:      string;
    albumin:   string;
  };
  electrolytes: {
    sodium:    string;
    potassium: string;
    calcium:   string;
    magnesium: string;
  };
}

export interface ChemoPreChecklist {
  labs: ChemoPreChecklistLabs;
  regimenValidation: {
    protocolVerified:           boolean;
    doseVerified:               boolean;
    cycleVerified:              boolean;
    drugInteractionChecked:     boolean;
    previousToxicityReviewed:   boolean;
  };
  doseModification: {
    type:              'none' | 'reduced' | 'delayed' | 'drug-omitted';
    reason?:           string;
    reductionPercent?: string;
  };
  consent: {
    chemoConsentSigned:      boolean;
    bloodConsentSigned:      boolean;
    financialConsentSigned:  boolean;
    protocolSheetUploaded:   boolean;
    preAuthApproved:         boolean;
    identityBandVerified:    boolean;
  };
  documents: {
    consentForm:        boolean;
    labReports:         boolean;
    insuranceApproval:  boolean;
    prescriptionCopy:   boolean;
    letterOfReturn:     boolean;
  };
}

export const DEFAULT_CHEMO_CHECKLIST: ChemoPreChecklist = {
  labs: {
    cbc:          { haemoglobin: '', totalWbc: '', anc: '', platelet: '' },
    renal:        { creatinine: '', eGFR: '', urea: '' },
    liver:        { bilirubin: '', sgot: '', sgpt: '', albumin: '' },
    electrolytes: { sodium: '', potassium: '', calcium: '', magnesium: '' },
  },
  regimenValidation: {
    protocolVerified: false, doseVerified: false, cycleVerified: false,
    drugInteractionChecked: false, previousToxicityReviewed: false,
  },
  doseModification: { type: 'none' },
  consent: {
    chemoConsentSigned: false, bloodConsentSigned: false, financialConsentSigned: false,
    protocolSheetUploaded: false, preAuthApproved: false, identityBandVerified: false,
  },
  documents: {
    consentForm: false, labReports: false, insuranceApproval: false, prescriptionCopy: false, letterOfReturn: false,
  },
};

export interface FieldChange {
  field: string;
  from:  string;
  to:    string;
}

export interface Section1EditEntry {
  editedAt: string;
  editedBy: string;
  role:     string;
  changes:  FieldChange[];
}

export interface FollowUp {
  value:              number;
  unit:               'Days' | 'Weeks' | 'Months';
  specificDate:       string;
  noFollowUpNeeded?:  boolean;
  noFollowUpReason?:  string;
}

export interface ClinicalVisit {
  id:                       string;
  patientId:                string;
  appointmentId:            string;
  vitalsId?:                string;
  attendingNurseId?:        string;
  attendingOncologistId?:   string;
  chiefComplaints?:         string;
  complaintDuration?:       string;
  hpi?:                     string;  // History of Present Illness (SOAP S)
  provisionalDiagnosis?:    string;  // Assessment section (SOAP A)
  noKnownAllergies?:        boolean;
  noSignificantPastHistory?: boolean;
  pastHistory?:             PatientPastHistory;
  examination?:             VisitExamination;
  ecogScore?:               EcogScore;
  karnofskyScore?:          number;
  clinicalNotes?:           string;
  plan?:                    string;
  prescriptions?:           VisitPrescription[];
  testOrders?:              VisitTestOrder[];
  tumorBoardReview?:        boolean;
  followUp?:                FollowUp;
  adverseEvents?:           AdverseEvent[];
  chemoPreChecklist?:       ChemoPreChecklist;
  chemoAuthNotes?:          string;
  chemoAuthRejectionReason?: string;
  chemoSessionType?:        'day-care' | 'inpatient';
  chemoAssignedChairId?:    string;
  chemoEstimatedDuration?:  string;
  chemoPreMeds?:            ChemoPreMed[];
  chemoSessionAdverseEvents?: AdverseEvent[];
  chemoFollowUp?:           FollowUp;
  completedSections?:       Array<'vitals' | 'consultation' | 'staging' | 'treatment-plan' | 'toxicity' | 'checklist'>;
  section1EditHistory?:     Section1EditEntry[];
  createdAt:                string;
  updatedAt:                string;
}

// ── Order sets (re-exported from medications.ts) ──────────────────────────────
export type { MedicationOrderSet } from './medications';
export { MEDICATION_ORDER_SETS, INJECTION_ORDER_SETS } from './medications';

export const LAB_PANEL_OPTIONS: string[] = [
  'CBC (Complete Blood Count)',
  'LFT (Liver Function Test)',
  'KFT (Kidney Function Test)',
  'Serum Electrolytes',
  'TFT (Thyroid Function Test)',
];

export const RADIOLOGY_OPTIONS: string[] = [
  'CT Scan',
  'USG (Ultrasound)',
  'X-Ray',
  'Mammography',
];

export interface InvestigationOrderSetItem {
  category:     string;
  subcategory?: string;
  testName:     string;
  instructions?: string;
}

export interface InvestigationOrderSet {
  name:        string;
  description: string;
  tests:       InvestigationOrderSetItem[];
}

export const INVESTIGATION_ORDER_SETS: InvestigationOrderSet[] = [
  {
    name:        'Pre-Chemo Panel',
    description: 'Mandatory labs before starting any chemotherapy cycle',
    tests: [
      { category: 'Lab Work', subcategory: 'CBC',                testName: 'CBC (Complete Blood Count)',   instructions: 'Must be within 48 hrs of chemo' },
      { category: 'Lab Work', subcategory: 'LFT',                testName: 'LFT (Liver Function Test)' },
      { category: 'Lab Work', subcategory: 'RFT',                testName: 'KFT (Kidney Function Test)' },
      { category: 'Lab Work', subcategory: 'Others',             testName: 'Serum Electrolytes' },
      { category: 'Lab Work', subcategory: 'Coagulation Profile', testName: 'PT / INR',                   instructions: 'Coagulation screen' },
      { category: 'Lab Work', subcategory: 'Others',             testName: 'Blood Sugar (Fasting)' },
    ],
  },
  {
    name:        'Post-Chemo Monitoring',
    description: 'Routine bloods 7–14 days after chemotherapy to monitor toxicity',
    tests: [
      { category: 'Lab Work', subcategory: 'CBC',    testName: 'CBC (Complete Blood Count)',   instructions: 'Nadir monitoring — Day 10–14' },
      { category: 'Lab Work', subcategory: 'LFT',    testName: 'LFT (Liver Function Test)' },
      { category: 'Lab Work', subcategory: 'RFT',    testName: 'KFT (Kidney Function Test)' },
      { category: 'Lab Work', subcategory: 'Others', testName: 'Serum Electrolytes' },
    ],
  },
  {
    name:        'Baseline Workup',
    description: 'Comprehensive baseline investigations at new diagnosis',
    tests: [
      { category: 'Lab Work', subcategory: 'CBC',    testName: 'CBC (Complete Blood Count)' },
      { category: 'Lab Work', subcategory: 'LFT',    testName: 'LFT (Liver Function Test)' },
      { category: 'Lab Work', subcategory: 'RFT',    testName: 'KFT (Kidney Function Test)' },
      { category: 'Lab Work', subcategory: 'Others', testName: 'Serum Electrolytes' },
      { category: 'Lab Work', subcategory: 'Others', testName: 'TFT (Thyroid Function Test)' },
      { category: 'Lab Work', subcategory: 'Others', testName: 'Blood Sugar (Fasting)' },
      { category: 'Lab Work', subcategory: 'Others', testName: 'Serum Calcium' },
      { category: 'Lab Work', subcategory: 'Others', testName: 'Serum LDH' },
      { category: 'Lab Work', subcategory: 'Others', testName: 'Serum Albumin' },
    ],
  },
  {
    name:        'CT Staging (Chest + Abdomen + Pelvis)',
    description: 'Full staging CT scan with contrast',
    tests: [
      { category: 'Radiology', subcategory: 'CT Scan', testName: 'CECT Chest',              instructions: 'With IV contrast; lung window' },
      { category: 'Radiology', subcategory: 'CT Scan', testName: 'CECT Abdomen & Pelvis',   instructions: 'With IV contrast; portal venous phase' },
    ],
  },
  {
    name:        'Response Assessment Panel',
    description: 'Mid-treatment or post-treatment response evaluation',
    tests: [
      { category: 'Radiology', subcategory: 'CT Scan', testName: 'CECT Chest + Abdomen + Pelvis', instructions: 'RECIST 1.1 response assessment' },
      { category: 'Lab Work',  subcategory: 'CBC',     testName: 'CBC (Complete Blood Count)' },
      { category: 'Lab Work',  subcategory: 'LFT',     testName: 'LFT (Liver Function Test)' },
      { category: 'Lab Work',  subcategory: 'RFT',     testName: 'KFT (Kidney Function Test)' },
      { category: 'Lab Work',  subcategory: 'Others',  testName: 'Serum LDH',                 instructions: 'Tumour burden marker' },
    ],
  },
  {
    name:        'Tumour Marker Panel',
    description: 'Serum tumour markers for monitoring',
    tests: [
      { category: 'Lab Work', subcategory: 'Tumour Markers', testName: 'CEA (Carcinoembryonic Antigen)' },
      { category: 'Lab Work', subcategory: 'Tumour Markers', testName: 'CA 19-9' },
      { category: 'Lab Work', subcategory: 'Tumour Markers', testName: 'CA 125' },
      { category: 'Lab Work', subcategory: 'Tumour Markers', testName: 'AFP (Alpha-Fetoprotein)' },
      { category: 'Lab Work', subcategory: 'Tumour Markers', testName: 'PSA (Prostate-Specific Antigen)' },
      { category: 'Lab Work', subcategory: 'Tumour Markers', testName: 'Beta-HCG' },
    ],
  },
  {
    name:        'Bone Metastasis Workup',
    description: 'Evaluation for skeletal metastases',
    tests: [
      { category: 'Radiology', subcategory: 'Others', testName: 'Bone Scan (Tc-99m)',          instructions: 'Whole body scintigraphy' },
      { category: 'Radiology', subcategory: 'X-Ray',  testName: 'X-Ray Spine (AP + Lat)',       instructions: 'Cervical, Thoracic, Lumbar' },
      { category: 'Lab Work',  subcategory: 'Others', testName: 'Serum Calcium' },
      { category: 'Lab Work',  subcategory: 'Others', testName: 'Serum ALP (Alkaline Phosphatase)' },
      { category: 'Lab Work',  subcategory: 'Others', testName: 'Serum Phosphorus' },
    ],
  },
  {
    name:        'Infection Workup',
    description: 'Febrile neutropenia or suspected infection screen',
    tests: [
      { category: 'Lab Work',  subcategory: 'CBC',        testName: 'CBC (Complete Blood Count)',  instructions: 'Check ANC — if < 500, febrile neutropenia protocol' },
      { category: 'Lab Work',  subcategory: 'Others',     testName: 'Blood Culture × 2',           instructions: 'Peripheral + central line; aerobic & anaerobic' },
      { category: 'Lab Work',  subcategory: 'Urinalysis', testName: 'Urine Routine Examination' },
      { category: 'Lab Work',  subcategory: 'Urinalysis', testName: 'Urine Culture & Sensitivity' },
      { category: 'Lab Work',  subcategory: 'Others',     testName: 'CRP (C-Reactive Protein)' },
      { category: 'Lab Work',  subcategory: 'Others',     testName: 'Procalcitonin' },
      { category: 'Radiology', subcategory: 'X-Ray',      testName: 'X-Ray Chest (PA)',            instructions: 'Rule out pneumonia' },
    ],
  },
  {
    name:        'Nutritional Assessment',
    description: 'Labs to assess nutritional status and plan support',
    tests: [
      { category: 'Lab Work', subcategory: 'Others', testName: 'Serum Albumin' },
      { category: 'Lab Work', subcategory: 'Others', testName: 'Serum Pre-albumin (Transthyretin)' },
      { category: 'Lab Work', subcategory: 'Others', testName: 'Total Protein' },
      { category: 'Lab Work', subcategory: 'Others', testName: 'Serum Transferrin' },
      { category: 'Lab Work', subcategory: 'CBC',    testName: 'CBC (Complete Blood Count)' },
      { category: 'Lab Work', subcategory: 'Others', testName: 'Serum Vitamin B12' },
      { category: 'Lab Work', subcategory: 'Others', testName: 'Serum Folate' },
      { category: 'Lab Work', subcategory: 'Others', testName: 'Serum Iron Studies' },
    ],
  },
];

// ── Mock data ────────────────────────────────────────────────────────────────

function relDate(offset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().split('T')[0];
}

const today = relDate(0);

export const mockVitals: Vitals[] = [
  {
    id: 'v1', patientId: 'p1', visitId: 'BO-KRK-20240110-001',
    bp: '128/82', heartRate: 78, temperature: 98.4, bmi: 24.1, bsa: 1.82, spo2: 97,
    recordedAt: today,
  },
  {
    id: 'v2', patientId: 'p3', visitId: 'BO-KRK-20240305-001',
    bp: '136/88', heartRate: 84, temperature: 98.9, bmi: 22.8, bsa: 1.74, spo2: 95,
    recordedAt: relDate(-1),
  },
  {
    id: 'v3', patientId: 'p4', visitId: 'BO-SML-20240420-001',
    bp: '118/76', heartRate: 72, temperature: 97.8, bmi: 23.5, bsa: 1.68, spo2: 98,
    recordedAt: relDate(-2),
  },
  {
    id: 'v4', patientId: 'p6', visitId: 'BO-UNA-20240803-001',
    bp: '122/78', heartRate: 76, temperature: 98.6, bmi: 21.9, bsa: 1.65, spo2: 99,
    recordedAt: relDate(-3),
  },
  {
    id: 'v5', patientId: 'p7', visitId: 'BO-KRK-20240915-001',
    bp: '148/92', heartRate: 88, temperature: 99.1, bmi: 27.3, bsa: 1.91, spo2: 94,
    recordedAt: relDate(-5),
  },
  {
    id: 'v6', patientId: 'p8', visitId: 'BO-DRA-20241122-001',
    bp: '110/70', heartRate: 96, temperature: 100.2, bmi: 20.4, bsa: 1.58, spo2: 96,
    recordedAt: relDate(-7),
  },
];

export const mockClinicalVisits: ClinicalVisit[] = [
  {
    id: 'cv1', patientId: 'p1', appointmentId: 'a1', vitalsId: 'v1',
    chiefComplaints: 'Persistent cough with blood-tinged sputum for 3 months, significant weight loss (~8 kg), progressive fatigue, and occasional night sweats. CT chest suggests right upper lobe mass — biopsy pending.',
    ecogScore: 1,
    clinicalNotes: 'Patient presents with persistent cough, haemoptysis, and significant weight loss (8 kg over 3 months). Chest CT confirms right upper lobe mass 4.2 × 3.8 cm with ipsilateral mediastinal nodal involvement. ECOG PS 1. Biopsy confirms non-small cell lung carcinoma, squamous histology.',
    plan: 'Initiate concurrent chemoradiotherapy — Cisplatin 75 mg/m² + Etoposide 100 mg/m² D1–D3 with 60 Gy radiotherapy over 6 weeks. PFTs requested. Refer for nutritional support. Review in 3 weeks.',
    createdAt: today, updatedAt: today,
  },
  {
    id: 'cv2', patientId: 'p3', appointmentId: 'a3', vitalsId: 'v2',
    chiefComplaints: 'Rectal bleeding with altered bowel habits over 4 months, weight loss of 6 kg, occasional lower abdominal pain. Currently on FOLFOX — tolerating treatment with Grade 2 peripheral neuropathy.',
    ecogScore: 2,
    clinicalNotes: 'Follow-up post 3 cycles of FOLFOX. Patient tolerating treatment moderately. Grade 2 peripheral neuropathy noted. CEA down from 82 to 34 ng/mL. MRI pelvis shows partial response — primary tumour reduced from 4.1 to 2.8 cm.',
    plan: 'Continue FOLFOX for 3 more cycles. Dose reduce Oxaliplatin to 75% due to neuropathy. Neurology referral for neuropathy management. Repeat MRI after cycle 6. Surgical MDT discussion pending.',
    createdAt: relDate(-1), updatedAt: relDate(-1),
  },
];

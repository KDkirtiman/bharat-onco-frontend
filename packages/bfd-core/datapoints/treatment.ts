import { badge } from 'bfd-themes';

export type PlanModality     = 'chemotherapy' | 'radiotherapy' | 'surgery';
export type TreatmentStatus  = 'planned' | 'active' | 'completed' | 'discontinued';
export type DeliveryStatus   = 'delivered' | 'missed' | 'delayed' | 'dose-reduced' | 'completed' | 'cancelled' | 'postponed';
export type ResponseCategory = 'complete-response' | 'partial-response' | 'stable-disease' | 'progressive-disease';
export type ToxicityGrade    = 1 | 2 | 3 | 4 | 5;

export const RESPONSE_LABELS: Record<ResponseCategory, string> = {
  'complete-response':   'Complete Response',
  'partial-response':    'Partial Response',
  'stable-disease':      'Stable Disease',
  'progressive-disease': 'Progressive Disease',
};

export const TREATMENT_STATUS_LABELS: Record<TreatmentStatus, string> = {
  planned:      'Planned',
  active:       'Active',
  completed:    'Completed',
  discontinued: 'Discontinued',
};

export const TREATMENT_STATUS_COLORS: Record<TreatmentStatus, string> = {
  planned:      badge.muted,
  active:       badge.success,
  completed:    badge.info,
  discontinued: badge.destructive,
};

export const DELIVERY_STATUS_LABELS: Record<DeliveryStatus, string> = {
  delivered:      'Delivered',
  missed:         'Missed',
  delayed:        'Delayed',
  'dose-reduced': 'Dose Reduced',
  completed:      'Completed',
  cancelled:      'Cancelled',
  postponed:      'Postponed',
};

export const DELIVERY_STATUS_COLORS: Record<DeliveryStatus, string> = {
  delivered:      badge.success,
  missed:         badge.destructive,
  delayed:        badge.warning,
  'dose-reduced': badge.orange,
  completed:      badge.info,
  cancelled:      badge.muted,
  postponed:      badge.warningSurfaceMid,
};

// ── Chemotherapy Plan Details ─────────────────────────────────────────────────

export interface ChemoDrug {
  name:            string;
  dose:            string;
  unit:            string;  // 'mg/m²' | 'mg/kg' | 'mg' | 'AUC' | 'mcg/kg' | 'U/m²'
  route:           string;  // 'IV' | 'Oral' | 'SC' | 'IM' | 'Intrathecal'
  dayOfCycle:      string;  // 'D1' | 'D1-D3' | 'D1,D8' | 'D1-D21'
  bsaBasedDose?:   number;  // mg/m² numeric value for BSA-based calculation
  calculatedDose?: number;  // mg — auto = bsaBasedDose × patient BSA
}

export interface Premedication {
  drug:   string;
  dose:   string;
  route:  string;   // 'IV' | 'Oral' | 'SC' | 'IM'
  timing: string;   // 'Pre-chemo' | 'Post-chemo' | 'D1' | 'D1-D3' | 'PRN' | 'Daily'
}

export interface ChemoPlanDetails {
  cyclesPlanned:     number;
  cycleDurationDays: number;
  drugs:             ChemoDrug[];
  premedications?:   Premedication[];
}

// ── Radiotherapy Plan Details ─────────────────────────────────────────────────

export interface RadioPlanDetails {
  technique:        string;  // IMRT | VMAT | 3DCRT | SBRT | SRS | Brachytherapy | Electrons
  targetSite:       string;
  totalDoseGy:      number;
  fractionSizeGy:   number;
  fractionsPlanned: number;  // = totalDoseGy / fractionSizeGy
  frequency:        string;  // 'Daily (Mon–Fri)' | '5 days/week' | 'BID' | 'Weekly'
  simulationDate?:  string;
  machine?:         string;
}

// ── Surgery Plan Details ──────────────────────────────────────────────────────

export interface SurgeryPlanDetails {
  procedureName:      string;
  surgicalIntent:     string;
  admissionDate?:     string;
  plannedDate?:       string;
  surgeon?:           string;
  anaesthesiaType?:   string;
  preOpRequirements?: string;
}

// ── TreatmentPlan ─────────────────────────────────────────────────────────────

export interface PlanEditEntry {
  editedAt: string;
  snapshot: {
    modality:        PlanModality;
    cancerType:      string;
    stage:           string;
    regimen:         string;
    protocol:        string;
    intent:          string;
    startDate:       string;
    endDate?:        string;
    status:          TreatmentStatus;
    notes?:          string;
    chemoDetails?:   ChemoPlanDetails;
    radioDetails?:   RadioPlanDetails;
    surgeryDetails?: SurgeryPlanDetails;
  };
}

export interface TreatmentPlan {
  id:              string;
  patientId:       string;
  modality:        PlanModality;
  cancerType:      string;
  stage:           string;
  regimen:         string;
  protocol:        string;
  intent:          string;
  startDate:       string;
  endDate?:        string;
  status:          TreatmentStatus;
  notes?:          string;
  chemoDetails?:   ChemoPlanDetails;
  radioDetails?:   RadioPlanDetails;
  surgeryDetails?: SurgeryPlanDetails;
  editHistory?:    PlanEditEntry[];
}

// ── Protocol Templates ────────────────────────────────────────────────────────

export interface ProtocolTemplate {
  id:          string;
  name:        string;
  modality:    PlanModality;
  cancerType?: string;
  stage?:      string;
  intent?:     string;
  notes?:      string;
  chemo?: {
    regimen:           string;
    cyclesPlanned:     number;
    cycleDurationDays: number;
    drugs:             ChemoDrug[];
    premedications:    Premedication[];
  };
  radio?: {
    technique:        string;
    targetSite:       string;
    totalDoseGy:      number;
    fractionSizeGy:   number;
    frequency:        string;
  };
  surgery?: {
    procedureName:      string;
    surgicalIntent:     string;
    anaesthesiaType:    string;
    preOpRequirements?: string;
  };
}

export const STANDARD_PROTOCOLS: ProtocolTemplate[] = [
  // ── Chemotherapy protocols ────────────────────────────────────────────────
  {
    id: 'proto-folfox', name: 'FOLFOX', modality: 'chemotherapy',
    cancerType: 'Colorectal Adenocarcinoma', intent: 'Neo-adjuvant',
    notes: 'Oxaliplatin + Leucovorin + 5-FU. Standard for CRC. Monitor for peripheral neuropathy.',
    chemo: {
      regimen: 'FOLFOX (Oxaliplatin + 5-FU + Leucovorin)',
      cyclesPlanned: 6, cycleDurationDays: 14,
      drugs: [
        { name: 'Oxaliplatin',    dose: '85',   unit: 'mg/m²', route: 'IV',                  dayOfCycle: 'D1'    },
        { name: 'Leucovorin',     dose: '400',  unit: 'mg/m²', route: 'IV',                  dayOfCycle: 'D1'    },
        { name: '5-Fluorouracil', dose: '400',  unit: 'mg/m²', route: 'IV bolus',            dayOfCycle: 'D1'    },
        { name: '5-Fluorouracil', dose: '2400', unit: 'mg/m²', route: 'IV infusion (46 hr)', dayOfCycle: 'D1-D2' },
      ],
      premedications: [
        { drug: 'Ondansetron',   dose: '8 mg', route: 'IV',   timing: 'Pre-chemo' },
        { drug: 'Dexamethasone', dose: '8 mg', route: 'IV',   timing: 'Pre-chemo' },
      ],
    },
  },
  {
    id: 'proto-folfirinox', name: 'FOLFIRINOX', modality: 'chemotherapy',
    cancerType: 'Pancreatic Adenocarcinoma', intent: 'Palliative',
    notes: 'Oxaliplatin + Irinotecan + Leucovorin + 5-FU. For good PS patients only. G-CSF prophylaxis recommended.',
    chemo: {
      regimen: 'FOLFIRINOX (Oxaliplatin + Irinotecan + 5-FU + Leucovorin)',
      cyclesPlanned: 6, cycleDurationDays: 14,
      drugs: [
        { name: 'Oxaliplatin',    dose: '85',   unit: 'mg/m²', route: 'IV',                  dayOfCycle: 'D1'    },
        { name: 'Irinotecan',     dose: '180',  unit: 'mg/m²', route: 'IV',                  dayOfCycle: 'D1'    },
        { name: 'Leucovorin',     dose: '400',  unit: 'mg/m²', route: 'IV',                  dayOfCycle: 'D1'    },
        { name: '5-Fluorouracil', dose: '400',  unit: 'mg/m²', route: 'IV bolus',            dayOfCycle: 'D1'    },
        { name: '5-Fluorouracil', dose: '2400', unit: 'mg/m²', route: 'IV infusion (46 hr)', dayOfCycle: 'D1-D2' },
      ],
      premedications: [
        { drug: 'Ondansetron',   dose: '8 mg',  route: 'IV',   timing: 'Pre-chemo' },
        { drug: 'Dexamethasone', dose: '8 mg',  route: 'IV',   timing: 'Pre-chemo' },
        { drug: 'Aprepitant',    dose: '125 mg', route: 'Oral', timing: 'D1'        },
        { drug: 'Aprepitant',    dose: '80 mg',  route: 'Oral', timing: 'D2-D3'     },
        { drug: 'Atropine',      dose: '0.6 mg', route: 'SC',   timing: 'Pre-Irinotecan' },
      ],
    },
  },
  {
    id: 'proto-cis-etop', name: 'Cisplatin + Etoposide (CCRT)', modality: 'chemotherapy',
    cancerType: 'Lung Carcinoma', stage: 'Stage III', intent: 'Curative',
    notes: 'Concurrent with 60 Gy thoracic radiotherapy. Monitor renal function closely.',
    chemo: {
      regimen: 'Cisplatin + Etoposide',
      cyclesPlanned: 3, cycleDurationDays: 21,
      drugs: [
        { name: 'Cisplatin',  dose: '75',  unit: 'mg/m²', route: 'IV', dayOfCycle: 'D1'    },
        { name: 'Etoposide',  dose: '100', unit: 'mg/m²', route: 'IV', dayOfCycle: 'D1-D3' },
      ],
      premedications: [
        { drug: 'Ondansetron',   dose: '8 mg',   route: 'IV',   timing: 'Pre-chemo' },
        { drug: 'Dexamethasone', dose: '8 mg',   route: 'IV',   timing: 'Pre-chemo' },
        { drug: 'Aprepitant',    dose: '125 mg', route: 'Oral', timing: 'D1'        },
        { drug: 'Aprepitant',    dose: '80 mg',  route: 'Oral', timing: 'D2-D3'     },
      ],
    },
  },
  {
    id: 'proto-doc-pred', name: 'Docetaxel + Prednisone', modality: 'chemotherapy',
    cancerType: 'Prostate Carcinoma', stage: 'Stage IV', intent: 'Palliative',
    notes: 'mHSPC/CRPC. Concurrent ADT backbone. Pre-medicate with dexamethasone 3 doses.',
    chemo: {
      regimen: 'Docetaxel + Prednisone',
      cyclesPlanned: 6, cycleDurationDays: 21,
      drugs: [
        { name: 'Docetaxel',  dose: '75', unit: 'mg/m²', route: 'IV',   dayOfCycle: 'D1'     },
        { name: 'Prednisone', dose: '5',  unit: 'mg',    route: 'Oral', dayOfCycle: 'D1-D21' },
      ],
      premedications: [
        { drug: 'Dexamethasone', dose: '8 mg', route: 'Oral', timing: 'Day -1, D1, Day +1 (3 doses)' },
      ],
    },
  },
  {
    id: 'proto-rchop', name: 'R-CHOP', modality: 'chemotherapy',
    cancerType: 'Non-Hodgkin Lymphoma', intent: 'Curative',
    notes: 'Rituximab + Cyclophosphamide + Doxorubicin + Vincristine + Prednisolone. Standard for B-cell NHL.',
    chemo: {
      regimen: 'R-CHOP (Rituximab + Cyclophosphamide + Doxorubicin + Vincristine + Prednisolone)',
      cyclesPlanned: 6, cycleDurationDays: 21,
      drugs: [
        { name: 'Rituximab',        dose: '375', unit: 'mg/m²', route: 'IV',   dayOfCycle: 'D1'     },
        { name: 'Cyclophosphamide', dose: '750', unit: 'mg/m²', route: 'IV',   dayOfCycle: 'D1'     },
        { name: 'Doxorubicin',      dose: '50',  unit: 'mg/m²', route: 'IV',   dayOfCycle: 'D1'     },
        { name: 'Vincristine',      dose: '1.4', unit: 'mg/m²', route: 'IV',   dayOfCycle: 'D1'     },
        { name: 'Prednisolone',     dose: '100', unit: 'mg',    route: 'Oral', dayOfCycle: 'D1-D5'  },
      ],
      premedications: [
        { drug: 'Paracetamol',         dose: '1000 mg', route: 'Oral', timing: 'Pre-Rituximab' },
        { drug: 'Chlorpheniramine',    dose: '10 mg',   route: 'IV',   timing: 'Pre-Rituximab' },
        { drug: 'Hydrocortisone',      dose: '100 mg',  route: 'IV',   timing: 'Pre-Rituximab' },
        { drug: 'Ondansetron',         dose: '8 mg',    route: 'IV',   timing: 'Pre-chemo'     },
        { drug: 'Co-trimoxazole',      dose: '960 mg',  route: 'Oral', timing: 'Daily (PCP prophylaxis)' },
      ],
    },
  },
  {
    id: 'proto-carbo-pac', name: 'Carboplatin + Paclitaxel', modality: 'chemotherapy',
    cancerType: 'Ovarian Carcinoma', intent: 'Adjuvant',
    notes: 'Standard for ovarian/NSCLC. Carboplatin AUC 5-6. Pre-medicate for Paclitaxel hypersensitivity.',
    chemo: {
      regimen: 'Carboplatin + Paclitaxel',
      cyclesPlanned: 6, cycleDurationDays: 21,
      drugs: [
        { name: 'Paclitaxel',   dose: '175', unit: 'mg/m²', route: 'IV', dayOfCycle: 'D1' },
        { name: 'Carboplatin',  dose: 'AUC 5', unit: 'AUC', route: 'IV', dayOfCycle: 'D1' },
      ],
      premedications: [
        { drug: 'Dexamethasone',     dose: '20 mg',  route: 'IV',   timing: 'Pre-Paclitaxel (30 min before)' },
        { drug: 'Chlorpheniramine',  dose: '10 mg',  route: 'IV',   timing: 'Pre-Paclitaxel'                 },
        { drug: 'Ranitidine',        dose: '50 mg',  route: 'IV',   timing: 'Pre-Paclitaxel'                 },
        { drug: 'Ondansetron',       dose: '8 mg',   route: 'IV',   timing: 'Pre-chemo'                      },
      ],
    },
  },
  {
    id: 'proto-ac', name: 'AC (Adriamycin + Cyclophosphamide)', modality: 'chemotherapy',
    cancerType: 'Breast Carcinoma', intent: 'Neo-adjuvant',
    notes: '4 cycles q21d, typically followed by Taxane. Cardiotoxicity monitoring required.',
    chemo: {
      regimen: 'AC (Doxorubicin + Cyclophosphamide)',
      cyclesPlanned: 4, cycleDurationDays: 21,
      drugs: [
        { name: 'Doxorubicin',      dose: '60',  unit: 'mg/m²', route: 'IV', dayOfCycle: 'D1' },
        { name: 'Cyclophosphamide', dose: '600', unit: 'mg/m²', route: 'IV', dayOfCycle: 'D1' },
      ],
      premedications: [
        { drug: 'Ondansetron',   dose: '8 mg',   route: 'IV',   timing: 'Pre-chemo' },
        { drug: 'Dexamethasone', dose: '8 mg',   route: 'IV',   timing: 'Pre-chemo' },
        { drug: 'Aprepitant',    dose: '125 mg', route: 'Oral', timing: 'D1'        },
        { drug: 'Aprepitant',    dose: '80 mg',  route: 'Oral', timing: 'D2-D3'     },
      ],
    },
  },
  {
    id: 'proto-gem-cis', name: 'Gemcitabine + Cisplatin', modality: 'chemotherapy',
    cancerType: 'Bladder / Pancreatic Carcinoma', intent: 'Palliative',
    notes: 'Standard for urothelial/pancreatic/NSCLC. Hydration essential with Cisplatin.',
    chemo: {
      regimen: 'Gemcitabine + Cisplatin',
      cyclesPlanned: 4, cycleDurationDays: 21,
      drugs: [
        { name: 'Gemcitabine', dose: '1000', unit: 'mg/m²', route: 'IV', dayOfCycle: 'D1,D8' },
        { name: 'Cisplatin',   dose: '70',   unit: 'mg/m²', route: 'IV', dayOfCycle: 'D1'    },
      ],
      premedications: [
        { drug: 'Ondansetron',   dose: '8 mg',   route: 'IV',   timing: 'Pre-chemo' },
        { drug: 'Dexamethasone', dose: '8 mg',   route: 'IV',   timing: 'Pre-chemo' },
        { drug: 'Aprepitant',    dose: '125 mg', route: 'Oral', timing: 'D1'        },
        { drug: 'Aprepitant',    dose: '80 mg',  route: 'Oral', timing: 'D2-D3'     },
      ],
    },
  },

  // ── Radiotherapy protocols ────────────────────────────────────────────────
  {
    id: 'proto-rt-lung-ccrt', name: 'Lung CCRT 60 Gy/30fx (IMRT)', modality: 'radiotherapy',
    cancerType: 'Lung Carcinoma', stage: 'Stage III', intent: 'Curative',
    radio: {
      technique: 'IMRT', targetSite: 'Primary Tumour + Mediastinal Nodes',
      totalDoseGy: 60, fractionSizeGy: 2, frequency: 'Daily (Mon–Fri)',
    },
  },
  {
    id: 'proto-rt-breast-pmrt', name: 'Post-mastectomy 50 Gy/25fx (3DCRT)', modality: 'radiotherapy',
    cancerType: 'Breast Carcinoma', intent: 'Adjuvant',
    radio: {
      technique: '3DCRT', targetSite: 'Chest Wall + Axilla + Supraclavicular Fossa',
      totalDoseGy: 50, fractionSizeGy: 2, frequency: 'Daily (Mon–Fri)',
    },
  },
  {
    id: 'proto-rt-hn', name: 'H&N 70 Gy/35fx (IMRT)', modality: 'radiotherapy',
    cancerType: 'Head & Neck Carcinoma', intent: 'Curative',
    radio: {
      technique: 'IMRT', targetSite: 'Primary Tumour + Bilateral Cervical Nodes',
      totalDoseGy: 70, fractionSizeGy: 2, frequency: 'Daily (Mon–Fri)',
    },
  },
  {
    id: 'proto-rt-prostate', name: 'Prostate 78 Gy/39fx (VMAT)', modality: 'radiotherapy',
    cancerType: 'Prostate Carcinoma', intent: 'Curative',
    radio: {
      technique: 'VMAT', targetSite: 'Prostate + Seminal Vesicles',
      totalDoseGy: 78, fractionSizeGy: 2, frequency: 'Daily (Mon–Fri)',
    },
  },
  {
    id: 'proto-rt-cervix', name: 'Cervix 45 Gy/25fx EBRT (IMRT)', modality: 'radiotherapy',
    cancerType: 'Cervical Carcinoma', stage: 'Stage IIB', intent: 'Curative',
    radio: {
      technique: 'IMRT', targetSite: 'Pelvic EBRT (Uterus + Bilateral Parametria + Pelvic Nodes)',
      totalDoseGy: 45, fractionSizeGy: 1.8, frequency: 'Daily (Mon–Fri)',
    },
  },
  {
    id: 'proto-rt-rectal-sc', name: 'Rectal short-course 25 Gy/5fx (3DCRT)', modality: 'radiotherapy',
    cancerType: 'Rectal Adenocarcinoma', intent: 'Neo-adjuvant',
    radio: {
      technique: '3DCRT', targetSite: 'Rectum + Mesorectum',
      totalDoseGy: 25, fractionSizeGy: 5, frequency: 'Daily (Mon–Fri)',
    },
  },
  {
    id: 'proto-rt-palliative-bone', name: 'Palliative Bone 30 Gy/10fx (3DCRT)', modality: 'radiotherapy',
    cancerType: 'Metastatic (any primary)', intent: 'Palliative',
    radio: {
      technique: '3DCRT', targetSite: 'Painful Bone Metastasis Site',
      totalDoseGy: 30, fractionSizeGy: 3, frequency: 'Daily (Mon–Fri)',
    },
  },
  {
    id: 'proto-rt-sbrt-lung', name: 'SBRT Lung 54 Gy/3fx', modality: 'radiotherapy',
    cancerType: 'Lung Carcinoma (Early stage / Oligometastatic)', intent: 'Curative',
    radio: {
      technique: 'SBRT', targetSite: 'Lung Primary / Pulmonary Oligometastasis',
      totalDoseGy: 54, fractionSizeGy: 18, frequency: '3 fractions over 1–2 weeks',
    },
  },

  // ── Surgery protocols ─────────────────────────────────────────────────────
  {
    id: 'proto-sx-mrm', name: 'Modified Radical Mastectomy', modality: 'surgery',
    cancerType: 'Breast Carcinoma', intent: 'Curative',
    surgery: {
      procedureName:     'Modified Radical Mastectomy (MRM) + Axillary Lymph Node Dissection',
      surgicalIntent:    'Curative',
      anaesthesiaType:   'GA',
      preOpRequirements: 'Cardiology fitness, pre-op echo (if anthracyclines planned), DVT prophylaxis, informed consent for breast prosthesis',
    },
  },
  {
    id: 'proto-sx-lar', name: 'Laparoscopic Low Anterior Resection (LAR)', modality: 'surgery',
    cancerType: 'Rectal Adenocarcinoma', intent: 'Curative',
    surgery: {
      procedureName:     'Laparoscopic Low Anterior Resection (LAR) with Defunctioning Loop Ileostomy',
      surgicalIntent:    'Curative',
      anaesthesiaType:   'GA',
      preOpRequirements: 'Bowel prep (Polyethylene glycol), pre-op colonoscopy clearance, cardiology fitness, DVT prophylaxis',
    },
  },
  {
    id: 'proto-sx-prostatectomy', name: 'Radical Prostatectomy (Robot-assisted)', modality: 'surgery',
    cancerType: 'Prostate Carcinoma', intent: 'Curative',
    surgery: {
      procedureName:     'Robot-assisted Laparoscopic Radical Prostatectomy (RALRP) + Bilateral Pelvic Node Dissection',
      surgicalIntent:    'Curative',
      anaesthesiaType:   'GA',
      preOpRequirements: 'PSA + MRI pelvis, bone scan, urology fitness, DVT prophylaxis, discontinue anticoagulants 5 days pre-op',
    },
  },
  {
    id: 'proto-sx-whipple', name: 'Whipple Procedure (Pancreaticoduodenectomy)', modality: 'surgery',
    cancerType: 'Pancreatic / Periampullary Carcinoma', intent: 'Curative',
    surgery: {
      procedureName:     'Pancreaticoduodenectomy (Whipple Procedure)',
      surgicalIntent:    'Curative',
      anaesthesiaType:   'GA',
      preOpRequirements: 'Nutritional optimisation (albumin ≥3.5), biliary stenting if jaundiced, cardiology fitness, ICU bed booking, blood products arranged',
    },
  },
  {
    id: 'proto-sx-thyroidectomy', name: 'Total Thyroidectomy', modality: 'surgery',
    cancerType: 'Thyroid Carcinoma', intent: 'Curative',
    surgery: {
      procedureName:     'Total Thyroidectomy + Central Compartment Neck Dissection',
      surgicalIntent:    'Curative',
      anaesthesiaType:   'GA',
      preOpRequirements: 'Laryngoscopy (vocal cord check), pre-op serum calcium, euthyroid state confirmed, ENT fitness',
    },
  },
  {
    id: 'proto-sx-nephrectomy', name: 'Laparoscopic Radical Nephrectomy', modality: 'surgery',
    cancerType: 'Renal Cell Carcinoma', intent: 'Curative',
    surgery: {
      procedureName:     'Laparoscopic Radical Nephrectomy',
      surgicalIntent:    'Curative',
      anaesthesiaType:   'GA',
      preOpRequirements: 'CT triphasic abdomen, renal function tests, contralateral kidney assessment, DVT prophylaxis',
    },
  },
  {
    id: 'proto-sx-laryngectomy', name: 'Neck Dissection + Laryngectomy', modality: 'surgery',
    cancerType: 'Head & Neck Carcinoma', intent: 'Curative',
    surgery: {
      procedureName:     'Total Laryngectomy + Modified Radical Neck Dissection',
      surgicalIntent:    'Curative',
      anaesthesiaType:   'GA',
      preOpRequirements: 'ENT + onco-surgical planning, speech therapy pre-op counselling, nasogastric tube placement, tracheostomy kit, blood products',
    },
  },
  {
    id: 'proto-sx-staging-lap', name: 'Diagnostic Staging Laparoscopy', modality: 'surgery',
    cancerType: 'Intra-abdominal malignancy', intent: 'Diagnostic',
    surgery: {
      procedureName:     'Diagnostic Staging Laparoscopy ± Peritoneal Washing for Cytology',
      surgicalIntent:    'Diagnostic',
      anaesthesiaType:   'GA',
      preOpRequirements: 'CT abdomen/pelvis review, cardiology fitness, NPO 6 hr, consent for laparotomy conversion',
    },
  },
];

// ── Chemotherapy Delivery Details ─────────────────────────────────────────────

export interface PreChemoLabs {
  wbc?:         string;
  anc?:         string;
  haemoglobin?: string;
  platelets?:   string;
  creatinine?:  string;
  bili?:        string;
  ast?:         string;
  alt?:         string;
}

export interface ChemoDeliveryDrug {
  name:        string;
  plannedDose: string;
  givenDose:   string;
  route:       string;
  notes?:      string;
}

export interface ChemoDeliveryDetails {
  cycleNumber:     number;
  sessionType:     'inpatient' | 'daycare';
  admissionDate?:  string;
  dischargeDate?:  string;
  ecogAtDelivery?: number;
  preChemoLabs?:   PreChemoLabs;
  drugs:           ChemoDeliveryDrug[];
}

// ── Radiotherapy Delivery Details ─────────────────────────────────────────────

export interface RadioDeliveryDetails {
  fractionNumber:   number;
  doseGy:           number;
  cumulativeDoseGy: number;
  machine?:         string;
  skinReaction?:    string;  // 'None' | 'Grade 1' | 'Grade 2' | 'Grade 3'
}

// ── Surgery Delivery Details ──────────────────────────────────────────────────

export interface SurgeryDeliveryDetails {
  surgeryNumber:        number;
  procedurePerformed:   string;
  surgeon:              string;
  durationMinutes?:     number;
  anaesthesiaType?:     string;
  admissionDate?:       string;
  dischargeDate?:       string;
  intraOpFindings?:     string;
  specimenSent?:        boolean;
  specimenDetails?:     string;
  postOpComplications?: string;
}

// ── TreatmentDelivery ─────────────────────────────────────────────────────────

export interface TreatmentDelivery {
  id:                string;
  patientId:         string;
  planId:            string;
  modality:          PlanModality;
  sessionNumber:     number;
  date:              string;
  drugsAdministered: string;
  doseDelivered:     string;
  status:            DeliveryStatus;
  notes?:            string;
  chemoDetails?:     ChemoDeliveryDetails;
  radioDetails?:     RadioDeliveryDetails;
  surgeryDetails?:   SurgeryDeliveryDetails;
}

// ── CTCAE types + constants ───────────────────────────────────────────────────

export type CtcaeCategory =
  | 'hematologic'
  | 'gastrointestinal'
  | 'neurological'
  | 'dermatological'
  | 'constitutional'
  | 'infections'
  | 'renal'
  | 'hepatic'
  | 'cardiovascular'
  | 'pulmonary'
  | 'musculoskeletal'
  | 'immunological'
  | 'pain'
  | 'endocrine';

export const CTCAE_CATEGORY_LABELS: Record<CtcaeCategory, string> = {
  hematologic:    'Hematologic',
  gastrointestinal: 'Gastrointestinal',
  neurological:   'Neurological',
  dermatological: 'Dermatological',
  constitutional: 'Constitutional',
  infections:     'Infections',
  renal:          'Renal / Urinary',
  hepatic:        'Hepatic',
  cardiovascular: 'Cardiovascular',
  pulmonary:      'Pulmonary',
  musculoskeletal:'Musculoskeletal',
  immunological:  'Immunological',
  pain:           'Pain',
  endocrine:      'Endocrine',
};

export const CTCAE_GRADE_DESCRIPTIONS: Record<ToxicityGrade, string> = {
  1: 'Mild — asymptomatic or mild symptoms; clinical/diagnostic observations only; intervention not indicated',
  2: 'Moderate — minimal local or noninvasive intervention indicated; limiting age-appropriate instrumental ADL',
  3: 'Severe — hospitalization indicated; disabling; not immediately life-threatening',
  4: 'Life-threatening — urgent intervention indicated',
  5: 'Death related to adverse event',
};

export const CTCAE_TYPE_SUGGESTIONS: Record<CtcaeCategory, string[]> = {
  hematologic:     ['Neutropenia', 'Febrile Neutropenia', 'Thrombocytopenia', 'Anaemia', 'Leukopenia', 'Lymphopenia'],
  gastrointestinal:['Nausea', 'Vomiting', 'Diarrhoea', 'Constipation', 'Mucositis', 'Oesophagitis', 'Anorexia', 'Abdominal Pain', 'Radiation Proctitis', 'Colitis'],
  neurological:    ['Peripheral Neuropathy', 'Cognitive Impairment', 'Headache', 'Dizziness', 'Paraesthesia', 'Ataxia', 'Seizure'],
  dermatological:  ['Alopecia', 'Rash', 'Hand-Foot Syndrome', 'Radiation Dermatitis', 'Pruritus', 'Dry Skin', 'Nail Changes', 'Photosensitivity'],
  constitutional:  ['Fatigue', 'Fever', 'Weight Loss', 'Night Sweats', 'Malaise', 'Oedema'],
  infections:      ['Febrile Neutropenia', 'Urinary Tract Infection', 'Respiratory Infection', 'Sepsis', 'Oral Candidiasis', 'PCP Pneumonia'],
  renal:           ['Creatinine Elevation', 'Haematuria', 'Proteinuria', 'Urinary Frequency', 'Acute Kidney Injury'],
  hepatic:         ['ALT Elevation', 'AST Elevation', 'Bilirubin Elevation', 'Hepatotoxicity', 'Jaundice'],
  cardiovascular:  ['Hypertension', 'Cardiotoxicity', 'Palpitations', 'QTc Prolongation', 'Thrombosis/Embolism'],
  pulmonary:       ['Dyspnoea', 'Pneumonitis', 'Cough', 'Pleural Effusion', 'Pulmonary Fibrosis', 'Hypoxia'],
  musculoskeletal: ['Arthralgia', 'Myalgia', 'Bone Pain', 'Muscle Weakness', 'Osteoporosis'],
  immunological:   ['Infusion Reaction', 'Hypersensitivity', 'Autoimmune Reaction', 'Immune-related Adverse Event'],
  pain:            ['Pain — General', 'Headache', 'Abdominal Pain', 'Chest Pain', 'Back Pain', 'Neuropathic Pain'],
  endocrine:       ['Hypothyroidism', 'Hyperthyroidism', 'Adrenal Insufficiency', 'Hyperglycaemia', 'Hyponatraemia', 'Hypocalcaemia'],
};

export const IMAGING_USED_OPTIONS = [
  'CT', 'MRI', 'PET-CT', 'USG', 'Biomarker / Labs', 'Clinical Exam', 'X-Ray', 'Other',
] as const;

// ── Other clinical record interfaces ─────────────────────────────────────────

export type NonTargetLesionStatus = 'present' | 'absent' | 'not-evaluated' | 'stable' | 'increased' | 'decreased';

export interface LesionMeasurement {
  name:      string;   // e.g. 'Right lung mass', 'Mediastinal node'
  baseline:  number;   // mm
  current:   number;   // mm
  change?:   number;   // percentage (auto-calculated)
}

export interface NonTargetLesion {
  name:   string;
  status: NonTargetLesionStatus;
}

export interface ResponseAssessment {
  id:              string;
  patientId:       string;
  date:            string;
  imagingUsed:     string;
  response:        string;
  recist:          ResponseCategory;
  targetLesions?:  LesionMeasurement[];
  nonTargetLesions?: NonTargetLesion[];
  planId?:         string;
  cycleNumber?:    number;
  notes?:          string;
}

export interface ToxicityRecord {
  id:                string;
  patientId:         string;
  date:              string;
  ctcaeCategory:     CtcaeCategory;
  toxicityType:      string;
  grade:             ToxicityGrade;
  description:       string;
  actionTaken:       string;
  hospitalAdmission: boolean;
  admissionDate?:    string;
  dischargeDate?:    string;
  planId?:           string;
  cycleNumber?:      number;
}

export type DiseaseStatus = 'NED' | 'Recurrence' | 'Metastasis';
export type ToxicityGradeSimple = 'None' | 'Mild' | 'Moderate' | 'Severe';
export type SymptomSeverity = 'Mild' | 'Moderate' | 'Severe';
export type RecurrenceType = 'Local' | 'Regional' | 'Distant';

export interface SurvivorshipRecord {
  id:                string;
  patientId:         string;
  followUpDate:      string;
  status:            DiseaseStatus | string;
  notes?:            string;
  recentScanResults?: string;
  tumorMarkers?: {
    cea?:   number;
    ca199?: number;
    afp?:   number;
  };
  lateToxicity?: {
    peripheralNeuropathy?: ToxicityGradeSimple;
    cognitiveImpairment?:  ToxicityGradeSimple;
    cardiacDysfunction?:   ToxicityGradeSimple;
    pulmonaryFibrosis?:    ToxicityGradeSimple;
    secondaryMalignancy?:  ToxicityGradeSimple;
  };
}

export interface RecurrenceRecord {
  id:               string;
  patientId:        string;
  detectedDate:     string;
  site:             string;
  type:             RecurrenceType | string;
  notes?:           string;
  imagingFindings?: string;
  biopsyConfirmed?: boolean;
}

export interface PalliativeCareRecord {
  id:            string;
  patientId:     string;
  date:          string;
  symptom?:      string;
  intervention?: string;
  response?:     string;
  painScore?:    number;
  symptoms?: {
    dyspnea?:  SymptomSeverity;
    pain?:     SymptomSeverity;
    fatigue?:  SymptomSeverity;
    anorexia?: SymptomSeverity;
  };
  medications?: Array<{ id: string; drug: string; dose: string; frequency: string; }>;
  goalsOfCare?: string;
}

// ── Mock Treatment Plans ──────────────────────────────────────────────────────

export const mockTreatmentPlans: TreatmentPlan[] = [
  // ── p1 (Rajesh Kumar) — Lung Carcinoma Stage IIIA ─────────────────────────
  {
    id: 'tp1', patientId: 'p1',
    modality: 'chemotherapy',
    cancerType: 'Lung Carcinoma', stage: 'Stage IIIA',
    regimen: 'Cisplatin + Etoposide',
    protocol: 'Concurrent CCRT — Systemic Component',
    intent: 'Curative',
    startDate: '2024-01-20', endDate: '2024-03-24', status: 'completed',
    notes: 'Concurrent with 60 Gy radiotherapy (tp4). Completed 3 cycles.',
    chemoDetails: {
      cyclesPlanned: 3,
      cycleDurationDays: 21,
      drugs: [
        { name: 'Cisplatin',  dose: '75',  unit: 'mg/m²', route: 'IV', dayOfCycle: 'D1'    },
        { name: 'Etoposide',  dose: '100', unit: 'mg/m²', route: 'IV', dayOfCycle: 'D1-D3' },
      ],
      premedications: [
        { drug: 'Ondansetron',   dose: '8 mg',   route: 'IV',   timing: 'Pre-chemo' },
        { drug: 'Dexamethasone', dose: '8 mg',   route: 'IV',   timing: 'Pre-chemo' },
        { drug: 'Aprepitant',    dose: '125 mg', route: 'Oral', timing: 'D1'        },
        { drug: 'Aprepitant',    dose: '80 mg',  route: 'Oral', timing: 'D2-D3'     },
      ],
    },
  },
  {
    id: 'tp4', patientId: 'p1',
    modality: 'radiotherapy',
    cancerType: 'Lung Carcinoma', stage: 'Stage IIIA',
    regimen: 'IMRT — Right Upper Lobe + Mediastinum',
    protocol: 'Concurrent CCRT — Radiotherapy Component',
    intent: 'Curative',
    startDate: '2024-01-22', endDate: '2024-03-04', status: 'completed',
    notes: 'Concurrent with Cisplatin/Etoposide chemotherapy (tp1). Grade 2 oesophagitis noted at fraction 18.',
    radioDetails: {
      technique:        'IMRT',
      targetSite:       'Right Upper Lobe + Ipsilateral Mediastinal Nodes',
      totalDoseGy:      60,
      fractionSizeGy:   2,
      fractionsPlanned: 30,
      frequency:        'Daily (Mon–Fri)',
      simulationDate:   '2024-01-15',
      machine:          'TrueBeam STx',
    },
  },

  // ── p3 (Sunita Devi) — Rectal Adenocarcinoma Stage IIIB ───────────────────
  {
    id: 'tp2', patientId: 'p3',
    modality: 'chemotherapy',
    cancerType: 'Rectal Adenocarcinoma', stage: 'Stage IIIB',
    regimen: 'FOLFOX (Oxaliplatin + 5-FU + Leucovorin)',
    protocol: 'Neo-adjuvant Chemotherapy',
    intent: 'Neo-adjuvant',
    startDate: '2024-03-15', status: 'active',
    notes: 'Dose reduction of Oxaliplatin to 75% from cycle 4 due to grade 2 neuropathy.',
    chemoDetails: {
      cyclesPlanned: 6,
      cycleDurationDays: 14,
      drugs: [
        { name: 'Oxaliplatin',    dose: '85',   unit: 'mg/m²', route: 'IV',                  dayOfCycle: 'D1'    },
        { name: 'Leucovorin',     dose: '400',  unit: 'mg/m²', route: 'IV',                  dayOfCycle: 'D1'    },
        { name: '5-Fluorouracil', dose: '400',  unit: 'mg/m²', route: 'IV bolus',            dayOfCycle: 'D1'    },
        { name: '5-Fluorouracil', dose: '2400', unit: 'mg/m²', route: 'IV infusion (46 hr)', dayOfCycle: 'D1-D2' },
      ],
      premedications: [
        { drug: 'Ondansetron',   dose: '8 mg', route: 'IV', timing: 'Pre-chemo' },
        { drug: 'Dexamethasone', dose: '8 mg', route: 'IV', timing: 'Pre-chemo' },
      ],
    },
  },
  {
    id: 'tp5', patientId: 'p3',
    modality: 'surgery',
    cancerType: 'Rectal Adenocarcinoma', stage: 'Stage IIIB',
    regimen: 'Laparoscopic Low Anterior Resection (LAR)',
    protocol: 'Post Neo-adjuvant Curative Resection',
    intent: 'Curative',
    startDate: '2024-06-17', endDate: '2024-06-24', status: 'completed',
    notes: 'Sphincter-preserving LAR. Post neo-adjuvant FOLFOX. Good tumour downstaging on pre-op MRI.',
    surgeryDetails: {
      procedureName:     'Laparoscopic Low Anterior Resection (LAR) with Defunctioning Loop Ileostomy',
      surgicalIntent:    'Curative',
      plannedDate:       '2024-06-17',
      surgeon:           'Dr. Ramesh Sharma',
      anaesthesiaType:   'GA',
      preOpRequirements: 'Bowel prep (Polyethylene glycol), pre-op colonoscopy clearance, cardiology fitness, DVT prophylaxis',
    },
  },

  // ── p4 (Kavita Sharma) — Cervical Carcinoma Stage IIB ─────────────────────
  {
    id: 'tp6', patientId: 'p4',
    modality: 'chemotherapy',
    cancerType: 'Cervical Carcinoma', stage: 'Stage IIB',
    regimen: 'Cisplatin (Weekly — Radiosensitiser)',
    protocol: 'Concurrent Chemoradiation — Cisplatin Weekly',
    intent: 'Curative',
    startDate: '2026-03-10', status: 'active',
    notes: 'Weekly Cisplatin concurrent with pelvic IMRT. Brachytherapy to follow after EBRT.',
    chemoDetails: {
      cyclesPlanned: 5,
      cycleDurationDays: 7,
      drugs: [
        { name: 'Cisplatin', dose: '40', unit: 'mg/m²', route: 'IV', dayOfCycle: 'D1 (weekly)' },
      ],
      premedications: [
        { drug: 'Ondansetron',   dose: '8 mg',  route: 'IV', timing: 'Pre-chemo'         },
        { drug: 'Dexamethasone', dose: '4 mg',  route: 'IV', timing: 'Pre-chemo'         },
        { drug: 'IV Fluids',     dose: '1000 mL', route: 'IV', timing: 'Pre and post Cisplatin (hydration)' },
      ],
    },
  },
  {
    id: 'tp7', patientId: 'p4',
    modality: 'radiotherapy',
    cancerType: 'Cervical Carcinoma', stage: 'Stage IIB',
    regimen: 'IMRT Pelvis 45 Gy/25fx',
    protocol: 'Concurrent Chemoradiation — Pelvic EBRT',
    intent: 'Curative',
    startDate: '2026-03-10', status: 'active',
    notes: 'Concurrent with weekly Cisplatin (tp6). HDR brachytherapy boost planned post-EBRT.',
    radioDetails: {
      technique:        'IMRT',
      targetSite:       'Pelvic EBRT (Uterus + Bilateral Parametria + Pelvic Nodes)',
      totalDoseGy:      45,
      fractionSizeGy:   1.8,
      fractionsPlanned: 25,
      frequency:        'Daily (Mon–Fri)',
      simulationDate:   '2026-03-05',
      machine:          'Halcyon',
    },
  },

  // ── p5 (Arun Verma) — Oesophageal Carcinoma Stage III ─────────────────────
  {
    id: 'tp8', patientId: 'p5',
    modality: 'chemotherapy',
    cancerType: 'Oesophageal Carcinoma', stage: 'Stage III',
    regimen: 'Cisplatin + 5-Fluorouracil (CF)',
    protocol: 'Concurrent Chemoradiation — CF Regimen',
    intent: 'Curative',
    startDate: '2026-04-05', status: 'active',
    notes: 'Concurrent with oesophageal radiotherapy. 2 cycles planned concurrent, 2 cycles consolidation.',
    chemoDetails: {
      cyclesPlanned: 4,
      cycleDurationDays: 28,
      drugs: [
        { name: 'Cisplatin',      dose: '75',   unit: 'mg/m²', route: 'IV',                  dayOfCycle: 'D1'     },
        { name: '5-Fluorouracil', dose: '1000', unit: 'mg/m²', route: 'IV infusion (24 hr)', dayOfCycle: 'D1-D4'  },
      ],
      premedications: [
        { drug: 'Ondansetron',   dose: '8 mg',   route: 'IV',   timing: 'Pre-chemo' },
        { drug: 'Dexamethasone', dose: '8 mg',   route: 'IV',   timing: 'Pre-chemo' },
        { drug: 'Aprepitant',    dose: '125 mg', route: 'Oral', timing: 'D1'        },
        { drug: 'Aprepitant',    dose: '80 mg',  route: 'Oral', timing: 'D2-D3'     },
        { drug: 'IV Fluids',     dose: '1000 mL', route: 'IV',  timing: 'Pre and post Cisplatin' },
      ],
    },
  },

  // ── p6 (Priti Singh) — Non-Hodgkin Lymphoma Stage IIIA ────────────────────
  {
    id: 'tp9', patientId: 'p6',
    modality: 'chemotherapy',
    cancerType: 'Non-Hodgkin Lymphoma (B-cell)', stage: 'Stage IIIA',
    regimen: 'R-CHOP (Rituximab + Cyclophosphamide + Doxorubicin + Vincristine + Prednisolone)',
    protocol: 'R-CHOP × 6 Cycles',
    intent: 'Curative',
    startDate: '2026-02-18', status: 'active',
    notes: 'DLBCL confirmed on biopsy. ECOG 1. IPI score 2. PET-CT staging done.',
    chemoDetails: {
      cyclesPlanned: 6,
      cycleDurationDays: 21,
      drugs: [
        { name: 'Rituximab',        dose: '375', unit: 'mg/m²', route: 'IV',   dayOfCycle: 'D1'    },
        { name: 'Cyclophosphamide', dose: '750', unit: 'mg/m²', route: 'IV',   dayOfCycle: 'D1'    },
        { name: 'Doxorubicin',      dose: '50',  unit: 'mg/m²', route: 'IV',   dayOfCycle: 'D1'    },
        { name: 'Vincristine',      dose: '1.4', unit: 'mg/m²', route: 'IV',   dayOfCycle: 'D1'    },
        { name: 'Prednisolone',     dose: '100', unit: 'mg',    route: 'Oral', dayOfCycle: 'D1-D5' },
      ],
      premedications: [
        { drug: 'Paracetamol',      dose: '1000 mg', route: 'Oral', timing: 'Pre-Rituximab'            },
        { drug: 'Chlorpheniramine', dose: '10 mg',   route: 'IV',   timing: 'Pre-Rituximab'            },
        { drug: 'Hydrocortisone',   dose: '100 mg',  route: 'IV',   timing: 'Pre-Rituximab'            },
        { drug: 'Ondansetron',      dose: '8 mg',    route: 'IV',   timing: 'Pre-chemo'                },
        { drug: 'Co-trimoxazole',   dose: '960 mg',  route: 'Oral', timing: 'Daily (PCP prophylaxis)'  },
      ],
    },
  },

  // ── p7 (Deepak Joshi) — Prostate Carcinoma Stage IV ──────────────────────
  {
    id: 'tp3', patientId: 'p7',
    modality: 'chemotherapy',
    cancerType: 'Prostate Carcinoma', stage: 'Stage IV',
    regimen: 'Docetaxel + Prednisone',
    protocol: 'mHSPC Chemohormonal Therapy',
    intent: 'Palliative',
    startDate: '2024-10-01', status: 'active',
    notes: 'Leuprolide 22.5 mg Q3M ongoing (ADT backbone). PSA response being monitored.',
    chemoDetails: {
      cyclesPlanned: 6,
      cycleDurationDays: 21,
      drugs: [
        { name: 'Docetaxel',  dose: '75', unit: 'mg/m²', route: 'IV',   dayOfCycle: 'D1'     },
        { name: 'Prednisone', dose: '5',  unit: 'mg',    route: 'Oral', dayOfCycle: 'D1-D21' },
      ],
      premedications: [
        { drug: 'Dexamethasone', dose: '8 mg', route: 'Oral', timing: 'Day -1, D1, Day +1 (3 doses)' },
      ],
    },
  },

  // ── p8 (Anjali Mishra) — Ovarian Carcinoma Stage IIIC ─────────────────────
  {
    id: 'tp10', patientId: 'p8',
    modality: 'surgery',
    cancerType: 'Ovarian Carcinoma', stage: 'Stage IIIC',
    regimen: 'Primary Cytoreductive Surgery',
    protocol: 'Total Abdominal Hysterectomy + BSO + Omentectomy + Pelvic LN Sampling',
    intent: 'Curative',
    startDate: '2025-11-20', endDate: '2025-11-28', status: 'completed',
    notes: 'Optimal debulking achieved — residual disease < 1 cm. Intraoperative frozen section confirmed high-grade serous histology.',
    surgeryDetails: {
      procedureName:     'Total Abdominal Hysterectomy (TAH) + Bilateral Salpingo-oophorectomy (BSO) + Infracolic Omentectomy + Pelvic Lymph Node Sampling',
      surgicalIntent:    'Curative',
      plannedDate:       '2025-11-20',
      surgeon:           'Dr. Meena Kapoor',
      anaesthesiaType:   'GA',
      preOpRequirements: 'CA-125, pre-op CT abdomen/pelvis, cardiology fitness, blood products arranged (4 units PRBC), thromboprophylaxis',
    },
  },
  {
    id: 'tp11', patientId: 'p8',
    modality: 'chemotherapy',
    cancerType: 'Ovarian Carcinoma', stage: 'Stage IIIC',
    regimen: 'Carboplatin + Paclitaxel',
    protocol: 'Adjuvant Chemotherapy (Post-Surgery)',
    intent: 'Adjuvant',
    startDate: '2026-01-10', status: 'active',
    notes: 'Post-cytoreductive surgery. BRCA1/2 testing sent — result pending. Bevacizumab addition to be considered.',
    chemoDetails: {
      cyclesPlanned: 6,
      cycleDurationDays: 21,
      drugs: [
        { name: 'Paclitaxel',  dose: '175',   unit: 'mg/m²', route: 'IV', dayOfCycle: 'D1' },
        { name: 'Carboplatin', dose: 'AUC 5', unit: 'AUC',   route: 'IV', dayOfCycle: 'D1' },
      ],
      premedications: [
        { drug: 'Dexamethasone',    dose: '20 mg', route: 'IV',   timing: 'Pre-Paclitaxel (30 min before)' },
        { drug: 'Chlorpheniramine', dose: '10 mg', route: 'IV',   timing: 'Pre-Paclitaxel'                 },
        { drug: 'Ranitidine',       dose: '50 mg', route: 'IV',   timing: 'Pre-Paclitaxel'                 },
        { drug: 'Ondansetron',      dose: '8 mg',  route: 'IV',   timing: 'Pre-chemo'                      },
      ],
    },
  },
];

// ── Mock Treatment Delivery ───────────────────────────────────────────────────

export const mockTreatmentDelivery: TreatmentDelivery[] = [
  // ── p1 / tp1 — Cisplatin + Etoposide ─────────────────────────────────────
  {
    id: 'td1', patientId: 'p1', planId: 'tp1', modality: 'chemotherapy',
    sessionNumber: 1, date: '2024-01-20',
    drugsAdministered: 'Cisplatin 75 mg/m² + Etoposide 100 mg/m²', doseDelivered: '100%', status: 'delivered',
    chemoDetails: {
      cycleNumber: 1, sessionType: 'daycare',
      ecogAtDelivery: 1,
      preChemoLabs: { wbc: '6.2', anc: '3.8', haemoglobin: '12.4', platelets: '210', creatinine: '0.9', bili: '0.8' },
      drugs: [
        { name: 'Cisplatin',  plannedDose: '75 mg/m²',  givenDose: '75 mg/m²',  route: 'IV' },
        { name: 'Etoposide',  plannedDose: '100 mg/m²', givenDose: '100 mg/m²', route: 'IV' },
      ],
    },
  },
  {
    id: 'td2', patientId: 'p1', planId: 'tp1', modality: 'chemotherapy',
    sessionNumber: 2, date: '2024-02-10',
    drugsAdministered: 'Cisplatin 75 mg/m² + Etoposide 100 mg/m²', doseDelivered: '100%', status: 'delivered',
    chemoDetails: {
      cycleNumber: 2, sessionType: 'daycare',
      ecogAtDelivery: 1,
      preChemoLabs: { wbc: '5.8', anc: '3.2', haemoglobin: '11.9', platelets: '195', creatinine: '0.9' },
      drugs: [
        { name: 'Cisplatin',  plannedDose: '75 mg/m²',  givenDose: '75 mg/m²',  route: 'IV' },
        { name: 'Etoposide',  plannedDose: '100 mg/m²', givenDose: '100 mg/m²', route: 'IV' },
      ],
    },
  },
  {
    id: 'td3', patientId: 'p1', planId: 'tp1', modality: 'chemotherapy',
    sessionNumber: 3, date: '2024-03-03',
    drugsAdministered: 'Cisplatin 60 mg/m² + Etoposide 100 mg/m²', doseDelivered: '80%', status: 'dose-reduced',
    notes: 'Cisplatin dose reduced to 80% due to creatinine rise (Cr 1.4). Hydration increased to 2 L pre/post.',
    chemoDetails: {
      cycleNumber: 3, sessionType: 'daycare',
      ecogAtDelivery: 2,
      preChemoLabs: { wbc: '4.1', anc: '2.0', haemoglobin: '10.8', platelets: '178', creatinine: '1.4', bili: '1.1', ast: '42', alt: '38' },
      drugs: [
        { name: 'Cisplatin',  plannedDose: '75 mg/m²',  givenDose: '60 mg/m²',  route: 'IV', notes: 'Dose reduced 80% — creatinine rise' },
        { name: 'Etoposide',  plannedDose: '100 mg/m²', givenDose: '100 mg/m²', route: 'IV' },
      ],
    },
  },

  // ── p3 / tp2 — FOLFOX ─────────────────────────────────────────────────────
  {
    id: 'td4', patientId: 'p3', planId: 'tp2', modality: 'chemotherapy',
    sessionNumber: 1, date: '2024-03-15',
    drugsAdministered: 'Oxaliplatin 85 mg/m² + Leucovorin 400 mg/m² + 5-FU 400 mg/m² bolus + 2400 mg/m² infusion', doseDelivered: '100%', status: 'delivered',
    chemoDetails: {
      cycleNumber: 1, sessionType: 'daycare',
      ecogAtDelivery: 2,
      preChemoLabs: { wbc: '7.4', anc: '4.6', haemoglobin: '13.2', platelets: '280', creatinine: '0.8' },
      drugs: [
        { name: 'Oxaliplatin',    plannedDose: '85 mg/m²',   givenDose: '85 mg/m²',   route: 'IV' },
        { name: 'Leucovorin',     plannedDose: '400 mg/m²',  givenDose: '400 mg/m²',  route: 'IV' },
        { name: '5-Fluorouracil', plannedDose: '400 mg/m²',  givenDose: '400 mg/m²',  route: 'IV bolus' },
        { name: '5-Fluorouracil', plannedDose: '2400 mg/m²', givenDose: '2400 mg/m²', route: 'IV infusion (46 hr)' },
      ],
    },
  },
  {
    id: 'td5', patientId: 'p3', planId: 'tp2', modality: 'chemotherapy',
    sessionNumber: 2, date: '2024-03-29',
    drugsAdministered: 'Oxaliplatin 85 mg/m² + Leucovorin + 5-FU', doseDelivered: '100%', status: 'delivered',
    chemoDetails: {
      cycleNumber: 2, sessionType: 'daycare',
      ecogAtDelivery: 2,
      preChemoLabs: { wbc: '6.8', anc: '4.0', haemoglobin: '12.8', platelets: '260', creatinine: '0.8' },
      drugs: [
        { name: 'Oxaliplatin',    plannedDose: '85 mg/m²',   givenDose: '85 mg/m²',   route: 'IV' },
        { name: 'Leucovorin',     plannedDose: '400 mg/m²',  givenDose: '400 mg/m²',  route: 'IV' },
        { name: '5-Fluorouracil', plannedDose: '400 mg/m²',  givenDose: '400 mg/m²',  route: 'IV bolus' },
        { name: '5-Fluorouracil', plannedDose: '2400 mg/m²', givenDose: '2400 mg/m²', route: 'IV infusion (46 hr)' },
      ],
    },
  },
  {
    id: 'td6', patientId: 'p3', planId: 'tp2', modality: 'chemotherapy',
    sessionNumber: 3, date: '2024-04-12',
    drugsAdministered: 'Oxaliplatin 85 mg/m² + Leucovorin + 5-FU', doseDelivered: '100%', status: 'delivered',
    chemoDetails: {
      cycleNumber: 3, sessionType: 'daycare',
      ecogAtDelivery: 2,
      preChemoLabs: { wbc: '6.2', anc: '3.6', haemoglobin: '12.4', platelets: '248', creatinine: '0.9' },
      drugs: [
        { name: 'Oxaliplatin',    plannedDose: '85 mg/m²',   givenDose: '85 mg/m²',   route: 'IV' },
        { name: 'Leucovorin',     plannedDose: '400 mg/m²',  givenDose: '400 mg/m²',  route: 'IV' },
        { name: '5-Fluorouracil', plannedDose: '400 mg/m²',  givenDose: '400 mg/m²',  route: 'IV bolus' },
        { name: '5-Fluorouracil', plannedDose: '2400 mg/m²', givenDose: '2400 mg/m²', route: 'IV infusion (46 hr)' },
      ],
    },
  },
  {
    id: 'td7', patientId: 'p3', planId: 'tp2', modality: 'chemotherapy',
    sessionNumber: 4, date: '2024-04-26',
    drugsAdministered: 'Oxaliplatin 64 mg/m² (75%) + Leucovorin + 5-FU', doseDelivered: '75%', status: 'dose-reduced',
    notes: 'Grade 2 peripheral neuropathy. Oxaliplatin reduced to 75%. Gabapentin commenced.',
    chemoDetails: {
      cycleNumber: 4, sessionType: 'daycare',
      ecogAtDelivery: 2,
      preChemoLabs: { wbc: '5.9', anc: '3.2', haemoglobin: '11.8', platelets: '232', creatinine: '0.9' },
      drugs: [
        { name: 'Oxaliplatin',    plannedDose: '85 mg/m²',   givenDose: '64 mg/m²',   route: 'IV', notes: 'Dose reduced to 75% — grade 2 neuropathy' },
        { name: 'Leucovorin',     plannedDose: '400 mg/m²',  givenDose: '400 mg/m²',  route: 'IV' },
        { name: '5-Fluorouracil', plannedDose: '400 mg/m²',  givenDose: '400 mg/m²',  route: 'IV bolus' },
        { name: '5-Fluorouracil', plannedDose: '2400 mg/m²', givenDose: '2400 mg/m²', route: 'IV infusion (46 hr)' },
      ],
    },
  },

  // ── p7 / tp3 — Docetaxel + Prednisone ────────────────────────────────────
  {
    id: 'td8', patientId: 'p7', planId: 'tp3', modality: 'chemotherapy',
    sessionNumber: 1, date: '2024-10-01',
    drugsAdministered: 'Docetaxel 75 mg/m² + Prednisone 5 mg BD', doseDelivered: '100%', status: 'delivered',
    chemoDetails: {
      cycleNumber: 1, sessionType: 'daycare',
      ecogAtDelivery: 1,
      preChemoLabs: { wbc: '7.8', anc: '5.1', haemoglobin: '13.6', platelets: '310', creatinine: '0.9' },
      drugs: [
        { name: 'Docetaxel',  plannedDose: '75 mg/m²', givenDose: '75 mg/m²', route: 'IV'   },
        { name: 'Prednisone', plannedDose: '5 mg BD',  givenDose: '5 mg BD',  route: 'Oral' },
      ],
    },
  },
  {
    id: 'td9', patientId: 'p7', planId: 'tp3', modality: 'chemotherapy',
    sessionNumber: 2, date: '2024-10-22',
    drugsAdministered: 'Docetaxel 75 mg/m² + Prednisone 5 mg BD', doseDelivered: '100%', status: 'delivered',
    chemoDetails: {
      cycleNumber: 2, sessionType: 'daycare',
      ecogAtDelivery: 1,
      preChemoLabs: { wbc: '7.2', anc: '4.8', haemoglobin: '13.1', platelets: '290', creatinine: '0.9' },
      drugs: [
        { name: 'Docetaxel',  plannedDose: '75 mg/m²', givenDose: '75 mg/m²', route: 'IV'   },
        { name: 'Prednisone', plannedDose: '5 mg BD',  givenDose: '5 mg BD',  route: 'Oral' },
      ],
    },
  },

  // ── p4 / tp6 — Cisplatin Weekly (Cervix) ─────────────────────────────────
  {
    id: 'td10', patientId: 'p4', planId: 'tp6', modality: 'chemotherapy',
    sessionNumber: 1, date: '2026-03-10',
    drugsAdministered: 'Cisplatin 40 mg/m²', doseDelivered: '100%', status: 'delivered',
    chemoDetails: {
      cycleNumber: 1, sessionType: 'daycare',
      ecogAtDelivery: 1,
      preChemoLabs: { wbc: '7.1', anc: '4.5', haemoglobin: '11.8', platelets: '240', creatinine: '0.8' },
      drugs: [
        { name: 'Cisplatin', plannedDose: '40 mg/m²', givenDose: '40 mg/m²', route: 'IV' },
      ],
    },
  },
  {
    id: 'td11', patientId: 'p4', planId: 'tp6', modality: 'chemotherapy',
    sessionNumber: 2, date: '2026-03-17',
    drugsAdministered: 'Cisplatin 40 mg/m²', doseDelivered: '100%', status: 'delivered',
    chemoDetails: {
      cycleNumber: 2, sessionType: 'daycare',
      ecogAtDelivery: 1,
      preChemoLabs: { wbc: '6.4', anc: '3.9', haemoglobin: '11.2', platelets: '218', creatinine: '0.9' },
      drugs: [
        { name: 'Cisplatin', plannedDose: '40 mg/m²', givenDose: '40 mg/m²', route: 'IV' },
      ],
    },
  },

  // ── p4 / tp7 — Pelvic EBRT (Cervix) ──────────────────────────────────────
  {
    id: 'rd4', patientId: 'p4', planId: 'tp7', modality: 'radiotherapy',
    sessionNumber: 1, date: '2026-03-10',
    drugsAdministered: '', doseDelivered: '1.8 Gy', status: 'delivered',
    radioDetails: { fractionNumber: 1, doseGy: 1.8, cumulativeDoseGy: 1.8, machine: 'Halcyon', skinReaction: 'None' },
  },
  {
    id: 'rd5', patientId: 'p4', planId: 'tp7', modality: 'radiotherapy',
    sessionNumber: 2, date: '2026-03-11',
    drugsAdministered: '', doseDelivered: '1.8 Gy', status: 'delivered',
    radioDetails: { fractionNumber: 2, doseGy: 1.8, cumulativeDoseGy: 3.6, machine: 'Halcyon', skinReaction: 'None' },
  },
  {
    id: 'rd6', patientId: 'p4', planId: 'tp7', modality: 'radiotherapy',
    sessionNumber: 10, date: '2026-03-21',
    drugsAdministered: '', doseDelivered: '1.8 Gy', status: 'delivered',
    notes: 'Grade 1 perineal skin reaction. Emollient cream applied.',
    radioDetails: { fractionNumber: 10, doseGy: 1.8, cumulativeDoseGy: 18.0, machine: 'Halcyon', skinReaction: 'Grade 1' },
  },

  // ── p5 / tp8 — Cisplatin + 5-FU (Oesophageal) ───────────────────────────
  {
    id: 'td12', patientId: 'p5', planId: 'tp8', modality: 'chemotherapy',
    sessionNumber: 1, date: '2026-04-05',
    drugsAdministered: 'Cisplatin 75 mg/m² + 5-FU 1000 mg/m²/day × 4 days', doseDelivered: '100%', status: 'delivered',
    chemoDetails: {
      cycleNumber: 1, sessionType: 'inpatient',
      admissionDate: '2026-04-05', dischargeDate: '2026-04-09',
      ecogAtDelivery: 1,
      preChemoLabs: { wbc: '8.2', anc: '5.6', haemoglobin: '12.1', platelets: '270', creatinine: '0.9' },
      drugs: [
        { name: 'Cisplatin',      plannedDose: '75 mg/m²',   givenDose: '75 mg/m²',   route: 'IV' },
        { name: '5-Fluorouracil', plannedDose: '1000 mg/m²', givenDose: '1000 mg/m²', route: 'IV infusion (24 hr)' },
      ],
    },
  },
  {
    id: 'td13', patientId: 'p5', planId: 'tp8', modality: 'chemotherapy',
    sessionNumber: 2, date: '2026-05-03',
    drugsAdministered: 'Cisplatin 75 mg/m² + 5-FU 1000 mg/m²/day × 4 days', doseDelivered: '100%', status: 'delivered',
    chemoDetails: {
      cycleNumber: 2, sessionType: 'inpatient',
      admissionDate: '2026-05-03', dischargeDate: '2026-05-07',
      ecogAtDelivery: 2,
      preChemoLabs: { wbc: '6.8', anc: '4.1', haemoglobin: '11.4', platelets: '245', creatinine: '1.0' },
      drugs: [
        { name: 'Cisplatin',      plannedDose: '75 mg/m²',   givenDose: '75 mg/m²',   route: 'IV' },
        { name: '5-Fluorouracil', plannedDose: '1000 mg/m²', givenDose: '1000 mg/m²', route: 'IV infusion (24 hr)' },
      ],
    },
  },

  // ── p6 / tp9 — R-CHOP (NHL) ──────────────────────────────────────────────
  {
    id: 'td14', patientId: 'p6', planId: 'tp9', modality: 'chemotherapy',
    sessionNumber: 1, date: '2026-02-18',
    drugsAdministered: 'R-CHOP (Rituximab + Cyclophosphamide + Doxorubicin + Vincristine + Prednisolone)', doseDelivered: '100%', status: 'delivered',
    notes: 'Cycle 1 — Rituximab infusion slowed at 30 min due to grade 1 infusion reaction (chills). Recovered. Completed at slower rate.',
    chemoDetails: {
      cycleNumber: 1, sessionType: 'daycare',
      ecogAtDelivery: 1,
      preChemoLabs: { wbc: '11.2', anc: '7.4', haemoglobin: '10.8', platelets: '180', creatinine: '0.8', bili: '0.9' },
      drugs: [
        { name: 'Rituximab',        plannedDose: '375 mg/m²', givenDose: '375 mg/m²', route: 'IV' },
        { name: 'Cyclophosphamide', plannedDose: '750 mg/m²', givenDose: '750 mg/m²', route: 'IV' },
        { name: 'Doxorubicin',      plannedDose: '50 mg/m²',  givenDose: '50 mg/m²',  route: 'IV' },
        { name: 'Vincristine',      plannedDose: '1.4 mg/m²', givenDose: '1.4 mg/m²', route: 'IV' },
        { name: 'Prednisolone',     plannedDose: '100 mg OD', givenDose: '100 mg OD', route: 'Oral' },
      ],
    },
  },
  {
    id: 'td15', patientId: 'p6', planId: 'tp9', modality: 'chemotherapy',
    sessionNumber: 2, date: '2026-03-11',
    drugsAdministered: 'R-CHOP Cycle 2', doseDelivered: '100%', status: 'delivered',
    chemoDetails: {
      cycleNumber: 2, sessionType: 'daycare',
      ecogAtDelivery: 1,
      preChemoLabs: { wbc: '8.4', anc: '5.2', haemoglobin: '11.6', platelets: '210', creatinine: '0.8' },
      drugs: [
        { name: 'Rituximab',        plannedDose: '375 mg/m²', givenDose: '375 mg/m²', route: 'IV' },
        { name: 'Cyclophosphamide', plannedDose: '750 mg/m²', givenDose: '750 mg/m²', route: 'IV' },
        { name: 'Doxorubicin',      plannedDose: '50 mg/m²',  givenDose: '50 mg/m²',  route: 'IV' },
        { name: 'Vincristine',      plannedDose: '1.4 mg/m²', givenDose: '1.4 mg/m²', route: 'IV' },
        { name: 'Prednisolone',     plannedDose: '100 mg OD', givenDose: '100 mg OD', route: 'Oral' },
      ],
    },
  },
  {
    id: 'td16', patientId: 'p6', planId: 'tp9', modality: 'chemotherapy',
    sessionNumber: 3, date: '2026-04-01',
    drugsAdministered: 'R-CHOP Cycle 3', doseDelivered: '100%', status: 'delivered',
    chemoDetails: {
      cycleNumber: 3, sessionType: 'daycare',
      ecogAtDelivery: 1,
      preChemoLabs: { wbc: '7.6', anc: '4.8', haemoglobin: '12.2', platelets: '228', creatinine: '0.8' },
      drugs: [
        { name: 'Rituximab',        plannedDose: '375 mg/m²', givenDose: '375 mg/m²', route: 'IV' },
        { name: 'Cyclophosphamide', plannedDose: '750 mg/m²', givenDose: '750 mg/m²', route: 'IV' },
        { name: 'Doxorubicin',      plannedDose: '50 mg/m²',  givenDose: '50 mg/m²',  route: 'IV' },
        { name: 'Vincristine',      plannedDose: '1.4 mg/m²', givenDose: '1.4 mg/m²', route: 'IV' },
        { name: 'Prednisolone',     plannedDose: '100 mg OD', givenDose: '100 mg OD', route: 'Oral' },
      ],
    },
  },

  // ── p8 / tp10 — Ovarian Surgery ──────────────────────────────────────────
  {
    id: 'sd2', patientId: 'p8', planId: 'tp10', modality: 'surgery',
    sessionNumber: 1, date: '2025-11-20',
    drugsAdministered: '', doseDelivered: '', status: 'completed',
    surgeryDetails: {
      surgeryNumber:       1,
      procedurePerformed:  'TAH + BSO + Infracolic Omentectomy + Pelvic Lymph Node Sampling',
      surgeon:             'Dr. Meena Kapoor',
      durationMinutes:     210,
      anaesthesiaType:     'GA',
      admissionDate:       '2025-11-20',
      dischargeDate:       '2025-11-28',
      intraOpFindings:     'Bilateral ovarian masses, omental cake. Peritoneal seedlings < 1 cm. Optimal cytoreduction achieved. Frozen section: high-grade serous carcinoma.',
      specimenSent:        true,
      specimenDetails:     'Bilateral ovaries, fallopian tubes, uterus, omentum — high-grade serous ovarian carcinoma, pT3c. Lymph nodes 2/8 positive.',
      postOpComplications: 'Nil major. Ileus day 2 — resolved with conservative management.',
    },
  },

  // ── p8 / tp11 — Carboplatin + Paclitaxel ─────────────────────────────────
  {
    id: 'td17', patientId: 'p8', planId: 'tp11', modality: 'chemotherapy',
    sessionNumber: 1, date: '2026-01-10',
    drugsAdministered: 'Paclitaxel 175 mg/m² + Carboplatin AUC 5', doseDelivered: '100%', status: 'delivered',
    chemoDetails: {
      cycleNumber: 1, sessionType: 'daycare',
      ecogAtDelivery: 1,
      preChemoLabs: { wbc: '7.4', anc: '4.6', haemoglobin: '11.2', platelets: '290', creatinine: '0.8' },
      drugs: [
        { name: 'Paclitaxel',  plannedDose: '175 mg/m²', givenDose: '175 mg/m²', route: 'IV' },
        { name: 'Carboplatin', plannedDose: 'AUC 5',     givenDose: 'AUC 5',     route: 'IV' },
      ],
    },
  },
  {
    id: 'td18', patientId: 'p8', planId: 'tp11', modality: 'chemotherapy',
    sessionNumber: 2, date: '2026-01-31',
    drugsAdministered: 'Paclitaxel 175 mg/m² + Carboplatin AUC 5', doseDelivered: '100%', status: 'delivered',
    chemoDetails: {
      cycleNumber: 2, sessionType: 'daycare',
      ecogAtDelivery: 1,
      preChemoLabs: { wbc: '6.8', anc: '4.1', haemoglobin: '10.6', platelets: '268', creatinine: '0.9' },
      drugs: [
        { name: 'Paclitaxel',  plannedDose: '175 mg/m²', givenDose: '175 mg/m²', route: 'IV' },
        { name: 'Carboplatin', plannedDose: 'AUC 5',     givenDose: 'AUC 5',     route: 'IV' },
      ],
    },
  },

  // ── p1 / tp4 — IMRT Radiotherapy fractions ───────────────────────────────
  {
    id: 'rd1', patientId: 'p1', planId: 'tp4', modality: 'radiotherapy',
    sessionNumber: 1, date: '2024-01-22',
    drugsAdministered: '', doseDelivered: '2.0 Gy', status: 'delivered',
    radioDetails: { fractionNumber: 1, doseGy: 2.0, cumulativeDoseGy: 2.0, machine: 'TrueBeam STx', skinReaction: 'None' },
  },
  {
    id: 'rd2', patientId: 'p1', planId: 'tp4', modality: 'radiotherapy',
    sessionNumber: 2, date: '2024-01-23',
    drugsAdministered: '', doseDelivered: '2.0 Gy', status: 'delivered',
    radioDetails: { fractionNumber: 2, doseGy: 2.0, cumulativeDoseGy: 4.0, machine: 'TrueBeam STx', skinReaction: 'None' },
  },
  {
    id: 'rd3', patientId: 'p1', planId: 'tp4', modality: 'radiotherapy',
    sessionNumber: 15, date: '2024-02-09',
    drugsAdministered: '', doseDelivered: '2.0 Gy', status: 'delivered',
    notes: 'Grade 1 skin reaction noted at right chest wall. Aqueous cream applied.',
    radioDetails: { fractionNumber: 15, doseGy: 2.0, cumulativeDoseGy: 30.0, machine: 'TrueBeam STx', skinReaction: 'Grade 1' },
  },

  // ── p3 / tp5 — Surgery ────────────────────────────────────────────────────
  {
    id: 'sd1', patientId: 'p3', planId: 'tp5', modality: 'surgery',
    sessionNumber: 1, date: '2024-06-17',
    drugsAdministered: '', doseDelivered: '', status: 'completed',
    surgeryDetails: {
      surgeryNumber:       1,
      procedurePerformed:  'Laparoscopic Low Anterior Resection (LAR) with Defunctioning Loop Ileostomy',
      surgeon:             'Dr. Ramesh Sharma',
      durationMinutes:     195,
      anaesthesiaType:     'GA',
      admissionDate:       '2024-06-17',
      dischargeDate:       '2024-06-24',
      intraOpFindings:     'Tumour 8 cm from anal verge. No peritoneal deposits. Mesorectum intact. Negative circumferential resection margin (CRM). Defunctioning ileostomy fashioned.',
      specimenSent:        true,
      specimenDetails:     'Rectosigmoid specimen: tumour 2.1 × 1.8 cm, ypT2N0 (3/12 nodes negative). CRM clear.',
      postOpComplications: 'Nil significant. Wound healthy. Stoma functioning.',
    },
  },
];

// ── Other mock data ───────────────────────────────────────────────────────────

export const mockResponseAssessments: ResponseAssessment[] = [
  {
    id: 'ra1', patientId: 'p1', date: '2024-04-10',
    imagingUsed: 'CT', recist: 'partial-response', planId: 'tp1', cycleNumber: 3,
    response: 'Right upper lobe mass reduced from 4.2 cm to 2.1 cm. Mediastinal nodes significantly smaller. No new lesions.',
    targetLesions: [
      { name: 'Right Upper Lobe Mass', baseline: 42, current: 21, change: -50 },
      { name: 'Mediastinal Node (R)', baseline: 18, current: 8,  change: -56 },
    ],
    nonTargetLesions: [
      { name: 'Contralateral Mediastinal Nodes', status: 'absent' },
    ],
    notes: 'Good partial response post-CCRT. Consolidation immunotherapy to be considered.',
  },
  {
    id: 'ra2', patientId: 'p3', date: '2024-05-10',
    imagingUsed: 'MRI', recist: 'partial-response', planId: 'tp2', cycleNumber: 3,
    response: 'Rectal tumour reduced from 4.1 cm to 1.9 cm. Mesorectal nodes resolved. Sphincter complex preserved.',
    targetLesions: [
      { name: 'Rectal Primary Tumour', baseline: 41, current: 19, change: -54 },
    ],
    nonTargetLesions: [
      { name: 'Mesorectal Nodes', status: 'absent' },
    ],
    notes: 'Excellent radiological response. Surgical review for sphincter-preserving resection.',
  },
  {
    id: 'ra3', patientId: 'p7', date: '2024-12-01',
    imagingUsed: 'Biomarker / Labs', recist: 'partial-response', planId: 'tp3', cycleNumber: 2,
    response: 'PSA declined from 1240 to 68 ng/mL after 2 cycles of Docetaxel. Bone scan shows no new lesions.',
    nonTargetLesions: [
      { name: 'Bone Metastases (multiple)', status: 'stable' },
    ],
    notes: 'Good biochemical response. Continue current regimen.',
  },
  {
    id: 'ra4', patientId: 'p6', date: '2026-04-20',
    imagingUsed: 'PET-CT', recist: 'partial-response', planId: 'tp9', cycleNumber: 3,
    response: 'Reduction in FDG-avid mediastinal and para-aortic nodal masses. Deauville score 3. No new lesions.',
    targetLesions: [
      { name: 'Mediastinal Node Cluster', baseline: 35, current: 18, change: -49 },
      { name: 'Para-aortic Node',         baseline: 22, current: 11, change: -50 },
    ],
    notes: 'Mid-treatment PET (after 3 cycles R-CHOP). Partial metabolic response. Continue planned 6 cycles.',
  },
  {
    id: 'ra5', patientId: 'p8', date: '2026-02-15',
    imagingUsed: 'CT', recist: 'complete-response', planId: 'tp11', cycleNumber: 2,
    response: 'CA-125 normalised (from 680 to 28 U/mL). No residual tumour mass on CT. No ascites.',
    nonTargetLesions: [
      { name: 'Peritoneal Deposits', status: 'absent' },
    ],
    notes: 'Excellent response after 2 cycles Carboplatin/Paclitaxel. Continue to complete 6 cycles.',
  },
];

export const mockToxicityRecords: ToxicityRecord[] = [
  {
    id: 'tox1', patientId: 'p1', date: '2024-02-18',
    ctcaeCategory: 'gastrointestinal', toxicityType: 'Oesophagitis', grade: 2,
    description: 'Painful swallowing, dysphagia to solids. Grade 2 radiation oesophagitis.',
    actionTaken: 'PPI escalated, soft diet advised, oral lidocaine rinse prescribed.',
    hospitalAdmission: false, planId: 'tp4',
  },
  {
    id: 'tox2', patientId: 'p1', date: '2024-03-05',
    ctcaeCategory: 'hematologic', toxicityType: 'Febrile Neutropenia', grade: 3,
    description: 'ANC 0.8 × 10⁹/L. Febrile neutropenia episode requiring hospitalisation.',
    actionTaken: 'Admitted, IV antibiotics, G-CSF started. Cycle 3 delayed by 1 week.',
    hospitalAdmission: true, admissionDate: '2024-03-05', dischargeDate: '2024-03-09',
    planId: 'tp1', cycleNumber: 3,
  },
  {
    id: 'tox3', patientId: 'p3', date: '2024-04-28',
    ctcaeCategory: 'neurological', toxicityType: 'Peripheral Neuropathy', grade: 2,
    description: 'Tingling and numbness in hands and feet. Worse in cold exposure. Affecting fine motor tasks.',
    actionTaken: 'Oxaliplatin dose reduced to 75%. Gabapentin 300 mg TDS commenced.',
    hospitalAdmission: false, planId: 'tp2', cycleNumber: 4,
  },
  {
    id: 'tox4', patientId: 'p3', date: '2024-05-15',
    ctcaeCategory: 'gastrointestinal', toxicityType: 'Diarrhoea', grade: 2,
    description: '4–6 loose stools per day. No blood. No dehydration.',
    actionTaken: 'Loperamide 2 mg after each loose stool. Oral rehydration. Dietary modification.',
    hospitalAdmission: false, planId: 'tp2', cycleNumber: 5,
  },
  {
    id: 'tox5', patientId: 'p7', date: '2024-11-05',
    ctcaeCategory: 'constitutional', toxicityType: 'Fatigue', grade: 2,
    description: 'Moderate fatigue affecting daily activities. Likely treatment-related.',
    actionTaken: 'Activity pacing counselled. Haemoglobin checked — 10.2 g/dL. Iron supplementation started.',
    hospitalAdmission: false, planId: 'tp3', cycleNumber: 2,
  },
  {
    id: 'tox6', patientId: 'p4', date: '2026-03-25',
    ctcaeCategory: 'gastrointestinal', toxicityType: 'Radiation Proctitis', grade: 1,
    description: 'Mild diarrhoea 2–3 times/day with occasional rectal discomfort. Grade 1 proctitis.',
    actionTaken: 'Low-residue diet advised. Probiotic started. Hydration maintained.',
    hospitalAdmission: false, planId: 'tp7',
  },
  {
    id: 'tox7', patientId: 'p6', date: '2026-02-19',
    ctcaeCategory: 'immunological', toxicityType: 'Infusion Reaction (Rituximab)', grade: 1,
    description: 'Chills and mild fever during Rituximab infusion (Cycle 1). Resolved with rate reduction.',
    actionTaken: 'Rituximab infusion rate halved. Paracetamol 1g IV. Completed successfully at reduced rate.',
    hospitalAdmission: false, planId: 'tp9', cycleNumber: 1,
  },
  {
    id: 'tox8', patientId: 'p8', date: '2026-02-05',
    ctcaeCategory: 'dermatological', toxicityType: 'Alopecia', grade: 2,
    description: 'Significant hair loss after cycle 1 Paclitaxel. Patient distressed.',
    actionTaken: 'Scalp cooling counselled (not available at centre). Wig referral provided. Psychological support.',
    hospitalAdmission: false, planId: 'tp11', cycleNumber: 1,
  },
];

export const mockSurvivorshipRecords: SurvivorshipRecord[] = [
  {
    id: 'sr1', patientId: 'p1', followUpDate: '2024-07-15',
    status: 'In Remission',
    notes: 'Post-CCRT 3-month follow-up. CT chest clear — no residual mass. Symptom-free. Annual surveillance CT planned.',
  },
  {
    id: 'sr2', patientId: 'p1', followUpDate: '2024-10-15',
    status: 'In Remission',
    notes: '6-month surveillance — no evidence of disease. Mild chronic fatigue noted. Pulmonary rehab recommended.',
  },
];

export const mockRecurrenceRecords: RecurrenceRecord[] = [
  {
    id: 'rec1', patientId: 'p7', detectedDate: '2025-01-15',
    site: 'L4 Vertebral Body', type: 'Distant',
    notes: 'New lytic lesion on surveillance bone scan. PSA rising (68 → 340 ng/mL). Castration-resistant prostate cancer (CRPC) transition suspected.',
  },
];

export const mockPalliativeCareRecords: PalliativeCareRecord[] = [
  { id: 'pc1', patientId: 'p7', date: '2024-12-10', symptom: 'Bone Pain (lumbar)', intervention: 'Morphine SR 10 mg BD + Ibuprofen 400 mg TDS', response: 'Pain reduced from VAS 8/10 to 4/10 within 2 weeks.' },
  { id: 'pc2', patientId: 'p7', date: '2025-01-20', symptom: 'Bone Pain (worsening) + Anxiety', intervention: 'Morphine titrated to 30 mg BD. Palliative care team involved. Zoledronic acid IV monthly.', response: 'Partial relief. Psychological support initiated.' },
  { id: 'pc3', patientId: 'p8', date: '2024-12-01', symptom: 'Ascites (moderate)', intervention: 'Paracentesis 2L. Spironolactone 100 mg OD commenced.', response: 'Abdominal distension reduced. Comfort improved.' },
];

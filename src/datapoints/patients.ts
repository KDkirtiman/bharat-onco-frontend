export type PayorType = 'self' | 'insurance' | 'government' | 'corporate';

export const PAYOR_TYPE_LABELS: Record<PayorType, string> = {
  self: 'Self Pay', insurance: 'Insurance', government: 'Government', corporate: 'Corporate',
};

export interface PatientDiagnosis {
  cancerType:     string;
  stage:          string;
  diagnosedDate?: string;
  icdCode?:       string;
}

export interface PatientAllergy {
  id?:       string;
  type:      'drug' | 'food' | 'environmental' | 'latex' | 'other';
  allergen:  string;
  reaction?: string;
}

export interface InsuranceDetails {
  name:             string;
  policyNumber:     string;
  memberId:         string;
  policyHolderName: string;
  relationship:     string;
  policyStartDate:  string;
  policyEndDate:    string;
}

export interface GovernmentDetails {
  schemeName:    string;
  beneficiaryId: string;
  cardNumber:    string;
  issueDate:     string;
}

export interface CorporateDetails {
  corporateName:    string;
  employeeName:     string;
  employeeId:       string;
  relationship:     string;
  tpaName:          string;
  insuranceCompany: string;
  policyNumber:     string;
  memberId:         string;
  policyStartDate:  string;
  policyEndDate:    string;
}

export interface PatientPayor {
  type:        PayorType;
  insurance?:  InsuranceDetails;
  government?: GovernmentDetails;
  corporate?:  CorporateDetails;
}

export interface PatientReferral {
  source:            'opd-walk-in' | 'referral';
  referringDoctor?:  string;
  referringHospital?: string;
}

export interface PatientAddress {
  line1:         string;
  line2?:        string;
  pincode?:      string;
  city:          string;
  district?:     string;
  state:         string;
  country:       string;
  isInternational?: boolean;
  stateProvince?: string;
  postalCode?:    string;
}

export interface PatientEmergencyContact {
  name:        string;
  relation:    string;
  countryCode: string;
  phone:       string;
}

export interface SocialCustomField {
  label:  string;
  status: string;
}

export interface PatientPastHistory {
  // Section 1: Medical
  comorbidities?:       string[];
  priorCancer?:         string;
  priorSurgery?:        string;
  // Section 2: Social
  smoking?:             string;
  alcohol?:             string;
  tobacco?:             string;
  socialCustomFields?:  SocialCustomField[];
  // Section 3: Occupational
  occupationalField?:   string;
  toxinExposure?:       string;
  // Section 4: Family
  familyCancerHistory?: string;
}

export type PatientStatus = 'active' | 'inactive' | 'treated';

export interface Patient {
  id:             string;
  mrn:            string;
  name:           string;
  firstName?:     string;
  lastName?:      string;
  hospitalId?:    string;
  center:         string;
  dob:            string;
  gender:         'M' | 'F' | 'Other';
  phone:          string;
  registeredDate: string;
  status?:        PatientStatus;

  // Extended contact
  countryCode?:              string;
  phoneWhatsapp?:            boolean;
  alternatePhone?:           string;
  alternateCountryCode?:     string;
  alternatePhoneWhatsapp?:   boolean;
  email?:                    string;

  // Identifier
  identifierType?:        string;
  identifierNumber?:      string;
  identifierDocFileName?: string;

  // Address
  address?: PatientAddress;

  // Emergency contact
  emergencyContact?: PatientEmergencyContact;

  // Registration extended data
  payor?:             PatientPayor;
  referral?:          PatientReferral;
  chiefComplaints?:   string;
  uploadedDocuments?: { type: string; subcategory?: string; fileName: string; uploadedAt: string; fileUrl?: string }[];

  // Clinical
  diagnosis?:   PatientDiagnosis;
  allergies?:   PatientAllergy[];
  pastHistory?: PatientPastHistory;
}

const today = new Date().toISOString().split('T')[0];

export const mockPatients: Patient[] = [
  {
    id: 'p1', mrn: 'BO-KRK-00000001', center: 'Kurukshetra', status: 'active' as PatientStatus,
    name: 'Suresh Kumar', firstName: 'Suresh', lastName: 'Kumar',
    dob: '1965-03-15', gender: 'M', registeredDate: '2024-01-10',
    countryCode: '+91', phone: '9876543210', phoneWhatsapp: true,
    email: 'suresh.kumar@gmail.com',
    identifierType: 'aadhaar', identifierNumber: '4321 8765 2341',
    address: { line1: 'H.No. 12, Sector 7', line2: 'Near Brahma Sarovar', pincode: '136118', city: 'Kurukshetra', district: 'Kurukshetra', state: 'Haryana', country: 'India' },
    emergencyContact: { name: 'Rekha Kumar', relation: 'Spouse', countryCode: '+91', phone: '9876501234' },
    payor: {
      type: 'insurance',
      insurance: { name: 'Star Health & Allied Insurance', policyNumber: 'P/211222/01/2024/000123', memberId: 'SH2024123456', policyHolderName: 'Suresh Kumar', relationship: 'Self', policyStartDate: '2024-01-01', policyEndDate: '2024-12-31' },
    },
    referral: { source: 'referral', referringDoctor: 'Dr. Harpreet Singh', referringHospital: 'Civil Hospital Kurukshetra' },
    chiefComplaints: 'Chronic cough with blood-tinged sputum for 3 months, significant weight loss, fatigue. CT scan suggests right upper lobe mass — suspected lung carcinoma.',
    uploadedDocuments: [
      { type: 'Radiology', subcategory: 'CT Scan',  fileName: 'chest_ct_jan2024.pdf', uploadedAt: '01/01/2024' },
      { type: 'Pathology', subcategory: 'Cytology', fileName: 'sputum_cytology.pdf',  uploadedAt: '05/01/2024' },
    ],
    diagnosis: { cancerType: 'Lung Carcinoma', stage: 'Stage IIIA', diagnosedDate: '2024-01-08', icdCode: 'C34.1' },
    allergies: [{ id: 'al-p1-1', allergen: 'Penicillin', type: 'drug', reaction: 'Rash, urticaria' }],
    pastHistory: {
      comorbidities:       ['Hypertension', 'Diabetes Mellitus'],
      priorCancer:         '',
      priorSurgery:        '',
      smoking:             'Former Smoker',
      alcohol:             'Never',
      tobacco:             'Never',
      occupationalField:   'Agriculture / Farming',
      toxinExposure:       'Pesticides, agricultural dust (25+ years)',
      familyCancerHistory: 'Father: Lung cancer (deceased, age 68). Mother: Hypertension. One sibling — no known malignancy.',
    },
  },
  {
    id: 'p2', mrn: 'BO-PNP-00000001', center: 'Panipat', status: 'treated' as PatientStatus,
    name: 'Meena Devi', firstName: 'Meena', lastName: 'Devi',
    dob: '1958-07-22', gender: 'F', registeredDate: '2024-02-14',
    countryCode: '+91', phone: '9876543211', phoneWhatsapp: false,
    identifierType: 'voter', identifierNumber: 'HRY1234567',
    address: { line1: '45, Subhash Nagar', pincode: '132103', city: 'Panipat', district: 'Panipat', state: 'Haryana', country: 'India' },
    emergencyContact: { name: 'Rajesh Devi', relation: 'Spouse', countryCode: '+91', phone: '9876511122' },
    payor: { type: 'self' },
    referral: { source: 'opd-walk-in' },
    chiefComplaints: 'Lump in right breast noticed 2 months ago, associated with nipple discharge. Ultrasound and mammography suggestive of malignancy. Referred for further evaluation.',
    uploadedDocuments: [
      { type: 'Radiology', subcategory: 'X-Ray', fileName: 'mammogram_feb2024.pdf', uploadedAt: '14/02/2024' },
    ],
    diagnosis: { cancerType: 'Breast Carcinoma', stage: 'Stage IIA', diagnosedDate: '2024-02-16', icdCode: 'C50.9' },
    allergies: [{ id: 'al-p2-1', allergen: 'Shellfish', type: 'food', reaction: 'Anaphylaxis' }],
  },
  {
    id: 'p3', mrn: 'BO-KRK-00000002', center: 'Kurukshetra', status: 'active' as PatientStatus,
    name: 'Ramesh Gupta', firstName: 'Ramesh', lastName: 'Gupta',
    dob: '1970-11-08', gender: 'M', registeredDate: '2024-03-05',
    countryCode: '+91', phone: '9876543212', phoneWhatsapp: true,
    alternatePhone: '9876500001', alternateCountryCode: '+91', alternatePhoneWhatsapp: false,
    email: 'ramesh.gupta@yahoo.com',
    identifierType: 'aadhaar', identifierNumber: '5678 1234 9012',
    address: { line1: '22, Ram Nagar Colony', line2: 'Opposite Govt. School', pincode: '136119', city: 'Kurukshetra', district: 'Kurukshetra', state: 'Haryana', country: 'India' },
    emergencyContact: { name: 'Savita Gupta', relation: 'Spouse', countryCode: '+91', phone: '9876522233' },
    payor: {
      type: 'government',
      government: { schemeName: 'PM-JAY (Ayushman Bharat)', beneficiaryId: 'PMJAY-HR-2024-556677', cardNumber: 'PMJAY-CARD-88991', issueDate: '2023-04-15' },
    },
    referral: { source: 'referral', referringDoctor: 'Dr. Sunil Arora', referringHospital: 'PGI Rohtak' },
    chiefComplaints: 'Rectal bleeding, altered bowel habits, and a 6 kg weight loss over 4 months. Colonoscopy biopsy confirms adenocarcinoma of rectum.',
    uploadedDocuments: [
      { type: 'Pathology', subcategory: 'Biopsy Report', fileName: 'biopsy_report_mar2024.pdf', uploadedAt: '05/03/2024' },
      { type: 'Radiology', subcategory: 'MRI',          fileName: 'mri_pelvis.pdf',            uploadedAt: '06/03/2024' },
    ],
    diagnosis: { cancerType: 'Rectal Adenocarcinoma', stage: 'Stage IIIB', diagnosedDate: '2024-03-06', icdCode: 'C20' },
    allergies: [{ id: 'al-p3-1', allergen: 'Sulfa Drugs', type: 'drug', reaction: 'Stevens-Johnson syndrome' }, { id: 'al-p3-2', allergen: 'Pollen', type: 'environmental', reaction: 'Rhinitis, sneezing' }],
    pastHistory: {
      comorbidities:       ['Diabetes Mellitus'],
      priorCancer:         '',
      priorSurgery:        'Cholecystectomy (2018)',
      smoking:             'Never',
      alcohol:             'Occasional',
      tobacco:             'Never',
      occupationalField:   'Retail / Trade',
      toxinExposure:       '',
      familyCancerHistory: 'Father: Colorectal cancer (diagnosed age 62). Maternal uncle: Prostate cancer.',
    },
  },
  {
    id: 'p4', mrn: 'BO-SML-00000001', center: 'Shimla', status: 'active' as PatientStatus,
    name: 'Kavita Sharma', firstName: 'Kavita', lastName: 'Sharma',
    dob: '1963-05-19', gender: 'F', registeredDate: '2024-04-20',
    countryCode: '+91', phone: '9876543213', phoneWhatsapp: true,
    email: 'kavita.sharma@hotmail.com',
    identifierType: 'pan', identifierNumber: 'BJKPS4321H',
    address: { line1: '8, Lakkar Bazaar', line2: 'Near Hanuman Temple', pincode: '171001', city: 'Shimla', district: 'Shimla', state: 'Himachal Pradesh', country: 'India' },
    emergencyContact: { name: 'Vikas Sharma', relation: 'Spouse', countryCode: '+91', phone: '9876533344' },
    payor: {
      type: 'insurance',
      insurance: { name: 'HDFC ERGO Health Insurance', policyNumber: 'HDFC/OPT/2024/456789', memberId: 'HDFC-MBR-23456', policyHolderName: 'Vikas Sharma', relationship: 'Spouse', policyStartDate: '2024-04-01', policyEndDate: '2025-03-31' },
    },
    referral: { source: 'referral', referringDoctor: 'Dr. Asha Verma', referringHospital: 'Indira Gandhi Medical College, Shimla' },
    chiefComplaints: 'Cervical cancer stage IIB — presenting with pelvic pain, vaginal bleeding, and difficulty in urination. Biopsy confirmed squamous cell carcinoma.',
    uploadedDocuments: [
      { type: 'Pathology',               subcategory: 'Biopsy Report', fileName: 'cervical_biopsy.pdf',    uploadedAt: '18/04/2024' },
      { type: 'External Medical Records', subcategory: 'OPD Notes',    fileName: 'igmc_referral_note.pdf', uploadedAt: '20/04/2024' },
    ],
    diagnosis: { cancerType: 'Cervical Carcinoma', stage: 'Stage IIB', diagnosedDate: '2024-04-18', icdCode: 'C53.9' },
    allergies: [{ id: 'al-p4-1', allergen: 'Aspirin', type: 'drug', reaction: 'Bronchospasm, urticaria' }],
  },
  {
    id: 'p5', mrn: 'BO-PNP-00000002', center: 'Panipat', status: 'inactive' as PatientStatus,
    name: 'Arun Verma', firstName: 'Arun', lastName: 'Verma',
    dob: '1955-09-30', gender: 'M', registeredDate: '2024-06-11',
    countryCode: '+91', phone: '9876543214', phoneWhatsapp: false,
    identifierType: 'driving', identifierNumber: 'HR-0620110123456',
    address: { line1: '67, Model Town', pincode: '132107', city: 'Panipat', district: 'Panipat', state: 'Haryana', country: 'India' },
    emergencyContact: { name: 'Pooja Verma', relation: 'Child', countryCode: '+91', phone: '9876544455' },
    payor: { type: 'self' },
    referral: { source: 'opd-walk-in' },
    chiefComplaints: 'Progressive dysphagia and regurgitation for 2 months. OGD scopy shows circumferential lesion at mid-oesophagus. Biopsy reports squamous cell carcinoma.',
    diagnosis: { cancerType: 'Oesophageal Carcinoma', stage: 'Stage III', diagnosedDate: '2024-06-13', icdCode: 'C15.9' },
  },
  {
    id: 'p6', mrn: 'BO-UNA-00000001', center: 'Una', status: 'active' as PatientStatus,
    name: 'Priti Singh', firstName: 'Priti', lastName: 'Singh',
    dob: '1978-02-14', gender: 'F', registeredDate: '2024-08-03',
    countryCode: '+91', phone: '9876543215', phoneWhatsapp: true,
    alternatePhone: '9876500002', alternateCountryCode: '+91', alternatePhoneWhatsapp: true,
    email: 'priti.singh@gmail.com',
    identifierType: 'aadhaar', identifierNumber: '9012 3456 7890',
    address: { line1: '3, Gandhi Chowk', line2: 'Ward No. 5', pincode: '174303', city: 'Una', district: 'Una', state: 'Himachal Pradesh', country: 'India' },
    emergencyContact: { name: 'Amarjeet Singh', relation: 'Spouse', countryCode: '+91', phone: '9876555566' },
    payor: {
      type: 'corporate',
      corporate: { corporateName: 'HPCL Refineries Ltd.', employeeName: 'Amarjeet Singh', employeeId: 'HPCL-EMP-78923', relationship: 'Spouse', tpaName: 'Medi Assist TPA', insuranceCompany: 'New India Assurance', policyNumber: 'NIA/CORP/2024/12345', memberId: 'NIA-MBR-98765', policyStartDate: '2024-04-01', policyEndDate: '2025-03-31' },
    },
    referral: { source: 'referral', referringDoctor: 'Dr. Manpreet Kaur', referringHospital: 'Zonal Hospital Una' },
    chiefComplaints: 'Non-Hodgkin lymphoma — painless cervical lymphadenopathy for 3 months, night sweats, and fever. PET-CT confirms Stage IIIA nodal disease.',
    uploadedDocuments: [
      { type: 'Radiology', subcategory: 'PET-CT',        fileName: 'pet_ct_aug2024.pdf',    uploadedAt: '01/08/2024' },
      { type: 'Pathology', subcategory: 'Biopsy Report', fileName: 'lymph_node_biopsy.pdf', uploadedAt: '02/08/2024' },
    ],
    diagnosis: { cancerType: 'Non-Hodgkin Lymphoma', stage: 'Stage IIIA', diagnosedDate: '2024-08-03', icdCode: 'C85.9' },
    allergies: [{ id: 'al-p6-1', allergen: 'Ibuprofen', type: 'drug', reaction: 'GI bleed, epigastric pain' }],
  },
  {
    id: 'p7', mrn: 'BO-KRK-00000003', center: 'Kurukshetra', status: 'treated' as PatientStatus,
    name: 'Deepak Joshi', firstName: 'Deepak', lastName: 'Joshi',
    dob: '1949-12-27', gender: 'M', registeredDate: '2024-09-15',
    countryCode: '+91', phone: '9876543216', phoneWhatsapp: false,
    identifierType: 'voter', identifierNumber: 'HRY9876543',
    address: { line1: '11, Civil Lines', pincode: '136118', city: 'Kurukshetra', district: 'Kurukshetra', state: 'Haryana', country: 'India' },
    emergencyContact: { name: 'Neelam Joshi', relation: 'Spouse', countryCode: '+91', phone: '9876566677' },
    payor: {
      type: 'government',
      government: { schemeName: 'CGHS', beneficiaryId: 'CGHS-CHD-2024-112233', cardNumber: 'CGHS-CARD-55678', issueDate: '2022-07-01' },
    },
    referral: { source: 'referral', referringHospital: 'AIIMS Rishikesh' },
    chiefComplaints: 'Stage IV prostate cancer with bone metastasis. Elevated PSA (1240 ng/mL), bone scan shows multiple skeletal lesions. On androgen deprivation therapy; referred for chemotherapy evaluation.',
    uploadedDocuments: [
      { type: 'Lab Work',  subcategory: 'Tumour Markers', fileName: 'psa_levels_sep2024.pdf', uploadedAt: '14/09/2024' },
      { type: 'Radiology', subcategory: 'Others',         fileName: 'bone_scan_sep2024.pdf',  uploadedAt: '14/09/2024' },
    ],
    diagnosis: { cancerType: 'Prostate Carcinoma', stage: 'Stage IV', diagnosedDate: '2024-09-15', icdCode: 'C61' },
    allergies: [{ id: 'al-p7-1', allergen: 'Latex', type: 'latex', reaction: 'Contact dermatitis, urticaria' }],
  },
  {
    id: 'p8', mrn: 'BO-DRA-00000001', center: 'Deoria', status: 'active' as PatientStatus,
    name: 'Anjali Mishra', firstName: 'Anjali', lastName: 'Mishra',
    dob: '1967-04-06', gender: 'F', registeredDate: '2024-11-22',
    countryCode: '+91', phone: '9876543217', phoneWhatsapp: true,
    email: 'anjali.mishra@gmail.com',
    identifierType: 'aadhaar', identifierNumber: '1122 3344 5566',
    address: { line1: '34, Nehru Nagar', line2: 'Beside Dena Bank', pincode: '274001', city: 'Deoria', district: 'Deoria', state: 'Uttar Pradesh', country: 'India' },
    emergencyContact: { name: 'Rakesh Mishra', relation: 'Spouse', countryCode: '+91', phone: '9876577788' },
    payor: { type: 'self' },
    referral: { source: 'referral', referringDoctor: 'Dr. Alok Pandey', referringHospital: 'BHU Hospital Varanasi' },
    chiefComplaints: 'Ovarian cancer — lower abdominal distension, ascites, and pelvic pain for 6 weeks. CA-125 markedly elevated at 980 U/mL. Staging laparoscopy pending.',
    uploadedDocuments: [
      { type: 'Lab Work',  subcategory: 'Tumour Markers', fileName: 'ca125_report.pdf',      uploadedAt: '20/11/2024' },
      { type: 'Radiology', subcategory: 'CT Scan',        fileName: 'abdomen_pelvis_ct.pdf', uploadedAt: '21/11/2024' },
    ],
    diagnosis: { cancerType: 'Ovarian Carcinoma', stage: 'Stage IIIC', diagnosedDate: '2024-11-22', icdCode: 'C56.9' },
    allergies: [{ id: 'al-p8-1', allergen: 'Codeine', type: 'drug', reaction: 'Severe nausea, vomiting' }, { id: 'al-p8-2', allergen: 'Peanuts', type: 'food', reaction: 'Anaphylaxis' }],
  },
  {
    id: 'p9', mrn: 'BO-UNA-00000002', center: 'Una', status: 'active' as PatientStatus,
    name: 'Ravi Tiwari', firstName: 'Ravi', lastName: 'Tiwari',
    dob: '1961-08-17', gender: 'M', registeredDate: '2025-01-30',
    countryCode: '+91', phone: '9876543218', phoneWhatsapp: true,
    alternatePhone: '9876500003', alternateCountryCode: '+91', alternatePhoneWhatsapp: false,
    identifierType: 'pan', identifierNumber: 'CTXRT7654G',
    address: { line1: '5, Shastri Nagar', pincode: '174303', city: 'Una', district: 'Una', state: 'Himachal Pradesh', country: 'India' },
    emergencyContact: { name: 'Kamla Tiwari', relation: 'Spouse', countryCode: '+91', phone: '9876588899' },
    payor: {
      type: 'insurance',
      insurance: { name: 'Max Bupa Health Insurance', policyNumber: 'MAXB/2025/789012', memberId: 'MAXB-MBR-34567', policyHolderName: 'Ravi Tiwari', relationship: 'Self', policyStartDate: '2025-01-01', policyEndDate: '2025-12-31' },
    },
    referral: { source: 'opd-walk-in' },
    chiefComplaints: 'Jaundice with obstructive features, weight loss of 8 kg over 3 months, and upper abdominal pain. MRCP and biopsy confirm cholangiocarcinoma (Klatskin tumour).',
    uploadedDocuments: [
      { type: 'Radiology', subcategory: 'MRI',          fileName: 'mrcp_jan2025.pdf',  uploadedAt: '28/01/2025' },
      { type: 'Pathology', subcategory: 'Biopsy Report', fileName: 'ercp_biopsy.pdf',   uploadedAt: '29/01/2025' },
    ],
    diagnosis: { cancerType: 'Cholangiocarcinoma', stage: 'Stage III', diagnosedDate: '2025-01-30', icdCode: 'C22.1' },
  },
  {
    id: 'p10', mrn: 'BO-PNP-00000003', center: 'Panipat', status: 'active' as PatientStatus,
    name: 'Sunita Patel', firstName: 'Sunita', lastName: 'Patel',
    dob: '1972-11-30', gender: 'F', registeredDate: today,
    countryCode: '+91', phone: '9876543219', phoneWhatsapp: true,
    email: 'sunita.patel@gmail.com',
    identifierType: 'aadhaar', identifierNumber: '7788 9900 1122',
    address: { line1: '90, Vishal Nagar', pincode: '132103', city: 'Panipat', district: 'Panipat', state: 'Haryana', country: 'India' },
    emergencyContact: { name: 'Dinesh Patel', relation: 'Spouse', countryCode: '+91', phone: '9876599900' },
    payor: { type: 'self' },
    referral: { source: 'opd-walk-in' },
    chiefComplaints: 'Triple-negative breast cancer — left breast lump (3.2 cm), palpable axillary lymph nodes. Core biopsy confirms TNBC. Referred for neo-adjuvant chemotherapy.',
    uploadedDocuments: [
      { type: 'Pathology', subcategory: 'Biopsy Report', fileName: 'core_biopsy_today.pdf', uploadedAt: today },
      { type: 'Radiology', subcategory: 'MRI',          fileName: 'breast_mri_today.pdf',  uploadedAt: today },
    ],
    diagnosis: { cancerType: 'Breast Carcinoma (TNBC)', stage: 'Stage IIB', diagnosedDate: today, icdCode: 'C50.9' },
  },
  {
    id: 'p11', mrn: 'BO-KRK-00000004', center: 'Kurukshetra', status: 'active' as PatientStatus,
    name: 'Mohan Rao', firstName: 'Mohan', lastName: 'Rao',
    dob: '1948-06-05', gender: 'M', registeredDate: today,
    countryCode: '+91', phone: '9876543220', phoneWhatsapp: false,
    identifierType: 'voter', identifierNumber: 'HRY5544332',
    address: { line1: '2, Pipli Road', line2: 'Near Kailash Colony', pincode: '136118', city: 'Kurukshetra', district: 'Kurukshetra', state: 'Haryana', country: 'India' },
    emergencyContact: { name: 'Savitri Rao', relation: 'Spouse', countryCode: '+91', phone: '9876500011' },
    payor: {
      type: 'corporate',
      corporate: { corporateName: 'Indian Oil Corporation', employeeName: 'Mohan Rao', employeeId: 'IOCL-RTD-45231', relationship: 'Self', tpaName: 'Paramount TPA', insuranceCompany: 'United India Insurance', policyNumber: 'UII/GRP/2025/00876', memberId: 'UII-MBR-67890', policyStartDate: '2025-04-01', policyEndDate: '2026-03-31' },
    },
    referral: { source: 'referral', referringDoctor: 'Dr. Vikram Sood', referringHospital: 'Fortis Hospital Mohali' },
    chiefComplaints: 'Multiple myeloma — bone pain (lumbar spine, ribs), normocytic anaemia, and serum protein electrophoresis showing M-protein spike. Skeletal survey confirms lytic lesions.',
    uploadedDocuments: [
      { type: 'Lab Work',  subcategory: 'Others', fileName: 'serum_electrophoresis.pdf', uploadedAt: today },
      { type: 'Radiology', subcategory: 'X-Ray', fileName: 'skeletal_survey.pdf',       uploadedAt: today },
    ],
    diagnosis: { cancerType: 'Multiple Myeloma', stage: 'Stage III', diagnosedDate: today, icdCode: 'C90.0' },
    allergies: [{ id: 'al-p11-1', allergen: 'Amoxicillin', type: 'drug', reaction: 'Rash, angioedema' }],
  },
  {
    id: 'p12', mrn: 'BO-SML-00000002', center: 'Shimla', status: 'active' as PatientStatus,
    name: 'Lakshmi Das', firstName: 'Lakshmi', lastName: 'Das',
    dob: '1961-09-18', gender: 'F', registeredDate: today,
    countryCode: '+91', phone: '9876543221', phoneWhatsapp: true,
    email: 'lakshmi.das@gmail.com',
    identifierType: 'aadhaar', identifierNumber: '3344 5566 7788',
    address: { line1: '17, Cart Road', line2: 'Lower Bazaar', pincode: '171001', city: 'Shimla', district: 'Shimla', state: 'Himachal Pradesh', country: 'India' },
    emergencyContact: { name: 'Subroto Das', relation: 'Spouse', countryCode: '+91', phone: '9876500022' },
    payor: {
      type: 'government',
      government: { schemeName: 'State Health Scheme', beneficiaryId: 'HP-SHS-2025-334455', cardNumber: 'HP-SHS-CARD-9921', issueDate: '2024-11-01' },
    },
    referral: { source: 'referral', referringDoctor: 'Dr. Priya Negi', referringHospital: 'Indira Gandhi Medical College, Shimla' },
    chiefComplaints: 'Thyroid carcinoma — right lobe nodule (2.8 cm, TIRADS 5), with palpable right level III lymph node. Fine needle aspiration cytology reports papillary thyroid carcinoma.',
    uploadedDocuments: [
      { type: 'Pathology', subcategory: 'Cytology',   fileName: 'fnac_thyroid.pdf',    uploadedAt: today },
      { type: 'Radiology', subcategory: 'Ultrasound', fileName: 'neck_ultrasound.pdf', uploadedAt: today },
    ],
    diagnosis: { cancerType: 'Papillary Thyroid Carcinoma', stage: 'Stage I', diagnosedDate: today, icdCode: 'C73' },
    allergies: [{ id: 'al-p12-1', allergen: 'Dust', type: 'environmental', reaction: 'Rhinitis, conjunctivitis' }],
  },
];

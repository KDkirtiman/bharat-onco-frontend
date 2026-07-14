export interface CountryDialCode {
  code:     string;
  name:     string;
  dialCode: string;
}

export const COUNTRY_CODES: CountryDialCode[] = [
  { code: 'IN', name: 'India',          dialCode: '+91'  },
  { code: 'US', name: 'United States',  dialCode: '+1'   },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44'  },
  { code: 'AE', name: 'UAE',            dialCode: '+971' },
  { code: 'SA', name: 'Saudi Arabia',   dialCode: '+966' },
  { code: 'SG', name: 'Singapore',      dialCode: '+65'  },
  { code: 'AU', name: 'Australia',      dialCode: '+61'  },
  { code: 'CA', name: 'Canada',         dialCode: '+1'   },
  { code: 'NZ', name: 'New Zealand',    dialCode: '+64'  },
  { code: 'DE', name: 'Germany',        dialCode: '+49'  },
  { code: 'FR', name: 'France',         dialCode: '+33'  },
  { code: 'JP', name: 'Japan',          dialCode: '+81'  },
  { code: 'CN', name: 'China',          dialCode: '+86'  },
  { code: 'MY', name: 'Malaysia',       dialCode: '+60'  },
  { code: 'QA', name: 'Qatar',          dialCode: '+974' },
  { code: 'KW', name: 'Kuwait',         dialCode: '+965' },
  { code: 'BH', name: 'Bahrain',        dialCode: '+973' },
  { code: 'OM', name: 'Oman',           dialCode: '+968' },
  { code: 'NP', name: 'Nepal',          dialCode: '+977' },
  { code: 'BD', name: 'Bangladesh',     dialCode: '+880' },
  { code: 'LK', name: 'Sri Lanka',      dialCode: '+94'  },
  { code: 'PK', name: 'Pakistan',       dialCode: '+92'  },
  { code: 'ZA', name: 'South Africa',   dialCode: '+27'  },
  { code: 'NG', name: 'Nigeria',        dialCode: '+234' },
  { code: 'KE', name: 'Kenya',          dialCode: '+254' },
];

export interface PincodeData {
  city:     string;
  district: string;
  state:    string;
}

export const PINCODE_LOOKUP: Record<string, PincodeData> = {
  // Kurukshetra
  '136118': { city: 'Kurukshetra', district: 'Kurukshetra', state: 'Haryana'          },
  '136119': { city: 'Kurukshetra', district: 'Kurukshetra', state: 'Haryana'          },
  '136120': { city: 'Kurukshetra', district: 'Kurukshetra', state: 'Haryana'          },
  '136128': { city: 'Kurukshetra', district: 'Kurukshetra', state: 'Haryana'          },
  '136130': { city: 'Kurukshetra', district: 'Kurukshetra', state: 'Haryana'          },
  // Panipat
  '132103': { city: 'Panipat',     district: 'Panipat',     state: 'Haryana'          },
  '132104': { city: 'Panipat',     district: 'Panipat',     state: 'Haryana'          },
  '132105': { city: 'Panipat',     district: 'Panipat',     state: 'Haryana'          },
  '132107': { city: 'Panipat',     district: 'Panipat',     state: 'Haryana'          },
  '132140': { city: 'Panipat',     district: 'Panipat',     state: 'Haryana'          },
  // Shimla
  '171001': { city: 'Shimla',      district: 'Shimla',      state: 'Himachal Pradesh' },
  '171002': { city: 'Shimla',      district: 'Shimla',      state: 'Himachal Pradesh' },
  '171003': { city: 'Shimla',      district: 'Shimla',      state: 'Himachal Pradesh' },
  '171004': { city: 'Shimla',      district: 'Shimla',      state: 'Himachal Pradesh' },
  '171006': { city: 'Shimla',      district: 'Shimla',      state: 'Himachal Pradesh' },
  // Una
  '174303': { city: 'Una',         district: 'Una',          state: 'Himachal Pradesh' },
  '174304': { city: 'Una',         district: 'Una',          state: 'Himachal Pradesh' },
  '174305': { city: 'Una',         district: 'Una',          state: 'Himachal Pradesh' },
  '174306': { city: 'Una',         district: 'Una',          state: 'Himachal Pradesh' },
  '174307': { city: 'Una',         district: 'Una',          state: 'Himachal Pradesh' },
  // Deoria
  '274001': { city: 'Deoria',      district: 'Deoria',       state: 'Uttar Pradesh'    },
  '274002': { city: 'Deoria',      district: 'Deoria',       state: 'Uttar Pradesh'    },
  '274003': { city: 'Deoria',      district: 'Deoria',       state: 'Uttar Pradesh'    },
  '274201': { city: 'Deoria',      district: 'Deoria',       state: 'Uttar Pradesh'    },
  '274202': { city: 'Deoria',      district: 'Deoria',       state: 'Uttar Pradesh'    },
};

export const COUNTRIES: string[] = [
  'Afghanistan', 'Australia', 'Bahrain', 'Bangladesh', 'Canada', 'China',
  'Egypt', 'France', 'Germany', 'India', 'Indonesia', 'Iran', 'Iraq',
  'Israel', 'Italy', 'Japan', 'Jordan', 'Kenya', 'Kuwait', 'Malaysia',
  'Maldives', 'Myanmar', 'Nepal', 'Netherlands', 'New Zealand', 'Nigeria',
  'Oman', 'Pakistan', 'Philippines', 'Qatar', 'Russia', 'Saudi Arabia',
  'Singapore', 'South Africa', 'South Korea', 'Spain', 'Sri Lanka',
  'Sweden', 'Switzerland', 'Thailand', 'Turkey', 'UAE', 'Uganda',
  'Ukraine', 'United Kingdom', 'United States', 'Vietnam', 'Yemen',
];

export const GOVT_SCHEMES = [
  'PM-JAY (Ayushman Bharat)',
  'CGHS',
  'ESIC',
  'ECHS',
  'State Health Scheme',
  'Other Government Scheme',
] as const;

export interface MedicalRecordCategory {
  category:      string;
  subcategories: string[];
}

export const MEDICAL_RECORD_CATEGORIES: MedicalRecordCategory[] = [
  {
    category: 'Lab Work',
    subcategories: ['CBC', 'LFT', 'RFT', 'Tumour Markers', 'Coagulation Profile', 'Urinalysis', 'Others'],
  },
  {
    category: 'Radiology',
    subcategories: ['CT Scan', 'MRI', 'PET-CT', 'X-Ray', 'Ultrasound', 'Others'],
  },
  {
    category: 'Pathology',
    subcategories: ['Biopsy Report', 'Histopathology', 'Cytology', 'IHC Report', 'Others'],
  },
  {
    category: 'Molecular Testing',
    subcategories: ['BRCA', 'EGFR', 'ALK/ROS1', 'MSI/MMR', 'NGS Panel', 'Others'],
  },
  {
    category: 'External Medical Records',
    subcategories: ['Discharge Summary', 'OPD Notes', 'Prescription', 'Others'],
  },
  {
    category: 'Others',
    subcategories: ['Consent Form', 'Insurance Document', 'Others'],
  },
];

export const IDENTIFIER_TYPES = [
  { value: 'aadhaar',             label: 'Aadhaar Card',       isInternational: false },
  { value: 'pan',                 label: 'PAN Card',            isInternational: false },
  { value: 'voter',               label: 'Voter ID',            isInternational: false },
  { value: 'driving',             label: 'Driving License',     isInternational: false },
  { value: 'passport',            label: 'Passport',            isInternational: true  },
  { value: 'oci',                 label: 'OCI Card',            isInternational: true  },
  { value: 'foreign-national-id', label: 'Foreign National ID', isInternational: true  },
] as const;

export const RELATIONS = [
  'Spouse', 'Parent', 'Child', 'Sibling',
  'Grandparent', 'Grandchild', 'Friend',
  'Colleague', 'Guardian', 'Other',
] as const;

export const COMORBIDITY_OPTIONS: string[] = [
  'Hypertension',
  'Diabetes Mellitus',
  'Coronary Artery Disease',
  'Chronic Kidney Disease',
  'Thyroid Disease',
];

export const OCCUPATION_OPTIONS: string[] = [
  'Agriculture / Farming',
  'IT / Software',
  'Industrial / Factory Work',
  'Healthcare / Medical',
  'Construction / Civil Engineering',
  'Education / Teaching',
  'Finance / Banking',
  'Retail / Trade',
  'Transport / Logistics',
  'Mining / Quarrying',
  'Chemical / Pharmaceutical',
  'Textile / Garment',
  'Government / Public Sector',
  'Homemaker',
  'Retired',
  'Other',
];

export const SOCIAL_STATUS_OPTIONS: string[] = [
  'Never',
  'Occasional',
  'Regular',
  'Former User',
  'Current User',
];

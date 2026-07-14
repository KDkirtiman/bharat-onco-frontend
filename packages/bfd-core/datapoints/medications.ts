export interface MedicationEntry {
  name:  string;
  doses: string[];
}

export const MEDICATION_CATALOGUE: MedicationEntry[] = [
  { name: 'Paracetamol',          doses: ['500mg', '650mg', '1000mg'] },
  { name: 'Ondansetron',          doses: ['4mg', '8mg'] },
  { name: 'Dexamethasone',        doses: ['4mg', '8mg', '12mg', '16mg'] },
  { name: 'Metoclopramide',       doses: ['10mg'] },
  { name: 'Pantoprazole',         doses: ['20mg', '40mg'] },
  { name: 'Omeprazole',           doses: ['20mg', '40mg'] },
  { name: 'Domperidone',          doses: ['10mg'] },
  { name: 'Tramadol',             doses: ['50mg', '100mg'] },
  { name: 'Morphine',             doses: ['10mg', '15mg', '30mg'] },
  { name: 'Gabapentin',           doses: ['100mg', '300mg', '600mg'] },
  { name: 'Amoxicillin',          doses: ['250mg', '500mg'] },
  { name: 'Ciprofloxacin',        doses: ['250mg', '500mg', '750mg'] },
  { name: 'Co-trimoxazole',       doses: ['480mg', '960mg'] },
  { name: 'Fluconazole',          doses: ['50mg', '150mg', '200mg'] },
  { name: 'Prednisolone',         doses: ['5mg', '10mg', '20mg', '40mg'] },
  { name: 'Methylprednisolone',   doses: ['4mg', '8mg', '16mg', '40mg'] },
  { name: 'Ibuprofen',            doses: ['200mg', '400mg', '600mg'] },
  { name: 'Diclofenac',           doses: ['25mg', '50mg'] },
  { name: 'Aspirin',              doses: ['75mg', '150mg', '325mg'] },
  { name: 'Folic Acid',           doses: ['1mg', '5mg'] },
  { name: 'Vitamin D3',           doses: ['1000 IU', '2000 IU', '60000 IU'] },
  { name: 'Calcium Carbonate',    doses: ['500mg', '1000mg'] },
  { name: 'Metformin',            doses: ['500mg', '850mg', '1000mg'] },
  { name: 'Atorvastatin',         doses: ['10mg', '20mg', '40mg'] },
  { name: 'Amlodipine',           doses: ['5mg', '10mg'] },
  { name: 'Spironolactone',       doses: ['25mg', '50mg', '100mg'] },
  { name: 'Ranitidine',           doses: ['150mg', '300mg'] },
  { name: 'Lorazepam',            doses: ['0.5mg', '1mg', '2mg'] },
  { name: 'Filgrastim (G-CSF)',   doses: ['300mcg', '480mcg'] },
  { name: 'Zoledronic Acid',      doses: ['4mg'] },
  { name: 'Granisetron',          doses: ['1mg', '2mg'] },
  { name: 'Aprepitant',           doses: ['80mg', '125mg'] },
  { name: 'Other (free text)',    doses: [] },
];

export const FREQUENCY_OPTIONS: string[] = [
  'Once daily',
  'Twice daily',
  'Three times daily',
  'Four times daily',
  'Every 6 hours',
  'Every 8 hours',
  'As needed (SOS)',
  'Weekly',
  'Fortnightly',
  'Monthly',
];

export const FOOD_TIMING_OPTIONS: string[] = [
  'Before food',
  'After food',
  'With food',
  'Empty stomach',
];

export const TIME_OF_DAY_OPTIONS: string[] = [
  'Morning',
  'Afternoon',
  'Evening',
  'Night',
  'Morning & Night',
  'Morning, Afternoon & Night',
];

export interface MedicationOrderSet {
  medicineName:     string;
  dose:             string;
  frequency:        string;
  duration:         string;
  numberOfDays?:    string;
  beforeAfterFood?: string;
  instructions?:    string;
}

export const MEDICATION_ORDER_SETS: MedicationOrderSet[] = [
  { medicineName: 'Paracetamol',         dose: '650mg',    frequency: 'Three times daily', duration: '5 days',   numberOfDays: '5',  beforeAfterFood: 'After food' },
  { medicineName: 'Ondansetron',         dose: '8mg',      frequency: 'Three times daily', duration: '5 days',   numberOfDays: '5',  beforeAfterFood: 'Before food', instructions: 'Anti-emetic' },
  { medicineName: 'Dexamethasone',       dose: '8mg',      frequency: 'Once daily',        duration: '5 days',   numberOfDays: '5',  beforeAfterFood: 'After food' },
  { medicineName: 'Metoclopramide',      dose: '10mg',     frequency: 'Three times daily', duration: '5 days',   numberOfDays: '5',  beforeAfterFood: 'Before food' },
  { medicineName: 'Pantoprazole',        dose: '40mg',     frequency: 'Once daily',        duration: '30 days',  numberOfDays: '30', beforeAfterFood: 'Before food', instructions: 'Morning, empty stomach' },
  { medicineName: 'Domperidone',         dose: '10mg',     frequency: 'Three times daily', duration: '5 days',   numberOfDays: '5',  beforeAfterFood: 'Before food' },
  { medicineName: 'Tramadol',            dose: '50mg',     frequency: 'Three times daily', duration: '5 days',   numberOfDays: '5',  beforeAfterFood: 'After food' },
  { medicineName: 'Morphine',            dose: '10mg',     frequency: 'Twice daily',       duration: '3 days',   numberOfDays: '3',  beforeAfterFood: 'After food' },
  { medicineName: 'Gabapentin',          dose: '300mg',    frequency: 'Twice daily',       duration: '30 days',  numberOfDays: '30', beforeAfterFood: 'After food', instructions: 'Neuropathic pain' },
  { medicineName: 'Amoxicillin',         dose: '500mg',    frequency: 'Three times daily', duration: '7 days',   numberOfDays: '7',  beforeAfterFood: 'After food' },
  { medicineName: 'Ciprofloxacin',       dose: '500mg',    frequency: 'Twice daily',       duration: '5 days',   numberOfDays: '5',  beforeAfterFood: 'After food' },
  { medicineName: 'Co-trimoxazole',      dose: '960mg',    frequency: 'Twice daily',       duration: '7 days',   numberOfDays: '7',  beforeAfterFood: 'After food', instructions: 'Prophylaxis' },
  { medicineName: 'Fluconazole',         dose: '150mg',    frequency: 'Once daily',        duration: '7 days',   numberOfDays: '7',  beforeAfterFood: 'After food', instructions: 'Antifungal' },
  { medicineName: 'Prednisolone',        dose: '40mg',     frequency: 'Once daily',        duration: '5 days',   numberOfDays: '5',  beforeAfterFood: 'After food' },
  { medicineName: 'Methylprednisolone',  dose: '40mg',     frequency: 'Once daily',        duration: '3 days',   numberOfDays: '3',  beforeAfterFood: 'After food' },
  { medicineName: 'Ibuprofen',           dose: '400mg',    frequency: 'Three times daily', duration: '5 days',   numberOfDays: '5',  beforeAfterFood: 'After food' },
  { medicineName: 'Diclofenac',          dose: '50mg',     frequency: 'Twice daily',       duration: '5 days',   numberOfDays: '5',  beforeAfterFood: 'After food' },
  { medicineName: 'Aspirin',             dose: '75mg',     frequency: 'Once daily',        duration: '30 days',  numberOfDays: '30', beforeAfterFood: 'After food' },
  { medicineName: 'Folic Acid',          dose: '5mg',      frequency: 'Once daily',        duration: '30 days',  numberOfDays: '30', beforeAfterFood: 'After food' },
  { medicineName: 'Vitamin D3',          dose: '60000 IU', frequency: 'Weekly',            duration: '12 weeks', numberOfDays: '12', beforeAfterFood: 'After food' },
  { medicineName: 'Calcium Carbonate',   dose: '500mg',    frequency: 'Twice daily',       duration: '30 days',  numberOfDays: '30', beforeAfterFood: 'After food' },
  { medicineName: 'Metformin',           dose: '500mg',    frequency: 'Twice daily',       duration: '30 days',  numberOfDays: '30', beforeAfterFood: 'After food' },
  { medicineName: 'Atorvastatin',        dose: '20mg',     frequency: 'Once daily',        duration: '30 days',  numberOfDays: '30', beforeAfterFood: 'After food', instructions: 'Bedtime' },
  { medicineName: 'Amlodipine',          dose: '5mg',      frequency: 'Once daily',        duration: '30 days',  numberOfDays: '30', beforeAfterFood: 'After food' },
  { medicineName: 'Spironolactone',      dose: '25mg',     frequency: 'Once daily',        duration: '30 days',  numberOfDays: '30', beforeAfterFood: 'After food' },
  { medicineName: 'Ranitidine',          dose: '150mg',    frequency: 'Twice daily',       duration: '30 days',  numberOfDays: '30', beforeAfterFood: 'Before food' },
  { medicineName: 'Lorazepam',           dose: '1mg',      frequency: 'Once daily',        duration: '3 days',   numberOfDays: '3',  beforeAfterFood: 'Before food', instructions: 'Anxiolytic — before bed' },
  { medicineName: 'Aprepitant',          dose: '125mg',    frequency: 'Once daily',        duration: '3 days',   numberOfDays: '3',  beforeAfterFood: 'Before food', instructions: 'Day 1: 125mg; Days 2–3: 80mg; NK1 antagonist' },
  { medicineName: 'Ondansetron',         dose: '4mg',      frequency: 'Twice daily',       duration: '3 days',   numberOfDays: '3',  beforeAfterFood: 'Before food', instructions: 'Low dose / paediatric' },
];

export const INJECTION_ORDER_SETS: MedicationOrderSet[] = [
  { medicineName: 'Ondansetron',         dose: '8mg',   frequency: 'Three times daily', duration: '3 days',   numberOfDays: '3',  instructions: 'IV slow push over 15 min; anti-emetic' },
  { medicineName: 'Dexamethasone',       dose: '8mg',   frequency: 'Once daily',        duration: '3 days',   numberOfDays: '3',  instructions: 'IV push; anti-emetic / anti-inflammatory' },
  { medicineName: 'Metoclopramide',      dose: '10mg',  frequency: 'Three times daily', duration: '5 days',   numberOfDays: '5',  instructions: 'IV push; anti-emetic' },
  { medicineName: 'Granisetron',         dose: '1mg',   frequency: 'Twice daily',       duration: '5 days',   numberOfDays: '5',  instructions: 'IV; post-chemo anti-emetic' },
  { medicineName: 'Filgrastim (G-CSF)', dose: '300mcg', frequency: 'Once daily',        duration: '5 days',   numberOfDays: '5',  instructions: 'SC injection; bone marrow support — start 24 hrs post-chemo' },
  { medicineName: 'Zoledronic Acid',     dose: '4mg',   frequency: 'Monthly',           duration: '1 dose',   numberOfDays: '1',  instructions: 'IV infusion over 15 min in 100 mL NS; bone metastasis — pre-hydrate' },
  { medicineName: 'Furosemide',          dose: '20mg',  frequency: 'Once daily',        duration: '5 days',   numberOfDays: '5',  instructions: 'IV; diuresis / fluid management' },
  { medicineName: 'Pantoprazole',        dose: '40mg',  frequency: 'Once daily',        duration: '7 days',   numberOfDays: '7',  instructions: 'IV push; PPI — switch to oral when tolerating PO' },
  { medicineName: 'Tranexamic Acid',     dose: '500mg', frequency: 'Three times daily', duration: '5 days',   numberOfDays: '5',  instructions: 'IV infusion over 10 min; haemostasis' },
];

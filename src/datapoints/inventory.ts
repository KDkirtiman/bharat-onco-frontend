import type { ExpenseCategory } from './billing';

export type InventoryCategory =
  | 'drugs'
  | 'chemotherapy-agents'
  | 'consumables'
  | 'equipment'
  | 'diagnostic-supplies'
  | 'protective-equipment'
  | 'linen';

export const INVENTORY_CATEGORY_LABELS: Record<InventoryCategory, string> = {
  'drugs':                'Drugs & Medications',
  'chemotherapy-agents':  'Chemotherapy Agents',
  'consumables':          'Consumables',
  'equipment':            'Equipment',
  'diagnostic-supplies':  'Diagnostic Supplies',
  'protective-equipment': 'Protective Equipment',
  'linen':                'Linen & Housekeeping',
};

export const INVENTORY_CATEGORY_COLORS: Record<InventoryCategory, string> = {
  'drugs':                'bg-blue-100 text-blue-700',
  'chemotherapy-agents':  'bg-purple-100 text-purple-700',
  'consumables':          'bg-cyan-100 text-cyan-700',
  'equipment':            'bg-orange-100 text-orange-700',
  'diagnostic-supplies':  'bg-teal-100 text-teal-700',
  'protective-equipment': 'bg-green-100 text-green-700',
  'linen':                'bg-muted text-muted-foreground',
};

export const INVENTORY_TO_EXPENSE_CATEGORY: Record<InventoryCategory, ExpenseCategory> = {
  'drugs':                'drugs',
  'chemotherapy-agents':  'drugs',
  'consumables':          'consumables',
  'equipment':            'equipment',
  'diagnostic-supplies':  'lab-supplies',
  'protective-equipment': 'consumables',
  'linen':                'miscellaneous',
};

export interface InventoryItem {
  id:            string;
  name:          string;
  category:      InventoryCategory;
  quantity:      number;
  reorderLevel:  number;
  expiryDate:    string;
  batchNumber:   string;
  orderDate:     string;
  costToCompany: number;
  costToPatient: number;
  supplier:      string;
  center:        string;
}

export type StockStatus = 'in-stock' | 'low-stock' | 'out-of-stock';

export function getStockStatus(item: InventoryItem): StockStatus {
  if (item.quantity === 0) return 'out-of-stock';
  if (item.quantity <= item.reorderLevel) return 'low-stock';
  return 'in-stock';
}

export const STOCK_STATUS_LABELS: Record<StockStatus, string> = {
  'in-stock':     'In Stock',
  'low-stock':    'Low Stock',
  'out-of-stock': 'Out of Stock',
};

export const STOCK_STATUS_COLORS: Record<StockStatus, string> = {
  'in-stock':     'bg-green-100 text-green-700',
  'low-stock':    'bg-amber-100 text-amber-700',
  'out-of-stock': 'bg-destructive/10 text-destructive',
};

// ── Mock Inventory Items ──────────────────────────────────────────────────────

export const mockInventoryItems: InventoryItem[] = [
  // ── Kurukshetra (6) ──────────────────────────────────────────────────────────
  {
    id: 'INV-KRK-00001', name: 'Ondansetron 8mg Tablet',
    category: 'drugs', quantity: 12, reorderLevel: 20,
    expiryDate: '2026-08-15', batchNumber: 'BATCH-OND-2025-0442',
    orderDate: '2025-11-20', costToCompany: 45, costToPatient: 75,
    supplier: 'Sun Pharma', center: 'Kurukshetra',
  },
  {
    id: 'INV-KRK-00002', name: 'Cisplatin 50mg/vial',
    category: 'chemotherapy-agents', quantity: 48, reorderLevel: 10,
    expiryDate: '2026-12-01', batchNumber: 'BATCH-CIS-2025-1102',
    orderDate: '2026-01-10', costToCompany: 3200, costToPatient: 4500,
    supplier: 'Dr. Reddy\'s Laboratories', center: 'Kurukshetra',
  },
  {
    id: 'INV-KRK-00003', name: 'Paclitaxel 30mg/5ml Injection',
    category: 'chemotherapy-agents', quantity: 6, reorderLevel: 8,
    expiryDate: '2026-09-30', batchNumber: 'BATCH-PAC-2025-0819',
    orderDate: '2025-12-05', costToCompany: 2800, costToPatient: 3800,
    supplier: 'Cipla Ltd.', center: 'Kurukshetra',
  },
  {
    id: 'INV-KRK-00004', name: 'IV Cannula 20G (box of 50)',
    category: 'consumables', quantity: 0, reorderLevel: 100,
    expiryDate: '2027-06-30', batchNumber: 'BATCH-IVC-2025-3301',
    orderDate: '2025-10-12', costToCompany: 8, costToPatient: 15,
    supplier: 'Becton Dickinson India', center: 'Kurukshetra',
  },
  {
    id: 'INV-KRK-00005', name: 'Disposable Exam Gloves (box of 100)',
    category: 'protective-equipment', quantity: 45, reorderLevel: 30,
    expiryDate: '2027-12-31', batchNumber: 'BATCH-GLV-2026-0110',
    orderDate: '2026-02-01', costToCompany: 220, costToPatient: 0,
    supplier: '3M India', center: 'Kurukshetra',
  },
  {
    id: 'INV-KRK-00006', name: 'CBC Test Kit (pack of 50)',
    category: 'diagnostic-supplies', quantity: 28, reorderLevel: 15,
    expiryDate: '2026-10-15', batchNumber: 'BATCH-CBC-2025-0922',
    orderDate: '2025-12-20', costToCompany: 180, costToPatient: 280,
    supplier: 'Sysmex India', center: 'Kurukshetra',
  },
  // ── Panipat (4) ──────────────────────────────────────────────────────────────
  {
    id: 'INV-PNP-00001', name: 'Ondansetron 4mg Tablet',
    category: 'drugs', quantity: 80, reorderLevel: 30,
    expiryDate: '2026-11-20', batchNumber: 'BATCH-OND4-2025-0618',
    orderDate: '2026-01-15', costToCompany: 28, costToPatient: 50,
    supplier: 'Sun Pharma', center: 'Panipat',
  },
  {
    id: 'INV-PNP-00002', name: 'Gemcitabine 200mg Powder',
    category: 'chemotherapy-agents', quantity: 3, reorderLevel: 5,
    expiryDate: '2026-07-31', batchNumber: 'BATCH-GEM-2025-1130',
    orderDate: '2025-11-30', costToCompany: 4500, costToPatient: 6000,
    supplier: 'Fresenius Kabi India', center: 'Panipat',
  },
  {
    id: 'INV-PNP-00003', name: 'IV Infusion Set (box of 25)',
    category: 'consumables', quantity: 200, reorderLevel: 100,
    expiryDate: '2028-01-01', batchNumber: 'BATCH-IVS-2026-0201',
    orderDate: '2026-02-01', costToCompany: 35, costToPatient: 60,
    supplier: 'Baxter Healthcare India', center: 'Panipat',
  },
  {
    id: 'INV-PNP-00004', name: 'Surgical Mask N95 (box of 50)',
    category: 'protective-equipment', quantity: 8, reorderLevel: 20,
    expiryDate: '2027-05-31', batchNumber: 'BATCH-MSK-2025-0405',
    orderDate: '2025-10-05', costToCompany: 520, costToPatient: 0,
    supplier: '3M India', center: 'Panipat',
  },
  // ── Shimla (4) ───────────────────────────────────────────────────────────────
  {
    id: 'INV-SML-00001', name: 'Dexamethasone 4mg Tablet',
    category: 'drugs', quantity: 55, reorderLevel: 25,
    expiryDate: '2027-02-28', batchNumber: 'BATCH-DEX-2026-0120',
    orderDate: '2026-01-20', costToCompany: 12, costToPatient: 20,
    supplier: 'Cipla Ltd.', center: 'Shimla',
  },
  {
    id: 'INV-SML-00002', name: 'Carboplatin 150mg/15ml Injection',
    category: 'chemotherapy-agents', quantity: 0, reorderLevel: 6,
    expiryDate: '2026-09-15', batchNumber: 'BATCH-CAR-2025-0712',
    orderDate: '2025-12-10', costToCompany: 5500, costToPatient: 7200,
    supplier: 'Dr. Reddy\'s Laboratories', center: 'Shimla',
  },
  {
    id: 'INV-SML-00003', name: 'Urine Dipstick Test Strip (pack of 100)',
    category: 'diagnostic-supplies', quantity: 3, reorderLevel: 10,
    expiryDate: '2026-08-31', batchNumber: 'BATCH-URS-2025-0901',
    orderDate: '2025-11-01', costToCompany: 95, costToPatient: 150,
    supplier: 'Roche Diagnostics India', center: 'Shimla',
  },
  {
    id: 'INV-SML-00004', name: 'Hospital Bed Sheet Set',
    category: 'linen', quantity: 40, reorderLevel: 20,
    expiryDate: '2030-01-01', batchNumber: 'BATCH-LIN-2025-0301',
    orderDate: '2025-09-01', costToCompany: 350, costToPatient: 0,
    supplier: 'Wipro Healthcare', center: 'Shimla',
  },
  // ── Una (4) ──────────────────────────────────────────────────────────────────
  {
    id: 'INV-UNA-00001', name: 'Tramadol 50mg Tablet',
    category: 'drugs', quantity: 120, reorderLevel: 50,
    expiryDate: '2027-01-31', batchNumber: 'BATCH-TRA-2026-0105',
    orderDate: '2026-01-05', costToCompany: 18, costToPatient: 30,
    supplier: 'Cipla Ltd.', center: 'Una',
  },
  {
    id: 'INV-UNA-00002', name: '5-Fluorouracil 250mg/10ml Injection',
    category: 'chemotherapy-agents', quantity: 18, reorderLevel: 10,
    expiryDate: '2026-10-20', batchNumber: 'BATCH-5FU-2025-1020',
    orderDate: '2026-01-20', costToCompany: 1800, costToPatient: 2500,
    supplier: 'Fresenius Kabi India', center: 'Una',
  },
  {
    id: 'INV-UNA-00003', name: 'Syringe 5ml (box of 100)',
    category: 'consumables', quantity: 15, reorderLevel: 100,
    expiryDate: '2028-06-30', batchNumber: 'BATCH-SYR-2025-0820',
    orderDate: '2025-10-20', costToCompany: 4, costToPatient: 0,
    supplier: 'Becton Dickinson India', center: 'Una',
  },
  {
    id: 'INV-UNA-00004', name: 'Smart Infusion Pump',
    category: 'equipment', quantity: 0, reorderLevel: 1,
    expiryDate: '2033-12-31', batchNumber: 'BATCH-IFP-2022-0012',
    orderDate: '2022-06-15', costToCompany: 85000, costToPatient: 0,
    supplier: 'Baxter Healthcare India', center: 'Una',
  },
  // ── Deoria (4) ───────────────────────────────────────────────────────────────
  {
    id: 'INV-DRA-00001', name: 'Metoclopramide 10mg Tablet',
    category: 'drugs', quantity: 200, reorderLevel: 60,
    expiryDate: '2027-03-15', batchNumber: 'BATCH-MET-2026-0218',
    orderDate: '2026-02-18', costToCompany: 8, costToPatient: 15,
    supplier: 'Sun Pharma', center: 'Deoria',
  },
  {
    id: 'INV-DRA-00002', name: 'Docetaxel 20mg/vial',
    category: 'chemotherapy-agents', quantity: 5, reorderLevel: 4,
    expiryDate: '2026-11-30', batchNumber: 'BATCH-DOC-2025-1115',
    orderDate: '2026-02-15', costToCompany: 3800, costToPatient: 5200,
    supplier: 'Sanofi India', center: 'Deoria',
  },
  {
    id: 'INV-DRA-00003', name: 'IV Line Set (box of 50)',
    category: 'consumables', quantity: 60, reorderLevel: 80,
    expiryDate: '2028-03-31', batchNumber: 'BATCH-IVL-2025-1201',
    orderDate: '2025-12-01', costToCompany: 42, costToPatient: 70,
    supplier: 'Baxter Healthcare India', center: 'Deoria',
  },
  {
    id: 'INV-DRA-00004', name: 'Blood Glucose Monitor',
    category: 'diagnostic-supplies', quantity: 2, reorderLevel: 1,
    expiryDate: '2030-01-01', batchNumber: 'BATCH-BGM-2024-0401',
    orderDate: '2024-04-01', costToCompany: 1800, costToPatient: 0,
    supplier: 'Roche Diagnostics India', center: 'Deoria',
  },
];

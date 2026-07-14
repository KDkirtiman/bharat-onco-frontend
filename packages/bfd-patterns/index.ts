export * from 'bfd-core';
// Patterns — scheduling
export {
  BookAppointmentOverlay,
  QuickScheduleOverlay,
  RescheduleOverlay,
  CancelOverlay,
  ViewDetailsOverlay,
  ChairAssignmentOverlay,
  SendReminderOverlay,
  ReminderDetailsOverlay,
  AppointmentCard,
  VisitAlertsCard,
} from './patterns/scheduling';
export type { RescheduleFormData } from './patterns/scheduling';

// Patterns — billing
export {
  GenerateInvoiceOverlay,
  GenerateFullInvoiceOverlay,
  ViewInvoiceOverlay,
} from './patterns/billing';
export type { GenerateInvoiceFormData } from './patterns/billing';

// Patterns — clinical
export {
  PrescriptionViewerOverlay,
  PatientRegistrationOverlay,
  OncologistReferencePanel,
  AddStagingOverlay,
  AddTreatmentPlanOverlay,
  AddToxicityOverlay,
  AddResponseAssessmentOverlay,
  LogDeliveryOverlay,
  CycleDetailOverlay,
  PastVisitDetailOverlay,
  UploadDocumentOverlay,
  DocumentViewerOverlay,
  AdverseEventLogOverlay,
} from './patterns/clinical';

// Patient shell & tabs
export { PatientHeaderCard } from './patient/PatientHeaderCard';
export { PatientTabs } from './patient/PatientTabs';
export type { TabId } from './patient/PatientTabs';
export { OverviewTab } from './patient/OverviewTab';
export { PastVisitsTab } from './patient/PastVisitsTab';
export { MedicalRecordsTab } from './patient/MedicalRecordsTab';
export { CancerStagingTab } from './patient/CancerStagingTab';
export { TreatmentPlanTab } from './patient/TreatmentPlanTab';
export { TreatmentDeliveryTab } from './patient/TreatmentDeliveryTab';
export { ResponseAssessmentTab } from './patient/ResponseAssessmentTab';
export { ToxicityTab } from './patient/ToxicityTab';
export { SurvivorshipTab } from './patient/SurvivorshipTab';
export { RecurrenceTab } from './patient/RecurrenceTab';
export { PalliativeCareTab } from './patient/PalliativeCareTab';
export { BillingTab } from './patient/BillingTab';
export { ClinicVisitTab } from './patient/ClinicVisitTab';
export { CostEstimationSubTab } from './patient/CostEstimationSubTab';
export { PastInvoicesSubTab } from './patient/PastInvoicesSubTab';
export { InsuranceClaimsSubTab } from './patient/InsuranceClaimsSubTab';
export { PaymentDetailsSubTab } from './patient/PaymentDetailsSubTab';

// Utilities
export {
  generateInvoiceHTML,
  printInvoice,
  downloadInvoice,
  generateRegistrationReceiptHTML,
  printRegistrationReceipt,
} from './lib/invoiceTemplate';
export type { InvoiceParams } from './lib/invoiceTemplate';


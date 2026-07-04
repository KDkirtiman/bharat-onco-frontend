// Controls — interactive primitives
export {
  Button,
  IconButton,
  Input,
  TextField,
  Textarea,
  Select,
  Checkbox,
  DatePicker,
  FormField,
  SearchCombobox,
  FilterToggle,
} from './components/controls';
export type { SelectOption, SearchComboboxItem, FilterToggleOption } from './components/controls';

// Feedback — status & messaging
export { StatusBadge, Callout, EmptyState, ResultState } from './components/feedback';
export type { CalloutVariant } from './components/feedback';

// Data display — presentational
export { Avatar, KPICard } from './components/data-display';

// Layout — structural chrome & overlay shell
export {
  AppLayout,
  Header,
  Sidebar,
  defaultNavByRole,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from './components/layout';
export type { SidebarNavItem, ModalSize } from './components/layout';

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
export { PatientHeaderCard } from './components/patient/PatientHeaderCard';
export { PatientTabs } from './components/patient/PatientTabs';
export type { TabId } from './components/patient/PatientTabs';
export { OverviewTab } from './components/patient/OverviewTab';
export { PastVisitsTab } from './components/patient/PastVisitsTab';
export { MedicalRecordsTab } from './components/patient/MedicalRecordsTab';
export { CancerStagingTab } from './components/patient/CancerStagingTab';
export { TreatmentPlanTab } from './components/patient/TreatmentPlanTab';
export { TreatmentDeliveryTab } from './components/patient/TreatmentDeliveryTab';
export { ResponseAssessmentTab } from './components/patient/ResponseAssessmentTab';
export { ToxicityTab } from './components/patient/ToxicityTab';
export { SurvivorshipTab } from './components/patient/SurvivorshipTab';
export { RecurrenceTab } from './components/patient/RecurrenceTab';
export { PalliativeCareTab } from './components/patient/PalliativeCareTab';
export { BillingTab } from './components/patient/BillingTab';
export { ClinicVisitTab } from './components/patient/ClinicVisitTab';
export { CostEstimationSubTab } from './components/patient/CostEstimationSubTab';
export { PastInvoicesSubTab } from './components/patient/PastInvoicesSubTab';
export { InsuranceClaimsSubTab } from './components/patient/InsuranceClaimsSubTab';
export { PaymentDetailsSubTab } from './components/patient/PaymentDetailsSubTab';

// Utilities
export { cn } from './lib/cn';
export {
  localToday,
  fmtDate,
  fmtDateShort,
  formatTime,
  calcAge,
} from './lib/formatters';
export {
  generateInvoiceHTML,
  printInvoice,
  downloadInvoice,
  generateRegistrationReceiptHTML,
  printRegistrationReceipt,
} from './lib/invoiceTemplate';
export type { InvoiceParams } from './lib/invoiceTemplate';

// Domain types & constants — auth
export type { Role, User, Notification } from './datapoints/auth';
export { mockUsers, mockNotifications } from './datapoints/auth';

// Domain types & constants — scheduling
export type {
  AppointmentStatus,
  AppointmentType,
  PaymentType,
  PaymentStatus,
  SelfPayMethod,
  Center,
  Doctor,
  ScheduleFormData,
  Appointment,
  VisitAlert,
} from './datapoints/scheduling';
export {
  APPOINTMENT_TYPE_LABELS,
  STATUS_LABELS,
  PAYMENT_TYPE_LABELS,
  PAYMENT_STATUS_LABELS,
  SELF_PAY_METHOD_LABELS,
  CENTERS,
  APPOINTMENT_STATUS_CONFIG,
  CENTER_INITIALS,
  getPrimaryActionLabel,
  generateTimeSlots,
  generateVisitId,
  mockDoctors,
  mockVisitAlerts,
  mockAppointments,
} from './datapoints/scheduling';

// Domain types & constants — patients
export type { Patient } from './datapoints/patients';
export { PAYOR_TYPE_LABELS, mockPatients } from './datapoints/patients';

// Domain types & constants — billing
export type {
  Invoice,
  BillLineItem,
  CostEstimate,
  InsuranceClaim,
  PaymentRecord,
} from './datapoints/billing';
export {
  BILLING_TYPE_LABELS,
  VISIT_CHARGES,
  formatCurrency,
  mockInvoices,
  mockCostEstimates,
} from './datapoints/billing';

// Domain types & constants — clinical
export type { Vitals, ClinicalVisit } from './datapoints/clinical';
export {
  INVESTIGATION_ORDER_SETS,
  MEDICATION_ORDER_SETS,
  LAB_PANEL_OPTIONS,
  RADIOLOGY_OPTIONS,
  DEFAULT_CHEMO_CHECKLIST,
} from './datapoints/clinical';

// Domain types & constants — treatment
export type {
  TreatmentPlan,
  TreatmentDelivery,
  ToxicityRecord,
  ResponseAssessment,
  SurvivorshipRecord,
  RecurrenceRecord,
  PalliativeCareRecord,
} from './datapoints/treatment';

// Domain types & constants — staging
export type { CancerStaging } from './datapoints/staging';
export { mapCancerTypeToSite } from './datapoints/staging';

// Domain types & constants — chairs
export type { Chair } from './datapoints/chairs';

// Domain types & constants — medications
export {
  MEDICATION_CATALOGUE,
  FREQUENCY_OPTIONS,
  FOOD_TIMING_OPTIONS,
  TIME_OF_DAY_OPTIONS,
} from './datapoints/medications';

// Domain types & constants — geodata
export {
  COUNTRY_CODES,
  PINCODE_LOOKUP,
  COUNTRIES,
  GOVT_SCHEMES,
  MEDICAL_RECORD_CATEGORIES,
  IDENTIFIER_TYPES,
  RELATIONS,
} from './datapoints/geodata';

// Tailwind preset
export { bharatOncoPreset, default as tailwindPreset } from './tailwind-preset';

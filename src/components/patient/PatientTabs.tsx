import { useState } from 'react';
import { GenerateFullInvoiceOverlay } from '../../patterns/billing/GenerateFullInvoiceOverlay';
import type { User } from '../../datapoints/auth';
import type { Patient } from '../../datapoints/patients';
import type { Appointment } from '../../datapoints/scheduling';
import { mockDoctors } from '../../datapoints/scheduling';
import type { Vitals, ClinicalVisit } from '../../datapoints/clinical';
import type {
  TreatmentPlan, TreatmentDelivery, ResponseAssessment,
  ToxicityRecord, SurvivorshipRecord, RecurrenceRecord, PalliativeCareRecord,
} from '../../datapoints/treatment';
import type { Invoice, CostEstimate, InsuranceClaim, PaymentRecord, BillLineItem } from '../../datapoints/billing';
import {
  mockInvoices, mockCostEstimates, mockInsuranceClaims, mockPaymentRecords,
} from '../../datapoints/billing';
import type { CancerStaging } from '../../datapoints/staging';
import { mapCancerTypeToSite } from '../../datapoints/staging';
import { OverviewTab }           from './OverviewTab';
import { PastVisitsTab }         from './PastVisitsTab';
import { MedicalRecordsTab }     from './MedicalRecordsTab';
import { CancerStagingTab }      from './CancerStagingTab';
import { TreatmentPlanTab }      from './TreatmentPlanTab';
import { TreatmentDeliveryTab }  from './TreatmentDeliveryTab';
import { ResponseAssessmentTab } from './ResponseAssessmentTab';
import { ToxicityTab }           from './ToxicityTab';
import { SurvivorshipTab }       from './SurvivorshipTab';
import { RecurrenceTab }         from './RecurrenceTab';
import { PalliativeCareTab }     from './PalliativeCareTab';
import { BillingTab }            from './BillingTab';
import { PrescriptionViewerOverlay } from '../../patterns/clinical/PrescriptionViewerOverlay';

export type TabId =
  | 'overview' | 'past-visits' | 'medical-records'
  | 'cancer-staging' | 'treatment-plan' | 'treatment-delivery' | 'response-assessment'
  | 'toxicity' | 'survivorship' | 'recurrence' | 'palliative-care' | 'billing';

interface TabDef { id: TabId; label: string; }

const BASE_TABS: TabDef[] = [
  { id: 'overview',             label: 'Overview'                },
  { id: 'past-visits',          label: 'Past Visits'             },
  { id: 'medical-records',      label: 'Medical Records'         },
  { id: 'cancer-staging',       label: 'Cancer Staging'          },
  { id: 'treatment-plan',       label: 'Treatment Plan'          },
  { id: 'treatment-delivery',   label: 'Treatment Delivery'      },
  { id: 'response-assessment',  label: 'Response Assessment'     },
  { id: 'toxicity',             label: 'Toxicity & Complications' },
  { id: 'survivorship',         label: 'Survivorship'            },
  { id: 'recurrence',           label: 'Recurrence'              },
  { id: 'palliative-care',      label: 'Palliative Care'         },
  { id: 'billing',              label: 'Billing'                 },
];

interface Props {
  patient:               Patient;
  currentUser:           User;
  selectedCenter:        string;
  appointmentId?:        string;
  initialTab?:           TabId;
  appointments:          Appointment[];
  vitals:                Vitals[];
  clinicalVisits:        ClinicalVisit[];
  treatmentPlans:        TreatmentPlan[];
  treatmentDelivery:     TreatmentDelivery[];
  responseAssessments:   ResponseAssessment[];
  toxicityRecords:       ToxicityRecord[];
  survivorshipRecords:   SurvivorshipRecord[];
  recurrenceRecords:     RecurrenceRecord[];
  palliativeCareRecords: PalliativeCareRecord[];
  stagingRecords:        CancerStaging[];
  onVitalsChange:               React.Dispatch<React.SetStateAction<Vitals[]>>;
  onClinicalVisitsChange:       React.Dispatch<React.SetStateAction<ClinicalVisit[]>>;
  onTreatmentPlansChange:       React.Dispatch<React.SetStateAction<TreatmentPlan[]>>;
  onTreatmentDeliveryChange:    React.Dispatch<React.SetStateAction<TreatmentDelivery[]>>;
  onResponseAssessmentsChange:  React.Dispatch<React.SetStateAction<ResponseAssessment[]>>;
  onToxicityChange:             React.Dispatch<React.SetStateAction<ToxicityRecord[]>>;
  onSurvivorshipChange:         React.Dispatch<React.SetStateAction<SurvivorshipRecord[]>>;
  onRecurrenceChange:           React.Dispatch<React.SetStateAction<RecurrenceRecord[]>>;
  onPalliativeCareChange:       React.Dispatch<React.SetStateAction<PalliativeCareRecord[]>>;
  onStagingChange:              React.Dispatch<React.SetStateAction<CancerStaging[]>>;
  onPatientsChange:             React.Dispatch<React.SetStateAction<Patient[]>>;
  onAppointmentsChange?:        React.Dispatch<React.SetStateAction<Appointment[]>>;
}

export function PatientTabs({
  patient, currentUser, selectedCenter, appointmentId, initialTab, appointments,
  vitals, clinicalVisits,
  treatmentPlans, treatmentDelivery, responseAssessments,
  toxicityRecords, survivorshipRecords, recurrenceRecords, palliativeCareRecords,
  stagingRecords,
  onVitalsChange, onClinicalVisitsChange,
  onTreatmentPlansChange, onTreatmentDeliveryChange, onResponseAssessmentsChange,
  onToxicityChange, onSurvivorshipChange, onRecurrenceChange, onPalliativeCareChange,
  onStagingChange, onPatientsChange, onAppointmentsChange,
}: Props) {
  const patientVitals       = vitals.filter(v => v.patientId === patient.id);
  const patientAppointments = appointments.filter(a => a.patientId === patient.id);
  const currentAppointment  = appointmentId ? appointments.find(a => a.id === appointmentId) : undefined;
  const currentVisit        = appointmentId ? clinicalVisits.find(v => v.appointmentId === appointmentId) : undefined;

  const isNurse = currentUser.role === 'nurse';
  const tabs: TabDef[] = (() => {
    if (isNurse) {
      const nurseTabs: TabDef[] = [{ id: 'overview', label: 'Overview' }];
      if (currentVisit) nurseTabs.push({ id: 'treatment-delivery', label: 'Treatment Delivery' });
      return nurseTabs;
    }
    return BASE_TABS;
  })();

  const [activeTab, setActiveTab] = useState<TabId>(initialTab ?? 'overview');
  const visibleTabIds = tabs.map(t => t.id);
  const effectiveTab  = visibleTabIds.includes(activeTab) ? activeTab : 'overview';

  const [showPrescription, setShowPrescription] = useState(false);

  const [costEstimates,   setCostEstimates]   = useState<CostEstimate[]>(mockCostEstimates);
  const [insuranceClaims, setInsuranceClaims] = useState<InsuranceClaim[]>(mockInsuranceClaims);
  const [paymentRecords,  setPaymentRecords]  = useState<PaymentRecord[]>(mockPaymentRecords);
  const [patientInvoices, setPatientInvoices] = useState<Invoice[]>(
    () => mockInvoices.filter(inv => inv.patientId === patient.id),
  );
  const [showInvoiceOverlay,  setShowInvoiceOverlay]  = useState(false);
  const [invoicePrefillItems, setInvoicePrefillItems] = useState<BillLineItem[] | undefined>(undefined);

  const patientPlans      = treatmentPlans.filter(p => p.patientId === patient.id);
  const patientStaging    = stagingRecords.filter(s => s.patientId === patient.id);
  const patientCancerSite = mapCancerTypeToSite(patient.diagnosis?.cancerType);
  const patientDeliveries = treatmentDelivery.filter(d => d.patientId === patient.id);

  function handleCreateInvoiceFromEstimate(items: BillLineItem[]) {
    setInvoicePrefillItems(items);
    setShowInvoiceOverlay(true);
  }

  function handleInvoiceSave(inv: Invoice) {
    setPatientInvoices(prev => {
      const idx = prev.findIndex(i => i.id === inv.id);
      return idx >= 0 ? prev.map(i => i.id === inv.id ? inv : i) : [inv, ...prev];
    });
    setShowInvoiceOverlay(false);
    setInvoicePrefillItems(undefined);
  }

  function renderTab() {
    switch (effectiveTab) {
      case 'overview':
        return <OverviewTab patient={patient} onPatientsChange={onPatientsChange} treatmentPlans={patientPlans} />;

      case 'past-visits':
        return (
          <PastVisitsTab
            appointments={patientAppointments}
            vitals={patientVitals}
            clinicalVisits={clinicalVisits.filter(cv => cv.patientId === patient.id)}
            doctors={mockDoctors}
          />
        );

      case 'medical-records':
        return <MedicalRecordsTab patient={patient} onPatientsChange={onPatientsChange} />;

      case 'cancer-staging':
        return (
          <CancerStagingTab
            patientId={patient.id}
            cancerSite={patientCancerSite}
            plans={patientPlans}
            records={patientStaging}
            onRecordsChange={onStagingChange}
            onDiagnosisUpdate={stage => {
              onPatientsChange(prev => prev.map(p => {
                if (p.id !== patient.id) return p;
                const diagnosis = p.diagnosis
                  ? { ...p.diagnosis, stage }
                  : { cancerType: '', stage };
                return { ...p, diagnosis };
              }));
            }}
          />
        );

      case 'treatment-plan': {
        const latestVitals = [...patientVitals].sort((a, b) => b.recordedAt.localeCompare(a.recordedAt))[0];
        return (
          <TreatmentPlanTab
            patientId={patient.id}
            plans={patientPlans}
            onPlansChange={onTreatmentPlansChange}
            patientBsa={latestVitals?.bsa}
            patientWeightKg={latestVitals?.weight}
          />
        );
      }

      case 'treatment-delivery':
        return (
          <TreatmentDeliveryTab
            patientId={patient.id}
            deliveries={treatmentDelivery.filter(d => d.patientId === patient.id)}
            plans={patientPlans}
            onDeliveryChange={onTreatmentDeliveryChange}
            appointments={patientAppointments}
            clinicalVisits={clinicalVisits.filter(cv => cv.patientId === patient.id)}
            vitals={patientVitals}
          />
        );

      case 'response-assessment':
        return (
          <ResponseAssessmentTab
            patientId={patient.id}
            plans={patientPlans}
            assessments={responseAssessments.filter(r => r.patientId === patient.id)}
            onAssessmentsChange={onResponseAssessmentsChange}
          />
        );

      case 'toxicity':
        return (
          <ToxicityTab
            patientId={patient.id}
            plans={patientPlans}
            records={toxicityRecords.filter(t => t.patientId === patient.id)}
            onRecordsChange={onToxicityChange}
          />
        );

      case 'survivorship':
        return (
          <SurvivorshipTab
            patientId={patient.id}
            records={survivorshipRecords.filter(s => s.patientId === patient.id)}
            onRecordsChange={onSurvivorshipChange}
          />
        );

      case 'recurrence':
        return (
          <RecurrenceTab
            patientId={patient.id}
            records={recurrenceRecords.filter(r => r.patientId === patient.id)}
            onRecordsChange={onRecurrenceChange}
          />
        );

      case 'palliative-care':
        return (
          <PalliativeCareTab
            patientId={patient.id}
            records={palliativeCareRecords.filter(r => r.patientId === patient.id)}
            onRecordsChange={onPalliativeCareChange}
          />
        );

      case 'billing':
        return (
          <BillingTab
            patient={patient}
            plans={patientPlans}
            invoices={patientInvoices}
            costEstimates={costEstimates}
            insuranceClaims={insuranceClaims}
            paymentRecords={paymentRecords}
            onCostEstimatesChange={setCostEstimates}
            onInsuranceClaimsChange={setInsuranceClaims}
            onPaymentRecordsChange={setPaymentRecords}
            onCreateInvoice={handleCreateInvoiceFromEstimate}
          />
        );

      default:
        return null;
    }
  }

  return (
    <>
      {/* Body: tab nav + content */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden mt-4 min-h-0">
        {/* Mobile: horizontal scroll tabs */}
        <nav className="md:hidden shrink-0 border-b border-border bg-card overflow-x-auto">
          <div className="flex min-w-max">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`shrink-0 px-4 py-2.5 text-sm transition-colors border-b-2 whitespace-nowrap ${
                  effectiveTab === tab.id
                    ? 'border-primary bg-primary/5 text-primary font-semibold'
                    : 'border-transparent text-foreground hover:bg-muted/50 font-medium'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Desktop: left tab nav */}
        <nav className="hidden md:block w-52 shrink-0 border-r border-border bg-card overflow-y-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors border-l-2 ${
                effectiveTab === tab.id
                  ? 'border-primary bg-primary/5 text-primary font-semibold'
                  : 'border-transparent text-foreground hover:bg-muted/50 font-medium'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Tab content */}
        <main className="flex-1 overflow-y-auto px-4 py-4 md:px-6 md:py-6 min-w-0">
          {renderTab()}
        </main>
      </div>

      {/* Prescription viewer overlay */}
      {showPrescription && currentAppointment && currentVisit && (
        <PrescriptionViewerOverlay
          patient={patient}
          appointment={currentAppointment}
          clinicalVisit={currentVisit}
          vitals={currentVisit.vitalsId ? patientVitals.find(v => v.id === currentVisit.vitalsId) : undefined}
          onClose={() => setShowPrescription(false)}
        />
      )}

      {/* New Invoice overlay — triggered from cost estimate tab */}
      {showInvoiceOverlay && (
        <GenerateFullInvoiceOverlay
          selectedCenter={selectedCenter}
          patients={[patient]}
          userRole={currentUser.role}
          centerInvoiceCount={patientInvoices.length}
          prefill={{
            patientId:   patient.id,
            patientName: patient.name,
            lineItems:   invoicePrefillItems ?? [],
          }}
          costEstimates={costEstimates}
          onSave={handleInvoiceSave}
          onClose={() => { setShowInvoiceOverlay(false); setInvoicePrefillItems(undefined); }}
        />
      )}
    </>
  );
}

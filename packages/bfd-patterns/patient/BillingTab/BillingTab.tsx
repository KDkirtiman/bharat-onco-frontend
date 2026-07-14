import * as styles from './BillingTab.styles';
import { useState } from 'react';

import type { Patient } from 'bfd-core';
import type { Invoice, CostEstimate, InsuranceClaim, PaymentRecord, BillLineItem } from 'bfd-core';
import type { TreatmentPlan } from 'bfd-core';
import { CostEstimationSubTab }  from '../CostEstimationSubTab';
import { InsuranceClaimsSubTab } from '../InsuranceClaimsSubTab';
import { PastInvoicesSubTab }    from '../PastInvoicesSubTab';
import { PaymentDetailsSubTab }  from '../PaymentDetailsSubTab';
import { cn } from 'bfd-core';

interface Props {
  patient:          Patient;
  plans:            TreatmentPlan[];
  invoices:         Invoice[];
  costEstimates:    CostEstimate[];
  insuranceClaims:  InsuranceClaim[];
  paymentRecords:   PaymentRecord[];
  onCostEstimatesChange:   React.Dispatch<React.SetStateAction<CostEstimate[]>>;
  onInsuranceClaimsChange: React.Dispatch<React.SetStateAction<InsuranceClaim[]>>;
  onPaymentRecordsChange:  React.Dispatch<React.SetStateAction<PaymentRecord[]>>;
  onCreateInvoice?:        (items: BillLineItem[]) => void;
}

type BillingSubTab = 'cost-estimation' | 'insurance-claims' | 'past-invoices' | 'payment-details';

export function BillingTab({
  patient, plans, invoices,
  costEstimates, insuranceClaims, paymentRecords,
  onCostEstimatesChange, onInsuranceClaimsChange, onPaymentRecordsChange,
  onCreateInvoice,
}: Props) {
  const showInsurance = patient.payor?.type !== 'self';

  const ALL_SUB_TABS: { id: BillingSubTab; label: string }[] = [
    { id: 'cost-estimation',  label: 'Cost Estimation'  },
    { id: 'insurance-claims', label: 'Insurance Claims' },
    { id: 'past-invoices',    label: 'Past Invoices'    },
    { id: 'payment-details',  label: 'Payment Details'  },
  ];

  const visibleTabs = ALL_SUB_TABS.filter(t =>
    t.id !== 'insurance-claims' || showInsurance,
  );

  const [activeSubTab, setActiveSubTab] = useState<BillingSubTab>(visibleTabs[0].id);

  const patientEstimates    = costEstimates.filter(e => e.patientId === patient.id);
  const patientClaims       = insuranceClaims.filter(c => c.patientId === patient.id);
  const patientPayments     = paymentRecords.filter(p => p.patientId === patient.id);

  return (
    <div className={styles.style2}>
      {/* Sub-tab bar */}
      <div className={styles.style3}>
        {visibleTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={cn(
              'px-4 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap',
              activeSubTab === tab.id
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Sub-tab content */}
      {activeSubTab === 'cost-estimation' && (
        <CostEstimationSubTab
          patientId={patient.id}
          plans={plans}
          estimates={patientEstimates}
          onEstimatesChange={onCostEstimatesChange}
          onCreateInvoice={onCreateInvoice}
        />
      )}
      {activeSubTab === 'insurance-claims' && (
        <InsuranceClaimsSubTab
          patientId={patient.id}
          invoices={invoices}
          claims={patientClaims}
          onClaimsChange={onInsuranceClaimsChange}
        />
      )}
      {activeSubTab === 'past-invoices' && (
        <PastInvoicesSubTab invoices={invoices} patient={patient} />
      )}
      {activeSubTab === 'payment-details' && (
        <PaymentDetailsSubTab
          patientId={patient.id}
          invoices={invoices}
          payments={patientPayments}
          onPaymentsChange={onPaymentRecordsChange}
        />
      )}
    </div>
  );
}

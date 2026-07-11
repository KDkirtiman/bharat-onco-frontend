import * as styles from './TreatmentDeliveryTab.styles';
import { useState } from 'react';
import { Plus, Syringe, FlaskConical, Radiation, Scissors, CheckCircle2, Eye } from 'bfd-icons';

import type { TreatmentDelivery, TreatmentPlan, PlanModality } from 'bfd-core';
import {
  DELIVERY_STATUS_LABELS, DELIVERY_STATUS_COLORS,
} from 'bfd-core';
import type { Appointment } from 'bfd-core';
import type { ClinicalVisit, Vitals } from 'bfd-core';
import { LogDeliveryOverlay } from '../../patterns/clinical/LogDeliveryOverlay';
import { CycleDetailOverlay } from '../../patterns/clinical/CycleDetailOverlay';

interface Props {
  patientId:        string;
  deliveries:       TreatmentDelivery[];
  plans:            TreatmentPlan[];
  onDeliveryChange: React.Dispatch<React.SetStateAction<TreatmentDelivery[]>>;
  appointments?:    Appointment[];
  clinicalVisits?:  ClinicalVisit[];
  vitals?:          Vitals[];
}

type SubTab = PlanModality;

const SUB_TABS: { id: SubTab; label: string; icon: React.ReactNode; logLabel: string }[] = [
  { id: 'chemotherapy', label: 'Chemotherapy', icon: <FlaskConical size={14} />, logLabel: 'Log Cycle'     },
  { id: 'radiotherapy', label: 'Radiotherapy', icon: <Radiation size={14} />,    logLabel: 'Log Fraction'  },
  { id: 'surgery',      label: 'Surgery',       icon: <Scissors size={14} />,     logLabel: 'Log Surgery'   },
];

function fmtDate(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function StatusBadge({ status }: { status: TreatmentDelivery['status'] }) {
  return (
    <span className={styles.style1Class(DELIVERY_STATUS_COLORS[status])}>
      {DELIVERY_STATUS_LABELS[status]}
    </span>
  );
}

function LabChips({ labs }: { labs: NonNullable<TreatmentDelivery['chemoDetails']>['preChemoLabs'] }) {
  if (!labs) return null;
  const entries: { label: string; value: string }[] = [
    { label: 'WBC',  value: labs.wbc ?? '' },
    { label: 'ANC',  value: labs.anc ?? '' },
    { label: 'Hgb',  value: labs.haemoglobin ?? '' },
    { label: 'Plt',  value: labs.platelets ?? '' },
    { label: 'Cr',   value: labs.creatinine ?? '' },
    { label: 'Bili', value: labs.bili ?? '' },
    { label: 'AST',  value: labs.ast ?? '' },
    { label: 'ALT',  value: labs.alt ?? '' },
  ].filter(e => e.value);

  if (entries.length === 0) return null;
  return (
    <div className={styles.style5}>
      {entries.map(e => (
        <span key={e.label} className={styles.style6}>
          {e.label} <span className={styles.style7}>{e.value}</span>
        </span>
      ))}
    </div>
  );
}

function ChemoSummaryCard({
  delivery, planMap, onViewDetails,
}: {
  delivery:      TreatmentDelivery;
  planMap:       Record<string, TreatmentPlan>;
  onViewDetails: () => void;
}) {
  const plan     = planMap[delivery.planId];
  const c        = delivery.chemoDetails;
  const cycleNum = c?.cycleNumber ?? delivery.sessionNumber;
  const drugNames = c?.drugs.map(d => d.name).join(', ') ?? delivery.drugsAdministered;

  return (
    <div className={styles.style8}>
      {/* Cycle number badge */}
      <div className={styles.style9}>
        <span className={styles.style10}>Cycle</span>
        <span className={styles.style11}>{cycleNum}</span>
      </div>

      {/* Main info */}
      <div className={styles.style12}>
        <div className={styles.style13}>
          {c?.sessionType && (
            <span className={cn(
              'text-xs px-2 py-0.5 rounded-full font-medium',
              c.sessionType === 'inpatient' ? 'bg-info-soft text-info-emphasis' : 'bg-muted text-muted-foreground',
            )}>
              {c.sessionType === 'inpatient' ? 'Inpatient' : 'Daycare'}
            </span>
          )}
          <StatusBadge status={delivery.status} />
          {c?.ecogAtDelivery != null && (
            <span className={styles.style14}>ECOG {c.ecogAtDelivery}</span>
          )}
        </div>
        <p className={styles.style15}>
          {fmtDate(delivery.date)}
          {plan?.regimen ? ` · ${plan.regimen}` : ''}
        </p>
        {drugNames && (
          <p className={styles.style16}>{drugNames}</p>
        )}
      </div>

      {/* View Details */}
      <button
        onClick={onViewDetails}
        className={styles.style17}
      >
        <Eye size={13} />
        View Details
      </button>
    </div>
  );
}

function RadioCard({ delivery, planMap }: { delivery: TreatmentDelivery; planMap: Record<string, TreatmentPlan> }) {
  const plan = planMap[delivery.planId];
  const r    = delivery.radioDetails;
  const fracNum = r?.fractionNumber ?? delivery.sessionNumber;
  const totalFx = plan?.radioDetails?.fractionsPlanned;
  const totalGy = plan?.radioDetails?.totalDoseGy;

  return (
    <div className={styles.style18}>
      <div className={styles.style19}>
        <div>
          <div className={styles.style13}>
            <span className={styles.style20}>Fraction #{fracNum}</span>
            {totalFx && <span className={styles.style14}>of {totalFx}</span>}
            <StatusBadge status={delivery.status} />
          </div>
          <p className={styles.style21}>
            {fmtDate(delivery.date)}
            {plan ? ` · ${plan.radioDetails?.technique ?? plan.regimen}` : ''}
          </p>
        </div>
        {r && (
          <div className={styles.style22}>
            <div>
              <p className={styles.style23}>Dose</p>
              <p className={styles.style24}>{r.doseGy} Gy</p>
            </div>
            {totalGy && (
              <p className={styles.style14}>
                Cumulative: <span className={styles.style7}>{r.cumulativeDoseGy} Gy</span>
                <span className={styles.style25}>({Math.round(r.cumulativeDoseGy / totalGy * 100)}%)</span>
              </p>
            )}
          </div>
        )}
      </div>

      {(r?.machine || r?.skinReaction) && (
        <div className={styles.style26}>
          {r.machine && <span className={styles.style27}>Machine: <span className={styles.style28}>{r.machine}</span></span>}
          {r.skinReaction && r.skinReaction !== 'None' && (
            <span className={cn(
              'px-2 py-0.5 rounded-full font-medium',
              r.skinReaction === 'Grade 1' ? 'bg-warning-soft text-warning-emphasis'
              : r.skinReaction === 'Grade 2' ? 'bg-orange-soft text-orange-emphasis'
              : 'bg-destructive/10 text-destructive',
            )}>
              Skin Reaction: {r.skinReaction}
            </span>
          )}
        </div>
      )}

      {delivery.notes && (
        <div className={styles.style29}>
          <p className={styles.style30}>{delivery.notes}</p>
        </div>
      )}
    </div>
  );
}

function SurgeryCard({ delivery, planMap }: { delivery: TreatmentDelivery; planMap: Record<string, TreatmentPlan> }) {
  const plan = planMap[delivery.planId];
  const s    = delivery.surgeryDetails;

  return (
    <div className={styles.style18}>
      <div className={styles.style19}>
        <div>
          <div className={styles.style13}>
            <span className={styles.style20}>Surgery #{s?.surgeryNumber ?? delivery.sessionNumber}</span>
            <StatusBadge status={delivery.status} />
          </div>
          <p className={styles.style31}>{s?.procedurePerformed ?? delivery.drugsAdministered}</p>
          <p className={styles.style21}>
            {fmtDate(delivery.date)}
            {plan ? ` · ${plan.protocol}` : ''}
            {s?.surgeon && ` · ${s.surgeon}`}
          </p>
        </div>
        {s?.durationMinutes && (
          <div className={styles.style32}>
            <p className={styles.style23}>Duration</p>
            <p className={styles.style24}>{s.durationMinutes} min</p>
          </div>
        )}
      </div>

      {/* Admission / Discharge */}
      {(s?.admissionDate || s?.dischargeDate) && (
        <div className={styles.style33}>
          <span>Admitted: <span className={styles.style34}>{s.admissionDate ? fmtDate(s.admissionDate) : '—'}</span></span>
          <span>→</span>
          <span>Discharged: <span className={styles.style34}>{s.dischargeDate ? fmtDate(s.dischargeDate) : '—'}</span></span>
          {s?.anaesthesiaType && <span className={styles.style35}>{s.anaesthesiaType}</span>}
        </div>
      )}

      {s?.intraOpFindings && (
        <div className={styles.style29}>
          <p className={styles.style36}>Intra-Op Findings</p>
          <p className={styles.style37}>{s.intraOpFindings}</p>
        </div>
      )}

      {s?.specimenSent && (
        <div className={styles.style29}>
          <div className={styles.style38}>
            <CheckCircle2 size={14} className={styles.style39} />
            <span className={styles.style28}>Specimen Sent</span>
            {s.specimenDetails && <span className={styles.style27}>— {s.specimenDetails}</span>}
          </div>
        </div>
      )}

      {s?.postOpComplications && (
        <div className={styles.style29}>
          <p className={styles.style36}>Post-Op Complications</p>
          <p className={styles.style40}>{s.postOpComplications}</p>
        </div>
      )}

      {delivery.notes && (
        <div className={styles.style29}>
          <p className={styles.style30}>{delivery.notes}</p>
        </div>
      )}
    </div>
  );
}

export function TreatmentDeliveryTab({
  patientId, deliveries, plans, onDeliveryChange,
  appointments = [], clinicalVisits = [], vitals = [],
}: Props) {
  const [activeTab,      setActiveTab]      = useState<SubTab>('chemotherapy');
  const [logOpen,        setLogOpen]        = useState(false);
  const [filterPlanId,   setFilterPlanId]   = useState<string>('all');
  const [detailDelivery, setDetailDelivery] = useState<TreatmentDelivery | null>(null);

  const planMap = Object.fromEntries(plans.map(p => [p.id, p]));

  const tabPlans     = plans.filter(p => p.modality === activeTab);
  const tabDeliveries = deliveries
    .filter(d => d.modality === activeTab)
    .filter(d => filterPlanId === 'all' || d.planId === filterPlanId)
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className={styles.style41}>
      {/* Sub-tab bar */}
      <div className={styles.style42}>
        <div className={styles.style43}>
          {SUB_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setFilterPlanId('all'); }}
              className={cn(
                'flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm font-medium transition-all',
                activeTab === tab.id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {tab.icon}
              {tab.label}
              {deliveries.filter(d => d.modality === tab.id).length > 0 && (
                <span className={styles.style44}>
                  {deliveries.filter(d => d.modality === tab.id).length}
                </span>
              )}
            </button>
          ))}
        </div>

        <button
          onClick={() => setLogOpen(true)}
          className={styles.style45}
        >
          <Plus size={15} />
          {SUB_TABS.find(t => t.id === activeTab)?.logLabel}
        </button>
      </div>

      {/* Filter bar */}
      {tabPlans.length > 1 && (
        <div className={styles.style46}>
          <span className={styles.style47}>Filter by plan:</span>
          <select
            value={filterPlanId}
            onChange={e => setFilterPlanId(e.target.value)}
            className={styles.style48}
          >
            <option value="all">All Plans</option>
            {tabPlans.map(p => (
              <option key={p.id} value={p.id}>{p.regimen}</option>
            ))}
          </select>
        </div>
      )}

      {/* Delivery cards */}
      {tabDeliveries.length === 0 ? (
        <div className={styles.style49}>
          <Syringe size={32} className={styles.style50} />
          <p className={styles.style51}>
            No {activeTab} sessions on record
          </p>
          <p className={styles.style52}>
            Click "{SUB_TABS.find(t => t.id === activeTab)?.logLabel}" to add the first entry.
          </p>
        </div>
      ) : (
        <div className={styles.style53}>
          {tabDeliveries.map(d =>
            activeTab === 'chemotherapy'
              ? (
                <ChemoSummaryCard
                  key={d.id}
                  delivery={d}
                  planMap={planMap}
                  onViewDetails={() => setDetailDelivery(d)}
                />
              )
              : activeTab === 'radiotherapy'
              ? <RadioCard key={d.id} delivery={d} planMap={planMap} />
              : <SurgeryCard key={d.id} delivery={d} planMap={planMap} />,
          )}
        </div>
      )}

      {logOpen && (
        <LogDeliveryOverlay
          patientId={patientId}
          plans={plans}
          deliveries={deliveries}
          modality={activeTab}
          onSave={delivery => {
            onDeliveryChange(prev => [...prev, delivery]);
            setLogOpen(false);
          }}
          onClose={() => setLogOpen(false)}
        />
      )}

      {detailDelivery && (() => {
        const matchedAppointment = appointments.find(
          a => a.date === detailDelivery.date && a.type === 'chemo-session',
        );
        const matchedVisit  = matchedAppointment
          ? clinicalVisits.find(cv => cv.appointmentId === matchedAppointment.id)
          : undefined;
        const matchedVitals = matchedVisit?.vitalsId
          ? vitals.find(v => v.id === matchedVisit.vitalsId)
          : undefined;
        return (
          <CycleDetailOverlay
            delivery={detailDelivery}
            plan={planMap[detailDelivery.planId]}
            appointment={matchedAppointment}
            clinicalVisit={matchedVisit}
            vitals={matchedVitals}
            onClose={() => setDetailDelivery(null)}
          />
        );
      })()}
    </div>
  );
}

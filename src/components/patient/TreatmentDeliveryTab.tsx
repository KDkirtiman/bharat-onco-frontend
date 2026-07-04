import { useState } from 'react';
import { Plus, Syringe, FlaskConical, Radiation, Scissors, CheckCircle2, Eye } from 'lucide-react';
import { cn } from '../../lib/cn';
import type { TreatmentDelivery, TreatmentPlan, PlanModality } from '../../datapoints/treatment';
import {
  DELIVERY_STATUS_LABELS, DELIVERY_STATUS_COLORS,
} from '../../datapoints/treatment';
import type { Appointment } from '../../datapoints/scheduling';
import type { ClinicalVisit, Vitals } from '../../datapoints/clinical';
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
    <span className={cn('text-xs px-2.5 py-0.5 rounded-full font-medium shrink-0', DELIVERY_STATUS_COLORS[status])}>
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
    <div className="flex flex-wrap gap-1.5">
      {entries.map(e => (
        <span key={e.label} className="text-xs px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
          {e.label} <span className="font-semibold text-foreground">{e.value}</span>
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
    <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
      {/* Cycle number badge */}
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex flex-col items-center justify-center shrink-0">
        <span className="text-[10px] text-primary font-semibold uppercase tracking-wide leading-none">Cycle</span>
        <span className="text-lg font-bold text-primary leading-none mt-0.5">{cycleNum}</span>
      </div>

      {/* Main info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          {c?.sessionType && (
            <span className={cn(
              'text-xs px-2 py-0.5 rounded-full font-medium',
              c.sessionType === 'inpatient' ? 'bg-blue-100 text-blue-700' : 'bg-muted text-muted-foreground',
            )}>
              {c.sessionType === 'inpatient' ? 'Inpatient' : 'Daycare'}
            </span>
          )}
          <StatusBadge status={delivery.status} />
          {c?.ecogAtDelivery != null && (
            <span className="text-xs text-muted-foreground">ECOG {c.ecogAtDelivery}</span>
          )}
        </div>
        <p className="text-sm font-medium text-foreground mt-1">
          {fmtDate(delivery.date)}
          {plan?.regimen ? ` · ${plan.regimen}` : ''}
        </p>
        {drugNames && (
          <p className="text-xs text-muted-foreground mt-0.5 truncate">{drugNames}</p>
        )}
      </div>

      {/* View Details */}
      <button
        onClick={onViewDetails}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary border border-primary/30 rounded-lg hover:bg-primary/5 transition-colors shrink-0"
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
    <div className="bg-card border border-border rounded-xl p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-base font-bold text-foreground">Fraction #{fracNum}</span>
            {totalFx && <span className="text-xs text-muted-foreground">of {totalFx}</span>}
            <StatusBadge status={delivery.status} />
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {fmtDate(delivery.date)}
            {plan ? ` · ${plan.radioDetails?.technique ?? plan.regimen}` : ''}
          </p>
        </div>
        {r && (
          <div className="text-right shrink-0 space-y-0.5">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Dose</p>
              <p className="text-sm font-semibold text-foreground">{r.doseGy} Gy</p>
            </div>
            {totalGy && (
              <p className="text-xs text-muted-foreground">
                Cumulative: <span className="font-semibold text-foreground">{r.cumulativeDoseGy} Gy</span>
                <span className="ml-1 text-muted-foreground/70">({Math.round(r.cumulativeDoseGy / totalGy * 100)}%)</span>
              </p>
            )}
          </div>
        )}
      </div>

      {(r?.machine || r?.skinReaction) && (
        <div className="flex items-center gap-4 text-xs border-t border-border pt-3">
          {r.machine && <span className="text-muted-foreground">Machine: <span className="font-medium text-foreground">{r.machine}</span></span>}
          {r.skinReaction && r.skinReaction !== 'None' && (
            <span className={cn(
              'px-2 py-0.5 rounded-full font-medium',
              r.skinReaction === 'Grade 1' ? 'bg-amber-100 text-amber-700'
              : r.skinReaction === 'Grade 2' ? 'bg-orange-100 text-orange-700'
              : 'bg-destructive/10 text-destructive',
            )}>
              Skin Reaction: {r.skinReaction}
            </span>
          )}
        </div>
      )}

      {delivery.notes && (
        <div className="border-t border-border pt-3">
          <p className="text-xs text-muted-foreground leading-relaxed">{delivery.notes}</p>
        </div>
      )}
    </div>
  );
}

function SurgeryCard({ delivery, planMap }: { delivery: TreatmentDelivery; planMap: Record<string, TreatmentPlan> }) {
  const plan = planMap[delivery.planId];
  const s    = delivery.surgeryDetails;

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-base font-bold text-foreground">Surgery #{s?.surgeryNumber ?? delivery.sessionNumber}</span>
            <StatusBadge status={delivery.status} />
          </div>
          <p className="text-sm font-medium text-foreground mt-0.5">{s?.procedurePerformed ?? delivery.drugsAdministered}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {fmtDate(delivery.date)}
            {plan ? ` · ${plan.protocol}` : ''}
            {s?.surgeon && ` · ${s.surgeon}`}
          </p>
        </div>
        {s?.durationMinutes && (
          <div className="text-right shrink-0">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Duration</p>
            <p className="text-sm font-semibold text-foreground">{s.durationMinutes} min</p>
          </div>
        )}
      </div>

      {/* Admission / Discharge */}
      {(s?.admissionDate || s?.dischargeDate) && (
        <div className="flex items-center gap-3 text-xs text-muted-foreground border-t border-border pt-3">
          <span>Admitted: <span className="text-foreground font-medium">{s.admissionDate ? fmtDate(s.admissionDate) : '—'}</span></span>
          <span>→</span>
          <span>Discharged: <span className="text-foreground font-medium">{s.dischargeDate ? fmtDate(s.dischargeDate) : '—'}</span></span>
          {s?.anaesthesiaType && <span className="ml-2 text-muted-foreground/70">{s.anaesthesiaType}</span>}
        </div>
      )}

      {s?.intraOpFindings && (
        <div className="border-t border-border pt-3">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">Intra-Op Findings</p>
          <p className="text-sm text-foreground leading-relaxed">{s.intraOpFindings}</p>
        </div>
      )}

      {s?.specimenSent && (
        <div className="border-t border-border pt-3">
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 size={14} className="text-green-600 shrink-0" />
            <span className="font-medium text-foreground">Specimen Sent</span>
            {s.specimenDetails && <span className="text-muted-foreground">— {s.specimenDetails}</span>}
          </div>
        </div>
      )}

      {s?.postOpComplications && (
        <div className="border-t border-border pt-3">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">Post-Op Complications</p>
          <p className="text-sm text-foreground">{s.postOpComplications}</p>
        </div>
      )}

      {delivery.notes && (
        <div className="border-t border-border pt-3">
          <p className="text-xs text-muted-foreground leading-relaxed">{delivery.notes}</p>
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
    <div className="space-y-4">
      {/* Sub-tab bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-1 bg-muted/50 rounded-lg p-1">
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
                <span className="ml-1 text-xs bg-primary/15 text-primary rounded-full px-1.5 py-0.5 leading-none font-semibold">
                  {deliveries.filter(d => d.modality === tab.id).length}
                </span>
              )}
            </button>
          ))}
        </div>

        <button
          onClick={() => setLogOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shrink-0"
        >
          <Plus size={15} />
          {SUB_TABS.find(t => t.id === activeTab)?.logLabel}
        </button>
      </div>

      {/* Filter bar */}
      {tabPlans.length > 1 && (
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground shrink-0">Filter by plan:</span>
          <select
            value={filterPlanId}
            onChange={e => setFilterPlanId(e.target.value)}
            className="text-sm px-3 py-1.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
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
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Syringe size={32} className="text-muted-foreground/40 mb-3" />
          <p className="text-sm font-medium text-muted-foreground">
            No {activeTab} sessions on record
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Click "{SUB_TABS.find(t => t.id === activeTab)?.logLabel}" to add the first entry.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
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

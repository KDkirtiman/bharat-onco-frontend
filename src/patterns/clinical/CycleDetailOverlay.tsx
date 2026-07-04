import { X, Armchair, FlaskConical, AlertTriangle, FileText, Activity } from 'lucide-react';
import { cn } from '../../lib/cn';
import { IconButton } from '../../components/controls/IconButton';
import type { TreatmentDelivery, TreatmentPlan } from '../../datapoints/treatment';
import { DELIVERY_STATUS_LABELS, DELIVERY_STATUS_COLORS } from '../../datapoints/treatment';
import type { Appointment } from '../../datapoints/scheduling';
import type { ClinicalVisit, Vitals } from '../../datapoints/clinical';
import { mockChairs } from '../../datapoints/chairs';

interface Props {
  delivery:      TreatmentDelivery;
  plan?:         TreatmentPlan;
  appointment?:  Appointment;
  clinicalVisit?: ClinicalVisit;
  vitals?:       Vitals;
  onClose:       () => void;
}

function fmtDate(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 pb-2 border-b border-border mb-3">
      <span className="text-primary">{icon}</span>
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{title}</h3>
    </div>
  );
}

function Field({ label, value, wide }: { label: string; value?: string | number | null; wide?: boolean }) {
  if (value == null || value === '') return null;
  return (
    <div className={wide ? 'col-span-2' : ''}>
      <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">{label}</p>
      <p className="text-sm text-foreground">{value}</p>
    </div>
  );
}

const SEVERITY_COLORS: Record<string, string> = {
  mild:     'bg-amber-50 text-amber-700 border-amber-200',
  moderate: 'bg-orange-50 text-orange-700 border-orange-200',
  severe:   'bg-destructive/10 text-destructive border-destructive/20',
};

export function CycleDetailOverlay({ delivery, plan, appointment, clinicalVisit, vitals, onClose }: Props) {
  const c = delivery.chemoDetails;
  const cycleNum = c?.cycleNumber ?? delivery.sessionNumber;
  const chair    = appointment?.chairId ? mockChairs.find(ch => ch.id === appointment.chairId) : undefined;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-y-auto py-8 px-4">
      <div className="bg-background rounded-2xl shadow-xl w-full max-w-3xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              Cycle #{cycleNum}
              {plan?.regimen ? ` — ${plan.regimen}` : ''}
            </h2>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-sm text-muted-foreground">{fmtDate(delivery.date)}</span>
              {c?.sessionType && (
                <span className={cn(
                  'text-xs px-2 py-0.5 rounded-full font-medium',
                  c.sessionType === 'inpatient' ? 'bg-blue-100 text-blue-700' : 'bg-muted text-muted-foreground',
                )}>
                  {c.sessionType === 'inpatient' ? 'Inpatient' : 'Daycare'}
                </span>
              )}
              <span className={cn(
                'text-xs px-2.5 py-0.5 rounded-full font-medium',
                DELIVERY_STATUS_COLORS[delivery.status],
              )}>
                {DELIVERY_STATUS_LABELS[delivery.status]}
              </span>
            </div>
          </div>
          <IconButton
            icon={<X size={18} />}
            label="Close"
            onClick={onClose}
            className="p-2 hover:bg-muted/50"
          />
        </div>

        <div className="px-6 py-5 space-y-6">

          {/* ── Cycle Overview ── */}
          <section>
            <SectionHeader icon={<Activity size={14} />} title="Cycle Overview" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Field label="Cycle #"         value={cycleNum} />
              <Field label="Date"            value={fmtDate(delivery.date)} />
              <Field label="ECOG at Delivery" value={c?.ecogAtDelivery != null ? String(c.ecogAtDelivery) : null} />
              <Field label="Status"          value={DELIVERY_STATUS_LABELS[delivery.status]} />
              {c?.sessionType === 'inpatient' && (
                <>
                  <Field label="Admission"  value={c.admissionDate  ? fmtDate(c.admissionDate)  : '—'} />
                  <Field label="Discharge"  value={c.dischargeDate  ? fmtDate(c.dischargeDate)  : '—'} />
                </>
              )}
            </div>
          </section>

          {/* ── Chair Assigned ── */}
          <section>
            <SectionHeader icon={<Armchair size={14} />} title="Chair Assigned" />
            {chair ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <Field label="Chair"     value={chair.name} />
                <Field label="Bay"       value={chair.bay} />
                <Field label="Center"    value={chair.center} />
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">No chair assignment recorded</p>
            )}
          </section>

          {/* ── Pre-Chemo Vitals ── */}
          {vitals && (
            <section>
              <SectionHeader icon={<Activity size={14} />} title="Pre-Chemo Vitals" />
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                <Field label="BP"    value={vitals.bp} />
                <Field label="HR"    value={vitals.heartRate ? `${vitals.heartRate} bpm` : null} />
                <Field label="Temp"  value={vitals.temperature ? `${vitals.temperature} °F` : null} />
                <Field label="BMI"   value={vitals.bmi} />
                <Field label="BSA"   value={vitals.bsa ? `${vitals.bsa} m²` : null} />
                <Field label="SpO₂"  value={vitals.spo2 ? `${vitals.spo2}%` : null} />
              </div>
            </section>
          )}

          {/* ── Pre-Chemo Labs ── */}
          {c?.preChemoLabs && (
            <section>
              <SectionHeader icon={<FlaskConical size={14} />} title="Pre-Chemo Labs" />
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                {[
                  { label: 'WBC',        value: c.preChemoLabs.wbc },
                  { label: 'ANC',        value: c.preChemoLabs.anc },
                  { label: 'Haemoglobin', value: c.preChemoLabs.haemoglobin },
                  { label: 'Platelets',  value: c.preChemoLabs.platelets },
                  { label: 'Creatinine', value: c.preChemoLabs.creatinine },
                  { label: 'Bilirubin',  value: c.preChemoLabs.bili },
                  { label: 'AST',        value: c.preChemoLabs.ast },
                  { label: 'ALT',        value: c.preChemoLabs.alt },
                ].filter(e => e.value).map(e => (
                  <Field key={e.label} label={e.label} value={e.value} />
                ))}
              </div>
            </section>
          )}

          {/* ── Drugs Administered ── */}
          {c && c.drugs.length > 0 && (
            <section>
              <SectionHeader icon={<FlaskConical size={14} />} title="Drugs Administered" />
              <div className="rounded-xl border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/40">
                      {['Drug', 'Planned Dose', 'Given Dose', 'Route', 'Notes'].map(h => (
                        <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {c.drugs.map((d, i) => {
                      const reduced = d.givenDose !== d.plannedDose;
                      return (
                        <tr key={i} className="border-t border-border hover:bg-muted/20 transition-colors">
                          <td className="px-4 py-2.5 font-medium text-foreground">{d.name}</td>
                          <td className="px-4 py-2.5 text-muted-foreground">{d.plannedDose}</td>
                          <td className={cn('px-4 py-2.5 font-medium', reduced ? 'text-amber-600' : 'text-foreground')}>
                            {d.givenDose}
                            {reduced && <span className="ml-1.5 text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">Reduced</span>}
                          </td>
                          <td className="px-4 py-2.5 text-muted-foreground">{d.route}</td>
                          <td className="px-4 py-2.5 text-muted-foreground">{d.notes ?? '—'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* ── Adverse Events ── */}
          <section>
            <SectionHeader icon={<AlertTriangle size={14} />} title="Adverse Events" />
            {clinicalVisit?.adverseEvents && clinicalVisit.adverseEvents.length > 0 ? (
              <div className="space-y-2">
                {clinicalVisit.adverseEvents.map(ev => (
                  <div key={ev.id} className={cn(
                    'flex items-start gap-3 px-4 py-3 rounded-xl border text-sm',
                    SEVERITY_COLORS[ev.severity],
                  )}>
                    <div className="shrink-0 mt-0.5">
                      <AlertTriangle size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold capitalize">{ev.severity}</span>
                        <span className="text-xs opacity-70">{ev.time}</span>
                      </div>
                      <p className="mt-0.5 leading-snug">{ev.description}</p>
                      {ev.actionTaken && (
                        <p className="mt-1 text-xs opacity-80">Action: {ev.actionTaken}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">No adverse events recorded</p>
            )}
          </section>

          {/* ── Clinical Notes ── */}
          {(clinicalVisit?.clinicalNotes || clinicalVisit?.plan || delivery.notes) && (
            <section>
              <SectionHeader icon={<FileText size={14} />} title="Clinical Notes" />
              <div className="space-y-3">
                {clinicalVisit?.clinicalNotes && (
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Notes</p>
                    <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{clinicalVisit.clinicalNotes}</p>
                  </div>
                )}
                {clinicalVisit?.plan && (
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Plan</p>
                    <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{clinicalVisit.plan}</p>
                  </div>
                )}
                {delivery.notes && (
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Delivery Notes</p>
                    <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{delivery.notes}</p>
                  </div>
                )}
              </div>
            </section>
          )}

        </div>
      </div>
    </div>
  );
}

import * as styles from './CycleDetailOverlay.styles';
import { X, Armchair, FlaskConical, AlertTriangle, FileText, Activity } from 'bfd-icons';

import { IconButton } from 'bfd-core';
import type { TreatmentDelivery, TreatmentPlan } from 'bfd-core';
import { DELIVERY_STATUS_LABELS, DELIVERY_STATUS_COLORS } from 'bfd-core';
import type { Appointment } from 'bfd-core';
import type { ClinicalVisit, Vitals } from 'bfd-core';
import { mockChairs } from 'bfd-core';

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
    <div className={styles.style5}>
      <span className={styles.style6}>{icon}</span>
      <h3 className={styles.style7}>{title}</h3>
    </div>
  );
}

function Field({ label, value, wide }: { label: string; value?: string | number | null; wide?: boolean }) {
  if (value == null || value === '') return null;
  return (
    <div className={wide ? 'col-span-2' : ''}>
      <p className={styles.style8}>{label}</p>
      <p className={styles.style9}>{value}</p>
    </div>
  );
}

const SEVERITY_COLORS: Record<string, string> = {
  mild:     'bg-warning-surface-soft text-warning-emphasis border-warning-surface-border',
  moderate: 'bg-orange-surface-soft text-orange-emphasis border-orange-surface-border',
  severe:   'bg-destructive/10 text-destructive border-destructive/20',
};

export function CycleDetailOverlay({ delivery, plan, appointment, clinicalVisit, vitals, onClose }: Props) {
  const c = delivery.chemoDetails;
  const cycleNum = c?.cycleNumber ?? delivery.sessionNumber;
  const chair    = appointment?.chairId ? mockChairs.find(ch => ch.id === appointment.chairId) : undefined;

  return (
    <div className={styles.style10}>
      <div className={styles.style11}>

        {/* Header */}
        <div className={styles.style12}>
          <div>
            <h2 className={styles.style13}>
              Cycle #{cycleNum}
              {plan?.regimen ? ` — ${plan.regimen}` : ''}
            </h2>
            <div className={styles.style14}>
              <span className={styles.style15}>{fmtDate(delivery.date)}</span>
              {c?.sessionType && (
                <span className={cn(
                  'text-xs px-2 py-0.5 rounded-full font-medium',
                  c.sessionType === 'inpatient' ? 'bg-info-soft text-info-emphasis' : 'bg-muted text-muted-foreground',
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
            className={styles.style16}
          />
        </div>

        <div className={styles.style17}>

          {/* ── Cycle Overview ── */}
          <section>
            <SectionHeader icon={<Activity size={14} />} title="Cycle Overview" />
            <div className={styles.style18}>
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
              <div className={styles.style19}>
                <Field label="Chair"     value={chair.name} />
                <Field label="Bay"       value={chair.bay} />
                <Field label="Center"    value={chair.center} />
              </div>
            ) : (
              <p className={styles.style20}>No chair assignment recorded</p>
            )}
          </section>

          {/* ── Pre-Chemo Vitals ── */}
          {vitals && (
            <section>
              <SectionHeader icon={<Activity size={14} />} title="Pre-Chemo Vitals" />
              <div className={styles.style21}>
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
              <div className={styles.style22}>
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
              <div className={styles.style23}>
                <table className={styles.style24}>
                  <thead>
                    <tr className={styles.style25}>
                      {['Drug', 'Planned Dose', 'Given Dose', 'Route', 'Notes'].map(h => (
                        <th key={h} className={styles.style26}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {c.drugs.map((d, i) => {
                      const reduced = d.givenDose !== d.plannedDose;
                      return (
                        <tr key={i} className={styles.style27}>
                          <td className={styles.style28}>{d.name}</td>
                          <td className={styles.style29}>{d.plannedDose}</td>
                          <td className={styles.style3Class(reduced ? 'text-warning-emphasis-mid' : 'text-foreground')}>
                            {d.givenDose}
                            {reduced && <span className={styles.style30}>Reduced</span>}
                          </td>
                          <td className={styles.style29}>{d.route}</td>
                          <td className={styles.style29}>{d.notes ?? '—'}</td>
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
              <div className={styles.style31}>
                {clinicalVisit.adverseEvents.map(ev => (
                  <div key={ev.id} className={cn(
                    'flex items-start gap-3 px-4 py-3 rounded-xl border text-sm',
                    SEVERITY_COLORS[ev.severity],
                  )}>
                    <div className={styles.style32}>
                      <AlertTriangle size={14} />
                    </div>
                    <div className={styles.style33}>
                      <div className={styles.style34}>
                        <span className={styles.style35}>{ev.severity}</span>
                        <span className={styles.style36}>{ev.time}</span>
                      </div>
                      <p className={styles.style37}>{ev.description}</p>
                      {ev.actionTaken && (
                        <p className={styles.style38}>Action: {ev.actionTaken}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.style20}>No adverse events recorded</p>
            )}
          </section>

          {/* ── Clinical Notes ── */}
          {(clinicalVisit?.clinicalNotes || clinicalVisit?.plan || delivery.notes) && (
            <section>
              <SectionHeader icon={<FileText size={14} />} title="Clinical Notes" />
              <div className={styles.style39}>
                {clinicalVisit?.clinicalNotes && (
                  <div>
                    <p className={styles.style40}>Notes</p>
                    <p className={styles.style41}>{clinicalVisit.clinicalNotes}</p>
                  </div>
                )}
                {clinicalVisit?.plan && (
                  <div>
                    <p className={styles.style40}>Plan</p>
                    <p className={styles.style41}>{clinicalVisit.plan}</p>
                  </div>
                )}
                {delivery.notes && (
                  <div>
                    <p className={styles.style40}>Delivery Notes</p>
                    <p className={styles.style41}>{delivery.notes}</p>
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

import * as styles from './ToxicityTab.styles';
import { useState } from 'react';
import { AlertOctagon, Plus, Hospital } from 'bfd-icons';

import type {
  ToxicityRecord, ToxicityGrade, TreatmentPlan,
} from 'bfd-core';
import { CTCAE_CATEGORY_LABELS, CTCAE_GRADE_DESCRIPTIONS } from 'bfd-core';
import { AddToxicityOverlay } from '../../patterns/clinical/AddToxicityOverlay';

interface Props {
  patientId:       string;
  plans:           TreatmentPlan[];
  records:         ToxicityRecord[];
  onRecordsChange: React.Dispatch<React.SetStateAction<ToxicityRecord[]>>;
}

const GRADE_COLORS: Record<ToxicityGrade, string> = {
  1: 'bg-success-soft text-success-emphasis',
  2: 'bg-warning-soft text-warning-emphasis',
  3: 'bg-orange-soft text-orange-emphasis',
  4: 'bg-destructive/10 text-destructive',
  5: 'bg-error-solid text-white',
};

const CATEGORY_COLORS: Record<string, string> = {
  hematologic:     'bg-purple-soft text-purple-emphasis',
  gastrointestinal:'bg-orange-soft text-orange-emphasis',
  neurological:    'bg-info-soft text-info-emphasis',
  dermatological:  'bg-accent text-secondary',
  constitutional:  'bg-muted text-muted-foreground',
  infections:      'bg-error-soft text-error-emphasis',
  renal:           'bg-cyan-soft text-cyan-emphasis',
  hepatic:         'bg-warning-soft text-warning-emphasis',
  cardiovascular:  'bg-rose-soft text-rose-emphasis',
  pulmonary:       'bg-sky-soft text-sky-emphasis',
  musculoskeletal: 'bg-teal-soft text-teal-emphasis',
  immunological:   'bg-violet-soft text-violet-emphasis',
  pain:            'bg-destructive/10 text-destructive',
  endocrine:       'bg-lime-soft text-lime-emphasis',
};

function fmtDate(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function ToxicityTab({ patientId, plans, records, onRecordsChange }: Props) {
  const [addOpen, setAddOpen] = useState(false);
  const sorted = [...records].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className={styles.style3}>
      <div className={styles.style4}>
        <button
          onClick={() => setAddOpen(true)}
          className={styles.style5}
        >
          <Plus size={15} />
          Record Toxicity
        </button>
      </div>

      {sorted.length === 0 ? (
        <div className={styles.style6}>
          <AlertOctagon size={36} className={styles.style7} />
          <p className={styles.style8}>No toxicity events recorded</p>
          <p className={styles.style9}>Adverse events and complications will be listed here.</p>
        </div>
      ) : (
        <div className={styles.style3}>
          {sorted.map(rec => {
            const linkedPlan = plans.find(p => p.id === rec.planId);
            return (
              <div key={rec.id} className={styles.style10}>
                {/* Header */}
                <div className={styles.style11}>
                  <div>
                    <div className={styles.style12}>
                      <p className={styles.style13}>{rec.toxicityType}</p>
                      <span className={styles.style1Class(CATEGORY_COLORS[rec.ctcaeCategory] ?? 'bg-muted text-muted-foreground')}>
                        {CTCAE_CATEGORY_LABELS[rec.ctcaeCategory]}
                      </span>
                    </div>
                    <div className={styles.style14}>
                      <span>{fmtDate(rec.date)}</span>
                      {linkedPlan && (
                        <>
                          <span className={styles.style15}>·</span>
                          <span>{linkedPlan.modality.charAt(0).toUpperCase() + linkedPlan.modality.slice(1)}{rec.cycleNumber ? ` Cycle ${rec.cycleNumber}` : ''}</span>
                        </>
                      )}
                      {rec.hospitalAdmission && (
                        <>
                          <span className={styles.style15}>·</span>
                          <span className={styles.style16}>
                            <Hospital size={11} /> Hospitalised
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className={styles.style17}>
                    <span className={styles.style2Class(GRADE_COLORS[rec.grade])}>
                      Grade {rec.grade} (CTCAE)
                    </span>
                    <span className={styles.style18}>
                      {CTCAE_GRADE_DESCRIPTIONS[rec.grade].split(' — ')[0]}
                    </span>
                  </div>
                </div>

                {rec.hospitalAdmission && (rec.admissionDate || rec.dischargeDate) && (
                  <div className={styles.style19}>
                    <Hospital size={13} />
                    <span>
                      Admitted: {rec.admissionDate ? fmtDate(rec.admissionDate) : '—'}
                      {rec.dischargeDate ? ` → Discharged: ${fmtDate(rec.dischargeDate)}` : ' (ongoing)'}
                    </span>
                  </div>
                )}

                <div>
                  <p className={styles.style20}>Description</p>
                  <p className={styles.style21}>{rec.description}</p>
                </div>

                <div className={styles.style22}>
                  <p className={styles.style20}>Action Taken</p>
                  <p className={styles.style21}>{rec.actionTaken}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {addOpen && (
        <AddToxicityOverlay
          patientId={patientId}
          plans={plans}
          onSave={rec => {
            onRecordsChange(prev => [...prev, rec]);
            setAddOpen(false);
          }}
          onClose={() => setAddOpen(false)}
        />
      )}
    </div>
  );
}

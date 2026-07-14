import * as styles from './ResponseAssessmentTab.styles';
import { useState } from 'react';
import { BarChart2, Plus, TrendingDown, TrendingUp, Minus } from 'bfd-icons';

import type {
  ResponseAssessment, ResponseCategory, TreatmentPlan,
} from 'bfd-core';
import { RESPONSE_LABELS } from 'bfd-core';
import { AddResponseAssessmentOverlay } from '../../patterns/clinical/AddResponseAssessmentOverlay';

interface Props {
  patientId:           string;
  plans:               TreatmentPlan[];
  assessments:         ResponseAssessment[];
  onAssessmentsChange: React.Dispatch<React.SetStateAction<ResponseAssessment[]>>;
}

const RESPONSE_COLORS: Record<ResponseCategory, string> = {
  'complete-response':   'bg-success-soft text-success-emphasis',
  'partial-response':    'bg-info-soft text-info-emphasis',
  'stable-disease':      'bg-warning-soft text-warning-emphasis',
  'progressive-disease': 'bg-destructive/10 text-destructive',
};

const NON_TARGET_STATUS_LABELS: Record<string, string> = {
  present:        'Present',
  absent:         'Absent',
  stable:         'Stable',
  increased:      'Increased',
  decreased:      'Decreased',
  'not-evaluated':'Not Evaluated',
};

function fmtDate(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
}

export function ResponseAssessmentTab({ patientId, plans, assessments, onAssessmentsChange }: Props) {
  const [addOpen, setAddOpen] = useState(false);
  const sorted = [...assessments].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className={styles.style3}>
      <div className={styles.style4}>
        <button
          onClick={() => setAddOpen(true)}
          className={styles.style5}
        >
          <Plus size={15} />
          Record Assessment
        </button>
      </div>

      {sorted.length === 0 ? (
        <div className={styles.style6}>
          <BarChart2 size={36} className={styles.style7} />
          <p className={styles.style8}>No response assessments on record</p>
          <p className={styles.style9}>Tumour response data will appear here after imaging or biomarker review.</p>
        </div>
      ) : (
        <div className={styles.style3}>
          {sorted.map(ra => {
            const linkedPlan = plans.find(p => p.id === ra.planId);
            return (
              <div key={ra.id} className={styles.style10}>
                {/* Header row */}
                <div className={styles.style11}>
                  <div>
                    <p className={styles.style12}>{fmtDate(ra.date)}</p>
                    <div className={styles.style13}>
                      <p className={styles.style14}>{ra.imagingUsed}</p>
                      {linkedPlan && (
                        <>
                          <span className={styles.style15}>·</span>
                          <p className={styles.style14}>
                            {linkedPlan.modality.charAt(0).toUpperCase() + linkedPlan.modality.slice(1)}
                            {ra.cycleNumber ? ` — Cycle ${ra.cycleNumber}` : ''}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                  <span className={styles.style1Class(RESPONSE_COLORS[ra.recist])}>
                    {RESPONSE_LABELS[ra.recist]}
                  </span>
                </div>

                {/* Response text */}
                <div>
                  <p className={styles.style16}>Response / Finding</p>
                  <p className={styles.style17}>{ra.response}</p>
                </div>

                {/* Target Lesions */}
                {ra.targetLesions && ra.targetLesions.length > 0 && (
                  <div className={styles.style18}>
                    <p className={styles.style19}>Target Lesions (RECIST 1.1)</p>
                    <div className={styles.style20}>
                      <table className={styles.style21}>
                        <thead>
                          <tr className={styles.style22}>
                            {['Lesion', 'Baseline', 'Current', 'Change'].map(h => (
                              <th key={h} className={styles.style23}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {ra.targetLesions.map((l, i) => (
                            <tr key={i} className={styles.style24}>
                              <td className={styles.style25}>{l.name}</td>
                              <td className={styles.style26}>{l.baseline} mm</td>
                              <td className={styles.style27}>{l.current} mm</td>
                              <td className={styles.style2Class(l.change !== undefined && l.change < 0 ? 'text-success-emphasis-mid'
                                : l.change !== undefined && l.change > 0 ? 'text-destructive'
                                : 'text-muted-foreground',
                              )}>
                                {l.change !== undefined && l.change < 0 && <TrendingDown size={11} />}
                                {l.change !== undefined && l.change > 0 && <TrendingUp size={11} />}
                                {l.change !== undefined && l.change === 0 && <Minus size={11} />}
                                {l.change !== undefined ? `${l.change > 0 ? '+' : ''}${l.change}%` : '—'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Non-Target Lesions */}
                {ra.nonTargetLesions && ra.nonTargetLesions.length > 0 && (
                  <div className={styles.style18}>
                    <p className={styles.style19}>Non-Target Lesions</p>
                    <div className={styles.style28}>
                      {ra.nonTargetLesions.map((l, i) => (
                        <div key={i} className={styles.style29}>
                          <span className={styles.style30}>{l.name}</span>
                          <span className={styles.style31}>— {NON_TARGET_STATUS_LABELS[l.status] ?? l.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {ra.notes && (
                  <div className={styles.style18}>
                    <p className={styles.style16}>Notes</p>
                    <p className={styles.style17}>{ra.notes}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {addOpen && (
        <AddResponseAssessmentOverlay
          patientId={patientId}
          plans={plans}
          onSave={ra => {
            onAssessmentsChange(prev => [...prev, ra]);
            setAddOpen(false);
          }}
          onClose={() => setAddOpen(false)}
        />
      )}
    </div>
  );
}

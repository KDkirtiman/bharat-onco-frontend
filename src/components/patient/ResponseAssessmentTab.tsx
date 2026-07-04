import { useState } from 'react';
import { BarChart2, Plus, TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { cn } from '../../lib/cn';
import type {
  ResponseAssessment, ResponseCategory, TreatmentPlan,
} from '../../datapoints/treatment';
import { RESPONSE_LABELS } from '../../datapoints/treatment';
import { AddResponseAssessmentOverlay } from '../../patterns/clinical/AddResponseAssessmentOverlay';

interface Props {
  patientId:           string;
  plans:               TreatmentPlan[];
  assessments:         ResponseAssessment[];
  onAssessmentsChange: React.Dispatch<React.SetStateAction<ResponseAssessment[]>>;
}

const RESPONSE_COLORS: Record<ResponseCategory, string> = {
  'complete-response':   'bg-green-100 text-green-700',
  'partial-response':    'bg-blue-100 text-blue-700',
  'stable-disease':      'bg-amber-100 text-amber-700',
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
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <button
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus size={15} />
          Record Assessment
        </button>
      </div>

      {sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <BarChart2 size={36} className="text-muted-foreground/40 mb-3" />
          <p className="text-sm font-medium text-muted-foreground">No response assessments on record</p>
          <p className="text-xs text-muted-foreground mt-1">Tumour response data will appear here after imaging or biomarker review.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sorted.map(ra => {
            const linkedPlan = plans.find(p => p.id === ra.planId);
            return (
              <div key={ra.id} className="bg-card border border-border rounded-xl p-5 space-y-4">
                {/* Header row */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{fmtDate(ra.date)}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-xs text-muted-foreground">{ra.imagingUsed}</p>
                      {linkedPlan && (
                        <>
                          <span className="text-muted-foreground/40 text-xs">·</span>
                          <p className="text-xs text-muted-foreground">
                            {linkedPlan.modality.charAt(0).toUpperCase() + linkedPlan.modality.slice(1)}
                            {ra.cycleNumber ? ` — Cycle ${ra.cycleNumber}` : ''}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                  <span className={cn('text-xs px-2.5 py-1 rounded-full font-medium shrink-0', RESPONSE_COLORS[ra.recist])}>
                    {RESPONSE_LABELS[ra.recist]}
                  </span>
                </div>

                {/* Response text */}
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Response / Finding</p>
                  <p className="text-sm text-foreground leading-relaxed">{ra.response}</p>
                </div>

                {/* Target Lesions */}
                {ra.targetLesions && ra.targetLesions.length > 0 && (
                  <div className="border-t border-border pt-3">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">Target Lesions (RECIST 1.1)</p>
                    <div className="rounded-lg border border-border overflow-hidden">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="bg-muted/50">
                            {['Lesion', 'Baseline', 'Current', 'Change'].map(h => (
                              <th key={h} className="px-3 py-2 text-left font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {ra.targetLesions.map((l, i) => (
                            <tr key={i} className="border-t border-border">
                              <td className="px-3 py-2 font-medium text-foreground">{l.name}</td>
                              <td className="px-3 py-2 text-muted-foreground">{l.baseline} mm</td>
                              <td className="px-3 py-2 text-foreground">{l.current} mm</td>
                              <td className={cn('px-3 py-2 font-semibold flex items-center gap-1',
                                l.change !== undefined && l.change < 0 ? 'text-green-600'
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
                  <div className="border-t border-border pt-3">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">Non-Target Lesions</p>
                    <div className="flex flex-wrap gap-2">
                      {ra.nonTargetLesions.map((l, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-xs bg-muted/50 border border-border rounded-lg px-2.5 py-1">
                          <span className="text-muted-foreground">{l.name}</span>
                          <span className="text-foreground font-medium">— {NON_TARGET_STATUS_LABELS[l.status] ?? l.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {ra.notes && (
                  <div className="border-t border-border pt-3">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Notes</p>
                    <p className="text-sm text-foreground leading-relaxed">{ra.notes}</p>
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

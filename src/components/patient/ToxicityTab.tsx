import { useState } from 'react';
import { AlertOctagon, Plus, Hospital } from 'lucide-react';
import { cn } from '../../lib/cn';
import type {
  ToxicityRecord, ToxicityGrade, TreatmentPlan,
} from '../../datapoints/treatment';
import { CTCAE_CATEGORY_LABELS, CTCAE_GRADE_DESCRIPTIONS } from '../../datapoints/treatment';
import { AddToxicityOverlay } from '../../patterns/clinical/AddToxicityOverlay';

interface Props {
  patientId:       string;
  plans:           TreatmentPlan[];
  records:         ToxicityRecord[];
  onRecordsChange: React.Dispatch<React.SetStateAction<ToxicityRecord[]>>;
}

const GRADE_COLORS: Record<ToxicityGrade, string> = {
  1: 'bg-green-100 text-green-700',
  2: 'bg-amber-100 text-amber-700',
  3: 'bg-orange-100 text-orange-700',
  4: 'bg-destructive/10 text-destructive',
  5: 'bg-red-900 text-white',
};

const CATEGORY_COLORS: Record<string, string> = {
  hematologic:     'bg-purple-100 text-purple-700',
  gastrointestinal:'bg-orange-100 text-orange-700',
  neurological:    'bg-blue-100 text-blue-700',
  dermatological:  'bg-pink-100 text-pink-700',
  constitutional:  'bg-muted text-muted-foreground',
  infections:      'bg-red-100 text-red-700',
  renal:           'bg-cyan-100 text-cyan-700',
  hepatic:         'bg-amber-100 text-amber-700',
  cardiovascular:  'bg-rose-100 text-rose-700',
  pulmonary:       'bg-sky-100 text-sky-700',
  musculoskeletal: 'bg-teal-100 text-teal-700',
  immunological:   'bg-violet-100 text-violet-700',
  pain:            'bg-destructive/10 text-destructive',
  endocrine:       'bg-lime-100 text-lime-700',
};

function fmtDate(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function ToxicityTab({ patientId, plans, records, onRecordsChange }: Props) {
  const [addOpen, setAddOpen] = useState(false);
  const sorted = [...records].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <button
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus size={15} />
          Record Toxicity
        </button>
      </div>

      {sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <AlertOctagon size={36} className="text-muted-foreground/40 mb-3" />
          <p className="text-sm font-medium text-muted-foreground">No toxicity events recorded</p>
          <p className="text-xs text-muted-foreground mt-1">Adverse events and complications will be listed here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sorted.map(rec => {
            const linkedPlan = plans.find(p => p.id === rec.planId);
            return (
              <div key={rec.id} className="bg-card border border-border rounded-xl p-5 space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-foreground">{rec.toxicityType}</p>
                      <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide', CATEGORY_COLORS[rec.ctcaeCategory] ?? 'bg-muted text-muted-foreground')}>
                        {CTCAE_CATEGORY_LABELS[rec.ctcaeCategory]}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{fmtDate(rec.date)}</span>
                      {linkedPlan && (
                        <>
                          <span className="text-muted-foreground/40">·</span>
                          <span>{linkedPlan.modality.charAt(0).toUpperCase() + linkedPlan.modality.slice(1)}{rec.cycleNumber ? ` Cycle ${rec.cycleNumber}` : ''}</span>
                        </>
                      )}
                      {rec.hospitalAdmission && (
                        <>
                          <span className="text-muted-foreground/40">·</span>
                          <span className="flex items-center gap-0.5 text-destructive font-medium">
                            <Hospital size={11} /> Hospitalised
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className={cn('text-xs px-2.5 py-1 rounded-full font-semibold', GRADE_COLORS[rec.grade])}>
                      Grade {rec.grade} (CTCAE)
                    </span>
                    <span className="text-[10px] text-muted-foreground italic">
                      {CTCAE_GRADE_DESCRIPTIONS[rec.grade].split(' — ')[0]}
                    </span>
                  </div>
                </div>

                {rec.hospitalAdmission && (rec.admissionDate || rec.dischargeDate) && (
                  <div className="bg-destructive/5 border border-destructive/20 rounded-lg px-3 py-2 text-xs text-destructive flex items-center gap-3">
                    <Hospital size={13} />
                    <span>
                      Admitted: {rec.admissionDate ? fmtDate(rec.admissionDate) : '—'}
                      {rec.dischargeDate ? ` → Discharged: ${fmtDate(rec.dischargeDate)}` : ' (ongoing)'}
                    </span>
                  </div>
                )}

                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Description</p>
                  <p className="text-sm text-foreground leading-relaxed">{rec.description}</p>
                </div>

                <div className="pt-2 border-t border-border">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Action Taken</p>
                  <p className="text-sm text-foreground leading-relaxed">{rec.actionTaken}</p>
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

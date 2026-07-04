import { useState } from 'react';
import { Plus, X, Save } from 'lucide-react';
import { cn } from '../../lib/cn';
import type { PalliativeCareRecord, SymptomSeverity } from '../../datapoints/treatment';

interface Props {
  patientId:       string;
  records:         PalliativeCareRecord[];
  onRecordsChange: React.Dispatch<React.SetStateAction<PalliativeCareRecord[]>>;
}

type MedRow = { id: string; drug: string; dose: string; frequency: string; };

const SEVERITIES: SymptomSeverity[] = ['Mild', 'Moderate', 'Severe'];

const SEV_ACTIVE: Record<SymptomSeverity, string> = {
  Mild:     'bg-green-500 text-white',
  Moderate: 'bg-orange-500 text-white',
  Severe:   'bg-red-500 text-white',
};
const SEV_INACTIVE = 'bg-primary/10 text-primary';

const SYMPTOMS: { key: keyof NonNullable<PalliativeCareRecord['symptoms']>; label: string }[] = [
  { key: 'dyspnea',  label: 'Dyspnea'  },
  { key: 'pain',     label: 'Pain'     },
  { key: 'fatigue',  label: 'Fatigue'  },
  { key: 'anorexia', label: 'Anorexia' },
];

function getPainLabel(score: number): { text: string; cls: string } {
  if (score <= 3) return { text: 'Mild',     cls: 'bg-green-100 text-green-700'   };
  if (score <= 6) return { text: 'Moderate', cls: 'bg-orange-100 text-orange-700' };
  return              { text: 'Severe',   cls: 'bg-red-100 text-red-700'     };
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-4">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      {children}
    </div>
  );
}

export function PalliativeCareTab({ patientId, records, onRecordsChange }: Props) {
  const latest = [...records].sort((a, b) => b.date.localeCompare(a.date))[0];

  const [painScore,  setPainScore]  = useState<number>(latest?.painScore ?? 0);
  const [symptoms,   setSymptoms]   = useState<NonNullable<PalliativeCareRecord['symptoms']>>(
    latest?.symptoms ?? {},
  );
  const [meds,       setMeds]       = useState<MedRow[]>(
    latest?.medications?.map(m => ({ ...m })) ?? [],
  );
  const [goalsOfCare, setGoalsOfCare] = useState(latest?.goalsOfCare ?? '');

  const painLabel = getPainLabel(painScore);

  function setSeverity(key: keyof NonNullable<PalliativeCareRecord['symptoms']>, val: SymptomSeverity) {
    setSymptoms(prev => ({ ...prev, [key]: prev[key] === val ? undefined : val }));
  }

  function addMed() {
    setMeds(prev => [...prev, { id: `med-${Date.now()}`, drug: '', dose: '', frequency: '' }]);
  }

  function updateMed(id: string, field: keyof Omit<MedRow, 'id'>, value: string) {
    setMeds(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m));
  }

  function removeMed(id: string) {
    setMeds(prev => prev.filter(m => m.id !== id));
  }

  function handleSave() {
    const record: PalliativeCareRecord = {
      id:          `pc-${Date.now()}`,
      patientId,
      date:        new Date().toISOString().split('T')[0],
      painScore,
      symptoms:    Object.keys(symptoms).length ? symptoms : undefined,
      medications: meds.filter(m => m.drug.trim()).length
        ? meds.filter(m => m.drug.trim())
        : undefined,
      goalsOfCare: goalsOfCare.trim() || undefined,
    };
    onRecordsChange(prev => [...prev, record]);
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-foreground">Palliative Care</h2>

      {/* Pain Assessment */}
      <SectionCard title="Pain Assessment (NRS)">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground">Pain Score: {painScore}/10</span>
          <span className={cn('text-xs font-semibold px-3 py-1 rounded-full', painLabel.cls)}>
            {painLabel.text}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={10}
          step={1}
          value={painScore}
          onChange={e => setPainScore(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer accent-primary"
          style={{
            background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${painScore * 10}%, var(--color-muted) ${painScore * 10}%, var(--color-muted) 100%)`,
          }}
        />
        <div className="flex justify-between text-[11px] text-muted-foreground mt-1.5">
          <span>0 – No Pain</span>
          <span>5 – Moderate</span>
          <span>10 – Worst Pain</span>
        </div>
      </SectionCard>

      {/* Symptom Severity */}
      <SectionCard title="Symptom Severity">
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          {SYMPTOMS.map(sym => (
            <div key={sym.key}>
              <p className="text-xs font-medium text-foreground mb-2">{sym.label}</p>
              <div className="flex rounded-lg overflow-hidden border border-border">
                {SEVERITIES.map(sev => (
                  <button
                    key={sev}
                    onClick={() => setSeverity(sym.key, sev)}
                    className={cn(
                      'flex-1 py-2 text-xs font-semibold transition-colors',
                      symptoms[sym.key] === sev ? SEV_ACTIVE[sev] : SEV_INACTIVE,
                    )}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Medications */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground">Medications</h3>
          <button
            onClick={addMed}
            className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors border border-primary/30 rounded-lg px-2.5 py-1.5"
          >
            <Plus size={13} /> Add
          </button>
        </div>

        {meds.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No medications added. Click "+ Add" to add one.</p>
        ) : (
          <div className="space-y-3">
            {meds.map(m => (
              <div key={m.id} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-3 items-end">
                <div>
                  <label className="block text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Drug</label>
                  <input
                    value={m.drug}
                    onChange={e => updateMed(m.id, 'drug', e.target.value)}
                    placeholder="Drug name"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Dose</label>
                  <input
                    value={m.dose}
                    onChange={e => updateMed(m.id, 'dose', e.target.value)}
                    placeholder="e.g. 10mg"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Frequency</label>
                  <input
                    value={m.frequency}
                    onChange={e => updateMed(m.id, 'frequency', e.target.value)}
                    placeholder="e.g. Q4H PRN"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <button
                  onClick={() => removeMed(m.id)}
                  className="mb-0.5 p-2 text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-destructive/5"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Goals of Care */}
      <SectionCard title="Goals of Care Discussion">
        <textarea
          rows={5}
          value={goalsOfCare}
          onChange={e => setGoalsOfCare(e.target.value)}
          placeholder="Document patient and family preferences, advance directives, quality of life goals..."
          className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
        />
      </SectionCard>

      {/* Save */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Save size={15} />
          Save Palliative Care Assessment
        </button>
      </div>
    </div>
  );
}

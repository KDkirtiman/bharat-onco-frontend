import * as styles from './PalliativeCareTab.styles';
import { useState } from 'react';
import { Plus, X, Save } from 'bfd-icons';

import type { PalliativeCareRecord, SymptomSeverity } from 'bfd-core';
import { cn } from 'bfd-core';

interface Props {
  patientId:       string;
  records:         PalliativeCareRecord[];
  onRecordsChange: React.Dispatch<React.SetStateAction<PalliativeCareRecord[]>>;
}

type MedRow = { id: string; drug: string; dose: string; frequency: string; };

const SEVERITIES: SymptomSeverity[] = ['Mild', 'Moderate', 'Severe'];

const SEV_ACTIVE: Record<SymptomSeverity, string> = {
  Mild:     'bg-success-soft0 text-white',
  Moderate: 'bg-orange-surface-soft text-white',
  Severe:   'bg-error-solid-mid text-white',
};
const SEV_INACTIVE = 'bg-primary/10 text-primary';

const SYMPTOMS: { key: keyof NonNullable<PalliativeCareRecord['symptoms']>; label: string }[] = [
  { key: 'dyspnea',  label: 'Dyspnea'  },
  { key: 'pain',     label: 'Pain'     },
  { key: 'fatigue',  label: 'Fatigue'  },
  { key: 'anorexia', label: 'Anorexia' },
];

function getPainLabel(score: number): { text: string; cls: string } {
  if (score <= 3) return { text: 'Mild',     cls: 'bg-success-soft text-success-emphasis'   };
  if (score <= 6) return { text: 'Moderate', cls: 'bg-orange-soft text-orange-emphasis' };
  return              { text: 'Severe',   cls: 'bg-error-soft text-error-emphasis'     };
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className={styles.style3}>
      <h3 className={styles.style4}>{title}</h3>
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
    <div className={styles.style5}>
      <h2 className={styles.style6}>Palliative Care</h2>

      {/* Pain Assessment */}
      <SectionCard title="Pain Assessment (NRS)">
        <div className={styles.style7}>
          <span className={styles.style8}>Pain Score: {painScore}/10</span>
          <span className={styles.style1Class(painLabel.cls)}>
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
          className={styles.style9}
          style={{
            background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${painScore * 10}%, var(--color-muted) ${painScore * 10}%, var(--color-muted) 100%)`,
          }}
        />
        <div className={styles.style10}>
          <span>0 – No Pain</span>
          <span>5 – Moderate</span>
          <span>10 – Worst Pain</span>
        </div>
      </SectionCard>

      {/* Symptom Severity */}
      <SectionCard title="Symptom Severity">
        <div className={styles.style11}>
          {SYMPTOMS.map(sym => (
            <div key={sym.key}>
              <p className={styles.style12}>{sym.label}</p>
              <div className={styles.style13}>
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
      <div className={styles.style14}>
        <div className={styles.style15}>
          <h3 className={styles.style4}>Medications</h3>
          <button
            onClick={addMed}
            className={styles.style16}
          >
            <Plus size={13} /> Add
          </button>
        </div>

        {meds.length === 0 ? (
          <p className={styles.style17}>No medications added. Click "+ Add" to add one.</p>
        ) : (
          <div className={styles.style18}>
            {meds.map(m => (
              <div key={m.id} className={styles.style19}>
                <div>
                  <label className={styles.style20}>Drug</label>
                  <input
                    value={m.drug}
                    onChange={e => updateMed(m.id, 'drug', e.target.value)}
                    placeholder="Drug name"
                    className={styles.style21}
                  />
                </div>
                <div>
                  <label className={styles.style20}>Dose</label>
                  <input
                    value={m.dose}
                    onChange={e => updateMed(m.id, 'dose', e.target.value)}
                    placeholder="e.g. 10mg"
                    className={styles.style21}
                  />
                </div>
                <div>
                  <label className={styles.style20}>Frequency</label>
                  <input
                    value={m.frequency}
                    onChange={e => updateMed(m.id, 'frequency', e.target.value)}
                    placeholder="e.g. Q4H PRN"
                    className={styles.style21}
                  />
                </div>
                <button
                  onClick={() => removeMed(m.id)}
                  className={styles.style22}
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
          className={styles.style23}
        />
      </SectionCard>

      {/* Save */}
      <div className={styles.style24}>
        <button
          onClick={handleSave}
          className={styles.style25}
        >
          <Save size={15} />
          Save Palliative Care Assessment
        </button>
      </div>
    </div>
  );
}

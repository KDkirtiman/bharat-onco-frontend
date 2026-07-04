import { useState } from 'react';
import { Save } from 'lucide-react';
import { cn } from '../../lib/cn';
import type { SurvivorshipRecord, DiseaseStatus, ToxicityGradeSimple } from '../../datapoints/treatment';

interface Props {
  patientId:       string;
  records:         SurvivorshipRecord[];
  onRecordsChange: React.Dispatch<React.SetStateAction<SurvivorshipRecord[]>>;
}

const DISEASE_STATUS: DiseaseStatus[] = ['NED', 'Recurrence', 'Metastasis'];
const TOXICITY_GRADES: ToxicityGradeSimple[] = ['None', 'Mild', 'Moderate', 'Severe'];

const LATE_TOXICITY_ITEMS: { key: keyof NonNullable<SurvivorshipRecord['lateToxicity']>; label: string }[] = [
  { key: 'peripheralNeuropathy', label: 'Peripheral Neuropathy'  },
  { key: 'cognitiveImpairment',  label: 'Cognitive Impairment'   },
  { key: 'cardiacDysfunction',   label: 'Cardiac Dysfunction'     },
  { key: 'pulmonaryFibrosis',    label: 'Pulmonary Fibrosis'      },
  { key: 'secondaryMalignancy',  label: 'Secondary Malignancy'    },
];

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-4">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      {children}
    </div>
  );
}

export function SurvivorshipTab({ patientId, records, onRecordsChange }: Props) {
  const latest = [...records].sort((a, b) => b.followUpDate.localeCompare(a.followUpDate))[0];

  const [followUpDate,      setFollowUpDate]      = useState(latest?.followUpDate ?? '');
  const [status,            setStatus]            = useState<DiseaseStatus>(
    (latest?.status as DiseaseStatus) ?? 'NED',
  );
  const [recentScanResults, setRecentScanResults] = useState(latest?.recentScanResults ?? '');
  const [cea,               setCea]               = useState<string>(String(latest?.tumorMarkers?.cea ?? ''));
  const [ca199,             setCa199]             = useState<string>(String(latest?.tumorMarkers?.ca199 ?? ''));
  const [afp,               setAfp]               = useState<string>(String(latest?.tumorMarkers?.afp ?? ''));
  const [lateToxicity,      setLateToxicity]      = useState<NonNullable<SurvivorshipRecord['lateToxicity']>>(
    latest?.lateToxicity ?? {},
  );

  function handleSave() {
    const record: SurvivorshipRecord = {
      id:                `sr-${Date.now()}`,
      patientId,
      followUpDate:      followUpDate || new Date().toISOString().split('T')[0],
      status,
      recentScanResults: recentScanResults.trim() || undefined,
      tumorMarkers: {
        cea:   cea   ? Number(cea)   : undefined,
        ca199: ca199 ? Number(ca199) : undefined,
        afp:   afp   ? Number(afp)   : undefined,
      },
      lateToxicity: Object.keys(lateToxicity).length ? lateToxicity : undefined,
    };
    onRecordsChange(prev => [...prev, record]);
  }

  const STATUS_COLORS: Record<DiseaseStatus, string> = {
    NED:        'bg-green-500 text-white',
    Recurrence: 'bg-primary text-primary-foreground',
    Metastasis: 'bg-primary text-primary-foreground',
  };
  const STATUS_INACTIVE = 'bg-primary/10 text-primary';

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-foreground">Survivorship &amp; Follow-Up</h2>

      {/* Follow-Up Schedule */}
      <SectionCard title="Follow-Up Schedule">
        <div className="grid grid-cols-2 gap-4 items-end">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Next Follow-Up Date</label>
            <input
              type="date"
              value={followUpDate}
              onChange={e => setFollowUpDate(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Disease Status</label>
            <div className="flex rounded-lg overflow-hidden border border-border">
              {DISEASE_STATUS.map(s => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={cn(
                    'flex-1 py-2 text-sm font-semibold transition-colors',
                    status === s ? STATUS_COLORS[s] : STATUS_INACTIVE,
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Recent Scan Results */}
      <SectionCard title="Recent Scan Results">
        <textarea
          rows={4}
          value={recentScanResults}
          onChange={e => setRecentScanResults(e.target.value)}
          placeholder="Summary of recent imaging findings..."
          className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
        />
      </SectionCard>

      {/* Tumor Markers */}
      <SectionCard title="Tumor Markers">
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'CEA (ng/mL)',    value: cea,   onChange: setCea   },
            { label: 'CA 19-9 (U/mL)', value: ca199, onChange: setCa199 },
            { label: 'AFP (ng/mL)',    value: afp,   onChange: setAfp   },
          ].map(m => (
            <div key={m.label}>
              <label className="block text-xs font-medium text-foreground mb-1.5">{m.label}</label>
              <input
                type="number"
                step="0.1"
                min={0}
                value={m.value}
                onChange={e => m.onChange(e.target.value)}
                placeholder="0.0"
                className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Late Treatment Toxicity */}
      <SectionCard title="Late Treatment Toxicity">
        <div className="space-y-0 divide-y divide-border">
          {LATE_TOXICITY_ITEMS.map(item => (
            <div key={item.key} className="flex items-center justify-between py-3">
              <span className="text-sm text-foreground">{item.label}</span>
              <select
                value={lateToxicity[item.key] ?? 'None'}
                onChange={e => setLateToxicity(prev => ({
                  ...prev,
                  [item.key]: e.target.value as ToxicityGradeSimple,
                }))}
                className="text-sm rounded-lg border border-border bg-background text-foreground px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {TOXICITY_GRADES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Save */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Save size={15} />
          Save Follow-Up Data
        </button>
      </div>
    </div>
  );
}

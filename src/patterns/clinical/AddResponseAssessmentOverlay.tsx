import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { cn } from '../../lib/cn';
import type {
  ResponseAssessment, ResponseCategory, LesionMeasurement,
  NonTargetLesion, NonTargetLesionStatus, TreatmentPlan,
} from '../../datapoints/treatment';
import { IMAGING_USED_OPTIONS, RESPONSE_LABELS } from '../../datapoints/treatment';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../../components/layout/Modal';
import { Button } from '../../components/controls/Button';
import { FormField } from '../../components/controls/FormField';
import { Select } from '../../components/controls/Select';
import { TextField } from '../../components/controls/TextField';
import { Textarea } from '../../components/controls/Textarea';

interface Props {
  patientId: string;
  plans:     TreatmentPlan[];
  onSave:    (ra: ResponseAssessment) => void;
  onClose:   () => void;
}

const today = new Date().toISOString().split('T')[0];

const RESPONSE_COLORS: Record<ResponseCategory, string> = {
  'complete-response':   'bg-green-100 text-green-700 border-green-300',
  'partial-response':    'bg-blue-100 text-blue-700 border-blue-300',
  'stable-disease':      'bg-amber-100 text-amber-700 border-amber-300',
  'progressive-disease': 'bg-destructive/10 text-destructive border-destructive/30',
};

const NON_TARGET_STATUSES: { value: NonTargetLesionStatus; label: string }[] = [
  { value: 'present',       label: 'Present'       },
  { value: 'absent',        label: 'Absent'        },
  { value: 'stable',        label: 'Stable'        },
  { value: 'increased',     label: 'Increased'     },
  { value: 'decreased',     label: 'Decreased'     },
  { value: 'not-evaluated', label: 'Not Evaluated' },
];

export function AddResponseAssessmentOverlay({ patientId, plans, onSave, onClose }: Props) {
  const [date,             setDate]             = useState(today);
  const [imagingUsed,      setImagingUsed]      = useState('');
  const [planId,           setPlanId]           = useState('');
  const [cycleNumber,      setCycleNumber]      = useState('');
  const [recist,           setRecist]           = useState<ResponseCategory | ''>('');
  const [response,         setResponse]         = useState('');
  const [targetLesions,    setTargetLesions]    = useState<LesionMeasurement[]>([]);
  const [nonTargetLesions, setNonTargetLesions] = useState<NonTargetLesion[]>([]);
  const [notes,            setNotes]            = useState('');

  function addTargetLesion() {
    setTargetLesions(prev => [...prev, { name: '', baseline: 0, current: 0 }]);
  }

  function updateTargetLesion(i: number, field: keyof LesionMeasurement, val: string) {
    setTargetLesions(prev => prev.map((l, idx) => {
      if (idx !== i) return l;
      const updated = { ...l, [field]: field === 'name' ? val : Number(val) };
      if (field === 'baseline' || field === 'current') {
        const base = field === 'baseline' ? Number(val) : l.baseline;
        const cur  = field === 'current'  ? Number(val) : l.current;
        updated.change = base > 0 ? Math.round(((cur - base) / base) * 100) : 0;
      }
      return updated;
    }));
  }

  function addNonTargetLesion() {
    setNonTargetLesions(prev => [...prev, { name: '', status: 'present' }]);
  }

  function updateNonTargetLesion(i: number, field: 'name' | 'status', val: string) {
    setNonTargetLesions(prev => prev.map((l, idx) =>
      idx === i ? { ...l, [field]: val } : l,
    ));
  }

  const canSave = date && imagingUsed && recist && response.trim().length > 0;

  function handleSave() {
    if (!canSave || !recist) return;
    onSave({
      id:              `ra-${Date.now()}`,
      patientId,
      date,
      imagingUsed,
      recist,
      response,
      planId:          planId || undefined,
      cycleNumber:     cycleNumber ? Number(cycleNumber) : undefined,
      targetLesions:   targetLesions.length > 0 ? targetLesions : undefined,
      nonTargetLesions:nonTargetLesions.length > 0 ? nonTargetLesions : undefined,
      notes:           notes || undefined,
    });
  }

  return (
    <Modal onClose={onClose} size="2xl" className="bg-background border-0" overlayClassName="bg-black/50">
      <ModalHeader title="Record Response Assessment" onClose={onClose} />

      <ModalBody className="space-y-5">
          {/* Date + Imaging */}
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Assessment Date" labelVariant="uppercase" required>
              <TextField type="date" value={date} onChange={e => setDate(e.target.value)} />
            </FormField>
            <FormField label="Imaging / Modality Used" labelVariant="uppercase" required>
              <Select value={imagingUsed} onChange={e => setImagingUsed(e.target.value)}>
                <option value="">Select modality…</option>
                {IMAGING_USED_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </Select>
            </FormField>
          </div>

          {/* Plan + Cycle */}
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Linked Treatment Plan" labelVariant="uppercase">
              <Select value={planId} onChange={e => setPlanId(e.target.value)}>
                <option value="">None</option>
                {plans.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.modality.charAt(0).toUpperCase() + p.modality.slice(1)} — {p.regimen}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField label="Cycle Number" labelVariant="uppercase">
              <TextField type="number" min={1} value={cycleNumber} onChange={e => setCycleNumber(e.target.value)}
                placeholder="e.g. 3" />
            </FormField>
          </div>

          {/* RECIST */}
          <FormField label="RECIST Response" labelVariant="uppercase" required>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(RESPONSE_LABELS) as ResponseCategory[]).map(cat => (
                <button key={cat} onClick={() => setRecist(cat)}
                  className={cn(
                    'px-3 py-2 rounded-lg border text-sm font-medium text-left transition-all',
                    recist === cat
                      ? RESPONSE_COLORS[cat]
                      : 'border-border text-muted-foreground hover:border-primary/40',
                  )}>
                  {RESPONSE_LABELS[cat]}
                </button>
              ))}
            </div>
          </FormField>

          {/* Response narrative */}
          <FormField label="Response / Finding" labelVariant="uppercase" required>
            <Textarea rows={3} value={response} onChange={e => setResponse(e.target.value)}
              placeholder="Describe imaging findings and tumour response…" />
          </FormField>

          {/* Target Lesions */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Target Lesions (RECIST 1.1)</label>
              <button onClick={addTargetLesion}
                className="flex items-center gap-1 text-xs text-primary font-semibold hover:text-primary/80">
                <Plus size={13} /> Add Lesion
              </button>
            </div>
            {targetLesions.length > 0 && (
              <div className="rounded-lg border border-border overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-muted/50">
                      {['Lesion Name', 'Baseline (mm)', 'Current (mm)', 'Δ%', ''].map(h => (
                        <th key={h} className="px-2 py-2 text-left font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {targetLesions.map((l, i) => (
                      <tr key={i} className="border-t border-border">
                        <td className="px-2 py-1.5">
                          <input value={l.name} onChange={e => updateTargetLesion(i, 'name', e.target.value)}
                            placeholder="e.g. Right lung mass"
                            className="w-full px-2 py-1 text-xs rounded border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary/30" />
                        </td>
                        <td className="px-2 py-1.5 w-28">
                          <input type="number" value={l.baseline || ''} onChange={e => updateTargetLesion(i, 'baseline', e.target.value)}
                            className="w-full px-2 py-1 text-xs rounded border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary/30" />
                        </td>
                        <td className="px-2 py-1.5 w-28">
                          <input type="number" value={l.current || ''} onChange={e => updateTargetLesion(i, 'current', e.target.value)}
                            className="w-full px-2 py-1 text-xs rounded border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary/30" />
                        </td>
                        <td className={cn('px-2 py-1.5 w-16 font-semibold text-center text-xs',
                          l.change !== undefined && l.change < 0 ? 'text-green-600'
                          : l.change !== undefined && l.change > 0 ? 'text-destructive'
                          : 'text-muted-foreground',
                        )}>
                          {l.change !== undefined ? `${l.change > 0 ? '+' : ''}${l.change}%` : '—'}
                        </td>
                        <td className="px-2 py-1.5 w-8">
                          <button onClick={() => setTargetLesions(prev => prev.filter((_, idx) => idx !== i))}
                            className="p-1 text-muted-foreground hover:text-destructive transition-colors">
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Non-target Lesions */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Non-Target Lesions</label>
              <button onClick={addNonTargetLesion}
                className="flex items-center gap-1 text-xs text-primary font-semibold hover:text-primary/80">
                <Plus size={13} /> Add
              </button>
            </div>
            {nonTargetLesions.length > 0 && (
              <div className="rounded-lg border border-border overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-muted/50">
                      {['Site / Description', 'Status', ''].map(h => (
                        <th key={h} className="px-2 py-2 text-left font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {nonTargetLesions.map((l, i) => (
                      <tr key={i} className="border-t border-border">
                        <td className="px-2 py-1.5">
                          <input value={l.name} onChange={e => updateNonTargetLesion(i, 'name', e.target.value)}
                            placeholder="e.g. Mediastinal nodes"
                            className="w-full px-2 py-1 text-xs rounded border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary/30" />
                        </td>
                        <td className="px-2 py-1.5 w-40">
                          <select value={l.status} onChange={e => updateNonTargetLesion(i, 'status', e.target.value)}
                            className="w-full px-2 py-1 text-xs rounded border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary/30">
                            {NON_TARGET_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                          </select>
                        </td>
                        <td className="px-2 py-1.5 w-8">
                          <button onClick={() => setNonTargetLesions(prev => prev.filter((_, idx) => idx !== i))}
                            className="p-1 text-muted-foreground hover:text-destructive transition-colors">
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Notes */}
          <FormField label="Notes" labelVariant="uppercase">
            <Textarea rows={2} value={notes} onChange={e => setNotes(e.target.value)}
              placeholder="Additional clinical commentary…" />
          </FormField>
      </ModalBody>

      <ModalFooter>
        <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
        <Button size="sm" onClick={handleSave} disabled={!canSave}>
          Save Assessment
        </Button>
      </ModalFooter>
    </Modal>
  );
}

import * as styles from './AddResponseAssessmentOverlay.styles';
import { useState } from 'react';
import { Plus, Trash2 } from 'bfd-icons';

import type {
  ResponseAssessment, ResponseCategory, LesionMeasurement,
  NonTargetLesion, NonTargetLesionStatus, TreatmentPlan,
} from 'bfd-core';
import { IMAGING_USED_OPTIONS, RESPONSE_LABELS } from 'bfd-core';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'bfd-core';
import { Button } from 'bfd-core';
import { FormField } from 'bfd-core';
import { Select } from 'bfd-core';
import { TextField } from 'bfd-core';
import { Textarea } from 'bfd-core';
import { cn } from 'bfd-core';

interface Props {
  patientId: string;
  plans:     TreatmentPlan[];
  onSave:    (ra: ResponseAssessment) => void;
  onClose:   () => void;
}

const today = new Date().toISOString().split('T')[0];

const RESPONSE_COLORS: Record<ResponseCategory, string> = {
  'complete-response':   'bg-success-soft text-success-emphasis border-success-border',
  'partial-response':    'bg-info-soft text-info-emphasis border-info-border',
  'stable-disease':      'bg-warning-soft text-warning-emphasis border-warning-border',
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
    <Modal onClose={onClose} size="2xl" className={styles.style3} overlayClassName="bg-black/50">
      <ModalHeader title="Record Response Assessment" onClose={onClose} />

      <ModalBody className={styles.style4}>
          {/* Date + Imaging */}
          <div className={styles.style5}>
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
          <div className={styles.style5}>
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
            <div className={styles.style6}>
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
            <div className={styles.style7}>
              <label className={styles.style8}>Target Lesions (RECIST 1.1)</label>
              <button onClick={addTargetLesion}
                className={styles.style9}>
                <Plus size={13} /> Add Lesion
              </button>
            </div>
            {targetLesions.length > 0 && (
              <div className={styles.style10}>
                <table className={styles.style11}>
                  <thead>
                    <tr className={styles.style12}>
                      {['Lesion Name', 'Baseline (mm)', 'Current (mm)', 'Δ%', ''].map(h => (
                        <th key={h} className={styles.style13}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {targetLesions.map((l, i) => (
                      <tr key={i} className={styles.style14}>
                        <td className={styles.style15}>
                          <input value={l.name} onChange={e => updateTargetLesion(i, 'name', e.target.value)}
                            placeholder="e.g. Right lung mass"
                            className={styles.style16} />
                        </td>
                        <td className={styles.style17}>
                          <input type="number" value={l.baseline || ''} onChange={e => updateTargetLesion(i, 'baseline', e.target.value)}
                            className={styles.style16} />
                        </td>
                        <td className={styles.style17}>
                          <input type="number" value={l.current || ''} onChange={e => updateTargetLesion(i, 'current', e.target.value)}
                            className={styles.style16} />
                        </td>
                        <td className={styles.style2Class(l.change !== undefined && l.change < 0 ? 'text-success-emphasis-mid'
                          : l.change !== undefined && l.change > 0 ? 'text-destructive'
                          : 'text-muted-foreground',
                        )}>
                          {l.change !== undefined ? `${l.change > 0 ? '+' : ''}${l.change}%` : '—'}
                        </td>
                        <td className={styles.style18}>
                          <button onClick={() => setTargetLesions(prev => prev.filter((_, idx) => idx !== i))}
                            className={styles.style19}>
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
            <div className={styles.style7}>
              <label className={styles.style8}>Non-Target Lesions</label>
              <button onClick={addNonTargetLesion}
                className={styles.style9}>
                <Plus size={13} /> Add
              </button>
            </div>
            {nonTargetLesions.length > 0 && (
              <div className={styles.style10}>
                <table className={styles.style11}>
                  <thead>
                    <tr className={styles.style12}>
                      {['Site / Description', 'Status', ''].map(h => (
                        <th key={h} className={styles.style13}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {nonTargetLesions.map((l, i) => (
                      <tr key={i} className={styles.style14}>
                        <td className={styles.style15}>
                          <input value={l.name} onChange={e => updateNonTargetLesion(i, 'name', e.target.value)}
                            placeholder="e.g. Mediastinal nodes"
                            className={styles.style16} />
                        </td>
                        <td className={styles.style20}>
                          <select value={l.status} onChange={e => updateNonTargetLesion(i, 'status', e.target.value)}
                            className={styles.style16}>
                            {NON_TARGET_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                          </select>
                        </td>
                        <td className={styles.style18}>
                          <button onClick={() => setNonTargetLesions(prev => prev.filter((_, idx) => idx !== i))}
                            className={styles.style19}>
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

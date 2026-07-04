import { useState } from 'react';
import { cn } from '../../lib/cn';
import type {
  ToxicityRecord, ToxicityGrade, CtcaeCategory, TreatmentPlan,
} from '../../datapoints/treatment';
import {
  CTCAE_CATEGORY_LABELS, CTCAE_GRADE_DESCRIPTIONS, CTCAE_TYPE_SUGGESTIONS,
} from '../../datapoints/treatment';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../../components/layout/Modal';
import { Button } from '../../components/controls/Button';
import { FormField } from '../../components/controls/FormField';
import { Select } from '../../components/controls/Select';
import { TextField } from '../../components/controls/TextField';
import { Textarea } from '../../components/controls/Textarea';
import { Checkbox } from '../../components/controls/Checkbox';

interface Props {
  patientId: string;
  plans:     TreatmentPlan[];
  onSave:    (rec: ToxicityRecord) => void;
  onClose:   () => void;
}

const today = new Date().toISOString().split('T')[0];

const GRADE_ACTIVE: Record<ToxicityGrade, string> = {
  1: 'bg-green-100 text-green-700 border-green-300',
  2: 'bg-amber-100 text-amber-700 border-amber-300',
  3: 'bg-orange-100 text-orange-700 border-orange-300',
  4: 'bg-destructive/10 text-destructive border-destructive/30',
  5: 'bg-red-900 text-white border-red-900',
};

export function AddToxicityOverlay({ patientId, plans, onSave, onClose }: Props) {
  const [date,              setDate]              = useState(today);
  const [ctcaeCategory,     setCtcaeCategory]     = useState<CtcaeCategory | ''>('');
  const [toxicityType,      setToxicityType]      = useState('');
  const [grade,             setGrade]             = useState<ToxicityGrade | null>(null);
  const [planId,            setPlanId]            = useState('');
  const [cycleNumber,       setCycleNumber]       = useState('');
  const [description,       setDescription]       = useState('');
  const [actionTaken,       setActionTaken]       = useState('');
  const [hospitalAdmission, setHospitalAdmission] = useState(false);
  const [admissionDate,     setAdmissionDate]     = useState('');
  const [dischargeDate,     setDischargeDate]     = useState('');

  const suggestions = ctcaeCategory ? CTCAE_TYPE_SUGGESTIONS[ctcaeCategory] : [];

  const canSave =
    date && ctcaeCategory && toxicityType.trim() && grade &&
    description.trim() && actionTaken.trim() &&
    (!hospitalAdmission || admissionDate);

  function handleSave() {
    if (!canSave || !ctcaeCategory || !grade) return;
    onSave({
      id:                `tox-${Date.now()}`,
      patientId,
      date,
      ctcaeCategory,
      toxicityType:      toxicityType.trim(),
      grade,
      description:       description.trim(),
      actionTaken:       actionTaken.trim(),
      hospitalAdmission,
      admissionDate:     hospitalAdmission ? admissionDate : undefined,
      dischargeDate:     hospitalAdmission && dischargeDate ? dischargeDate : undefined,
      planId:            planId || undefined,
      cycleNumber:       cycleNumber ? Number(cycleNumber) : undefined,
    });
  }

  return (
    <Modal onClose={onClose} size="2xl" className="bg-background border-0" overlayClassName="bg-black/50">
      <ModalHeader title="Record Toxicity / Adverse Event" onClose={onClose} />

      <ModalBody className="space-y-5">
          {/* Date + Category */}
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Date Recorded" labelVariant="uppercase" required>
              <TextField type="date" value={date} onChange={e => setDate(e.target.value)} />
            </FormField>
            <FormField label="CTCAE Category" labelVariant="uppercase" required>
              <Select value={ctcaeCategory}
                onChange={e => { setCtcaeCategory(e.target.value as CtcaeCategory); setToxicityType(''); }}>
                <option value="">Select category…</option>
                {(Object.entries(CTCAE_CATEGORY_LABELS) as [CtcaeCategory, string][]).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </Select>
            </FormField>
          </div>

          {/* Toxicity Type with suggestions */}
          <FormField label="Toxicity / Adverse Event Type" labelVariant="uppercase" required>
            <TextField
              value={toxicityType}
              onChange={e => setToxicityType(e.target.value)}
              placeholder="e.g. Peripheral Neuropathy"
            />
            {suggestions.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {suggestions.map(s => (
                  <button key={s} onClick={() => setToxicityType(s)}
                    className={cn(
                      'text-xs px-2 py-0.5 rounded-full border transition-colors',
                      toxicityType === s
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-muted text-muted-foreground border-border hover:border-primary/40 hover:text-primary',
                    )}>
                    {s}
                  </button>
                ))}
              </div>
            )}
          </FormField>

          {/* Grade */}
          <FormField label="CTCAE Grade" labelVariant="uppercase" required>
            <div className="flex gap-2">
              {([1, 2, 3, 4, 5] as ToxicityGrade[]).map(g => (
                <button key={g} onClick={() => setGrade(g)}
                  className={cn(
                    'flex-1 py-2 rounded-lg border text-sm font-semibold transition-all',
                    grade === g ? GRADE_ACTIVE[g] : 'border-border text-muted-foreground hover:border-primary/40',
                  )}>
                  {g}
                </button>
              ))}
            </div>
            {grade && (
              <p className="mt-2 text-xs text-muted-foreground italic leading-relaxed">
                Grade {grade}: {CTCAE_GRADE_DESCRIPTIONS[grade]}
              </p>
            )}
          </FormField>

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
            <FormField label="Cycle / Fraction Number" labelVariant="uppercase">
              <TextField type="number" min={1} value={cycleNumber} onChange={e => setCycleNumber(e.target.value)}
                placeholder="e.g. 2" />
            </FormField>
          </div>

          {/* Description */}
          <FormField label="Clinical Description" labelVariant="uppercase" required>
            <Textarea rows={3} value={description} onChange={e => setDescription(e.target.value)}
              placeholder="Describe the toxicity presentation, severity, and context…" />
          </FormField>

          {/* Action Taken */}
          <FormField label="Action Taken" labelVariant="uppercase" required>
            <Textarea rows={3} value={actionTaken} onChange={e => setActionTaken(e.target.value)}
              placeholder="Describe interventions, dose modifications, medications prescribed…" />
          </FormField>

          {/* Hospital Admission */}
          <div className="bg-muted/30 rounded-xl p-4 space-y-3">
            <Checkbox
              checked={hospitalAdmission}
              onChange={e => setHospitalAdmission(e.target.checked)}
              label="Hospital Admission Required"
            />
            {hospitalAdmission && (
              <div className="grid grid-cols-2 gap-4 pt-1">
                <FormField label="Admission Date" labelVariant="uppercase" required>
                  <TextField type="date" value={admissionDate} onChange={e => setAdmissionDate(e.target.value)} />
                </FormField>
                <FormField label="Discharge Date" labelVariant="uppercase">
                  <TextField type="date" value={dischargeDate} onChange={e => setDischargeDate(e.target.value)} />
                </FormField>
              </div>
            )}
          </div>
      </ModalBody>

      <ModalFooter>
        <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
        <Button size="sm" onClick={handleSave} disabled={!canSave}>
          Save Toxicity Record
        </Button>
      </ModalFooter>
    </Modal>
  );
}

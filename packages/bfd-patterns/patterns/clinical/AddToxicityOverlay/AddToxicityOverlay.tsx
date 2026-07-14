import * as styles from './AddToxicityOverlay.styles';
import { useState } from 'react';

import type {
  ToxicityRecord, ToxicityGrade, CtcaeCategory, TreatmentPlan,
} from 'bfd-core';
import {
  CTCAE_CATEGORY_LABELS, CTCAE_GRADE_DESCRIPTIONS, CTCAE_TYPE_SUGGESTIONS,
} from 'bfd-core';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'bfd-core';
import { Button } from 'bfd-core';
import { FormField } from 'bfd-core';
import { Select } from 'bfd-core';
import { TextField } from 'bfd-core';
import { Textarea } from 'bfd-core';
import { Checkbox } from 'bfd-core';
import { cn } from 'bfd-core';

interface Props {
  patientId: string;
  plans:     TreatmentPlan[];
  onSave:    (rec: ToxicityRecord) => void;
  onClose:   () => void;
}

const today = new Date().toISOString().split('T')[0];

const GRADE_ACTIVE: Record<ToxicityGrade, string> = {
  1: 'bg-success-soft text-success-emphasis border-success-border',
  2: 'bg-warning-soft text-warning-emphasis border-warning-border',
  3: 'bg-orange-soft text-orange-emphasis border-orange-border',
  4: 'bg-destructive/10 text-destructive border-destructive/30',
  5: 'bg-error-solid text-white border-error-solid',
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
    <Modal onClose={onClose} size="2xl" className={styles.style3} overlayClassName="bg-black/50">
      <ModalHeader title="Record Toxicity / Adverse Event" onClose={onClose} />

      <ModalBody className={styles.style4}>
          {/* Date + Category */}
          <div className={styles.style5}>
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
              <div className={styles.style6}>
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
            <div className={styles.style7}>
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
              <p className={styles.style8}>
                Grade {grade}: {CTCAE_GRADE_DESCRIPTIONS[grade]}
              </p>
            )}
          </FormField>

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
          <div className={styles.style9}>
            <Checkbox
              checked={hospitalAdmission}
              onChange={e => setHospitalAdmission(e.target.checked)}
              label="Hospital Admission Required"
            />
            {hospitalAdmission && (
              <div className={styles.style10}>
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

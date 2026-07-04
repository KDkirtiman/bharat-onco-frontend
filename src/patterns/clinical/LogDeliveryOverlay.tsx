import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { cn } from '../../lib/cn';
import type {
  TreatmentPlan, TreatmentDelivery, PlanModality,
  ChemoDeliveryDrug, PreChemoLabs,
} from '../../datapoints/treatment';
import { DELIVERY_STATUS_LABELS } from '../../datapoints/treatment';
import { ECOG_LABELS } from '../../datapoints/clinical';
import type { EcogScore } from '../../datapoints/clinical';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../../components/layout/Modal';
import { Button } from '../../components/controls/Button';
import { FormField } from '../../components/controls/FormField';
import { Select as UISelect } from '../../components/controls/Select';
import { TextField } from '../../components/controls/TextField';
import { Textarea } from '../../components/controls/Textarea';

interface Props {
  patientId:  string;
  plans:      TreatmentPlan[];
  deliveries: TreatmentDelivery[];
  modality:   PlanModality;
  onSave:     (delivery: TreatmentDelivery) => void;
  onClose:    () => void;
}

const SKIN_REACTIONS = ['None', 'Grade 1', 'Grade 2', 'Grade 3'];
const ANAESTHESIA    = ['General Anaesthesia (GA)', 'Regional', 'Spinal / Epidural', 'Local + Sedation'];
const SESSION_TYPES  = [{ value: 'daycare', label: 'Daycare' }, { value: 'inpatient', label: 'Inpatient' }] as const;
const CHEMO_STATUSES = ['delivered', 'missed', 'delayed', 'dose-reduced', 'cancelled', 'postponed'] as const;
const RADIO_STATUSES = ['delivered', 'missed', 'delayed', 'cancelled', 'postponed'] as const;
const SURG_STATUSES  = ['completed', 'cancelled', 'postponed'] as const;

const LAB_FIELDS: { key: keyof PreChemoLabs; label: string; placeholder: string }[] = [
  { key: 'wbc',         label: 'WBC (×10⁹/L)',  placeholder: '6.2'  },
  { key: 'anc',         label: 'ANC (×10⁹/L)',  placeholder: '3.8'  },
  { key: 'haemoglobin', label: 'Hgb (g/dL)',     placeholder: '12.4' },
  { key: 'platelets',   label: 'Plt (×10⁹/L)',  placeholder: '210'  },
  { key: 'creatinine',  label: 'Cr (mg/dL)',     placeholder: '0.9'  },
  { key: 'bili',        label: 'Bili (mg/dL)',   placeholder: '0.8'  },
  { key: 'ast',         label: 'AST (U/L)',      placeholder: '32'   },
  { key: 'alt',         label: 'ALT (U/L)',      placeholder: '28'   },
];

function TextInput({ value, onChange, placeholder, type = 'text', readOnly, className }: {
  value: string; onChange?: (v: string) => void; placeholder?: string;
  type?: string; readOnly?: boolean; className?: string;
}) {
  return (
    <TextField
      type={type}
      value={value}
      readOnly={readOnly}
      onChange={e => onChange?.(e.target.value)}
      placeholder={placeholder}
      className={cn(readOnly && 'bg-muted cursor-default', className)}
    />
  );
}

function SelectField({ value, onChange, options, placeholder, className }: {
  value: string; onChange: (v: string) => void;
  options: readonly { value: string; label: string }[] | { value: string; label: string }[] | string[]; placeholder?: string; className?: string;
}) {
  const opts = (options as (string | { value: string; label: string })[]).map(o =>
    typeof o === 'string' ? { value: o, label: o } : o,
  );
  return (
    <UISelect
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      options={opts}
      className={className}
    />
  );
}

const emptyDrug = (): ChemoDeliveryDrug => ({ name: '', plannedDose: '', givenDose: '', route: 'IV' });

export function LogDeliveryOverlay({ patientId, plans, deliveries, modality, onSave, onClose }: Props) {
  const modalityPlans = plans.filter(p => p.modality === modality);

  const [planId,   setPlanId]   = useState(modalityPlans[0]?.id ?? '');
  const [date,     setDate]     = useState('');
  const [status,   setStatus]   = useState('delivered');
  const [notes,    setNotes]    = useState('');

  const selectedPlan = plans.find(p => p.id === planId);

  // Auto-suggest session number
  const existingForPlan = deliveries.filter(d => d.planId === planId && d.modality === modality);
  const suggestedNum    = existingForPlan.length > 0
    ? Math.max(...existingForPlan.map(d => d.sessionNumber)) + 1
    : 1;

  // ── Chemo state ────────────────────────────────────────────────────────────
  const [cycleNum,     setCycleNum]     = useState('');
  const [sessionType,  setSessionType]  = useState<'daycare' | 'inpatient'>('daycare');
  const [admDate,      setAdmDate]      = useState('');
  const [disDate,      setDisDate]      = useState('');
  const [ecog,         setEcog]         = useState('');
  const [labs,         setLabs]         = useState<PreChemoLabs>({});
  const [drugs,        setDrugs]        = useState<ChemoDeliveryDrug[]>([]);

  // Pre-fill drugs from plan when plan changes
  useEffect(() => {
    if (modality === 'chemotherapy' && selectedPlan?.chemoDetails?.drugs) {
      setDrugs(selectedPlan.chemoDetails.drugs.map(d => ({
        name:        d.name,
        plannedDose: `${d.dose} ${d.unit}`,
        givenDose:   `${d.dose} ${d.unit}`,
        route:       d.route,
      })));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planId]);

  useEffect(() => {
    setCycleNum(String(suggestedNum));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planId]);

  function updateLab(field: keyof PreChemoLabs, val: string) {
    setLabs(prev => ({ ...prev, [field]: val }));
  }
  function addDrug()          { setDrugs(d => [...d, emptyDrug()]); }
  function removeDrug(i: number) { setDrugs(d => d.filter((_, idx) => idx !== i)); }
  function updateDrug(i: number, field: keyof ChemoDeliveryDrug, val: string) {
    setDrugs(d => d.map((drug, idx) => idx === i ? { ...drug, [field]: val } : drug));
  }

  // ── Radio state ────────────────────────────────────────────────────────────
  const [fracNum,      setFracNum]      = useState('');
  const [doseGy,       setDoseGy]       = useState('');
  const [radioMachine, setRadioMachine] = useState('');
  const [skinReaction, setSkinReaction] = useState('None');

  useEffect(() => {
    setFracNum(String(suggestedNum));
    if (selectedPlan?.radioDetails) {
      setDoseGy(String(selectedPlan.radioDetails.fractionSizeGy));
      setRadioMachine(selectedPlan.radioDetails.machine ?? '');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planId]);

  const cumulativeDoseGy =
    fracNum && doseGy && parseFloat(doseGy) > 0
      ? (parseInt(fracNum, 10) * parseFloat(doseGy)).toFixed(1)
      : '';

  // ── Surgery state ──────────────────────────────────────────────────────────
  const [surgNum,        setSurgNum]        = useState('');
  const [procPerformed,  setProcPerformed]  = useState('');
  const [surgSurgeon,    setSurgSurgeon]    = useState('');
  const [surgDuration,   setSurgDuration]   = useState('');
  const [surgAnaesthesia,setSurgAnaesthesia]= useState('');
  const [surgAdmDate,    setSurgAdmDate]    = useState('');
  const [surgDisDate,    setSurgDisDate]    = useState('');
  const [intraOpFindings,setIntraOpFindings]= useState('');
  const [specimenSent,   setSpecimenSent]   = useState(false);
  const [specimenDetails,setSpecimenDetails]= useState('');
  const [postOpComp,     setPostOpComp]     = useState('');

  useEffect(() => {
    setSurgNum(String(suggestedNum));
    if (selectedPlan?.surgeryDetails) {
      setProcPerformed(selectedPlan.surgeryDetails.procedureName);
      setSurgSurgeon(selectedPlan.surgeryDetails.surgeon ?? '');
      setSurgAnaesthesia(selectedPlan.surgeryDetails.anaesthesiaType ?? '');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planId]);

  const statusOptions: string[] =
    modality === 'chemotherapy' ? [...CHEMO_STATUSES]
    : modality === 'radiotherapy' ? [...RADIO_STATUSES]
    : [...SURG_STATUSES];

  const isValid = planId && date &&
    (modality === 'chemotherapy'
      ? (cycleNum && drugs.some(d => d.name.trim()))
      : modality === 'radiotherapy'
      ? (fracNum && doseGy)
      : (surgNum && procPerformed.trim() && surgSurgeon.trim()));

  const TITLES: Record<PlanModality, string> = {
    chemotherapy: 'Log Chemotherapy Cycle',
    radiotherapy: 'Log Radiotherapy Fraction',
    surgery:      'Log Surgery',
  };
  const SUBMIT_LABELS: Record<PlanModality, string> = {
    chemotherapy: 'Log Cycle',
    radiotherapy: 'Log Fraction',
    surgery:      'Log Surgery',
  };

  function handleSave() {
    if (!isValid) return;

    const base = {
      id:        `dl-${Date.now()}`,
      patientId,
      planId,
      modality,
      date,
      status:    status as TreatmentDelivery['status'],
      notes:     notes.trim() || undefined,
    };

    let delivery: TreatmentDelivery;

    if (modality === 'chemotherapy') {
      const cn = parseInt(cycleNum, 10);
      const filteredLabs = Object.fromEntries(
        Object.entries(labs).filter(([, v]) => (v as string).trim()),
      ) as PreChemoLabs;
      delivery = {
        ...base,
        sessionNumber:     cn,
        drugsAdministered: drugs.filter(d => d.name.trim()).map(d => `${d.name} ${d.givenDose}`).join(' + '),
        doseDelivered:     status === 'dose-reduced' ? 'Dose reduced' : '100%',
        chemoDetails: {
          cycleNumber:    cn,
          sessionType,
          admissionDate:  sessionType === 'inpatient' ? admDate || undefined : undefined,
          dischargeDate:  sessionType === 'inpatient' ? disDate || undefined : undefined,
          ecogAtDelivery: ecog ? parseInt(ecog, 10) : undefined,
          preChemoLabs:   Object.keys(filteredLabs).length > 0 ? filteredLabs : undefined,
          drugs:          drugs.filter(d => d.name.trim()),
        },
      };
    } else if (modality === 'radiotherapy') {
      const fn = parseInt(fracNum, 10);
      delivery = {
        ...base,
        sessionNumber:     fn,
        drugsAdministered: '',
        doseDelivered:     `${doseGy} Gy`,
        radioDetails: {
          fractionNumber:   fn,
          doseGy:           parseFloat(doseGy),
          cumulativeDoseGy: parseFloat(cumulativeDoseGy || '0'),
          machine:          radioMachine.trim() || undefined,
          skinReaction:     skinReaction !== 'None' ? skinReaction : undefined,
        },
      };
    } else {
      const sn = parseInt(surgNum, 10);
      delivery = {
        ...base,
        sessionNumber:     sn,
        drugsAdministered: '',
        doseDelivered:     '',
        surgeryDetails: {
          surgeryNumber:       sn,
          procedurePerformed:  procPerformed.trim(),
          surgeon:             surgSurgeon.trim(),
          durationMinutes:     surgDuration ? parseInt(surgDuration, 10) : undefined,
          anaesthesiaType:     surgAnaesthesia || undefined,
          admissionDate:       surgAdmDate || undefined,
          dischargeDate:       surgDisDate || undefined,
          intraOpFindings:     intraOpFindings.trim() || undefined,
          specimenSent:        specimenSent || undefined,
          specimenDetails:     specimenSent && specimenDetails.trim() ? specimenDetails.trim() : undefined,
          postOpComplications: postOpComp.trim() || undefined,
        },
      };
    }

    onSave(delivery);
  }

  return (
    <Modal onClose={onClose} size="2xl">
      <ModalHeader title={TITLES[modality]} onClose={onClose} />

      {/* Body */}
      <ModalBody className="space-y-5">

          {/* Plan select */}
          <FormField label="Treatment Plan" labelVariant="uppercase" required>
            {modalityPlans.length === 0 ? (
              <p className="text-sm text-destructive">No {modality} plans found for this patient. Create a plan first.</p>
            ) : (
              <SelectField
                value={planId}
                onChange={setPlanId}
                options={modalityPlans.map(p => ({ value: p.id, label: `${p.regimen} (${p.protocol})` }))}
                placeholder="Select plan…"
              />
            )}
          </FormField>

          {/* ── Chemotherapy fields ── */}
          {modality === 'chemotherapy' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Cycle Number" labelVariant="uppercase" required>
                  <TextInput type="number" value={cycleNum} onChange={setCycleNum} placeholder={String(suggestedNum)} />
                </FormField>
                <FormField label="Date" labelVariant="uppercase" required>
                  <TextInput type="date" value={date} onChange={setDate} />
                </FormField>
                <FormField label="Session Type" labelVariant="uppercase" required>
                  <SelectField value={sessionType} onChange={v => setSessionType(v as typeof sessionType)} options={SESSION_TYPES} />
                </FormField>
                <FormField label="ECOG at Delivery" labelVariant="uppercase">
                  <SelectField
                    value={ecog}
                    onChange={setEcog}
                    placeholder="Select…"
                    options={(Object.keys(ECOG_LABELS) as unknown as EcogScore[]).map(k => ({
                      value: String(k),
                      label: `${k} — ${ECOG_LABELS[k as EcogScore].split(';')[0]}`,
                    }))}
                  />
                </FormField>
              </div>

              {sessionType === 'inpatient' && (
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Admission Date" labelVariant="uppercase">
                    <TextInput type="date" value={admDate} onChange={setAdmDate} />
                  </FormField>
                  <FormField label="Discharge Date" labelVariant="uppercase">
                    <TextInput type="date" value={disDate} onChange={setDisDate} />
                  </FormField>
                </div>
              )}

              {/* Pre-chemo labs */}
              <div className="border-t border-border pt-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Pre-Chemo Labs</p>
                <div className="grid grid-cols-4 gap-3">
                  {LAB_FIELDS.map(f => (
                    <FormField key={f.key} label={f.label} labelVariant="uppercase">
                      <TextInput
                        value={labs[f.key] ?? ''}
                        onChange={v => updateLab(f.key, v)}
                        placeholder={f.placeholder}
                      />
                    </FormField>
                  ))}
                </div>
              </div>

              {/* Drugs */}
              <div className="border-t border-border pt-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Drugs Administered</p>
                <div className="rounded-lg border border-border overflow-hidden">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-muted/50">
                        {['Drug', 'Planned Dose', 'Given Dose', 'Route', 'Notes', ''].map(h => (
                          <th key={h} className="px-2.5 py-2 text-left font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {drugs.map((drug, i) => (
                        <tr key={i} className="border-t border-border">
                          <td className="px-2 py-1.5">
                            <input value={drug.name} onChange={e => updateDrug(i, 'name', e.target.value)} placeholder="Drug name"
                              className="w-full px-2 py-1 text-xs rounded border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary/40" />
                          </td>
                          <td className="px-2 py-1.5 w-28">
                            <input value={drug.plannedDose} onChange={e => updateDrug(i, 'plannedDose', e.target.value)} placeholder="75 mg/m²"
                              className="w-full px-2 py-1 text-xs rounded border border-border bg-muted cursor-default focus:outline-none" readOnly />
                          </td>
                          <td className="px-2 py-1.5 w-28">
                            <input value={drug.givenDose} onChange={e => updateDrug(i, 'givenDose', e.target.value)} placeholder="Given"
                              className="w-full px-2 py-1 text-xs rounded border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary/40" />
                          </td>
                          <td className="px-2 py-1.5 w-20">
                            <input value={drug.route} onChange={e => updateDrug(i, 'route', e.target.value)} placeholder="IV"
                              className="w-full px-2 py-1 text-xs rounded border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary/40" />
                          </td>
                          <td className="px-2 py-1.5">
                            <input value={drug.notes ?? ''} onChange={e => updateDrug(i, 'notes', e.target.value)} placeholder="Optional"
                              className="w-full px-2 py-1 text-xs rounded border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary/40" />
                          </td>
                          <td className="px-2 py-1.5 w-8">
                            <button onClick={() => removeDrug(i)} className="text-muted-foreground hover:text-destructive transition-colors">
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button onClick={addDrug} className="mt-2 flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 font-medium transition-colors">
                  <Plus size={13} /> Add Drug
                </button>
              </div>
            </>
          )}

          {/* ── Radiotherapy fields ── */}
          {modality === 'radiotherapy' && (
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Fraction Number" labelVariant="uppercase" required>
                <TextInput type="number" value={fracNum} onChange={setFracNum} placeholder={String(suggestedNum)} />
              </FormField>
              <FormField label="Date" labelVariant="uppercase" required>
                <TextInput type="date" value={date} onChange={setDate} />
              </FormField>
              <FormField label="Dose This Fraction (Gy)" labelVariant="uppercase" required>
                <TextInput type="number" value={doseGy} onChange={setDoseGy} placeholder="2.0" />
              </FormField>
              <FormField label="Cumulative Dose (auto)" labelVariant="uppercase">
                <TextInput value={cumulativeDoseGy ? `${cumulativeDoseGy} Gy` : ''} readOnly placeholder="—" />
              </FormField>
              <FormField label="Machine / Linac" labelVariant="uppercase">
                <TextInput value={radioMachine} onChange={setRadioMachine} placeholder="e.g. TrueBeam STx" />
              </FormField>
              <FormField label="Skin Reaction" labelVariant="uppercase">
                <SelectField value={skinReaction} onChange={setSkinReaction} options={SKIN_REACTIONS} />
              </FormField>
            </div>
          )}

          {/* ── Surgery fields ── */}
          {modality === 'surgery' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Surgery Number" labelVariant="uppercase" required>
                  <TextInput type="number" value={surgNum} onChange={setSurgNum} placeholder={String(suggestedNum)} />
                </FormField>
                <FormField label="Date" labelVariant="uppercase" required>
                  <TextInput type="date" value={date} onChange={setDate} />
                </FormField>
                <FormField className="col-span-2" label="Procedure Performed" labelVariant="uppercase" required>
                  <TextInput value={procPerformed} onChange={setProcPerformed} placeholder="e.g. Laparoscopic LAR" />
                </FormField>
                <FormField label="Surgeon" labelVariant="uppercase" required>
                  <TextInput value={surgSurgeon} onChange={setSurgSurgeon} placeholder="Dr. Name" />
                </FormField>
                <FormField label="Duration (minutes)" labelVariant="uppercase">
                  <TextInput type="number" value={surgDuration} onChange={setSurgDuration} placeholder="120" />
                </FormField>
                <FormField label="Anaesthesia Type" labelVariant="uppercase">
                  <SelectField value={surgAnaesthesia} onChange={setSurgAnaesthesia} options={ANAESTHESIA} placeholder="Select…" />
                </FormField>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Admission Date" labelVariant="uppercase">
                  <TextInput type="date" value={surgAdmDate} onChange={setSurgAdmDate} />
                </FormField>
                <FormField label="Discharge Date" labelVariant="uppercase">
                  <TextInput type="date" value={surgDisDate} onChange={setSurgDisDate} />
                </FormField>
              </div>
              <FormField label="Intra-Op Findings" labelVariant="uppercase">
                <Textarea value={intraOpFindings} onChange={e => setIntraOpFindings(e.target.value)} rows={2} placeholder="Findings…" />
              </FormField>
              <div className="flex items-start gap-3">
                <input
                  id="specimen-sent"
                  type="checkbox"
                  checked={specimenSent}
                  onChange={e => setSpecimenSent(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
                <label htmlFor="specimen-sent" className="text-sm font-medium text-foreground cursor-pointer">Specimen Sent for Histopathology</label>
              </div>
              {specimenSent && (
                <FormField label="Specimen Details" labelVariant="uppercase">
                  <TextInput value={specimenDetails} onChange={setSpecimenDetails} placeholder="e.g. Rectosigmoid specimen, CRM clear" />
                </FormField>
              )}
              <FormField label="Post-Op Complications" labelVariant="uppercase">
                <Textarea value={postOpComp} onChange={e => setPostOpComp(e.target.value)} rows={2} placeholder="e.g. Nil / SSI / Anastomotic leak…" />
              </FormField>
            </>
          )}

          {/* Status + Notes (common footer fields) */}
          <div className="border-t border-border pt-4 space-y-4">
            <FormField label="Status" labelVariant="uppercase" required>
              <SelectField
                value={status}
                onChange={setStatus}
                options={statusOptions.map(s => ({ value: s, label: DELIVERY_STATUS_LABELS[s as keyof typeof DELIVERY_STATUS_LABELS] }))}
              />
            </FormField>
            <FormField label="Notes" labelVariant="uppercase">
              <Textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="Clinical notes…" />
            </FormField>
          </div>
      </ModalBody>

      {/* Footer */}
      <ModalFooter>
        <Button variant="ghost" size="sm" onClick={onClose}>
          Cancel
        </Button>
        <Button size="sm" onClick={handleSave} disabled={!isValid} className="px-5">
          {SUBMIT_LABELS[modality]}
        </Button>
      </ModalFooter>
    </Modal>
  );
}

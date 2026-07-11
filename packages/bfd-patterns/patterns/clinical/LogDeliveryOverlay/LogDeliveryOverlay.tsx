import * as styles from './LogDeliveryOverlay.styles';
import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'bfd-icons';

import type {
  TreatmentPlan, TreatmentDelivery, PlanModality,
  ChemoDeliveryDrug, PreChemoLabs,
} from 'bfd-core';
import { DELIVERY_STATUS_LABELS } from 'bfd-core';
import { ECOG_LABELS } from 'bfd-core';
import type { EcogScore } from 'bfd-core';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'bfd-core';
import { Button } from 'bfd-core';
import { FormField } from 'bfd-core';
import { Select as UISelect } from 'bfd-core';
import { TextField } from 'bfd-core';
import { Textarea } from 'bfd-core';

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
      <ModalBody className={styles.style1}>

          {/* Plan select */}
          <FormField label="Treatment Plan" labelVariant="uppercase" required>
            {modalityPlans.length === 0 ? (
              <p className={styles.style2}>No {modality} plans found for this patient. Create a plan first.</p>
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
              <div className={styles.style3}>
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
                <div className={styles.style3}>
                  <FormField label="Admission Date" labelVariant="uppercase">
                    <TextInput type="date" value={admDate} onChange={setAdmDate} />
                  </FormField>
                  <FormField label="Discharge Date" labelVariant="uppercase">
                    <TextInput type="date" value={disDate} onChange={setDisDate} />
                  </FormField>
                </div>
              )}

              {/* Pre-chemo labs */}
              <div className={styles.style4}>
                <p className={styles.style5}>Pre-Chemo Labs</p>
                <div className={styles.style6}>
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
              <div className={styles.style4}>
                <p className={styles.style5}>Drugs Administered</p>
                <div className={styles.style7}>
                  <table className={styles.style8}>
                    <thead>
                      <tr className={styles.style9}>
                        {['Drug', 'Planned Dose', 'Given Dose', 'Route', 'Notes', ''].map(h => (
                          <th key={h} className={styles.style10}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {drugs.map((drug, i) => (
                        <tr key={i} className={styles.style11}>
                          <td className={styles.style12}>
                            <input value={drug.name} onChange={e => updateDrug(i, 'name', e.target.value)} placeholder="Drug name"
                              className={styles.style13} />
                          </td>
                          <td className={styles.style14}>
                            <input value={drug.plannedDose} onChange={e => updateDrug(i, 'plannedDose', e.target.value)} placeholder="75 mg/m²"
                              className={styles.style15} readOnly />
                          </td>
                          <td className={styles.style14}>
                            <input value={drug.givenDose} onChange={e => updateDrug(i, 'givenDose', e.target.value)} placeholder="Given"
                              className={styles.style13} />
                          </td>
                          <td className={styles.style16}>
                            <input value={drug.route} onChange={e => updateDrug(i, 'route', e.target.value)} placeholder="IV"
                              className={styles.style13} />
                          </td>
                          <td className={styles.style12}>
                            <input value={drug.notes ?? ''} onChange={e => updateDrug(i, 'notes', e.target.value)} placeholder="Optional"
                              className={styles.style13} />
                          </td>
                          <td className={styles.style17}>
                            <button onClick={() => removeDrug(i)} className={styles.style18}>
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button onClick={addDrug} className={styles.style19}>
                  <Plus size={13} /> Add Drug
                </button>
              </div>
            </>
          )}

          {/* ── Radiotherapy fields ── */}
          {modality === 'radiotherapy' && (
            <div className={styles.style3}>
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
              <div className={styles.style3}>
                <FormField label="Surgery Number" labelVariant="uppercase" required>
                  <TextInput type="number" value={surgNum} onChange={setSurgNum} placeholder={String(suggestedNum)} />
                </FormField>
                <FormField label="Date" labelVariant="uppercase" required>
                  <TextInput type="date" value={date} onChange={setDate} />
                </FormField>
                <FormField className={styles.style20} label="Procedure Performed" labelVariant="uppercase" required>
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
              <div className={styles.style3}>
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
              <div className={styles.style21}>
                <input
                  id="specimen-sent"
                  type="checkbox"
                  checked={specimenSent}
                  onChange={e => setSpecimenSent(e.target.checked)}
                  className={styles.style22}
                />
                <label htmlFor="specimen-sent" className={styles.style23}>Specimen Sent for Histopathology</label>
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
          <div className={styles.style24}>
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
        <Button size="sm" onClick={handleSave} disabled={!isValid} className={styles.style25}>
          {SUBMIT_LABELS[modality]}
        </Button>
      </ModalFooter>
    </Modal>
  );
}

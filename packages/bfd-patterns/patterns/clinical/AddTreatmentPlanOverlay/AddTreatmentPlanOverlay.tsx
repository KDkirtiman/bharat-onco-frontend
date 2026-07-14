import * as styles from './AddTreatmentPlanOverlay.styles';
import { useState } from 'react';
import { Plus, Trash2 } from 'bfd-icons';

import type {
  TreatmentPlan, PlanModality, ChemoDrug, Premedication, ProtocolTemplate, PlanEditEntry,
} from 'bfd-core';
import { TREATMENT_STATUS_LABELS, STANDARD_PROTOCOLS } from 'bfd-core';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'bfd-core';
import { Button } from 'bfd-core';
import { FormField } from 'bfd-core';
import { Select as UISelect } from 'bfd-core';
import { TextField } from 'bfd-core';
import { Textarea } from 'bfd-core';
import { cn } from 'bfd-core';

interface Props {
  patientId:          string;
  defaultModality?:   PlanModality;
  initialPlan?:       TreatmentPlan;
  prefill?:           boolean; // when true + initialPlan set: pre-fill form but create new plan on save
  prefillCancerType?: string;
  prefillStage?:      string;
  patientBsa?:        number;
  patientWeightKg?:   number;
  onSave:             (plan: TreatmentPlan) => void;
  onClose:            () => void;
}

const HEADER_LABELS: Record<PlanModality, string> = {
  chemotherapy: 'Add Chemotherapy Plan',
  radiotherapy: 'Add Radiotherapy Plan',
  surgery:      'Add Surgery Plan',
};

const INTENT_OPTIONS   = ['Curative', 'Neo-adjuvant', 'Adjuvant', 'Palliative', 'Concurrent'];
const RADIO_TECHNIQUES = ['IMRT', 'VMAT', '3DCRT', 'SBRT', 'Stereotactic Radiosurgery (SRS)', 'Brachytherapy', 'Electrons', 'IGRT', 'Others'];
const RADIO_FREQUENCY  = ['Daily (Mon–Fri)', '5 days/week', 'BID', 'Weekly', 'Twice-weekly'];
const SURGERY_INTENTS  = ['Curative', 'Palliative', 'Diagnostic', 'Debulking', 'Reconstruction', 'Others'];
const ANAESTHESIA_OPTS = ['General Anaesthesia (GA)', 'Regional', 'Spinal', 'Epidural', 'Local + Sedation'];
const DOSE_UNITS       = ['mg/m²', 'mg/kg', 'mg', 'AUC', 'mcg/kg', 'U/m²'];
const ROUTES           = ['IV', 'Oral', 'SC', 'IM', 'IV bolus', 'IV infusion', 'Intrathecal'];
const TIMING_OPTIONS   = ['Pre-chemo', 'Post-chemo', 'D1', 'D1-D3', 'D2-D3', 'PRN', 'Daily'];

const emptyDrug   = (): ChemoDrug     => ({ name: '', dose: '', unit: 'mg/m²', route: 'IV', dayOfCycle: 'D1' });
const emptyPremed = (): Premedication => ({ drug: '', dose: '', route: 'IV', timing: 'Pre-chemo' });

function Input({ value, onChange, placeholder, type = 'text', readOnly, className }: {
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

function Select({ value, onChange, options, placeholder }: {
  value: string; onChange: (v: string) => void; options: string[]; placeholder?: string;
}) {
  return (
    <UISelect
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      options={options.map(o => ({ value: o, label: o }))}
    />
  );
}

export function AddTreatmentPlanOverlay({ patientId, defaultModality = 'chemotherapy', initialPlan, prefill, prefillCancerType = '', prefillStage = '', patientBsa, patientWeightKg, onSave, onClose }: Props) {
  const modality        = initialPlan?.modality ?? defaultModality;
  const isEdit          = !!initialPlan && !prefill;
  const isSimplifiedMode = !isEdit && (modality === 'surgery' || modality === 'radiotherapy');

  const ip = initialPlan;
  const [cancerType, setCancerType] = useState(ip?.cancerType ?? prefillCancerType);
  const [stage,      setStage]      = useState(ip?.stage      ?? prefillStage);
  const [regimen,    setRegimen]    = useState(
    ip?.modality === 'chemotherapy' ? (ip.regimen ?? '') :
    ip?.modality === 'radiotherapy' ? '' :
    ip?.modality === 'surgery'      ? '' : '',
  );
  const [protocol,   setProtocol]  = useState(ip?.protocol  ?? '');
  const [intent,     setIntent]    = useState(ip?.intent     ?? 'Curative');
  const [startDate,  setStartDate] = useState(ip?.startDate  ?? '');
  const [status,     setStatus]    = useState<TreatmentPlan['status']>(ip?.status ?? 'planned');
  const [notes,      setNotes]     = useState(ip?.notes      ?? '');

  // Protocol dropdown + localStorage custom protocols
  const [selectedProtocolId, setSelectedProtocolId] = useState('');
  const [customProtocols,    setCustomProtocols]    = useState<ProtocolTemplate[]>(() => {
    try { return JSON.parse(localStorage.getItem('bo_custom_protocols') ?? '[]'); }
    catch { return []; }
  });
  const [addingProtocol,  setAddingProtocol]  = useState(false);
  const [newProtocolName, setNewProtocolName] = useState('');

  const allProtocols = [
    ...STANDARD_PROTOCOLS.filter(p => p.modality === modality),
    ...customProtocols.filter(p => p.modality === modality),
  ];

  // Chemo
  const ic = ip?.chemoDetails;
  const [cyclesPlanned,     setCyclesPlanned]     = useState(ic?.cyclesPlanned     ? String(ic.cyclesPlanned)     : '');
  const [cycleDurationDays, setCycleDurationDays] = useState(ic?.cycleDurationDays ? String(ic.cycleDurationDays) : '');
  const [drugs,             setDrugs]             = useState<ChemoDrug[]>(ic?.drugs?.length ? [...ic.drugs] : [emptyDrug()]);
  const [premedications,    setPremedications]    = useState<Premedication[]>(ic?.premedications ? [...ic.premedications] : []);

  // Radio
  const ir = ip?.radioDetails;
  const [technique,   setTechnique]   = useState(ir?.technique  ?? 'IMRT');
  const [targetSite,  setTargetSite]  = useState(ir?.targetSite ?? '');
  const [totalDoseGy, setTotalDoseGy] = useState(ir?.totalDoseGy    ? String(ir.totalDoseGy)    : '');
  const [fracSizeGy,  setFracSizeGy]  = useState(ir?.fractionSizeGy ? String(ir.fractionSizeGy) : '');
  const [frequency,   setFrequency]   = useState(ir?.frequency  ?? 'Daily (Mon–Fri)');
  const [simDate,     setSimDate]     = useState(ir?.simulationDate ?? '');
  const [machine,     setMachine]     = useState(ir?.machine    ?? '');

  const fractionsAuto = totalDoseGy && fracSizeGy && parseFloat(fracSizeGy) > 0
    ? Math.round(parseFloat(totalDoseGy) / parseFloat(fracSizeGy))
    : '';

  // Chemo BSA for final dosage — pre-fill from latest vitals if available
  const [bsa, setBsa] = useState(patientBsa ? String(patientBsa) : '');

  // Surgery
  const isg = ip?.surgeryDetails;
  const [procedureName,  setProcedureName]  = useState(isg?.procedureName  ?? (ip?.modality === 'surgery' ? ip.regimen ?? '' : ''));
  const [surgicalIntent, setSurgicalIntent] = useState(isg?.surgicalIntent ?? 'Curative');
  const [admissionDate,  setAdmissionDate]  = useState(isg?.admissionDate  ?? '');
  const [plannedDate,    setPlannedDate]    = useState(isg?.plannedDate     ?? '');
  const [surgeon,        setSurgeon]        = useState(isg?.surgeon         ?? '');
  const [anaesthesia,    setAnaesthesia]    = useState(isg?.anaesthesiaType ?? '');
  const [preOpReqs,      setPreOpReqs]      = useState(isg?.preOpRequirements ?? '');

  // Drug helpers
  function addDrug() { setDrugs(d => [...d, emptyDrug()]); }
  function removeDrug(i: number) { setDrugs(d => d.filter((_, idx) => idx !== i)); }
  function updateDrug(i: number, field: keyof ChemoDrug, val: string) {
    setDrugs(d => d.map((drug, idx) => idx === i ? { ...drug, [field]: val } : drug));
  }

  // Premedication helpers
  function addPremed() { setPremedications(p => [...p, emptyPremed()]); }
  function removePremed(i: number) { setPremedications(p => p.filter((_, idx) => idx !== i)); }
  function updatePremed(i: number, field: keyof Premedication, val: string) {
    setPremedications(p => p.map((pm, idx) => idx === i ? { ...pm, [field]: val } : pm));
  }

  // Protocol auto-fill
  function handleProtocolSelect(id: string) {
    setSelectedProtocolId(id);
    const proto = allProtocols.find(p => p.id === id);
    if (!proto) return;
    setProtocol(proto.name);
    if (proto.cancerType) setCancerType(proto.cancerType);
    if (proto.stage)      setStage(proto.stage);
    if (proto.intent)     setIntent(proto.intent);
    if (modality === 'chemotherapy' && proto.chemo) {
      setRegimen(proto.chemo.regimen);
      setCyclesPlanned(String(proto.chemo.cyclesPlanned));
      setCycleDurationDays(String(proto.chemo.cycleDurationDays));
      setDrugs([...proto.chemo.drugs]);
      setPremedications([...proto.chemo.premedications]);
    }
    if (modality === 'radiotherapy' && proto.radio) {
      setTechnique(proto.radio.technique);
      setTargetSite(proto.radio.targetSite);
      setTotalDoseGy(String(proto.radio.totalDoseGy));
      setFracSizeGy(String(proto.radio.fractionSizeGy));
      setFrequency(proto.radio.frequency);
    }
    if (modality === 'surgery' && proto.surgery) {
      setProcedureName(proto.surgery.procedureName);
      setSurgicalIntent(proto.surgery.surgicalIntent);
      setAnaesthesia(proto.surgery.anaesthesiaType);
      if (proto.surgery.preOpRequirements) setPreOpReqs(proto.surgery.preOpRequirements);
    }
  }

  function handleAddCustomProtocol() {
    if (!newProtocolName.trim()) return;
    const p: ProtocolTemplate = { id: `custom-${Date.now()}`, name: newProtocolName.trim(), modality };
    const updated = [...customProtocols, p];
    setCustomProtocols(updated);
    localStorage.setItem('bo_custom_protocols', JSON.stringify(updated));
    setSelectedProtocolId(p.id);
    setProtocol(p.name);
    setAddingProtocol(false);
    setNewProtocolName('');
  }

  const isValid = isSimplifiedMode
    ? (modality === 'radiotherapy'
        ? !!(targetSite.trim() && totalDoseGy && fracSizeGy)
        : !!procedureName.trim())
    : !!(cancerType.trim() && stage.trim() && startDate &&
        (modality === 'chemotherapy'
          ? (protocol.trim() && regimen.trim() && cyclesPlanned && cycleDurationDays && drugs.some(d => d.name.trim()))
          : modality === 'radiotherapy'
          ? !!(targetSite.trim() && totalDoseGy && fracSizeGy)
          : procedureName.trim()));

  function handleSave() {
    if (!isValid) return;
    const validPremed = premedications.filter(p => p.drug.trim());

    let editHistory: PlanEditEntry[] = initialPlan?.editHistory ?? [];
    if (isEdit && initialPlan) {
      const snap: PlanEditEntry = {
        editedAt: new Date().toISOString(),
        snapshot: {
          modality:        initialPlan.modality,
          cancerType:      initialPlan.cancerType,
          stage:           initialPlan.stage,
          regimen:         initialPlan.regimen,
          protocol:        initialPlan.protocol,
          intent:          initialPlan.intent,
          startDate:       initialPlan.startDate,
          endDate:         initialPlan.endDate,
          status:          initialPlan.status,
          notes:           initialPlan.notes,
          chemoDetails:    initialPlan.chemoDetails,
          radioDetails:    initialPlan.radioDetails,
          surgeryDetails:  initialPlan.surgeryDetails,
        },
      };
      editHistory = [...editHistory, snap];
    }

    const plan: TreatmentPlan = {
      id:        isEdit ? initialPlan!.id : `tp-${Date.now()}`,
      patientId,
      modality,
      cancerType: cancerType.trim(),
      stage:      stage.trim(),
      regimen:    modality === 'chemotherapy' ? regimen.trim()
                : modality === 'radiotherapy' ? `${technique} — ${targetSite.trim()}`
                : procedureName.trim(),
      protocol:   protocol.trim(),
      intent,
      startDate,
      status,
      notes: notes.trim() || undefined,
      ...(modality === 'chemotherapy' && {
        chemoDetails: {
          cyclesPlanned:     parseInt(cyclesPlanned, 10),
          cycleDurationDays: parseInt(cycleDurationDays, 10),
          drugs: drugs.filter(d => d.name.trim()).map(d => {
            const bsaVal = parseFloat(bsa);
            const doseVal = parseFloat(d.dose);
            const calcDose =
              d.unit === 'mg/m²' && bsa && !isNaN(bsaVal) && !isNaN(doseVal)
                ? parseFloat((doseVal * bsaVal).toFixed(1))
                : d.unit === 'mg/kg' && patientWeightKg && !isNaN(doseVal)
                ? parseFloat((doseVal * patientWeightKg).toFixed(1))
                : undefined;
            return {
              ...d,
              bsaBasedDose:   d.unit === 'mg/m²' && !isNaN(doseVal) ? doseVal : undefined,
              calculatedDose: calcDose,
            };
          }),
          premedications: validPremed.length > 0 ? validPremed : undefined,
        },
      }),
      ...(modality === 'radiotherapy' && {
        radioDetails: {
          technique,
          targetSite:       targetSite.trim(),
          totalDoseGy:      parseFloat(totalDoseGy),
          fractionSizeGy:   parseFloat(fracSizeGy),
          fractionsPlanned: fractionsAuto as number,
          frequency,
          simulationDate:   simDate || undefined,
          machine:          machine.trim() || undefined,
        },
      }),
      ...(modality === 'surgery' && {
        surgeryDetails: {
          procedureName:     procedureName.trim(),
          surgicalIntent,
          admissionDate:     admissionDate || undefined,
          plannedDate:       plannedDate || undefined,
          surgeon:           surgeon.trim() || undefined,
          anaesthesiaType:   anaesthesia || undefined,
          preOpRequirements: preOpReqs.trim() || undefined,
        },
      }),
      editHistory: editHistory.length > 0 ? editHistory : undefined,
    };
    onSave(plan);
  }

  return (
    <Modal onClose={onClose} size="2xl">
      <ModalHeader
        title={isEdit ? `Edit ${HEADER_LABELS[modality].replace('Add ', '')}` : HEADER_LABELS[modality]}
        onClose={onClose}
      />

      {/* Body */}
      <ModalBody className={styles.style1}>

          {/* Protocol dropdown — chemotherapy only */}
          {modality === 'chemotherapy' && <FormField label="Protocol" labelVariant="uppercase">
            <div className={styles.style2}>
              <UISelect
                value={selectedProtocolId}
                onChange={e => handleProtocolSelect(e.target.value)}
                className={styles.style3}
              >
                <option value="">— Select a protocol to auto-fill, or fill manually —</option>
                {allProtocols.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </UISelect>

              {addingProtocol ? (
                <div className={styles.style4}>
                  <input
                    value={newProtocolName}
                    onChange={e => setNewProtocolName(e.target.value)}
                    placeholder="Protocol name…"
                    autoFocus
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleAddCustomProtocol();
                      if (e.key === 'Escape') { setAddingProtocol(false); setNewProtocolName(''); }
                    }}
                    className={styles.style5}
                  />
                  <button onClick={handleAddCustomProtocol} className={styles.style6}>Save</button>
                  <button onClick={() => { setAddingProtocol(false); setNewProtocolName(''); }} className={styles.style7}>✕</button>
                </div>
              ) : (
                <button
                  onClick={() => setAddingProtocol(true)}
                  className={styles.style8}
                >
                  <Plus size={13} /> Custom
                </button>
              )}
            </div>

            {selectedProtocolId && (
              <div className={styles.style9}>
                <span className={styles.style10} />
                Fields auto-filled from protocol — all fields are editable
              </div>
            )}
          </FormField>}

          {/* Cancer Type + Stage — read-only info strip for simplified Surgery/Radio mode */}
          {isSimplifiedMode && (cancerType || stage) && (
            <div className={styles.style11}>
              {cancerType && (
                <div>
                  <p className={styles.style12}>Cancer Type</p>
                  <p className={styles.style13}>{cancerType}</p>
                </div>
              )}
              {cancerType && stage && <span className={styles.style14}>·</span>}
              {stage && (
                <div>
                  <p className={styles.style12}>Stage</p>
                  <p className={styles.style13}>{stage}</p>
                </div>
              )}
            </div>
          )}

          {/* Common fields — hidden in simplified Surgery/Radio mode */}
          {!isSimplifiedMode && (
            <div className={styles.style15}>
              <FormField label="Cancer Type" labelVariant="uppercase" required>
                <Input value={cancerType} onChange={setCancerType} placeholder="e.g. Lung Carcinoma" />
              </FormField>
              <FormField label="Stage" labelVariant="uppercase" required>
                <Input value={stage} onChange={setStage} placeholder="e.g. Stage IIIA" />
              </FormField>
              {modality === 'chemotherapy' && <FormField label="Protocol Name" labelVariant="uppercase" required>
                <Input
                  value={protocol}
                  onChange={v => { setProtocol(v); if (v !== allProtocols.find(p => p.id === selectedProtocolId)?.name) setSelectedProtocolId(''); }}
                  placeholder="e.g. Neo-adjuvant Chemotherapy"
                />
              </FormField>}
              <FormField label="Intent" labelVariant="uppercase" required>
                <Select value={intent} onChange={setIntent} options={INTENT_OPTIONS} />
              </FormField>
              <FormField label="Start Date" labelVariant="uppercase" required>
                <Input type="date" value={startDate} onChange={setStartDate} />
              </FormField>
              <FormField label="Status" labelVariant="uppercase" required>
                <Select value={status} onChange={v => setStatus(v as TreatmentPlan['status'])} options={Object.keys(TREATMENT_STATUS_LABELS)} />
              </FormField>
            </div>
          )}

          {/* ── Chemotherapy section ── */}
          {modality === 'chemotherapy' && (
            <div className={styles.style16}>
              <p className={styles.style17}>Chemotherapy Details</p>
              <div className={styles.style15}>
                <FormField label="Regimen Name" labelVariant="uppercase" required>
                  <Input value={regimen} onChange={setRegimen} placeholder="e.g. FOLFOX, CCRT, Docetaxel" />
                </FormField>
                <div className={styles.style18}>
                  <FormField label="Cycles Planned" labelVariant="uppercase" required>
                    <Input type="number" value={cyclesPlanned} onChange={setCyclesPlanned} placeholder="6" />
                  </FormField>
                  <FormField label="Cycle Duration (days)" labelVariant="uppercase" required>
                    <Input type="number" value={cycleDurationDays} onChange={setCycleDurationDays} placeholder="21" />
                  </FormField>
                </div>
              </div>

              {/* BSA for final dosage */}
              <div className={styles.style19}>
                <FormField label="Patient BSA (m²)" labelVariant="uppercase">
                  <input
                    type="number"
                    step="0.01"
                    value={bsa}
                    onChange={e => setBsa(e.target.value)}
                    placeholder="e.g. 1.73"
                    className={styles.style20}
                  />
                </FormField>
                <div className={styles.style21}>
                  {patientBsa && bsa === String(patientBsa) && (
                    <p className={styles.style22}>From latest vitals</p>
                  )}
                  {bsa && <p className={styles.style23}>mg/m² drugs × {bsa} m²</p>}
                  {patientWeightKg && <p className={styles.style23}>mg/kg drugs × {patientWeightKg} kg</p>}
                </div>
              </div>

              {/* Drugs table */}
              <FormField label="Drugs" labelVariant="uppercase">
                <div className={styles.style24}>
                  <table className={styles.style25}>
                    <thead>
                      <tr className={styles.style26}>
                        {['Drug Name', 'Dose', 'Unit', 'Final Dose (mg)', 'Route', 'Day of Cycle', ''].map(h => (
                          <th key={h} className={styles.style27}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {drugs.map((drug, i) => {
                        const finalDose = drug.dose
                          ? drug.unit === 'mg/m²' && bsa
                            ? (parseFloat(drug.dose) * parseFloat(bsa)).toFixed(1)
                            : drug.unit === 'mg/kg' && patientWeightKg
                            ? (parseFloat(drug.dose) * patientWeightKg).toFixed(1)
                            : null
                          : null;
                        return (
                          <tr key={i} className={styles.style28}>
                            <td className={styles.style29}><input value={drug.name} onChange={e => updateDrug(i, 'name', e.target.value)} placeholder="Drug name" className={styles.style30} /></td>
                            <td className={styles.style31}><input value={drug.dose} onChange={e => updateDrug(i, 'dose', e.target.value)} placeholder="75" className={styles.style30} /></td>
                            <td className={styles.style32}>
                              <select value={drug.unit} onChange={e => updateDrug(i, 'unit', e.target.value)} className={styles.style33}>
                                {DOSE_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                              </select>
                            </td>
                            <td className={styles.style34}>
                              {finalDose
                                ? <span className={styles.style35}>{finalDose} mg</span>
                                : <span className={styles.style36}>—</span>}
                            </td>
                            <td className={styles.style37}>
                              <select value={drug.route} onChange={e => updateDrug(i, 'route', e.target.value)} className={styles.style33}>
                                {ROUTES.map(r => <option key={r} value={r}>{r}</option>)}
                              </select>
                            </td>
                            <td className={styles.style38}><input value={drug.dayOfCycle} onChange={e => updateDrug(i, 'dayOfCycle', e.target.value)} placeholder="D1" className={styles.style30} /></td>
                            <td className={styles.style39}>
                              {drugs.length > 1 && (
                                <button onClick={() => removeDrug(i)} className={styles.style40}><Trash2 size={13} /></button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <button onClick={addDrug} className={styles.style41}>
                  <Plus size={13} /> Add Drug
                </button>
              </FormField>

              {/* Premedications table */}
              <FormField label="Premedications" labelVariant="uppercase">
                {premedications.length > 0 && (
                  <div className={styles.style42}>
                    <table className={styles.style25}>
                      <thead>
                        <tr className={styles.style26}>
                          {['Drug', 'Dose', 'Route', 'Timing', ''].map(h => (
                            <th key={h} className={styles.style43}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {premedications.map((pm, i) => (
                          <tr key={i} className={styles.style28}>
                            <td className={styles.style29}><input value={pm.drug} onChange={e => updatePremed(i, 'drug', e.target.value)} placeholder="Drug name" className={styles.style30} /></td>
                            <td className={styles.style32}><input value={pm.dose} onChange={e => updatePremed(i, 'dose', e.target.value)} placeholder="8 mg" className={styles.style30} /></td>
                            <td className={styles.style37}>
                              <select value={pm.route} onChange={e => updatePremed(i, 'route', e.target.value)} className={styles.style33}>
                                {ROUTES.map(r => <option key={r} value={r}>{r}</option>)}
                              </select>
                            </td>
                            <td className={styles.style44}>
                              <select value={pm.timing} onChange={e => updatePremed(i, 'timing', e.target.value)} className={styles.style33}>
                                {TIMING_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                                {!TIMING_OPTIONS.includes(pm.timing) && <option value={pm.timing}>{pm.timing}</option>}
                              </select>
                            </td>
                            <td className={styles.style39}>
                              <button onClick={() => removePremed(i)} className={styles.style40}><Trash2 size={13} /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <button onClick={addPremed} className={styles.style45}>
                  <Plus size={13} /> Add Premedication
                </button>
              </FormField>
            </div>
          )}

          {/* ── Radiotherapy section ── */}
          {modality === 'radiotherapy' && (
            <div className={styles.style16}>
              <p className={styles.style17}>Radiotherapy Details</p>
              <div className={styles.style15}>
                <FormField label="Technique" labelVariant="uppercase" required>
                  <Select value={technique} onChange={setTechnique} options={RADIO_TECHNIQUES} />
                </FormField>
                <FormField label="Target Site" labelVariant="uppercase" required>
                  <Input value={targetSite} onChange={setTargetSite} placeholder="e.g. Right Upper Lobe + Mediastinum" />
                </FormField>
                <FormField label="Total Dose (Gy)" labelVariant="uppercase" required>
                  <Input type="number" value={totalDoseGy} onChange={setTotalDoseGy} placeholder="60" />
                </FormField>
                <FormField label="Fraction Size (Gy)" labelVariant="uppercase" required>
                  <Input type="number" value={fracSizeGy} onChange={setFracSizeGy} placeholder="2.0" />
                </FormField>
                <FormField label="Fractions Planned (auto)" labelVariant="uppercase">
                  <Input value={fractionsAuto.toString()} readOnly placeholder="—" />
                </FormField>
                <FormField label="Frequency" labelVariant="uppercase">
                  <Select value={frequency} onChange={setFrequency} options={RADIO_FREQUENCY} placeholder="Select (optional)…" />
                </FormField>
                <FormField label="Simulation Date" labelVariant="uppercase">
                  <Input type="date" value={simDate} onChange={setSimDate} />
                </FormField>
                <FormField label="Machine / Linac" labelVariant="uppercase">
                  <Input value={machine} onChange={setMachine} placeholder="e.g. TrueBeam STx" />
                </FormField>
              </div>
            </div>
          )}

          {/* ── Surgery section ── */}
          {modality === 'surgery' && (
            <div className={styles.style16}>
              <p className={styles.style17}>Surgery Details</p>
              <div className={styles.style15}>
                <FormField className={styles.style46} label="Procedure Name" labelVariant="uppercase" required>
                  <Input value={procedureName} onChange={setProcedureName} placeholder="e.g. Laparoscopic Low Anterior Resection (LAR)" />
                </FormField>
                <FormField label="Surgical Intent" labelVariant="uppercase" required>
                  <Select value={surgicalIntent} onChange={setSurgicalIntent} options={SURGERY_INTENTS} />
                </FormField>
                <FormField label="Date of Admission" labelVariant="uppercase">
                  <Input type="date" value={admissionDate} onChange={setAdmissionDate} />
                </FormField>
                <FormField label="Planned Date of Surgery" labelVariant="uppercase">
                  <Input type="date" value={plannedDate} onChange={setPlannedDate} />
                </FormField>
                <FormField label="Surgeon" labelVariant="uppercase">
                  <Input value={surgeon} onChange={setSurgeon} placeholder="Dr. Name" />
                </FormField>
                <FormField label="Anaesthesia Type" labelVariant="uppercase">
                  <Select value={anaesthesia} onChange={setAnaesthesia} options={ANAESTHESIA_OPTS} placeholder="Select…" />
                </FormField>
                <FormField className={styles.style46} label="Pre-Op Requirements" labelVariant="uppercase">
                  <Textarea
                    value={preOpReqs}
                    onChange={e => setPreOpReqs(e.target.value)}
                    rows={2}
                    placeholder="e.g. Bowel prep, cardiology clearance, DVT prophylaxis"
                  />
                </FormField>
              </div>
            </div>
          )}

          {/* Notes */}
          <FormField className={styles.style47} label="Notes" labelVariant="uppercase">
            <Textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={2}
              placeholder="Additional clinical notes…"
            />
          </FormField>
      </ModalBody>

      {/* Footer */}
      <ModalFooter>
        <Button variant="ghost" size="sm" onClick={onClose}>
          Cancel
        </Button>
        <Button size="sm" onClick={handleSave} disabled={!isValid} className={styles.style48}>
          {isEdit ? 'Update Plan' : 'Save Plan'}
        </Button>
      </ModalFooter>
    </Modal>
  );
}

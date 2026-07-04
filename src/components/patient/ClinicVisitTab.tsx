import { useState, useMemo } from 'react';
import { getFollowUpDateConstraintError } from '../../datapoints/scheduling';
import {
  Calendar, CheckCircle2, Plus, Trash2, AlertTriangle,
  Users, Activity, ClipboardList, Stethoscope, Pill,
  FlaskConical, CheckSquare, ShieldAlert, FileText,
} from 'lucide-react';
import type { Patient, PatientAllergy } from '../../datapoints/patients';
import type { Appointment } from '../../datapoints/scheduling';
import type { TreatmentDelivery } from '../../datapoints/treatment';
import { APPOINTMENT_TYPE_LABELS, STATUS_LABELS } from '../../datapoints/scheduling';
import type { Vitals, ClinicalVisit, EcogScore, VisitPrescription, VisitTestOrder, MedicationOrderSet, InvestigationOrderSet, FollowUp } from '../../datapoints/clinical';
import {
  ECOG_LABELS, ECOG_COLORS, KARNOFSKY_LABELS,
  MEDICATION_ORDER_SETS, INJECTION_ORDER_SETS, INVESTIGATION_ORDER_SETS,
} from '../../datapoints/clinical';
import type { User } from '../../datapoints/auth';
import { mockUsers } from '../../datapoints/auth';
import {
  MEDICAL_RECORD_CATEGORIES,
  COMORBIDITY_OPTIONS,
  OCCUPATION_OPTIONS,
  SOCIAL_STATUS_OPTIONS,
} from '../../datapoints/geodata';

interface Props {
  patient:             Patient;
  currentUser:         User;
  appointment:         Appointment;
  clinicalVisit?:      ClinicalVisit;
  currentVitals?:      Vitals;
  patientDeliveries?:  TreatmentDelivery[];
  onSave:              (visit: ClinicalVisit, vitals?: Vitals) => void;
  onStatusChange?:     (status: Appointment['status']) => void;
  onPatientsChange?:   React.Dispatch<React.SetStateAction<Patient[]>>;
}

const KARNOFSKY_VALUES = [100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0] as const;
const SMOKING_OPTIONS  = ['Never', 'Former Smoker', 'Current Smoker'];
const ALCOHOL_OPTIONS  = ['Never', 'Occasional', 'Regular'];
const TOBACCO_OPTIONS  = ['Never', 'Former User', 'Current User'];
const LYMPH_SITES      = ['None', 'Cervical', 'Axillary', 'Inguinal', 'Pre-auricular', 'Post-auricular'];

// ── Shared sub-components ──────────────────────────────────────────────────────
function Card({ icon, title, children, optional }: { icon: React.ReactNode; title: string; children: React.ReactNode; optional?: boolean }) {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="text-primary">{icon}</span>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{title}</h3>
        </div>
        {optional && <span className="text-xs text-muted-foreground/60 italic">Optional</span>}
      </div>
      {children}
    </div>
  );
}

function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <label className="block text-sm font-medium text-foreground mb-1.5">
      {label}{required && <span className="text-destructive ml-0.5">*</span>}
    </label>
  );
}

function SectionDivider({ title }: { title: string }) {
  return (
    <div className="border-t border-border pt-5">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">{title}</p>
    </div>
  );
}

function WarnAlert({ message }: { message: string }) {
  return (
    <p className="flex items-center gap-1 text-xs text-amber-600 mt-1">
      <AlertTriangle size={11} /> {message}
    </p>
  );
}

function ErrorAlert({ message }: { message: string }) {
  return (
    <p className="flex items-center gap-1 text-xs text-destructive mt-1">
      <AlertTriangle size={11} /> {message}
    </p>
  );
}

function AddRowButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2 text-sm font-medium border border-dashed border-border rounded-lg text-muted-foreground hover:border-primary hover:text-primary transition-colors"
    >
      <Plus size={14} /> {label}
    </button>
  );
}

function SOAPBlock({ letter, title, color, children }: { letter: string; title: string; color: string; children: React.ReactNode }) {
  return (
    <div>
      <div className={`flex items-center gap-3 mb-4 px-1`}>
        <span className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${color}`}>{letter}</span>
        <span className="text-sm font-semibold text-foreground">{title}</span>
        <div className="flex-1 h-px bg-border" />
      </div>
      <div className="space-y-4 pl-2">
        {children}
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export function ClinicVisitTab({ patient, currentUser, appointment, clinicalVisit, currentVitals, patientDeliveries, onSave, onStatusChange, onPatientsChange }: Props) {
  const nurses      = Object.values(mockUsers).filter(u => u.role === 'nurse');
  const oncologists = Object.values(mockUsers).filter(u => u.role === 'oncologist');
  const isInitialVisit = appointment.type === 'initial-visit';

  // ── Card 1: Visit Info ─────────────────────────────────────────────────────
  const [attendingNurseId, setAttendingNurseId] = useState(
    clinicalVisit?.attendingNurseId ??
    (currentUser.role === 'nurse' ? currentUser.id : (nurses[0]?.id ?? '')),
  );
  const [attendingOncologistId, setAttendingOncologistId] = useState(
    clinicalVisit?.attendingOncologistId ?? (oncologists[0]?.id ?? ''),
  );

  // ── Vitals ─────────────────────────────────────────────────────────────────
  const [height,      setHeight]      = useState(currentVitals?.height      ? String(currentVitals.height)      : '');
  const [weight,      setWeight]      = useState(currentVitals?.weight      ? String(currentVitals.weight)      : '');
  const [bpSystolic,  setBpSystolic]  = useState(() => currentVitals?.bp?.split('/')?.[0] ?? '');
  const [bpDiastolic, setBpDiastolic] = useState(() => currentVitals?.bp?.split('/')?.[1] ?? '');
  const [pulse,       setPulse]       = useState(currentVitals?.heartRate   ? String(currentVitals.heartRate)   : '');
  const [temperature, setTemperature] = useState(currentVitals?.temperature ? String(currentVitals.temperature) : '');
  const [spo2,        setSpo2]        = useState(currentVitals?.spo2        ? String(currentVitals.spo2)        : '');
  const [customVitals, setCustomVitals] = useState<{ id: string; name: string; value: string; unit: string }[]>(
    (currentVitals?.customVitals ?? []).map((v, i) => ({ ...v, id: `cv-${i}` })),
  );

  const bmi = useMemo(() => {
    const h = parseFloat(height); const w = parseFloat(weight);
    if (!h || !w) return '';
    return (w / ((h / 100) ** 2)).toFixed(1);
  }, [height, weight]);

  const bsa = useMemo(() => {
    const h = parseFloat(height); const w = parseFloat(weight);
    if (!h || !w) return '';
    return Math.sqrt((h * w) / 3600).toFixed(2);
  }, [height, weight]);

  // Vitals validation
  const heightNum  = parseFloat(height);
  const weightNum  = parseFloat(weight);
  const sysNum     = parseFloat(bpSystolic);
  const diaNum     = parseFloat(bpDiastolic);
  const pulseNum   = parseFloat(pulse);
  const tempNum    = parseFloat(temperature);
  const spo2Num    = parseFloat(spo2);
  const bsaNum     = parseFloat(bsa);

  const heightError  = height      && (heightNum < 50  || heightNum > 250);
  const weightError  = weight      && (weightNum < 5   || weightNum > 200);
  const bpBlocker    = bpSystolic  && bpDiastolic && sysNum <= diaNum;
  const bpSysLow     = bpSystolic  && !bpBlocker && sysNum < 90;
  const bpDiaLow     = bpDiastolic && !bpBlocker && diaNum < 60;
  const bpSysHigh    = bpSystolic  && !bpBlocker && sysNum > 180;
  const pulseLow     = pulse       && pulseNum < 50;
  const pulseHigh    = pulse       && pulseNum > 130;
  const tempLow      = temperature && tempNum < 92;
  const tempHigh     = temperature && tempNum > 106;
  const spo2Low      = spo2 !== '' && spo2Num < 88;
  const bsaWarn      = bsa  !== '' && (bsaNum < 1.2 || bsaNum > 2.5);

  function handleSpo2Change(val: string) {
    const n = parseFloat(val);
    if (!isNaN(n) && n > 100) { setSpo2('100'); return; }
    setSpo2(val);
  }

  function addCustomVital() {
    setCustomVitals(prev => [...prev, { id: `cv-${Date.now()}`, name: '', value: '', unit: '' }]);
  }
  function updateCustomVital(id: string, field: 'name' | 'value' | 'unit', val: string) {
    setCustomVitals(prev => prev.map(v => v.id === id ? { ...v, [field]: val } : v));
  }
  function removeCustomVital(id: string) {
    setCustomVitals(prev => prev.filter(v => v.id !== id));
  }

  // ── SOAP S: Chief Complaint + HPI ─────────────────────────────────────────
  const [chiefComplaints,   setChiefComplaints]   = useState(clinicalVisit?.chiefComplaints ?? '');
  const [complaintDuration, setComplaintDuration] = useState(clinicalVisit?.complaintDuration ?? '');
  const [hpi,               setHpi]               = useState(clinicalVisit?.hpi ?? '');

  // ── SOAP S: Allergies ──────────────────────────────────────────────────────
  const [noKnownAllergies, setNoKnownAllergies] = useState(clinicalVisit?.noKnownAllergies ?? false);
  const [allergies, setAllergies] = useState<PatientAllergy[]>(
    () => (patient.allergies ?? []).map(a => ({ ...a, id: a.id ?? `al-${Math.random()}` })),
  );

  const ALLERGY_TYPES: { value: PatientAllergy['type']; label: string }[] = [
    { value: 'drug',          label: 'Drug Allergy'  },
    { value: 'food',          label: 'Food Allergy'  },
    { value: 'environmental', label: 'Environmental' },
    { value: 'latex',         label: 'Latex'         },
    { value: 'other',         label: 'Other'         },
  ];

  function addAllergy() {
    setNoKnownAllergies(false);
    setAllergies(prev => [...prev, { id: `al-${Date.now()}`, type: 'drug', allergen: '', reaction: '' }]);
  }
  function updateAllergy(id: string, field: keyof PatientAllergy, value: string) {
    setAllergies(prev => prev.map(a => a.id === id ? { ...a, [field]: value } : a));
  }
  function deleteAllergy(id: string) {
    setAllergies(prev => prev.filter(a => a.id !== id));
  }

  // ── SOAP S: Past History ───────────────────────────────────────────────────
  const [noSignificantPastHistory, setNoSignificantPastHistory] = useState(clinicalVisit?.noSignificantPastHistory ?? false);

  const ph = clinicalVisit?.pastHistory ?? (!isInitialVisit ? patient.pastHistory : undefined);
  const presetInStored = (ph?.comorbidities ?? []).filter(c =>  COMORBIDITY_OPTIONS.includes(c));
  const customInStored = (ph?.comorbidities ?? []).filter(c => !COMORBIDITY_OPTIONS.includes(c));

  const [selectedComorbidities, setSelectedComorbidities] = useState<string[]>(presetInStored);
  const [customComorbidities,   setCustomComorbidities]   = useState<{ id: string; name: string }[]>(
    customInStored.map(name => ({ id: name, name })),
  );
  const [addingComorbidity,   setAddingComorbidity]   = useState(false);
  const [newComorbidityName,  setNewComorbidityName]  = useState('');
  const [priorCancer,  setPriorCancer]  = useState(ph?.priorCancer  ?? '');
  const [priorSurgery, setPriorSurgery] = useState(ph?.priorSurgery ?? '');

  function toggleComorbidity(val: string) {
    setSelectedComorbidities(prev => prev.includes(val) ? prev.filter(c => c !== val) : [...prev, val]);
  }
  function confirmCustomComorbidity() {
    const name = newComorbidityName.trim();
    if (!name) { setAddingComorbidity(false); return; }
    setCustomComorbidities(prev => [...prev, { id: `cc-${Date.now()}`, name }]);
    setNewComorbidityName(''); setAddingComorbidity(false);
  }
  function removeCustomComorbidity(id: string) {
    setCustomComorbidities(prev => prev.filter(c => c.id !== id));
  }

  const [smoking,  setSmoking]  = useState(ph?.smoking ?? '');
  const [alcohol,  setAlcohol]  = useState(ph?.alcohol ?? '');
  const [tobacco,  setTobacco]  = useState(ph?.tobacco ?? '');
  const [socialCustomFields, setSocialCustomFields] = useState<{ id: string; label: string; status: string }[]>(
    (ph?.socialCustomFields ?? []).map(f => ({ ...f, id: `sf-${Math.random()}` })),
  );
  const [occupationalField,   setOccupationalField]   = useState(ph?.occupationalField   ?? '');
  const [toxinExposure,       setToxinExposure]       = useState(ph?.toxinExposure       ?? '');
  const [familyCancerHistory, setFamilyCancerHistory] = useState(ph?.familyCancerHistory ?? '');

  function addSocialField()    { setSocialCustomFields(prev => [...prev, { id: `sf-${Date.now()}`, label: '', status: '' }]); }
  function updateSocialField(id: string, key: 'label' | 'status', val: string) {
    setSocialCustomFields(prev => prev.map(f => f.id === id ? { ...f, [key]: val } : f));
  }
  function removeSocialField(id: string) { setSocialCustomFields(prev => prev.filter(f => f.id !== id)); }

  // ── SOAP O: Examination ────────────────────────────────────────────────────
  const ex = clinicalVisit?.examination;

  const [cachexia,           setCachexia]           = useState(ex?.cachexia           ?? '');
  const [pallor,             setPallor]             = useState(ex?.pallor             ?? '');
  const [icterus,            setIcterus]            = useState(ex?.icterus            ?? '');
  const [cyanosis,           setCyanosis]           = useState(ex?.cyanosis           ?? '');
  const [clubbing,           setClubbing]           = useState(ex?.clubbing           ?? '');
  const [edema,              setEdema]              = useState(ex?.edema              ?? '');
  const [dehydration,        setDehydration]        = useState(ex?.dehydration        ?? '');
  const [examGeneral,        setExamGeneral]        = useState(ex?.general            ?? '');
  const [lymphadenopathySite,setLymphadenopathySite]= useState(ex?.lymphadenopathySite ?? ex?.lymphadenopathy ?? '');

  const [examSiteWise, setExamSiteWise] = useState<Record<string, string>>({
    primarySite:  ex?.primarySite  ?? '',
    abdomen:      ex?.abdomen      ?? '',
    liver:        ex?.liver        ?? '',
    lungs:        ex?.lungs        ?? '',
    skin:         ex?.skin         ?? '',
    neurological: ex?.neurological ?? '',
  });

  const [abdomenDistension, setAbdomenDistension] = useState(ex?.abdomenDistension ?? '');
  const [abdomenTenderness, setAbdomenTenderness] = useState(ex?.abdomenTenderness ?? '');
  const [abdomenAscites,    setAbdomenAscites]    = useState(ex?.abdomenAscites    ?? '');
  const [hepatomegaly,     setHepatomegaly]     = useState(ex?.hepatomegaly     ?? '');
  const [liverConsistency, setLiverConsistency] = useState(ex?.liverConsistency ?? '');
  const [liverSurface,     setLiverSurface]     = useState(ex?.liverSurface     ?? '');
  const [airEntry,         setAirEntry]         = useState(ex?.airEntry         ?? '');
  const [breathSounds,     setBreathSounds]     = useState(ex?.breathSounds     ?? '');
  const [lungCrackles,     setLungCrackles]     = useState(ex?.lungCrackles     ?? '');

  // ── SOAP A: Assessment ─────────────────────────────────────────────────────
  const [provisionalDiagnosis, setProvisionalDiagnosis] = useState(clinicalVisit?.provisionalDiagnosis ?? '');
  const [ecogScore,            setEcogScore]            = useState<EcogScore | ''>(clinicalVisit?.ecogScore      ?? '');
  const [karnofskyScore,       setKarnofskyScore]       = useState<number   | ''>(clinicalVisit?.karnofskyScore  ?? '');

  // ── SOAP P: Investigations ─────────────────────────────────────────────────
  const [testOrders, setTestOrders] = useState<VisitTestOrder[]>(() => clinicalVisit?.testOrders ?? []);

  function addOrderSet(set: InvestigationOrderSet) {
    setTestOrders(prev => {
      const existingNames = new Set(prev.map(t => t.testName));
      const newTests = set.tests
        .filter(t => !existingNames.has(t.testName))
        .map(t => ({ id: `to-${Date.now()}-${Math.random()}`, ...t }));
      return [...prev, ...newTests];
    });
  }
  function addTestOrder() {
    setTestOrders(prev => [...prev, { id: `to-${Date.now()}`, category: '', subcategory: '', testName: '', instructions: '' }]);
  }
  function updateTestOrder(id: string, field: keyof VisitTestOrder, value: string) {
    setTestOrders(prev => prev.map(t => {
      if (t.id !== id) return t;
      if (field === 'category') return { ...t, category: value, subcategory: '' };
      return { ...t, [field]: value };
    }));
  }
  function deleteTestOrder(id: string) { setTestOrders(prev => prev.filter(t => t.id !== id)); }

  // ── SOAP P: Medications ────────────────────────────────────────────────────
  const [prescriptions, setPrescriptions] = useState<VisitPrescription[]>(clinicalVisit?.prescriptions ?? []);

  function addFromOrderSet(set: MedicationOrderSet) {
    setPrescriptions(prev => [...prev, {
      id: `rx-${Date.now()}`,
      medicineName:    set.medicineName,
      dose:            set.dose,
      frequency:       set.frequency,
      duration:        set.duration,
      numberOfDays:    set.numberOfDays,
      beforeAfterFood: set.beforeAfterFood,
      instructions:    set.instructions ?? '',
    }]);
  }
  function addPrescription() {
    setPrescriptions(prev => [...prev, { id: `rx-${Date.now()}`, medicineName: '', dose: '', frequency: '', duration: '', instructions: '' }]);
  }
  function updatePrescription(id: string, field: keyof VisitPrescription, value: string) {
    setPrescriptions(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  }
  function deletePrescription(id: string) { setPrescriptions(prev => prev.filter(r => r.id !== id)); }

  // ── SOAP P: Notes + Tumor Board ────────────────────────────────────────────
  const [notes,             setNotes]             = useState(clinicalVisit?.clinicalNotes ?? '');
  const [tumorBoardReview,  setTumorBoardReview]  = useState(clinicalVisit?.tumorBoardReview ?? false);

  // ── Next Follow Up ─────────────────────────────────────────────────────────
  const [followUpValue,    setFollowUpValue]    = useState(clinicalVisit?.followUp?.value ? String(clinicalVisit.followUp.value) : '');
  const [followUpUnit,     setFollowUpUnit]     = useState<FollowUp['unit']>(clinicalVisit?.followUp?.unit ?? 'Weeks');
  const [followUpDate,     setFollowUpDate]     = useState(clinicalVisit?.followUp?.specificDate ?? '');
  const [noFollowUp,       setNoFollowUp]       = useState(clinicalVisit?.followUp?.noFollowUpNeeded ?? false);
  const [noFollowUpReason, setNoFollowUpReason] = useState(clinicalVisit?.followUp?.noFollowUpReason ?? '');

  const computedFollowUpDate = useMemo(() => {
    if (!followUpValue) return '';
    const v = parseInt(followUpValue, 10);
    const d = new Date();
    if (followUpUnit === 'Days')   d.setDate(d.getDate() + v);
    if (followUpUnit === 'Weeks')  d.setDate(d.getDate() + v * 7);
    if (followUpUnit === 'Months') d.setMonth(d.getMonth() + v);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }, [followUpValue, followUpUnit]);

  const effectiveFollowUpDate   = followUpDate || computedFollowUpDate;
  const followUpConstraintError = effectiveFollowUpDate
    ? getFollowUpDateConstraintError(effectiveFollowUpDate, appointment.center, appointment.doctorId)
    : null;

  // ── Role locking ───────────────────────────────────────────────────────────
  const NURSE_DONE_STATUSES: Appointment['status'][] = [
    'vitals-recorded', 'checklist-completed', 'checked-in',
    'chair-assigned', 'in-progress', 'completed',
  ];
  const nurseReadOnly = currentUser.role === 'oncologist' && !NURSE_DONE_STATUSES.includes(appointment.status);
  const oncoReadOnly  = currentUser.role === 'nurse';

  // ── Mandatory field validation ─────────────────────────────────────────────
  const isCompletingVisit =
    currentUser.role === 'oncologist' &&
    ((appointment.status === 'vitals-recorded'    && appointment.type !== 'chemo-session') ||
     (appointment.status === 'checklist-completed' && appointment.type === 'chemo-session'));

  const isNurseRole = currentUser.role !== 'oncologist';
  const allergyFilled = allergies.filter(a => a.allergen.trim()).length > 0 || noKnownAllergies;

  const mandatoryErrors: string[] = [];
  if (isNurseRole) {
    if (!bpSystolic || !bpDiastolic) mandatoryErrors.push('BP is required');
    if (!pulse)                       mandatoryErrors.push('Pulse is required');
    if (!temperature)                 mandatoryErrors.push('Temperature is required');
    if (!chiefComplaints.trim())      mandatoryErrors.push('Chief Complaint is required');
    if (!allergyFilled)               mandatoryErrors.push('Record at least one allergy or confirm NKDA');
  }
  if (currentUser.role === 'oncologist') {
    if (!provisionalDiagnosis.trim()) mandatoryErrors.push('Provisional Diagnosis is required');
    if (!notes.trim())                mandatoryErrors.push('Visit Notes is required');
  }
  if (isCompletingVisit && !noFollowUp) {
    if (!effectiveFollowUpDate)       mandatoryErrors.push('Next Follow Up date is required');
    else if (followUpConstraintError) mandatoryErrors.push(followUpConstraintError);
  }

  // ── Footer action ──────────────────────────────────────────────────────────
  function getFooterAction(): { label: string; statusNext: Appointment['status'] | null } {
    const isChemo = appointment.type === 'chemo-session';
    const role    = currentUser.role;
    const status  = appointment.status;
    if (role === 'nurse') {
      if (status === 'confirmed' && !isChemo) return { label: 'Save & Record Vitals',       statusNext: 'vitals-recorded'             };
      if (status === 'confirmed' &&  isChemo) return { label: 'Save & Start Pre-Checklist',  statusNext: 'chemo-checklist-in-progress' };
      if (status === 'chemo-checklist-in-progress') return { label: 'Complete Pre-Checklist', statusNext: 'checklist-completed'        };
    }
    if (role === 'oncologist') {
      if (status === 'vitals-recorded'    && !isChemo) return { label: 'Complete Visit',   statusNext: 'completed'  };
      if (status === 'checklist-completed' && isChemo) return { label: 'Authorize Chemo',  statusNext: 'checked-in' };
    }
    return { label: 'Save Visit', statusNext: null };
  }
  const footerAction = getFooterAction();

  // ── Save ───────────────────────────────────────────────────────────────────
  const [saved, setSaved] = useState(false);

  const preChecklistBlocked =
    currentUser.role === 'nurse' &&
    appointment.status === 'chemo-checklist-in-progress' &&
    !(patientDeliveries && patientDeliveries.length > 0);

  const saveDisabled = !!(heightError || weightError || bpBlocker || preChecklistBlocked || mandatoryErrors.length > 0);

  function handleSave() {
    const now  = new Date().toISOString().split('T')[0];
    const cvId = clinicalVisit?.id ?? `cv-${Date.now()}`;
    const vitId = currentVitals?.id ?? `v-${Date.now()}`;

    const hasVitals = height || weight || bpSystolic || pulse || temperature || spo2;
    let newVitals: Vitals | undefined;
    if (hasVitals) {
      const bp = bpSystolic && bpDiastolic ? `${bpSystolic}/${bpDiastolic}` : (currentVitals?.bp ?? '');
      newVitals = {
        id:          vitId,
        patientId:   patient.id,
        visitId:     appointment.visitId,
        bp,
        heartRate:   parseFloat(pulse)       || currentVitals?.heartRate    || 0,
        temperature: parseFloat(temperature) || currentVitals?.temperature  || 0,
        bmi:         parseFloat(bmi)         || currentVitals?.bmi          || 0,
        bsa:         parseFloat(bsa)         || currentVitals?.bsa          || 0,
        spo2:        parseFloat(spo2)        || currentVitals?.spo2         || 0,
        height:      parseFloat(height)      || undefined,
        weight:      parseFloat(weight)      || undefined,
        recordedAt:  now,
        customVitals: customVitals.filter(v => v.name.trim()).map(({ id: _id, ...v }) => v),
      };
    }

    const allComorbidities = [
      ...selectedComorbidities,
      ...customComorbidities.map(c => c.name).filter(Boolean),
    ];
    const pastHistory = {
      comorbidities:       allComorbidities.length > 0 ? allComorbidities : undefined,
      priorCancer:         priorCancer        || undefined,
      priorSurgery:        priorSurgery       || undefined,
      smoking:             smoking            || undefined,
      alcohol:             alcohol            || undefined,
      tobacco:             tobacco            || undefined,
      socialCustomFields:  socialCustomFields.filter(f => f.label.trim()).map(({ label, status }) => ({ label, status })),
      occupationalField:   occupationalField  || undefined,
      toxinExposure:       toxinExposure      || undefined,
      familyCancerHistory: familyCancerHistory || undefined,
    };
    const hasPastHistory = !!(
      pastHistory.comorbidities?.length || pastHistory.priorCancer || pastHistory.priorSurgery ||
      pastHistory.smoking || pastHistory.alcohol || pastHistory.tobacco ||
      pastHistory.socialCustomFields?.length || pastHistory.occupationalField ||
      pastHistory.toxinExposure || pastHistory.familyCancerHistory
    );

    const allTestOrders: VisitTestOrder[] = testOrders;

    const cv: ClinicalVisit = {
      id:                    cvId,
      patientId:             patient.id,
      appointmentId:         appointment.id,
      vitalsId:              newVitals?.id ?? clinicalVisit?.vitalsId,
      attendingNurseId:      attendingNurseId       || undefined,
      attendingOncologistId: attendingOncologistId  || undefined,
      chiefComplaints:       chiefComplaints        || undefined,
      complaintDuration:     complaintDuration      || undefined,
      hpi:                   hpi                   || undefined,
      provisionalDiagnosis:  provisionalDiagnosis   || undefined,
      noKnownAllergies:      noKnownAllergies       || undefined,
      noSignificantPastHistory: noSignificantPastHistory || undefined,
      pastHistory:           hasPastHistory ? pastHistory : undefined,
      examination: {
        cachexia:            cachexia            || undefined,
        pallor:              pallor              || undefined,
        icterus:             icterus             || undefined,
        cyanosis:            cyanosis            || undefined,
        clubbing:            clubbing            || undefined,
        edema:               edema               || undefined,
        dehydration:         dehydration         || undefined,
        general:             examGeneral         || undefined,
        lymphadenopathySite: lymphadenopathySite || undefined,
        primarySite:         examSiteWise.primarySite  || undefined,
        abdomenDistension:   abdomenDistension   || undefined,
        abdomenTenderness:   abdomenTenderness   || undefined,
        abdomenAscites:      abdomenAscites      || undefined,
        abdomen:             examSiteWise.abdomen      || undefined,
        hepatomegaly:        hepatomegaly        || undefined,
        liverConsistency:    liverConsistency    || undefined,
        liverSurface:        liverSurface        || undefined,
        liver:               examSiteWise.liver        || undefined,
        airEntry:            airEntry            || undefined,
        breathSounds:        breathSounds        || undefined,
        lungCrackles:        lungCrackles        || undefined,
        lungs:               examSiteWise.lungs        || undefined,
        skin:                examSiteWise.skin         || undefined,
        neurological:        examSiteWise.neurological || undefined,
      },
      ecogScore:        ecogScore      !== '' ? ecogScore      : undefined,
      karnofskyScore:   karnofskyScore !== '' ? karnofskyScore : undefined,
      clinicalNotes:    notes          || undefined,
      prescriptions:    prescriptions.length  > 0 ? prescriptions  : undefined,
      testOrders:       allTestOrders.length   > 0 ? allTestOrders  : undefined,
      tumorBoardReview: tumorBoardReview       || undefined,
      followUp: isCompletingVisit
        ? noFollowUp
          ? { value: 0, unit: followUpUnit, specificDate: '', noFollowUpNeeded: true, noFollowUpReason: noFollowUpReason.trim() || undefined }
          : effectiveFollowUpDate
            ? { value: parseInt(followUpValue, 10) || 0, unit: followUpUnit, specificDate: effectiveFollowUpDate }
            : clinicalVisit?.followUp
        : clinicalVisit?.followUp,
      createdAt:        clinicalVisit?.createdAt ?? now,
      updatedAt:        now,
    };

    onSave(cv, newVitals);
    if (onPatientsChange) {
      const cleanAllergies = allergies
        .filter(a => a.allergen.trim())
        .map(({ id, ...rest }) => ({ ...rest, id }));
      onPatientsChange(prev => prev.map(p =>
        p.id === patient.id ? { ...p, allergies: cleanAllergies } : p,
      ));
    }
    if (footerAction.statusNext && onStatusChange) onStatusChange(footerAction.statusNext);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* ── Nurse section (S + O-Vitals) ──────────────────────────────────── */}
      {nurseReadOnly && (
        <div className="flex items-center gap-2 px-4 py-2 bg-sky-50 border border-sky-200 rounded-xl">
          <span className="text-xs font-semibold text-sky-700">Nurse section — view only until nurse records vitals</span>
        </div>
      )}
      <div className={nurseReadOnly ? 'pointer-events-none opacity-60 select-none space-y-6' : 'space-y-6'}>

        {/* Visit Information */}
        <Card icon={<Calendar size={16} />} title="Visit Information">
          <div className="flex flex-wrap items-center gap-2 mb-4 p-3 bg-muted/40 rounded-lg">
            <span className="text-sm font-semibold text-foreground">{fmtDate(appointment.date)}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
              {APPOINTMENT_TYPE_LABELS[appointment.type]}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">
              {STATUS_LABELS[appointment.status]}
            </span>
            <span className="text-xs text-muted-foreground ml-1">· {appointment.visitId} · {appointment.time}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FieldLabel label="Attending Nurse" />
              <select value={attendingNurseId} onChange={e => setAttendingNurseId(e.target.value)} className="field-select text-sm">
                <option value="">— Select Nurse —</option>
                {nurses.map(n => <option key={n.id} value={n.id}>{n.name} · {n.designation}</option>)}
              </select>
            </div>
            <div>
              <FieldLabel label="Attending Oncologist" />
              <select value={attendingOncologistId} onChange={e => setAttendingOncologistId(e.target.value)} className="field-select text-sm">
                <option value="">— Select Oncologist —</option>
                {oncologists.map(d => <option key={d.id} value={d.id}>{d.name} · {d.designation}</option>)}
              </select>
            </div>
          </div>
        </Card>

        {/* ── S — Subjective ──────────────────────────────────────────────── */}
        <SOAPBlock letter="S" title="Subjective" color="bg-violet-100 text-violet-700">

          {/* Chief Complaint */}
          <Card icon={<ClipboardList size={16} />} title="Chief Complaint *">
            <div className="space-y-4">
              <div>
                <FieldLabel label="Presenting Symptoms" required />
                <textarea value={chiefComplaints} onChange={e => setChiefComplaints(e.target.value)}
                  placeholder="Describe the patient's presenting complaints for this visit…"
                  rows={3} className="field-textarea text-sm" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <FieldLabel label="Duration" />
                  <input type="text" value={complaintDuration} onChange={e => setComplaintDuration(e.target.value)}
                    placeholder="e.g. 3 weeks, 2 months" className="field-input text-sm" />
                </div>
              </div>
              <div>
                <FieldLabel label="History of Present Illness" />
                <textarea value={hpi} onChange={e => setHpi(e.target.value)}
                  placeholder="Detailed narrative of the current illness — onset, progression, associated symptoms, relevant positives and negatives…"
                  rows={3} className="field-textarea text-sm" />
              </div>
            </div>
          </Card>

          {/* Allergies */}
          <Card icon={<ShieldAlert size={16} />} title="Allergies *">
            <div className="space-y-3">
              {noKnownAllergies ? (
                <div className="flex items-center gap-3 px-4 py-3 bg-green-50 border border-green-200 rounded-xl">
                  <CheckCircle2 size={16} className="text-green-600 shrink-0" />
                  <span className="text-sm font-medium text-green-700">No Known Allergy (NKDA)</span>
                  <button onClick={() => setNoKnownAllergies(false)}
                    className="ml-auto text-xs text-muted-foreground underline hover:text-foreground">
                    Clear
                  </button>
                </div>
              ) : (
                <>
                  {allergies.length > 0 && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border bg-muted/40">
                            {['Type of Allergy', 'Allergen', 'Reaction', ''].map(h => (
                              <th key={h} className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {allergies.map(a => (
                            <tr key={a.id} className="border-b border-border">
                              <td className="py-2 px-2 w-44">
                                <select value={a.type} onChange={e => updateAllergy(a.id!, 'type', e.target.value)} className="field-select text-sm w-full">
                                  {ALLERGY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                                </select>
                              </td>
                              <td className="py-2 px-2">
                                <input type="text" value={a.allergen} onChange={e => updateAllergy(a.id!, 'allergen', e.target.value)}
                                  placeholder="e.g. Penicillin, Peanuts…" className="field-input text-sm w-full" />
                              </td>
                              <td className="py-2 px-2">
                                <input type="text" value={a.reaction ?? ''} onChange={e => updateAllergy(a.id!, 'reaction', e.target.value)}
                                  placeholder="e.g. Rash, Anaphylaxis…" className="field-input text-sm w-full" />
                              </td>
                              <td className="py-2 px-2">
                                <button onClick={() => deleteAllergy(a.id!)}
                                  className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors">
                                  <Trash2 size={13} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  {allergies.length === 0 && (
                    <p className="text-sm text-muted-foreground italic">No allergies recorded — add one or confirm NKDA below.</p>
                  )}
                  <div className="flex items-center gap-3 flex-wrap">
                    <AddRowButton label="Add Allergy" onClick={addAllergy} />
                    <button
                      type="button"
                      onClick={() => { setNoKnownAllergies(true); setAllergies([]); }}
                      className="flex items-center gap-2 px-3 py-2 text-sm font-medium border border-dashed border-green-400 rounded-lg text-green-700 hover:bg-green-50 transition-colors"
                    >
                      <CheckCircle2 size={14} /> No Known Allergy
                    </button>
                  </div>
                </>
              )}
            </div>
          </Card>

          {/* Past History */}
          <Card icon={<Users size={16} />} title="Past History">
            {!isInitialVisit && (ph?.comorbidities?.length || ph?.familyCancerHistory || ph?.smoking) && (
              <div className="mb-5 px-3 py-2 bg-primary/5 border border-primary/20 rounded-lg">
                <p className="text-xs text-primary font-medium">Auto-populated from patient record — review and update as needed.</p>
              </div>
            )}

            {noSignificantPastHistory ? (
              <div className="flex items-center gap-3 px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl mb-4">
                <CheckCircle2 size={16} className="text-blue-600 shrink-0" />
                <span className="text-sm font-medium text-blue-700">No Clinically Significant Past History</span>
                <button onClick={() => setNoSignificantPastHistory(false)}
                  className="ml-auto text-xs text-muted-foreground underline hover:text-foreground">
                  Clear
                </button>
              </div>
            ) : (
              <div className="mb-4">
                <button
                  type="button"
                  onClick={() => setNoSignificantPastHistory(true)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium border border-dashed border-blue-400 rounded-lg text-blue-700 hover:bg-blue-50 transition-colors"
                >
                  <CheckCircle2 size={14} /> No Clinically Significant Past History
                </button>
              </div>
            )}

            {!noSignificantPastHistory && (
              <div className="space-y-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Medical History</p>
                <div>
                  <FieldLabel label="Comorbidities" />
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 mb-3">
                    {COMORBIDITY_OPTIONS.map(opt => (
                      <label key={opt} className="flex items-center gap-2 cursor-pointer select-none">
                        <input type="checkbox" checked={selectedComorbidities.includes(opt)} onChange={() => toggleComorbidity(opt)} className="w-4 h-4 accent-primary rounded" />
                        <span className="text-sm text-foreground">{opt}</span>
                      </label>
                    ))}
                    {customComorbidities.map(c => (
                      <div key={c.id} className="flex items-center gap-2">
                        <input type="checkbox" checked readOnly className="w-4 h-4 accent-primary rounded shrink-0" />
                        <input type="text" value={c.name}
                          onChange={e => setCustomComorbidities(prev => prev.map(x => x.id === c.id ? { ...x, name: e.target.value } : x))}
                          className="field-input text-sm flex-1 min-w-0" placeholder="Custom comorbidity" />
                        <button onClick={() => removeCustomComorbidity(c.id)} className="p-1 text-muted-foreground hover:text-destructive transition-colors shrink-0"><Trash2 size={13} /></button>
                      </div>
                    ))}
                    {addingComorbidity && (
                      <div className="flex items-center gap-2 col-span-2 lg:col-span-3">
                        <input type="text" value={newComorbidityName} onChange={e => setNewComorbidityName(e.target.value)}
                          onKeyDown={e => { if (e.key === 'Enter') confirmCustomComorbidity(); if (e.key === 'Escape') { setAddingComorbidity(false); setNewComorbidityName(''); } }}
                          placeholder="Enter comorbidity name…" autoFocus className="field-input text-sm flex-1" />
                        <button onClick={confirmCustomComorbidity} className="px-3 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">Add</button>
                        <button onClick={() => { setAddingComorbidity(false); setNewComorbidityName(''); }} className="px-3 py-2 text-sm font-medium bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors">Cancel</button>
                      </div>
                    )}
                  </div>
                  {!addingComorbidity && <AddRowButton label="Add Comorbidity" onClick={() => setAddingComorbidity(true)} />}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <FieldLabel label="Prior Cancer" />
                    <input type="text" value={priorCancer} onChange={e => setPriorCancer(e.target.value)} placeholder="Type and stage if applicable" className="field-input text-sm" />
                  </div>
                  <div>
                    <FieldLabel label="Prior Surgery" />
                    <input type="text" value={priorSurgery} onChange={e => setPriorSurgery(e.target.value)} placeholder="Procedure and year" className="field-input text-sm" />
                  </div>
                </div>

                <SectionDivider title="Social History" />
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {([
                      { label: 'Smoking',         value: smoking, setter: setSmoking, options: SMOKING_OPTIONS },
                      { label: 'Alcohol',         value: alcohol, setter: setAlcohol, options: ALCOHOL_OPTIONS },
                      { label: 'Oral Tobacco Use',value: tobacco, setter: setTobacco, options: TOBACCO_OPTIONS },
                    ] as { label: string; value: string; setter: (v: string) => void; options: string[] }[]).map(({ label, value, setter, options }) => (
                      <div key={label}>
                        <FieldLabel label={label} />
                        <select value={value} onChange={e => setter(e.target.value)} className="field-select text-sm">
                          <option value="">— Select —</option>
                          {options.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                  {socialCustomFields.length > 0 && (
                    <div className="space-y-2">
                      {socialCustomFields.map(f => (
                        <div key={f.id} className="flex items-center gap-2">
                          <input type="text" value={f.label} onChange={e => updateSocialField(f.id, 'label', e.target.value)}
                            placeholder="Field name" className="field-input text-sm flex-1" />
                          <select value={f.status} onChange={e => updateSocialField(f.id, 'status', e.target.value)} className="field-select text-sm w-40 shrink-0">
                            <option value="">— Status —</option>
                            {SOCIAL_STATUS_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                          <button onClick={() => removeSocialField(f.id)} className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors shrink-0"><Trash2 size={13} /></button>
                        </div>
                      ))}
                    </div>
                  )}
                  <AddRowButton label="Add Field" onClick={addSocialField} />
                </div>

                <SectionDivider title="Occupational History" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <FieldLabel label="Occupational Field" />
                    <select value={occupationalField} onChange={e => setOccupationalField(e.target.value)} className="field-select text-sm">
                      <option value="">— Select Occupation —</option>
                      {OCCUPATION_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <FieldLabel label="Exposure to Toxins" />
                    <input type="text" value={toxinExposure} onChange={e => setToxinExposure(e.target.value)}
                      placeholder="e.g. Pesticides, asbestos, benzene" className="field-input text-sm" />
                  </div>
                </div>

                <SectionDivider title="Family History" />
                <div>
                  <FieldLabel label="Cancer in First-Degree Relatives" />
                  <textarea value={familyCancerHistory} onChange={e => setFamilyCancerHistory(e.target.value)}
                    placeholder="Type, relation, age at diagnosis…" rows={3} className="field-textarea text-sm" />
                </div>
              </div>
            )}
          </Card>
        </SOAPBlock>

        {/* ── O — Objective: Vitals ──────────────────────────────────────── */}
        <SOAPBlock letter="O" title="Objective" color="bg-sky-100 text-sky-700">
          <Card icon={<Activity size={16} />} title="Vitals *">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

              <div>
                <FieldLabel label="Height (cm)" />
                <input type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder="50 – 250"
                  className={`field-input text-sm ${heightError ? 'border-destructive bg-destructive/5' : ''}`} />
                {heightError && <ErrorAlert message="Must be 50 – 250 cm" />}
              </div>

              <div>
                <FieldLabel label="Weight (kg)" />
                <input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="5 – 200"
                  className={`field-input text-sm ${weightError ? 'border-destructive bg-destructive/5' : ''}`} />
                {weightError && <ErrorAlert message="Must be 5 – 200 kg" />}
              </div>

              <div>
                <FieldLabel label="BMI (auto)" />
                <div className={`field-input text-sm ${bmi ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>{bmi || '—'}</div>
              </div>

              <div>
                <FieldLabel label="BSA m² (auto)" />
                <div className={`field-input text-sm ${bsa ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>{bsa ? `${bsa} m²` : '—'}</div>
                {bsaWarn && <WarnAlert message="BSA outside typical adult range (1.2 – 2.5 m²) — verify height & weight before dose calculation" />}
              </div>

              <div className="col-span-2 md:col-span-1">
                <FieldLabel label="BP (mmHg)" required />
                <div className="flex items-center gap-1">
                  <input type="number" value={bpSystolic} onChange={e => setBpSystolic(e.target.value)} placeholder="Sys"
                    className={`field-input text-sm w-full ${bpBlocker ? 'border-destructive bg-destructive/5' : (bpSysHigh || bpSysLow) ? 'border-amber-500 bg-amber-50' : ''}`} />
                  <span className="text-muted-foreground font-bold">/</span>
                  <input type="number" value={bpDiastolic} onChange={e => setBpDiastolic(e.target.value)} placeholder="Dia"
                    className={`field-input text-sm w-full ${bpBlocker ? 'border-destructive bg-destructive/5' : bpDiaLow ? 'border-amber-500 bg-amber-50' : ''}`} />
                </div>
                {bpBlocker  && <ErrorAlert message="Systolic must be greater than diastolic" />}
                {!bpBlocker && bpSysHigh && <WarnAlert message="Systolic > 180 — hypertensive, monitor closely" />}
                {!bpBlocker && bpSysLow  && <WarnAlert message="Systolic < 90 — hypotensive, assess immediately" />}
                {!bpBlocker && bpDiaLow  && <WarnAlert message="Diastolic < 60 — low diastolic, monitor" />}
              </div>

              <div>
                <FieldLabel label="Pulse (bpm)" required />
                <input type="number" value={pulse} onChange={e => setPulse(e.target.value)} placeholder="e.g. 78"
                  className={`field-input text-sm ${(pulseLow || pulseHigh) ? 'border-amber-500 bg-amber-50' : ''}`} />
                {pulseLow  && <WarnAlert message="Pulse < 50 — bradycardia" />}
                {pulseHigh && <WarnAlert message="Pulse > 130 — tachycardia" />}
              </div>

              <div>
                <FieldLabel label="Temperature (°F)" required />
                <input type="number" value={temperature} onChange={e => setTemperature(e.target.value)} placeholder="e.g. 98.6"
                  className={`field-input text-sm ${(tempLow || tempHigh) ? 'border-amber-500 bg-amber-50' : ''}`} />
                {tempLow  && <WarnAlert message="Temp < 92°F — hypothermia risk" />}
                {tempHigh && <WarnAlert message="Temp > 106°F — critical hyperthermia" />}
              </div>

              <div>
                <FieldLabel label="SpO₂ (%)" />
                <input type="number" value={spo2} onChange={e => handleSpo2Change(e.target.value)} placeholder="e.g. 98" min="0" max="100"
                  className={`field-input text-sm ${spo2Low ? 'border-amber-500 bg-amber-50' : ''}`} />
                {spo2Low && <WarnAlert message="SpO₂ < 88% — requires immediate attention" />}
              </div>

            </div>

            {/* Custom Vitals */}
            <div className="mt-5 border-t border-border pt-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Custom Vitals</p>
              {customVitals.length > 0 && (
                <div className="space-y-2 mb-3">
                  {customVitals.map(v => (
                    <div key={v.id} className="flex items-center gap-2">
                      <input type="text" value={v.name} onChange={e => updateCustomVital(v.id, 'name', e.target.value)}
                        placeholder="Label (e.g. Respirations)" className="field-input text-sm flex-1" />
                      <input type="text" value={v.value} onChange={e => updateCustomVital(v.id, 'value', e.target.value)}
                        placeholder="Value" className="field-input text-sm w-28 shrink-0" />
                      <input type="text" value={v.unit} onChange={e => updateCustomVital(v.id, 'unit', e.target.value)}
                        placeholder="Unit" className="field-input text-sm w-20 shrink-0" />
                      <button onClick={() => removeCustomVital(v.id)} className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors shrink-0">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <AddRowButton label="Add Vital" onClick={addCustomVital} />
            </div>
          </Card>
        </SOAPBlock>

      </div>{/* end nurse section */}

      {/* ── Oncologist section (O-Exam + A + P) ──────────────────────────── */}
      {oncoReadOnly && (
        <div className="flex items-center gap-2 px-4 py-2 bg-violet-50 border border-violet-200 rounded-xl">
          <span className="text-xs font-semibold text-violet-700">Oncologist section — view only for nurses</span>
        </div>
      )}
      <div className={oncoReadOnly ? 'pointer-events-none opacity-60 select-none space-y-6' : 'space-y-6'}>

        {/* O continued — Physical Examination */}
        <div className="pl-2 border-l-2 border-sky-200">
          <p className="text-xs font-semibold text-sky-600 uppercase tracking-wide mb-4 pl-3">O — Physical Examination (optional)</p>
          <Card icon={<Stethoscope size={16} />} title="Physical Examination" optional>
            <div className="space-y-6">

              {/* General */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">General Examination</p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {([
                    { label: 'Cachexia',          value: cachexia,    setter: setCachexia,    options: ['Absent', 'Present'] },
                    { label: 'Pallor',            value: pallor,      setter: setPallor,      options: ['Absent', 'Mild', 'Moderate', 'Severe'] },
                    { label: 'Icterus',           value: icterus,     setter: setIcterus,     options: ['Absent', 'Mild', 'Moderate', 'Severe'] },
                    { label: 'Cyanosis',          value: cyanosis,    setter: setCyanosis,    options: ['Absent', 'Central', 'Peripheral', 'Central & Peripheral'] },
                    { label: 'Clubbing',          value: clubbing,    setter: setClubbing,    options: ['Absent', 'Grade I', 'Grade II', 'Grade III', 'Grade IV', 'Grade V'] },
                    { label: 'Edema (peripheral)',value: edema,       setter: setEdema,       options: ['Absent', '+ (Mild)', '++ (Moderate)', '+++ (Severe)'] },
                    { label: 'Dehydration',       value: dehydration, setter: setDehydration, options: ['Absent', 'Mild', 'Moderate', 'Severe'] },
                  ] as { label: string; value: string; setter: (v: string) => void; options: string[] }[]).map(({ label, value, setter, options }) => (
                    <div key={label}>
                      <FieldLabel label={label} />
                      <select value={value} onChange={e => setter(e.target.value)} className="field-select text-sm">
                        <option value="">— Not assessed —</option>
                        {options.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                  ))}
                  <div>
                    <FieldLabel label="Lymphadenopathy Site" />
                    <select value={lymphadenopathySite} onChange={e => setLymphadenopathySite(e.target.value)} className="field-select text-sm">
                      <option value="">— Not assessed —</option>
                      {LYMPH_SITES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div className="mt-4">
                  <FieldLabel label="General Examination Notes" />
                  <textarea value={examGeneral} onChange={e => setExamGeneral(e.target.value)}
                    placeholder="General appearance, nutritional status, other findings…"
                    rows={2} className="field-textarea text-sm" />
                </div>
              </div>

              {/* Site-Wise */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">Site-Wise Examination</p>
                <div className="space-y-5">

                  <div>
                    <FieldLabel label="Primary Site / Tumour" />
                    <textarea value={examSiteWise.primarySite}
                      onChange={e => setExamSiteWise(prev => ({ ...prev, primarySite: e.target.value }))}
                      placeholder="Size, site, consistency, borders, mobility…"
                      rows={2} className="field-textarea text-sm" />
                  </div>

                  <div className="border border-border rounded-xl p-4 space-y-3">
                    <p className="text-xs font-semibold text-foreground">Abdomen</p>
                    <div className="grid grid-cols-3 gap-3">
                      {([
                        { label: 'Distension', value: abdomenDistension, setter: setAbdomenDistension, options: ['Absent', 'Mild', 'Moderate', 'Severe'] },
                        { label: 'Tenderness', value: abdomenTenderness, setter: setAbdomenTenderness, options: ['Absent', 'Mild', 'Moderate', 'Severe'] },
                        { label: 'Ascites',    value: abdomenAscites,    setter: setAbdomenAscites,    options: ['Absent', 'Present'] },
                      ] as { label: string; value: string; setter: (v: string) => void; options: string[] }[]).map(({ label, value, setter, options }) => (
                        <div key={label}>
                          <FieldLabel label={label} />
                          <select value={value} onChange={e => setter(e.target.value)} className="field-select text-sm">
                            <option value="">—</option>
                            {options.map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                      ))}
                    </div>
                    <div>
                      <FieldLabel label="Abdomen Notes" />
                      <textarea value={examSiteWise.abdomen} onChange={e => setExamSiteWise(prev => ({ ...prev, abdomen: e.target.value }))}
                        placeholder="Mass, organomegaly, other findings…" rows={1} className="field-textarea text-sm" />
                    </div>
                  </div>

                  <div className="border border-border rounded-xl p-4 space-y-3">
                    <p className="text-xs font-semibold text-foreground">Liver</p>
                    <div className="grid grid-cols-3 gap-3">
                      {([
                        { label: 'Hepatomegaly', value: hepatomegaly,     setter: setHepatomegaly,     options: ['Not Palpable', '2 cm below costal margin', '4 cm below costal margin', '6 cm below costal margin', '> 6 cm below costal margin'] },
                        { label: 'Consistency',  value: liverConsistency, setter: setLiverConsistency, options: ['Soft', 'Firm', 'Hard', 'Stony Hard'] },
                        { label: 'Surface',      value: liverSurface,     setter: setLiverSurface,     options: ['Smooth', 'Nodular', 'Irregular'] },
                      ] as { label: string; value: string; setter: (v: string) => void; options: string[] }[]).map(({ label, value, setter, options }) => (
                        <div key={label}>
                          <FieldLabel label={label} />
                          <select value={value} onChange={e => setter(e.target.value)} className="field-select text-sm">
                            <option value="">—</option>
                            {options.map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                      ))}
                    </div>
                    <div>
                      <FieldLabel label="Liver Notes" />
                      <textarea value={examSiteWise.liver} onChange={e => setExamSiteWise(prev => ({ ...prev, liver: e.target.value }))}
                        placeholder="Tenderness, span, other findings…" rows={1} className="field-textarea text-sm" />
                    </div>
                  </div>

                  <div className="border border-border rounded-xl p-4 space-y-3">
                    <p className="text-xs font-semibold text-foreground">Lungs</p>
                    <div className="grid grid-cols-3 gap-3">
                      {([
                        { label: 'Air Entry',     value: airEntry,     setter: setAirEntry,     options: ['Normal Bilateral', 'Reduced Left', 'Reduced Right', 'Reduced Bilateral', 'Absent'] },
                        { label: 'Breath Sounds', value: breathSounds, setter: setBreathSounds, options: ['Vesicular', 'Bronchial', 'Decreased'] },
                        { label: 'Crackles',      value: lungCrackles, setter: setLungCrackles, options: ['None', 'Fine Basal', 'Coarse', 'Bilateral'] },
                      ] as { label: string; value: string; setter: (v: string) => void; options: string[] }[]).map(({ label, value, setter, options }) => (
                        <div key={label}>
                          <FieldLabel label={label} />
                          <select value={value} onChange={e => setter(e.target.value)} className="field-select text-sm">
                            <option value="">—</option>
                            {options.map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                      ))}
                    </div>
                    <div>
                      <FieldLabel label="Lungs Notes" />
                      <textarea value={examSiteWise.lungs} onChange={e => setExamSiteWise(prev => ({ ...prev, lungs: e.target.value }))}
                        placeholder="Wheeze, rhonchi, other findings…" rows={1} className="field-textarea text-sm" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <FieldLabel label="Skin / Subcutaneous" />
                      <textarea value={examSiteWise.skin} onChange={e => setExamSiteWise(prev => ({ ...prev, skin: e.target.value }))}
                        placeholder="Metastatic nodules, rash, other…" rows={2} className="field-textarea text-sm" />
                    </div>
                    <div>
                      <FieldLabel label="Neurological" />
                      <textarea value={examSiteWise.neurological} onChange={e => setExamSiteWise(prev => ({ ...prev, neurological: e.target.value }))}
                        placeholder="Orientation, cranial nerves, motor/sensory…" rows={2} className="field-textarea text-sm" />
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* ── A — Assessment ──────────────────────────────────────────────── */}
        <SOAPBlock letter="A" title="Assessment" color="bg-amber-100 text-amber-700">
          <Card icon={<FileText size={16} />} title="Assessment">
            <div className="space-y-5">
              <div>
                <FieldLabel label="Provisional Diagnosis" required />
                <textarea value={provisionalDiagnosis} onChange={e => setProvisionalDiagnosis(e.target.value)}
                  placeholder="Working diagnosis based on history, examination, and available investigations…"
                  rows={3} className="field-textarea text-sm" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <FieldLabel label="ECOG Performance Status" />
                  <select value={ecogScore}
                    onChange={e => setEcogScore(e.target.value === '' ? '' : Number(e.target.value) as EcogScore)}
                    className="field-select text-sm mb-2">
                    <option value="">— Select ECOG Score —</option>
                    {([0, 1, 2, 3, 4] as EcogScore[]).map(s => (
                      <option key={s} value={s}>{s} — {ECOG_LABELS[s]}</option>
                    ))}
                  </select>
                  {ecogScore !== '' && (
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${ECOG_COLORS[ecogScore]}`}>
                      ECOG {ecogScore}: {ECOG_LABELS[ecogScore]}
                    </span>
                  )}
                </div>
                <div>
                  <FieldLabel label="Karnofsky Performance Score" />
                  <select value={karnofskyScore}
                    onChange={e => setKarnofskyScore(e.target.value === '' ? '' : Number(e.target.value))}
                    className="field-select text-sm mb-2">
                    <option value="">— Select KPS —</option>
                    {KARNOFSKY_VALUES.map(v => (
                      <option key={v} value={v}>{v} — {KARNOFSKY_LABELS[v]}</option>
                    ))}
                  </select>
                  {karnofskyScore !== '' && (
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                      karnofskyScore >= 80 ? 'bg-green-100 text-green-700' :
                      karnofskyScore >= 60 ? 'bg-amber-100 text-amber-700' :
                      'bg-destructive/10 text-destructive'
                    }`}>
                      KPS {karnofskyScore}: {KARNOFSKY_LABELS[karnofskyScore]}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </SOAPBlock>

        {/* ── P — Plan ────────────────────────────────────────────────────── */}
        <SOAPBlock letter="P" title="Plan" color="bg-green-100 text-green-700">

          {/* Investigations */}
          <Card icon={<FlaskConical size={16} />} title="Investigations">
            <div className="space-y-5">

              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Quick Add — Investigation Set</p>
                <select
                  value=""
                  onChange={e => {
                    const set = INVESTIGATION_ORDER_SETS.find(s => s.name === e.target.value);
                    if (set) addOrderSet(set);
                  }}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="">Select an investigation set to add…</option>
                  {INVESTIGATION_ORDER_SETS.map(set => (
                    <option key={set.name} value={set.name}>{set.name} — {set.description}</option>
                  ))}
                </select>
              </div>

              {testOrders.length > 0 && (
                <div className="overflow-x-auto">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Test Orders</p>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/40">
                        {['Category', 'Sub-Category', 'Test Name', 'Instructions', ''].map(h => (
                          <th key={h} className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {testOrders.map(to => {
                        const catDef = MEDICAL_RECORD_CATEGORIES.find(c => c.category === to.category);
                        return (
                          <tr key={to.id} className="border-b border-border">
                            <td className="py-2 px-2 w-36">
                              <select value={to.category} onChange={e => updateTestOrder(to.id, 'category', e.target.value)} className="field-select text-sm w-full">
                                <option value="">Select</option>
                                {MEDICAL_RECORD_CATEGORIES.map(c => <option key={c.category} value={c.category}>{c.category}</option>)}
                              </select>
                            </td>
                            <td className="py-2 px-2 w-36">
                              <select value={to.subcategory ?? ''} onChange={e => updateTestOrder(to.id, 'subcategory', e.target.value)} disabled={!catDef} className="field-select text-sm w-full disabled:opacity-40">
                                <option value="">Select</option>
                                {catDef?.subcategories.map(s => <option key={s} value={s}>{s}</option>)}
                              </select>
                            </td>
                            <td className="py-2 px-2">
                              <input type="text" value={to.testName} onChange={e => updateTestOrder(to.id, 'testName', e.target.value)} placeholder="e.g. CBC with Differential" className="field-input text-sm w-full" />
                            </td>
                            <td className="py-2 px-2">
                              <input type="text" value={to.instructions ?? ''} onChange={e => updateTestOrder(to.id, 'instructions', e.target.value)} placeholder="e.g. Fasting" className="field-input text-sm w-full" />
                            </td>
                            <td className="py-2 px-2">
                              <button onClick={() => deleteTestOrder(to.id)} className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors"><Trash2 size={13} /></button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
              <AddRowButton label="Add Test Manually" onClick={addTestOrder} />
            </div>
          </Card>

          {/* Medications */}
          <Card icon={<Pill size={16} />} title="Medications">
            <div className="space-y-4">

              {/* Quick Add dropdown */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Quick Add</p>
                <select
                  value=""
                  onChange={e => {
                    const [group, idx] = e.target.value.split(':');
                    const list = group === 'inj' ? INJECTION_ORDER_SETS : MEDICATION_ORDER_SETS;
                    const med = list[parseInt(idx, 10)];
                    if (med) addFromOrderSet(med);
                  }}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="">— Select a medicine to add (fills all fields) —</option>
                  <optgroup label="Oral / General">
                    {MEDICATION_ORDER_SETS.map((med, i) => (
                      <option key={i} value={`oral:${i}`}>{med.medicineName} {med.dose} — {med.frequency}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Injections / IV / SC">
                    {INJECTION_ORDER_SETS.map((med, i) => (
                      <option key={i} value={`inj:${i}`}>{med.medicineName} {med.dose} — {med.frequency}</option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {prescriptions.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/40">
                        {['Medicine Name', 'Dose', 'Frequency', 'Duration', 'Before/After Food', 'Instructions', ''].map(h => (
                          <th key={h} className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {prescriptions.map(rx => (
                        <tr key={rx.id} className="border-b border-border">
                          {(['medicineName', 'dose', 'frequency', 'duration', 'beforeAfterFood', 'instructions'] as (keyof VisitPrescription)[]).map(field => (
                            <td key={field} className="py-2 px-2">
                              <input type="text" value={(rx[field] ?? '') as string}
                                onChange={e => updatePrescription(rx.id, field, e.target.value)}
                                placeholder={field === 'medicineName' ? 'e.g. Ondansetron' : field === 'dose' ? '8mg' : field === 'frequency' ? 'BD' : field === 'duration' ? '5 days' : field === 'beforeAfterFood' ? 'After food' : 'Notes'}
                                className="field-input text-sm w-full" />
                            </td>
                          ))}
                          <td className="py-2 px-2">
                            <button onClick={() => deletePrescription(rx.id)} className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors"><Trash2 size={13} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <AddRowButton label="Add Medicine Manually" onClick={addPrescription} />
            </div>
          </Card>

          {/* Follow-up / Notes */}
          <Card icon={<ClipboardList size={16} />} title="Follow-up / Notes">
            <FieldLabel label="Visit Notes" required />
            <textarea value={notes} onChange={e => setNotes(e.target.value)}
              placeholder="Follow-up instructions, next review date, additional clinical notes…"
              rows={5} className="field-textarea text-sm" />
          </Card>

          {/* Tumor Board */}
          <div className="flex items-center gap-3 px-5 py-3 bg-card border border-border rounded-xl">
            <CheckSquare size={16} className={tumorBoardReview ? 'text-primary' : 'text-muted-foreground'} />
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" checked={tumorBoardReview} onChange={e => setTumorBoardReview(e.target.checked)} className="w-4 h-4 accent-primary rounded" />
              <span className="text-sm font-medium text-foreground">Flag for Tumor Board Review</span>
            </label>
            {tumorBoardReview && (
              <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">Flagged</span>
            )}
          </div>

        </SOAPBlock>
      </div>{/* end oncologist section */}

      {/* ── Next Follow Up ────────────────────────────────────────────────── */}
      {currentUser.role === 'oncologist' && (
        <div className="border border-primary/30 bg-primary/5 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={15} className="text-primary" />
            <span className="text-sm font-semibold text-foreground">
              Next Follow Up{isCompletingVisit && !noFollowUp && <span className="text-destructive ml-0.5">*</span>}
            </span>
          </div>

          {/* No Follow-Up Needed checkbox */}
          <label className="flex items-center gap-2 mb-4 cursor-pointer w-fit">
            <input
              type="checkbox"
              checked={noFollowUp}
              onChange={e => { setNoFollowUp(e.target.checked); setFollowUpValue(''); setFollowUpDate(''); }}
              className="w-4 h-4 rounded border-border accent-primary"
            />
            <span className="text-sm text-foreground">No Follow-Up Needed</span>
          </label>

          {noFollowUp ? (
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Reason <span className="text-muted-foreground">(optional)</span></label>
              <input
                type="text"
                value={noFollowUpReason}
                onChange={e => setNoFollowUpReason(e.target.value)}
                placeholder="e.g. Patient discharged, palliative care only…"
                className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-3">
                {/* Interval value 1–10 */}
                <select
                  value={followUpValue}
                  onChange={e => { setFollowUpValue(e.target.value); setFollowUpDate(''); }}
                  className="px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 w-24"
                >
                  <option value="">—</option>
                  {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>

                {/* Unit */}
                <select
                  value={followUpUnit}
                  onChange={e => { setFollowUpUnit(e.target.value as FollowUp['unit']); setFollowUpDate(''); }}
                  className="px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 w-32"
                >
                  {(['Days', 'Weeks', 'Months'] as const).map(u => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>

                <span className="text-xs text-muted-foreground">or specific date:</span>

                {/* Date picker */}
                <input
                  type="date"
                  value={followUpDate || computedFollowUpDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => setFollowUpDate(e.target.value)}
                  className="px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              {effectiveFollowUpDate && !followUpConstraintError && (
                <p className="mt-3 text-xs text-muted-foreground">
                  Scheduled:{' '}
                  {new Date(effectiveFollowUpDate + 'T00:00:00').toLocaleDateString('en-IN', {
                    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
                  })}
                </p>
              )}
              {followUpConstraintError && (
                <p className="mt-3 text-xs text-destructive flex items-center gap-1.5">
                  <AlertTriangle size={12} /> {followUpConstraintError}
                </p>
              )}
              {isCompletingVisit && !effectiveFollowUpDate && (
                <p className="mt-3 text-xs text-amber-600 flex items-center gap-1.5">
                  <AlertTriangle size={12} /> Select an interval or pick a date before completing the visit
                </p>
              )}
            </>
          )}
        </div>
      )}

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <div className="text-xs text-muted-foreground">
          {currentUser.role === 'nurse'      ? 'Editing S — Subjective + O — Vitals' :
           currentUser.role === 'oncologist' ? 'Editing O — Exam + A — Assessment + P — Plan' : null}
        </div>
        <div className="flex items-center gap-3">
          {preChecklistBlocked && (
            <span className="text-xs text-destructive flex items-center gap-1">
              <AlertTriangle size={13} /> Add a Treatment Delivery cycle before completing the pre-chemo checklist
            </span>
          )}
          {!preChecklistBlocked && mandatoryErrors.length > 0 && (
            <span className="text-xs text-destructive flex items-center gap-1">
              <AlertTriangle size={13} /> {mandatoryErrors[0]}
            </span>
          )}
          {!preChecklistBlocked && !!heightError || !!weightError || !!bpBlocker ? (
            <span className="text-xs text-destructive flex items-center gap-1">
              <AlertTriangle size={13} /> Fix validation errors to save
            </span>
          ) : null}
          {saved && !saveDisabled && (
            <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
              <CheckCircle2 size={15} /> Saved
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saveDisabled}
            className="px-6 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {footerAction.label}
          </button>
        </div>
      </div>

    </div>
  );
}

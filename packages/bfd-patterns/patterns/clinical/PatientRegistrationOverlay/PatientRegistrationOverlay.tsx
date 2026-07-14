import * as styles from './PatientRegistrationOverlay.styles';
import { useState, useMemo, useRef, useEffect } from 'react';
import { X, UserPlus, Upload, FileText, Printer, Download, CheckCircle2 } from 'bfd-icons';
import type { Patient } from 'bfd-core';
import { CENTER_INITIALS } from 'bfd-core';
import {
  COUNTRY_CODES, PINCODE_LOOKUP, COUNTRIES, IDENTIFIER_TYPES, RELATIONS,
  GOVT_SCHEMES, MEDICAL_RECORD_CATEGORIES,
} from 'bfd-core';
import { DatePicker } from 'bfd-core';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'bfd-core';
import { Button } from 'bfd-core';
import { FormField } from 'bfd-core';
import { Select } from 'bfd-core';
import { TextField } from 'bfd-core';
import { Textarea } from 'bfd-core';
import { IconButton } from 'bfd-core';
import { ResultState } from 'bfd-core';
import { generateRegistrationReceiptHTML, printRegistrationReceipt } from '../../../lib/invoiceTemplate';

// ── Types ──────────────────────────────────────────────────────────────────

interface FormState {
  // §1 Demographics
  hospitalId:           string;
  firstName:            string;
  lastName:             string;
  gender:               'M' | 'F' | 'Other' | '';
  dob:                  Date | undefined;
  registeredDate:       Date;
  identifierType:       string;
  identifierNumber:     string;
  // §2 Address
  addressLine1:         string;
  addressLine2:         string;
  pincode:              string;
  city:                 string;
  district:             string;
  state:                string;
  intlCity:             string;
  intlStateProvince:    string;
  intlPostalCode:       string;
  intlCountry:          string;
  // §3 Contact
  countryCode:          string;
  phone:                string;
  phoneWhatsapp:        boolean;
  altCountryCode:       string;
  altPhone:             string;
  altPhoneWhatsapp:     boolean;
  email:                string;
  // §4 Emergency
  emergencyName:        string;
  emergencyRelation:    string;
  emergencyCountryCode: string;
  emergencyPhone:       string;
  // §5 Payor
  payorType:            '' | 'self' | 'insurance' | 'government' | 'corporate';
  insName:              string;
  insPolicyNumber:      string;
  insMemberId:          string;
  insPolicyHolderName:  string;
  insRelationship:      string;
  insPolicyStartDate:   Date | undefined;
  insPolicyEndDate:     Date | undefined;
  govtSchemeName:       string;
  govtBeneficiaryId:    string;
  govtCardNumber:       string;
  govtIssueDate:        Date | undefined;
  corpName:             string;
  corpEmployeeName:     string;
  corpEmployeeId:       string;
  corpRelationship:     string;
  corpTpaName:          string;
  corpInsuranceCompany: string;
  corpPolicyNumber:     string;
  corpMemberId:         string;
  corpPolicyStartDate:  Date | undefined;
  corpPolicyEndDate:    Date | undefined;
  // §6 Referral
  referralSource:       '' | 'opd-walk-in' | 'referral';
  referringDoctor:      string;
  referringHospital:    string;
  // §7 Chief Complaints
  chiefComplaints:      string;
  // §9 Consent
  dataConsent:          boolean;
}

type Errors = Record<string, string | undefined>;

interface UploadedDoc { id: string; type: string; fileName: string; date: string; }

interface Props {
  selectedCenter: string;
  patients:       Patient[];
  onRegister:     (p: Patient) => void;
  onClose:        () => void;
}

// ── Helpers ────────────────────────────────────────────────────────────────

function calculateAge(dob: Date | undefined): string {
  if (!dob) return '';
  const now   = new Date();
  let years   = now.getFullYear() - dob.getFullYear();
  let months  = now.getMonth()    - dob.getMonth();
  if (months < 0)                    { years--; months += 12; }
  if (now.getDate() < dob.getDate()) { if (--months < 0) { years--; months += 12; } }
  if (years === 0) return `${months} mo`;
  return `${years} yr${years !== 1 ? 's' : ''} ${months} mo`;
}

function validatePhone(phone: string, dialCode: string): boolean {
  const d = phone.replace(/\D/g, '');
  if (dialCode === '+91' || dialCode === '+1') return /^\d{10}$/.test(d);
  return d.length >= 6 && d.length <= 15;
}

function fmtDate(d: Date): string {
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
}

// ── Sub-components ─────────────────────────────────────────────────────────

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.style1}>
      <h3 className={styles.style2}>{children}</h3>
    </div>
  );
}

interface PhoneFieldProps {
  label: string; required?: boolean;
  dialCode: string; onDialChange: (v: string) => void;
  phone: string; onPhoneChange: (v: string) => void;
  whatsapp?: boolean; onWhatsapp?: (v: boolean) => void;
  error?: string; placeholder?: string;
}

function PhoneField({ label, required, dialCode, onDialChange, phone, onPhoneChange, whatsapp, onWhatsapp, error, placeholder = 'Enter number' }: PhoneFieldProps) {
  return (
    <div>
      <label className={styles.style3}>
        {label} {required && <span className={styles.style4}>*</span>}
      </label>
      <div className={`flex rounded-lg border overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 transition-all ${error ? 'border-destructive' : 'border-border focus-within:border-primary'}`}>
        <select
          value={dialCode}
          onChange={e => onDialChange(e.target.value)}
          className={styles.style5}
          style={{ minWidth: '80px' }}
        >
          {COUNTRY_CODES.map(c => (
            <option key={`${c.code}-${c.dialCode}`} value={c.dialCode}>{c.name} {c.dialCode}</option>
          ))}
        </select>
        <input
          type="tel"
          value={phone}
          onChange={e => onPhoneChange(e.target.value.replace(/\D/g, ''))}
          placeholder={placeholder}
          className={styles.style6}
        />
      </div>
      {onWhatsapp !== undefined && (
        <label className={styles.style7}>
          <input type="checkbox" checked={whatsapp ?? false} onChange={e => onWhatsapp(e.target.checked)} className={styles.style8} />
          <span className={styles.style9}>WhatsApp available on this number</span>
        </label>
      )}
      {error && <p className={styles.style10}>{error}</p>}
    </div>
  );
}

// ── Constants ──────────────────────────────────────────────────────────────

const POLICY_RELATIONS = ['Self', 'Spouse', 'Parent', 'Child'] as const;

const INITIAL_FORM: Omit<FormState, 'registeredDate'> = {
  hospitalId: '', firstName: '', lastName: '', gender: '', dob: undefined,
  identifierType: '', identifierNumber: '',
  addressLine1: '', addressLine2: '',
  pincode: '', city: '', district: '', state: '',
  intlCity: '', intlStateProvince: '', intlPostalCode: '', intlCountry: '',
  countryCode: '+91', phone: '', phoneWhatsapp: false,
  altCountryCode: '+91', altPhone: '', altPhoneWhatsapp: false, email: '',
  emergencyName: '', emergencyRelation: '', emergencyCountryCode: '+91', emergencyPhone: '',
  payorType: '',
  insName: '', insPolicyNumber: '', insMemberId: '', insPolicyHolderName: '', insRelationship: '',
  insPolicyStartDate: undefined, insPolicyEndDate: undefined,
  govtSchemeName: '', govtBeneficiaryId: '', govtCardNumber: '', govtIssueDate: undefined,
  corpName: '', corpEmployeeName: '', corpEmployeeId: '', corpRelationship: '',
  corpTpaName: '', corpInsuranceCompany: '', corpPolicyNumber: '', corpMemberId: '',
  corpPolicyStartDate: undefined, corpPolicyEndDate: undefined,
  referralSource: '', referringDoctor: '', referringHospital: '',
  chiefComplaints: '',
  dataConsent: false,
};

// ── Main component ─────────────────────────────────────────────────────────

export function PatientRegistrationOverlay({ selectedCenter, patients, onRegister, onClose }: Props) {
  const todayDate  = useMemo(() => new Date(), []);
  const minRegDate = useMemo(() => { const d = new Date(todayDate); d.setDate(d.getDate() - 7); return d; }, [todayDate]);

  const mrn = useMemo(() => {
    const initials = CENTER_INITIALS[selectedCenter] ?? 'XXX';
    const count    = patients.filter(p => p.mrn.startsWith(`BO-${initials}-`)).length;
    return `BO-${initials}-${String(count + 1).padStart(8, '0')}`;
  }, [patients, selectedCenter]);

  const [form, setForm]                   = useState<FormState>({ ...INITIAL_FORM, registeredDate: todayDate });
  const [errors, setErrors]               = useState<Errors>({});
  const [identifierDoc, setIdentifierDoc] = useState<{ name: string } | null>(null);
  const [uploadedDocs, setUploadedDocs]   = useState<UploadedDoc[]>([]);
  const [docType, setDocType]             = useState('');
  const [receiptData, setReceiptData]     = useState<{ patient: Patient; receiptNumber: string } | null>(null);
  const [showSuccess, setShowSuccess]     = useState(false);
  const [successInfo, setSuccessInfo]     = useState<{ name: string; mrn: string } | null>(null);

  const activeSectionRef = useRef<number>(0);
  const fileInputRef     = useRef<HTMLInputElement>(null);
  const docFileRef       = useRef<HTMLInputElement>(null);

  const isInternational = useMemo(
    () => IDENTIFIER_TYPES.find(t => t.value === form.identifierType)?.isInternational === true,
    [form.identifierType],
  );
  const age = useMemo(() => calculateAge(form.dob), [form.dob]);

  // Auto-update all phone country codes when international address country changes
  useEffect(() => {
    if (!form.intlCountry) return;
    const cc = COUNTRY_CODES.find(c => c.name === form.intlCountry);
    if (!cc) return;
    setForm(f => ({ ...f, countryCode: cc.dialCode, altCountryCode: cc.dialCode, emergencyCountryCode: cc.dialCode }));
  }, [form.intlCountry]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Field helpers ──────────────────────────────────────────────────────

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(f => ({ ...f, [key]: value }));
    setErrors(e => { const n = { ...e }; delete n[key as string]; return n; });
  }

  function clearError(...keys: string[]) {
    setErrors(e => { const n = { ...e }; keys.forEach(k => delete n[k]); return n; });
  }

  function handlePincodeBlur() {
    if (form.pincode.length === 6) {
      const found = PINCODE_LOOKUP[form.pincode];
      if (found) {
        setForm(f => ({ ...f, city: found.city, district: found.district, state: found.state }));
        clearError('city', 'state', 'pincode');
      }
    }
  }

  // ── Section tracking ───────────────────────────────────────────────────

  function handleSectionFocus(n: number) {
    const prev = activeSectionRef.current;
    if (prev !== 0 && prev !== n) validateSection(prev);
    activeSectionRef.current = n;
  }

  function applyPayorErrors(e: Errors) {
    if (form.payorType === 'insurance') {
      if (!form.insName.trim())             e.insName             = 'Required';
      if (!form.insPolicyNumber.trim())     e.insPolicyNumber     = 'Required';
      if (!form.insMemberId.trim())         e.insMemberId         = 'Required';
      if (!form.insPolicyHolderName.trim()) e.insPolicyHolderName = 'Required';
      if (!form.insRelationship)            e.insRelationship     = 'Required';
      if (!form.insPolicyStartDate)         e.insPolicyStartDate  = 'Required';
      if (!form.insPolicyEndDate)           e.insPolicyEndDate    = 'Required';
    } else if (form.payorType === 'government') {
      if (!form.govtSchemeName)           e.govtSchemeName    = 'Required';
      if (!form.govtBeneficiaryId.trim()) e.govtBeneficiaryId = 'Required';
      if (!form.govtCardNumber.trim())    e.govtCardNumber    = 'Required';
      if (!form.govtIssueDate)           e.govtIssueDate     = 'Required';
    } else if (form.payorType === 'corporate') {
      if (!form.corpName.trim())             e.corpName             = 'Required';
      if (!form.corpEmployeeName.trim())     e.corpEmployeeName     = 'Required';
      if (!form.corpEmployeeId.trim())       e.corpEmployeeId       = 'Required';
      if (!form.corpRelationship)            e.corpRelationship     = 'Required';
      if (!form.corpTpaName.trim())          e.corpTpaName          = 'Required';
      if (!form.corpInsuranceCompany.trim()) e.corpInsuranceCompany = 'Required';
      if (!form.corpPolicyNumber.trim())     e.corpPolicyNumber     = 'Required';
      if (!form.corpMemberId.trim())         e.corpMemberId         = 'Required';
      if (!form.corpPolicyStartDate)         e.corpPolicyStartDate  = 'Required';
      if (!form.corpPolicyEndDate)           e.corpPolicyEndDate    = 'Required';
    }
  }

  function validateSection(n: number) {
    const e: Errors = {};
    const clear: string[] = [];

    if (n === 1) {
      clear.push('firstName', 'lastName', 'gender', 'dob', 'identifierNumber');
      if (!form.firstName.trim()) e.firstName = 'Required';
      if (!form.lastName.trim())  e.lastName  = 'Required';
      if (!form.gender)           e.gender    = 'Select a gender';
      if (!form.dob)              e.dob       = 'Required';
      if (form.identifierType && !form.identifierNumber.trim()) e.identifierNumber = 'Enter identifier number';
    } else if (n === 2) {
      clear.push('addressLine1', 'pincode', 'city', 'state', 'intlCity', 'intlStateProvince', 'intlPostalCode', 'intlCountry');
      if (!form.addressLine1.trim()) e.addressLine1 = 'Required';
      if (isInternational) {
        if (!form.intlCity.trim())          e.intlCity          = 'Required';
        if (!form.intlStateProvince.trim()) e.intlStateProvince = 'Required';
        if (!form.intlPostalCode.trim())    e.intlPostalCode    = 'Required';
        if (!form.intlCountry)             e.intlCountry       = 'Required';
      } else {
        if (!form.pincode.trim()) e.pincode = 'Required';
        if (!form.city.trim())    e.city    = 'Required';
        if (!form.state.trim())   e.state   = 'Required';
      }
    } else if (n === 3) {
      clear.push('phone', 'email');
      if (!form.phone.trim()) e.phone = 'Required';
      else if (!validatePhone(form.phone, form.countryCode)) e.phone = 'Invalid number for selected country code';
      if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = 'Invalid email address';
    } else if (n === 4) {
      clear.push('emergencyName', 'emergencyRelation', 'emergencyPhone');
      if (!form.emergencyName.trim())  e.emergencyName     = 'Required';
      if (!form.emergencyRelation)     e.emergencyRelation = 'Required';
      if (!form.emergencyPhone.trim()) e.emergencyPhone    = 'Required';
    } else if (n === 5) {
      clear.push('insName', 'insPolicyNumber', 'insMemberId', 'insPolicyHolderName', 'insRelationship', 'insPolicyStartDate', 'insPolicyEndDate',
        'govtSchemeName', 'govtBeneficiaryId', 'govtCardNumber', 'govtIssueDate',
        'corpName', 'corpEmployeeName', 'corpEmployeeId', 'corpRelationship', 'corpTpaName', 'corpInsuranceCompany', 'corpPolicyNumber', 'corpMemberId', 'corpPolicyStartDate', 'corpPolicyEndDate');
      applyPayorErrors(e);
    } else if (n === 6) {
      clear.push('referralAtLeastOne');
      if (form.referralSource === 'referral' && !form.referringDoctor.trim() && !form.referringHospital.trim())
        e.referralAtLeastOne = 'At least one of Referring Doctor or Referring Hospital is required';
    } else if (n === 9) {
      clear.push('dataConsent');
      if (!form.dataConsent) e.dataConsent = 'Consent is required to register';
    }

    setErrors(prev => { const next = { ...prev }; clear.forEach(k => delete next[k]); return { ...next, ...e }; });
  }

  function validate(): boolean {
    const e: Errors = {};
    if (!form.firstName.trim()) e.firstName = 'Required';
    if (!form.lastName.trim())  e.lastName  = 'Required';
    if (!form.gender)           e.gender    = 'Select a gender';
    if (!form.dob)              e.dob       = 'Required';
    if (form.identifierType && !form.identifierNumber.trim()) e.identifierNumber = 'Enter identifier number';
    if (!form.addressLine1.trim()) e.addressLine1 = 'Required';
    if (isInternational) {
      if (!form.intlCity.trim())          e.intlCity          = 'Required';
      if (!form.intlStateProvince.trim()) e.intlStateProvince = 'Required';
      if (!form.intlPostalCode.trim())    e.intlPostalCode    = 'Required';
      if (!form.intlCountry)             e.intlCountry       = 'Required';
    } else {
      if (!form.pincode.trim()) e.pincode = 'Required';
      if (!form.city.trim())    e.city    = 'Required';
      if (!form.state.trim())   e.state   = 'Required';
    }
    if (!form.phone.trim()) e.phone = 'Required';
    else if (!validatePhone(form.phone, form.countryCode)) e.phone = 'Invalid number for selected country code';
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = 'Invalid email address';
    if (!form.emergencyName.trim())  e.emergencyName     = 'Required';
    if (!form.emergencyRelation)     e.emergencyRelation = 'Required';
    if (!form.emergencyPhone.trim()) e.emergencyPhone    = 'Required';
    applyPayorErrors(e);
    if (form.referralSource === 'referral' && !form.referringDoctor.trim() && !form.referringHospital.trim())
      e.referralAtLeastOne = 'At least one of Referring Doctor or Referring Hospital is required';
    if (!form.dataConsent) e.dataConsent = 'Consent is required to register';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  // ── Document upload ────────────────────────────────────────────────────

  function handleDocUpload(evt: React.ChangeEvent<HTMLInputElement>) {
    const file = evt.target.files?.[0];
    if (file && docType) {
      setUploadedDocs(prev => [...prev, { id: Date.now().toString(), type: docType, fileName: file.name, date: new Date().toLocaleDateString('en-IN') }]);
      setDocType('');
      evt.target.value = '';
    }
  }

  // ── Submit ─────────────────────────────────────────────────────────────

  function handleSubmit() {
    if (!validate()) return;
    const initials   = CENTER_INITIALS[selectedCenter] ?? 'XXX';
    const seq        = patients.filter(p => p.mrn.startsWith(`BO-${initials}-`)).length + 1;
    const now        = new Date();
    const dd         = String(now.getDate()).padStart(2, '0');
    const mm         = String(now.getMonth() + 1).padStart(2, '0');
    const yy         = String(now.getFullYear()).slice(2);
    const receiptNum = `REC-${initials}-${dd}${mm}${yy}-${String(seq).padStart(3, '0')}`;
    const fullName   = `${form.firstName.trim()} ${form.lastName.trim()}`;

    const newPatient: Patient = {
      id:             `p${Date.now()}`,
      mrn,
      name:           fullName,
      firstName:      form.firstName.trim(),
      lastName:       form.lastName.trim(),
      hospitalId:     form.hospitalId.trim() || undefined,
      center:         selectedCenter,
      dob:            form.dob!.toISOString().split('T')[0],
      gender:         form.gender as 'M' | 'F' | 'Other',
      registeredDate: form.registeredDate.toISOString().split('T')[0],
      phone:          form.phone,
      countryCode:    form.countryCode,
      phoneWhatsapp:  form.phoneWhatsapp,
      alternatePhone:           form.altPhone || undefined,
      alternateCountryCode:     form.altPhone ? form.altCountryCode : undefined,
      alternatePhoneWhatsapp:   form.altPhone ? form.altPhoneWhatsapp : undefined,
      email:          form.email.trim() || undefined,
      identifierType: form.identifierType || undefined,
      identifierNumber: form.identifierNumber.trim() || undefined,
      identifierDocFileName: identifierDoc?.name,
      address: {
        line1:         form.addressLine1.trim(),
        line2:         form.addressLine2.trim() || undefined,
        pincode:       isInternational ? undefined : form.pincode,
        city:          isInternational ? form.intlCity : form.city,
        district:      isInternational ? undefined : form.district || undefined,
        state:         isInternational ? form.intlStateProvince : form.state,
        country:       isInternational ? form.intlCountry : 'India',
        isInternational,
        stateProvince: isInternational ? form.intlStateProvince : undefined,
        postalCode:    isInternational ? form.intlPostalCode : undefined,
      },
      emergencyContact: {
        name:        form.emergencyName.trim(),
        relation:    form.emergencyRelation,
        countryCode: form.emergencyCountryCode,
        phone:       form.emergencyPhone,
      },
      payor: form.payorType ? {
        type: form.payorType,
        insurance: form.payorType === 'insurance' ? {
          name:             form.insName.trim(),
          policyNumber:     form.insPolicyNumber.trim(),
          memberId:         form.insMemberId.trim(),
          policyHolderName: form.insPolicyHolderName.trim(),
          relationship:     form.insRelationship,
          policyStartDate:  form.insPolicyStartDate!.toISOString().split('T')[0],
          policyEndDate:    form.insPolicyEndDate!.toISOString().split('T')[0],
        } : undefined,
        government: form.payorType === 'government' ? {
          schemeName:    form.govtSchemeName,
          beneficiaryId: form.govtBeneficiaryId.trim(),
          cardNumber:    form.govtCardNumber.trim(),
          issueDate:     form.govtIssueDate!.toISOString().split('T')[0],
        } : undefined,
        corporate: form.payorType === 'corporate' ? {
          corporateName:    form.corpName.trim(),
          employeeName:     form.corpEmployeeName.trim(),
          employeeId:       form.corpEmployeeId.trim(),
          relationship:     form.corpRelationship,
          tpaName:          form.corpTpaName.trim(),
          insuranceCompany: form.corpInsuranceCompany.trim(),
          policyNumber:     form.corpPolicyNumber.trim(),
          memberId:         form.corpMemberId.trim(),
          policyStartDate:  form.corpPolicyStartDate!.toISOString().split('T')[0],
          policyEndDate:    form.corpPolicyEndDate!.toISOString().split('T')[0],
        } : undefined,
      } : undefined,
      referral: form.referralSource ? {
        source:            form.referralSource,
        referringDoctor:   form.referringDoctor.trim() || undefined,
        referringHospital: form.referringHospital.trim() || undefined,
      } : undefined,
      chiefComplaints: form.chiefComplaints.trim() || undefined,
      uploadedDocuments: uploadedDocs.length ? uploadedDocs.map(d => ({ type: d.type, fileName: d.fileName, uploadedAt: d.date })) : undefined,
    };

    onRegister(newPatient);
    setSuccessInfo({ name: newPatient.name, mrn: newPatient.mrn });
    setReceiptData({ patient: newPatient, receiptNumber: receiptNum });
  }

  // ── Receipt viewer (matches ViewInvoiceOverlay style) ─────────────────

  if (receiptData) {
    const closeReceipt = () => { setReceiptData(null); setShowSuccess(true); };
    return (
      <Modal onClose={closeReceipt} className={styles.style11} overlayClassName="z-[60]">
        {/* Header */}
        <div className={styles.style12}>
          <div>
            <p className={styles.style13}>{receiptData.receiptNumber}</p>
            <p className={styles.style14}>{receiptData.patient.name} · {selectedCenter}</p>
          </div>
          <div className={styles.style15}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => printRegistrationReceipt(receiptData.patient, selectedCenter, receiptData.receiptNumber)}
              className={styles.style16}
            >
              <Printer size={15} />
              Print
            </Button>
            <Button
              size="sm"
              onClick={() => printRegistrationReceipt(receiptData.patient, selectedCenter, receiptData.receiptNumber)}
              className={styles.style17}
            >
              <Download size={15} />
              Save as PDF
            </Button>
            <IconButton icon={<X size={18} />} label="Close" onClick={closeReceipt} className={styles.style18} />
          </div>
        </div>
        {/* Receipt preview */}
        <iframe
          srcDoc={generateRegistrationReceiptHTML(receiptData.patient, selectedCenter, receiptData.receiptNumber)}
          className={styles.style19}
          title={`Receipt ${receiptData.receiptNumber}`}
          style={{ border: 'none' }}
        />
      </Modal>
    );
  }

  // ── Success banner ─────────────────────────────────────────────────────

  if (showSuccess && successInfo) {
    return (
      <Modal onClose={onClose} size="md" overlayClassName="z-[60]">
        <div className={styles.style20}>
          <div className={styles.style21}>
            <CheckCircle2 size={32} className={styles.style22} />
          </div>
          <h2 className={styles.style23}>Patient Registered Successfully</h2>
          <p className={styles.style24}>{successInfo.name}</p>
          <p className={styles.style25}>{successInfo.mrn}</p>
          <p className={styles.style26}>{selectedCenter}</p>
          <Button onClick={onClose} size="sm" className={styles.style27}>
            Done
          </Button>
        </div>
      </Modal>
    );
  }

  // ── Form ───────────────────────────────────────────────────────────────

  const selectedIdentifier = IDENTIFIER_TYPES.find(t => t.value === form.identifierType);
  fmtDate(todayDate); // keep import alive

  return (
    <Modal onClose={onClose} className={styles.style28} overlayClassName="z-[60]">

      <ModalHeader title="New Patient Registration" icon={<UserPlus size={16} />} onClose={onClose} />

      {/* Scrollable body */}
      <ModalBody className={styles.style29}>

          {/* §1 Demographics */}
          <section onFocus={() => handleSectionFocus(1)}>
            <SectionHeading>Demographics</SectionHeading>
            <div className={styles.style30}>

              <div className={styles.style31}>
                <FormField label="MRN / UHID" hint="(Auto-generated)">
                  <TextField value={mrn} disabled className={styles.style32} />
                </FormField>
                <FormField label="Hospital ID">
                  <TextField type="text" value={form.hospitalId} onChange={e => setField('hospitalId', e.target.value)} placeholder="Optional" />
                </FormField>
              </div>

              <div className={styles.style31}>
                <FormField label="First Name" required error={errors.firstName}>
                  <TextField type="text" value={form.firstName} onChange={e => setField('firstName', e.target.value)} placeholder="Enter first name" error={!!errors.firstName} />
                </FormField>
                <FormField label="Last Name" required error={errors.lastName}>
                  <TextField type="text" value={form.lastName} onChange={e => setField('lastName', e.target.value)} placeholder="Enter last name" error={!!errors.lastName} />
                </FormField>
              </div>

              <div>
                <label className={styles.style33}>Gender <span className={styles.style4}>*</span></label>
                <div className={styles.style34}>
                  {(['M', 'F', 'Other'] as const).map(g => (
                    <label key={g} className={styles.style35}>
                      <input type="radio" name="gender" value={g} checked={form.gender === g} onChange={() => setField('gender', g)} className={styles.style36} />
                      <span className={styles.style37}>{g === 'M' ? 'Male' : g === 'F' ? 'Female' : 'Other'}</span>
                    </label>
                  ))}
                </div>
                {errors.gender && <p className={styles.style10}>{errors.gender}</p>}
              </div>

              <div className={styles.style31}>
                <FormField label="Date of Birth" required error={errors.dob}>
                  <DatePicker value={form.dob} onChange={d => setField('dob', d)} placeholder="Select date of birth" maxDate={todayDate} />
                </FormField>
                <FormField label="Age">
                  <TextField value={age} disabled placeholder="Auto-calculated" className={styles.style38} />
                </FormField>
              </div>

              <FormField className={styles.style39} label="Registration Date" hint="(up to 7 days back)">
                <DatePicker value={form.registeredDate} onChange={d => { if (d) setField('registeredDate', d); }} maxDate={todayDate} minDate={minRegDate} />
              </FormField>

              <FormField label="Identifier Type">
                <Select
                  value={form.identifierType}
                  onChange={e => { const v = e.target.value; setForm(f => ({ ...f, identifierType: v, identifierNumber: '' })); setIdentifierDoc(null); clearError('identifierNumber'); }}
                >
                  <option value="">Select identifier (optional)</option>
                  {IDENTIFIER_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </Select>

                {form.identifierType && (
                  <div className={styles.style40}>
                    <div className={styles.style41}>
                      <div>
                        <label className={styles.style42}>
                          {selectedIdentifier?.label} Number <span className={styles.style4}>*</span>
                        </label>
                        <TextField type="text" value={form.identifierNumber} onChange={e => setField('identifierNumber', e.target.value)} placeholder="Enter number" error={!!errors.identifierNumber} />
                        {errors.identifierNumber && <p className={styles.style10}>{errors.identifierNumber}</p>}
                      </div>
                      <div>
                        <label className={styles.style42}>Upload Document</label>
                        <input type="file" ref={fileInputRef} accept=".pdf,.jpg,.jpeg,.png" className={styles.style43} onChange={e => { const f = e.target.files?.[0]; if (f) setIdentifierDoc({ name: f.name }); e.target.value = ''; }} />
                        {identifierDoc ? (
                          <div className={styles.style44}>
                            <FileText size={13} className={styles.style45} />
                            <span className={styles.style46}>{identifierDoc.name}</span>
                            <button type="button" onClick={() => setIdentifierDoc(null)} className={styles.style47}><X size={13} /></button>
                          </div>
                        ) : (
                          <button type="button" onClick={() => fileInputRef.current?.click()} className={styles.style48}>
                            <Upload size={13} />
                            Choose file (PDF, JPG, PNG)
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </FormField>
            </div>
          </section>

          {/* §2 Address Details */}
          <section onFocus={() => handleSectionFocus(2)}>
            <SectionHeading>
              Address Details
              {isInternational && <span className={styles.style49}>· International</span>}
            </SectionHeading>
            <div className={styles.style30}>
              <FormField label="Address Line 1" required error={errors.addressLine1}>
                <TextField type="text" value={form.addressLine1} onChange={e => setField('addressLine1', e.target.value)} placeholder="House / flat no., street, area" error={!!errors.addressLine1} />
              </FormField>
              <FormField label="Address Line 2">
                <TextField type="text" value={form.addressLine2} onChange={e => setField('addressLine2', e.target.value)} placeholder="Apartment, suite, landmark (optional)" />
              </FormField>

              {isInternational ? (
                <div className={styles.style31}>
                  <FormField label="City" required error={errors.intlCity}>
                    <TextField type="text" value={form.intlCity} onChange={e => setField('intlCity', e.target.value)} placeholder="Enter city" error={!!errors.intlCity} />
                  </FormField>
                  <FormField label="State / Province" required error={errors.intlStateProvince}>
                    <TextField type="text" value={form.intlStateProvince} onChange={e => setField('intlStateProvince', e.target.value)} placeholder="Enter state or province" error={!!errors.intlStateProvince} />
                  </FormField>
                  <FormField label="Postal Code" required error={errors.intlPostalCode}>
                    <TextField type="text" value={form.intlPostalCode} onChange={e => setField('intlPostalCode', e.target.value)} placeholder="Enter postal code" error={!!errors.intlPostalCode} />
                  </FormField>
                  <FormField label="Country" required error={errors.intlCountry}>
                    <Select value={form.intlCountry} onChange={e => setField('intlCountry', e.target.value)} error={!!errors.intlCountry}>
                      <option value="">Select country</option>
                      {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </Select>
                  </FormField>
                </div>
              ) : (
                <>
                  <FormField label="Pincode" required hint="City / State auto-fills on valid pincode" error={errors.pincode}>
                    <TextField
                      type="text"
                      value={form.pincode}
                      onChange={e => { const v = e.target.value.replace(/\D/g, '').slice(0, 6); setForm(f => ({ ...f, pincode: v, city: '', district: '', state: '' })); clearError('pincode', 'city', 'state'); }}
                      onBlur={handlePincodeBlur}
                      placeholder="6-digit pincode"
                      maxLength={6}
                      error={!!errors.pincode}
                      className={styles.style50}
                    />
                  </FormField>
                  <div className={styles.style31}>
                    <FormField label="City" required error={errors.city}>
                      <TextField type="text" value={form.city} onChange={e => setField('city', e.target.value)} placeholder="City" error={!!errors.city} className={form.city ? 'bg-primary/5' : ''} />
                    </FormField>
                    <FormField label="District">
                      <TextField type="text" value={form.district} onChange={e => setField('district', e.target.value)} placeholder="District" className={form.district ? 'bg-primary/5' : ''} />
                    </FormField>
                    <FormField label="State" required error={errors.state}>
                      <TextField type="text" value={form.state} onChange={e => setField('state', e.target.value)} placeholder="State" error={!!errors.state} className={form.state ? 'bg-primary/5' : ''} />
                    </FormField>
                    <FormField label="Country">
                      <TextField value="India" disabled className={styles.style38} />
                    </FormField>
                  </div>
                </>
              )}
            </div>
          </section>

          {/* §3 Contact Details */}
          <section onFocus={() => handleSectionFocus(3)}>
            <SectionHeading>Contact Details</SectionHeading>
            <div className={styles.style30}>
              <PhoneField label="Contact Number" required dialCode={form.countryCode} onDialChange={v => setField('countryCode', v)} phone={form.phone} onPhoneChange={v => setField('phone', v)} whatsapp={form.phoneWhatsapp} onWhatsapp={v => setField('phoneWhatsapp', v)} error={errors.phone} />
              <PhoneField label="Alternate Number" dialCode={form.altCountryCode} onDialChange={v => setField('altCountryCode', v)} phone={form.altPhone} onPhoneChange={v => setField('altPhone', v)} whatsapp={form.altPhoneWhatsapp} onWhatsapp={v => setField('altPhoneWhatsapp', v)} placeholder="Optional" />
              <FormField label="Email" optional error={errors.email}>
                <TextField type="email" value={form.email} onChange={e => setField('email', e.target.value)} placeholder="Enter email address" error={!!errors.email} />
              </FormField>
            </div>
          </section>

          {/* §4 Emergency Contact */}
          <section onFocus={() => handleSectionFocus(4)}>
            <SectionHeading>Emergency Contact</SectionHeading>
            <div className={styles.style30}>
              <div className={styles.style31}>
                <FormField label="Name" required error={errors.emergencyName}>
                  <TextField type="text" value={form.emergencyName} onChange={e => setField('emergencyName', e.target.value)} placeholder="Contact person's name" error={!!errors.emergencyName} />
                </FormField>
                <FormField label="Relation" required error={errors.emergencyRelation}>
                  <Select value={form.emergencyRelation} onChange={e => setField('emergencyRelation', e.target.value)} error={!!errors.emergencyRelation}>
                    <option value="">Select relation</option>
                    {RELATIONS.map(r => <option key={r} value={r}>{r}</option>)}
                  </Select>
                </FormField>
              </div>
              <PhoneField label="Contact Number" required dialCode={form.emergencyCountryCode} onDialChange={v => setField('emergencyCountryCode', v)} phone={form.emergencyPhone} onPhoneChange={v => setField('emergencyPhone', v)} error={errors.emergencyPhone} />
            </div>
          </section>

          {/* §5 Payor Details */}
          <section onFocus={() => handleSectionFocus(5)}>
            <SectionHeading>Payor Details</SectionHeading>
            <div className={styles.style30}>
              <FormField label="Payor Type">
                <Select value={form.payorType} onChange={e => setForm(f => ({ ...f, payorType: e.target.value as FormState['payorType'] }))}>
                  <option value="">Select payor type</option>
                  <option value="self">Self Pay</option>
                  <option value="insurance">Insurance</option>
                  <option value="government">Government</option>
                  <option value="corporate">Corporate</option>
                </Select>
              </FormField>

              {/* Government */}
              {form.payorType === 'government' && (
                <div className={styles.style51}>
                  <div className={styles.style31}>
                    <FormField label="Scheme Name" required error={errors.govtSchemeName}>
                      <Select value={form.govtSchemeName} onChange={e => setField('govtSchemeName', e.target.value)} error={!!errors.govtSchemeName}>
                        <option value="">Select scheme</option>
                        {GOVT_SCHEMES.map(s => <option key={s} value={s}>{s}</option>)}
                      </Select>
                    </FormField>
                    <FormField label="Beneficiary ID" required error={errors.govtBeneficiaryId}>
                      <TextField type="text" value={form.govtBeneficiaryId} onChange={e => setField('govtBeneficiaryId', e.target.value)} placeholder="Enter beneficiary ID" error={!!errors.govtBeneficiaryId} />
                    </FormField>
                    <FormField label="Card Number" required error={errors.govtCardNumber}>
                      <TextField type="text" value={form.govtCardNumber} onChange={e => setField('govtCardNumber', e.target.value)} placeholder="Enter card number" error={!!errors.govtCardNumber} />
                    </FormField>
                    <FormField label="Issue Date" required error={errors.govtIssueDate}>
                      <DatePicker value={form.govtIssueDate} onChange={d => setField('govtIssueDate', d)} placeholder="Select issue date" maxDate={todayDate} />
                    </FormField>
                  </div>
                </div>
              )}

              {/* Insurance */}
              {form.payorType === 'insurance' && (
                <div className={styles.style51}>
                  <div className={styles.style31}>
                    <FormField className={styles.style52} label="Insurance / TPA Name" required error={errors.insName}>
                      <TextField type="text" value={form.insName} onChange={e => setField('insName', e.target.value)} placeholder="Enter insurance or TPA name" error={!!errors.insName} />
                    </FormField>
                    <FormField label="Policy Number" required error={errors.insPolicyNumber}>
                      <TextField type="text" value={form.insPolicyNumber} onChange={e => setField('insPolicyNumber', e.target.value)} placeholder="Enter policy number" error={!!errors.insPolicyNumber} />
                    </FormField>
                    <FormField label="Member ID" required error={errors.insMemberId}>
                      <TextField type="text" value={form.insMemberId} onChange={e => setField('insMemberId', e.target.value)} placeholder="Enter member ID" error={!!errors.insMemberId} />
                    </FormField>
                    <FormField label="Policy Holder Name" required error={errors.insPolicyHolderName}>
                      <TextField type="text" value={form.insPolicyHolderName} onChange={e => setField('insPolicyHolderName', e.target.value)} placeholder="Enter policy holder name" error={!!errors.insPolicyHolderName} />
                    </FormField>
                    <FormField label="Relationship" required error={errors.insRelationship}>
                      <Select value={form.insRelationship} onChange={e => setField('insRelationship', e.target.value)} error={!!errors.insRelationship}>
                        <option value="">Select relationship</option>
                        {POLICY_RELATIONS.map(r => <option key={r} value={r}>{r}</option>)}
                      </Select>
                    </FormField>
                    <FormField label="Policy Start Date" required error={errors.insPolicyStartDate}>
                      <DatePicker value={form.insPolicyStartDate} onChange={d => { setField('insPolicyStartDate', d); if (form.insPolicyEndDate && d && form.insPolicyEndDate < d) setField('insPolicyEndDate', undefined); }} placeholder="Select start date" />
                    </FormField>
                    <FormField label="Policy End Date" required error={errors.insPolicyEndDate}>
                      <DatePicker value={form.insPolicyEndDate} onChange={d => setField('insPolicyEndDate', d)} placeholder="Select end date" minDate={form.insPolicyStartDate} />
                    </FormField>
                  </div>
                </div>
              )}

              {/* Corporate */}
              {form.payorType === 'corporate' && (
                <div className={styles.style53}>
                  <FormField label="Corporate Name" required error={errors.corpName}>
                    <TextField type="text" value={form.corpName} onChange={e => setField('corpName', e.target.value)} placeholder="Enter corporate / company name" error={!!errors.corpName} />
                  </FormField>
                  <div>
                    <p className={styles.style54}>Employee Details</p>
                    <div className={styles.style31}>
                      <FormField label="Employee Name" required error={errors.corpEmployeeName}>
                        <TextField type="text" value={form.corpEmployeeName} onChange={e => setField('corpEmployeeName', e.target.value)} placeholder="Enter employee name" error={!!errors.corpEmployeeName} />
                      </FormField>
                      <FormField label="Employee ID" required error={errors.corpEmployeeId}>
                        <TextField type="text" value={form.corpEmployeeId} onChange={e => setField('corpEmployeeId', e.target.value)} placeholder="Enter employee ID" error={!!errors.corpEmployeeId} />
                      </FormField>
                      <FormField label="Relationship" required error={errors.corpRelationship}>
                        <Select value={form.corpRelationship} onChange={e => setField('corpRelationship', e.target.value)} error={!!errors.corpRelationship}>
                          <option value="">Select relationship</option>
                          {POLICY_RELATIONS.map(r => <option key={r} value={r}>{r}</option>)}
                        </Select>
                      </FormField>
                    </div>
                  </div>
                  <div>
                    <p className={styles.style54}>Insurance / TPA Details</p>
                    <div className={styles.style31}>
                      <FormField label="TPA Name" required error={errors.corpTpaName}>
                        <TextField type="text" value={form.corpTpaName} onChange={e => setField('corpTpaName', e.target.value)} placeholder="Enter TPA name" error={!!errors.corpTpaName} />
                      </FormField>
                      <FormField label="Insurance Company" required error={errors.corpInsuranceCompany}>
                        <TextField type="text" value={form.corpInsuranceCompany} onChange={e => setField('corpInsuranceCompany', e.target.value)} placeholder="Enter insurance company" error={!!errors.corpInsuranceCompany} />
                      </FormField>
                    </div>
                  </div>
                  <div>
                    <p className={styles.style54}>Policy Details</p>
                    <div className={styles.style31}>
                      <FormField label="Policy Number" required error={errors.corpPolicyNumber}>
                        <TextField type="text" value={form.corpPolicyNumber} onChange={e => setField('corpPolicyNumber', e.target.value)} placeholder="Enter policy number" error={!!errors.corpPolicyNumber} />
                      </FormField>
                      <FormField label="Member ID" required error={errors.corpMemberId}>
                        <TextField type="text" value={form.corpMemberId} onChange={e => setField('corpMemberId', e.target.value)} placeholder="Enter member ID" error={!!errors.corpMemberId} />
                      </FormField>
                      <FormField label="Policy Start Date" required error={errors.corpPolicyStartDate}>
                        <DatePicker value={form.corpPolicyStartDate} onChange={d => { setField('corpPolicyStartDate', d); if (form.corpPolicyEndDate && d && form.corpPolicyEndDate < d) setField('corpPolicyEndDate', undefined); }} placeholder="Select start date" />
                      </FormField>
                      <FormField label="Policy End Date" required error={errors.corpPolicyEndDate}>
                        <DatePicker value={form.corpPolicyEndDate} onChange={d => setField('corpPolicyEndDate', d)} placeholder="Select end date" minDate={form.corpPolicyStartDate} />
                      </FormField>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* §6 Referral Details */}
          <section onFocus={() => handleSectionFocus(6)}>
            <SectionHeading>Referral Details</SectionHeading>
            <div className={styles.style30}>
              <FormField label="Referral Source">
                <Select
                  value={form.referralSource}
                  onChange={e => { setForm(f => ({ ...f, referralSource: e.target.value as FormState['referralSource'], referringDoctor: '', referringHospital: '' })); clearError('referralAtLeastOne'); }}
                >
                  <option value="">Select referral source</option>
                  <option value="opd-walk-in">OPD Walk-In</option>
                  <option value="referral">Referral</option>
                </Select>
              </FormField>

              {form.referralSource === 'referral' && (
                <div className={styles.style55}>
                  <p className={styles.style9}>At least one of the following fields is required.</p>
                  <div className={styles.style31}>
                    <FormField label="Referring Doctor">
                      <TextField type="text" value={form.referringDoctor} onChange={e => { setField('referringDoctor', e.target.value); clearError('referralAtLeastOne'); }} placeholder="Enter referring doctor's name" error={!!errors.referralAtLeastOne} />
                    </FormField>
                    <FormField label="Referring Hospital">
                      <TextField type="text" value={form.referringHospital} onChange={e => { setField('referringHospital', e.target.value); clearError('referralAtLeastOne'); }} placeholder="Enter referring hospital's name" error={!!errors.referralAtLeastOne} />
                    </FormField>
                  </div>
                  {errors.referralAtLeastOne && <p className={styles.style56}>{errors.referralAtLeastOne}</p>}
                </div>
              )}
            </div>
          </section>

          {/* §7 Chief Complaints / Diagnosis */}
          <section onFocus={() => handleSectionFocus(7)}>
            <SectionHeading>Chief Complaints / Diagnosis</SectionHeading>
            <FormField label="Chief Complaints / Diagnosis" optional>
              <Textarea
                value={form.chiefComplaints}
                onChange={e => setField('chiefComplaints', e.target.value)}
                placeholder="Enter primary complaints and diagnosis details…"
                rows={4}
              />
            </FormField>
          </section>

          {/* §8 Upload Documents */}
          <section onFocus={() => handleSectionFocus(8)}>
            <SectionHeading>Upload Documents</SectionHeading>
            <div className={styles.style30}>
              <div className={styles.style57}>
                <FormField className={styles.style58} label="Document Type">
                  <Select value={docType} onChange={e => setDocType(e.target.value)}>
                    <option value="">Select document type</option>
                    {MEDICAL_RECORD_CATEGORIES.map(c => <option key={c.category} value={c.category}>{c.category}</option>)}
                  </Select>
                </FormField>
                <div className={styles.style59}>
                  <input type="file" ref={docFileRef} accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" className={styles.style43} onChange={handleDocUpload} />
                  <button
                    type="button"
                    disabled={!docType}
                    onClick={() => docFileRef.current?.click()}
                    className={styles.style60}
                  >
                    <Upload size={14} />
                    Upload File
                  </button>
                </div>
              </div>

              {uploadedDocs.length > 0 && (
                <div className={styles.style61}>
                  <table className={styles.style62}>
                    <thead>
                      <tr className={styles.style63}>
                        <th className={styles.style64}>Type</th>
                        <th className={styles.style64}>File Name</th>
                        <th className={styles.style64}>Date</th>
                        <th className={styles.style65} />
                      </tr>
                    </thead>
                    <tbody>
                      {uploadedDocs.map(doc => (
                        <tr key={doc.id} className={styles.style66}>
                          <td className={styles.style67}>
                            <div className={styles.style15}>
                              <FileText size={13} className={styles.style45} />
                              <span className={styles.style37}>{doc.type}</span>
                            </div>
                          </td>
                          <td className={styles.style68}>{doc.fileName}</td>
                          <td className={styles.style69}>{doc.date}</td>
                          <td className={styles.style70}>
                            <button type="button" onClick={() => setUploadedDocs(prev => prev.filter(d => d.id !== doc.id))} className={styles.style47}>
                              <X size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>

          {/* §9 Data Consent */}
          <section onFocus={() => handleSectionFocus(9)}>
            <SectionHeading>Data Consent</SectionHeading>
            <div className={`border rounded-xl p-4 transition-colors ${errors.dataConsent ? 'border-destructive bg-destructive/5' : 'border-border bg-muted/30'}`}>
              <label className={styles.style71}>
                <input
                  type="checkbox"
                  checked={form.dataConsent}
                  onChange={e => setField('dataConsent', e.target.checked)}
                  className={styles.style72}
                />
                <span className={styles.style73}>
                  I hereby consent to the storage and use of my personal and medical data for treatment purposes,
                  research, and quality improvement initiatives. I understand that my data will be kept confidential
                  and used in accordance with applicable data protection regulations.{' '}
                  <span className={styles.style4}>*</span>
                </span>
              </label>
              {errors.dataConsent && <p className={styles.style74}>{errors.dataConsent}</p>}
            </div>
          </section>

      </ModalBody>

      {/* Sticky footer */}
      <ModalFooter>
        <Button variant="ghost" size="sm" className={styles.style75} onClick={onClose}>
          Cancel
        </Button>
        <Button size="sm" onClick={handleSubmit} className={styles.style76}>
          <UserPlus size={15} />
          Register Patient
        </Button>
      </ModalFooter>

    </Modal>
  );
}

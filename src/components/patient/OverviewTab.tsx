import {
  User, Heart, CreditCard, Phone, MapPin, Users, Share2,
} from 'lucide-react';
import type { Patient } from '../../datapoints/patients';
import { PAYOR_TYPE_LABELS } from '../../datapoints/patients';
import type { TreatmentPlan } from '../../datapoints/treatment';
import { TREATMENT_STATUS_LABELS } from '../../datapoints/treatment';
import { calcAge } from '../../lib/formatters';

interface Props {
  patient:           Patient;
  onPatientsChange:  React.Dispatch<React.SetStateAction<Patient[]>>;
  treatmentPlans?:   TreatmentPlan[];
}

function InfoCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border">
        <span className="text-primary">{icon}</span>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{title}</h3>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">{label}</p>
      <p className="text-sm text-foreground">{value || '—'}</p>
    </div>
  );
}

const MODALITY_LABELS: Record<string, string> = {
  chemotherapy: 'Chemotherapy',
  radiotherapy:  'Radiotherapy',
  surgery:       'Surgery',
};

export function OverviewTab({ patient, treatmentPlans }: Props) {
  const activePlan = treatmentPlans?.find(p => p.status === 'active')
    ?? treatmentPlans?.sort((a, b) => b.startDate.localeCompare(a.startDate))[0];
  const dob = patient.dob
    ? new Date(patient.dob).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
    : '—';

  const regDate = patient.registeredDate
    ? new Date(patient.registeredDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
    : '—';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

      {/* Demographics */}
      <InfoCard icon={<User size={14} />} title="Demographics">
        <div className="grid grid-cols-2 gap-3">
          <Field label="First Name"       value={patient.firstName ?? patient.name.split(' ')[0]} />
          <Field label="Last Name"        value={patient.lastName  ?? patient.name.split(' ').slice(1).join(' ')} />
          <Field label="Date of Birth"    value={dob} />
          <Field label="Age"              value={patient.dob ? calcAge(patient.dob) : '—'} />
          <Field label="Gender"           value={patient.gender === 'M' ? 'Male' : patient.gender === 'F' ? 'Female' : 'Other'} />
          <Field label="Center"           value={patient.center} />
          <Field label="MRN / UHID"       value={patient.mrn} />
          <Field label="Hospital ID"      value={patient.hospitalId} />
          <Field label="Registration Date" value={regDate} />
          {patient.identifierType && (
            <Field label={patient.identifierType.toUpperCase()} value={patient.identifierNumber} />
          )}
        </div>
      </InfoCard>

      {/* Medical Information */}
      <InfoCard icon={<Heart size={14} />} title="Medical Information">
        {patient.diagnosis ? (
          <div className="grid grid-cols-2 gap-3">
            <Field label="Cancer Type"    value={patient.diagnosis.cancerType} />
            <Field label="Stage"          value={patient.diagnosis.stage} />
            <Field label="ICD Code"       value={patient.diagnosis.icdCode} />
            <Field label="Diagnosed Date" value={patient.diagnosis.diagnosedDate
              ? new Date(patient.diagnosis.diagnosedDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
              : undefined} />
            {activePlan && (
              <>
                <Field label="Treatment Type"       value={MODALITY_LABELS[activePlan.modality] ?? activePlan.modality} />
                <Field label="Treatment Status"     value={TREATMENT_STATUS_LABELS[activePlan.status]} />
                <Field label="Treatment Start Date" value={new Date(activePlan.startDate + 'T00:00:00').toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })} />
                {activePlan.regimen && <Field label="Regimen / Protocol" value={`${activePlan.regimen} · ${activePlan.protocol}`} />}
              </>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">Not yet diagnosed</p>
        )}
        {patient.chiefComplaints && (
          <div className="mt-3">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Chief Complaints</p>
            <p className="text-sm text-foreground leading-relaxed">{patient.chiefComplaints}</p>
          </div>
        )}
      </InfoCard>

      {/* Payor Details */}
      <InfoCard icon={<CreditCard size={14} />} title="Payor Details">
        {patient.payor ? (
          <div className="space-y-3">
            <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
              {PAYOR_TYPE_LABELS[patient.payor.type]}
            </div>
            {patient.payor.type === 'insurance' && patient.payor.insurance && (
              <div className="grid grid-cols-2 gap-3">
                <Field label="Insurer / TPA"     value={patient.payor.insurance.name} />
                <Field label="Policy Number"     value={patient.payor.insurance.policyNumber} />
                <Field label="Member ID"         value={patient.payor.insurance.memberId} />
                <Field label="Policy Holder"     value={patient.payor.insurance.policyHolderName} />
                <Field label="Relationship"      value={patient.payor.insurance.relationship} />
                <Field label="Policy Start"      value={patient.payor.insurance.policyStartDate} />
                <Field label="Policy End"        value={patient.payor.insurance.policyEndDate} />
              </div>
            )}
            {patient.payor.type === 'government' && patient.payor.government && (
              <div className="grid grid-cols-2 gap-3">
                <Field label="Scheme"            value={patient.payor.government.schemeName} />
                <Field label="Beneficiary ID"    value={patient.payor.government.beneficiaryId} />
                <Field label="Card Number"       value={patient.payor.government.cardNumber} />
                <Field label="Issue Date"        value={patient.payor.government.issueDate} />
              </div>
            )}
            {patient.payor.type === 'corporate' && patient.payor.corporate && (
              <div className="grid grid-cols-2 gap-3">
                <Field label="Corporate"         value={patient.payor.corporate.corporateName} />
                <Field label="Employee"          value={patient.payor.corporate.employeeName} />
                <Field label="Employee ID"       value={patient.payor.corporate.employeeId} />
                <Field label="Relationship"      value={patient.payor.corporate.relationship} />
                <Field label="TPA"               value={patient.payor.corporate.tpaName} />
                <Field label="Insurance Company" value={patient.payor.corporate.insuranceCompany} />
                <Field label="Policy Number"     value={patient.payor.corporate.policyNumber} />
                <Field label="Member ID"         value={patient.payor.corporate.memberId} />
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">—</p>
        )}
      </InfoCard>

      {/* Contact Details */}
      <InfoCard icon={<Phone size={14} />} title="Contact Details">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Primary Phone</p>
            <p className="text-sm text-foreground">
              {patient.countryCode ?? '+91'} {patient.phone}
              {patient.phoneWhatsapp && <span className="ml-1.5 text-[10px] text-green-600 font-medium">WA</span>}
            </p>
          </div>
          {patient.alternatePhone && (
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Alternate Phone</p>
              <p className="text-sm text-foreground">
                {patient.alternateCountryCode ?? '+91'} {patient.alternatePhone}
                {patient.alternatePhoneWhatsapp && <span className="ml-1.5 text-[10px] text-green-600 font-medium">WA</span>}
              </p>
            </div>
          )}
          <Field label="Email" value={patient.email} />
        </div>
      </InfoCard>

      {/* Address Details */}
      <InfoCard icon={<MapPin size={14} />} title="Address Details">
        {patient.address ? (
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Address</p>
              <p className="text-sm text-foreground">
                {patient.address.line1}
                {patient.address.line2 ? `, ${patient.address.line2}` : ''}
              </p>
            </div>
            <Field label="City"     value={patient.address.city} />
            <Field label="District" value={patient.address.district} />
            <Field label="State"    value={patient.address.state} />
            <Field label={patient.address.isInternational ? 'Postal Code' : 'Pincode'}
                   value={patient.address.isInternational ? patient.address.postalCode : patient.address.pincode} />
            <Field label="Country"  value={patient.address.country} />
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">—</p>
        )}
      </InfoCard>

      {/* Emergency Contact */}
      <InfoCard icon={<Users size={14} />} title="Emergency Contact">
        {patient.emergencyContact ? (
          <div className="grid grid-cols-2 gap-3">
            <Field label="Name"     value={patient.emergencyContact.name} />
            <Field label="Relation" value={patient.emergencyContact.relation} />
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Phone</p>
              <p className="text-sm text-foreground">
                {patient.emergencyContact.countryCode} {patient.emergencyContact.phone}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">—</p>
        )}
      </InfoCard>

      {/* Referral Details */}
      <InfoCard icon={<Share2 size={14} />} title="Referral Details">
        {patient.referral ? (
          <div className="grid grid-cols-2 gap-3">
            <Field label="Source" value={patient.referral.source === 'opd-walk-in' ? 'OPD Walk-In' : 'Referral'} />
            <Field label="Referring Doctor"   value={patient.referral.referringDoctor} />
            <Field label="Referring Hospital" value={patient.referral.referringHospital} />
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">—</p>
        )}
      </InfoCard>

    </div>
  );
}

import * as styles from './PatientHeaderCard.styles';
import { User, AlertTriangle, ShieldCheck } from 'bfd-icons';
import type { Patient } from 'bfd-core';
import type { Vitals } from 'bfd-core';
import type { CancerStaging } from 'bfd-core';

interface Props {
  patient:        Patient;
  latestVitals?:  Vitals;
  latestStaging?: CancerStaging;
}

const PAYOR_LABELS: Record<string, string> = {
  self:       'Self Pay',
  insurance:  'Insurance',
  government: 'Government',
  corporate:  'Corporate',
};

const ALLERGY_COLORS: Record<string, string> = {
  drug:          'bg-error-soft text-error-emphasis border-error-border',
  food:          'bg-warning-surface-soft text-warning-emphasis border-warning-surface-border',
  environmental: 'bg-success-soft text-success-emphasis border-success-border',
  latex:         'bg-orange-surface-soft text-orange-emphasis border-orange-surface-border',
  other:         'bg-muted text-muted-foreground border-border',
};

function VitalChip({ label, value, unit }: { label: string; value?: string | number; unit?: string }) {
  return (
    <div className={styles.style1}>
      <span className={styles.style2}>{label}</span>
      <span className={styles.style3}>
        {value != null ? `${value}${unit ?? ''}` : '—'}
      </span>
    </div>
  );
}

export function PatientHeaderCard({ patient, latestVitals, latestStaging }: Props) {
  const initials = patient.firstName
    ? `${patient.firstName[0]}${patient.lastName?.[0] ?? ''}`
    : patient.name[0];

  const payorLabel = patient.payor ? PAYOR_LABELS[patient.payor.type] : null;
  const payorName  = patient.payor?.insurance?.name
    ?? patient.payor?.government?.schemeName
    ?? patient.payor?.corporate?.corporateName
    ?? null;

  return (
    <div className={styles.style4}>
      {/* Identity row */}
      <div className={styles.style5}>
        <div className={styles.style6}>
          {initials.toUpperCase()}
        </div>
        <div className={styles.style7}>
          <div className={styles.style8}>
            <h1 className={styles.style9}>{patient.name}</h1>
            <span className={styles.style10}>{patient.mrn}</span>
            <span className={styles.style11}>{patient.center}</span>
            {latestStaging && (latestStaging.stageOverride || latestStaging.stageGroup) && (
              <span className={styles.style12}>
                {latestStaging.stageOverride || latestStaging.stageGroup}
              </span>
            )}
          </div>

          <div className={styles.style13}>
            {/* Diagnosis */}
            {patient.diagnosis ? (
              <span className={styles.style3}>
                {patient.diagnosis.cancerType}
                <span className={styles.style14}>· {patient.diagnosis.stage}</span>
              </span>
            ) : (
              <span className={styles.style15}>Not yet diagnosed</span>
            )}

            {/* Payor */}
            {payorLabel && (
              <span className={styles.style16}>
                <ShieldCheck size={13} className={styles.style17} />
                {payorLabel}{payorName ? ` · ${payorName}` : ''}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Vitals strip */}
      <div className={styles.style18}>
        <VitalChip label="BP"    value={latestVitals?.bp}          />
        <VitalChip label="HR"    value={latestVitals?.heartRate}    unit=" bpm" />
        <VitalChip label="Temp"  value={latestVitals?.temperature}  unit="°F"   />
        <VitalChip label="BMI"   value={latestVitals?.bmi}          />
        <VitalChip label="BSA"   value={latestVitals?.bsa}          unit=" m²"  />
        <VitalChip label="SpO₂"  value={latestVitals?.spo2}         unit="%"    />
        {latestVitals && (
          <div className={styles.style19}>
            <span className={styles.style2}>Recorded</span>
            <span className={styles.style20}>{new Date(latestVitals.recordedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
          </div>
        )}
      </div>

      {/* Allergy row */}
      <div className={styles.style21}>
        <span className={styles.style22}>
          <AlertTriangle size={12} />
          Allergies:
        </span>
        {patient.allergies && patient.allergies.length > 0 ? (
          patient.allergies.map((a, i) => (
            <span
              key={i}
              className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${ALLERGY_COLORS[a.type] ?? ALLERGY_COLORS.other}`}
            >
              {a.allergen} <span className={styles.style23}>({a.type})</span>
            </span>
          ))
        ) : (
          <span className={styles.style24}>
            No Known Allergies
          </span>
        )}
      </div>
    </div>
  );
}

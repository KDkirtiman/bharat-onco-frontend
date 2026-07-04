import { User, AlertTriangle, ShieldCheck } from 'lucide-react';
import type { Patient } from '../../datapoints/patients';
import type { Vitals } from '../../datapoints/clinical';
import type { CancerStaging } from '../../datapoints/staging';

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
  drug:          'bg-red-50 text-red-700 border-red-200',
  food:          'bg-amber-50 text-amber-700 border-amber-200',
  environmental: 'bg-green-50 text-green-700 border-green-200',
  latex:         'bg-orange-50 text-orange-700 border-orange-200',
  other:         'bg-muted text-muted-foreground border-border',
};

function VitalChip({ label, value, unit }: { label: string; value?: string | number; unit?: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5 px-4 first:pl-0 last:pr-0">
      <span className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</span>
      <span className="text-sm font-semibold text-foreground">
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
    <div className="bg-card border border-border rounded-2xl shadow-sm px-6 py-5">
      {/* Identity row */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-base font-bold shrink-0">
          {initials.toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h1 className="text-xl font-bold text-foreground">{patient.name}</h1>
            <span className="text-sm font-mono text-muted-foreground">{patient.mrn}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-secondary/10 text-secondary font-medium">{patient.center}</span>
            {latestStaging && (latestStaging.stageOverride || latestStaging.stageGroup) && (
              <span className="text-xs px-2.5 py-0.5 rounded-full border bg-primary/10 text-primary border-primary/20 font-semibold">
                {latestStaging.stageOverride || latestStaging.stageGroup}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
            {/* Diagnosis */}
            {patient.diagnosis ? (
              <span className="text-sm font-semibold text-foreground">
                {patient.diagnosis.cancerType}
                <span className="font-normal text-muted-foreground ml-1">· {patient.diagnosis.stage}</span>
              </span>
            ) : (
              <span className="text-sm text-muted-foreground italic">Not yet diagnosed</span>
            )}

            {/* Payor */}
            {payorLabel && (
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <ShieldCheck size={13} className="text-primary" />
                {payorLabel}{payorName ? ` · ${payorName}` : ''}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Vitals strip */}
      <div className="mt-4 bg-muted/30 rounded-xl px-4 py-3 flex items-center divide-x divide-border overflow-x-auto">
        <VitalChip label="BP"    value={latestVitals?.bp}          />
        <VitalChip label="HR"    value={latestVitals?.heartRate}    unit=" bpm" />
        <VitalChip label="Temp"  value={latestVitals?.temperature}  unit="°F"   />
        <VitalChip label="BMI"   value={latestVitals?.bmi}          />
        <VitalChip label="BSA"   value={latestVitals?.bsa}          unit=" m²"  />
        <VitalChip label="SpO₂"  value={latestVitals?.spo2}         unit="%"    />
        {latestVitals && (
          <div className="flex flex-col items-center gap-0.5 px-4">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Recorded</span>
            <span className="text-xs text-muted-foreground">{new Date(latestVitals.recordedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
          </div>
        )}
      </div>

      {/* Allergy row */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
          <AlertTriangle size={12} />
          Allergies:
        </span>
        {patient.allergies && patient.allergies.length > 0 ? (
          patient.allergies.map((a, i) => (
            <span
              key={i}
              className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${ALLERGY_COLORS[a.type] ?? ALLERGY_COLORS.other}`}
            >
              {a.allergen} <span className="opacity-70 capitalize">({a.type})</span>
            </span>
          ))
        ) : (
          <span className="text-xs px-2.5 py-0.5 rounded-full border bg-green-50 text-green-700 border-green-200 font-medium">
            No Known Allergies
          </span>
        )}
      </div>
    </div>
  );
}

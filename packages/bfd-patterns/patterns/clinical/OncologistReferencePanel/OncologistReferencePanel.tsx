import * as styles from './OncologistReferencePanel.styles';
import { useState } from 'react';
import { X, Clock, Layers, FlaskConical, FileText, AlertOctagon } from 'bfd-icons';

import type { Patient } from 'bfd-core';
import type { Appointment } from 'bfd-core';
import { APPOINTMENT_TYPE_LABELS } from 'bfd-core';
import type { ClinicalVisit } from 'bfd-core';
import type { TreatmentPlan, TreatmentDelivery, ToxicityRecord } from 'bfd-core';
import {
  TREATMENT_STATUS_COLORS, DELIVERY_STATUS_LABELS, DELIVERY_STATUS_COLORS,
  CTCAE_CATEGORY_LABELS, CTCAE_GRADE_DESCRIPTIONS,
} from 'bfd-core';
import type { CancerStaging } from 'bfd-core';

type PanelTab = 'visits' | 'plans' | 'cycles' | 'documents' | 'toxicity';

interface Props {
  patient:             Patient;
  appointments:        Appointment[];
  clinicalVisits:      ClinicalVisit[];
  treatmentPlans:      TreatmentPlan[];
  treatmentDelivery:   TreatmentDelivery[];
  toxicityRecords:     ToxicityRecord[];
  stagingRecords:      CancerStaging[];
  currentAppointmentId: string;
  onClose:             () => void;
}

function fmtDate(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

const GRADE_COLORS: Record<number, string> = {
  1: 'bg-success-soft text-success-emphasis',
  2: 'bg-warning-soft text-warning-emphasis',
  3: 'bg-orange-soft text-orange-emphasis',
  4: 'bg-destructive/10 text-destructive',
  5: 'bg-error-solid text-white',
};

export function OncologistReferencePanel({
  patient, appointments, clinicalVisits, treatmentPlans,
  treatmentDelivery, toxicityRecords, stagingRecords,
  currentAppointmentId, onClose,
}: Props) {
  const pastVisits = clinicalVisits
    .filter(cv => cv.patientId === patient.id && cv.appointmentId !== currentAppointmentId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const patientPlans     = treatmentPlans.filter(p => p.patientId === patient.id);
  const patientDeliveries = treatmentDelivery.filter(d => d.patientId === patient.id)
    .sort((a, b) => b.date.localeCompare(a.date));
  const patientToxicity  = toxicityRecords.filter(r => r.patientId === patient.id)
    .sort((a, b) => b.date.localeCompare(a.date));
  const docs             = patient.uploadedDocuments ?? [];

  const availableTabs = ([
    { id: 'visits' as const,    label: 'Past Visits',  icon: <Clock size={12} />,        count: pastVisits.length    },
    { id: 'plans' as const,     label: 'Tx Plans',     icon: <Layers size={12} />,       count: patientPlans.length  },
    { id: 'cycles' as const,    label: 'Cycles',       icon: <FlaskConical size={12} />, count: patientDeliveries.length },
    { id: 'documents' as const, label: 'Documents',    icon: <FileText size={12} />,     count: docs.length          },
    { id: 'toxicity' as const,  label: 'Toxicity',     icon: <AlertOctagon size={12} />, count: patientToxicity.length },
  ] as const).filter(t => t.count > 0);

  const [activeTab, setActiveTab] = useState<PanelTab>(availableTabs[0]?.id ?? 'visits');

  if (availableTabs.length === 0) return null;

  function getAppt(appointmentId: string) {
    return appointments.find(a => a.id === appointmentId);
  }

  return (
    <div className={styles.style4}>
      {/* Header */}
      <div className={styles.style5}>
        <p className={styles.style6}>Patient History</p>
        <button
          onClick={onClose}
          className={styles.style7}
        >
          <X size={14} />
        </button>
      </div>

      {/* Body: vertical tab list + content */}
      <div className={styles.style8}>

        {/* Vertical tab list */}
        <div className={styles.style9}>
          {availableTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 w-full px-3 py-3 text-caption-sm font-medium transition-colors text-left border-l-2',
                activeTab === tab.id
                  ? 'text-primary border-primary bg-primary/5'
                  : 'text-muted-foreground hover:text-foreground border-transparent hover:bg-muted/50',
              )}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className={styles.style10}>

        {/* Past Visits */}
        {activeTab === 'visits' && (
          <div className={styles.style11}>
            {pastVisits.map(cv => {
              const appt = getAppt(cv.appointmentId);
              return (
                <div key={cv.id} className={styles.style12}>
                  <div className={styles.style13}>
                    <span className={styles.style14}>
                      {appt ? fmtDate(appt.date) : fmtDate(cv.createdAt)}
                    </span>
                    {appt && (
                      <span className={styles.style15}>
                        {APPOINTMENT_TYPE_LABELS[appt.type]}
                      </span>
                    )}
                  </div>
                  {cv.chiefComplaints && (
                    <p className={styles.style16}>
                      <span className={styles.style17}>CC: </span>
                      {cv.chiefComplaints}
                    </p>
                  )}
                  {cv.clinicalNotes && (
                    <p className={styles.style16}>
                      {cv.clinicalNotes}
                    </p>
                  )}
                  {cv.prescriptions && cv.prescriptions.length > 0 && (
                    <p className={styles.style18}>
                      {cv.prescriptions.length} prescription{cv.prescriptions.length > 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Treatment Plans */}
        {activeTab === 'plans' && (
          <div className={styles.style11}>
            {patientPlans.map(plan => (
              <div key={plan.id} className={styles.style19}>
                <div className={styles.style20}>
                  <p className={styles.style21}>{plan.regimen}</p>
                  <span className={styles.style2Class(TREATMENT_STATUS_COLORS[plan.status])}>
                    {plan.status}
                  </span>
                </div>
                <div className={styles.style13}>
                  <span className={styles.style22}>
                    {plan.modality}
                  </span>
                  {plan.intent && (
                    <span className={styles.style23}>{plan.intent}</span>
                  )}
                </div>
                {plan.modality === 'chemotherapy' && plan.chemoDetails && (
                  <p className={styles.style23}>
                    {plan.chemoDetails.drugs.map(d => d.name).join(', ')}
                    {' · '}{plan.chemoDetails.cyclesPlanned} cycles
                  </p>
                )}
                {plan.startDate && (
                  <p className={styles.style18}>
                    Started: {fmtDate(plan.startDate)}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Treatment Cycles */}
        {activeTab === 'cycles' && (
          <div className={styles.style11}>
            {patientDeliveries.map(d => {
              const plan = patientPlans.find(p => p.id === d.planId);
              const cycleNum = d.chemoDetails?.cycleNumber ?? d.sessionNumber;
              return (
                <div key={d.id} className={styles.style12}>
                  <div className={styles.style20}>
                    <div className={styles.style24}>
                      <span className={styles.style25}>
                        {d.modality}
                        {cycleNum ? ` · Cycle ${cycleNum}` : ''}
                      </span>
                    </div>
                    <span className={styles.style2Class(DELIVERY_STATUS_COLORS[d.status])}>
                      {DELIVERY_STATUS_LABELS[d.status]}
                    </span>
                  </div>
                  <p className={styles.style23}>{fmtDate(d.date)}</p>
                  {plan && (
                    <p className={styles.style26}>{plan.regimen}</p>
                  )}
                  {d.chemoDetails?.drugs && (
                    <p className={styles.style27}>
                      {d.chemoDetails.drugs.map(dr => dr.name).join(', ')}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Documents */}
        {activeTab === 'documents' && (
          <div className={styles.style11}>
            {docs.map((doc, i) => (
              <div key={i} className={styles.style28}>
                <p className={styles.style29}>{doc.fileName}</p>
                <div className={styles.style13}>
                  <span className={styles.style30}>
                    {doc.type}
                  </span>
                  {doc.subcategory && (
                    <span className={styles.style23}>{doc.subcategory}</span>
                  )}
                </div>
                <p className={styles.style18}>{fmtDate(doc.uploadedAt)}</p>
              </div>
            ))}
          </div>
        )}

        {/* Toxicity */}
        {activeTab === 'toxicity' && (
          <div className={styles.style11}>
            {patientToxicity.map(rec => {
              const plan = patientPlans.find(p => p.id === rec.planId);
              return (
                <div key={rec.id} className={styles.style12}>
                  <div className={styles.style20}>
                    <p className={styles.style21}>{rec.toxicityType}</p>
                    <span className={styles.style3Class(GRADE_COLORS[rec.grade] ?? 'bg-muted text-muted-foreground')}>
                      G{rec.grade}
                    </span>
                  </div>
                  <div className={styles.style13}>
                    <span className={styles.style23}>
                      {CTCAE_CATEGORY_LABELS[rec.ctcaeCategory]}
                    </span>
                    {plan && (
                      <>
                        <span className={styles.style31}>·</span>
                        <span className={styles.style32}>
                          {plan.modality}{rec.cycleNumber ? ` C${rec.cycleNumber}` : ''}
                        </span>
                      </>
                    )}
                  </div>
                  <p className={styles.style18}>{fmtDate(rec.date)}</p>
                  {rec.description && (
                    <p className={styles.style33}>{rec.description}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        </div>
      </div>
    </div>
  );
}

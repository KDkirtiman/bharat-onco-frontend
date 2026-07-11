import * as styles from './PrescriptionViewerOverlay.styles';
import { X, Printer, Download } from 'bfd-icons';
import { Modal } from 'bfd-core';
import { Button } from 'bfd-core';
import { IconButton } from 'bfd-core';
import type { Patient } from 'bfd-core';
import type { Appointment } from 'bfd-core';
import { APPOINTMENT_TYPE_LABELS } from 'bfd-core';
import type { ClinicalVisit, Vitals } from 'bfd-core';
import { calcAge } from 'bfd-core';

interface Props {
  patient:       Patient;
  appointment:   Appointment;
  clinicalVisit: ClinicalVisit;
  vitals?:       Vitals;
  onClose:       () => void;
}

function Row({ label, value }: { label: string; value?: string | number }) {
  if (!value) return null;
  return <p className={styles.style1}><span className={styles.style2}>{label}:</span> {value}</p>;
}

export function PrescriptionViewerOverlay({ patient, appointment, clinicalVisit, vitals, onClose }: Props) {
  const fmtDate = (d: string) =>
    new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <Modal
      onClose={onClose}
      size="2xl"
      overlayClassName="bg-black/40 backdrop-blur-sm print:bg-transparent print:p-0 print:items-start"
      className={styles.style3}
    >

        {/* Action bar — hidden during print */}
        <div className={styles.style4}>
          <h2 className={styles.style5}>Prescription / Visit Summary</h2>
          <div className={styles.style6}>
            <Button size="sm" onClick={() => window.print()} className={styles.style7}>
              <Printer size={14} />
              Print
            </Button>
            <Button variant="ghost" size="sm" onClick={() => window.print()} className={styles.style8}>
              <Download size={14} />
              Download PDF
            </Button>
            <IconButton icon={<X size={16} />} label="Close" onClick={onClose} />
          </div>
        </div>

        {/* Printable body */}
        <div className={styles.style9}>

          {/* Letterhead */}
          <div className={styles.style10}>
            <h1 className={styles.style11}>Bharat Oncology</h1>
            <p className={styles.style12}>{appointment.center}</p>
          </div>

          {/* Patient & visit info */}
          <div className={styles.style13}>
            <div className={styles.style14}>
              <Row label="Patient"  value={patient.name} />
              <Row label="MRN"      value={patient.mrn} />
              <Row label="Age / Sex" value={`${calcAge(patient.dob)} / ${patient.gender}`} />
              <Row label="Phone"    value={patient.phone} />
            </div>
            <div className={styles.style14}>
              <Row label="Visit ID" value={appointment.visitId} />
              <Row label="Date"     value={fmtDate(appointment.date)} />
              <Row label="Type"     value={APPOINTMENT_TYPE_LABELS[appointment.type]} />
            </div>
          </div>

          {/* Vitals */}
          {vitals && (
            <div>
              <p className={styles.style15}>Vitals</p>
              <div className={styles.style16}>
                <Row label="BP"     value={vitals.bp ? `${vitals.bp} mmHg` : undefined} />
                <Row label="Pulse"  value={vitals.heartRate ? `${vitals.heartRate} bpm` : undefined} />
                <Row label="SpO₂"   value={vitals.spo2 ? `${vitals.spo2}%` : undefined} />
                <Row label="Height" value={vitals.height ? `${vitals.height} cm` : undefined} />
                <Row label="Weight" value={vitals.weight ? `${vitals.weight} kg` : undefined} />
                <Row label="BMI"    value={vitals.bmi ? String(vitals.bmi) : undefined} />
              </div>
            </div>
          )}

          {/* Chief complaints */}
          {clinicalVisit.chiefComplaints && (
            <div>
              <p className={styles.style17}>Chief Complaints</p>
              <p className={styles.style1}>{clinicalVisit.chiefComplaints}</p>
              {clinicalVisit.complaintDuration && (
                <p className={styles.style18}>Duration: {clinicalVisit.complaintDuration}</p>
              )}
            </div>
          )}

          {/* Diagnosis */}
          {clinicalVisit.provisionalDiagnosis && (
            <div>
              <p className={styles.style17}>Diagnosis</p>
              <p className={styles.style19}>{clinicalVisit.provisionalDiagnosis}</p>
            </div>
          )}

          {/* Clinical notes */}
          {clinicalVisit.clinicalNotes && (
            <div>
              <p className={styles.style17}>Clinical Notes</p>
              <p className={styles.style20}>{clinicalVisit.clinicalNotes}</p>
            </div>
          )}

          {/* Plan */}
          {clinicalVisit.plan && (
            <div>
              <p className={styles.style17}>Plan</p>
              <p className={styles.style20}>{clinicalVisit.plan}</p>
            </div>
          )}

          {/* Prescriptions */}
          {clinicalVisit.prescriptions && clinicalVisit.prescriptions.length > 0 && (
            <div>
              <p className={styles.style15}>Medicines Prescribed</p>
              <table className={styles.style21}>
                <thead className={styles.style22}>
                  <tr>
                    {['Medicine', 'Dose', 'Frequency', 'Duration', 'Instructions'].map(h => (
                      <th key={h} className={styles.style23}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {clinicalVisit.prescriptions.map((rx, i) => (
                    <tr key={rx.id} className={i % 2 === 0 ? '' : 'bg-neutral-soft'}>
                      <td className={styles.style24}>{rx.medicineName}</td>
                      <td className={styles.style25}>{rx.dose}</td>
                      <td className={styles.style25}>{rx.frequency}</td>
                      <td className={styles.style25}>{rx.duration}</td>
                      <td className={styles.style26}>{rx.instructions ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Test orders */}
          {clinicalVisit.testOrders && clinicalVisit.testOrders.length > 0 && (
            <div>
              <p className={styles.style15}>Investigation Orders</p>
              <table className={styles.style21}>
                <thead className={styles.style22}>
                  <tr>
                    {['Test Name', 'Instructions'].map(h => (
                      <th key={h} className={styles.style23}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {clinicalVisit.testOrders.map((to, i) => (
                    <tr key={to.id} className={i % 2 === 0 ? '' : 'bg-neutral-soft'}>
                      <td className={styles.style24}>{to.testName}</td>
                      <td className={styles.style26}>{to.instructions ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Follow-up */}
          {clinicalVisit.followUp && (
            <div className={styles.style27}>
              <p className={styles.style28}>Follow-Up</p>
              {clinicalVisit.followUp.noFollowUpNeeded ? (
                <p className={styles.style29}>
                  No follow-up required
                  {clinicalVisit.followUp.noFollowUpReason && ` — ${clinicalVisit.followUp.noFollowUpReason}`}
                </p>
              ) : clinicalVisit.followUp.specificDate ? (
                <p className={styles.style29}>
                  {new Date(clinicalVisit.followUp.specificDate + 'T00:00:00').toLocaleDateString('en-IN', {
                    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
                  })}
                  {clinicalVisit.followUp.value ? ` (after ${clinicalVisit.followUp.value} ${clinicalVisit.followUp.unit})` : ''}
                </p>
              ) : null}
            </div>
          )}

          {/* Signature */}
          <div className={styles.style30}>
            <p>Date: {fmtDate(clinicalVisit.updatedAt)}</p>
            <div className={styles.style31}>
              <div className={styles.style32}>
                <p className={styles.style19}>Doctor's Signature</p>
              </div>
            </div>
          </div>
        </div>
    </Modal>
  );
}

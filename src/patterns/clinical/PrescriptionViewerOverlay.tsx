import { X, Printer, Download } from 'lucide-react';
import { Modal } from '../../components/layout/Modal';
import { Button } from '../../components/controls/Button';
import { IconButton } from '../../components/controls/IconButton';
import type { Patient } from '../../datapoints/patients';
import type { Appointment } from '../../datapoints/scheduling';
import { APPOINTMENT_TYPE_LABELS } from '../../datapoints/scheduling';
import type { ClinicalVisit, Vitals } from '../../datapoints/clinical';
import { calcAge } from '../../lib/formatters';

interface Props {
  patient:       Patient;
  appointment:   Appointment;
  clinicalVisit: ClinicalVisit;
  vitals?:       Vitals;
  onClose:       () => void;
}

function Row({ label, value }: { label: string; value?: string | number }) {
  if (!value) return null;
  return <p className="text-sm"><span className="font-semibold">{label}:</span> {value}</p>;
}

export function PrescriptionViewerOverlay({ patient, appointment, clinicalVisit, vitals, onClose }: Props) {
  const fmtDate = (d: string) =>
    new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <Modal
      onClose={onClose}
      size="2xl"
      overlayClassName="bg-black/40 backdrop-blur-sm print:bg-transparent print:p-0 print:items-start"
      className="bg-white shadow-xl print:max-h-none print:shadow-none print:border-0 print:rounded-none"
    >

        {/* Action bar — hidden during print */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border print:hidden shrink-0">
          <h2 className="text-base font-semibold text-foreground">Prescription / Visit Summary</h2>
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={() => window.print()} className="gap-1.5">
              <Printer size={14} />
              Print
            </Button>
            <Button variant="ghost" size="sm" onClick={() => window.print()} className="gap-1.5 bg-muted hover:bg-muted/80">
              <Download size={14} />
              Download PDF
            </Button>
            <IconButton icon={<X size={16} />} label="Close" onClick={onClose} />
          </div>
        </div>

        {/* Printable body */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-5 text-gray-900 print:overflow-visible">

          {/* Letterhead */}
          <div className="border-b-2 border-purple-700 pb-4">
            <h1 className="text-xl font-bold text-purple-700">Bharat Oncology</h1>
            <p className="text-sm text-gray-500">{appointment.center}</p>
          </div>

          {/* Patient & visit info */}
          <div className="grid grid-cols-2 gap-6 text-sm">
            <div className="space-y-0.5">
              <Row label="Patient"  value={patient.name} />
              <Row label="MRN"      value={patient.mrn} />
              <Row label="Age / Sex" value={`${calcAge(patient.dob)} / ${patient.gender}`} />
              <Row label="Phone"    value={patient.phone} />
            </div>
            <div className="space-y-0.5">
              <Row label="Visit ID" value={appointment.visitId} />
              <Row label="Date"     value={fmtDate(appointment.date)} />
              <Row label="Type"     value={APPOINTMENT_TYPE_LABELS[appointment.type]} />
            </div>
          </div>

          {/* Vitals */}
          {vitals && (
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Vitals</p>
              <div className="grid grid-cols-3 gap-x-8 gap-y-1 text-sm">
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
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Chief Complaints</p>
              <p className="text-sm">{clinicalVisit.chiefComplaints}</p>
              {clinicalVisit.complaintDuration && (
                <p className="text-xs text-gray-500 mt-0.5">Duration: {clinicalVisit.complaintDuration}</p>
              )}
            </div>
          )}

          {/* Diagnosis */}
          {clinicalVisit.provisionalDiagnosis && (
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Diagnosis</p>
              <p className="text-sm font-medium">{clinicalVisit.provisionalDiagnosis}</p>
            </div>
          )}

          {/* Clinical notes */}
          {clinicalVisit.clinicalNotes && (
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Clinical Notes</p>
              <p className="text-sm whitespace-pre-wrap">{clinicalVisit.clinicalNotes}</p>
            </div>
          )}

          {/* Plan */}
          {clinicalVisit.plan && (
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Plan</p>
              <p className="text-sm whitespace-pre-wrap">{clinicalVisit.plan}</p>
            </div>
          )}

          {/* Prescriptions */}
          {clinicalVisit.prescriptions && clinicalVisit.prescriptions.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Medicines Prescribed</p>
              <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    {['Medicine', 'Dose', 'Frequency', 'Duration', 'Instructions'].map(h => (
                      <th key={h} className="text-left py-2 px-3 text-xs font-semibold text-gray-500 border-b border-gray-200">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {clinicalVisit.prescriptions.map((rx, i) => (
                    <tr key={rx.id} className={i % 2 === 0 ? '' : 'bg-gray-50'}>
                      <td className="py-2 px-3 font-medium border-b border-gray-100">{rx.medicineName}</td>
                      <td className="py-2 px-3 border-b border-gray-100">{rx.dose}</td>
                      <td className="py-2 px-3 border-b border-gray-100">{rx.frequency}</td>
                      <td className="py-2 px-3 border-b border-gray-100">{rx.duration}</td>
                      <td className="py-2 px-3 border-b border-gray-100 text-gray-500">{rx.instructions ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Test orders */}
          {clinicalVisit.testOrders && clinicalVisit.testOrders.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Investigation Orders</p>
              <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    {['Test Name', 'Instructions'].map(h => (
                      <th key={h} className="text-left py-2 px-3 text-xs font-semibold text-gray-500 border-b border-gray-200">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {clinicalVisit.testOrders.map((to, i) => (
                    <tr key={to.id} className={i % 2 === 0 ? '' : 'bg-gray-50'}>
                      <td className="py-2 px-3 font-medium border-b border-gray-100">{to.testName}</td>
                      <td className="py-2 px-3 border-b border-gray-100 text-gray-500">{to.instructions ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Follow-up */}
          {clinicalVisit.followUp && (
            <div className="border border-purple-200 rounded-lg px-4 py-3 bg-purple-50">
              <p className="text-xs font-bold uppercase tracking-widest text-purple-600 mb-1">Follow-Up</p>
              {clinicalVisit.followUp.noFollowUpNeeded ? (
                <p className="text-sm font-medium text-gray-700">
                  No follow-up required
                  {clinicalVisit.followUp.noFollowUpReason && ` — ${clinicalVisit.followUp.noFollowUpReason}`}
                </p>
              ) : clinicalVisit.followUp.specificDate ? (
                <p className="text-sm font-medium text-gray-700">
                  {new Date(clinicalVisit.followUp.specificDate + 'T00:00:00').toLocaleDateString('en-IN', {
                    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
                  })}
                  {clinicalVisit.followUp.value ? ` (after ${clinicalVisit.followUp.value} ${clinicalVisit.followUp.unit})` : ''}
                </p>
              ) : null}
            </div>
          )}

          {/* Signature */}
          <div className="border-t border-gray-200 pt-4 text-sm text-gray-500">
            <p>Date: {fmtDate(clinicalVisit.updatedAt)}</p>
            <div className="mt-8 flex justify-end">
              <div className="border-t border-gray-700 pt-1 min-w-[180px] text-center text-gray-700">
                <p className="text-sm font-medium">Doctor's Signature</p>
              </div>
            </div>
          </div>
        </div>
    </Modal>
  );
}

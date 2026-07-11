import * as styles from './BookAppointmentOverlay.styles';
import { useState, useMemo, useEffect } from 'react';
import { X, CalendarPlus, CheckCircle2 } from 'bfd-icons';
import type { Patient } from 'bfd-core';
import type { Appointment, AppointmentType } from 'bfd-core';
import {
  APPOINTMENT_TYPE_LABELS, generateTimeSlots, generateVisitId, mockDoctors,
} from 'bfd-core';
import { Button } from 'bfd-core';
import { FormField } from 'bfd-core';
import { Select } from 'bfd-core';
import { TextField } from 'bfd-core';
import { Textarea } from 'bfd-core';
import { SearchCombobox } from 'bfd-core';
import { IconButton } from 'bfd-core';
import { Avatar } from 'bfd-core';
import { ResultState } from 'bfd-core';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'bfd-core';
import { localToday } from 'bfd-core';

interface FormState {
  type:     AppointmentType | '';
  doctorId: string;
  date:     string;
  time:     string;
  notes:    string;
}

type Errors = Partial<Record<keyof FormState | 'patient', string>>;

const APPOINTMENT_TYPES: AppointmentType[] = [
  'initial-visit', 'regular-visit', 'follow-up', 'chemo-session', 'follow-up-free',
];

interface Props {
  patients:                Patient[];
  appointments:            Appointment[];
  selectedCenter:          string;
  onBook:                  (appt: Appointment) => void;
  onClose:                 () => void;
  preSelectedPatientId?:   string;
}

function fmtDate(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-IN', {
    day: '2-digit', month: 'long', year: 'numeric',
  });
}

function fmtTime(t: string) {
  const [h, m] = t.split(':').map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
}

const today = localToday();
const INITIAL_FORM: FormState = { type: '', doctorId: '', date: today, time: '', notes: '' };

export function BookAppointmentOverlay({ patients, appointments, selectedCenter, onBook, onClose, preSelectedPatientId }: Props) {
  const [searchQuery,     setSearchQuery]     = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(
    () => preSelectedPatientId ? (patients.find(p => p.id === preSelectedPatientId) ?? null) : null,
  );
  const [form,            setForm]            = useState<FormState>(INITIAL_FORM);
  const [errors,          setErrors]          = useState<Errors>({});
  const [confirmedAppt,   setConfirmedAppt]   = useState<Appointment | null>(null);

  const centerPatients = useMemo(
    () => patients.filter(p => p.center === selectedCenter),
    [patients, selectedCenter],
  );

  const searchResults = useMemo(() => {
    const q = searchQuery.toLowerCase().replace(/\s/g, '');
    if (!q) return [];
    return centerPatients
      .filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.mrn.toLowerCase().replace(/-/g, '').includes(q) ||
        p.phone.replace(/\s/g, '').includes(q),
      )
      .slice(0, 6)
      .map(p => ({
        id: p.id,
        primary: p.name,
        secondary: `${p.mrn} · ${p.phone}`,
        avatar: <Avatar name={p.name} />,
      }));
  }, [searchQuery, centerPatients]);

  const allSlots = useMemo(
    () => (form.type ? generateTimeSlots(form.type as AppointmentType) : []),
    [form.type],
  );

  const availableSlots = useMemo(() => {
    if (!form.doctorId || !form.date || !form.type) return allSlots;
    const booked = new Set(
      appointments
        .filter(a => a.doctorId === form.doctorId && a.date === form.date && a.status !== 'cancelled')
        .map(a => a.time),
    );
    return allSlots.filter(s => !booked.has(s));
  }, [allSlots, form.doctorId, form.date, appointments, form.type]);

  useEffect(() => {
    if (form.time && !availableSlots.includes(form.time)) {
      setForm(f => ({ ...f, time: '' }));
    }
  }, [availableSlots]); // eslint-disable-line react-hooks/exhaustive-deps

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(f => ({ ...f, [key]: value }));
    setErrors(e => ({ ...e, [key]: undefined }));
  }

  function selectPatient(p: Patient) {
    setSelectedPatient(p);
    setSearchQuery('');
    setErrors(e => ({ ...e, patient: undefined }));
  }

  function clearPatient() {
    setSelectedPatient(null);
    setForm(INITIAL_FORM);
    setErrors({});
  }

  function validate(): boolean {
    const e: Errors = {};
    if (!selectedPatient)           e.patient  = 'Please select a patient';
    if (!form.type)                 e.type     = 'Visit type is required';
    if (!form.doctorId)             e.doctorId = 'Please select a doctor';
    if (!form.date)                 e.date     = 'Date is required';
    else if (form.date < today)     e.date     = 'Date cannot be in the past';
    if (!form.time)                 e.time     = 'Please select a time slot';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleConfirm() {
    if (!validate() || !selectedPatient) return;

    const centerDateCount = appointments.filter(
      a => a.center === selectedCenter && a.date === form.date,
    ).length;

    const newAppt: Appointment = {
      id:        `a${Date.now()}`,
      visitId:   generateVisitId(selectedCenter, form.date, centerDateCount + 1),
      patientId: selectedPatient.id,
      doctorId:  form.doctorId,
      date:      form.date,
      time:      form.time,
      type:      form.type as AppointmentType,
      status:    'scheduled',
      center:    selectedCenter,
      notes:     form.notes.trim() || undefined,
    };

    onBook(newAppt);
    setConfirmedAppt(newAppt);
  }

  const slotDisabled    = !form.type || !form.doctorId || !form.date;
  const slotPlaceholder = !form.type     ? 'Select visit type first'
                        : !form.doctorId ? 'Select doctor first'
                        : !form.date     ? 'Select date first'
                        : availableSlots.length === 0 ? 'No slots available'
                        : 'Select time slot';

  const confirmedDoctor = mockDoctors.find(d => d.id === form.doctorId);

  if (confirmedAppt) {
    return (
      <Modal onClose={onClose}>
        <ModalHeader
          title="Book Appointment"
          icon={<CalendarPlus size={16} />}
          onClose={onClose}
        />
        <ResultState
          icon={<CheckCircle2 size={32} className={styles.style1} />}
          title="Appointment Confirmed"
          onAction={onClose}
          summary={
            <>
              <p className={styles.style2}>
                {selectedPatient?.name}
                <span className={styles.style3}> · {selectedPatient?.mrn}</span>
              </p>
              <p className={styles.style4}>
                {APPOINTMENT_TYPE_LABELS[confirmedAppt.type]}
                {confirmedDoctor && (
                  <span className={styles.style5}> · {confirmedDoctor.name}</span>
                )}
              </p>
              <p className={styles.style4}>
                {fmtDate(confirmedAppt.date)} · {fmtTime(confirmedAppt.time)}
              </p>
              <p className={styles.style6}>{confirmedAppt.visitId}</p>
            </>
          }
        />
      </Modal>
    );
  }

  return (
    <Modal onClose={onClose}>
      <ModalHeader
        title="Book Appointment"
        icon={<CalendarPlus size={16} />}
        onClose={onClose}
      />

      <ModalBody className={styles.style7}>
        {!selectedPatient ? (
          <FormField
            label={<>Patient <span className={styles.style8}>{selectedCenter} center</span></>}
            required
            error={errors.patient}
          >
            <SearchCombobox
              query={searchQuery}
              onQueryChange={setSearchQuery}
              items={searchResults}
              onSelect={(item) => {
                const p = centerPatients.find(cp => cp.id === item.id);
                if (p) selectPatient(p);
              }}
              placeholder="Search by name, MRN or phone…"
              emptyTitle="No patients found"
              emptyDescription="Try a different name, MRN or contact"
              error={!!errors.patient}
            />
          </FormField>
        ) : (
          <div className={styles.style9}>
            <CheckCircle2 size={16} className={styles.style10} />
            <div className={styles.style11}>
              <p className={styles.style12}>{selectedPatient.name}</p>
              <p className={styles.style13}>{selectedPatient.mrn} · {selectedPatient.phone}</p>
            </div>
            <IconButton
              icon={<X size={14} />}
              label="Clear patient"
              size="sm"
              className={styles.style14}
              onClick={clearPatient}
            />
          </div>
        )}

        {selectedPatient && (
          <>
            <FormField label="Visit Type" required error={errors.type}>
              <Select
                value={form.type}
                placeholder="Select visit type"
                error={!!errors.type}
                options={APPOINTMENT_TYPES.map(t => ({
                  value: t,
                  label: APPOINTMENT_TYPE_LABELS[t],
                }))}
                onChange={e => {
                  setForm(f => ({ ...f, type: e.target.value as AppointmentType, time: '' }));
                  setErrors(er => ({ ...er, type: undefined, time: undefined }));
                }}
              />
            </FormField>

            <FormField label="Doctor" required error={errors.doctorId}>
              <Select
                value={form.doctorId}
                placeholder="Select doctor"
                error={!!errors.doctorId}
                options={mockDoctors.map(d => ({
                  value: d.id,
                  label: `${d.name} — ${d.specialization}`,
                }))}
                onChange={e => {
                  setForm(f => ({ ...f, doctorId: e.target.value, time: '' }));
                  setErrors(er => ({ ...er, doctorId: undefined, time: undefined }));
                }}
              />
            </FormField>

            <FormField label="Date" required error={errors.date}>
              <TextField
                type="date"
                min={today}
                value={form.date}
                error={!!errors.date}
                onChange={e => {
                  setForm(f => ({ ...f, date: e.target.value, time: '' }));
                  setErrors(er => ({ ...er, date: undefined, time: undefined }));
                }}
              />
            </FormField>

            <FormField
              label="Time Slot"
              required
              hint={form.type ? `(${form.type === 'initial-visit' ? '20-min' : '10-min'} slots${!slotDisabled ? ` · ${availableSlots.length} available` : ''})` : undefined}
              error={errors.time}
            >
              <Select
                value={form.time}
                placeholder={slotPlaceholder}
                error={!!errors.time}
                disabled={slotDisabled || availableSlots.length === 0}
                options={availableSlots.map(s => ({ value: s, label: s }))}
                onChange={e => setField('time', e.target.value)}
              />
            </FormField>

            <FormField label="Notes" optional>
              <Textarea
                value={form.notes}
                onChange={e => setField('notes', e.target.value)}
                placeholder="Add any notes for this appointment…"
                rows={3}
              />
            </FormField>
          </>
        )}
      </ModalBody>

      <ModalFooter>
        <Button variant="ghost" size="sm" className={styles.style15} onClick={onClose}>
          Cancel
        </Button>
        <Button size="sm" onClick={handleConfirm} className={styles.style16}>
          <CalendarPlus size={14} />
          Confirm Appointment
        </Button>
      </ModalFooter>
    </Modal>
  );
}

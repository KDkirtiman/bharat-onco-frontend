import * as styles from './QuickScheduleOverlay.styles';
import { useState, useMemo, useEffect } from 'react';
import { CalendarCheck } from 'bfd-icons';
import type { VisitAlert, AppointmentType, Doctor, Appointment, ScheduleFormData } from 'bfd-core';
import { APPOINTMENT_TYPE_LABELS, generateTimeSlots } from 'bfd-core';
import type { Patient } from 'bfd-core';
import { Button } from 'bfd-core';
import { FormField } from 'bfd-core';
import { Select } from 'bfd-core';
import { TextField } from 'bfd-core';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'bfd-core';

interface Props {
  alert:          VisitAlert;
  patient:        Patient;
  doctors:        Doctor[];
  appointments:   Appointment[];
  selectedCenter: string;
  onSchedule:     (data: ScheduleFormData) => void;
  onClose:        () => void;
}

const APPOINTMENT_TYPES: AppointmentType[] = [
  'initial-visit', 'regular-visit', 'follow-up', 'chemo-session', 'follow-up-free',
];

function inferVisitType(alertType: string): AppointmentType {
  const s = alertType.toLowerCase();
  if (s.includes('chemo'))   return 'chemo-session';
  if (s.includes('initial')) return 'initial-visit';
  if (s.includes('follow'))  return 'follow-up';
  return 'follow-up';
}

export function QuickScheduleOverlay({ alert, patient, doctors, appointments, selectedCenter, onSchedule, onClose }: Props) {
  const today = new Date().toISOString().split('T')[0];

  const [form, setForm] = useState<ScheduleFormData>({
    type:     inferVisitType(alert.alertType),
    center:   selectedCenter,
    doctorId: '',
    date:     today,
    time:     '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ScheduleFormData, string>>>({});

  const allSlots = useMemo(() => (form.type ? generateTimeSlots(form.type) : []), [form.type]);

  const availableSlots = useMemo(() => {
    if (!form.doctorId || !form.date) return allSlots;
    const booked = new Set(
      appointments
        .filter(a => a.doctorId === form.doctorId && a.date === form.date && a.status !== 'cancelled')
        .map(a => a.time),
    );
    return allSlots.filter(s => !booked.has(s));
  }, [allSlots, form.doctorId, form.date, appointments]);

  useEffect(() => {
    if (form.time && !availableSlots.includes(form.time)) {
      setForm(f => ({ ...f, time: '' }));
    }
  }, [availableSlots]);

  function setField<K extends keyof ScheduleFormData>(key: K, value: ScheduleFormData[K]) {
    setForm(f => ({ ...f, [key]: value }));
    setErrors(e => ({ ...e, [key]: undefined }));
  }

  function validate(): boolean {
    const e: typeof errors = {};
    if (!form.type)              e.type     = 'Visit type is required';
    if (!form.doctorId)          e.doctorId = 'Please select a doctor';
    if (!form.date)              e.date     = 'Date is required';
    else if (form.date < today)  e.date     = 'Date cannot be in the past';
    if (!form.time)              e.time     = 'Please select a time slot';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  const slotDisabled    = !form.type || !form.doctorId || !form.date;
  const slotPlaceholder = !form.type     ? 'Select visit type first'
                        : !form.doctorId ? 'Select doctor first'
                        : !form.date     ? 'Select date first'
                        : availableSlots.length === 0 ? 'No slots available'
                        : 'Select time slot';

  return (
    <Modal onClose={onClose} overlayClassName="bg-black/50">
      <ModalHeader
        title="Schedule Appointment"
        icon={<CalendarCheck size={16} />}
        onClose={onClose}
      />

      <ModalBody className={styles.style1}>
        {/* Patient + alert context */}
        <div className={styles.style2}>
          <p className={styles.style3}>
            {patient.name}
            <span className={styles.style4}> · {patient.mrn}</span>
          </p>
          <p className={styles.style5}>
            {alert.alertType}
          </p>
        </div>

        <FormField label="Visit Type" required error={errors.type}>
          <Select
            value={form.type}
            placeholder="Select visit type"
            error={!!errors.type}
            options={APPOINTMENT_TYPES.map(t => ({ value: t, label: APPOINTMENT_TYPE_LABELS[t] }))}
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
            options={doctors.map(d => ({ value: d.id, label: `${d.name} — ${d.specialization}` }))}
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
      </ModalBody>

      <ModalFooter>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button onClick={() => { if (validate()) onSchedule(form); }}>
          Confirm Appointment
        </Button>
      </ModalFooter>
    </Modal>
  );
}

import * as styles from './RescheduleOverlay.styles';
import { useState, useMemo, useEffect } from 'react';
import type { Appointment, AppointmentType, Doctor } from 'bfd-core';
import { APPOINTMENT_TYPE_LABELS, generateTimeSlots } from 'bfd-core';
import type { Patient } from 'bfd-core';
import { Button } from 'bfd-core';
import { FormField } from 'bfd-core';
import { Select } from 'bfd-core';
import { TextField } from 'bfd-core';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'bfd-core';

export interface RescheduleFormData {
  date: string;
  time: string;
  doctorId: string;
  type: AppointmentType;
}

interface Props {
  appointment: Appointment;
  patient: Patient;
  doctors: Doctor[];
  appointments: Appointment[];
  onSave: (data: RescheduleFormData) => void;
  onClose: () => void;
}

const APPOINTMENT_TYPES: AppointmentType[] = [
  'initial-visit', 'regular-visit', 'follow-up', 'chemo-session', 'follow-up-free',
];

export function RescheduleOverlay({ appointment, patient, doctors, appointments, onSave, onClose }: Props) {
  const minDate = new Date().toISOString().split('T')[0];

  const [form, setForm] = useState<RescheduleFormData>({
    type:     appointment.type,
    doctorId: appointment.doctorId,
    date:     appointment.date,
    time:     appointment.time,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof RescheduleFormData, string>>>({});

  // All possible slots for the selected visit type
  const allSlots = useMemo(() => (form.type ? generateTimeSlots(form.type) : []), [form.type]);

  // Filter out slots already booked by this doctor on the selected date
  const availableSlots = useMemo(() => {
    if (!form.doctorId || !form.date) return allSlots;
    const booked = new Set(
      appointments
        .filter(a =>
          a.doctorId === form.doctorId &&
          a.date === form.date &&
          a.id !== appointment.id &&
          a.status !== 'cancelled',
        )
        .map(a => a.time),
    );
    return allSlots.filter(s => !booked.has(s));
  }, [allSlots, form.doctorId, form.date, appointments, appointment.id]);

  // Clear time whenever the available slot list changes and the current time is no longer valid
  useEffect(() => {
    if (form.time && !availableSlots.includes(form.time)) {
      setForm(f => ({ ...f, time: '' }));
      setErrors(e => ({ ...e, time: undefined }));
    }
  }, [availableSlots]);

  function set<K extends keyof RescheduleFormData>(key: K, value: RescheduleFormData[K]) {
    setForm(f => ({ ...f, [key]: value }));
    setErrors(e => ({ ...e, [key]: undefined }));
  }

  function validate(): boolean {
    const errs: typeof errors = {};
    if (!form.type)               errs.type     = 'Visit type is required';
    if (!form.doctorId)           errs.doctorId = 'Please select a doctor';
    if (!form.date)               errs.date     = 'Date is required';
    else if (form.date < minDate) errs.date     = 'Date cannot be in the past';
    if (!form.time)               errs.time     = 'Please select a time slot';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSave() {
    if (validate()) onSave(form);
  }

  const slotDisabled = !form.type || !form.doctorId || !form.date;
  const slotPlaceholder = !form.type
    ? 'Select a visit type first'
    : !form.doctorId
    ? 'Select a doctor first'
    : !form.date
    ? 'Select a date first'
    : availableSlots.length === 0
    ? 'No slots available'
    : 'Select time slot';

  return (
    <Modal onClose={onClose} overlayClassName="bg-black/50">
      <ModalHeader title="Reschedule Appointment" onClose={onClose} />

      <ModalBody scroll={false} className={styles.style1}>
        {/* Patient summary */}
        <div className={styles.style2}>
          <p className={styles.style3}>
            {patient.name}
            <span className={styles.style4}> · {patient.mrn}</span>
          </p>
          <p className={styles.style5}>
            Current: {appointment.time} · {APPOINTMENT_TYPE_LABELS[appointment.type]}
          </p>
        </div>

        {/* Form — order: Visit Type → Doctor → Date → Time Slot */}
        <FormField label="Visit Type" required error={errors.type}>
          <Select
            value={form.type}
            placeholder="Select visit type"
            error={!!errors.type}
            options={APPOINTMENT_TYPES.map(t => ({ value: t, label: APPOINTMENT_TYPE_LABELS[t] }))}
            onChange={e => {
              // Changing type resets time (slot intervals change); keep doctor + date
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
              // Changing doctor resets time (that doctor may have different availability)
              setForm(f => ({ ...f, doctorId: e.target.value, time: '' }));
              setErrors(er => ({ ...er, doctorId: undefined, time: undefined }));
            }}
          />
        </FormField>

        <FormField label="Date" required error={errors.date}>
          <TextField
            type="date"
            min={minDate}
            value={form.date}
            error={!!errors.date}
            onChange={e => {
              // Changing date resets time (availability changes per date)
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
            onChange={e => set('time', e.target.value)}
          />
        </FormField>
      </ModalBody>

      <ModalFooter>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave}>Save Changes</Button>
      </ModalFooter>
    </Modal>
  );
}

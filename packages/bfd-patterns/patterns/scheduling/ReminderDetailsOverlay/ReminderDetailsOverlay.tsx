import * as styles from './ReminderDetailsOverlay.styles';
import { useState, useMemo, useEffect } from 'react';
import {
  Phone, MessageSquare, Mail, Send, CheckCircle2,
  Bell, CalendarPlus, ChevronUp,
} from 'bfd-icons';
import type { VisitAlert, AppointmentType, Doctor, Appointment, ScheduleFormData } from 'bfd-core';
import { APPOINTMENT_TYPE_LABELS, generateTimeSlots } from 'bfd-core';
import type { Patient } from 'bfd-core';
import { Button } from 'bfd-core';
import { Select } from 'bfd-core';
import { TextField } from 'bfd-core';
import { Textarea } from 'bfd-core';
import { IconButton } from 'bfd-core';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'bfd-core';

type Channel = 'sms' | 'whatsapp' | 'email';

interface Props {
  alert:          VisitAlert;
  patient:        Patient;
  doctors:        Doctor[];
  appointments:   Appointment[];
  selectedCenter: string;
  onSchedule:     (data: ScheduleFormData) => void;
  onClose:        () => void;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const APPOINTMENT_TYPES: AppointmentType[] = [
  'initial-visit', 'regular-visit', 'follow-up', 'chemo-session', 'follow-up-free',
];

const CHANNELS: { id: Channel; label: string; icon: React.ReactNode }[] = [
  { id: 'sms',      label: 'SMS',      icon: <Phone         size={13} /> },
  { id: 'whatsapp', label: 'WhatsApp', icon: <MessageSquare size={13} /> },
  { id: 'email',    label: 'Email',    icon: <Mail          size={13} /> },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

function deriveEmail(patient: Patient) {
  const slug = patient.name.toLowerCase().replace(/^dr\.\s*/i, '').replace(/\s+/g, '.');
  return `${slug}@bharatoncology.patient.in`;
}

function buildMessage(channel: Channel, patient: Patient, alert: VisitAlert): string {
  const due = formatDate(alert.dueDate);
  if (channel === 'email') {
    return (
      `Dear ${patient.name},\n\n` +
      `We hope you are doing well. This is a gentle reminder that your ` +
      `${alert.alertType} was scheduled for ${due}.\n\n` +
      `Please contact us at your nearest Bharat Oncology center to book your appointment.\n\n` +
      `Warm regards,\nBharat Oncology Care Team`
    );
  }
  return (
    `Dear ${patient.name}, this is a reminder from Bharat Oncology. ` +
    `Your ${alert.alertType} was due on ${due}. ` +
    `Please call us or visit your nearest center to book your appointment. Thank you.`
  );
}

function inferVisitType(alertType: string): AppointmentType {
  const s = alertType.toLowerCase();
  if (s.includes('chemo'))    return 'chemo-session';
  if (s.includes('initial'))  return 'initial-visit';
  if (s.includes('follow'))   return 'follow-up';
  return 'follow-up';
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ReminderDetailsOverlay({ alert, patient, doctors, appointments, selectedCenter, onSchedule, onClose }: Props) {
  const today = new Date().toISOString().split('T')[0];
  const isOverdue = alert.dueDate <= today;

  // ── Send reminder state
  const [channel, setChannel] = useState<Channel>('sms');
  const [message, setMessage] = useState(() => buildMessage('sms', patient, alert));
  const [sent, setSent]       = useState(false);

  function switchChannel(c: Channel) {
    setChannel(c);
    setMessage(buildMessage(c, patient, alert));
    setSent(false);
  }

  const contact = channel === 'email' ? deriveEmail(patient) : patient.phone;

  // ── Inline scheduling form state
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<ScheduleFormData>({
    type:     inferVisitType(alert.alertType),
    center:   selectedCenter,
    doctorId: '',
    date:     today,
    time:     '',
  });
  const [schedErrors, setSchedErrors] = useState<Partial<Record<keyof ScheduleFormData, string>>>({});

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

  // Clear time when slot list changes and current selection is no longer valid
  useEffect(() => {
    if (form.time && !availableSlots.includes(form.time)) {
      setForm(f => ({ ...f, time: '' }));
    }
  }, [availableSlots]);

  function setField<K extends keyof ScheduleFormData>(key: K, value: ScheduleFormData[K]) {
    setForm(f => ({ ...f, [key]: value }));
    setSchedErrors(e => ({ ...e, [key]: undefined }));
  }

  function validateSchedule(): boolean {
    const e: typeof schedErrors = {};
    if (!form.type)               e.type     = 'Visit type is required';
    if (!form.doctorId)           e.doctorId = 'Please select a doctor';
    if (!form.date)               e.date     = 'Date is required';
    else if (form.date < today)   e.date     = 'Date cannot be in the past';
    if (!form.time)               e.time     = 'Please select a time slot';
    setSchedErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleConfirmSchedule() {
    if (validateSchedule()) onSchedule(form);
  }

  const slotDisabled      = !form.type || !form.doctorId || !form.date;
  const slotPlaceholder   = !form.type      ? 'Select visit type first'
                          : !form.doctorId  ? 'Select doctor first'
                          : !form.date      ? 'Select date first'
                          : availableSlots.length === 0 ? 'No slots available'
                          : 'Select time slot';

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <Modal onClose={onClose} size="lg" overlayClassName="bg-black/50">
      <ModalHeader
        title="Reminder Details"
        icon={<Bell size={16} className={styles.style1} />}
        onClose={onClose}
      />

      <ModalBody className={styles.style2}>

        {/* ── Patient Information ── */}
        <section>
          <p className={styles.style3}>Patient Information</p>
          <div className={styles.style4}>
            {[
              { label: 'Name',         value: patient.name },
              { label: 'MRN',          value: patient.mrn },
              { label: 'Contact',      value: patient.phone },
              { label: 'Date of Birth',value: formatDate(patient.dob) },
            ].map(r => (
              <div key={r.label}>
                <p className={styles.style5}>{r.label}</p>
                <p className={styles.style6}>{r.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Alert Details ── */}
        <section>
          <p className={styles.style3}>Alert Details</p>
          <div className={styles.style7}>
            <p className={styles.style8}>{alert.alertType}</p>
            <p className={`text-sm mt-1 font-medium ${isOverdue ? 'text-destructive' : 'text-warning-emphasis'}`}>
              Due: {formatDate(alert.dueDate)}{isOverdue && ' · Overdue'}
            </p>
          </div>
        </section>

        {/* ── Schedule Appointment ── */}
        <section>
          <p className={styles.style3}>Schedule Appointment</p>

          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className={styles.style9}
            >
              <CalendarPlus size={16} />
              Schedule Appointment for {patient.name}
            </button>
          ) : (
            <div className={styles.style10}>

              {/* Form title + collapse */}
              <div className={styles.style11}>
                <p className={styles.style12}>New Appointment</p>
                <IconButton
                  icon={<ChevronUp size={15} />}
                  label="Collapse"
                  size="sm"
                  onClick={() => { setShowForm(false); setSchedErrors({}); }}
                />
              </div>

              {/* Visit Type */}
              <div>
                <label className={styles.style13}>
                  Visit Type <span className={styles.style14}>*</span>
                </label>
                <Select
                  fieldSize="sm"
                  value={form.type}
                  placeholder="Select visit type"
                  error={!!schedErrors.type}
                  options={APPOINTMENT_TYPES.map(t => ({ value: t, label: APPOINTMENT_TYPE_LABELS[t] }))}
                  onChange={e => {
                    setForm(f => ({ ...f, type: e.target.value as AppointmentType, time: '' }));
                    setSchedErrors(er => ({ ...er, type: undefined, time: undefined }));
                  }}
                />
                {schedErrors.type && <p className={styles.style15}>{schedErrors.type}</p>}
              </div>

              {/* Doctor */}
              <div>
                <label className={styles.style13}>
                  Doctor <span className={styles.style14}>*</span>
                </label>
                <Select
                  fieldSize="sm"
                  value={form.doctorId}
                  placeholder="Select doctor"
                  error={!!schedErrors.doctorId}
                  options={doctors.map(d => ({ value: d.id, label: `${d.name} — ${d.specialization}` }))}
                  onChange={e => {
                    setForm(f => ({ ...f, doctorId: e.target.value, time: '' }));
                    setSchedErrors(er => ({ ...er, doctorId: undefined, time: undefined }));
                  }}
                />
                {schedErrors.doctorId && <p className={styles.style15}>{schedErrors.doctorId}</p>}
              </div>

              {/* Date */}
              <div>
                <label className={styles.style13}>
                  Date <span className={styles.style14}>*</span>
                </label>
                <TextField
                  fieldSize="sm"
                  type="date"
                  min={today}
                  value={form.date}
                  error={!!schedErrors.date}
                  onChange={e => {
                    setForm(f => ({ ...f, date: e.target.value, time: '' }));
                    setSchedErrors(er => ({ ...er, date: undefined, time: undefined }));
                  }}
                />
                {schedErrors.date && <p className={styles.style15}>{schedErrors.date}</p>}
              </div>

              {/* Time Slot */}
              <div>
                <label className={styles.style13}>
                  Time Slot <span className={styles.style14}>*</span>
                  {form.type && (
                    <span className={styles.style16}>
                      ({form.type === 'initial-visit' ? '20-min' : '10-min'} slots
                      {!slotDisabled && ` · ${availableSlots.length} available`})
                    </span>
                  )}
                </label>
                <Select
                  fieldSize="sm"
                  value={form.time}
                  placeholder={slotPlaceholder}
                  error={!!schedErrors.time}
                  disabled={slotDisabled || availableSlots.length === 0}
                  options={availableSlots.map(s => ({ value: s, label: s }))}
                  onChange={e => setField('time', e.target.value)}
                />
                {schedErrors.time && <p className={styles.style15}>{schedErrors.time}</p>}
              </div>

              {/* Form actions */}
              <div className={styles.style17}>
                <Button variant="ghost" size="sm" onClick={() => { setShowForm(false); setSchedErrors({}); }} className={styles.style18}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleConfirmSchedule} className={styles.style18}>
                  Confirm Appointment
                </Button>
              </div>
            </div>
          )}
        </section>

        {/* ── Send Reminder ── */}
        <section>
          <p className={styles.style3}>Send Reminder</p>

          {/* Channel pills */}
          <div className={styles.style19}>
            {CHANNELS.map(c => (
              <button
                key={c.id}
                onClick={() => switchChannel(c.id)}
                className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${
                  channel === c.id
                    ? 'bg-primary text-white border-primary shadow-sm'
                    : 'border-border text-foreground hover:bg-muted'
                }`}
              >
                {c.icon} {c.label}
              </button>
            ))}
          </div>

          <p className={styles.style20}>
            Sending to:{' '}
            <span className={styles.style21}>{contact}</span>
          </p>

          <Textarea
            rows={channel === 'email' ? 6 : 4}
            value={message}
            onChange={e => { setMessage(e.target.value); setSent(false); }}
            className={styles.style22}
          />

          {sent ? (
            <div className={styles.style23}>
              <CheckCircle2 size={16} className={styles.style24} />
              Reminder sent via {CHANNELS.find(c => c.id === channel)?.label} to {contact}
            </div>
          ) : (
            <button
              onClick={() => setSent(true)}
              className={styles.style25}
            >
              <Send size={14} />
              Send via {CHANNELS.find(c => c.id === channel)?.label}
            </button>
          )}
        </section>

      </ModalBody>

      <ModalFooter>
        <Button variant="ghost" size="sm" className={styles.style26} onClick={onClose}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
}

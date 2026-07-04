import { useState, useMemo, useEffect } from 'react';
import {
  Phone, MessageSquare, Mail, Send, CheckCircle2,
  Bell, CalendarPlus, ChevronUp,
} from 'lucide-react';
import type { VisitAlert, AppointmentType, Doctor, Appointment, ScheduleFormData } from '../../datapoints/scheduling';
import { APPOINTMENT_TYPE_LABELS, generateTimeSlots } from '../../datapoints/scheduling';
import type { Patient } from '../../datapoints/patients';
import { Button } from '../../components/controls/Button';
import { Select } from '../../components/controls/Select';
import { TextField } from '../../components/controls/TextField';
import { Textarea } from '../../components/controls/Textarea';
import { IconButton } from '../../components/controls/IconButton';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../../components/layout/Modal';

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
        icon={<Bell size={16} className="text-amber-500" />}
        onClose={onClose}
      />

      <ModalBody className="space-y-5">

        {/* ── Patient Information ── */}
        <section>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Patient Information</p>
          <div className="bg-muted/40 rounded-xl p-4 grid grid-cols-2 gap-y-3 gap-x-4">
            {[
              { label: 'Name',         value: patient.name },
              { label: 'MRN',          value: patient.mrn },
              { label: 'Contact',      value: patient.phone },
              { label: 'Date of Birth',value: formatDate(patient.dob) },
            ].map(r => (
              <div key={r.label}>
                <p className="text-xs text-muted-foreground">{r.label}</p>
                <p className="text-sm font-medium text-foreground mt-0.5">{r.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Alert Details ── */}
        <section>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Alert Details</p>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-sm font-semibold text-amber-900">{alert.alertType}</p>
            <p className={`text-sm mt-1 font-medium ${isOverdue ? 'text-destructive' : 'text-amber-700'}`}>
              Due: {formatDate(alert.dueDate)}{isOverdue && ' · Overdue'}
            </p>
          </div>
        </section>

        {/* ── Schedule Appointment ── */}
        <section>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Schedule Appointment</p>

          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 w-full px-4 py-3 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-colors text-sm font-medium"
            >
              <CalendarPlus size={16} />
              Schedule Appointment for {patient.name}
            </button>
          ) : (
            <div className="border border-border rounded-xl p-4 space-y-3">

              {/* Form title + collapse */}
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium text-foreground">New Appointment</p>
                <IconButton
                  icon={<ChevronUp size={15} />}
                  label="Collapse"
                  size="sm"
                  onClick={() => { setShowForm(false); setSchedErrors({}); }}
                />
              </div>

              {/* Visit Type */}
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Visit Type <span className="text-destructive">*</span>
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
                {schedErrors.type && <p className="text-xs text-destructive mt-1">{schedErrors.type}</p>}
              </div>

              {/* Doctor */}
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Doctor <span className="text-destructive">*</span>
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
                {schedErrors.doctorId && <p className="text-xs text-destructive mt-1">{schedErrors.doctorId}</p>}
              </div>

              {/* Date */}
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Date <span className="text-destructive">*</span>
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
                {schedErrors.date && <p className="text-xs text-destructive mt-1">{schedErrors.date}</p>}
              </div>

              {/* Time Slot */}
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Time Slot <span className="text-destructive">*</span>
                  {form.type && (
                    <span className="text-xs text-muted-foreground font-normal ml-1.5">
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
                {schedErrors.time && <p className="text-xs text-destructive mt-1">{schedErrors.time}</p>}
              </div>

              {/* Form actions */}
              <div className="flex gap-2 pt-1">
                <Button variant="ghost" size="sm" onClick={() => { setShowForm(false); setSchedErrors({}); }} className="flex-1">
                  Cancel
                </Button>
                <Button size="sm" onClick={handleConfirmSchedule} className="flex-1">
                  Confirm Appointment
                </Button>
              </div>
            </div>
          )}
        </section>

        {/* ── Send Reminder ── */}
        <section>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Send Reminder</p>

          {/* Channel pills */}
          <div className="flex gap-2 mb-3">
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

          <p className="text-xs text-muted-foreground mb-1.5">
            Sending to:{' '}
            <span className="font-medium text-foreground">{contact}</span>
          </p>

          <Textarea
            rows={channel === 'email' ? 6 : 4}
            value={message}
            onChange={e => { setMessage(e.target.value); setSent(false); }}
            className="mb-3"
          />

          {sent ? (
            <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-2.5">
              <CheckCircle2 size={16} className="shrink-0" />
              Reminder sent via {CHANNELS.find(c => c.id === channel)?.label} to {contact}
            </div>
          ) : (
            <button
              onClick={() => setSent(true)}
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 active:scale-[0.98] transition-all text-sm font-medium"
            >
              <Send size={14} />
              Send via {CHANNELS.find(c => c.id === channel)?.label}
            </button>
          )}
        </section>

      </ModalBody>

      <ModalFooter>
        <Button variant="ghost" size="sm" className="bg-muted hover:bg-muted/80 px-4" onClick={onClose}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
}

import { useState } from 'react';
import { Phone, MessageSquare, Mail, Send, CheckCircle2, Bell } from 'lucide-react';
import type { VisitAlert } from '../../datapoints/scheduling';
import type { Patient } from '../../datapoints/patients';
import { Button } from '../../components/controls/Button';
import { FormField } from '../../components/controls/FormField';
import { Textarea } from '../../components/controls/Textarea';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../../components/layout/Modal';

type Channel = 'sms' | 'whatsapp' | 'email';

interface Props {
  alert:   VisitAlert;
  patient: Patient;
  onClose: () => void;
}

const CHANNELS: { id: Channel; label: string; icon: React.ReactNode }[] = [
  { id: 'sms',      label: 'SMS',      icon: <Phone         size={13} /> },
  { id: 'whatsapp', label: 'WhatsApp', icon: <MessageSquare size={13} /> },
  { id: 'email',    label: 'Email',    icon: <Mail          size={13} /> },
];

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

export function SendReminderOverlay({ alert, patient, onClose }: Props) {
  const [channel, setChannel] = useState<Channel>('sms');
  const [message, setMessage] = useState(() => buildMessage('sms', patient, alert));
  const [sent,    setSent]    = useState(false);

  function switchChannel(c: Channel) {
    setChannel(c);
    setMessage(buildMessage(c, patient, alert));
    setSent(false);
  }

  const contact = channel === 'email' ? deriveEmail(patient) : patient.phone;

  return (
    <Modal onClose={onClose} overlayClassName="bg-black/50">
      <ModalHeader
        title="Send Reminder"
        icon={<Bell size={16} className="text-amber-500" />}
        onClose={onClose}
      />

      <ModalBody className="space-y-4">
        {/* Patient context */}
        <div className="bg-muted/40 rounded-xl px-4 py-3">
          <p className="text-sm font-semibold text-foreground">
            {patient.name}
            <span className="font-normal text-muted-foreground"> · {patient.mrn}</span>
          </p>
          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1 mt-2 inline-block">
            {alert.alertType}
          </p>
        </div>

        {/* Channel pills */}
        <FormField label="Send via" labelVariant="uppercase">
          <div className="flex gap-2">
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
        </FormField>

        {/* Contact */}
        <p className="text-xs text-muted-foreground">
          Sending to: <span className="font-medium text-foreground">{contact}</span>
        </p>

        {/* Message textarea */}
        <FormField label="Message" labelVariant="uppercase">
          <Textarea
            rows={channel === 'email' ? 8 : 4}
            value={message}
            onChange={e => { setMessage(e.target.value); setSent(false); }}
          />
        </FormField>

        {/* Send / Sent state */}
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
      </ModalBody>

      <ModalFooter>
        <Button variant="ghost" size="sm" className="bg-muted hover:bg-muted/80 px-4" onClick={onClose}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
}

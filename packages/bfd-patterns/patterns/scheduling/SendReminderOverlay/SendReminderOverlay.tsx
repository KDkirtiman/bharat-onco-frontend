import * as styles from './SendReminderOverlay.styles';
import { useState } from 'react';
import { Phone, MessageSquare, Mail, Send, CheckCircle2, Bell } from 'bfd-icons';
import type { VisitAlert } from 'bfd-core';
import type { Patient } from 'bfd-core';
import { Button } from 'bfd-core';
import { FormField } from 'bfd-core';
import { Textarea } from 'bfd-core';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'bfd-core';

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
        icon={<Bell size={16} className={styles.style1} />}
        onClose={onClose}
      />

      <ModalBody className={styles.style2}>
        {/* Patient context */}
        <div className={styles.style3}>
          <p className={styles.style4}>
            {patient.name}
            <span className={styles.style5}> · {patient.mrn}</span>
          </p>
          <p className={styles.style6}>
            {alert.alertType}
          </p>
        </div>

        {/* Channel pills */}
        <FormField label="Send via" labelVariant="uppercase">
          <div className={styles.style7}>
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
        <p className={styles.style8}>
          Sending to: <span className={styles.style9}>{contact}</span>
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
          <div className={styles.style10}>
            <CheckCircle2 size={16} className={styles.style11} />
            Reminder sent via {CHANNELS.find(c => c.id === channel)?.label} to {contact}
          </div>
        ) : (
          <button
            onClick={() => setSent(true)}
            className={styles.style12}
          >
            <Send size={14} />
            Send via {CHANNELS.find(c => c.id === channel)?.label}
          </button>
        )}
      </ModalBody>

      <ModalFooter>
        <Button variant="ghost" size="sm" className={styles.style13} onClick={onClose}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
}

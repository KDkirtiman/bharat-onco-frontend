import * as styles from './RecurrenceTab.styles';
import { useState } from 'react';
import { AlertTriangle, ClipboardList, Save } from 'bfd-icons';

import type { RecurrenceRecord, RecurrenceType } from 'bfd-core';

interface Props {
  patientId:       string;
  records:         RecurrenceRecord[];
  onRecordsChange: React.Dispatch<React.SetStateAction<RecurrenceRecord[]>>;
}

const RECURRENCE_TYPES: RecurrenceType[] = ['Local', 'Regional', 'Distant'];

const TYPE_ACTIVE: Record<RecurrenceType, string> = {
  Local:    'bg-orange-surface-soft text-white',
  Regional: 'bg-primary text-primary-foreground',
  Distant:  'bg-primary text-primary-foreground',
};
const TYPE_INACTIVE = 'bg-primary/10 text-primary';

export function RecurrenceTab({ patientId, records, onRecordsChange }: Props) {
  const latest = [...records].sort((a, b) => b.detectedDate.localeCompare(a.detectedDate))[0];
  const hasRecurrence = records.length > 0;

  const [detectedDate,     setDetectedDate]     = useState(latest?.detectedDate ?? '');
  const [site,             setSite]             = useState(latest?.site ?? '');
  const [type,             setType]             = useState<RecurrenceType>(
    (latest?.type as RecurrenceType) ?? 'Local',
  );
  const [imagingFindings,  setImagingFindings]  = useState(
    latest?.imagingFindings ?? latest?.notes ?? '',
  );
  const [biopsyConfirmed,  setBiopsyConfirmed]  = useState(latest?.biopsyConfirmed ?? false);

  function handleSave() {
    const record: RecurrenceRecord = {
      id:              `rec-${Date.now()}`,
      patientId,
      detectedDate:    detectedDate || new Date().toISOString().split('T')[0],
      site:            site.trim() || '—',
      type,
      imagingFindings: imagingFindings.trim() || undefined,
      biopsyConfirmed,
    };
    onRecordsChange(prev => [...prev, record]);
  }

  return (
    <div className={styles.style2}>
      <h2 className={styles.style3}>Recurrence</h2>

      {/* Alert banner */}
      {hasRecurrence && (
        <div className={styles.style4}>
          <AlertTriangle size={15} className={styles.style5} />
          Recurrence Documented — New treatment plan required
        </div>
      )}

      {/* Recurrence Details */}
      <div className={styles.style6}>
        <h3 className={styles.style7}>Recurrence Details</h3>

        <div className={styles.style8}>
          <div>
            <label className={styles.style9}>Recurrence Date</label>
            <input
              type="date"
              value={detectedDate}
              onChange={e => setDetectedDate(e.target.value)}
              className={styles.style10}
            />
          </div>
          <div>
            <label className={styles.style9}>Recurrence Site</label>
            <input
              type="text"
              value={site}
              onChange={e => setSite(e.target.value)}
              placeholder="e.g., Right lung, Liver, Mediastinal nodes"
              className={styles.style11}
            />
          </div>
        </div>

        {/* Recurrence Type */}
        <div>
          <label className={styles.style12}>Recurrence Type</label>
          <div className={styles.style13}>
            {RECURRENCE_TYPES.map(t => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={cn(
                  'flex-1 py-2.5 text-sm font-semibold transition-colors',
                  type === t ? TYPE_ACTIVE[t] : TYPE_INACTIVE,
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Imaging Findings */}
        <div>
          <label className={styles.style9}>Imaging Findings</label>
          <textarea
            rows={4}
            value={imagingFindings}
            onChange={e => setImagingFindings(e.target.value)}
            placeholder="Summary of CT/MRI/PET findings..."
            className={styles.style14}
          />
        </div>

        {/* Biopsy Confirmed */}
        <label className={styles.style15}>
          <input
            type="checkbox"
            checked={biopsyConfirmed}
            onChange={e => setBiopsyConfirmed(e.target.checked)}
            className={styles.style16}
          />
          <span className={styles.style17}>Biopsy Confirmed Recurrence</span>
        </label>
      </div>

      {/* Footer buttons */}
      <div className={styles.style18}>
        <button
          onClick={handleSave}
          className={styles.style19}
        >
          <ClipboardList size={16} />
          Create New Treatment Plan
        </button>
        <button
          onClick={handleSave}
          className={styles.style20}
        >
          <Save size={15} />
          Save
        </button>
      </div>
    </div>
  );
}

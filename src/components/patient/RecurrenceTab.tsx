import { useState } from 'react';
import { AlertTriangle, ClipboardList, Save } from 'lucide-react';
import { cn } from '../../lib/cn';
import type { RecurrenceRecord, RecurrenceType } from '../../datapoints/treatment';

interface Props {
  patientId:       string;
  records:         RecurrenceRecord[];
  onRecordsChange: React.Dispatch<React.SetStateAction<RecurrenceRecord[]>>;
}

const RECURRENCE_TYPES: RecurrenceType[] = ['Local', 'Regional', 'Distant'];

const TYPE_ACTIVE: Record<RecurrenceType, string> = {
  Local:    'bg-orange-500 text-white',
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
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-foreground">Recurrence</h2>

      {/* Alert banner */}
      {hasRecurrence && (
        <div className="flex items-center gap-2.5 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-sm font-medium text-amber-800">
          <AlertTriangle size={15} className="text-amber-500 shrink-0" />
          Recurrence Documented — New treatment plan required
        </div>
      )}

      {/* Recurrence Details */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-5">
        <h3 className="text-sm font-bold text-foreground">Recurrence Details</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Recurrence Date</label>
            <input
              type="date"
              value={detectedDate}
              onChange={e => setDetectedDate(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Recurrence Site</label>
            <input
              type="text"
              value={site}
              onChange={e => setSite(e.target.value)}
              placeholder="e.g., Right lung, Liver, Mediastinal nodes"
              className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>

        {/* Recurrence Type */}
        <div>
          <label className="block text-xs font-medium text-foreground mb-2">Recurrence Type</label>
          <div className="flex rounded-lg overflow-hidden border border-border">
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
          <label className="block text-xs font-medium text-foreground mb-1.5">Imaging Findings</label>
          <textarea
            rows={4}
            value={imagingFindings}
            onChange={e => setImagingFindings(e.target.value)}
            placeholder="Summary of CT/MRI/PET findings..."
            className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
          />
        </div>

        {/* Biopsy Confirmed */}
        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={biopsyConfirmed}
            onChange={e => setBiopsyConfirmed(e.target.checked)}
            className="w-4 h-4 accent-primary rounded"
          />
          <span className="text-sm text-foreground">Biopsy Confirmed Recurrence</span>
        </label>
      </div>

      {/* Footer buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors"
        >
          <ClipboardList size={16} />
          Create New Treatment Plan
        </button>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-3 text-sm font-semibold border border-border bg-card text-foreground rounded-xl hover:bg-muted/50 transition-colors"
        >
          <Save size={15} />
          Save
        </button>
      </div>
    </div>
  );
}

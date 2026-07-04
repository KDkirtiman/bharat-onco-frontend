import { useState } from 'react';
import { Plus, Layers, Pencil, ChevronDown, ChevronUp, History, Users } from 'lucide-react';
import { cn } from '../../lib/cn';
import type { CancerSite, CancerStaging } from '../../datapoints/staging';
import {
  STAGING_SITE_LABELS, CLASSIFICATION_LABELS, CLASSIFICATION_COLORS,
  GYNECOLOGIC_SITES, HEAD_NECK_SITES, STAGING_MODE_LABELS,
} from '../../datapoints/staging';
import type { TreatmentPlan } from '../../datapoints/treatment';
import { AddStagingOverlay } from '../../patterns/clinical/AddStagingOverlay';

interface Props {
  patientId:            string;
  cancerSite:           CancerSite;
  plans:                TreatmentPlan[];
  records:              CancerStaging[];
  onRecordsChange:      React.Dispatch<React.SetStateAction<CancerStaging[]>>;
  onDiagnosisUpdate?:   (stage: string) => void;
  seedRecord?:          CancerStaging; // pre-fill Add form with this record (follow-up mode)
}

function fmtDate(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function fmtDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function StagingCard({
  record, onEdit,
}: {
  record: CancerStaging;
  onEdit: () => void;
}) {
  const [showHistory, setShowHistory] = useState(false);
  const isTnm = !record.stagingMode || record.stagingMode === 'tnm';
  const tCode = record.t ? record.t.split(' — ')[0] : null;
  const nCode = record.n ? record.n.split(' — ')[0] : null;
  const mCode = record.m ? record.m.split(' — ')[0] : null;
  const displayStage = record.stageOverride || record.stageGroup;
  const showFigo     = (GYNECOLOGIC_SITES as CancerSite[]).includes(record.cancerSite);
  const showEne      = (HEAD_NECK_SITES   as CancerSite[]).includes(record.cancerSite);
  const hasHistory   = !!(record.editHistory?.length);

  return (
    <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {record.stagingMode && record.stagingMode !== 'tnm' ? (
            <span className="text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
              {STAGING_MODE_LABELS[record.stagingMode]}
            </span>
          ) : record.classType ? (
            <span className={cn('text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full', CLASSIFICATION_COLORS[record.classType])}>
              {record.classType}
            </span>
          ) : null}
          {record.edition && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
              TNM {record.edition}
            </span>
          )}
          {record.flaggedForTumorBoard && (
            <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full bg-amber-100 text-amber-700">
              <Users size={10} /> Tumor Board
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{fmtDate(record.date)}</span>
          <button
            onClick={onEdit}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-primary border border-primary/30 rounded-lg hover:bg-primary/5 transition-colors"
          >
            <Pencil size={11} /> Edit
          </button>
        </div>
      </div>

      {/* T / N / M chips — TNM mode only */}
      {isTnm && (
        <>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'T — Tumour',   value: tCode },
              { label: 'N — Nodes',    value: nCode },
              { label: 'M — Metast.',  value: mCode },
            ].map(chip => (
              <div key={chip.label} className="bg-muted/50 border border-border rounded-xl p-3 text-center">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">{chip.label}</p>
                <p className="text-base font-bold text-foreground">{chip.value ?? '—'}</p>
              </div>
            ))}
          </div>

          {/* Stage Group badge */}
          <div className="flex justify-center">
            <div className={cn(
              'px-8 py-3 rounded-xl border text-center',
              displayStage ? 'bg-primary/10 border-primary/20' : 'bg-muted border-border',
            )}>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Stage Group</p>
              <p className={cn('text-2xl font-bold', displayStage ? 'text-primary' : 'text-muted-foreground')}>
                {displayStage ?? '?'}
              </p>
              {record.stageOverride && record.stageGroup && record.stageOverride !== record.stageGroup && (
                <p className="text-[10px] text-muted-foreground mt-0.5">Auto: {record.stageGroup}</p>
              )}
            </div>
          </div>
        </>
      )}

      {showFigo && record.figo && (
        <div className="flex items-center gap-3 pt-1">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">FIGO:</span>
          <span className="text-sm font-semibold text-foreground">{record.figo}</span>
        </div>
      )}

      {showEne && record.ene && (
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">ENE:</span>
          <span className={cn(
            'text-xs px-2 py-0.5 rounded-full font-semibold',
            record.ene === 'positive' ? 'bg-destructive/10 text-destructive' : 'bg-muted text-muted-foreground',
          )}>
            ENE({record.ene === 'positive' ? '+' : '–'})
          </span>
        </div>
      )}

      {record.notes && (
        <p className="text-xs text-muted-foreground italic border-t border-border pt-3">{record.notes}</p>
      )}

      {/* Edit History toggle */}
      {hasHistory && (
        <div className="border-t border-border pt-3">
          <button
            onClick={() => setShowHistory(h => !h)}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            <History size={13} />
            Edit History ({record.editHistory!.length})
            {showHistory ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>

          {showHistory && (
            <div className="mt-3 space-y-3">
              {[...record.editHistory!].reverse().map((entry, idx) => {
                const snap = entry.snapshot;
                const sDisplayStage = snap.stageOverride || snap.stageGroup;
                return (
                  <div key={idx} className="bg-muted/30 border border-border rounded-xl p-3 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                        Version before {fmtDateTime(entry.editedAt)}
                      </span>
                      {snap.classType && (
                        <span className={cn('text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full', CLASSIFICATION_COLORS[snap.classType])}>
                          {snap.classType}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {snap.t ? snap.t.split(' — ')[0] : '—'} · {snap.n ? snap.n.split(' — ')[0] : '—'} · {snap.m ? snap.m.split(' — ')[0] : '—'}
                      {sDisplayStage && <span className="ml-2 text-primary font-medium">{sDisplayStage}</span>}
                    </p>
                    <p className="text-[10px] text-muted-foreground">Dated: {fmtDate(snap.date)}</p>
                    {snap.notes && <p className="text-[10px] text-muted-foreground italic">{snap.notes}</p>}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function CancerStagingTab({ patientId, cancerSite, plans, records, onRecordsChange, onDiagnosisUpdate, seedRecord }: Props) {
  const [addOpen,    setAddOpen]    = useState(false);
  const [editRecord, setEditRecord] = useState<CancerStaging | null>(null);

  const sorted  = [...records].sort((a, b) => b.date.localeCompare(a.date));
  const current = sorted[0];
  const history = sorted.slice(1);

  function handleSave(record: CancerStaging) {
    const stage = record.stageOverride || record.stageGroup;
    if (editRecord) {
      onRecordsChange(prev => prev.map(r => r.id === record.id ? record : r));
      setEditRecord(null);
    } else {
      onRecordsChange(prev => [record, ...prev]);
      setAddOpen(false);
    }
    if (stage) onDiagnosisUpdate?.(stage);
  }

  return (
    <>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Site: <span className="text-foreground font-medium normal-case">{STAGING_SITE_LABELS[cancerSite]}</span>
          </p>
          <button onClick={() => setAddOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
            <Plus size={15} /> Add Staging
          </button>
        </div>

        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Layers size={36} className="text-muted-foreground/40 mb-3" />
            <p className="text-sm font-medium text-muted-foreground">No staging records</p>
            <p className="text-xs text-muted-foreground mt-1">Click "+ Add Staging" to record the first entry.</p>
          </div>
        ) : (
          <>
            {/* Current staging */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Current Staging</p>
              <StagingCard
                record={current}
                onEdit={() => setEditRecord(current)}
              />
            </div>

            {/* History timeline */}
            {history.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">Staging History</p>
                <div className="relative ml-4">
                  {history.map((record, idx) => {
                    const tCode = record.t ? record.t.split(' — ')[0] : null;
                    const nCode = record.n ? record.n.split(' — ')[0] : null;
                    const mCode = record.m ? record.m.split(' — ')[0] : null;
                    const displayStage = record.stageOverride || record.stageGroup;
                    return (
                      <div key={record.id} className="relative pl-6 mb-4 last:mb-0">
                        {idx < history.length - 1 && (
                          <span className="absolute left-0 top-3 bottom-0 border-l-2 border-border" />
                        )}
                        <span className="absolute left-0 top-3 -translate-x-1/2 w-3 h-3 rounded-full bg-primary border-2 border-background" />

                        <div className="bg-card border border-border rounded-xl p-4 space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-semibold text-foreground">{fmtDate(record.date)}</span>
                            <div className="flex items-center gap-2">
                              {record.classType && (
                                <span className={cn('text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full', CLASSIFICATION_COLORS[record.classType])}>
                                  {CLASSIFICATION_LABELS[record.classType].split(' ')[0]}
                                </span>
                              )}
                              <button
                                onClick={() => setEditRecord(record)}
                                className="flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-primary border border-primary/30 rounded-lg hover:bg-primary/5 transition-colors"
                              >
                                <Pencil size={10} /> Edit
                              </button>
                            </div>
                          </div>
                          {(tCode || nCode || mCode) && (
                            <p className="text-sm text-muted-foreground">
                              {[tCode, nCode, mCode].filter(Boolean).join(' · ')}
                            </p>
                          )}
                          {displayStage && (
                            <span className="inline-block text-xs bg-primary/10 text-primary rounded-md px-2 py-0.5 font-medium">
                              {displayStage}
                            </span>
                          )}
                          {record.notes && (
                            <p className="text-xs text-muted-foreground italic">{record.notes}</p>
                          )}
                          {record.editHistory?.length && (
                            <p className="text-[10px] text-muted-foreground">Edited {record.editHistory.length} time(s)</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {(addOpen || editRecord) && (
        <AddStagingOverlay
          patientId={patientId}
          defaultSite={cancerSite}
          plans={plans}
          initialRecord={editRecord ?? (addOpen ? seedRecord : undefined)}
          prefill={!editRecord && addOpen && !!seedRecord}
          onSave={handleSave}
          onClose={() => { setAddOpen(false); setEditRecord(null); }}
        />
      )}
    </>
  );
}

import * as styles from './CancerStagingTab.styles';
import { useState } from 'react';
import { Plus, Layers, Pencil, ChevronDown, ChevronUp, History, Users } from 'bfd-icons';

import type { CancerSite, CancerStaging } from 'bfd-core';
import {
  STAGING_SITE_LABELS, CLASSIFICATION_LABELS, CLASSIFICATION_COLORS,
  GYNECOLOGIC_SITES, HEAD_NECK_SITES, STAGING_MODE_LABELS,
} from 'bfd-core';
import type { TreatmentPlan } from 'bfd-core';
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
    <div className={styles.style6}>
      {/* Header row */}
      <div className={styles.style7}>
        <div className={styles.style8}>
          {record.stagingMode && record.stagingMode !== 'tnm' ? (
            <span className={styles.style9}>
              {STAGING_MODE_LABELS[record.stagingMode]}
            </span>
          ) : record.classType ? (
            <span className={styles.style1Class(CLASSIFICATION_COLORS[record.classType])}>
              {record.classType}
            </span>
          ) : null}
          {record.edition && (
            <span className={styles.style10}>
              TNM {record.edition}
            </span>
          )}
          {record.flaggedForTumorBoard && (
            <span className={styles.style11}>
              <Users size={10} /> Tumor Board
            </span>
          )}
        </div>
        <div className={styles.style8}>
          <span className={styles.style12}>{fmtDate(record.date)}</span>
          <button
            onClick={onEdit}
            className={styles.style13}
          >
            <Pencil size={11} /> Edit
          </button>
        </div>
      </div>

      {/* T / N / M chips — TNM mode only */}
      {isTnm && (
        <>
          <div className={styles.style14}>
            {[
              { label: 'T — Tumour',   value: tCode },
              { label: 'N — Nodes',    value: nCode },
              { label: 'M — Metast.',  value: mCode },
            ].map(chip => (
              <div key={chip.label} className={styles.style15}>
                <p className={styles.style16}>{chip.label}</p>
                <p className={styles.style17}>{chip.value ?? '—'}</p>
              </div>
            ))}
          </div>

          {/* Stage Group badge */}
          <div className={styles.style18}>
            <div className={cn(
              'px-8 py-3 rounded-xl border text-center',
              displayStage ? 'bg-primary/10 border-primary/20' : 'bg-muted border-border',
            )}>
              <p className={styles.style19}>Stage Group</p>
              <p className={styles.style3Class(displayStage ? 'text-primary' : 'text-muted-foreground')}>
                {displayStage ?? '?'}
              </p>
              {record.stageOverride && record.stageGroup && record.stageOverride !== record.stageGroup && (
                <p className={styles.style20}>Auto: {record.stageGroup}</p>
              )}
            </div>
          </div>
        </>
      )}

      {showFigo && record.figo && (
        <div className={styles.style21}>
          <span className={styles.style22}>FIGO:</span>
          <span className={styles.style23}>{record.figo}</span>
        </div>
      )}

      {showEne && record.ene && (
        <div className={styles.style8}>
          <span className={styles.style22}>ENE:</span>
          <span className={cn(
            'text-xs px-2 py-0.5 rounded-full font-semibold',
            record.ene === 'positive' ? 'bg-destructive/10 text-destructive' : 'bg-muted text-muted-foreground',
          )}>
            ENE({record.ene === 'positive' ? '+' : '–'})
          </span>
        </div>
      )}

      {record.notes && (
        <p className={styles.style24}>{record.notes}</p>
      )}

      {/* Edit History toggle */}
      {hasHistory && (
        <div className={styles.style25}>
          <button
            onClick={() => setShowHistory(h => !h)}
            className={styles.style26}
          >
            <History size={13} />
            Edit History ({record.editHistory!.length})
            {showHistory ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>

          {showHistory && (
            <div className={styles.style27}>
              {[...record.editHistory!].reverse().map((entry, idx) => {
                const snap = entry.snapshot;
                const sDisplayStage = snap.stageOverride || snap.stageGroup;
                return (
                  <div key={idx} className={styles.style28}>
                    <div className={styles.style29}>
                      <span className={styles.style30}>
                        Version before {fmtDateTime(entry.editedAt)}
                      </span>
                      {snap.classType && (
                        <span className={styles.style5Class(CLASSIFICATION_COLORS[snap.classType])}>
                          {snap.classType}
                        </span>
                      )}
                    </div>
                    <p className={styles.style12}>
                      {snap.t ? snap.t.split(' — ')[0] : '—'} · {snap.n ? snap.n.split(' — ')[0] : '—'} · {snap.m ? snap.m.split(' — ')[0] : '—'}
                      {sDisplayStage && <span className={styles.style31}>{sDisplayStage}</span>}
                    </p>
                    <p className={styles.style32}>Dated: {fmtDate(snap.date)}</p>
                    {snap.notes && <p className={styles.style33}>{snap.notes}</p>}
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
      <div className={styles.style34}>
        {/* Header */}
        <div className={styles.style35}>
          <p className={styles.style22}>
            Site: <span className={styles.style36}>{STAGING_SITE_LABELS[cancerSite]}</span>
          </p>
          <button onClick={() => setAddOpen(true)}
            className={styles.style37}>
            <Plus size={15} /> Add Staging
          </button>
        </div>

        {sorted.length === 0 ? (
          <div className={styles.style38}>
            <Layers size={36} className={styles.style39} />
            <p className={styles.style40}>No staging records</p>
            <p className={styles.style41}>Click "+ Add Staging" to record the first entry.</p>
          </div>
        ) : (
          <>
            {/* Current staging */}
            <div>
              <p className={styles.style42}>Current Staging</p>
              <StagingCard
                record={current}
                onEdit={() => setEditRecord(current)}
              />
            </div>

            {/* History timeline */}
            {history.length > 0 && (
              <div>
                <p className={styles.style43}>Staging History</p>
                <div className={styles.style44}>
                  {history.map((record, idx) => {
                    const tCode = record.t ? record.t.split(' — ')[0] : null;
                    const nCode = record.n ? record.n.split(' — ')[0] : null;
                    const mCode = record.m ? record.m.split(' — ')[0] : null;
                    const displayStage = record.stageOverride || record.stageGroup;
                    return (
                      <div key={record.id} className={styles.style45}>
                        {idx < history.length - 1 && (
                          <span className={styles.style46} />
                        )}
                        <span className={styles.style47} />

                        <div className={styles.style48}>
                          <div className={styles.style29}>
                            <span className={styles.style49}>{fmtDate(record.date)}</span>
                            <div className={styles.style8}>
                              {record.classType && (
                                <span className={styles.style5Class(CLASSIFICATION_COLORS[record.classType])}>
                                  {CLASSIFICATION_LABELS[record.classType].split(' ')[0]}
                                </span>
                              )}
                              <button
                                onClick={() => setEditRecord(record)}
                                className={styles.style50}
                              >
                                <Pencil size={10} /> Edit
                              </button>
                            </div>
                          </div>
                          {(tCode || nCode || mCode) && (
                            <p className={styles.style51}>
                              {[tCode, nCode, mCode].filter(Boolean).join(' · ')}
                            </p>
                          )}
                          {displayStage && (
                            <span className={styles.style52}>
                              {displayStage}
                            </span>
                          )}
                          {record.notes && (
                            <p className={styles.style53}>{record.notes}</p>
                          )}
                          {record.editHistory?.length && (
                            <p className={styles.style32}>Edited {record.editHistory.length} time(s)</p>
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

import * as styles from './AddStagingOverlay.styles';
import { useState } from 'react';

import type { CancerSite, ClassificationType, CancerStaging, StagingEditEntry, TnmEdition, StagingMode } from 'bfd-core';
import {
  STAGING_SITE_LABELS, CLASSIFICATION_LABELS,
  getSiteDescriptors, GYNECOLOGIC_SITES, HEAD_NECK_SITES,
  FIGO_OPTIONS, getStageLookup, TNM_EDITION_LABELS, STAGING_MODE_LABELS,
} from 'bfd-core';
import type { TreatmentPlan } from 'bfd-core';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'bfd-core';
import { Button } from 'bfd-core';
import { FormField } from 'bfd-core';
import { Select } from 'bfd-core';
import { TextField } from 'bfd-core';
import { Textarea } from 'bfd-core';
import { Callout } from 'bfd-core';

const ALL_SITES = Object.keys(STAGING_SITE_LABELS) as CancerSite[];
const ALL_CLASS = Object.keys(CLASSIFICATION_LABELS) as ClassificationType[];

interface Props {
  patientId:      string;
  defaultSite:    CancerSite;
  plans:          TreatmentPlan[];
  initialRecord?: CancerStaging;
  prefill?:       boolean; // when true + initialRecord set: pre-fill form but create a new record on save
  onSave:         (record: CancerStaging) => void;
  onClose:        () => void;
}

export function AddStagingOverlay({ patientId, defaultSite, plans, initialRecord, prefill, onSave, onClose }: Props) {
  const today    = new Date().toISOString().split('T')[0];
  const isEdit   = !!initialRecord && !prefill;

  const [stagingMode,   setStagingMode]   = useState<StagingMode>(initialRecord?.stagingMode ?? 'tnm');
  const [site,          setSite]          = useState<CancerSite>(initialRecord?.cancerSite ?? defaultSite);
  const [edition,       setEdition]       = useState<TnmEdition | null>(initialRecord?.edition ?? null);
  const [classType,     setClassType]     = useState<ClassificationType>(initialRecord?.classType ?? 'cTNM');
  const [date,          setDate]          = useState(initialRecord?.date ?? today);
  const [t,             setT]             = useState(initialRecord?.t ?? '');
  const [n,             setN]             = useState(initialRecord?.n ?? '');
  const [m,             setM]             = useState(initialRecord?.m ?? '');
  const [stageOverride, setStageOverride] = useState(initialRecord?.stageOverride ?? '');
  const [figo,          setFigo]          = useState(initialRecord?.figo ?? '');
  const [ene,           setEne]           = useState<'positive' | 'negative' | ''>(initialRecord?.ene ?? '');
  const [planId,              setPlanId]              = useState(initialRecord?.planId ?? '');
  const [notes,               setNotes]               = useState(initialRecord?.notes ?? '');
  const [flaggedForTumorBoard, setFlaggedForTumorBoard] = useState(initialRecord?.flaggedForTumorBoard ?? false);

  const descriptors  = getSiteDescriptors(site, edition ?? '8th');
  const autoStage    = t && n && m ? getStageLookup(site, t, n, m) : null;
  const showFigo     = (GYNECOLOGIC_SITES as CancerSite[]).includes(site);
  const showEne      = (edition === '8th' || edition === '9th') && (HEAD_NECK_SITES as CancerSite[]).includes(site) && n && !n.startsWith('N0 ') && n !== '';
  const showPlan     = classType === 'ypTNM';

  const nCode = n.split(' — ')[0].trim();
  const showEneActual = showEne && nCode !== 'N0' && nCode !== 'NX' && n !== '';

  const figoOpts = showFigo
    ? FIGO_OPTIONS[site as 'cervix' | 'ovarian']
    : [];

  function handleSiteChange(newSite: CancerSite) {
    setSite(newSite);
    setT(''); setN(''); setM('');
    setFigo(''); setEne('');
  }

  function handleEditionChange(newEdition: TnmEdition) {
    setEdition(newEdition);
    setT(''); setN(''); setM('');
  }

  const isTnmMode = stagingMode === 'tnm';
  const canSave = site && date && (isTnmMode ? (edition && classType && t && n && m) : true);

  function handleSave() {
    if (!canSave) return;
    const now = new Date().toISOString();

    let history: StagingEditEntry[] = initialRecord?.editHistory ?? [];
    if (isEdit && initialRecord) {
      const snap: StagingEditEntry = {
        editedAt: now,
        snapshot: {
          classType:     initialRecord.classType ?? 'cTNM',
          edition:       initialRecord.edition ?? '8th',
          date:          initialRecord.date ?? '',
          t:             initialRecord.t ?? '',
          n:             initialRecord.n ?? '',
          m:             initialRecord.m ?? '',
          stageGroup:    initialRecord.stageGroup ?? null,
          stageOverride: initialRecord.stageOverride,
          figo:          initialRecord.figo,
          ene:           initialRecord.ene,
          planId:        initialRecord.planId,
          notes:         initialRecord.notes,
        },
      };
      history = [...history, snap];
    }

    onSave({
      id:             isEdit ? initialRecord!.id : `cs-${Date.now()}`,
      patientId,
      cancerSite:     site,
      stagingMode,
      classType:      isTnmMode ? classType : undefined,
      edition:        isTnmMode ? (edition ?? undefined) : undefined,
      date,
      t:              isTnmMode ? t : undefined,
      n:              isTnmMode ? n : undefined,
      m:              isTnmMode ? m : undefined,
      stageGroup:     isTnmMode ? (stageOverride.trim() || autoStage) : undefined,
      stageOverride:  isTnmMode ? (stageOverride.trim() || undefined) : undefined,
      figo:           isTnmMode && showFigo && figo ? figo : undefined,
      ene:            isTnmMode && showEneActual && ene ? ene : undefined,
      planId:         isTnmMode && showPlan && planId ? planId : undefined,
      notes:                notes.trim() || undefined,
      flaggedForTumorBoard: flaggedForTumorBoard || undefined,
      editHistory:          history.length > 0 ? history : undefined,
    });
  }

  return (
    <Modal onClose={onClose} size="lg" className={styles.style6} overlayClassName="bg-black/50">
      <ModalHeader title={isEdit ? 'Edit Cancer Staging' : 'Add Cancer Staging'} onClose={onClose} />

      <ModalBody className={styles.style7}>
          {/* Staging Mode */}
          <FormField label="Staging Mode" labelVariant="uppercase" required>
            <div className={styles.style8}>
              {(Object.keys(STAGING_MODE_LABELS) as StagingMode[]).map(mode => (
                <label key={mode} className={cn(
                  'flex items-center gap-2 px-3 py-2.5 rounded-xl border cursor-pointer transition-colors',
                  stagingMode === mode
                    ? 'border-primary bg-primary/5 text-primary font-semibold'
                    : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground',
                )}>
                  <input type="radio" name="stagingMode" value={mode} checked={stagingMode === mode}
                    onChange={() => setStagingMode(mode)} className={styles.style9} />
                  <span className={styles.style10}>{STAGING_MODE_LABELS[mode]}</span>
                </label>
              ))}
            </div>
          </FormField>

          {/* Cancer Site */}
          <FormField label="Cancer Site" labelVariant="uppercase" required>
            <Select value={site} onChange={e => handleSiteChange(e.target.value as CancerSite)}>
              {ALL_SITES.map(s => <option key={s} value={s}>{STAGING_SITE_LABELS[s]}</option>)}
            </Select>
          </FormField>

          {/* Date (always shown) */}
          <FormField label="Date" labelVariant="uppercase" required>
            <TextField type="date" value={date} onChange={e => setDate(e.target.value)} />
          </FormField>

          {/* Non-TNM mode: just notes */}
          {!isTnmMode && (
            <Callout variant="warning">
              {STAGING_MODE_LABELS[stagingMode]} — TNM descriptors are not applicable. Add notes below if needed.
            </Callout>
          )}

          {/* TNM-only fields */}
          {isTnmMode && <>
            {/* TNM Edition — must be selected before anything else */}
            <FormField label="TNM Edition" labelVariant="uppercase" required>
              <div className={styles.style11}>
                {([
                  { ed: '9th' as TnmEdition, years: '2024–present', note: 'Current' },
                  { ed: '8th' as TnmEdition, years: '2017–2023',    note: '' },
                  { ed: '7th' as TnmEdition, years: '2010–2016',    note: 'Legacy' },
                ]).map(({ ed, years, note }) => (
                  <label key={ed} className={cn(
                    'flex flex-col items-center gap-0.5 px-3 py-2.5 rounded-xl border cursor-pointer transition-colors text-center',
                    edition === ed
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground',
                  )}>
                    <input type="radio" name="edition" value={ed} checked={edition === ed}
                      onChange={() => handleEditionChange(ed)} className={styles.style9} />
                    <span className={styles.style12}>{ed}</span>
                    <span className={styles.style13}>{years}</span>
                    {note && <span className={styles.style3Class(note === 'Current' ? 'bg-success-soft text-success-emphasis' : 'bg-muted text-muted-foreground'
                    )}>{note}</span>}
                  </label>
                ))}
              </div>
              {!edition && (
                <p className={styles.style14}>Select an edition to continue</p>
              )}
            </FormField>

            {/* All TNM fields gated on edition selection */}
            {edition && <>
              {/* Classification */}
              <FormField label="Classification" labelVariant="uppercase" required>
                <Select value={classType} onChange={e => setClassType(e.target.value as ClassificationType)}>
                  {ALL_CLASS.map(c => <option key={c} value={c}>{c}</option>)}
                </Select>
              </FormField>

              {/* T / N / M */}
              <div className={styles.style15}>
                <FormField label="T — Primary Tumour" labelVariant="uppercase" required>
                  <Select value={t} onChange={e => setT(e.target.value)}>
                    <option value="">Select T descriptor…</option>
                    {descriptors.t.map(d => <option key={d} value={d}>{d}</option>)}
                  </Select>
                </FormField>
                <FormField label="N — Regional Lymph Nodes" labelVariant="uppercase" required>
                  <Select value={n} onChange={e => setN(e.target.value)}>
                    <option value="">Select N descriptor…</option>
                    {descriptors.n.map(d => <option key={d} value={d}>{d}</option>)}
                  </Select>
                </FormField>
                <FormField label="M — Distant Metastasis" labelVariant="uppercase" required>
                  <Select value={m} onChange={e => setM(e.target.value)}>
                    <option value="">Select M descriptor…</option>
                    {descriptors.m.map(d => <option key={d} value={d}>{d}</option>)}
                  </Select>
                </FormField>
              </div>

              {/* Auto Stage */}
              <div className={styles.style16}>
                <FormField label="Auto Stage Group" labelVariant="uppercase">
                  <div className={cn(
                    'px-4 py-2 rounded-lg border text-sm font-bold',
                    autoStage
                      ? 'bg-primary/10 text-primary border-primary/20'
                      : 'bg-muted text-muted-foreground border-border',
                  )}>
                    {autoStage ?? (t && n && m ? '?' : '—')}
                  </div>
                </FormField>
                <FormField label="Override Stage Group" labelVariant="uppercase" className={styles.style17}>
                  <TextField value={stageOverride} onChange={e => setStageOverride(e.target.value)}
                    placeholder={autoStage ?? 'e.g. Stage IIA'} />
                </FormField>
              </div>

              {/* FIGO (gynecologic only) */}
              {showFigo && (
                <div className={styles.style18}>
                  <p className={styles.style19}>
                    FIGO Staging (parallel)
                  </p>
                  <FormField label="FIGO Stage" labelVariant="uppercase">
                    <Select value={figo} onChange={e => setFigo(e.target.value)}>
                      <option value="">Select FIGO stage…</option>
                      {figoOpts.map(f => <option key={f} value={f}>{f}</option>)}
                    </Select>
                  </FormField>
                </div>
              )}

              {/* ENE (H&N only, when N > N0) */}
              {showEneActual && (
                <div className={styles.style18}>
                  <p className={styles.style19}>
                    Extranodal Extension (ENE)
                  </p>
                  <div className={styles.style20}>
                    {(['negative', 'positive'] as const).map(v => (
                      <label key={v} className={styles.style21}>
                        <input type="radio" name="ene" value={v} checked={ene === v} onChange={() => setEne(v)}
                          className={styles.style22} />
                        <span className={styles.style5Class(v === 'positive' ? 'text-destructive' : 'text-foreground')}>
                          ENE({v === 'positive' ? '+' : '–'})
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Linked Plan (ypTNM only) */}
              {showPlan && (
                <div className={styles.style18}>
                  <p className={styles.style19}>
                    Post-therapy — Link Treatment Plan
                  </p>
                  <FormField label="Linked Treatment Plan" labelVariant="uppercase">
                    <Select value={planId} onChange={e => setPlanId(e.target.value)}>
                      <option value="">Select plan (optional)…</option>
                      {plans.map(p => <option key={p.id} value={p.id}>{p.regimen}</option>)}
                    </Select>
                  </FormField>
                </div>
              )}
            </> /* end edition-gated */}
          </> /* end tnm-mode */}

          {/* Notes (always visible) */}
          <FormField label="Notes" labelVariant="uppercase">
            <Textarea rows={2} value={notes} onChange={e => setNotes(e.target.value)}
              placeholder="Clinical context, staging method, additional notes…" />
          </FormField>

          {/* Tumor Board Flag (always visible) */}
          <div className={styles.style18}>
            <label className={styles.style23}>
              <input
                type="checkbox"
                checked={flaggedForTumorBoard}
                onChange={e => setFlaggedForTumorBoard(e.target.checked)}
                className={styles.style24}
              />
              <div>
                <span className={styles.style25}>
                  Flag for Tumor Board Review
                </span>
                <p className={styles.style26}>
                  This case will appear in the Tumor Board Review queue for multidisciplinary discussion.
                </p>
              </div>
            </label>
          </div>
      </ModalBody>

      <ModalFooter>
        <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
        <Button size="sm" onClick={handleSave} disabled={!canSave}>
          {isEdit ? 'Update Staging' : 'Save Staging'}
        </Button>
      </ModalFooter>
    </Modal>
  );
}

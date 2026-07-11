import * as styles from './TreatmentPlanTab.styles';
import { useState } from 'react';
import { Plus, FlaskConical, Radiation, Scissors, ClipboardList, Pencil, ChevronDown, ChevronUp, History } from 'bfd-icons';

import type { TreatmentPlan, PlanModality } from 'bfd-core';
import { TREATMENT_STATUS_LABELS, TREATMENT_STATUS_COLORS } from 'bfd-core';
import { AddTreatmentPlanOverlay } from '../../patterns/clinical/AddTreatmentPlanOverlay';

interface Props {
  patientId:       string;
  plans:           TreatmentPlan[];
  onPlansChange:   React.Dispatch<React.SetStateAction<TreatmentPlan[]>>;
  patientBsa?:     number;
  patientWeightKg?: number;
  seedPlan?:       TreatmentPlan; // pre-fill Add form with this plan (follow-up mode)
}

type SubTab = PlanModality;

const SUB_TABS: { id: SubTab; label: string; icon: React.ReactNode }[] = [
  { id: 'chemotherapy', label: 'Chemotherapy', icon: <FlaskConical size={14} /> },
  { id: 'radiotherapy', label: 'Radiotherapy', icon: <Radiation size={14} /> },
  { id: 'surgery',      label: 'Surgery',       icon: <Scissors size={14} /> },
];

function InfoGrid({ items }: { items: { label: string; value: React.ReactNode }[] }) {
  return (
    <div className={styles.style4}>
      {items.map(({ label, value }) => (
        <div key={label}>
          <p className={styles.style5}>{label}</p>
          <p className={styles.style6}>{value ?? '—'}</p>
        </div>
      ))}
    </div>
  );
}

function fmtDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function EditHistoryBlock({ plan }: { plan: TreatmentPlan }) {
  const [open, setOpen] = useState(false);
  if (!plan.editHistory?.length) return null;
  return (
    <div className={styles.style7}>
      <button
        onClick={() => setOpen(o => !o)}
        className={styles.style8}
      >
        <History size={13} />
        Version History ({plan.editHistory.length})
        {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
      </button>
      {open && (
        <div className={styles.style9}>
          {[...plan.editHistory].reverse().map((entry, idx) => {
            const s = entry.snapshot;
            return (
              <div key={idx} className={styles.style10}>
                <div className={styles.style11}>
                  <span className={styles.style12}>
                    Version before {fmtDateTime(entry.editedAt)}
                  </span>
                  <span className={styles.style1Class(TREATMENT_STATUS_COLORS[s.status])}>
                    {TREATMENT_STATUS_LABELS[s.status]}
                  </span>
                </div>
                <p className={styles.style13}>{s.regimen}</p>
                <p className={styles.style14}>{s.protocol} · {s.intent} · Start: {fmtDate(s.startDate)}</p>
                {s.cancerType && <p className={styles.style14}>{s.cancerType} — {s.stage}</p>}
                {s.notes && <p className={styles.style15}>{s.notes}</p>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ChemoPlanCard({ plan, onEdit, patientBsa, patientWeightKg }: { plan: TreatmentPlan; onEdit: () => void; patientBsa?: number; patientWeightKg?: number }) {
  const c = plan.chemoDetails;
  return (
    <div className={styles.style16}>
      <div className={styles.style17}>
        <div>
          <h3 className={styles.style18}>{plan.regimen}</h3>
          <p className={styles.style19}>{plan.protocol}</p>
        </div>
        <div className={styles.style20}>
          <span className={styles.style21}>{plan.intent}</span>
          <span className={styles.style2Class(TREATMENT_STATUS_COLORS[plan.status])}>
            {TREATMENT_STATUS_LABELS[plan.status]}
          </span>
          <button onClick={onEdit} className={styles.style22}>
            <Pencil size={11} /> Edit
          </button>
        </div>
      </div>

      <div className={styles.style23}>
        <InfoGrid items={[
          { label: 'Cancer Type',       value: plan.cancerType },
          { label: 'Stage',             value: plan.stage },
          { label: 'Cycles Planned',    value: c ? `${c.cyclesPlanned} cycles` : undefined },
          { label: 'Cycle Duration',    value: c ? `${c.cycleDurationDays} days` : undefined },
          { label: 'Start Date',        value: fmtDate(plan.startDate) },
          { label: 'End Date',          value: plan.endDate ? fmtDate(plan.endDate) : undefined },
        ]} />
      </div>

      {c && c.drugs.length > 0 && (
        <div className={styles.style7}>
          <p className={styles.style24}>Drugs</p>
          <div className={styles.style25}>
            <table className={styles.style26}>
              <thead>
                <tr className={styles.style27}>
                  {['Drug', 'Dose', 'Unit', 'Final Dose', 'Route', 'Day of Cycle'].map(h => (
                    <th key={h} className={styles.style28}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {c.drugs.map((d, i) => {
                  const finalDose = d.calculatedDose
                    ?? (d.unit === 'mg/m²' && patientBsa && d.dose
                        ? parseFloat((parseFloat(d.dose) * patientBsa).toFixed(1))
                        : d.unit === 'mg/kg' && patientWeightKg && d.dose
                        ? parseFloat((parseFloat(d.dose) * patientWeightKg).toFixed(1))
                        : null);
                  return (
                    <tr key={i} className={styles.style29}>
                      <td className={styles.style30}>{d.name}</td>
                      <td className={styles.style31}>{d.dose}</td>
                      <td className={styles.style32}>{d.unit}</td>
                      <td className={styles.style33}>
                        {finalDose != null ? `${finalDose} mg` : <span className={styles.style34}>—</span>}
                      </td>
                      <td className={styles.style32}>{d.route}</td>
                      <td className={styles.style32}>{d.dayOfCycle}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {c?.premedications && c.premedications.length > 0 && (
        <div className={styles.style7}>
          <p className={styles.style24}>Premedications</p>
          <div className={styles.style35}>
            <table className={styles.style26}>
              <thead>
                <tr className={styles.style27}>
                  {['Drug', 'Dose', 'Route', 'Timing'].map(h => (
                    <th key={h} className={styles.style36}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {c.premedications.map((p, i) => (
                  <tr key={i} className={styles.style29}>
                    <td className={styles.style30}>{p.drug}</td>
                    <td className={styles.style31}>{p.dose}</td>
                    <td className={styles.style32}>{p.route}</td>
                    <td className={styles.style32}>{p.timing}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {plan.notes && (
        <div className={styles.style7}>
          <p className={styles.style37}>Notes</p>
          <p className={styles.style38}>{plan.notes}</p>
        </div>
      )}
      <EditHistoryBlock plan={plan} />
    </div>
  );
}

function RadioPlanCard({ plan, onEdit }: { plan: TreatmentPlan; onEdit: () => void }) {
  const r = plan.radioDetails;
  return (
    <div className={styles.style16}>
      <div className={styles.style17}>
        <div>
          <h3 className={styles.style18}>{plan.regimen}</h3>
          <p className={styles.style19}>{plan.protocol}</p>
        </div>
        <div className={styles.style20}>
          <span className={styles.style21}>{plan.intent}</span>
          <span className={styles.style2Class(TREATMENT_STATUS_COLORS[plan.status])}>
            {TREATMENT_STATUS_LABELS[plan.status]}
          </span>
          <button onClick={onEdit} className={styles.style22}>
            <Pencil size={11} /> Edit
          </button>
        </div>
      </div>

      <div className={styles.style23}>
        <InfoGrid items={[
          { label: 'Cancer Type',        value: plan.cancerType },
          { label: 'Stage',              value: plan.stage },
          { label: 'Technique',          value: r?.technique },
          { label: 'Target Site',        value: r?.targetSite },
          { label: 'Total Dose',         value: r ? `${r.totalDoseGy} Gy` : undefined },
          { label: 'Fraction Size',      value: r ? `${r.fractionSizeGy} Gy` : undefined },
          { label: 'Fractions Planned',  value: r ? `${r.fractionsPlanned} fx` : undefined },
          { label: 'Frequency',          value: r?.frequency },
          { label: 'Start Date',         value: fmtDate(plan.startDate) },
          { label: 'Simulation Date',    value: r?.simulationDate ? fmtDate(r.simulationDate) : undefined },
          { label: 'Machine',            value: r?.machine },
        ]} />
      </div>

      {plan.notes && (
        <div className={styles.style7}>
          <p className={styles.style37}>Notes</p>
          <p className={styles.style38}>{plan.notes}</p>
        </div>
      )}
      <EditHistoryBlock plan={plan} />
    </div>
  );
}

function SurgeryPlanCard({ plan, onEdit }: { plan: TreatmentPlan; onEdit: () => void }) {
  const s = plan.surgeryDetails;
  return (
    <div className={styles.style16}>
      <div className={styles.style17}>
        <div>
          <h3 className={styles.style18}>{s?.procedureName ?? plan.regimen}</h3>
          <p className={styles.style19}>{plan.protocol}</p>
        </div>
        <div className={styles.style20}>
          <span className={styles.style21}>{s?.surgicalIntent ?? plan.intent}</span>
          <span className={styles.style2Class(TREATMENT_STATUS_COLORS[plan.status])}>
            {TREATMENT_STATUS_LABELS[plan.status]}
          </span>
          <button onClick={onEdit} className={styles.style22}>
            <Pencil size={11} /> Edit
          </button>
        </div>
      </div>

      <div className={styles.style23}>
        <InfoGrid items={[
          { label: 'Cancer Type',     value: plan.cancerType },
          { label: 'Stage',           value: plan.stage },
          { label: 'Planned Date',    value: s?.plannedDate ? fmtDate(s.plannedDate) : undefined },
          { label: 'Surgeon',         value: s?.surgeon },
          { label: 'Anaesthesia',     value: s?.anaesthesiaType },
        ]} />
      </div>

      {s?.preOpRequirements && (
        <div className={styles.style7}>
          <p className={styles.style37}>Pre-Op Requirements</p>
          <p className={styles.style6}>{s.preOpRequirements}</p>
        </div>
      )}

      {plan.notes && (
        <div className={styles.style7}>
          <p className={styles.style37}>Notes</p>
          <p className={styles.style38}>{plan.notes}</p>
        </div>
      )}
      <EditHistoryBlock plan={plan} />
    </div>
  );
}

function fmtDate(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

const ADD_LABELS: Record<SubTab, string> = {
  chemotherapy: 'Add Chemo Plan',
  radiotherapy: 'Add Radio Plan',
  surgery:      'Add Surgery Plan',
};

export function TreatmentPlanTab({ patientId, plans, onPlansChange, patientBsa, patientWeightKg, seedPlan }: Props) {
  const [activeTab,   setActiveTab]   = useState<SubTab>('chemotherapy');
  const [addPlanOpen, setAddPlanOpen] = useState(false);
  const [editPlan,    setEditPlan]    = useState<TreatmentPlan | null>(null);

  const filtered = plans.filter(p => p.modality === activeTab);

  // Derive Cancer Type and Stage from the most recent plan to pre-populate new Surgery/Radio plans
  const latestPlan      = [...plans].sort((a, b) => b.startDate.localeCompare(a.startDate))[0];
  const prefillCancerType = latestPlan?.cancerType ?? '';
  const prefillStage      = latestPlan?.stage      ?? '';

  function handleSave(plan: TreatmentPlan) {
    if (editPlan) {
      onPlansChange(prev => prev.map(p => p.id === plan.id ? plan : p));
      setEditPlan(null);
    } else {
      onPlansChange(prev => [...prev, plan]);
      setAddPlanOpen(false);
    }
  }

  return (
    <div className={styles.style39}>
      {/* Sub-tab bar */}
      <div className={styles.style40}>
        <div className={styles.style41}>
          {SUB_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm font-medium transition-all',
                activeTab === tab.id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {tab.icon}
              {tab.label}
              {plans.filter(p => p.modality === tab.id).length > 0 && (
                <span className={styles.style42}>
                  {plans.filter(p => p.modality === tab.id).length}
                </span>
              )}
            </button>
          ))}
        </div>

        <button
          onClick={() => setAddPlanOpen(true)}
          className={styles.style43}
        >
          <Plus size={15} />
          {ADD_LABELS[activeTab]}
        </button>
      </div>

      {/* Plan cards */}
      {filtered.length === 0 ? (
        <div className={styles.style44}>
          <ClipboardList size={32} className={styles.style45} />
          <p className={styles.style46}>
            No {activeTab} plan on record
          </p>
          <p className={styles.style47}>
            Click "{ADD_LABELS[activeTab]}" to create one.
          </p>
        </div>
      ) : (
        <div className={styles.style39}>
          {filtered.map(plan =>
            activeTab === 'chemotherapy'
              ? <ChemoPlanCard key={plan.id} plan={plan} onEdit={() => setEditPlan(plan)} patientBsa={patientBsa} patientWeightKg={patientWeightKg} />
              : activeTab === 'radiotherapy'
              ? <RadioPlanCard  key={plan.id} plan={plan} onEdit={() => setEditPlan(plan)} />
              : <SurgeryPlanCard key={plan.id} plan={plan} onEdit={() => setEditPlan(plan)} />,
          )}
        </div>
      )}

      {(addPlanOpen || editPlan) && (
        <AddTreatmentPlanOverlay
          patientId={patientId}
          defaultModality={activeTab}
          initialPlan={editPlan ?? (addPlanOpen ? seedPlan : undefined)}
          prefill={!editPlan && addPlanOpen && !!seedPlan}
          prefillCancerType={prefillCancerType}
          prefillStage={prefillStage}
          patientBsa={patientBsa}
          patientWeightKg={patientWeightKg}
          onSave={handleSave}
          onClose={() => { setAddPlanOpen(false); setEditPlan(null); }}
        />
      )}
    </div>
  );
}

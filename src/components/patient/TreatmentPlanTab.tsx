import { useState } from 'react';
import { Plus, FlaskConical, Radiation, Scissors, ClipboardList, Pencil, ChevronDown, ChevronUp, History } from 'lucide-react';
import { cn } from '../../lib/cn';
import type { TreatmentPlan, PlanModality } from '../../datapoints/treatment';
import { TREATMENT_STATUS_LABELS, TREATMENT_STATUS_COLORS } from '../../datapoints/treatment';
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
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map(({ label, value }) => (
        <div key={label}>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold mb-0.5">{label}</p>
          <p className="text-sm text-foreground">{value ?? '—'}</p>
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
    <div className="border-t border-border pt-3">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
      >
        <History size={13} />
        Version History ({plan.editHistory.length})
        {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
      </button>
      {open && (
        <div className="mt-3 space-y-2">
          {[...plan.editHistory].reverse().map((entry, idx) => {
            const s = entry.snapshot;
            return (
              <div key={idx} className="bg-muted/30 border border-border rounded-xl p-3 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                    Version before {fmtDateTime(entry.editedAt)}
                  </span>
                  <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-medium', TREATMENT_STATUS_COLORS[s.status])}>
                    {TREATMENT_STATUS_LABELS[s.status]}
                  </span>
                </div>
                <p className="text-xs text-foreground font-medium">{s.regimen}</p>
                <p className="text-xs text-muted-foreground">{s.protocol} · {s.intent} · Start: {fmtDate(s.startDate)}</p>
                {s.cancerType && <p className="text-xs text-muted-foreground">{s.cancerType} — {s.stage}</p>}
                {s.notes && <p className="text-xs text-muted-foreground italic">{s.notes}</p>}
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
    <div className="bg-card border border-border rounded-xl p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-foreground">{plan.regimen}</h3>
          <p className="text-sm text-muted-foreground">{plan.protocol}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">{plan.intent}</span>
          <span className={cn('text-xs px-2.5 py-1 rounded-full font-medium', TREATMENT_STATUS_COLORS[plan.status])}>
            {TREATMENT_STATUS_LABELS[plan.status]}
          </span>
          <button onClick={onEdit} className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-primary border border-primary/30 rounded-lg hover:bg-primary/5 transition-colors">
            <Pencil size={11} /> Edit
          </button>
        </div>
      </div>

      <div className="pt-3 border-t border-border">
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
        <div className="border-t border-border pt-3">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">Drugs</p>
          <div className="rounded-lg border border-border overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-muted/50">
                  {['Drug', 'Dose', 'Unit', 'Final Dose', 'Route', 'Day of Cycle'].map(h => (
                    <th key={h} className="px-3 py-2 text-left font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">{h}</th>
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
                    <tr key={i} className="border-t border-border">
                      <td className="px-3 py-2 font-medium text-foreground">{d.name}</td>
                      <td className="px-3 py-2 text-foreground">{d.dose}</td>
                      <td className="px-3 py-2 text-muted-foreground">{d.unit}</td>
                      <td className="px-3 py-2 font-semibold text-primary">
                        {finalDose != null ? `${finalDose} mg` : <span className="text-muted-foreground font-normal">—</span>}
                      </td>
                      <td className="px-3 py-2 text-muted-foreground">{d.route}</td>
                      <td className="px-3 py-2 text-muted-foreground">{d.dayOfCycle}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {c?.premedications && c.premedications.length > 0 && (
        <div className="border-t border-border pt-3">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">Premedications</p>
          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-muted/50">
                  {['Drug', 'Dose', 'Route', 'Timing'].map(h => (
                    <th key={h} className="px-3 py-2 text-left font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {c.premedications.map((p, i) => (
                  <tr key={i} className="border-t border-border">
                    <td className="px-3 py-2 font-medium text-foreground">{p.drug}</td>
                    <td className="px-3 py-2 text-foreground">{p.dose}</td>
                    <td className="px-3 py-2 text-muted-foreground">{p.route}</td>
                    <td className="px-3 py-2 text-muted-foreground">{p.timing}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {plan.notes && (
        <div className="border-t border-border pt-3">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">Notes</p>
          <p className="text-sm text-foreground leading-relaxed">{plan.notes}</p>
        </div>
      )}
      <EditHistoryBlock plan={plan} />
    </div>
  );
}

function RadioPlanCard({ plan, onEdit }: { plan: TreatmentPlan; onEdit: () => void }) {
  const r = plan.radioDetails;
  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-foreground">{plan.regimen}</h3>
          <p className="text-sm text-muted-foreground">{plan.protocol}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">{plan.intent}</span>
          <span className={cn('text-xs px-2.5 py-1 rounded-full font-medium', TREATMENT_STATUS_COLORS[plan.status])}>
            {TREATMENT_STATUS_LABELS[plan.status]}
          </span>
          <button onClick={onEdit} className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-primary border border-primary/30 rounded-lg hover:bg-primary/5 transition-colors">
            <Pencil size={11} /> Edit
          </button>
        </div>
      </div>

      <div className="pt-3 border-t border-border">
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
        <div className="border-t border-border pt-3">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">Notes</p>
          <p className="text-sm text-foreground leading-relaxed">{plan.notes}</p>
        </div>
      )}
      <EditHistoryBlock plan={plan} />
    </div>
  );
}

function SurgeryPlanCard({ plan, onEdit }: { plan: TreatmentPlan; onEdit: () => void }) {
  const s = plan.surgeryDetails;
  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-foreground">{s?.procedureName ?? plan.regimen}</h3>
          <p className="text-sm text-muted-foreground">{plan.protocol}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">{s?.surgicalIntent ?? plan.intent}</span>
          <span className={cn('text-xs px-2.5 py-1 rounded-full font-medium', TREATMENT_STATUS_COLORS[plan.status])}>
            {TREATMENT_STATUS_LABELS[plan.status]}
          </span>
          <button onClick={onEdit} className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-primary border border-primary/30 rounded-lg hover:bg-primary/5 transition-colors">
            <Pencil size={11} /> Edit
          </button>
        </div>
      </div>

      <div className="pt-3 border-t border-border">
        <InfoGrid items={[
          { label: 'Cancer Type',     value: plan.cancerType },
          { label: 'Stage',           value: plan.stage },
          { label: 'Planned Date',    value: s?.plannedDate ? fmtDate(s.plannedDate) : undefined },
          { label: 'Surgeon',         value: s?.surgeon },
          { label: 'Anaesthesia',     value: s?.anaesthesiaType },
        ]} />
      </div>

      {s?.preOpRequirements && (
        <div className="border-t border-border pt-3">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">Pre-Op Requirements</p>
          <p className="text-sm text-foreground">{s.preOpRequirements}</p>
        </div>
      )}

      {plan.notes && (
        <div className="border-t border-border pt-3">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">Notes</p>
          <p className="text-sm text-foreground leading-relaxed">{plan.notes}</p>
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
    <div className="space-y-4">
      {/* Sub-tab bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-1 bg-muted/50 rounded-lg p-1">
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
                <span className="ml-1 text-xs bg-primary/15 text-primary rounded-full px-1.5 py-0.5 leading-none font-semibold">
                  {plans.filter(p => p.modality === tab.id).length}
                </span>
              )}
            </button>
          ))}
        </div>

        <button
          onClick={() => setAddPlanOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shrink-0"
        >
          <Plus size={15} />
          {ADD_LABELS[activeTab]}
        </button>
      </div>

      {/* Plan cards */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <ClipboardList size={32} className="text-muted-foreground/40 mb-3" />
          <p className="text-sm font-medium text-muted-foreground">
            No {activeTab} plan on record
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Click "{ADD_LABELS[activeTab]}" to create one.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
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

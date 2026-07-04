import { useState } from 'react';
import { Calculator, Plus, Trash2, FileText } from 'lucide-react';
import { cn } from '../../lib/cn';
import type { CostEstimate, CostEstimateItem, CostCategory, BillLineItem } from '../../datapoints/billing';
import { COST_CATEGORY_LABELS } from '../../datapoints/billing';
import type { TreatmentPlan } from '../../datapoints/treatment';

interface Props {
  patientId:          string;
  plans:              TreatmentPlan[];
  estimates:          CostEstimate[];
  onEstimatesChange:  React.Dispatch<React.SetStateAction<CostEstimate[]>>;
  onCreateInvoice?:   (items: BillLineItem[]) => void;
}

const CATEGORY_OPTIONS = Object.keys(COST_CATEGORY_LABELS) as CostCategory[];

const CATEGORY_COLORS: Record<CostCategory, string> = {
  consultation:  'bg-blue-100 text-blue-700',
  chemotherapy:  'bg-purple-100 text-purple-700',
  pharmacy:      'bg-green-100 text-green-700',
  diagnostics:   'bg-teal-100 text-teal-700',
  consumables:   'bg-yellow-100 text-yellow-700',
  room:          'bg-gray-100 text-gray-700',
  'admin-file':  'bg-slate-100 text-slate-700',
  nursing:       'bg-cyan-100 text-cyan-700',
  miscellaneous: 'bg-muted text-muted-foreground',
};

function estimateItemsToLineItems(items: CostEstimateItem[]): BillLineItem[] {
  return items.map(item => ({
    id:        `li-${item.id}`,
    name:      item.description,
    category:  item.category,
    qty:       item.quantity,
    unitPrice: item.unitCost,
    total:     item.total,
    status:    'included' as const,
  }));
}

function fmtCurrency(n: number) {
  return `₹${n.toLocaleString('en-IN')}`;
}

function emptyItem(id: string): CostEstimateItem {
  return { id, category: 'consultation', description: '', unitCost: 0, quantity: 1, total: 0 };
}

interface AddItemOverlayProps {
  onSave:  (item: CostEstimateItem) => void;
  onClose: () => void;
}

function AddItemOverlay({ onSave, onClose }: AddItemOverlayProps) {
  const [item, setItem] = useState<CostEstimateItem>(emptyItem(`ci-${Date.now()}`));

  function update<K extends keyof CostEstimateItem>(key: K, val: CostEstimateItem[K]) {
    setItem(prev => {
      const next = { ...prev, [key]: val };
      if (key === 'unitCost' || key === 'quantity') {
        next.total = (key === 'unitCost' ? (val as number) : prev.unitCost) *
                     (key === 'quantity' ? (val as number) : prev.quantity);
      }
      return next;
    });
  }

  const canSave = item.description.trim() && item.unitCost > 0 && item.quantity > 0;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="text-sm font-bold text-foreground">Add Cost Item</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-lg leading-none">×</button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
              Category<span className="text-destructive ml-0.5">*</span>
            </label>
            <select value={item.category} onChange={e => update('category', e.target.value as CostCategory)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30">
              {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{COST_CATEGORY_LABELS[c]}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
              Description<span className="text-destructive ml-0.5">*</span>
            </label>
            <input value={item.description} onChange={e => update('description', e.target.value)}
              placeholder="e.g. Oncologist consultation × 4"
              className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Unit Cost (₹)</label>
              <input type="number" min={0} value={item.unitCost || ''}
                onChange={e => update('unitCost', Number(e.target.value))}
                className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Qty</label>
              <input type="number" min={1} value={item.quantity}
                onChange={e => update('quantity', Number(e.target.value))}
                className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Total</label>
              <input readOnly value={fmtCurrency(item.total)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-muted text-foreground font-semibold" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Notes</label>
            <input value={item.notes ?? ''} onChange={e => update('notes', e.target.value)}
              placeholder="Optional note"
              className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border">
          <button onClick={onClose} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground">Cancel</button>
          <button onClick={() => canSave && onSave(item)} disabled={!canSave}
            className="px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed">
            Add Item
          </button>
        </div>
      </div>
    </div>
  );
}

export function CostEstimationSubTab({ patientId, plans, estimates, onEstimatesChange, onCreateInvoice }: Props) {
  const [addItemOpen, setAddItemOpen] = useState(false);

  const estimate = estimates.find(e => e.patientId === patientId);
  const items    = estimate?.items ?? [];
  const total    = items.reduce((s, i) => s + i.total, 0);

  function handleAddItem(item: CostEstimateItem) {
    const newTotal = total + item.total;
    if (estimate) {
      onEstimatesChange(prev => prev.map(e =>
        e.id === estimate.id
          ? { ...e, items: [...e.items, item], totalEstimate: newTotal }
          : e,
      ));
    } else {
      onEstimatesChange(prev => [...prev, {
        id:            `ce-${Date.now()}`,
        patientId,
        createdAt:     new Date().toISOString().split('T')[0],
        items:         [item],
        totalEstimate: item.total,
      }]);
    }
    setAddItemOpen(false);
  }

  function handleRemoveItem(itemId: string) {
    if (!estimate) return;
    const remaining = estimate.items.filter(i => i.id !== itemId);
    onEstimatesChange(prev => prev.map(e =>
      e.id === estimate.id
        ? { ...e, items: remaining, totalEstimate: remaining.reduce((s, i) => s + i.total, 0) }
        : e,
    ));
  }

  const byCategory = CATEGORY_OPTIONS.filter(c => items.some(i => i.category === c));

  return (
    <>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            {estimate?.planId && (
              <p className="text-xs text-muted-foreground">
                Linked plan: <span className="font-medium text-foreground">{plans.find(p => p.id === estimate.planId)?.regimen ?? estimate.planId}</span>
              </p>
            )}
            {estimate?.validTill && (
              <p className="text-xs text-muted-foreground">Valid till: {new Date(estimate.validTill + 'T00:00:00').toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {items.length > 0 && onCreateInvoice && (
              <button
                onClick={() => onCreateInvoice(estimateItemsToLineItems(items))}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors"
              >
                <FileText size={15} /> Create Invoice
              </button>
            )}
            <button onClick={() => setAddItemOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
              <Plus size={15} /> Add Item
            </button>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Calculator size={36} className="text-muted-foreground/40 mb-3" />
            <p className="text-sm font-medium text-muted-foreground">No cost estimate items yet</p>
            <p className="text-xs text-muted-foreground mt-1">Click "Add Item" to build a cost estimate for this patient.</p>
          </div>
        ) : (
          <>
            {/* Grouped by category */}
            {byCategory.map(cat => {
              const catItems = items.filter(i => i.category === cat);
              const catTotal = catItems.reduce((s, i) => s + i.total, 0);
              return (
                <div key={cat}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide', CATEGORY_COLORS[cat])}>
                      {COST_CATEGORY_LABELS[cat]}
                    </span>
                    <span className="text-xs text-muted-foreground font-medium">{fmtCurrency(catTotal)}</span>
                  </div>
                  <div className="bg-card border border-border rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                      <tbody>
                        {catItems.map(item => (
                          <tr key={item.id} className="border-t border-border first:border-t-0 hover:bg-muted/20 transition-colors">
                            <td className="px-4 py-2.5 text-foreground">{item.description}</td>
                            <td className="px-4 py-2.5 text-muted-foreground text-xs whitespace-nowrap text-right">
                              {fmtCurrency(item.unitCost)} × {item.quantity}
                            </td>
                            <td className="px-4 py-2.5 font-semibold text-foreground text-right whitespace-nowrap">
                              {fmtCurrency(item.total)}
                            </td>
                            <td className="px-4 py-2.5 w-8">
                              <button onClick={() => handleRemoveItem(item.id)}
                                className="p-1 text-muted-foreground hover:text-destructive transition-colors">
                                <Trash2 size={13} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}

            {/* Total */}
            <div className="flex items-center justify-between bg-primary/5 border border-primary/20 rounded-xl px-5 py-4">
              <p className="text-sm font-semibold text-foreground">Total Estimated Cost</p>
              <p className="text-xl font-bold text-primary">{fmtCurrency(total)}</p>
            </div>

            {estimate?.notes && (
              <div className="text-xs text-muted-foreground bg-muted/30 rounded-lg px-3 py-2 italic">
                {estimate.notes}
              </div>
            )}
          </>
        )}
      </div>

      {addItemOpen && (
        <AddItemOverlay onSave={handleAddItem} onClose={() => setAddItemOpen(false)} />
      )}
    </>
  );
}

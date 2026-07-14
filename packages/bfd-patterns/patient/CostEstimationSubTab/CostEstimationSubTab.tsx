import * as styles from './CostEstimationSubTab.styles';
import { useState } from 'react';
import { Calculator, Plus, Trash2, FileText } from 'bfd-icons';

import type { CostEstimate, CostEstimateItem, CostCategory, BillLineItem } from 'bfd-core';
import { COST_CATEGORY_LABELS } from 'bfd-core';
import type { TreatmentPlan } from 'bfd-core';

interface Props {
  patientId:          string;
  plans:              TreatmentPlan[];
  estimates:          CostEstimate[];
  onEstimatesChange:  React.Dispatch<React.SetStateAction<CostEstimate[]>>;
  onCreateInvoice?:   (items: BillLineItem[]) => void;
}

const CATEGORY_OPTIONS = Object.keys(COST_CATEGORY_LABELS) as CostCategory[];

const CATEGORY_COLORS: Record<CostCategory, string> = {
  consultation:  'bg-info-soft text-info-emphasis',
  chemotherapy:  'bg-purple-soft text-purple-emphasis',
  pharmacy:      'bg-success-soft text-success-emphasis',
  diagnostics:   'bg-teal-soft text-teal-emphasis',
  consumables:   'bg-yellow-100 text-yellow-700',
  room:          'bg-neutral-soft text-neutral-text',
  'admin-file':  'bg-slate-soft text-slate-emphasis',
  nursing:       'bg-cyan-soft text-cyan-emphasis',
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
    <div className={styles.style2}>
      <div className={styles.style3}>
        <div className={styles.style4}>
          <h3 className={styles.style5}>Add Cost Item</h3>
          <button onClick={onClose} className={styles.style6}>×</button>
        </div>
        <div className={styles.style7}>
          <div>
            <label className={styles.style8}>
              Category<span className={styles.style9}>*</span>
            </label>
            <select value={item.category} onChange={e => update('category', e.target.value as CostCategory)}
              className={styles.style10}>
              {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{COST_CATEGORY_LABELS[c]}</option>)}
            </select>
          </div>
          <div>
            <label className={styles.style8}>
              Description<span className={styles.style9}>*</span>
            </label>
            <input value={item.description} onChange={e => update('description', e.target.value)}
              placeholder="e.g. Oncologist consultation × 4"
              className={styles.style11} />
          </div>
          <div className={styles.style12}>
            <div>
              <label className={styles.style8}>Unit Cost (₹)</label>
              <input type="number" min={0} value={item.unitCost || ''}
                onChange={e => update('unitCost', Number(e.target.value))}
                className={styles.style10} />
            </div>
            <div>
              <label className={styles.style8}>Qty</label>
              <input type="number" min={1} value={item.quantity}
                onChange={e => update('quantity', Number(e.target.value))}
                className={styles.style10} />
            </div>
            <div>
              <label className={styles.style8}>Total</label>
              <input readOnly value={fmtCurrency(item.total)}
                className={styles.style13} />
            </div>
          </div>
          <div>
            <label className={styles.style8}>Notes</label>
            <input value={item.notes ?? ''} onChange={e => update('notes', e.target.value)}
              placeholder="Optional note"
              className={styles.style11} />
          </div>
        </div>
        <div className={styles.style14}>
          <button onClick={onClose} className={styles.style15}>Cancel</button>
          <button onClick={() => canSave && onSave(item)} disabled={!canSave}
            className={styles.style16}>
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
      <div className={styles.style17}>
        {/* Header */}
        <div className={styles.style18}>
          <div>
            {estimate?.planId && (
              <p className={styles.style19}>
                Linked plan: <span className={styles.style20}>{plans.find(p => p.id === estimate.planId)?.regimen ?? estimate.planId}</span>
              </p>
            )}
            {estimate?.validTill && (
              <p className={styles.style19}>Valid till: {new Date(estimate.validTill + 'T00:00:00').toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
            )}
          </div>
          <div className={styles.style21}>
            {items.length > 0 && onCreateInvoice && (
              <button
                onClick={() => onCreateInvoice(estimateItemsToLineItems(items))}
                className={styles.style22}
              >
                <FileText size={15} /> Create Invoice
              </button>
            )}
            <button onClick={() => setAddItemOpen(true)}
              className={styles.style23}>
              <Plus size={15} /> Add Item
            </button>
          </div>
        </div>

        {items.length === 0 ? (
          <div className={styles.style24}>
            <Calculator size={36} className={styles.style25} />
            <p className={styles.style26}>No cost estimate items yet</p>
            <p className={styles.style27}>Click "Add Item" to build a cost estimate for this patient.</p>
          </div>
        ) : (
          <>
            {/* Grouped by category */}
            {byCategory.map(cat => {
              const catItems = items.filter(i => i.category === cat);
              const catTotal = catItems.reduce((s, i) => s + i.total, 0);
              return (
                <div key={cat}>
                  <div className={styles.style28}>
                    <span className={styles.style1Class(CATEGORY_COLORS[cat])}>
                      {COST_CATEGORY_LABELS[cat]}
                    </span>
                    <span className={styles.style29}>{fmtCurrency(catTotal)}</span>
                  </div>
                  <div className={styles.style30}>
                    <table className={styles.style31}>
                      <tbody>
                        {catItems.map(item => (
                          <tr key={item.id} className={styles.style32}>
                            <td className={styles.style33}>{item.description}</td>
                            <td className={styles.style34}>
                              {fmtCurrency(item.unitCost)} × {item.quantity}
                            </td>
                            <td className={styles.style35}>
                              {fmtCurrency(item.total)}
                            </td>
                            <td className={styles.style36}>
                              <button onClick={() => handleRemoveItem(item.id)}
                                className={styles.style37}>
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
            <div className={styles.style38}>
              <p className={styles.style39}>Total Estimated Cost</p>
              <p className={styles.style40}>{fmtCurrency(total)}</p>
            </div>

            {estimate?.notes && (
              <div className={styles.style41}>
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

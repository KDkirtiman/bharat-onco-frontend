import { action } from 'storybook/actions';
import { useEffect, useMemo, useState } from 'react';

import { Badge } from '../core/badge/Badge';
import { Button } from '../core/button/Button';
import { Card } from '../core/card/Card';
import { TextField } from '../core/textfield/TextField';
import { Avatar } from '../core/avatar/Avatar';
import { PageHeader } from '../core/page-header/PageHeader';
import { DataTableToolbar } from '../tables/DataTableToolbar';
import { Pagination } from '../tables/Pagination';
import { Table, TableBody, TableHead, TableRow, Td, Th } from '../tables/Table';

export type PatientRow = {
  name: string;
  mrn: string;
  age: number;
  type: 'Walk-in' | 'Referred';
  status: 'Active' | 'Inactive';
};

export const MOCK_PATIENTS: PatientRow[] = [
  { name: 'Rajesh Kumar', mrn: 'MRN-10234', age: 54, type: 'Walk-in', status: 'Active' },
  { name: 'Priya Sharma', mrn: 'MRN-8891', age: 41, type: 'Referred', status: 'Active' },
  { name: 'Amit Patel', mrn: 'MRN-4402', age: 63, type: 'Walk-in', status: 'Inactive' },
  { name: 'Sunita Rao', mrn: 'MRN-7712', age: 38, type: 'Referred', status: 'Active' },
  { name: 'Vikram Singh', mrn: 'MRN-2201', age: 49, type: 'Walk-in', status: 'Active' },
  { name: 'Neha Kapoor', mrn: 'MRN-3150', age: 33, type: 'Referred', status: 'Active' },
  { name: 'Kiran Desai', mrn: 'MRN-6001', age: 57, type: 'Walk-in', status: 'Inactive' },
  { name: 'Meera Iyer', mrn: 'MRN-9088', age: 45, type: 'Referred', status: 'Active' },
  { name: 'Rahul Verma', mrn: 'MRN-1200', age: 29, type: 'Walk-in', status: 'Active' },
  { name: 'Anjali Singh', mrn: 'MRN-5543', age: 51, type: 'Referred', status: 'Active' },
];

const PAGE_SIZE = 3;

function typeTone(t: string) {
  if (t === 'Walk-in') return 'info' as const;
  if (t === 'Referred') return 'neutral' as const;
  return 'neutral' as const;
}

function statusTone(s: string) {
  return s === 'Active' ? ('success' as const) : ('neutral' as const);
}

export type PatientListDemoProps = {
  subtitle?: string;
  className?: string;
};

/**
 * Interactive patient table + search + pagination for Storybook demos and composition pages.
 */
export function PatientListDemo({
  subtitle = 'Manage and view patient records — search & pagination are wired to React state.',
  className,
}: PatientListDemoProps) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return MOCK_PATIENTS;
    return MOCK_PATIENTS.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.mrn.toLowerCase().includes(q),
    );
  }, [search]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  useEffect(() => {
    setPage((p) => Math.min(p, pageCount));
  }, [pageCount]);

  const pageSafe = Math.min(page, pageCount);

  const pageRows = useMemo(() => {
    const start = (pageSafe - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, pageSafe]);

  return (
    <div className={className}>
      <PageHeader title="Patients" subtitle={subtitle} />
      <Card padding="md">
        <DataTableToolbar
          start={
            <TextField
              placeholder="Search by name or MRN…"
              startAdornment="🔍"
              aria-label="Search patients"
              data-testid="patients-search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
                action('search')(e.target.value);
              }}
            />
          }
          end={
            <Button
              variant="secondary"
              size="sm"
              data-testid="patients-filters-toggle"
              onClick={() => {
                setFiltersOpen((o) => !o);
                action(filtersOpen ? 'filters-close' : 'filters-open')();
              }}
            >
              {filtersOpen ? 'Hide filters' : 'Filters'}
            </Button>
          }
        />
        {filtersOpen ? (
          <div
            data-testid="patients-filters-panel"
            style={{
              marginBottom: 16,
              padding: 12,
              borderRadius: 12,
              border: '1px dashed var(--ds-color-border)',
              fontSize: 13,
              color: 'var(--ds-color-muted)',
            }}
          >
            Placeholder: hook Select / DateRange / Status chips here — toggling proves the toolbar
            is interactive.
          </div>
        ) : null}
        <div style={{ overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <Th>Patient</Th>
                <Th>MRN</Th>
                <Th>Age</Th>
                <Th>Type</Th>
                <Th>Status</Th>
                <Th style={{ textAlign: 'right' }}>Actions</Th>
              </TableRow>
            </TableHead>
            <TableBody>
              {pageRows.length === 0 ? (
                <TableRow>
                  <Td colSpan={6} style={{ textAlign: 'center', padding: 24, color: 'var(--ds-color-muted)' }}>
                    No patients match “{search.trim()}”. Clear search to see all.
                  </Td>
                </TableRow>
              ) : (
                pageRows.map((r) => (
                  <TableRow key={r.mrn}>
                    <Td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                        <Avatar size="sm" alt="" />
                        <span style={{ fontWeight: 600 }}>{r.name}</span>
                      </span>
                    </Td>
                    <Td>{r.mrn}</Td>
                    <Td>{r.age}</Td>
                    <Td>
                      <Badge tone={typeTone(r.type)}>{r.type}</Badge>
                    </Td>
                    <Td>
                      <Badge tone={statusTone(r.status)}>{r.status}</Badge>
                    </Td>
                    <Td style={{ textAlign: 'right' }}>
                      <Button
                        size="sm"
                        data-testid={`view-${r.mrn}`}
                        onClick={() => action('view-details')(r.mrn, r.name)}
                      >
                        View Details
                      </Button>
                    </Td>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <div
          style={{
            marginTop: 16,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 8,
          }}
        >
          <span data-testid="patients-range" style={{ fontSize: 12, color: 'var(--ds-color-muted)' }}>
            Showing {filtered.length === 0 ? 0 : (pageSafe - 1) * PAGE_SIZE + 1}–
            {Math.min(pageSafe * PAGE_SIZE, filtered.length)} of {filtered.length} (filtered)
          </span>
          <Pagination page={pageSafe} pageCount={pageCount} onPageChange={setPage} />
        </div>
      </Card>
    </div>
  );
}

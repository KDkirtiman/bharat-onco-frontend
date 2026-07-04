# Release v0.1.1 — `bharat-onco-frontend`

**Release date:** July 4, 2026  
**Registry package:** `@kdkirtiman/bharat-onco-frontend@0.1.1`  
**Import alias:** `bharat-onco-frontend` (see install below)  
**Registry:** GitHub Packages (`https://npm.pkg.github.com`)  
**Branch:** `release/v0.1.1`  
**Tag:** `v0.1.1`

First publishable release of the Bharat Oncology reusable React component library, extracted from the interactive mock and aligned with the design-system workbench.

> GitHub Packages requires scoped package names (`@owner/name`). The package is published as `@kdkirtiman/bharat-onco-frontend`, but consuming repos can install it under the alias `bharat-onco-frontend` so import paths stay unchanged.

---

## Installing

Add to your consuming repo's `.npmrc`:

```
@kdkirtiman:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
```

Install with an npm alias (recommended — keeps `import from 'bharat-onco-frontend'`):

```bash
npm install bharat-onco-frontend@npm:@kdkirtiman/bharat-onco-frontend@0.1.1
```

Or add to `package.json`:

```json
"bharat-onco-frontend": "npm:@kdkirtiman/bharat-onco-frontend@0.1.1"
```

```tsx
import 'bharat-onco-frontend/styles.css';
import {
  AppLayout,
  Button,
  PatientTabs,
  mockPatients,
  mockAppointments,
} from 'bharat-onco-frontend';
```

Optional Tailwind preset:

```ts
import { bharatOncoPreset } from 'bharat-onco-frontend/tailwind-preset';
```

---

## Package exports

| Import path (via alias) | Contents |
|-------------------------|----------|
| `bharat-onco-frontend` | All components, patterns, datapoints, utilities, and types |
| `bharat-onco-frontend/styles.css` | Compiled Tailwind CSS (design tokens + component styles) |
| `bharat-onco-frontend/tailwind-preset` | Tailwind v4 preset with Bharat Oncology tokens |

**Peer dependencies:** `react` and `react-dom` (^18 or ^19)

---

## What's included

### Library infrastructure

- Vite library build with ESM + CJS dual output and TypeScript declarations (`dist/`)
- Tailwind CSS v4 preset and minified `styles.css` build pipeline
- Storybook 8 dev environment with stories for controls, layout, patterns, and patient tabs
- GitHub Actions **Release Package** workflow — publishes to GitHub Packages on `v*` tag push
- GitHub Actions **Storybook** workflow — deploys Storybook on `master` push
- `CONTRIBUTING.md` with branch strategy and release instructions
- Unscoped import alias `bharat-onco-frontend` via npm package alias (registry name is `@kdkirtiman/bharat-onco-frontend` per GitHub Packages requirement)
- CI installs public dependencies from registry.npmjs.org; publishes to GitHub Packages only in the final step

### Controls (`src/components/controls/`)

- `Button` — primary/secondary/outline/ghost variants with size and loading states
- `IconButton` — icon-only action button
- `Input`, `TextField`, `Textarea` — form text inputs with label/error support via `FormField`
- `Select` — dropdown select with typed options
- `Checkbox` — styled checkbox control
- `DatePicker` — calendar date picker (react-day-picker + Radix popover)
- `SearchCombobox` — searchable dropdown with keyboard navigation
- `FilterToggle` — segmented filter control for list views
- `FormField` — label + helper/error wrapper for any control

### Feedback (`src/components/feedback/`)

- `StatusBadge` — appointment/status badge backed by `APPOINTMENT_STATUS_CONFIG`
- `Callout` — info/warning/error/success callout banners
- `EmptyState` — empty-list placeholder
- `ResultState` — success/error result screens

### Data display (`src/components/data-display/`)

- `Avatar` — initials-based avatar with size variants
- `KPICard` — dashboard metric card with trend indicator

### Layout (`src/components/layout/`)

- `AppLayout` — sidebar + header shell with responsive mobile drawer
- `Header` — top navigation bar with center selector, notifications, user menu
- `Sidebar` — role-based navigation with `defaultNavByRole` config
- `Modal` — Radix dialog shell with `ModalHeader`, `ModalBody`, `ModalFooter`

### Patient shell & tabs (`src/components/patient/`)

- `PatientHeaderCard` — patient identity, diagnosis, and quick actions
- `PatientTabs` — left-nav tab shell with role-based tab filtering
- **Overview** — summary cards, upcoming visits, treatment snapshot
- **Clinic Visit** — full active-visit flow (vitals, consultation, chemo checklist, prescriptions)
- **Past Visits** — visit history with detail overlay
- **Medical Records** — document list with upload/viewer overlays
- **Cancer Staging** — TNM staging timeline with add-staging overlay
- **Treatment Plan** — plan list with add-plan overlay
- **Treatment Delivery** — cycle tracking with log-delivery and cycle-detail overlays
- **Response Assessment** — RECIST-style assessments
- **Toxicity** — adverse event log with add-toxicity overlay
- **Survivorship** — survivorship care plan records
- **Recurrence** — recurrence event tracking
- **Palliative Care** — palliative care plan records
- **Billing** — cost estimation, past invoices, insurance claims, payment details sub-tabs

### Scheduling patterns (`src/patterns/scheduling/`)

- `AppointmentCard` — appointment card with status badge and primary action
- `BookAppointmentOverlay` — multi-step appointment booking
- `QuickScheduleOverlay` — fast single-appointment scheduler
- `RescheduleOverlay` — reschedule with reason and new slot
- `CancelOverlay` — cancellation with reason
- `ViewDetailsOverlay` — read-only appointment detail
- `ChairAssignmentOverlay` — chemo chair assignment
- `SendReminderOverlay` — patient reminder dispatch
- `ReminderDetailsOverlay` — reminder history and status
- `VisitAlertsCard` — visit alert summary card

### Billing patterns (`src/patterns/billing/`)

- `GenerateInvoiceOverlay` — quick invoice generation
- `GenerateFullInvoiceOverlay` — full invoice with line items, discounts, insurance
- `ViewInvoiceOverlay` — printable invoice viewer

### Clinical patterns (`src/patterns/clinical/`)

- `PatientRegistrationOverlay` — full patient registration with geodata lookup
- `PrescriptionViewerOverlay` — prescription print/view
- `OncologistReferencePanel` — reference panel for oncologist workflows
- `AddStagingOverlay` — cancer staging entry (TNM, site, histology)
- `AddTreatmentPlanOverlay` — treatment plan authoring
- `AddToxicityOverlay` — toxicity/adverse event logging
- `AddResponseAssessmentOverlay` — response assessment entry
- `LogDeliveryOverlay` — treatment delivery logging
- `CycleDetailOverlay` — cycle detail with medications and vitals
- `PastVisitDetailOverlay` — historical visit detail
- `UploadDocumentOverlay` — medical record upload
- `DocumentViewerOverlay` — document preview
- `AdverseEventLogOverlay` — adverse event detail log

### Mock datapoints (`src/datapoints/`)

Typed mock data and constants for all clinical domains:

| Module | Key exports |
|--------|-------------|
| `auth` | `Role`, `User`, `mockUsers`, `mockNotifications` |
| `scheduling` | `Appointment`, `Center`, `CENTERS`, `APPOINTMENT_STATUS_CONFIG`, `mockAppointments` |
| `patients` | `Patient`, `PAYOR_TYPE_LABELS`, `mockPatients` |
| `billing` | `Invoice`, `CostEstimate`, `InsuranceClaim`, `PaymentRecord`, `mockInvoices` |
| `clinical` | `Vitals`, `ClinicalVisit`, order sets, chemo checklist |
| `treatment` | `TreatmentPlan`, `TreatmentDelivery`, `ToxicityRecord`, etc. |
| `staging` | `CancerStaging`, `mapCancerTypeToSite` |
| `chairs` | `Chair` type and mock chair data |
| `medications` | `MEDICATION_CATALOGUE`, frequency/timing options |
| `geodata` | `COUNTRY_CODES`, `PINCODE_LOOKUP`, `GOVT_SCHEMES`, etc. |
| `inventory` | Inventory item types and mock stock data |

### Utilities (`src/lib/`)

- `cn()` — clsx + tailwind-merge class helper
- `fmtDate`, `fmtDateShort`, `formatTime`, `calcAge`, `localToday` — date/time formatters
- `generateInvoiceHTML`, `printInvoice`, `downloadInvoice` — invoice print/download helpers
- `generateRegistrationReceiptHTML`, `printRegistrationReceipt` — registration receipt helpers

### Design system workbench (`design-system/`)

Separate Vite + Storybook package (not published as npm — lives in-repo for reference):

- OpenAPI spec (`openapi.yaml`) with generated TypeScript schema
- Core primitives: Avatar, Badge, Button, Card, TextField, Typography, PageHeader
- Navigation: Sidebar
- Tables: Table, Pagination, DataTableToolbar
- Widgets: MetricCard, ActivityListItem
- Icons: custom glyph set
- Demo pages: PatientListDemo, composed page stories

### Mobile responsive fixes

- `AppLayout` collapses sidebar into mobile drawer below `lg` breakpoint
- `Header` adapts notification and user menus for narrow viewports
- `PatientTabs` switches from side nav to horizontal scroll on mobile
- Overlay modals use full-width layout on small screens

---

## Known limitations

- All data is mock/hardcoded; no API integration layer in this package
- `design-system/` is a separate in-repo workbench and is **not** included in the npm `files` array
- Tailwind preset uses both named and default exports — consumers importing the preset should use the named `bharatOncoPreset` export
- Bundle size is large (~1.5 MB ESM) because all patterns and datapoints ship together; tree-shaking depends on consumer bundler

---

## Notes for consuming repos

1. Install the package and add `styles.css` import at app entry
2. Replace local component copies with imports from `bharat-onco-frontend`
3. Use exported datapoint types (`Appointment`, `Patient`, etc.) instead of redefining locally
4. Pass the same props the mockup uses — all overlays and tabs are controlled components expecting data + callbacks from the host app

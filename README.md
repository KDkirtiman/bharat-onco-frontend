# Bharat Oncology Frontend

Reusable React component library for the Bharat Oncology EHR — extracted from the interactive mock and published as an npm package with Storybook documentation.

**Stack:** React 18/19 · TypeScript · Tailwind CSS v4 · lucide-react · Radix UI primitives

## Install

### 1. Configure GitHub Packages registry

Create or update `~/.npmrc`:

```
@kdkirtiman:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
```

Generate a token with `read:packages` scope at GitHub → Settings → Developer settings → Personal access tokens.

### 2. Install the package

```bash
npm install @kdkirtiman/bharat-onco-frontend
```

### 3. Import styles

```tsx
import '@kdkirtiman/bharat-onco-frontend/styles.css';
```

## Usage

```tsx
import {
  AppLayout,
  Button,
  KPICard,
  StatusBadge,
  AppointmentCard,
  mockPatients,
  mockUsers,
} from '@kdkirtiman/bharat-onco-frontend';
import '@kdkirtiman/bharat-onco-frontend/styles.css';

function App() {
  const user = mockUsers.staff1;
  return (
    <AppLayout
      user={user}
      selectedCenter="Kurukshetra"
      onCenterChange={() => {}}
      onLogout={() => {}}
      patients={mockPatients}
    >
      <div className="p-6 grid gap-4 md:grid-cols-3">
        <KPICard title="Appointments" value="24" />
        <StatusBadge status="confirmed" />
        <Button variant="primary">Book Appointment</Button>
      </div>
    </AppLayout>
  );
}
```

## Components

| Category | Components |
|----------|------------|
| **Primitives** | `Button`, `Input`, `Checkbox`, `DatePicker` |
| **Display** | `KPICard`, `StatusBadge`, `AppointmentCard`, `VisitAlertsCard`, `FilterToggle` |
| **Layout** | `AppLayout`, `Header`, `Sidebar` |
| **Overlays** | `BookAppointmentOverlay`, `RescheduleOverlay`, `CancelOverlay`, `ViewDetailsOverlay`, `ChairAssignmentOverlay`, `QuickScheduleOverlay`, `SendReminderOverlay`, `ReminderDetailsOverlay`, `GenerateInvoiceOverlay`, `GenerateFullInvoiceOverlay`, `ViewInvoiceOverlay`, `PrescriptionViewerOverlay`, `PatientRegistrationOverlay`, `OncologistReferencePanel` |
| **Patient** | `PatientHeaderCard`, `PatientTabs`, `OverviewTab`, `PastVisitsTab`, `MedicalRecordsTab`, `CancerStagingTab`, `TreatmentPlanTab`, `TreatmentDeliveryTab`, `ResponseAssessmentTab`, `ToxicityTab`, `SurvivorshipTab`, `RecurrenceTab`, `PalliativeCareTab`, `BillingTab`, `ClinicVisitTab`, billing sub-tabs, and patient overlays (`AddStagingOverlay`, `AddTreatmentPlanOverlay`, `AddToxicityOverlay`, etc.) |

All components are **prop-driven** — pass your own data; optional mock fixtures are exported for prototyping.

## Design tokens

Purple primary (`#7c3aed`) and pink secondary (`#ec4899`) tokens ship in `styles.css`. For Tailwind v4 consumers with their own pipeline:

```ts
import preset from '@kdkirtiman/bharat-onco-frontend/tailwind-preset';
```

## Storybook

Browse live component docs:

- **Local:** `npm run dev` → http://localhost:6006
- **GitHub Pages:** https://kdkirtiman.github.io/bharat-onco-frontend/

## Development

```bash
git clone https://github.com/KDkirtiman/bharat-onco-frontend.git
cd bharat-onco-frontend
npm install
npm run dev          # Storybook
npm run build        # Library + CSS
npm run build-storybook
```

## Publishing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for release workflow.

1. Bump `version` in `package.json`
2. Commit and tag: `git tag v0.1.0 && git push origin v0.1.0`
3. GitHub Actions publishes to GitHub Packages automatically

## License

Private — Bharat Oncology internal use.

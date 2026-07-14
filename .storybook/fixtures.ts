import { mockUsers } from '../packages/bfd-core/datapoints/auth';
import { mockPatients } from '../packages/bfd-core/datapoints/patients';
import { mockAppointments, mockDoctors, mockVisitAlerts } from '../packages/bfd-core/datapoints/scheduling';
import { mockCostEstimates, mockInvoices } from '../packages/bfd-core/datapoints/billing';
import { mockChairs } from '../packages/bfd-core/datapoints/chairs';
import { mockClinicalVisits, mockVitals } from '../packages/bfd-core/datapoints/clinical';

export const fixtureUser = mockUsers.staff1;
export const fixturePatient = mockPatients[0]!;
/** Small patient list for overlay stories — avoids huge Controls panels. */
export const fixturePatients = mockPatients.slice(0, 5);
export const fixtureCostEstimates = mockCostEstimates.filter(
  (ce) => ce.patientId === fixturePatient.id,
);
export const fixtureDoctor = mockDoctors[0]!;
export const fixtureAppointment = mockAppointments[0]!;
export const fixtureInvoice = mockInvoices[0]!;
export const fixtureVisitAlert = mockVisitAlerts[0]!;
export const fixtureChair = mockChairs[0]!;
export const fixtureClinicalVisit = mockClinicalVisits[0]!;
export const fixtureVitals = mockVitals[0]!;

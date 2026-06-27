/**
 * Bharat Oncology — Shared TypeScript types
 * Auto-generated from openapi.yaml via openapi-typescript.
 * Run: npm run generate:types
 */

export type { paths, components, operations } from './generated/schema';

import type { components } from './generated/schema';

// Auth
export type LoginRequest          = components['schemas']['LoginRequest'];
export type LoginResponse         = components['schemas']['LoginResponse'];
export type RefreshRequest        = components['schemas']['RefreshRequest'];
export type ChangePasswordRequest = components['schemas']['ChangePasswordRequest'];

// Users
export type UserRole              = components['schemas']['UserRole'];
export type User                  = components['schemas']['User'];
export type UserSummary           = components['schemas']['UserSummary'];
export type CreateUserRequest     = components['schemas']['CreateUserRequest'];

// Centers
export type Center                = components['schemas']['Center'];

// Patients
export type Gender                = components['schemas']['Gender'];
export type BloodGroup            = components['schemas']['BloodGroup'];
export type Patient               = components['schemas']['Patient'];
export type PatientSummary        = components['schemas']['PatientSummary'];
export type CreatePatientRequest  = components['schemas']['CreatePatientRequest'];

// Doctors
export type Doctor                = components['schemas']['Doctor'];

// Appointments
export type AppointmentStatus     = components['schemas']['AppointmentStatus'];
export type AppointmentType       = components['schemas']['AppointmentType'];
export type Appointment           = components['schemas']['Appointment'];
export type CreateAppointmentRequest        = components['schemas']['CreateAppointmentRequest'];
export type UpdateAppointmentStatusRequest  = components['schemas']['UpdateAppointmentStatusRequest'];

// Vitals
export type Vitals                = components['schemas']['Vitals'];
export type CreateVitalsRequest   = components['schemas']['CreateVitalsRequest'];

// Clinical Visits
export type VisitSection          = components['schemas']['VisitSection'];
export type VisitStatus           = components['schemas']['VisitStatus'];
export type ClinicalVisit         = components['schemas']['ClinicalVisit'];
export type CreateVisitRequest    = components['schemas']['CreateVisitRequest'];
export type UpdateVisitSectionRequest = components['schemas']['UpdateVisitSectionRequest'];

// Staging
export type CancerStaging         = components['schemas']['CancerStaging'];
export type CreateStagingRequest  = components['schemas']['CreateStagingRequest'];

// Treatment Plans
export type PlanStatus            = components['schemas']['PlanStatus'];
export type TreatmentIntent       = components['schemas']['TreatmentIntent'];
export type TreatmentPlan         = components['schemas']['TreatmentPlan'];
export type CreatePlanRequest     = components['schemas']['CreatePlanRequest'];

// Treatment Delivery
export type DeliveryStatus        = components['schemas']['DeliveryStatus'];
export type TreatmentDelivery     = components['schemas']['TreatmentDelivery'];
export type CreateDeliveryRequest = components['schemas']['CreateDeliveryRequest'];

// Outcomes
export type ResponseAssessment    = components['schemas']['ResponseAssessment'];
export type Outcome               = components['schemas']['Outcome'];

// Billing
export type BillStatus            = components['schemas']['BillStatus'];
export type PaymentMode           = components['schemas']['PaymentMode'];
export type Bill                  = components['schemas']['Bill'];
export type CreateBillRequest     = components['schemas']['CreateBillRequest'];
export type AddPaymentRequest     = components['schemas']['AddPaymentRequest'];

// Inventory
export type InventoryCategory     = components['schemas']['InventoryCategory'];
export type InventoryItem         = components['schemas']['InventoryItem'];
export type StockAdjustmentRequest = components['schemas']['StockAdjustmentRequest'];

// Documents
export type DocumentType                 = components['schemas']['DocumentType'];
export type Document                     = components['schemas']['Document'];
export type PresignedUploadUrlRequest    = components['schemas']['PresignedUploadUrlRequest'];
export type PresignedUploadUrlResponse   = components['schemas']['PresignedUploadUrlResponse'];

// Common
export type PaginationMeta        = components['schemas']['PaginationMeta'];
export type ApiError              = components['schemas']['Error'];

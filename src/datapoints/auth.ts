import type { Center } from './scheduling';

export type Role = 'staff' | 'nurse' | 'oncologist' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  designation: string;
  role: Role;
  avatarInitials: string;
  center: Center;
}

export interface Notification {
  id: string;
  type: 'alert' | 'info' | 'warning';
  message: string;
  detail: string;
  time: string;
  read: boolean;
}

export const mockUsers: Record<string, User> = {
  // ── Staff ──────────────────────────────────────────────────────────
  staff1: {
    id: 'u1', name: 'Anita Sharma', email: 'anita.sharma@bharatoncology.com',
    designation: 'Front Desk Staff', role: 'staff', avatarInitials: 'AS', center: 'Kurukshetra',
  },
  staff2: {
    id: 'u9', name: 'Deepa Kumari', email: 'deepa.kumari@bharatoncology.com',
    designation: 'Front Desk Staff', role: 'staff', avatarInitials: 'DK', center: 'Panipat',
  },
  staff3: {
    id: 'u10', name: 'Renu Thakur', email: 'renu.thakur@bharatoncology.com',
    designation: 'Front Desk Staff', role: 'staff', avatarInitials: 'RT', center: 'Shimla',
  },

  // ── Nurses ─────────────────────────────────────────────────────────
  nurse1: {
    id: 'u2', name: 'Priya Nair', email: 'priya.nair@bharatoncology.com',
    designation: 'Senior Nurse', role: 'nurse', avatarInitials: 'PN', center: 'Kurukshetra',
  },
  nurse2: {
    id: 'u5', name: 'Kavya Reddy', email: 'kavya.reddy@bharatoncology.com',
    designation: 'Oncology Nurse', role: 'nurse', avatarInitials: 'KR', center: 'Panipat',
  },
  nurse3: {
    id: 'u6', name: 'Sunita Patel', email: 'sunita.patel@bharatoncology.com',
    designation: 'Charge Nurse', role: 'nurse', avatarInitials: 'SP', center: 'Shimla',
  },

  // ── Oncologists ────────────────────────────────────────────────────
  doctor1: {
    id: 'u3', name: 'Dr. Rahul Mehta', email: 'rahul.mehta@bharatoncology.com',
    designation: 'Senior Oncologist', role: 'oncologist', avatarInitials: 'RM', center: 'Kurukshetra',
  },
  doctor2: {
    id: 'u7', name: 'Dr. Ananya Singh', email: 'ananya.singh@bharatoncology.com',
    designation: 'Medical Oncologist', role: 'oncologist', avatarInitials: 'ANS', center: 'Panipat',
  },
  doctor3: {
    id: 'u8', name: 'Dr. Suresh Nair', email: 'suresh.nair@bharatoncology.com',
    designation: 'Radiation Oncologist', role: 'oncologist', avatarInitials: 'SN', center: 'Shimla',
  },

  // ── Admin ──────────────────────────────────────────────────────────
  admin1: {
    id: 'u4', name: 'Vikram Singh', email: 'vikram.singh@bharatoncology.com',
    designation: 'System Administrator', role: 'admin', avatarInitials: 'VS', center: 'Kurukshetra',
  },
};

// Map login username → User (any password accepted in mock)
// staff / nurse / doctor = Kurukshetra; suffix 2 = Panipat; suffix 3 = Shimla
export const credentialMap: Record<string, User> = {
  staff:   mockUsers.staff1,
  staff2:  mockUsers.staff2,
  staff3:  mockUsers.staff3,
  nurse:   mockUsers.nurse1,
  nurse2:  mockUsers.nurse2,
  nurse3:  mockUsers.nurse3,
  doctor:  mockUsers.doctor1,
  doctor2: mockUsers.doctor2,
  doctor3: mockUsers.doctor3,
  admin:   mockUsers.admin1,
};

export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    type: 'alert',
    message: 'Lab result ready',
    detail: 'Patient Suresh Kumar — CBC report available',
    time: '2 min ago',
    read: false,
  },
  {
    id: 'n2',
    type: 'info',
    message: 'New appointment booked',
    detail: 'Dr. Mehta — Tomorrow 10:30 AM',
    time: '15 min ago',
    read: false,
  },
  {
    id: 'n3',
    type: 'warning',
    message: 'Medication stock low',
    detail: 'Ondansetron 8mg — Only 12 units remaining',
    time: '1 hr ago',
    read: false,
  },
  {
    id: 'n4',
    type: 'info',
    message: 'Shift handover note',
    detail: 'Morning shift report submitted by Priya Nair',
    time: '2 hr ago',
    read: true,
  },
  {
    id: 'n5',
    type: 'alert',
    message: 'Pre-auth approved',
    detail: 'Insurance pre-auth for Meena Devi — ₹85,000 approved',
    time: '3 hr ago',
    read: true,
  },
];

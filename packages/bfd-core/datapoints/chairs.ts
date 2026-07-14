export type ChairStatus = 'available' | 'occupied' | 'maintenance';

export interface Chair {
  id:     string;
  name:   string;
  bay:    string;
  center: string;
  status: ChairStatus;
}

export interface DayCareConfig {
  center:    string;
  startTime: string; // HH:mm
  endTime:   string; // HH:mm
}

export interface ChairSession {
  id:            string;
  chairId:       string;
  center:        string;
  patientId:     string;
  appointmentId: string;
  date:          string;          // YYYY-MM-DD
  chairInTime?:  string;          // HH:mm
  chairOutTime?: string;          // HH:mm
  notes?:        string;
}

export const mockChairs: Chair[] = [
  { id: 'ch1',  name: 'A-1', bay: 'Infusion Bay A', center: 'Kurukshetra', status: 'available'   },
  { id: 'ch2',  name: 'A-2', bay: 'Infusion Bay A', center: 'Kurukshetra', status: 'occupied'    },
  { id: 'ch3',  name: 'A-3', bay: 'Infusion Bay A', center: 'Kurukshetra', status: 'available'   },
  { id: 'ch4',  name: 'B-1', bay: 'Infusion Bay B', center: 'Kurukshetra', status: 'available'   },
  { id: 'ch5',  name: 'B-2', bay: 'Infusion Bay B', center: 'Kurukshetra', status: 'maintenance' },
  { id: 'ch6',  name: 'A-1', bay: 'Infusion Bay A', center: 'Panipat',     status: 'available'   },
  { id: 'ch7',  name: 'A-2', bay: 'Infusion Bay A', center: 'Panipat',     status: 'occupied'    },
  { id: 'ch8',  name: 'B-1', bay: 'Infusion Bay B', center: 'Panipat',     status: 'available'   },
  { id: 'ch9',  name: 'A-1', bay: 'Infusion Bay A', center: 'Shimla',      status: 'available'   },
  { id: 'ch10', name: 'A-2', bay: 'Infusion Bay A', center: 'Shimla',      status: 'available'   },
  { id: 'ch11', name: 'A-1', bay: 'Infusion Bay A', center: 'Una',         status: 'occupied'    },
  { id: 'ch12', name: 'B-1', bay: 'Infusion Bay B', center: 'Una',         status: 'available'   },
  { id: 'ch13', name: 'A-1', bay: 'Infusion Bay A', center: 'Deoria',      status: 'available'   },
  { id: 'ch14', name: 'A-2', bay: 'Infusion Bay A', center: 'Deoria',      status: 'available'   },
];

export const mockDayCareConfigs: DayCareConfig[] = [
  { center: 'Kurukshetra', startTime: '08:00', endTime: '18:00' },
  { center: 'Panipat',     startTime: '08:00', endTime: '18:00' },
  { center: 'Shimla',      startTime: '09:00', endTime: '17:00' },
  { center: 'Una',         startTime: '08:30', endTime: '17:30' },
  { center: 'Deoria',      startTime: '08:00', endTime: '17:00' },
];

const _td = (() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; })();

export const mockChairSessions: ChairSession[] = [
  { id: 'cs1', chairId: 'ch2',  center: 'Kurukshetra', patientId: 'p1', appointmentId: 'a1',  date: _td, chairInTime: '09:15' },
  { id: 'cs2', chairId: 'ch4',  center: 'Kurukshetra', patientId: 'p3', appointmentId: 'a3',  date: _td, chairInTime: '10:30', chairOutTime: '13:00' },
  { id: 'cs3', chairId: 'ch7',  center: 'Panipat',     patientId: 'p2', appointmentId: 'a2',  date: _td, chairInTime: '10:00', chairOutTime: '13:30' },
  { id: 'cs4', chairId: 'ch11', center: 'Una',         patientId: 'p4', appointmentId: 'a4',  date: _td, chairInTime: '08:45' },
];

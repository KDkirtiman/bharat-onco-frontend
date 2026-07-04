import { useState, useEffect } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import type { User } from '../../datapoints/auth';
import type { Patient } from '../../datapoints/patients';
import type { CancerStaging } from '../../datapoints/staging';

interface AppLayoutProps {
  user:                User;
  onLogout:            () => void;
  selectedCenter:      string;
  onCenterChange:      (center: string) => void;
  children:            React.ReactNode;
  patients?:           Patient[];
  onRegisterPatient?:  () => void;
  onBookAppointment?:  () => void;
  onGenerateInvoice?:  () => void;
  onPatientSelect?:    (patientId: string, appointmentId?: string, initialTab?: string) => void;
  activeView?:         string;
  onViewChange?:       (view: string) => void;
  stagingRecords?:     CancerStaging[];
}

export function AppLayout({ user, onLogout, selectedCenter, onCenterChange, children, patients, onRegisterPatient, onBookAppointment, onGenerateInvoice, onPatientSelect, activeView, onViewChange, stagingRecords }: AppLayoutProps) {
  const [isMobile, setIsMobile]       = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    function handleResize() {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const mainMargin = isMobile ? 'ml-0' : (sidebarOpen ? 'ml-56' : 'ml-14');

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header
        user={user}
        onMenuToggle={() => setSidebarOpen(v => !v)}
        onLogout={onLogout}
        patients={patients}
        onRegisterPatient={onRegisterPatient}
        onBookAppointment={onBookAppointment}
        onGenerateInvoice={onGenerateInvoice}
        onPatientSelect={onPatientSelect}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onOpen={() => setSidebarOpen(true)}
          role={user.role}
          isMobile={isMobile}
          selectedCenter={selectedCenter}
          onCenterChange={onCenterChange}
          activeView={activeView}
          onNavChange={(view) => { onViewChange?.(view); setSidebarOpen(false); }}
          stagingRecords={stagingRecords}
        />
        <main className={`flex-1 overflow-y-auto p-4 md:p-6 transition-[margin] duration-300 ${mainMargin}`}>
          {children}
        </main>
      </div>
    </div>
  );
}

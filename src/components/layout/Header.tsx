import { useState, useRef, useEffect, useMemo } from 'react';
import {
  Menu, Search, Bell, ChevronDown, LogOut, UserCircle,
  AlertCircle, Info, AlertTriangle, UserPlus, CalendarPlus, Receipt, X,
} from 'lucide-react';
import type { User, Notification } from '../../datapoints/auth';
import { mockNotifications } from '../../datapoints/auth';
import { mockPatients } from '../../datapoints/patients';
import type { Patient } from '../../datapoints/patients';
import logo from '../../assets/bharat_oncology_vector.svg';

interface HeaderProps {
  user:                User;
  onMenuToggle:        () => void;
  onLogout:            () => void;
  patients?:           Patient[];
  notifications?:      Notification[];
  logoSrc?:            string;
  onRegisterPatient?:  () => void;
  onBookAppointment?:  () => void;
  onGenerateInvoice?:  () => void;
  onPatientSelect?:    (patientId: string, appointmentId?: string, initialTab?: string) => void;
}

function NotificationIcon({ type }: { type: Notification['type'] }) {
  if (type === 'alert')   return <AlertCircle   size={16} className="text-destructive shrink-0" />;
  if (type === 'warning') return <AlertTriangle size={16} className="text-amber-500 shrink-0" />;
  return <Info size={16} className="text-primary shrink-0" />;
}

const STAFF_ACTIONS = [
  { icon: <UserPlus   size={13} />, label: 'Register Patient'  },
  { icon: <CalendarPlus size={13} />, label: 'Book Appointment' },
  { icon: <Receipt    size={13} />, label: 'Generate Invoice'  },
];

export function Header({ user, onMenuToggle, onLogout, patients, notifications: notificationsProp, logoSrc, onRegisterPatient, onBookAppointment, onGenerateInvoice, onPatientSelect }: HeaderProps) {
  const [notifications, setNotifications] = useState<Notification[]>(notificationsProp ?? mockNotifications);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Patient search
  const [searchQuery, setSearchQuery]   = useState('');
  const [showSearchDrop, setShowSearchDrop] = useState(false);

  const notifRef  = useRef<HTMLDivElement>(null);
  const userRef   = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Close all dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current  && !notifRef.current.contains(e.target as Node))  setShowNotifications(false);
      if (userRef.current   && !userRef.current.contains(e.target as Node))   setShowUserMenu(false);
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowSearchDrop(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Patient search — name, MRN, phone
  const patientList = patients ?? mockPatients;

  const searchResults = useMemo(() => {
    const q = searchQuery.toLowerCase().replace(/\s/g, '');
    if (!q) return [];
    return patientList
      .filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.mrn.toLowerCase().includes(q) ||
        p.phone.replace(/\s/g, '').includes(q),
      )
      .slice(0, 6);
  }, [searchQuery, patientList]);

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));

  return (
    <header className="sticky top-0 z-40 h-16 bg-card border-b border-border shadow-sm flex items-center px-4 gap-2">

      {/* ── LEFT: menu + logo + search ── */}
      <div className="flex items-center gap-3 flex-1 min-w-0">

        {/* Menu toggle */}
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-lg hover:bg-muted text-foreground transition-colors shrink-0"
          aria-label="Toggle menu"
        >
          <Menu size={20} />
        </button>

        {/* Logo */}
        <img src={logoSrc ?? logo} alt="Bharat Oncology" className="h-9 w-auto shrink-0" />

        {/* Patient search */}
        <div ref={searchRef} className="relative hidden sm:block flex-1 max-w-xs">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search by name, MRN, contact…"
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setShowSearchDrop(true); }}
            onFocus={() => searchQuery.trim() && setShowSearchDrop(true)}
            onKeyDown={e => e.key === 'Escape' && setShowSearchDrop(false)}
            className="w-full pl-9 pr-8 py-2 text-sm rounded-lg border border-border bg-input-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => { setSearchQuery(''); setShowSearchDrop(false); }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X size={13} />
            </button>
          )}

          {/* Search results dropdown */}
          {showSearchDrop && searchQuery.trim() && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50">
              {searchResults.length > 0 ? (
                <>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide px-3 pt-2.5 pb-1">
                    Patients
                  </p>
                  {searchResults.map(p => (
                    <button
                      key={p.id}
                      onClick={() => { setSearchQuery(''); setShowSearchDrop(false); onPatientSelect?.(p.id); }}
                      className="flex items-center gap-3 w-full px-3 py-2.5 hover:bg-muted/50 transition-colors text-left"
                    >
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-[11px] font-bold text-primary shrink-0">
                        {p.name[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.mrn} · {p.phone}</p>
                      </div>
                    </button>
                  ))}
                </>
              ) : (
                <div className="px-4 py-4 text-center">
                  <p className="text-sm text-muted-foreground">No patients found</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Try a different name, MRN or contact</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── CENTER: staff-only quick actions ── */}
      {user.role === 'staff' && (
        <div className="hidden md:flex items-center gap-1.5 px-3">
          {STAFF_ACTIONS.map(action => (
            <button
              key={action.label}
              onClick={
              action.label === 'Register Patient' ? onRegisterPatient  :
              action.label === 'Book Appointment' ? onBookAppointment  :
              action.label === 'Generate Invoice' ? onGenerateInvoice  :
              undefined
            }
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 active:scale-95 transition-all shrink-0 whitespace-nowrap"
            >
              {action.icon}
              <span className="hidden lg:inline">{action.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* ── RIGHT: notifications + user ── */}
      <div className="flex items-center gap-2 flex-1 justify-end">

        {/* Notification bell */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => { setShowNotifications(v => !v); setShowUserMenu(false); }}
            className="relative p-2 rounded-lg hover:bg-muted text-foreground transition-colors"
            aria-label="Notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-secondary text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <span className="text-sm font-semibold text-foreground">Notifications</span>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-xs text-primary hover:underline">
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-border">
                {notifications.map(n => (
                  <div
                    key={n.id}
                    className={`flex gap-3 px-4 py-3 hover:bg-muted/50 transition-colors ${!n.read ? 'bg-primary/5' : ''}`}
                  >
                    <NotificationIcon type={n.type} />
                    <div className="min-w-0">
                      <p className={`text-sm ${!n.read ? 'font-semibold text-foreground' : 'font-medium text-foreground'}`}>
                        {n.message}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{n.detail}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 border-t border-border">
                <button className="w-full text-center text-sm text-primary hover:underline py-1">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User profile chip */}
        <div ref={userRef} className="relative">
          <button
            onClick={() => { setShowUserMenu(v => !v); setShowNotifications(false); }}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-bold shrink-0">
              {user.avatarInitials}
            </div>
            <div className="hidden md:flex flex-col items-start leading-tight">
              <span className="text-sm font-semibold text-foreground">{user.name}</span>
              <span className="text-xs text-muted-foreground">{user.designation}</span>
            </div>
            <ChevronDown size={14} className="text-muted-foreground hidden md:block" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-44 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50">
              <button className="flex items-center gap-3 w-full px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors">
                <UserCircle size={16} className="text-primary" />
                Profile
              </button>
              <div className="border-t border-border" />
              <button
                onClick={onLogout}
                className="flex items-center gap-3 w-full px-4 py-3 text-sm text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}

import * as styles from './Header.styles';
import { useState, useRef, useEffect, useMemo } from 'react';
import {
  Menu, Search, Bell, ChevronDown, LogOut, UserCircle,
  AlertCircle, Info, AlertTriangle, UserPlus, CalendarPlus, Receipt, X,
} from 'bfd-icons';
import type { User, Notification } from '../../../datapoints/auth';
import { mockNotifications } from '../../../datapoints/auth';
import { mockPatients } from '../../../datapoints/patients';
import type { Patient } from '../../../datapoints/patients';
import logo from '../../../assets/bharat_oncology_vector.svg';

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
  if (type === 'alert')   return <AlertCircle   size={16} className={styles.style1} />;
  if (type === 'warning') return <AlertTriangle size={16} className={styles.style2} />;
  return <Info size={16} className={styles.style3} />;
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
    <header className={styles.style4}>

      {/* ── LEFT: menu + logo + search ── */}
      <div className={styles.style5}>

        {/* Menu toggle */}
        <button
          onClick={onMenuToggle}
          className={styles.style6}
          aria-label="Toggle menu"
        >
          <Menu size={20} />
        </button>

        {/* Logo */}
        <img src={logoSrc ?? logo} alt="Bharat Oncology" className={styles.style7} />

        {/* Patient search */}
        <div ref={searchRef} className={styles.style8}>
          <Search
            size={15}
            className={styles.style9}
          />
          <input
            type="text"
            placeholder="Search by name, MRN, contact…"
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setShowSearchDrop(true); }}
            onFocus={() => searchQuery.trim() && setShowSearchDrop(true)}
            onKeyDown={e => e.key === 'Escape' && setShowSearchDrop(false)}
            className={styles.style10}
          />
          {searchQuery && (
            <button
              onClick={() => { setSearchQuery(''); setShowSearchDrop(false); }}
              className={styles.style11}
            >
              <X size={13} />
            </button>
          )}

          {/* Search results dropdown */}
          {showSearchDrop && searchQuery.trim() && (
            <div className={styles.style12}>
              {searchResults.length > 0 ? (
                <>
                  <p className={styles.style13}>
                    Patients
                  </p>
                  {searchResults.map(p => (
                    <button
                      key={p.id}
                      onClick={() => { setSearchQuery(''); setShowSearchDrop(false); onPatientSelect?.(p.id); }}
                      className={styles.style14}
                    >
                      <div className={styles.style15}>
                        {p.name[0]}
                      </div>
                      <div className={styles.style16}>
                        <p className={styles.style17}>{p.name}</p>
                        <p className={styles.style18}>{p.mrn} · {p.phone}</p>
                      </div>
                    </button>
                  ))}
                </>
              ) : (
                <div className={styles.style19}>
                  <p className={styles.style20}>No patients found</p>
                  <p className={styles.style21}>Try a different name, MRN or contact</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── CENTER: staff-only quick actions ── */}
      {user.role === 'staff' && (
        <div className={styles.style22}>
          {STAFF_ACTIONS.map(action => (
            <button
              key={action.label}
              onClick={
              action.label === 'Register Patient' ? onRegisterPatient  :
              action.label === 'Book Appointment' ? onBookAppointment  :
              action.label === 'Generate Invoice' ? onGenerateInvoice  :
              undefined
            }
              className={styles.style23}
            >
              {action.icon}
              <span className={styles.style24}>{action.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* ── RIGHT: notifications + user ── */}
      <div className={styles.style25}>

        {/* Notification bell */}
        <div ref={notifRef} className={styles.style26}>
          <button
            onClick={() => { setShowNotifications(v => !v); setShowUserMenu(false); }}
            className={styles.style27}
            aria-label="Notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className={styles.style28}>
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className={styles.style29}>
              <div className={styles.style30}>
                <span className={styles.style31}>Notifications</span>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className={styles.style32}>
                    Mark all read
                  </button>
                )}
              </div>
              <div className={styles.style33}>
                {notifications.map(n => (
                  <div
                    key={n.id}
                    className={`flex gap-3 px-4 py-3 hover:bg-muted/50 transition-colors ${!n.read ? 'bg-primary/5' : ''}`}
                  >
                    <NotificationIcon type={n.type} />
                    <div className={styles.style16}>
                      <p className={`text-sm ${!n.read ? 'font-semibold text-foreground' : 'font-medium text-foreground'}`}>
                        {n.message}
                      </p>
                      <p className={styles.style34}>{n.detail}</p>
                      <p className={styles.style21}>{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className={styles.style35}>
                <button className={styles.style36}>
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User profile chip */}
        <div ref={userRef} className={styles.style26}>
          <button
            onClick={() => { setShowUserMenu(v => !v); setShowNotifications(false); }}
            className={styles.style37}
          >
            <div className={styles.style38}>
              {user.avatarInitials}
            </div>
            <div className={styles.style39}>
              <span className={styles.style31}>{user.name}</span>
              <span className={styles.style18}>{user.designation}</span>
            </div>
            <ChevronDown size={14} className={styles.style40} />
          </button>

          {showUserMenu && (
            <div className={styles.style41}>
              <button className={styles.style42}>
                <UserCircle size={16} className={styles.style43} />
                Profile
              </button>
              <div className={styles.style44} />
              <button
                onClick={onLogout}
                className={styles.style45}
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

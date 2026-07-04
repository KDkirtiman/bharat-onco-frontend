import {
  ChevronLeft, ChevronRight, MapPin,
  LayoutDashboard, Users, Calendar, ClipboardList, FlaskConical,
  ShieldCheck, Settings, FileText, Heart, Stethoscope, UserCog, Package, ArmchairIcon,
} from 'lucide-react';
import type { CancerStaging } from '../../datapoints/staging';
import type { Role } from '../../datapoints/auth';
import { CENTERS } from '../../datapoints/scheduling';

export interface SidebarNavItem {
  icon:         React.ReactNode;
  label:        string;
  view?:        string;
  implemented?: boolean;
}

export const defaultNavByRole: Record<Role, SidebarNavItem[]> = {
  staff: [
    { icon: <LayoutDashboard size={18} />, label: 'Dashboard',   view: 'dashboard',  implemented: true },
    { icon: <Users          size={18} />, label: 'Patients',     view: 'patients',   implemented: true },
    { icon: <Calendar       size={18} />, label: 'Appointments', view: 'appointments' },
    { icon: <FileText       size={18} />, label: 'Billing',      view: 'billing',    implemented: true },
    { icon: <Package        size={18} />, label: 'Inventory',    view: 'inventory',  implemented: true },
    { icon: <Settings       size={18} />, label: 'Settings',     view: 'settings'   },
  ],
  nurse: [
    { icon: <LayoutDashboard size={18} />, label: 'Dashboard',        view: 'dashboard',         implemented: true },
    { icon: <Users           size={18} />, label: 'Patients',         view: 'patients',          implemented: true },
    { icon: <ArmchairIcon    size={18} />, label: 'Chair Management', view: 'chair-management',  implemented: true },
    { icon: <ClipboardList   size={18} />, label: 'Vitals & Notes' },
    { icon: <Calendar        size={18} />, label: 'Schedule'       },
    { icon: <FlaskConical    size={18} />, label: 'Medications'    },
    { icon: <Settings        size={18} />, label: 'Settings'       },
  ],
  oncologist: [
    { icon: <LayoutDashboard size={18} />, label: 'Dashboard',           view: 'dashboard',     implemented: true },
    { icon: <Stethoscope     size={18} />, label: 'My Patients'                                                   },
    { icon: <Calendar        size={18} />, label: 'Schedule'                                                      },
    { icon: <ClipboardList   size={18} />, label: 'Clinical Notes'                                                },
    { icon: <FlaskConical    size={18} />, label: 'Lab Results'                                                   },
    { icon: <Users           size={18} />, label: 'Tumor Board Review',  view: 'tumor-board',   implemented: true },
    { icon: <FileText        size={18} />, label: 'Billing',             view: 'billing',        implemented: true },
    { icon: <FileText        size={18} />, label: 'Reports'                                                       },
    { icon: <Settings        size={18} />, label: 'Settings'                                                      },
  ],
  admin: [
    { icon: <LayoutDashboard size={18} />, label: 'Dashboard',        view: 'dashboard',        implemented: true },
    { icon: <Users           size={18} />, label: 'All Patients'                                                  },
    { icon: <ArmchairIcon    size={18} />, label: 'Chair Management', view: 'chair-management', implemented: true },
    { icon: <UserCog         size={18} />, label: 'Staff Management'                                             },
    { icon: <ShieldCheck     size={18} />, label: 'Access Control'                                               },
    { icon: <FileText        size={18} />, label: 'Reports'                                                      },
    { icon: <FileText        size={18} />, label: 'Billing',          view: 'billing',          implemented: true },
    { icon: <Package         size={18} />, label: 'Inventory',        view: 'inventory',        implemented: true },
    { icon: <Settings        size={18} />, label: 'System Settings'                                              },
  ],
};

interface SidebarProps {
  open:            boolean;
  onClose:         () => void;
  onOpen:          () => void;
  role:            Role;
  isMobile:        boolean;
  selectedCenter:  string;
  onCenterChange:  (center: string) => void;
  activeView?:     string;
  onNavChange?:    (view: string) => void;
  stagingRecords?: CancerStaging[];
  navItems?:       SidebarNavItem[];
  centers?:        readonly string[];
}

export function Sidebar({ open, onClose, onOpen, role, isMobile, selectedCenter, onCenterChange, activeView, onNavChange, stagingRecords, navItems, centers }: SidebarProps) {
  const tumorBoardCount = stagingRecords?.filter(r => r.flaggedForTumorBoard).length ?? 0;
  const items = navItems ?? defaultNavByRole[role];
  const centerList = centers ?? CENTERS;

  const sidebarWidth = isMobile ? (open ? 'w-64' : 'w-0') : (open ? 'w-56' : 'w-14');

  return (
    <>
      {/* Mobile backdrop */}
      {isMobile && open && (
        <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      )}

      <aside
        className={`
          ${isMobile ? 'fixed inset-y-0 left-0 z-50' : 'fixed top-16 bottom-0 left-0 z-30'}
          flex flex-col bg-sidebar border-r border-sidebar-border
          transition-all duration-300 overflow-hidden shrink-0
          ${sidebarWidth}
        `}
      >
        {/* Inner container always 224px wide so content doesn't reflow */}
        <div className="flex flex-col h-full w-56">

          {/* ── Active Center (shown only when expanded) ── */}
          <div className={`border-b border-sidebar-border shrink-0 transition-all duration-300 ${open ? 'px-4 pt-4 pb-3 opacity-100' : 'px-2 pt-3 pb-2 opacity-0 pointer-events-none h-0 overflow-hidden'}`}>
            <div className="flex items-center gap-1.5 mb-2">
              <MapPin size={13} className="text-primary" />
              <span className="text-xs font-semibold text-primary tracking-wide">Active Center</span>
            </div>
            {role === 'admin' ? (
              <select
                value={selectedCenter}
                onChange={e => onCenterChange(e.target.value)}
                className="w-full text-sm font-medium bg-card text-foreground border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
              >
                {centerList.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            ) : (
              <div className="w-full text-sm font-medium bg-card text-foreground border border-border rounded-lg px-3 py-2">
                {selectedCenter}
              </div>
            )}
          </div>

          {/* ── Nav items ── */}
          <nav className="flex-1 py-3 overflow-y-auto overflow-x-hidden">
            {items.map((item) => {
              const active   = !!(activeView && item.view && item.view === activeView);
              const disabled = !item.implemented;
              return (
                <button
                  key={item.label}
                  title={!open ? item.label : disabled ? `${item.label} — Coming Soon` : undefined}
                  disabled={disabled}
                  onClick={() => {
                    if (!disabled && item.view && onNavChange) onNavChange(item.view);
                  }}
                  className={`
                    relative flex items-center gap-3 py-2.5 rounded-lg text-sm font-medium
                    transition-colors duration-150 text-left w-full
                    ${open ? 'px-3 mx-2' : 'px-0 mx-0 justify-center'}
                    ${disabled
                      ? 'opacity-40 cursor-not-allowed text-sidebar-foreground'
                      : active
                      ? 'bg-sidebar-accent text-sidebar-primary'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                    }
                  `}
                  style={open ? { width: 'calc(100% - 16px)' } : { width: '100%' }}
                >
                  <span className={`shrink-0 ${active ? 'text-sidebar-primary' : 'text-sidebar-foreground/70'}`}>
                    {item.icon}
                  </span>
                  {open && (
                    <>
                      <span className="truncate flex-1">{item.label}</span>
                      {disabled && <span className="shrink-0 text-[9px] text-sidebar-foreground/50 font-medium">Soon</span>}
                      {!disabled && item.view === 'tumor-board' && tumorBoardCount > 0 && (
                        <span className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700">
                          {tumorBoardCount}
                        </span>
                      )}
                    </>
                  )}
                  {!open && item.view === 'tumor-board' && tumorBoardCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* ── Collapse / Expand toggle (desktop only) ── */}
          {!isMobile && (
            <button
              onClick={open ? onClose : onOpen}
              className="flex items-center gap-2 px-4 py-3 border-t border-sidebar-border text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
              title={open ? 'Collapse' : 'Expand'}
            >
              {open ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
              {open && <span>Collapse</span>}
            </button>
          )}

        </div>
      </aside>
    </>
  );
}

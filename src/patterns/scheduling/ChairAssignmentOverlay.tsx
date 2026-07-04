import { useState } from 'react';
import { Armchair, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/cn';
import type { Appointment } from '../../datapoints/scheduling';
import type { Patient } from '../../datapoints/patients';
import type { Chair } from '../../datapoints/chairs';
import { Button } from '../../components/controls/Button';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../../components/layout/Modal';

interface Props {
  appointment:    Appointment;
  patient:        Patient;
  selectedCenter: string;
  chairs:         Chair[];
  onAssign:       (chairId: string) => void;
  onClose:        () => void;
}

export function ChairAssignmentOverlay({ appointment, patient, selectedCenter, chairs, onAssign, onClose }: Props) {
  const centerChairs   = chairs.filter(c => c.center === selectedCenter);
  const availableCount = centerChairs.filter(c => c.status === 'available').length;
  const bays           = [...new Set(centerChairs.map(c => c.bay))];

  const [selected, setSelected] = useState<string | null>(appointment.chairId ?? null);

  return (
    <Modal
      onClose={onClose}
      size="lg"
      overlayClassName="bg-black/40 backdrop-blur-sm"
      className="shadow-xl"
    >
      <ModalHeader
        title="Assign Infusion Chair"
        icon={<Armchair size={18} className="text-indigo-600" />}
        onClose={onClose}
      />

      {/* Patient strip */}
      <div className="px-6 py-3 bg-muted/30 border-b border-border shrink-0">
        <p className="text-sm font-medium text-foreground">{patient.name}</p>
        <p className="text-xs text-muted-foreground">{patient.mrn} · {appointment.visitId}</p>
      </div>

      {/* Chair grid grouped by bay */}
      <ModalBody className="max-h-72 py-4 space-y-4">
        {centerChairs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Armchair size={32} className="opacity-30 mx-auto mb-2" />
            <p className="text-sm">No chairs configured for {selectedCenter}</p>
          </div>
        ) : (
          bays.map(bay => (
            <div key={bay}>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{bay}</p>
              <div className="grid grid-cols-4 gap-2">
                {centerChairs.filter(c => c.bay === bay).map(chair => {
                  const isAvailable = chair.status === 'available';
                  const isSelected  = selected === chair.id;
                  return (
                    <button
                      key={chair.id}
                      disabled={!isAvailable}
                      onClick={() => setSelected(chair.id)}
                      className={cn(
                        'flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all',
                        isSelected
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : isAvailable
                          ? 'border-border bg-card hover:border-indigo-300 hover:bg-indigo-50/50 text-foreground'
                          : 'border-border cursor-not-allowed opacity-40',
                        chair.status === 'occupied'     && 'bg-amber-50',
                        chair.status === 'maintenance'  && 'bg-muted/30',
                      )}
                    >
                      <Armchair size={18} />
                      <span className="text-xs font-bold">{chair.name}</span>
                      <span className={cn(
                        'text-[10px] font-medium px-1.5 py-0.5 rounded-full leading-tight',
                        chair.status === 'available'   ? 'bg-green-100 text-green-700'   :
                        chair.status === 'occupied'    ? 'bg-amber-100 text-amber-700'   :
                                                        'bg-gray-100 text-gray-500',
                      )}>
                        {chair.status === 'available'   ? 'Free'        :
                         chair.status === 'occupied'    ? 'Occupied'    :
                                                         'Maint.'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </ModalBody>

      <ModalFooter className="justify-between">
        <p className="text-xs text-muted-foreground">
          {availableCount} of {centerChairs.length} chairs available
        </p>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="bg-muted hover:bg-muted/80 px-4" onClick={onClose}>
            Cancel
          </Button>
          <button
            onClick={() => selected && onAssign(selected)}
            disabled={!selected}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <CheckCircle2 size={14} />
            Assign Chair
          </button>
        </div>
      </ModalFooter>
    </Modal>
  );
}

import { useState, useRef } from 'react';
import { Upload } from 'lucide-react';
import type { Patient } from '../../datapoints/patients';
import { MEDICAL_RECORD_CATEGORIES } from '../../datapoints/geodata';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../../components/layout/Modal';
import { Button } from '../../components/controls/Button';
import { FormField } from '../../components/controls/FormField';
import { Select } from '../../components/controls/Select';

interface Props {
  patient:          Patient;
  onPatientsChange: React.Dispatch<React.SetStateAction<Patient[]>>;
  onClose:          () => void;
}

export function UploadDocumentOverlay({ patient, onPatientsChange, onClose }: Props) {
  const [category,    setCategory]    = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [fileName,    setFileName]    = useState('');
  const [fileUrl,     setFileUrl]     = useState('');
  const [uploading,   setUploading]   = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const selectedCat = MEDICAL_RECORD_CATEGORIES.find(c => c.category === category);

  function handleCategoryChange(val: string) {
    setCategory(val);
    setSubcategory('');
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => setFileUrl(reader.result as string);
    reader.readAsDataURL(file);
  }

  function handleUpload() {
    if (!category || !subcategory || !fileName) return;
    setUploading(true);
    const now = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const newDoc = { type: category, subcategory, fileName, uploadedAt: now, fileUrl };
    onPatientsChange(prev => prev.map(p =>
      p.id === patient.id
        ? { ...p, uploadedDocuments: [newDoc, ...(p.uploadedDocuments ?? [])] }
        : p,
    ));
    setUploading(false);
    onClose();
  }

  const canUpload = !!(category && subcategory && fileName);

  return (
    <Modal onClose={onClose} size="sm">
      <ModalHeader title="Upload Document" onClose={onClose} />

      <ModalBody scroll={false} className="space-y-4">
        {/* Category */}
        <FormField label="Category" required>
          <Select
            value={category}
            onChange={e => handleCategoryChange(e.target.value)}
          >
            <option value="">Select category</option>
            {MEDICAL_RECORD_CATEGORIES.map(c => (
              <option key={c.category} value={c.category}>{c.category}</option>
            ))}
          </Select>
        </FormField>

        {/* Subcategory */}
        <FormField label="Sub Category" required>
          <Select
            value={subcategory}
            onChange={e => setSubcategory(e.target.value)}
            disabled={!selectedCat}
            className="disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <option value="">Select sub category</option>
            {selectedCat?.subcategories.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </Select>
        </FormField>

        {/* File picker */}
        <FormField label="File" required>
          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileRef}
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              onChange={handleFileChange}
            />
            <div className="flex-1 px-3 py-2 text-sm border border-border rounded-lg bg-muted/30 text-muted-foreground truncate min-w-0">
              {fileName || 'No file chosen'}
            </div>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="shrink-0 px-3 py-2 text-sm font-medium border border-border rounded-lg hover:bg-muted transition-colors"
            >
              Browse
            </button>
          </div>
        </FormField>
      </ModalBody>

      <ModalFooter>
        <Button variant="ghost" size="sm" className="bg-muted hover:bg-muted/80" onClick={onClose}>
          Cancel
        </Button>
        <Button
          size="sm"
          onClick={handleUpload}
          disabled={!canUpload || uploading}
          className="gap-2"
        >
          <Upload size={14} />
          Upload
        </Button>
      </ModalFooter>
    </Modal>
  );
}

import * as styles from './UploadDocumentOverlay.styles';
import { useState, useRef } from 'react';
import { Upload } from 'bfd-icons';
import type { Patient } from 'bfd-core';
import { MEDICAL_RECORD_CATEGORIES } from 'bfd-core';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'bfd-core';
import { Button } from 'bfd-core';
import { FormField } from 'bfd-core';
import { Select } from 'bfd-core';

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

      <ModalBody scroll={false} className={styles.style1}>
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
            className={styles.style2}
          >
            <option value="">Select sub category</option>
            {selectedCat?.subcategories.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </Select>
        </FormField>

        {/* File picker */}
        <FormField label="File" required>
          <div className={styles.style3}>
            <input
              type="file"
              ref={fileRef}
              className={styles.style4}
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              onChange={handleFileChange}
            />
            <div className={styles.style5}>
              {fileName || 'No file chosen'}
            </div>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className={styles.style6}
            >
              Browse
            </button>
          </div>
        </FormField>
      </ModalBody>

      <ModalFooter>
        <Button variant="ghost" size="sm" className={styles.style7} onClick={onClose}>
          Cancel
        </Button>
        <Button
          size="sm"
          onClick={handleUpload}
          disabled={!canUpload || uploading}
          className={styles.style8}
        >
          <Upload size={14} />
          Upload
        </Button>
      </ModalFooter>
    </Modal>
  );
}

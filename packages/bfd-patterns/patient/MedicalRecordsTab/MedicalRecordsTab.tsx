import * as styles from './MedicalRecordsTab.styles';
import { useState } from 'react';
import { Upload, Eye, Download, FolderOpen, FileText } from 'bfd-icons';
import type { Patient } from 'bfd-core';
import { MEDICAL_RECORD_CATEGORIES } from 'bfd-core';
import { UploadDocumentOverlay } from '../../patterns/clinical/UploadDocumentOverlay';
import { DocumentViewerOverlay } from '../../patterns/clinical/DocumentViewerOverlay';

interface Props {
  patient:          Patient;
  onPatientsChange: React.Dispatch<React.SetStateAction<Patient[]>>;
}

type Doc = NonNullable<Patient['uploadedDocuments']>[number];

const CATEGORY_COLORS: Record<string, string> = {
  'Lab Work':                'bg-info-soft text-info-emphasis',
  'Radiology':               'bg-violet-soft text-violet-emphasis',
  'Pathology':               'bg-orange-soft text-orange-emphasis',
  'Molecular Testing':       'bg-success-soft text-success-emphasis',
  'External Medical Records':'bg-sky-soft text-sky-emphasis',
  'Others':                  'bg-muted text-muted-foreground',
};

export function MedicalRecordsTab({ patient, onPatientsChange }: Props) {
  const [activeCategory, setActiveCategory] = useState(MEDICAL_RECORD_CATEGORIES[0].category);
  const [showUpload,     setShowUpload]      = useState(false);
  const [viewingDoc,     setViewingDoc]      = useState<Doc | null>(null);

  const allDocs = patient.uploadedDocuments ?? [];

  const tabDocs = allDocs
    .filter(d => d.type === activeCategory)
    .sort((a, b) => {
      // Parse dd/mm/yyyy for sort — convert to ISO-like yyyymmdd
      const toSort = (s: string) => {
        const parts = s.split('/');
        if (parts.length === 3) return `${parts[2]}${parts[1]}${parts[0]}`;
        return s;
      };
      return toSort(b.uploadedAt).localeCompare(toSort(a.uploadedAt));
    });

  function handleDownload(doc: Doc) {
    if (!doc.fileUrl) return;
    const a = document.createElement('a');
    a.href = doc.fileUrl;
    a.download = doc.fileName;
    a.click();
  }

  return (
    <>
      <div className={styles.style1}>
        {/* Top bar */}
        <div className={styles.style2}>
          <p className={styles.style3}>Medical Records</p>
          <button
            onClick={() => setShowUpload(true)}
            className={styles.style4}
          >
            <Upload size={14} />
            Upload Document
          </button>
        </div>

        {/* Horizontal category tabs */}
        <div className={styles.style5}>
          <div className={styles.style6}>
            {MEDICAL_RECORD_CATEGORIES.map(cat => (
              <button
                key={cat.category}
                onClick={() => setActiveCategory(cat.category)}
                className={`px-4 py-2.5 text-sm whitespace-nowrap border-b-2 transition-colors ${
                  activeCategory === cat.category
                    ? 'border-primary text-primary font-semibold'
                    : 'border-transparent text-muted-foreground hover:text-foreground font-medium'
                }`}
              >
                {cat.category}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        {tabDocs.length === 0 ? (
          <div className={styles.style7}>
            <FolderOpen size={36} className={styles.style8} />
            <p className={styles.style9}>No {activeCategory} records uploaded</p>
            <p className={styles.style10}>Click "Upload Document" to add records to this category.</p>
          </div>
        ) : (
          <div className={styles.style11}>
            <table className={styles.style12}>
              <thead>
                <tr className={styles.style13}>
                  <th className={styles.style14}>Sub Category</th>
                  <th className={styles.style14}>File Name</th>
                  <th className={styles.style14}>Uploaded</th>
                  <th className={styles.style15} />
                </tr>
              </thead>
              <tbody>
                {tabDocs.map((doc, i) => (
                  <tr key={i} className={styles.style16}>
                    <td className={styles.style17}>
                      {doc.subcategory ? (
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${CATEGORY_COLORS[doc.type] ?? 'bg-muted text-muted-foreground'}`}>
                          {doc.subcategory}
                        </span>
                      ) : (
                        <span className={styles.style18}>—</span>
                      )}
                    </td>
                    <td className={styles.style17}>
                      <button
                        onClick={() => setViewingDoc(doc)}
                        className={styles.style19}
                      >
                        <FileText size={13} className={styles.style20} />
                        <span className={styles.style21}>{doc.fileName}</span>
                      </button>
                    </td>
                    <td className={styles.style22}>{doc.uploadedAt}</td>
                    <td className={styles.style17}>
                      <div className={styles.style23}>
                        <button
                          onClick={() => setViewingDoc(doc)}
                          className={styles.style24}
                          title="View"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => handleDownload(doc)}
                          disabled={!doc.fileUrl}
                          className={styles.style25}
                          title="Download"
                        >
                          <Download size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showUpload && (
        <UploadDocumentOverlay
          patient={patient}
          onPatientsChange={onPatientsChange}
          onClose={() => setShowUpload(false)}
        />
      )}

      {viewingDoc && (
        <DocumentViewerOverlay
          doc={viewingDoc}
          onClose={() => setViewingDoc(null)}
        />
      )}
    </>
  );
}

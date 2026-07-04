import { useState } from 'react';
import { Upload, Eye, Download, FolderOpen, FileText } from 'lucide-react';
import type { Patient } from '../../datapoints/patients';
import { MEDICAL_RECORD_CATEGORIES } from '../../datapoints/geodata';
import { UploadDocumentOverlay } from '../../patterns/clinical/UploadDocumentOverlay';
import { DocumentViewerOverlay } from '../../patterns/clinical/DocumentViewerOverlay';

interface Props {
  patient:          Patient;
  onPatientsChange: React.Dispatch<React.SetStateAction<Patient[]>>;
}

type Doc = NonNullable<Patient['uploadedDocuments']>[number];

const CATEGORY_COLORS: Record<string, string> = {
  'Lab Work':                'bg-blue-100 text-blue-700',
  'Radiology':               'bg-violet-100 text-violet-700',
  'Pathology':               'bg-orange-100 text-orange-700',
  'Molecular Testing':       'bg-green-100 text-green-700',
  'External Medical Records':'bg-sky-100 text-sky-700',
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
      <div className="space-y-4">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-foreground">Medical Records</p>
          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Upload size={14} />
            Upload Document
          </button>
        </div>

        {/* Horizontal category tabs */}
        <div className="border-b border-border">
          <div className="flex overflow-x-auto scrollbar-hide -mb-px">
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
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <FolderOpen size={36} className="text-muted-foreground/40 mb-3" />
            <p className="text-sm font-medium text-muted-foreground">No {activeCategory} records uploaded</p>
            <p className="text-xs text-muted-foreground mt-1">Click "Upload Document" to add records to this category.</p>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left py-2.5 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Sub Category</th>
                  <th className="text-left py-2.5 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">File Name</th>
                  <th className="text-left py-2.5 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Uploaded</th>
                  <th className="py-2.5 px-4 w-20" />
                </tr>
              </thead>
              <tbody>
                {tabDocs.map((doc, i) => (
                  <tr key={i} className="border-t border-border hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4">
                      {doc.subcategory ? (
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${CATEGORY_COLORS[doc.type] ?? 'bg-muted text-muted-foreground'}`}>
                          {doc.subcategory}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => setViewingDoc(doc)}
                        className="flex items-center gap-2 text-sm text-primary hover:underline text-left max-w-[220px] truncate"
                      >
                        <FileText size={13} className="shrink-0" />
                        <span className="truncate">{doc.fileName}</span>
                      </button>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground whitespace-nowrap">{doc.uploadedAt}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          onClick={() => setViewingDoc(doc)}
                          className="p-1.5 rounded-lg text-primary hover:bg-primary/10 transition-colors"
                          title="View"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => handleDownload(doc)}
                          disabled={!doc.fileUrl}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
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

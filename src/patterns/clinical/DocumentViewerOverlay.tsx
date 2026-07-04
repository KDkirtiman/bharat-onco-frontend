import { X, Download, FileText } from 'lucide-react';
import { Modal } from '../../components/layout/Modal';
import { Button } from '../../components/controls/Button';
import { IconButton } from '../../components/controls/IconButton';

interface Doc {
  type:        string;
  subcategory?: string;
  fileName:    string;
  uploadedAt:  string;
  fileUrl?:    string;
}

interface Props {
  doc:     Doc;
  onClose: () => void;
}

export function DocumentViewerOverlay({ doc, onClose }: Props) {
  function handleDownload() {
    if (!doc.fileUrl) return;
    const a = document.createElement('a');
    a.href = doc.fileUrl;
    a.download = doc.fileName;
    a.click();
  }

  return (
    <Modal onClose={onClose} className="max-w-4xl h-[90vh]">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <FileText size={18} className="text-primary shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{doc.fileName}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {[doc.subcategory, doc.type].filter(Boolean).join(' · ')} · Uploaded {doc.uploadedAt}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-4">
          {doc.fileUrl && (
            <Button size="sm" onClick={handleDownload} className="gap-2">
              <Download size={14} />
              Download
            </Button>
          )}
          <IconButton icon={<X size={18} />} label="Close" onClick={onClose} />
        </div>
      </div>

      {/* Viewer body */}
      {doc.fileUrl ? (
        <iframe
          src={doc.fileUrl}
          className="flex-1 w-full rounded-b-2xl"
          title={doc.fileName}
          style={{ border: 'none' }}
        />
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-6">
          <FileText size={48} className="text-muted-foreground/30" />
          <p className="text-sm font-medium text-muted-foreground">Preview not available</p>
          <p className="text-xs text-muted-foreground max-w-xs">
            This is a mock document — no file content is stored. Upload a real file to enable preview.
          </p>
        </div>
      )}
    </Modal>
  );
}

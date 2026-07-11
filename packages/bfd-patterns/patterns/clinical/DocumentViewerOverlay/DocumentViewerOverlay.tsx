import * as styles from './DocumentViewerOverlay.styles';
import { X, Download, FileText } from 'bfd-icons';
import { Modal } from 'bfd-core';
import { Button } from 'bfd-core';
import { IconButton } from 'bfd-core';

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
    <Modal onClose={onClose} className={styles.style1}>
      {/* Header */}
      <div className={styles.style2}>
        <div className={styles.style3}>
          <FileText size={18} className={styles.style4} />
          <div className={styles.style5}>
            <p className={styles.style6}>{doc.fileName}</p>
            <p className={styles.style7}>
              {[doc.subcategory, doc.type].filter(Boolean).join(' · ')} · Uploaded {doc.uploadedAt}
            </p>
          </div>
        </div>
        <div className={styles.style8}>
          {doc.fileUrl && (
            <Button size="sm" onClick={handleDownload} className={styles.style9}>
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
          className={styles.style10}
          title={doc.fileName}
          style={{ border: 'none' }}
        />
      ) : (
        <div className={styles.style11}>
          <FileText size={48} className={styles.style12} />
          <p className={styles.style13}>Preview not available</p>
          <p className={styles.style14}>
            This is a mock document — no file content is stored. Upload a real file to enable preview.
          </p>
        </div>
      )}
    </Modal>
  );
}

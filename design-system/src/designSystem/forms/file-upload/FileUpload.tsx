import { useCallback, type ChangeEvent, type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '../../utils/cn';
import { useControllableState } from '../../utils/useControllableState';
import { useStableId } from '../../utils/useStableId';

import styles from './fileUpload.module.css';

export type UploadedFile = {
  id: string;
  file: File;
};

export type FileUploadProps = Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> & {
  value?: UploadedFile[];
  defaultValue?: UploadedFile[];
  onValueChange?: (files: UploadedFile[]) => void;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  label?: string;
  helperText?: ReactNode;
  maxFiles?: number;
};

function toUploaded(files: FileList | null): UploadedFile[] {
  if (!files) return [];
  return Array.from(files).map((file) => ({
    id: `${file.name}-${file.size}-${file.lastModified}`,
    file,
  }));
}

export function FileUpload({
  value,
  defaultValue = [],
  onValueChange,
  accept,
  multiple = true,
  disabled = false,
  label = 'Upload files',
  helperText,
  maxFiles,
  className,
  ...rest
}: FileUploadProps) {
  const inputId = useStableId('ds-file-upload');
  const [files, setFiles] = useControllableState<UploadedFile[]>({
    value,
    defaultValue,
    onChange: onValueChange,
  });

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const incoming = toUploaded(event.target.files);
      const current = files ?? [];
      const merged = multiple ? [...current, ...incoming] : incoming;
      const limited = maxFiles !== undefined ? merged.slice(0, maxFiles) : merged;
      setFiles(limited);
      event.target.value = '';
    },
    [files, maxFiles, multiple, setFiles],
  );

  const removeFile = (id: string) => {
    const current = files ?? [];
    setFiles(current.filter((f) => f.id !== id));
  };
  return (
    <div {...rest} className={cn(styles.root, className)}>
      <label className={cn(styles.dropzone, disabled && styles.disabled)}>
        <span className={styles.label}>{label}</span>
        {helperText ? <span className={styles.helper}>{helperText}</span> : null}
        <input
          id={inputId}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={handleChange}
          className={styles.input}
        />
      </label>
      {(files ?? []).length > 0 ? (
        <ul className={styles.list} aria-label="Uploaded files">
          {(files ?? []).map(({ id, file }) => (
            <li key={id} className={styles.item}>
              <span className={styles.fileName}>{file.name}</span>
              <span className={styles.fileSize}>{Math.round(file.size / 1024)} KB</span>
              {!disabled ? (
                <button
                  type="button"
                  className={styles.remove}
                  onClick={() => removeFile(id)}
                  aria-label={`Remove ${file.name}`}
                >
                  ×
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

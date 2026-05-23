import { useId } from 'react';

export function useStableId(prefix = 'ds') {
  const id = useId();
  return `${prefix}-${id.replace(/:/g, '')}`;
}

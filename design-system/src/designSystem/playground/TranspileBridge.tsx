import { useContext, useEffect, type RefObject } from 'react';
import { LiveContext } from 'react-live';

type TranspileBridgeProps = {
  transpileRef: RefObject<(code: string) => void>;
};

/** Keeps LiveProvider's transpile callback in a ref for the isolated editor pane. */
export function TranspileBridge({ transpileRef }: TranspileBridgeProps) {
  const { onChange } = useContext(LiveContext) as { onChange: (code: string) => void };

  useEffect(() => {
    transpileRef.current = onChange;
  }, [onChange, transpileRef]);

  return null;
}

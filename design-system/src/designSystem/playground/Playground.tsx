import { LiveEditor } from './LiveEditor';
import { defaultPlaygroundCode } from './defaultCode';

export function Playground() {
  return <LiveEditor code={defaultPlaygroundCode} title="Composition playground" />;
}

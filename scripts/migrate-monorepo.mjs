import fs from 'node:fs';
import path from 'node:path';
const ROOT = process.cwd();
function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const f = path.join(dir, e.name);
    if (e.isDirectory()) walk(f, files);
    else if (/\.(tsx?)$/.test(e.name)) files.push(f);
  }
  return files;
}
function patch(file, reps) {
  let c = fs.readFileSync(file, 'utf8'), o = c;
  for (const [a,b] of reps) c = c.split(a).join(b);
  if (c !== o) fs.writeFileSync(file, c);
}
const P = [
  ["from '../../tokens/semantic-colors'", "from 'bfd-themes'"],
  ["from '../../../tokens/semantic-colors'", "from 'bfd-themes'"],
  ["from '../tokens/semantic-colors'", "from 'bfd-themes'"],
  ["from 'lucide-react'", "from 'bfd-icons'"],
  ["from '../../lib/cn'", "from '../lib/cn'"],
  ["from '../../../lib/cn'", "from '../../lib/cn'"],
  ["from '../../../../lib/cn'", "from '../../../lib/cn'"],
  ["from '../../lib/formatters'", "from '../lib/formatters'"],
  ["from '../../../lib/formatters'", "from '../../lib/formatters'"],
  ["from '../../../../lib/formatters'", "from '../../../lib/formatters'"],
  ["from '../../components/feedback/StatusBadge'", "from 'bfd-core'"],
  ["from '../../../components/feedback/StatusBadge'", "from 'bfd-core'"],
  ["from '../../components/controls/Button'", "from 'bfd-core'"],
  ["from '../../../components/controls/Button'", "from 'bfd-core'"],
  ["from '../../components/layout/Modal'", "from 'bfd-core'"],
  ["from '../../../components/layout/Modal'", "from 'bfd-core'"],
  ["from '../../components/controls/FormField'", "from 'bfd-core'"],
  ["from '../../../components/controls/FormField'", "from 'bfd-core'"],
  ["from '../../components/controls/TextField'", "from 'bfd-core'"],
  ["from '../../../components/controls/TextField'", "from 'bfd-core'"],
  ["from '../../components/controls/Select'", "from 'bfd-core'"],
  ["from '../../../components/controls/Select'", "from 'bfd-core'"],
  ["from '../../components/controls/Textarea'", "from 'bfd-core'"],
  ["from '../../components/controls/Checkbox'", "from 'bfd-core'"],
  ["from '../../components/controls/DatePicker'", "from 'bfd-core'"],
  ["from '../../components/controls/SearchCombobox'", "from 'bfd-core'"],
  ["from '../../components/controls/Input'", "from 'bfd-core'"],
  ["from '../../components/feedback/Callout'", "from 'bfd-core'"],
  ["from '../../components/feedback/EmptyState'", "from 'bfd-core'"],
  ["from '../../lib/invoiceTemplate'", "from '../lib/invoiceTemplate'"],
  ["from '../../../lib/invoiceTemplate'", "from '../../lib/invoiceTemplate'"],
];
const DP = [
  ["from '../../datapoints/", "from '../datapoints/"],
  ["from '../../../datapoints/", "from '../../datapoints/"],
  ["from '../../../../datapoints/", "from '../../../datapoints/"],
];
for (const pkg of ['bfd-core','bfd-patterns']) {
  for (const f of walk(path.join(ROOT,'src/packages',pkg,'src'))) { patch(f,P); if(pkg==='bfd-patterns') patch(f,DP); }
}
for (const f of walk(path.join(ROOT,'src/packages/bfd-patterns/src/datapoints'))) patch(f,[["from '../tokens/semantic-colors'","from 'bfd-themes'"]]);
console.log('imports patched');

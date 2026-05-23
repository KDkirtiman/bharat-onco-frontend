import type { Token } from 'prism-react-renderer';

const ATTR_NAME = /^(\s*)([a-zA-Z][\w-]*)(\s*)$/;

/**
 * Prism leaves JSX tag mode when attribute values have spaces around `=` (e.g. `value= "x"`).
 * Re-label plain attribute-name chunks so theme / class fallbacks still apply.
 */
export function refinePlaygroundTokens(lines: Token[][]): Token[][] {
  return lines.map((line) => {
    const out: Token[] = [];

    for (const token of line) {
      if (token.empty) continue;

      if (token.types.includes('plain') && ATTR_NAME.test(token.content)) {
        const match = token.content.match(ATTR_NAME);
        if (match) {
          const [, leading, name, trailing] = match;
          if (leading) out.push({ types: ['plain'], content: leading });
          out.push({ types: ['tag', 'attr-name'], content: name });
          if (trailing) out.push({ types: ['plain'], content: trailing });
          continue;
        }
      }

      out.push(token);
    }

    return out;
  });
}

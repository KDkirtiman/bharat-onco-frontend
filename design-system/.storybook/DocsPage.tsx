import {
  Controls,
  Description,
  Primary,
  Stories,
  Subtitle,
  Title,
  useOf,
} from '@storybook/addon-docs/blocks';

import {
  ComponentGuide,
  PropsReferenceIntro,
  type ComponentGuideProps,
} from '../src/designSystem/docs/ComponentGuide';
import { LiveEditor } from '../src/designSystem/playground/LiveEditor';

type DocsGuide = ComponentGuideProps;

type DocsParameters = {
  liveCode?: string;
  liveCodeTitle?: string;
  /** Copy-paste-ready TSX — shown via story “Show code” (see preview source transform) */
  usageCode?: string;
  docs?: {
    subtitle?: string;
    guide?: DocsGuide;
  };
};

export function DocsPage() {
  const resolved = useOf('meta', ['meta']);
  const parameters = (resolved.preparedMeta?.parameters ?? {}) as DocsParameters;
  const liveCode = parameters.liveCode;
  const liveCodeTitle = parameters.liveCodeTitle ?? 'Try it live';
  const guide = parameters.docs?.guide;

  return (
    <>
      <Title />
      <Subtitle />
      <Description />
      {guide ? (
        <ComponentGuide
          whenToUse={guide.whenToUse}
          capabilities={guide.capabilities}
          scenarios={guide.scenarios}
          related={guide.related}
        />
      ) : null}
      {liveCode ? <LiveEditor code={liveCode} title={liveCodeTitle} /> : null}
      <Primary />
      <PropsReferenceIntro />
      <Controls />
      <Stories />
    </>
  );
}

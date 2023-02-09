import copy from 'clipboard-copy';
import { createUrl } from 'playroom/utils';
import { ReactNode, useEffect, useId, useState } from 'react';

import { ActionButton } from '@voussoir/button';
import { chevronDownIcon } from '@voussoir/icon/icons/chevronDownIcon';
import { copyIcon } from '@voussoir/icon/icons/copyIcon';
import { editIcon } from '@voussoir/icon/icons/editIcon';
import { Icon } from '@voussoir/icon';
import { Box, Flex } from '@voussoir/layout';
import { ClearSlots } from '@voussoir/slots';
import { css, tokenSchema, transition } from '@voussoir/style';
import { Text } from '@voussoir/typography';

import { Highlight } from '../highlight';
import { placeholderCounter } from '../../example-helpers';
import * as scope from '../../scope';
import { RenderLiveCode } from './eval';
import { LiveCodeInfo } from '../../../markdoc/nodes/fence.markdoc';

const eagerScope = { ...scope };

function SnippetController({
  children,
  code,
  exampleType,
}: {
  children: ReactNode;
  code: string;
  exampleType: 'jsx' | 'function';
}) {
  const playroomUrl = createUrl({
    baseUrl: process.env.NEXT_PUBLIC_PLAYROOM_URL,
    code:
      exampleType === 'jsx'
        ? code
        : `<Render>\n  {() => {\n    ${code
            .split('\n')
            .join('\n    ')}\n  }}\n</Render>`,
  });

  // show/hide code behaviour
  const [collapsed, setCollapsed] = useState(true);
  const [hidden, setHidden] = useState(collapsed);
  const id = useId();
  const triggerId = `trigger-${id}`;
  const panelId = `panel-${id}`;
  useEffect(() => {
    if (!collapsed) {
      setHidden(collapsed);
    }
  }, [collapsed]);

  return (
    <>
      <Flex
        alignItems="center"
        justifyContent="space-between"
        paddingY="medium"
        paddingX="large"
      >
        <ActionButton
          prominence="low"
          onPress={() => setCollapsed(v => !v)}
          id={triggerId}
          aria-controls={panelId}
          aria-expanded={!collapsed}
        >
          <Icon
            src={chevronDownIcon}
            data-expanded={!collapsed || undefined}
            UNSAFE_className={css({
              transition: transition('transform'),

              '&[data-expanded]': {
                transform: `rotate(180deg)`,
              },
            })}
          />
          <Text>
            <Text visuallyHidden>Show </Text>Code
          </Text>
        </ActionButton>

        <Flex
          onTransitionEnd={() => setHidden(collapsed)}
          // styles
          alignItems="center"
          gap="small"
          marginStart="auto"
          UNSAFE_className={css({
            opacity: collapsed ? 0 : 1,
            transform: `translateX(${collapsed ? '0.5rem' : 0})`,
            transition: transition(['opacity', 'transform'], {
              easing: 'easeOut',
            }),
          })}
          UNSAFE_style={{ visibility: hidden ? 'hidden' : 'visible' }}
        >
          {hidden ? null : (
            <>
              <ActionButton
                prominence="low"
                onPress={() => window.open(playroomUrl, '_blank')}
                isDisabled
              >
                <Icon src={editIcon} />
                <Text>Edit</Text>
              </ActionButton>
              <ActionButton prominence="low" onPress={() => copy(code)}>
                <Icon src={copyIcon} />
                <Text>Copy</Text>
              </ActionButton>
            </>
          )}
        </Flex>
      </Flex>

      <div role="region" aria-labelledby={triggerId}>
        {collapsed ? null : children}
      </div>
    </>
  );
}

function RenderedCodeExample({ children }: { children: ReactNode }) {
  return (
    <Box
      overflow="auto"
      padding="large"
      backgroundColor="canvas"
      borderTopStartRadius="large"
      borderTopEndRadius="large"
      UNSAFE_className={css({
        counterReset: placeholderCounter,
      })}
    >
      {/* Reset article styles */}
      <ClearSlots>{children}</ClearSlots>
    </Box>
  );
}

export function ReactLive(props: {
  content: string;
  live: LiveCodeInfo;
}): JSX.Element {
  return (
    <Flex
      backgroundColor="surface"
      border="muted"
      borderRadius="large"
      direction="column"
    >
      <RenderedCodeExample>
        <RenderLiveCode
          code={props.live.code}
          scope={eagerScope}
          location={props.live.location}
        />
      </RenderedCodeExample>

      <SnippetController
        exampleType={props.live.exampleType}
        code={props.content}
      >
        <Flex
          elementType="pre"
          borderRadius="medium"
          maxWidth="100%"
          overflow="auto"
          paddingBottom="medium"
          paddingX="large"
          UNSAFE_className={css({
            color: tokenSchema.color.foreground.neutralEmphasis,
            fontFamily: tokenSchema.typography.fontFamily.code,
            fontSize: '0.85em',
            lineHeight: tokenSchema.typography.lineheight.medium,

            code: {
              fontFamily: 'inherit',
            },
          })}
        >
          <Highlight code={props.content} language="jsx" />
        </Flex>
      </SnippetController>
    </Flex>
  );
}

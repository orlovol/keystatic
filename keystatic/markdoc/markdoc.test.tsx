/** @jest-environment jsdom */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, makeEditor } from '../DocumentEditor/tests/utils';
import { component, fields } from '../DocumentEditor/component-blocks/api';
import { toMarkdocDocument } from './to-markdoc';
import { fromMarkdoc as _fromMarkdoc } from './from-markdoc';
import { Node } from 'slate';
import { ElementFromValidation } from '../structure-validation';
import Markdoc from '@markdoc/markdoc';

const componentBlocks = {
  'block-child': component({
    label: 'Block Child',
    preview: () => null,
    schema: {
      child: fields.child({ kind: 'block', placeholder: 'Content...' }),
    },
  }),
  'inline-child': component({
    label: 'Inline Child',
    preview: () => null,
    schema: {
      child: fields.child({ kind: 'inline', placeholder: 'Content...' }),
    },
  }),
  'related-links': component({
    label: 'Related Links',
    preview: () => null,
    schema: {
      links: fields.array(
        fields.object({
          heading: fields.text({ label: 'Heading' }),
          content: fields.child({ kind: 'inline', placeholder: 'Content...' }),
          href: fields.text({ label: 'Link' }),
        }),
        {
          asChildTag: 'related-link',
        }
      ),
    },
  }),
};

function toMarkdoc(node: Node) {
  const { children } = makeEditor(node);
  return Markdoc.format(
    Markdoc.parse(
      Markdoc.format(toMarkdocDocument(children as ElementFromValidation[], componentBlocks))
    )
  );
}

function fromMarkdoc(markdoc: string) {
  return makeEditor(<editor>{_fromMarkdoc(Markdoc.parse(markdoc), componentBlocks)}</editor>);
}

test('basic', () => {
  expect(
    toMarkdoc(
      <editor>
        <paragraph>
          <text>Something</text>
        </paragraph>
        <heading level={1}>
          <text>Heading</text>
        </heading>
        <paragraph>
          <text />
        </paragraph>
      </editor>
    )
  ).toMatchInlineSnapshot(`
    "Something

    # Heading
    "
  `);
});

test('inline code', () => {
  const markdoc = toMarkdoc(
    <editor>
      <paragraph>
        <text>Something</text>
      </paragraph>
      <heading level={1}>
        <text>Heading</text>
      </heading>
      <paragraph>
        <text code>a</text>
      </paragraph>
    </editor>
  );
  expect(markdoc).toMatchInlineSnapshot(`
    "Something

    # Heading

    \`a\`
    "
  `);
  expect(fromMarkdoc(markdoc)).toMatchInlineSnapshot(`
    <editor>
      <paragraph>
        <text>
          Something
        </text>
      </paragraph>
      <heading
        level={1}
      >
        <text>
          Heading
        </text>
      </heading>
      <paragraph>
        <text
          code={true}
        >
          a
        </text>
      </paragraph>
    </editor>
  `);
});
test('component block with block child', () => {
  expect(
    toMarkdoc(
      <editor>
        <component-block component="block-child" props={{ child: null }}>
          <component-block-prop propPath={['child']}>
            <paragraph>
              <text>Content</text>
            </paragraph>
          </component-block-prop>
        </component-block>
        <paragraph>
          <text />
        </paragraph>
      </editor>
    )
  ).toMatchInlineSnapshot(`
    "{% block-child %}
    Content
    {% /block-child %}
    "
  `);
});

test('component block with inline child', () => {
  expect(
    toMarkdoc(
      <editor>
        <component-block component="inline-child" props={{ child: null }}>
          <component-inline-prop propPath={['child']}>
            <text>Content</text>
          </component-inline-prop>
        </component-block>
        <paragraph>
          <text />
        </paragraph>
      </editor>
    )
  ).toMatchInlineSnapshot(`
    "{% inline-child %}Content{% /inline-child %}
    "
  `);
});

test('component block array with child field and data', () => {
  const markdoc = toMarkdoc(
    <editor>
      <component-block
        component="related-links"
        props={{
          links: [
            { heading: 'a', href: 'https://example.com/a', content: null },
            { heading: 'b', href: 'https://example.com/b', content: null },
            { heading: 'c', href: 'https://example.com/c', content: null },
          ],
        }}
      >
        <component-inline-prop propPath={['links', 0, 'content']}>
          <text>A content</text>
        </component-inline-prop>
        <component-inline-prop propPath={['links', 1, 'content']}>
          <text>B content</text>
        </component-inline-prop>
        <component-inline-prop propPath={['links', 2, 'content']}>
          <text>C content</text>
        </component-inline-prop>
      </component-block>
      <paragraph>
        <text />
      </paragraph>
    </editor>
  );
  expect(markdoc).toMatchInlineSnapshot(`
    "{% related-links %}
    {% related-link heading="a" href="https://example.com/a" %}A content{% /related-link %}

    {% related-link heading="b" href="https://example.com/b" %}B content{% /related-link %}

    {% related-link heading="c" href="https://example.com/c" %}C content{% /related-link %}
    {% /related-links %}
    "
  `);
  expect(fromMarkdoc(markdoc)).toMatchInlineSnapshot(`
    <editor>
      <component-block
        component="related-links"
        props={
          {
            "links": [
              {
                "heading": "a",
                "href": "https://example.com/a",
              },
              {
                "heading": "b",
                "href": "https://example.com/b",
              },
              {
                "heading": "c",
                "href": "https://example.com/c",
              },
            ],
          }
        }
      >
        <component-inline-prop
          propPath={
            [
              "links",
              0,
              "content",
            ]
          }
        >
          <text>
            A content
          </text>
        </component-inline-prop>
        <component-inline-prop
          propPath={
            [
              "links",
              1,
              "content",
            ]
          }
        >
          <text>
            B content
          </text>
        </component-inline-prop>
        <component-inline-prop
          propPath={
            [
              "links",
              2,
              "content",
            ]
          }
        >
          <text>
            C content
          </text>
        </component-inline-prop>
      </component-block>
      <paragraph>
        <text />
      </paragraph>
    </editor>
  `);
});

test('array parsing', () => {
  const markdoc = `Something

{% related-links %}
{% related-link heading="something" href="https://example.com" %}some content{% /related-link %}
{% /related-links %}`;
  expect(fromMarkdoc(markdoc)).toMatchInlineSnapshot(`
    <editor>
      <paragraph>
        <text>
          Something
        </text>
      </paragraph>
      <component-block
        component="related-links"
        props={
          {
            "links": [
              {
                "heading": "something",
                "href": "https://example.com",
              },
            ],
          }
        }
      >
        <component-inline-prop
          propPath={
            [
              "links",
              0,
              "content",
            ]
          }
        >
          <text>
            some content
          </text>
        </component-inline-prop>
      </component-block>
      <paragraph>
        <text />
      </paragraph>
    </editor>
  `);
});

import Markdoc, { type Config, type Node, type RenderableTreeNode, Tag } from '@markdoc/markdoc';
import React from 'react';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import python from 'highlight.js/lib/languages/python';
import sql from 'highlight.js/lib/languages/sql';
import json from 'highlight.js/lib/languages/json';
import xml from 'highlight.js/lib/languages/xml';
import bash from 'highlight.js/lib/languages/bash';
import csharp from 'highlight.js/lib/languages/csharp';
import powershell from 'highlight.js/lib/languages/powershell';
import r from 'highlight.js/lib/languages/r';
import { slugify, textOf } from './content';
import { CopyButton } from '@/components/CopyButton';

for (const [n, l] of Object.entries({ javascript, typescript, python, sql, json, xml, bash, csharp, powershell, r })) hljs.registerLanguage(n, l);
hljs.registerAliases(['js'], { languageName: 'javascript' });
hljs.registerAliases(['ts'], { languageName: 'typescript' });
hljs.registerAliases(['html'], { languageName: 'xml' });
hljs.registerAliases(['sh', 'shell'], { languageName: 'bash' });
hljs.registerAliases(['ps1'], { languageName: 'powershell' });

/** Markdoc config: heading ids (for the table of contents) and a callout tag. */
export const markdocConfig: Config = {
  nodes: {
    fence: { render: 'Fence', attributes: { content: { type: String }, language: { type: String } } },
    heading: {
      ...Markdoc.nodes.heading,
      transform(node: Node, config: Config) {
        const children = node.transformChildren(config);
        const id = slugify(textOf(node));
        return new Tag(`h${node.attributes.level}`, { id }, children);
      },
    },
  },
  tags: {
    callout: {
      render: 'Callout',
      attributes: { type: { type: String, default: 'note' } },
    },
  },
};

function Callout({ type, children }: { type?: string; children?: React.ReactNode }) {
  return <aside className={`callout ${type === 'warning' ? 'warning' : ''}`} role="note">{children}</aside>;
}

function Fence({ content, language }: { content: string; language?: string }) {
  const code = content.replace(/\n$/, '');
  const known = language && hljs.getLanguage(language);
  const html = known ? hljs.highlight(code, { language }).value : null;
  return (
    <div className="codeblock">
      <div className="codeblock-bar">{language && <span>{language}</span>}<CopyButton code={code} /></div>
      <pre tabIndex={0}>{html ? <code className="hljs" dangerouslySetInnerHTML={{ __html: html }} /> : <code>{code}</code>}</pre>
    </div>
  );
}

export function renderMarkdoc(content: RenderableTreeNode) {
  return Markdoc.renderers.react(content, React, { components: { Callout, Fence } });
}

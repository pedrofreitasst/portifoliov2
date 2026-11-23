'use client';

import React, { type ReactNode } from 'react';
import { translateCaseCopy } from '@/lib/caseCopy';
import type { Locale } from '@/lib/i18n';

const COPY_PROPS = new Set(['alt', 'caption', 'description', 'label']);

function localizeValue(value: unknown, locale: Locale, key = ''): unknown {
  if (typeof value === 'string') return COPY_PROPS.has(key) ? translateCaseCopy(locale, value) : value;
  if (Array.isArray(value)) return value.map((item) => localizeValue(item, locale));
  if (!value || typeof value !== 'object' || React.isValidElement(value)) return value;

  const result: Record<string, unknown> = {};
  for (const [childKey, childValue] of Object.entries(value)) {
    result[childKey] = localizeValue(childValue, locale, childKey);
  }
  return result;
}

function localizeNode(node: ReactNode, locale: Locale): ReactNode {
  if (typeof node === 'string') {
    if (!node.trim()) return node;
    const leading = node.match(/^\s*/)?.[0] ?? '';
    const trailing = node.match(/\s*$/)?.[0] ?? '';
    const content = node.trim();
    return `${leading}${translateCaseCopy(locale, content)}${trailing}`;
  }
  if (Array.isArray(node)) return node.map((child) => localizeNode(child, locale));
  if (!React.isValidElement<Record<string, unknown>>(node)) return node;

  const nextProps: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(node.props)) {
    if (key === 'children') nextProps.children = localizeNode(value as ReactNode, locale);
    else nextProps[key] = localizeValue(value, locale, key);
  }
  return React.cloneElement(node, nextProps);
}

export default function LocalizedCaseContent({ locale, children }: { locale: Locale; children: ReactNode }) {
  return localizeNode(children, locale);
}

import React from 'react';

interface QuoteBlockProps {
  label?: string;
  children: React.ReactNode;
}

export default function QuoteBlock({ label = '大白话', children }: QuoteBlockProps) {
  return (
    <div className="quote-block">
      <div className="quote-block__label">{label}</div>
      <div className="quote-block__body">{children}</div>
    </div>
  );
}

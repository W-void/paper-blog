import React from 'react';

interface SummaryBoxProps {
  title?: string;
  children: React.ReactNode;
}

export default function SummaryBox({ title = '小结', children }: SummaryBoxProps) {
  return (
    <div className="summary-box">
      <div className="summary-box__title">{title}</div>
      <div className="summary-box__body">{children}</div>
    </div>
  );
}

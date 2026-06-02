import React from 'react';

interface CompareGridProps {
  oldLabel?: string;
  newLabel?: string;
  oldContent: React.ReactNode;
  newContent: React.ReactNode;
}

export default function CompareGrid({
  oldLabel = '之前',
  newLabel = '之后',
  oldContent,
  newContent,
}: CompareGridProps) {
  return (
    <div className="compare-grid">
      <div className="compare-card compare-card--old">
        <div className="compare-card__label">{oldLabel}</div>
        <p>{oldContent}</p>
      </div>
      <div className="compare-card compare-card--new">
        <div className="compare-card__label">{newLabel}</div>
        <p>{newContent}</p>
      </div>
    </div>
  );
}

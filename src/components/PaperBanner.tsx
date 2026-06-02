import React from 'react';

interface Metric {
  num: string;
  label: string;
  color?: 'green' | 'red' | 'blue' | 'white';
}

interface PaperBannerProps {
  label?: string;
  title: string;
  subtitle?: string;
  metrics?: Metric[];
}

export default function PaperBanner({ label, title, subtitle, metrics }: PaperBannerProps) {
  return (
    <div className="paper-banner">
      {label && <div className="paper-banner__label">{label}</div>}
      <div className="paper-banner__title">{title}</div>
      {subtitle && <div className="paper-banner__subtitle">{subtitle}</div>}
      {metrics && metrics.length > 0 && (
        <div className="paper-banner__metrics">
          {metrics.map((m, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <span className={`paper-banner__metric-num${m.color ? ` paper-banner__metric-num--${m.color}` : ''}`}>
                {m.num}
              </span>
              <span className="paper-banner__metric-label">{m.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

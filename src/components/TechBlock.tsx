import React from 'react';

interface TechBlockProps {
  title?: string;
  children: React.ReactNode;
}

export default function TechBlock({ title, children }: TechBlockProps) {
  return (
    <div className="tech-block">
      {title && <div className="tech-block__title">{title}</div>}
      <div className="tech-block__body">{children}</div>
    </div>
  );
}

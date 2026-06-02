import React from 'react';

interface PaperCardProps {
  title: string;
  org: string;
  date: string;
  link: string;
}

export default function PaperCard({ title, org, date, link }: PaperCardProps) {
  return (
    <div className="paper-card">
      <div className="paper-card__title">论文信息</div>
      <div className="paper-card__row"><strong>标题：</strong>{title}</div>
      <div className="paper-card__row"><strong>机构：</strong>{org}</div>
      <div className="paper-card__row"><strong>时间：</strong>{date}</div>
      <div className="paper-card__row">
        <strong>链接：</strong>
        <a href={link.startsWith('http') ? link : `https://${link}`} target="_blank" rel="noopener noreferrer">
          {link}
        </a>
      </div>
    </div>
  );
}

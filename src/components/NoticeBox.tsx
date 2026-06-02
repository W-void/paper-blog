import React from 'react';

interface NoticeBoxProps {
  children: React.ReactNode;
}

export default function NoticeBox({ children }: NoticeBoxProps) {
  return (
    <div className="notice-box">
      <div className="notice-box__body">{children}</div>
    </div>
  );
}

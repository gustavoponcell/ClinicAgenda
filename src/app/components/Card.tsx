import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export function Card({ children, className = '', onClick, hover = false }: CardProps) {
  const hoverClass = hover ? 'hover:shadow-xl hover:scale-[1.01] cursor-pointer' : '';

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl shadow-sm border border-[#DDE2E8] p-6 transition-all duration-300 ${hoverClass} ${className}`}
    >
      {children}
    </div>
  );
}

import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md active:scale-95 flex items-center justify-center';

  const variants = {
    primary: 'bg-[#2E7D9A] hover:bg-[#236A84] text-white',
    secondary: 'bg-[#F5F7FA] hover:bg-[#E8EBF0] text-[#2C3E50] border border-[#DDE2E8]',
    outline: 'border-2 border-[#2E7D9A] text-[#2E7D9A] hover:bg-[#E3F2F7]',
    danger: 'bg-[#E57373] hover:bg-[#D85454] text-white',
    success: 'bg-[#4CAF93] hover:bg-[#3D9278] text-white',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3.5 text-base',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

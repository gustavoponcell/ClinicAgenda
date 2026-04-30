import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block mb-2 text-[#2C3E50] font-medium">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-3 bg-[#F5F7FA] border border-[#DDE2E8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2E7D9A] focus:border-[#2E7D9A] focus:bg-white transition-all ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-[#E57373]">{error}</p>}
    </div>
  );
}

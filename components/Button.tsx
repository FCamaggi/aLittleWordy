import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "px-6 py-2 rounded-xl font-bold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none shadow-sm";
  
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 border-b-4 border-indigo-800 active:border-b-0 active:translate-y-1",
    secondary: "bg-white text-slate-700 hover:bg-slate-50 border-b-4 border-slate-200 active:border-b-0 active:translate-y-1",
    danger: "bg-red-500 text-white hover:bg-red-600 border-b-4 border-red-700 active:border-b-0 active:translate-y-1",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-800"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

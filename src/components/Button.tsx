import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'tertiary';
};

export const Button = ({ variant = 'primary', className, children, ...props }: ButtonProps) => {
  const baseStyles = 'rounded-full px-7 py-3 text-sm md:text-base font-semibold transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-[#FF6B00] text-white shadow-[0_4px_14px_0_rgba(255,107,0,0.39)] hover:shadow-[0_6px_20px_rgba(255,107,0,0.45)]',
    secondary: 'bg-white text-[#FF6B00] border-2 border-[#FF6B00] hover:bg-[#FFF5F0]',
    tertiary: 'bg-white text-slate-900 shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:bg-slate-50'
  };

  return (
    <motion.button 
      whileHover={props.disabled ? undefined : { scale: 1.02 }}
      whileTap={props.disabled ? undefined : { scale: 0.98 }}
      className={cn(baseStyles, variants[variant], className)}
      {...props as any}
    >
      {children}
    </motion.button>
  );
};

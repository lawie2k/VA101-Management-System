import React from "react";

export function PCard({ className = "", children }: { className?: string; children: React.ReactNode }) {
  const hasPaddingClass = /\bp-/.test(className);
  return (
    <div className={`bg-white border border-slate-200 rounded-3xl ${hasPaddingClass ? "" : "p-6"} shadow-xs transition-all duration-300 ${className}`}>
      {children}
    </div>
  );
}

export function PCardHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-extrabold text-slate-900 text-base tracking-tight">{title}</h3>
      {action && <div className="flex items-center">{action}</div>}
    </div>
  );
}

export interface ButtonProps {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg" | "icon";
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  form?: string;
}

export function Button({ 
  variant = "primary", 
  size = "md",
  className = "", 
  children,
  onClick,
  type = "button",
  disabled = false,
  form
}: ButtonProps) {
  const baseStyle = "inline-flex items-center justify-center font-bold transition-all duration-300 rounded-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-[#E84E29] to-orange-500 hover:from-orange-600 hover:to-orange-500 text-white shadow-xs",
    secondary: "bg-slate-900 hover:bg-slate-800 text-white shadow-xs",
    outline: "border border-slate-200 bg-white hover:bg-slate-50 text-slate-700",
    ghost: "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
  };
 
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
    icon: "p-2"
  };
 
  return (
    <button 
      type={type}
      form={form}
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}

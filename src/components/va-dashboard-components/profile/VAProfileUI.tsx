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
  size?: "sm" | "md" | "lg";
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

export function Button({ 
  variant = "primary", 
  size = "md",
  className = "", 
  children,
  onClick,
  type = "button"
}: ButtonProps) {
  const baseStyle = "inline-flex items-center justify-center font-bold transition-all duration-300 rounded-full cursor-pointer";
  
  const variants = {
    primary: "bg-[#E84E29] hover:bg-[#DA431E] text-white shadow-xs",
    secondary: "bg-orange-600 hover:bg-orange-700 text-white shadow-xs",
    outline: "border border-slate-200 bg-white hover:bg-slate-55/70 text-slate-700",
    ghost: "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
  };
 
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-base"
  };
 
  return (
    <button 
      type={type}
      onClick={onClick} 
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}
 
export function CtaButton({ size = "md", className = "", children, onClick }: { size?: "sm" | "md"; className?: string; children: React.ReactNode; onClick?: () => void }) {
  return (
    <Button variant="primary" size={size} className={className} onClick={onClick}>
      {children}
    </Button>
  );
}
 
export function Badge({ children, className = "", variant = "default" }: { children: React.ReactNode; className?: string; variant?: "default" | "secondary" | "success" }) {
  const variants = {
    default: "bg-[#E84E29] text-white",
    secondary: "bg-slate-100 text-slate-650 border border-slate-200/50",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-100"
  };
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}

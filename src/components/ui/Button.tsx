import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "icon" | "outline";
  size?: "sm" | "md" | "lg" | "icon";
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "secondary", size = "md", children, ...props }, ref) => {
    
    const baseStyles = "inline-flex items-center justify-center font-bold transition-colors disabled:opacity-50 disabled:pointer-events-none";
    
    const variants = {
      primary: "bg-btn-main text-white hover:bg-btn-main-hover shadow-sm",
      secondary: "bg-page-bg text-text-main border border-border-default hover:bg-hover-bg hover:border-border-strong",
      danger: "bg-danger text-white hover:bg-danger-600 shadow-sm",
      ghost: "text-text-tertiary hover:text-text-main hover:bg-hover-bg",
      outline: "bg-surface-1 text-text-main border border-border-default hover:bg-hover-bg",
      icon: "text-text-tertiary hover:text-text-main hover:bg-hover-bg border border-transparent hover:border-border-default rounded-xl"
    };

    const sizes = {
      sm: "h-8 px-3 text-[13px] rounded-lg",
      md: "h-9 px-4 text-[13px] rounded-xl",
      lg: "h-10 px-5 text-[14px] rounded-xl",
      icon: "h-8 w-8 rounded-xl"
    };

    const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className || ""}`;

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

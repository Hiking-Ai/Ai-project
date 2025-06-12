// src/components/ui/Button.tsx
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost" | "outline";
}

export const Button: React.FC<ButtonProps> = ({
  variant = "default",
  className = "",
  ...props
}) => {
  const base =
    "px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

  const styles = {
    default: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-400",
    ghost: "bg-transparent text-green-700 hover:bg-green-100",
    outline:
      "border border-green-600 text-green-700 hover:bg-green-50 focus:ring-green-400",
  };

  return (
    <button className={`${base} ${styles[variant]} ${className}`} {...props} />
  );
};

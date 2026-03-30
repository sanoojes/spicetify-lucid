import type { ButtonProps } from "@/types/uiSchema.ts";
import React from "react";

const Button: React.FC<ButtonProps> = ({
  buttonText,
  children,
  onClick,
  className = "",
  variant = "default",
}) => {
  return (
    <button type="button" onClick={onClick} className={`lucid-button ${variant} ${className}`}>
      {buttonText}
      {children}
    </button>
  );
};

export default Button;

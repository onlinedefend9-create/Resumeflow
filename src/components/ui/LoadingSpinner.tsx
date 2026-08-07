import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  color?: string;
  className?: string;
  message?: string;
  fullPage?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  color = "text-blue-600",
  className = "",
  message,
  fullPage = false,
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-10 h-10",
    xl: "w-14 h-14",
  };

  const spinnerContent = (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`} id="loading-spinner-container">
      <Loader2
        className={`${sizeClasses[size]} animate-spin ${color}`}
        id="loading-spinner-icon"
      />
      {message && (
        <p className="text-sm font-medium text-zinc-500 animate-pulse text-center max-w-xs" id="loading-spinner-message">
          {message}
        </p>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn" id="loading-spinner-overlay">
        {spinnerContent}
      </div>
    );
  }

  return spinnerContent;
};

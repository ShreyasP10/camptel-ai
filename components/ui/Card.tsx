"use client";

import React from "react";

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  variant?: "default" | "glass" | "bordered";
}

export default function Card({
  children,
  title,
  subtitle,
  className = "",
  variant = "default",
}: CardProps) {
  const variants = {
    default:
      "bg-white border border-surface-200 shadow-sm hover:shadow-md",
    glass:
      "bg-white/80 border border-white/20 shadow-lg backdrop-blur-xl",
    bordered:
      "bg-white border-2 border-brand-100 shadow-sm",
  };

  return (
    <div
      className={`rounded-2xl transition-all duration-300 ${variants[variant]} ${className}`}
    >
      {title && (
        <div className="px-6 pt-6 pb-4">
          <h2 className="text-lg font-semibold text-surface-800">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-1 text-sm text-surface-400">{subtitle}</p>
          )}
        </div>
      )}
      <div className={title ? "px-6 pb-6" : "p-6"}>{children}</div>
    </div>
  );
}

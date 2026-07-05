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
      "bg-white border border-surface-200 shadow-sm hover:shadow-md dark:bg-dark-100 dark:border-dark-200 dark:hover:shadow-black/20",
    glass:
      "bg-white/80 border border-white/20 shadow-lg backdrop-blur-xl dark:bg-dark-100/80 dark:border-dark-200/20",
    bordered:
      "bg-white border-2 border-brand-100 shadow-sm dark:bg-dark-100 dark:border-brand-800",
  };

  return (
    <div
      className={`rounded-2xl transition-all duration-300 ${variants[variant]} ${className}`}
    >
      {title && (
        <div className="px-6 pt-6 pb-4">
          <h2 className="text-lg font-semibold text-surface-800 dark:text-dark-800 transition-colors">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-1 text-sm text-surface-400 dark:text-dark-500 transition-colors">
              {subtitle}
            </p>
          )}
        </div>
      )}
      <div className={title ? "px-6 pb-6" : "p-6"}>{children}</div>
    </div>
  );
}

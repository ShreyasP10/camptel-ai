import React from "react";

interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export default function Card({
  children,
  title,
  className = "",
}: CardProps) {
  return (
    <div
      className={`bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 p-6 ${className}`}
    >
      {title && (
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          {title}
        </h2>
      )}

      {children}
    </div>
  );
}
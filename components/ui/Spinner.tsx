interface SpinnerProps {
  size?: "sm" | "md" | "lg";
}

export default function Spinner({ size = "md" }: SpinnerProps) {
  const sizes = {
    sm: "h-5 w-5 border-2",
    md: "h-8 w-8 border-[3px]",
    lg: "h-12 w-12 border-4",
  };

  return (
    <div className="flex items-center justify-center py-4">
      <div
        className={`${sizes[size]} animate-spin rounded-full border-surface-200 border-t-brand-600 dark:border-dark-200 dark:border-t-brand-400`}
      />
    </div>
  );
}

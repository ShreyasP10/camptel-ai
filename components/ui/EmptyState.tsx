interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

export default function EmptyState({ title, description, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-surface-300 bg-surface-50 p-8 text-center dark:border-dark-200 dark:bg-dark-50 transition-colors duration-300">
      {icon && <div className="text-3xl">{icon}</div>}
      <p className="text-base font-semibold text-surface-700 dark:text-dark-700">{title}</p>
      {description && (
        <p className="max-w-sm text-sm text-surface-400 dark:text-dark-500">{description}</p>
      )}
    </div>
  );
}

interface ErrorCardProps {
  title: string;
  description?: string;
  onRetry?: () => void;
}

export default function ErrorCard({ title, description, onRetry }: ErrorCardProps) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
      <p className="text-lg font-semibold text-red-700">{title}</p>
      {description ? <p className="mt-2 text-sm text-red-600">{description}</p> : null}
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
        >
          Retry
        </button>
      ) : null}
    </div>
  );
}

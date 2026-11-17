"use client";

export function ConfirmForm({
  action,
  message,
  label,
}: {
  action: (formData: FormData) => void | Promise<void>;
  message: string;
  label: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm(message)) event.preventDefault();
      }}
    >
      <button
        type="submit"
        className="text-sm font-medium text-moss underline-offset-4 transition-colors duration-200 hover:text-ink hover:underline"
      >
        {label}
      </button>
    </form>
  );
}

export type Message =
  | { success: string }
  | { error: string }
  | { message: string };

export function parseFormMessage(
  searchParams?: Record<string, string | string[] | undefined>,
): Message | null {
  if (!searchParams) return null;

  const pick = (key: string) => {
    const value = searchParams[key];
    if (!value) return null;
    const normalized = Array.isArray(value) ? value[0] : value;
    return normalized ? String(normalized) : null;
  };

  const error = pick("error");
  if (error) return { error };

  const success = pick("success");
  if (success) return { success };

  const message = pick("message");
  if (message) return { message };

  return null;
}

export function FormMessage({ message }: { message?: Message | null }) {
  if (!message) return null;

  return (
    <div className="flex w-full max-w-md flex-col gap-2 text-sm">
      {"success" in message && (
        <div className="rounded-xs bg-emerald-100 p-1 px-4 text-center text-emerald-700">
          {message.success}
        </div>
      )}
      {"error" in message && (
        <div className="border-destructive-foreground border-l-2 px-4 text-red-500">
          {message.error}
        </div>
      )}
      {"message" in message && (
        <div className="rounded-xs bg-neutral-100 p-1 px-4 text-center text-black">
          {message.message}
        </div>
      )}
    </div>
  );
}

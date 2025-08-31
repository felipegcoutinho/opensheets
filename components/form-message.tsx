export type Message =
  | { success: string }
  | { error: string }
  | { message: string };

export function FormMessage({ message }: { message: Message }) {
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

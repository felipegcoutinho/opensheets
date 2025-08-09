export function hashPayload(input: unknown): string {
  const str = typeof input === "string" ? input : JSON.stringify(input);
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = (h * 33) ^ str.charCodeAt(i);
  return (h >>> 0).toString(36);
}

import { gabarito } from "@/app/fonts/font";

function Logo() {
  const open = "open";
  const sheets = (
    <span>
      sheets<span className="text-color-6">.</span>
    </span>
  );

  return (
    <div
      className={`${gabarito.className} flex items-center rounded-full border border-zinc-700 px-4 py-1 text-xl tracking-tighter text-zinc-700 dark:border-white dark:text-zinc-200`}
    >
      {open}
      {sheets}
    </div>
  );
}

export default Logo;

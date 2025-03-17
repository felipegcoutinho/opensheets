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
      className={`${gabarito.className} flex items-center px-4 py-1 text-2xl tracking-tighter text-zinc-800 dark:border-white dark:text-zinc-200`}
    >
      {open}
      {sheets}
    </div>
  );
}

export default Logo;

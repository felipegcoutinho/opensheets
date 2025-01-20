import { gabarito } from "@/app/fonts/font";

function Logo() {
  const open = "open";
  const sheets = <span className="font-bold">Sheets</span>;

  return (
    <div
      className={`${gabarito.className} text-color-1 flex w-28 items-center text-2xl tracking-tighter dark:text-white`}
    >
      <p>
        {open}
        {sheets}
      </p>
    </div>
  );
}

export default Logo;

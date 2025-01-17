import { merriweather } from "@/app/fonts/font";

function Logo() {
  const open = "open";
  const sheets = <span className="font-bold">Sheets</span>;

  return (
    <div
      className={`${merriweather.className} flex w-28 items-center text-xl tracking-tighter text-black dark:text-white`}
    >
      <p>
        {open}
        {sheets}
      </p>
    </div>
  );
}

export default Logo;

import { gabarito } from "@/app/fonts/font";

function Logo() {
  const open = "open";
  const sheets = <span className="font-bold">Sheets</span>;

  return (
    <div
      className={`${gabarito.className} flex items-center text-2xl tracking-tighter text-card-foreground`}
    >
      <p>
        {open}
        {sheets}
      </p>
    </div>
  );
}

export default Logo;

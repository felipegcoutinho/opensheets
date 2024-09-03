import { GeistMono } from "geist/font/mono";

function Logo() {
  return (
    <div className="outline outline-black py-1 px-2 rounded-sm">
      <span className={`${GeistMono.className} text-lg dark:text-white tracking-tighter`}>
        open<span className="font-bold">sheets</span>
      </span>
    </div>
  );
}

export default Logo;

import { GeistMono } from "geist/font/mono";

function Logo() {
  return (
    <div className={`${GeistMono.className} text-lg dark:text-white tracking-tighter`}>
      open<span className="font-bold">sheets</span>
    </div>
  );
}

export default Logo;

import Image from "next/image";

function Logo() {
  return (
    <div className="flex items-center gap-1 text-xl tracking-tighter text-black dark:text-white">
      <Image
        quality={100}
        src="/logo.png"
        alt="openSheets"
        width={32}
        height={32}
      />
      <span>
        open<span className="font-bold">sheets</span>
      </span>
    </div>
  );
}

export default Logo;

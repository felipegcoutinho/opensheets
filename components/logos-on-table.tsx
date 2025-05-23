import Image from "next/image";

export function LogosOnTable({ descricao, logo }) {
  return (
    <div className="flex items-center gap-2">
      <Image
        quality={100}
        src={`/logos/${logo}`}
        className="rounded-full border shadow-sm transition-transform hover:scale-105"
        width={32}
        height={32}
        alt="Logo do cartão"
      />
      <p>{descricao}</p>
    </div>
  );
}

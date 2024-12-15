import Image from "next/image";

export function LogosOnTable({ descricao, logo }) {
  return (
    <div className="flex items-center gap-2">
      <Image
        quality={100}
        src={`/logos/${logo}`}
        className="rounded-none-full"
        width={30}
        height={30}
        alt="Logo do cartão"
      />

      <p>{descricao}</p>
    </div>
  );
}

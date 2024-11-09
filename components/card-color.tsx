import Image from "next/image";

export function BadgeCardTable({ descricao, logo }) {
  return (
    <div className="flex items-center gap-2">
      <Image
        src={`/logos/${logo}`}
        className="rounded"
        width={30}
        height={30}
        alt="Logo do cartão"
      />

      <p>{descricao}</p>
    </div>
  );
}

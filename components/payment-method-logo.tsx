import Image from "next/image";

export function PaymentMethodLogo({ descricao, url_name, width, height }) {
  return (
    <div className="flex items-center gap-2">
      <Image
        src={`${url_name}`}
        className="rounded-xl shadow-sm transition-transform hover:scale-105"
        width={width}
        height={height}
        quality={100}
        alt="Logo do cartão ou conta"
      />
      <p>{descricao}</p>
    </div>
  );
}

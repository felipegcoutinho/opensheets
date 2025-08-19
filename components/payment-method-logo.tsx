import Image from "next/image";

type PaymentMethodLogoProps = {
  descricao: string;
  url_name: string;
  width: number;
  height: number;
};

export default function PaymentMethodLogo({
  descricao,
  url_name,
  width,
  height,
}: PaymentMethodLogoProps) {
  return (
    <div className="flex items-center gap-2">
      <Image
        src={`${url_name}`}
        className="rounded-lg transition-transform hover:scale-105"
        width={width}
        height={height}
        quality={100}
        alt="Logo do cartão ou conta"
      />
      <p>{descricao}</p>
    </div>
  );
}

import Image from "next/image";

interface EmptyCardProps {
  width?: number;
  height?: number;
  message?: string;
  illustrationSrc?: string;
}

export default function EmptyCard({
  width = 160,
  height = 160,
  illustrationSrc = "/empty_image.svg",
}: EmptyCardProps) {
  return (
    <div className="mx-auto flex flex-col items-center justify-center p-6">
      <Image
        src={illustrationSrc}
        alt="Imagem de ilustração"
        width={width}
        height={height}
        priority
        className="mb-4"
      />
      <p className="text-muted-foreground px-4 text-center">
        Sem dados para exibir no período selecionado.
      </p>
    </div>
  );
}

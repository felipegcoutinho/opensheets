import Image from "next/image";

interface EmptyCardProps {
  width?: number;
  height?: number;
  message?: string;
  illustrationSrc?: string;
}

export default function EmptyCard({
  width = 180,
  height = 180,
  message = "Sem dados encontrados",
  illustrationSrc = "/undraw_empty.svg",
}: EmptyCardProps) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center p-6">
      <Image
        src={illustrationSrc}
        alt={message}
        width={width}
        height={height}
        quality={100}
        priority
        className="mb-4 select-none"
      />
      <p className="text-muted-foreground px-4 text-center text-sm font-medium">
        {message}
      </p>
    </div>
  );
}

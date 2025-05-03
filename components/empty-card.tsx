import Image from "next/image";

function EmptyCard({
  width = 180,
  height = 180,
  message = "Sem dados encontrados",
  illustrationSrc = "/undraw_empty.svg",
}) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center p-6">
      <div className="mb-4">
        <Image
          src={illustrationSrc}
          alt="Sem dados encontrados"
          width={width}
          height={height}
          quality={100}
          priority
          className="select-none"
        />
      </div>
      <p className="text-muted-foreground px-4 text-center text-sm font-medium">
        {message}
      </p>
    </div>
  );
}

export default EmptyCard;

import Image from "next/image";

function EmptyCard({
  width = 200,
  height = 200,
  message = "Sem dados encontrados",
  illustrationSrc = "/undraw_empty.svg",
}) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center p-6">
      <div className="mb-4 opacity-80">
        <Image
          src={illustrationSrc}
          alt="Empty state illustration"
          width={width}
          height={height}
          quality={100}
          priority
          className="select-none"
        />
      </div>
      <p className="px-4 text-center text-base font-medium text-gray-600">
        {message}
      </p>
    </div>
  );
}

export default EmptyCard;

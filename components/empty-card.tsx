import empty from "@/public/undraw_empty.svg";
import Image from "next/image";

function EmptyCard({ width, height }) {
  return (
    <div className="flex h-60 flex-col items-center justify-center">
      <Image
        quality={100}
        src={empty}
        alt="Empty"
        width={width}
        height={height}
      />
      <p className="mt-2 text-sm text-muted-foreground">
        Sem dados encontrados
      </p>
    </div>
  );
}

export default EmptyCard;

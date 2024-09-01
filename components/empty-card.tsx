import empty from "@/public/undraw_empty.svg";
import Image from "next/image";

function EmptyCard({ width, height }) {
  return (
    <div className="flex flex-col items-center justify-center h-60">
      <Image src={empty} alt="Empty" width={width} height={height} />
    </div>
  );
}

export default EmptyCard;

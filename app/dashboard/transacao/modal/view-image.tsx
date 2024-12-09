import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";

function ViewImage({ itemImagemURL }) {
  return (
    <Dialog>
      <DialogTrigger>
        {itemImagemURL && (
          <Image
            src={itemImagemURL}
            alt="Comprovante"
            width={200}
            height={200}
            className="h-20 w-full rounded object-cover brightness-75 transition-all duration-300 hover:scale-105"
          />
        )}
      </DialogTrigger>
      <DialogContent className="p-0">
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogDescription>
            <Image
              src={itemImagemURL}
              alt="Comprovante"
              width={200}
              height={200}
              className="h-max w-full object-cover"
            />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default ViewImage;

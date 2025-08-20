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
          <img
            src={itemImagemURL}
            alt="Comprovante"
            className="h-20 w-full rounded object-cover transition-all duration-300 hover:scale-105"
          />
        )}
      </DialogTrigger>
      <DialogContent className="p-0">
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogDescription>
            <Image
              width={500}
              height={500}
              src={itemImagemURL}
              alt="Comprovante"
              className="h-screen w-full"
            />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default ViewImage;

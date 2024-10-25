import { uiSans } from "@/app/fonts/font";

function Numbers({ number }) {
  return (
    <span className={`${uiSans.className} font-bold`}>
      {Number(number).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })}
    </span>
  );
}

export default Numbers;

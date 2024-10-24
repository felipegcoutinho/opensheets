import { inter } from "@/app/fonts/font";

function Numbers({ number }) {
  return (
    <span className={`${inter.className} font-bold -tracking-wider`}>
      {Number(number).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })}
    </span>
  );
}

export default Numbers;

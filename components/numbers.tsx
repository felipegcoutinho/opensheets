import { GeistMono } from "geist/font/mono";

function Numbers({ number }) {
  return (
    <span className={`${GeistMono.className} tracking-tighter`}>
      {Number(number).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
    </span>
  );
}

export default Numbers;

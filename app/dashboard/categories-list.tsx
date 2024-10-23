import EmptyCard from "@/components/empty-card";
import Numbers from "@/components/numbers";
import Link from "next/link";

export default function CategoriesList({ data, month }) {
  // Ordena os itens pelo valor de 'sum' de forma decrescente
  const sortedData = [...data].sort((a, b) => b.sum - a.sum);

  return (
    <>
      {sortedData.length > 0 ? (
        sortedData.map((item, index) => (
          <div key={index} className="flex items-center justify-between py-1">
            <Link
              href={`/transacao/${item.categoria.toLowerCase()}/${item.tipo_transacao.toLowerCase()}?periodo=${month}`}
            >
              <p>{item.categoria}</p>
            </Link>

            <p className="text-muted-foreground">
              <Numbers number={item.sum} />
            </p>
          </div>
        ))
      ) : (
        <EmptyCard width={100} height={100} />
      )}
    </>
  );
}

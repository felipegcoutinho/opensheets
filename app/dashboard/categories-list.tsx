import EmptyCard from "@/components/empty-card";
import Numbers from "@/components/numbers";
import { ArrowUpRight } from "lucide-react";
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
              className="flex items-center gap-1"
              href={`/transacao/${encodeURIComponent(item.categoria.toLowerCase())}/${encodeURIComponent(item.tipo_transacao.toLowerCase())}?periodo=${month}`}
            >
              <p>{item.categoria}</p>
              <ArrowUpRight className="h-3 w-3 text-muted-foreground" />
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

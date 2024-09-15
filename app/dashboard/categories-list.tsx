import EmptyCard from "@/components/empty-card";
import Numbers from "@/components/numbers";

export default function CategoriesList({ data }) {
  return (
    <>
      {data.length > 0 ? (
        data.map((item, index) => (
          <div key={index} className="flex items-center justify-between py-1">
            <p>{item.categoria}</p>
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

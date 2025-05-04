import MoneyValues from "@/components/money-values";

function BalanceItem({ label, value }) {
  return (
    <>
      <p className="text-muted-foreground text-xs uppercase">{label}</p>
      <p className="text-xl font-bold">
        <MoneyValues value={value} />
      </p>
    </>
  );
}

export default BalanceItem;

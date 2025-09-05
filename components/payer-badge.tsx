import { Badge } from "./ui/badge";

function PayerBadge({ label, color }: { label: string; color: string }) {
  return (
    <Badge variant="outline" className="gap-1.5 capitalize">
      <span
        className={`${color} size-1.5 rounded-full`}
        aria-hidden="true"
      ></span>
      {label}
    </Badge>
  );
}

export default PayerBadge;

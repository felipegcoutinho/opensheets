"use client";

export default function InfoSection({ title, value, subtitle, subvalue }) {
  return (
    <div className="leading-loose">
      <p className="text-muted-foreground text-xs">{title}</p>
      <p>{value}</p>
      <p className="text-muted-foreground text-xs">{subtitle}</p>
      <p>{subvalue}</p>
    </div>
  );
}

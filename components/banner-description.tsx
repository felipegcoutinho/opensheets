import React from "react";
import MonthPicker from "./month-picker/month-picker";

function BannerDescription({
  title,
  subtitle,
  showMonthPicker,
  children,
}: {
  title: string;
  subtitle: string;
  showMonthPicker: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <header className="bg-contrast-foreground/10 mb-2 rounded p-8">
        <p className="max-w-2xl text-sm">{subtitle}</p>
      </header>

      <section hidden={!showMonthPicker}>
        <MonthPicker />
      </section>

      <main>{children}</main>
    </div>
  );
}

export default BannerDescription;

import React from "react";

function BannerDescription({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <header className="bg-contrast-foreground/10 mb-2 rounded p-8">
        <p className="max-w-2xl text-sm">{subtitle}</p>
      </header>

      <main>{children}</main>
    </div>
  );
}

export default BannerDescription;

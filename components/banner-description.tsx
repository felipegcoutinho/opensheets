import { RiInformation2Line } from "@remixicon/react";
import React from "react";
import { Card } from "./ui/card";

type BannerDescriptionProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

export default function BannerDescription({
  title,
  subtitle,
  children,
}: BannerDescriptionProps) {
  return (
    <div>
      <Card className="bg-chart-3/40 mb-2 border-none p-8">
        <p className="max-w-2xl text-sm">
          <RiInformation2Line size={24} className="mr-2 inline-block" />
          {subtitle}
        </p>
      </Card>

      <main>{children}</main>
    </div>
  );
}
